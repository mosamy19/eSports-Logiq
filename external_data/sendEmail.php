<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    die();
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');


$json_data = file_get_contents("php://input");
$json = json_decode($json_data, true);


$from = $json["email"];
$to = "b4rt11@gmail.com";
$subject = "Chyba na Hockey Logic";
$message = $json["text"];
$headers = "From:" . $from;
mail($to,$subject,$message, $headers);
?>
{"success": true}    