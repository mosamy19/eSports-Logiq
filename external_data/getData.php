<?php
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json, text/html; charset=utf-8');

include "db.php";

$sql= "SELECT * FROM saved_attributes WHERE id='".pg_escape_string($_GET['id'])."'";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data = $row['data'];
    }
} else {
    
}


echo ($data);
