<?php
/**
 * Tiles CRUD operations
 */
require_once 'config.php';

setSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$db = Database::getInstance()->getConnection();

try {
    switch ($method) {
        case 'GET':
            handleGetTiles($db);
            break;
            
        case 'POST':
            $admin = requireAuth();
            handleCreateTile($db, $admin);
            break;
            
        case 'PUT':
            $admin = requireAuth();
            handleUpdateTile($db, $admin);
            break;
            
        case 'DELETE':
            $admin = requireAuth();
            handleDeleteTile($db, $admin);
            break;
            
        default:
            sendError('Method not allowed', 405);
    }
} catch (Exception $e) {
    error_log("Tiles API error: " . $e->getMessage());
    sendError('Server error', 500);
}

function handleGetTiles($db) {
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(100, max(1, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    
    $search = sanitizeInput($_GET['search'] ?? '');
    $type = sanitizeInput($_GET['type'] ?? '');
    $category = sanitizeInput($_GET['category'] ?? '');
    $showInactive = ($_GET['showInactive'] ?? 'false') === 'true';
    
    // Build WHERE clause
    $where = [];
    $params = [];
    
    if ($search) {
        $where[] = "(series LIKE ? OR material LIKE ? OR searchTerms LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
    }
    
    if ($type) {
        $where[] = "type = ?";
        $params[] = $type;
    }
    
    if ($category) {
        $where[] = "category = ?";
        $params[] = $category;
    }
    
    if (!$showInactive) {
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
    $tiles = $stmt->fetchAll();
    
    // Process application field (convert from JSON string to array)
    foreach ($tiles as &$tile) {
        $tile['application'] = json_decode($tile['application'], true) ?: [];
        $tile['isActive'] = (bool) $tile['isActive'];
        $tile['qty'] = (int) $tile['qty'];
        $tile['proposedSP'] = (float) $tile['proposedSP'];
    }
    
    sendResponse([
        'success' => true,
        'data' => $tiles,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => (int) $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

function handleCreateTile($db, $admin) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendError('Invalid JSON input');
    }
    
    // Required fields
    $required = ['type', 'size', 'series', 'material', 'surface', 'qty', 'proposedSP', 'category'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || trim($input[$field]) === '') {
            sendError("Field '$field' is required");
        }
    }
    
    // Sanitize inputs
    $data = [
        'type' => sanitizeInput($input['type']),
        'size' => sanitizeInput($input['size']),
        'series' => sanitizeInput($input['series']),
        'material' => sanitizeInput($input['material']),
        'surface' => sanitizeInput($input['surface']),
        'qty' => max(0, intval($input['qty'])),
        'proposedSP' => max(0, floatval($input['proposedSP'])),
        'category' => sanitizeInput($input['category']),
        'application' => json_encode($input['application'] ?? []),
        'peiRating' => sanitizeInput($input['peiRating'] ?? 'Class 4'),
        'thickness' => sanitizeInput($input['thickness'] ?? '9mm'),
        'finish' => sanitizeInput($input['finish'] ?? 'Unglazed Matt'),
        'image' => sanitizeInput($input['image'] ?? ''),
        'description' => sanitizeInput($input['description'] ?? ''),
        'isActive' => isset($input['isActive']) ? ($input['isActive'] ? 1 : 0) : 1
    ];
    
    // Generate search terms
    $data['searchTerms'] = strtolower($data['series'] . ' ' . $data['material'] . ' ' . $data['category']);
    
    $sql = "INSERT INTO tiles (
        type, size, series, material, surface, qty, proposedSP, category,
        application, peiRating, thickness, finish, image, searchTerms,
        description, isActive, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $data['type'], $data['size'], $data['series'], $data['material'],
        $data['surface'], $data['qty'], $data['proposedSP'], $data['category'],
        $data['application'], $data['peiRating'], $data['thickness'],
        $data['finish'], $data['image'], $data['searchTerms'],
        $data['description'], $data['isActive']
    ]);
    
    $tileId = $db->lastInsertId();
    
    // Log the action
    logAction('CREATE', 'TILE', $tileId, $input, $admin['admin_id']);
    
    sendResponse([
        'success' => true,
        'message' => 'Tile created successfully',
        'id' => (int) $tileId
    ], 201);
}

function handleUpdateTile($db, $admin) {
    $tileId = intval($_GET['id'] ?? 0);
    if (!$tileId) {
        sendError('Tile ID is required');
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        sendError('Invalid JSON input');
    }
    
    // Check if tile exists
    $stmt = $db->prepare("SELECT id FROM tiles WHERE id = ?");
    $stmt->execute([$tileId]);
    if (!$stmt->fetch()) {
        sendError('Tile not found', 404);
    }
    
    $fields = [];
    $params = [];
    
    $allowedFields = ['type', 'size', 'series', 'material', 'surface', 'qty', 'proposedSP', 
                     'category', 'application', 'peiRating', 'thickness', 'finish', 
                     'image', 'description', 'isActive'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            if ($field === 'application') {
                $fields[] = "$field = ?";
                $params[] = json_encode($input[$field]);
            } elseif ($field === 'isActive') {
                $fields[] = "$field = ?";
                $params[] = $input[$field] ? 1 : 0;
            } elseif (in_array($field, ['qty', 'proposedSP'])) {
                $fields[] = "$field = ?";
                $params[] = $field === 'qty' ? max(0, intval($input[$field])) : max(0, floatval($input[$field]));
            } else {
                $fields[] = "$field = ?";
                $params[] = sanitizeInput($input[$field]);
            }
        }
    }
    
    if (empty($fields)) {
        sendError('No valid fields to update');
    }
    
    $fields[] = "updatedAt = CURRENT_TIMESTAMP";
    $params[] = $tileId;
    
    $sql = "UPDATE tiles SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    // Log the action
    logAction('UPDATE', 'TILE', $tileId, $input, $admin['admin_id']);
    
    sendResponse([
        'success' => true,
        'message' => 'Tile updated successfully'
    ]);
}

function handleDeleteTile($db, $admin) {
    $tileId = intval($_GET['id'] ?? 0);
    if (!$tileId) {
        sendError('Tile ID is required');
    }
    
    // Check if tile exists
    $stmt = $db->prepare("SELECT id, series FROM tiles WHERE id = ?");
    $stmt->execute([$tileId]);
    $tile = $stmt->fetch();
    if (!$tile) {
        sendError('Tile not found', 404);
    }
    
    $stmt = $db->prepare("DELETE FROM tiles WHERE id = ?");
    $stmt->execute([$tileId]);
    
    // Log the action
    logAction('DELETE', 'TILE', $tileId, ['series' => $tile['series']], $admin['admin_id']);
    
    sendResponse([
        'success' => true,
        'message' => 'Tile deleted successfully'
    ]);
}
?>