<?php
$data = file_get_contents("php://input");

$post = json_decode($data, true);



$user_id = $post['user'];
$user_email = $post['user_email'];
$event =  $post['event'];
$type =  $post['type'];

$date = date('Y-m-d H:i:s');
$sql = "INSERT INTO logs (id, user_id, user_email, datetime, event_text, type)
VALUES ('', $user_id, '$user_email', '$date', '$event', $type)";

if ($conn->query($sql) === TRUE) {
    //echo "New record created successfully";
} else {
    //echo "Error: " . $sql . "<br>" . $conn->error;
}

//zapocti login
echo "{}";
?>