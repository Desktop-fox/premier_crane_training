<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'db_config.php';

try {
    echo "Connected successfully to database: $db";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
