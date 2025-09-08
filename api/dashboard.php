<?php
/**
 * Admin dashboard statistics
 */
require_once 'config.php';

setSecurityHeaders();
$admin = requireAuth();

try {
    $db = Database::getInstance()->getConnection();
    
    // Basic statistics
    $stats = [];
    
    // Total tiles
    $stmt = $db->query("SELECT COUNT(*) FROM tiles");
    $stats['totalTiles'] = (int) $stmt->fetchColumn();
    
    // Active tiles
    $stmt = $db->query("SELECT COUNT(*) FROM tiles WHERE isActive = 1");
    $stats['activeTiles'] = (int) $stmt->fetchColumn();
    
    // Total inventory
    $stmt = $db->query("SELECT COALESCE(SUM(qty), 0) FROM tiles WHERE isActive = 1");
    $stats['totalInventory'] = (int) $stmt->fetchColumn();
    
    // Total value
    $stmt = $db->query("SELECT COALESCE(SUM(qty * proposedSP), 0) FROM tiles WHERE isActive = 1");
    $stats['totalValue'] = (float) $stmt->fetchColumn();
    
    // Low stock items (less than 1000 units)
    $stmt = $db->query("SELECT COUNT(*) FROM tiles WHERE isActive = 1 AND qty < 1000");
    $stats['lowStockItems'] = (int) $stmt->fetchColumn();
    
    // Recent activity count (last 7 days)
    $stmt = $db->query("SELECT COUNT(*) FROM audit_logs WHERE createdAt >= datetime('now', '-7 days')");
    $stats['recentActivity'] = (int) $stmt->fetchColumn();
    
    // Category breakdown
    $stmt = $db->query("
        SELECT category, COUNT(*) as count, SUM(qty) as total_qty 
        FROM tiles WHERE isActive = 1 
        GROUP BY category 
        ORDER BY count DESC
    ");
    $categoryBreakdown = $stmt->fetchAll();
    
    // Type breakdown
    $stmt = $db->query("
        SELECT type, COUNT(*) as count, SUM(qty) as total_qty 
        FROM tiles WHERE isActive = 1 
        GROUP BY type 
        ORDER BY count DESC
    ");
    $typeBreakdown = $stmt->fetchAll();
    
    // Recent audit logs
    $stmt = $db->query("
        SELECT action, entity, entityId, adminId, ip_address, createdAt 
        FROM audit_logs 
        ORDER BY createdAt DESC 
        LIMIT 10
    ");
    $recentLogs = $stmt->fetchAll();
    
    // Top value tiles
    $stmt = $db->query("
        SELECT series, material, qty, proposedSP, (qty * proposedSP) as total_value
        FROM tiles 
        WHERE isActive = 1 
        ORDER BY total_value DESC 
        LIMIT 5
    ");
    $topValueTiles = $stmt->fetchAll();
    
    // Convert numeric values
    foreach ($categoryBreakdown as &$item) {
        $item['count'] = (int) $item['count'];
        $item['total_qty'] = (int) $item['total_qty'];
    }
    
    foreach ($typeBreakdown as &$item) {
        $item['count'] = (int) $item['count'];
        $item['total_qty'] = (int) $item['total_qty'];
    }
    
    foreach ($topValueTiles as &$item) {
        $item['qty'] = (int) $item['qty'];
        $item['proposedSP'] = (float) $item['proposedSP'];
        $item['total_value'] = (float) $item['total_value'];
    }
    
    sendResponse([
        'success' => true,
        'data' => [
            'stats' => $stats,
            'categoryBreakdown' => $categoryBreakdown,
            'typeBreakdown' => $typeBreakdown,
            'topValueTiles' => $topValueTiles,
            'recentActivity' => $recentLogs
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Dashboard error: " . $e->getMessage());
    sendError('Server error', 500);
}
?>