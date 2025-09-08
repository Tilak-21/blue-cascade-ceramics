<?php
// Database configuration for SQLite (works on all cPanel hosts)
class Database {
    private $db;
    private static $instance = null;
    
    private function __construct() {
        $db_path = __DIR__ . '/../data/tiles.db';
        
        // Create data directory if it doesn't exist
        $data_dir = dirname($db_path);
        if (!file_exists($data_dir)) {
            mkdir($data_dir, 0755, true);
        }
        
        try {
            $this->db = new PDO('sqlite:' . $db_path);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->initializeTables();
        } catch (PDOException $e) {
            die('Database connection failed: ' . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->db;
    }
    
    private function initializeTables() {
        // Create tiles table
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS tiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                size TEXT NOT NULL,
                series TEXT NOT NULL,
                material TEXT NOT NULL,
                surface TEXT NOT NULL,
                qty INTEGER NOT NULL DEFAULT 0,
                proposedSP DECIMAL(10,2) NOT NULL DEFAULT 0,
                category TEXT NOT NULL,
                application TEXT NOT NULL,
                peiRating TEXT NOT NULL,
                thickness TEXT NOT NULL,
                finish TEXT NOT NULL,
                image TEXT,
                images TEXT,
                searchTerms TEXT,
                description TEXT,
                isActive BOOLEAN DEFAULT TRUE,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Create audit log table
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                entity TEXT NOT NULL,
                entityId TEXT NOT NULL,
                adminId TEXT,
                changes TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Create admin table (simple hardcoded admin for now)
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Insert default admin if not exists
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM admins WHERE username = ?");
        $stmt->execute(['admin']);
        if ($stmt->fetchColumn() == 0) {
            $password_hash = password_hash('CascadeTiles2024', PASSWORD_DEFAULT);
            $stmt = $this->db->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
            $stmt->execute(['admin', $password_hash]);
        }
    }
}
?>