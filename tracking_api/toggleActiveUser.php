<?php
$data = file_get_contents("php://input");

$post = json_decode($data, true);



$user_id = $post['user_id'];
$state = $post['state'];


$sql = "UPDATE user SET active=$state WHERE id=$user_id";

if ($conn->query($sql) === TRUE) {
    //echo "Record updated successfully";
} else {
    //echo "Error updating record: " . $conn->error;
}

print json_encode($post);
?>