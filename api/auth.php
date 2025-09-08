<?php
/**
 * Authentication endpoint
 */
require_once 'config.php';

setSecurityHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['password'])) {
        sendError('Username and password required');
    }
    
    $username = sanitizeInput($input['username']);
    $password = $input['password'];
    
    if (empty($username) || empty($password)) {
        sendError('Username and password cannot be empty');
    }
    
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("SELECT id, username, password_hash FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    if (!$admin || !password_verify($password, $admin['password_hash'])) {
        // Log failed login attempt
        logAction('LOGIN_FAILED', 'ADMIN', $username);
        sendError('Invalid credentials', 401);
    }
    
    // Generate token
    $token = generateToken($admin['id'], $admin['username']);
    
    // Log successful login
    logAction('LOGIN_SUCCESS', 'ADMIN', $admin['username'], null, $admin['id']);
    
    sendResponse([
        'success' => true,
        'token' => $token,
        'admin' => [
            'id' => $admin['id'],
            'username' => $admin['username']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    sendError('Server error', 500);
}
?>