<?php
$data = file_get_contents("php://input");

$post = json_decode($data, true);



$email = $post['email'];
$pass = md5($post['password']);
$pass_2 = $post['password'];


$sql = "INSERT INTO user (id, user, pass, pass_2, active, admin) VALUES ('', '$email', '$pass', '$pass_2', 1, 0)";

//echo $sql;
if ($conn->query($sql) === TRUE) {
    //echo "New record created successfully";
} else {
    //echo "Error: " . $sql . "<br>" . $conn->error;
}//echo "Error updating record: " . $conn->error;


print json_encode($post);
?>