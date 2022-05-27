<?php
$data = file_get_contents("php://input");

$post = json_decode($data, true);



$user_id = $post['user_id'];
$pass = md5($post['password']);
$pass_2 = $post['password'];


$sql = "UPDATE user SET pass='$pass', pass_2='$pass_2' WHERE id=$user_id";

if ($conn->query($sql) === TRUE) {
    //echo "Record updated successfully";
} else {
    //echo "Error updating record: " . $conn->error;
}

print json_encode($post);
?>