<?php
$data = file_get_contents("php://input");

$post = json_decode($data, true);



$user = $post['user'];
$pass = md5($post["pass"]);
$resolution = $post['resolution'];



$sql = "SELECT active, admin, id, user, enabled_test FROM user WHERE user='$user' AND pass='$pass' AND active=1";
$result = $conn->query($sql);

$user_id = "";
$rows = array();
while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
    $user_id = $r['id'];
}
print json_encode($rows);


if(count($rows)>0) {
    $ip = isset($_SERVER['HTTP_CLIENT_IP']) ? $_SERVER['HTTP_CLIENT_IP'] : isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];
    $date = date('Y-m-d H:i:s');
    $sql = "INSERT INTO logins (id, datetime, user_id, ip)
    VALUES ('', '$date', $user_id, '$ip')";
    
    if ($conn->query($sql) === TRUE) {
        //echo "New record created successfully";
    } else {
        //echo "Error: " . $sql . "<br>" . $conn->error;
    }



    $sql = "UPDATE user SET resolution='$resolution' WHERE id=$user_id";

    if ($conn->query($sql) === TRUE) {
        //echo "Record updated successfully";
    } else {
        //echo "Error updating record: " . $conn->error;
    }

    
}


//zapocti login
?>