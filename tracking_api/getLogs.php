<?php
$user_id = $_GET['user_id'];


$sql2 = "SELECT * FROM user WHERE id=$user_id LIMIT 1";
$result2 = $conn->query($sql2);
while($r2 = mysqli_fetch_assoc($result2)) {
    $user_email = $r2["user"];
}



$sql = "SELECT * FROM logs WHERE user_id=$user_id ORDER BY datetime DESC";
$result = $conn->query($sql);

$rows = array();
while($r = mysqli_fetch_assoc($result)) {

        $r["user_email"] = $user_email;


    $rows[] = $r;
}
print json_encode($rows);

//zapocti login
?>