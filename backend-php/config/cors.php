<?php
// CORS and security headers
function setCorsHeaders() {
    // Allow requests from your domain
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
    
    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

function validateJWT($token) {
    // Simple JWT validation (in production, use a proper JWT library)
    $secret = 'your-jwt-secret-key';
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }
    
    // For simplicity, we'll just check if token exists and is not expired
    // In production, implement proper JWT validation
    return !empty($token);
}

function requireAuth() {
    $headers = getallheaders();
    $auth_header = $headers['Authorization'] ?? '';
    
    if (!preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization token required']);
        exit;
    }
    
    $token = $matches[1];
    if (!validateJWT($token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }
    
    return true;
}
?>