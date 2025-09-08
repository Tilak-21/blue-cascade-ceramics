<?php
/**
 * Simplified dashboard endpoint for debugging
 */
require_once 'config.php';

setSecurityHeaders();

// Skip auth for debugging - comment this out later
// $admin = requireAuth();

try {
    $db = Database::getInstance()->getConnection();
    
    // Simple stats
    $stats = [];
    
    // Total tiles
    $stmt = $db->query("SELECT COUNT(*) FROM tiles");
    $stats['totalTiles'] = (int) $stmt->fetchColumn();
    
    // Active tiles
    $stmt = $db->query("SELECT COUNT(*) FROM tiles WHERE isActive = 1");
    $stats['activeTiles'] = (int) $stmt->fetchColumn();
    
    // Total inventory
    $stmt = $db->query("SELECT SUM(qty) FROM tiles WHERE isActive = 1");
    $stats['totalInventory'] = (int) ($stmt->fetchColumn() ?: 0);
    
    // Total value  
    $stmt = $db->query("SELECT SUM(qty * proposedSP) FROM tiles WHERE isActive = 1");
    $stats['totalValue'] = (float) ($stmt->fetchColumn() ?: 0);
    
    // Sample data for debugging
    $stmt = $db->query("SELECT id, series, qty, proposedSP, isActive FROM tiles LIMIT 3");
    $sampleTiles = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'debug' => true,
        'stats' => $stats,
        'sampleTiles' => $sampleTiles,
        'message' => 'Dashboard debug data'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server error: ' . $e->getMessage(),
        'debug' => true
    ]);
}
?>