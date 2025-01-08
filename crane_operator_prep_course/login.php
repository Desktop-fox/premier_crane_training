<?php
require 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = $_POST['email'];
    $password = $_POST['password'];

    // Fetch user by email
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $passwordHash = $row['password_hash'];

        // Verify password
        if (password_verify($password, $passwordHash)) {
            echo "Login successful!";
            // Set session or JWT token here
        } else {
            echo "Invalid password!";
        }
    } else {
        echo "No account found with that email.";
    }
} else {
    echo "Invalid request.";
}
?>
