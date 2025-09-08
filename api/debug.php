<?php
/**
 * Debug endpoint to check database contents
 */
require_once 'config.php';

setSecurityHeaders();

try {
    $db = Database::getInstance()->getConnection();
    
    // Count all tiles
    $stmt = $db->query("SELECT COUNT(*) as total FROM tiles");
    $totalTiles = $stmt->fetch();
    
    // Count active tiles  
    $stmt = $db->query("SELECT COUNT(*) as active FROM tiles WHERE isActive = 1");
    $activeTiles = $stmt->fetch();
    
    // Sample tiles
    $stmt = $db->query("SELECT id, series, qty, proposedSP, isActive FROM tiles LIMIT 5");
    $sampleTiles = $stmt->fetchAll();
    
    // Sum inventory
    $stmt = $db->query("SELECT SUM(qty) as total_qty FROM tiles WHERE isActive = 1");
    $totalInventory = $stmt->fetch();
    
    // Sum value
    $stmt = $db->query("SELECT SUM(qty * proposedSP) as total_value FROM tiles WHERE isActive = 1");
    $totalValue = $stmt->fetch();
    
    // Check table structure
    $stmt = $db->query("PRAGMA table_info(tiles)");
    $tableStructure = $stmt->fetchAll();
    
    echo "<h2>🔍 Database Debug Information</h2>";
    echo "<h3>Tile Counts:</h3>";
    echo "<p>Total tiles: " . ($totalTiles['total'] ?? 'NULL') . "</p>";
    echo "<p>Active tiles: " . ($activeTiles['active'] ?? 'NULL') . "</p>";
    
    echo "<h3>Inventory:</h3>";
    echo "<p>Total quantity: " . ($totalInventory['total_qty'] ?? 'NULL') . "</p>";
    echo "<p>Total value: $" . number_format($totalValue['total_value'] ?? 0, 2) . "</p>";
    
    echo "<h3>Sample Tiles:</h3>";
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Series</th><th>Qty</th><th>Price</th><th>Active</th></tr>";
    foreach ($sampleTiles as $tile) {
        echo "<tr>";
        echo "<td>" . $tile['id'] . "</td>";
        echo "<td>" . htmlspecialchars($tile['series']) . "</td>";
        echo "<td>" . $tile['qty'] . "</td>";
        echo "<td>$" . $tile['proposedSP'] . "</td>";
        echo "<td>" . ($tile['isActive'] ? 'Yes' : 'No') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<h3>Table Structure:</h3>";
    echo "<pre>";
    foreach ($tableStructure as $column) {
        echo $column['name'] . " - " . $column['type'] . "\n";
    }
    echo "</pre>";
    
} catch (Exception $e) {
    echo "<h2>❌ Error:</h2>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
?>