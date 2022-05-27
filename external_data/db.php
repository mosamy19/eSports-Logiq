<?php
$servername = "denisa.esports.cz";
$username = "hockey_logiq";
$password = "FGn8qKXRYsmpXHJ3";


$dbname = "hockey_logiq";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


mysqli_set_charset($conn,"utf8");
