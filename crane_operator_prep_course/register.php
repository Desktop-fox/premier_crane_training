<?php
require 'db_config.php';
// test print
echo "<p>Using the same db_config: $db</p>";

// ... rest of your code

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = $_POST['email'];
    $password = $_POST['password'];
    
    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    
    if ($stmt->rowCount() > 0) {
        echo "Email already registered!";
        exit;
    }

    // Insert the new user
    $sql = "INSERT INTO users (email, password_hash) VALUES (:email, :pass)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['email' => $email, 'pass' => $hashedPassword]);

    echo "Account created successfully!";
} else {
    echo "Invalid request.";
}
?>
