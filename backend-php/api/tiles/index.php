<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

setCorsHeaders();

try {
    $db = Database::getInstance()->getConnection();
    
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            handleGetTiles($db);
            break;
            
        case 'POST':
            requireAuth();
            handleCreateTile($db);
            break;
            
        case 'PUT':
            requireAuth();
            handleUpdateTile($db);
            break;
            
        case 'DELETE':
            requireAuth();
            handleDeleteTile($db);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

function handleGetTiles($db) {
    $page = intval($_GET['page'] ?? 1);
    $limit = intval($_GET['limit'] ?? 20);
    $offset = ($page - 1) * $limit;
    
    $search = $_GET['search'] ?? '';
    $type = $_GET['type'] ?? '';
    $category = $_GET['category'] ?? '';
    $showInactive = $_GET['showInactive'] ?? 'false';
    
    $where = [];
    $params = [];
    
    if ($search) {
        $where[] = "(series LIKE ? OR material LIKE ? OR searchTerms LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    if ($type) {
        $where[] = "type = ?";
        $params[] = $type;
    }
    
    if ($category) {
        $where[] = "category = ?";
        $params[] = $category;
    }
    
    if ($showInactive !== 'true') {
        $where[] = "isActive = 1";
    }
    
    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    // Get total count
    $countSql = "SELECT COUNT(*) FROM tiles $whereClause";
    $stmt = $db->prepare($countSql);
    $stmt->execute($params);
    $total = $stmt->fetchColumn();
    
    // Get tiles
    $sql = "SELECT * FROM tiles $whereClause ORDER BY updatedAt DESC LIMIT $limit OFFSET $offset";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $tiles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert JSON strings back to arrays
    foreach ($tiles as &$tile) {
        $tile['application'] = json_decode($tile['application'], true);
        if ($tile['images']) {
            $tile['images'] = json_decode($tile['images'], true);
        }
        $tile['isActive'] = (bool) $tile['isActive'];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $tiles,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => intval($total),
            'pages' => ceil($total / $limit)
        ]
    ]);
}

function handleCreateTile($db) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required = ['type', 'size', 'series', 'material', 'surface', 'qty', 'proposedSP', 'category'];
    foreach ($required as $field) {
        if (!isset($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Field '$field' is required"]);
            return;
        }
    }
    
    $sql = "INSERT INTO tiles (
        type, size, series, material, surface, qty, proposedSP, category,
        application, peiRating, thickness, finish, image, images,
        searchTerms, description, isActive, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $input['type'],
        $input['size'],
        $input['series'],
        $input['material'],
        $input['surface'],
        intval($input['qty']),
        floatval($input['proposedSP']),
        $input['category'],
        json_encode($input['application'] ?? []),
        $input['peiRating'] ?? 'Class 4',
        $input['thickness'] ?? '9mm',
        $input['finish'] ?? 'Unglazed Matt',
        $input['image'] ?? '',
        json_encode($input['images'] ?? []),
        strtolower($input['series'] . ' ' . $input['material'] . ' ' . $input['category']),
        $input['description'] ?? $input['series'] . ' - ' . $input['category'] . ' tile',
        isset($input['isActive']) ? ($input['isActive'] ? 1 : 0) : 1
    ]);
    
    $tileId = $db->lastInsertId();
    
    // Log the action
    $logStmt = $db->prepare("INSERT INTO audit_log (action, entity, entityId, changes) VALUES (?, ?, ?, ?)");
    $logStmt->execute(['CREATE', 'TILE', $tileId, json_encode($input)]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Tile created successfully',
        'id' => $tileId
    ]);
}

function handleUpdateTile($db) {
    $tileId = $_GET['id'] ?? null;
    if (!$tileId) {
        http_response_code(400);
        echo json_encode(['error' => 'Tile ID is required']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $fields = [];
    $params = [];
    
    $allowedFields = ['type', 'size', 'series', 'material', 'surface', 'qty', 'proposedSP', 
                     'category', 'application', 'peiRating', 'thickness', 'finish', 
                     'image', 'images', 'description', 'isActive'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            if (in_array($field, ['application', 'images'])) {
                $fields[] = "$field = ?";
                $params[] = json_encode($input[$field]);
            } elseif ($field === 'isActive') {
                $fields[] = "$field = ?";
                $params[] = $input[$field] ? 1 : 0;
            } else {
                $fields[] = "$field = ?";
                $params[] = $input[$field];
            }
        }
    }
    
    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update']);
        return;
    }
    
    $fields[] = "updatedAt = CURRENT_TIMESTAMP";
    $params[] = $tileId;
    
    $sql = "UPDATE tiles SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    // Log the action
    $logStmt = $db->prepare("INSERT INTO audit_log (action, entity, entityId, changes) VALUES (?, ?, ?, ?)");
    $logStmt->execute(['UPDATE', 'TILE', $tileId, json_encode($input)]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Tile updated successfully'
    ]);
}

function handleDeleteTile($db) {
    $tileId = $_GET['id'] ?? null;
    if (!$tileId) {
        http_response_code(400);
        echo json_encode(['error' => 'Tile ID is required']);
        return;
    }
    
    $stmt = $db->prepare("DELETE FROM tiles WHERE id = ?");
    $stmt->execute([$tileId]);
    
    // Log the action
    $logStmt = $db->prepare("INSERT INTO audit_log (action, entity, entityId, changes) VALUES (?, ?, ?, ?)");
    $logStmt->execute(['DELETE', 'TILE', $tileId, json_encode(['deleted' => true])]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Tile deleted successfully'
    ]);
}
?>