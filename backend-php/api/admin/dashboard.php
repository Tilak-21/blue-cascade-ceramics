<?php
require_once '../../config/database.php';
require_once '../../config/cors.php';

setCorsHeaders();
requireAuth();

try {
    $db = Database::getInstance()->getConnection();
    
    // Get dashboard statistics
    $stats = [];
    
    // Total tiles
    $stmt = $db->query("SELECT COUNT(*) as total FROM tiles");
    $stats['totalTiles'] = $stmt->fetchColumn();
    
    // Active tiles
    $stmt = $db->query("SELECT COUNT(*) as active FROM tiles WHERE isActive = 1");
    $stats['activeTiles'] = $stmt->fetchColumn();
    
    // Total inventory
    $stmt = $db->query("SELECT SUM(qty) as total FROM tiles WHERE isActive = 1");
    $stats['totalInventory'] = $stmt->fetchColumn() ?: 0;
    
    // Total value
    $stmt = $db->query("SELECT SUM(qty * proposedSP) as total FROM tiles WHERE isActive = 1");
    $stats['totalValue'] = $stmt->fetchColumn() ?: 0;
    
    // Low stock items (less than 1000 units)
    $stmt = $db->query("SELECT COUNT(*) as low FROM tiles WHERE isActive = 1 AND qty < 1000");
    $stats['lowStockItems'] = $stmt->fetchColumn();
    
    // Recent activity count
    $stmt = $db->query("SELECT COUNT(*) as recent FROM audit_log WHERE createdAt >= datetime('now', '-7 days')");
    $stats['recentActivity'] = $stmt->fetchColumn();
    
    // Category breakdown
    $stmt = $db->query("SELECT category, COUNT(*) as count FROM tiles WHERE isActive = 1 GROUP BY category ORDER BY count DESC");
    $stats['categoryBreakdown'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Type breakdown
    $stmt = $db->query("SELECT type, COUNT(*) as count FROM tiles WHERE isActive = 1 GROUP BY type ORDER BY count DESC");
    $stats['typeBreakdown'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Recent audit logs
    $stmt = $db->prepare("SELECT * FROM audit_log ORDER BY createdAt DESC LIMIT 10");
    $stmt->execute();
    $recentLogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'stats' => $stats,
            'recentActivity' => $recentLogs
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>