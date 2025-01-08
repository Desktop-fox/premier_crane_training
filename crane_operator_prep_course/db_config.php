<?php
$host = "localhost"; // Your Hostinger MySQL host or “localhost”
$db       = "u564001388_cust_accounts";
$user     = "u564001388_premiercranetr";
$password = "Crane2024!!";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $password);
    // Set error mode to throw exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("ERROR: Could not connect. " . $e->getMessage());
}
?>
