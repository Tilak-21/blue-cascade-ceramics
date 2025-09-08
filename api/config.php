<?php
/**
 * Blue Cascade Ceramics API Configuration
 * Secure PHP backend for cPanel hosting
 */

// Security headers and CORS
function setSecurityHeaders() {
    // CORS headers for your domain
    $allowed_origins = [
        'https://www.bluecascadeceramics.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=utf-8');
    
    // Security headers
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    
    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Database connection
class Database {
    private static $instance = null;
    private $pdo = null;
    
    private function __construct() {
        $dbPath = __DIR__ . '/data/tiles.sqlite';
        
        // Create data directory if it doesn't exist
        $dataDir = dirname($dbPath);
        if (!file_exists($dataDir)) {
            mkdir($dataDir, 0755, true);
        }
        
        try {
            $this->pdo = new PDO('sqlite:' . $dbPath);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->initTables();
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->pdo;
    }
    
    private function initTables() {
        // Create tables
        $this->pdo->exec("
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
                searchTerms TEXT,
                description TEXT,
                isActive INTEGER DEFAULT 1,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                entity TEXT NOT NULL,
                entityId TEXT NOT NULL,
                adminId TEXT,
                changes TEXT,
                ip_address TEXT,
                user_agent TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");
        
        // Create default admin if not exists
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = ?");
        $stmt->execute(['admin']);
        if ($stmt->fetchColumn() == 0) {
            $passwordHash = password_hash('CascadeTiles2024', PASSWORD_DEFAULT);
            $stmt = $this->pdo->prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)");
            $stmt->execute(['admin', $passwordHash]);
        }
    }
}

// Authentication functions
function generateToken($adminId, $username) {
    $payload = [
        'admin_id' => $adminId,
        'username' => $username,
        'exp' => time() + (24 * 60 * 60), // 24 hours
        'iat' => time()
    ];
    return base64_encode(json_encode($payload));
}

function validateToken($token) {
    if (empty($token)) return false;
    
    try {
        $payload = json_decode(base64_decode($token), true);
        return $payload && isset($payload['exp']) && $payload['exp'] > time();
    } catch (Exception $e) {
        return false;
    }
}

function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization token required']);
        exit;
    }
    
    $token = $matches[1];
    if (!validateToken($token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }
    
    return json_decode(base64_decode($token), true);
}

// Utility functions
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function logAction($action, $entity, $entityId, $changes = null, $adminId = null) {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            INSERT INTO audit_logs (action, entity, entityId, adminId, changes, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $action,
            $entity,
            $entityId,
            $adminId,
            $changes ? json_encode($changes) : null,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
    } catch (Exception $e) {
        error_log("Audit log failed: " . $e->getMessage());
    }
}

function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function sendError($message, $status = 400) {
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit;
}
?>