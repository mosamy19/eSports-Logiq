<?php

$sql = "SELECT id, user, active, resolution, admin, enabled_test FROM user";
$rows = array();
$result = $conn->query($sql);
while($r = mysqli_fetch_assoc($result)) {

        $id = $r["id"];
        $resolution = $r["resolution"];
        $enabled_test = $r["enabled_test"];

        $sql2 = "SELECT datetime FROM logins WHERE user_id='$id' ORDER BY datetime DESC LIMIT 1";

        //echo $sql2."<br>";

        $log_last_date = "";

        $rows2= array();
        $result2 = $conn->query($sql2);
        while($r2 = mysqli_fetch_assoc($result2)) {
            $log_last_date = $r2['datetime'];
        }

        $count = 0;
        $sql3 = "SELECT datetime FROM logins WHERE user_id='$id' AND datetime>'2019-09-01'";
        $rows3 = array();
        $result3 = $conn->query($sql3);
        while($r3 = mysqli_fetch_assoc($result3)) {
            $count++;
        }



    $r["log_last_date"] = $log_last_date;
    $r["count_logs"] = $count;
    $r["resolution"] = $resolution;
    $r["enabled_test"] = $enabled_test;

    $r['id']=(int)$r['id'];
    $rows[] = $r;
}
print json_encode($rows);

?>