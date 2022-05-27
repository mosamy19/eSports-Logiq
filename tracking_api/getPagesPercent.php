<?php
$rows = array();

$dateFrom = $_GET['dateFrom'];
$dateTo = $_GET['dateTo'];

$exist_dateFrom = false;
$exist_dateTo = false;

$sql_date = "";
if($dateFrom!="") {
    $exist_dateFrom = true;
    $sql_date = "AND datetime>='$dateFrom'";
}

if($dateTo!="") {
    $exist_dateTo = true;
    $sql_date = "AND datetime<='$dateTo'";
}

if($dateFrom!="" && $dateTo!="") {
    $exist_dateFrom = true;
    $exist_dateTo = true;
    $sql_date = "AND datetime>='$dateFrom' AND datetime<='$dateTo'";
}



//HRACI
$sql = "SELECT * FROM logs WHERE type=7 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["hraci"] =$count;


//SPOLUHRACI
$sql = "SELECT * FROM logs WHERE type=9 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["spoluhraci"] = $count;


//FORMACE
$sql = "SELECT * FROM logs WHERE type=3 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["formace"] = $count;


//ANALYZER
$sql = "SELECT * FROM logs WHERE type=2 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["analyzer"] = $count;


//BRANKARI
$sql = "SELECT * FROM logs WHERE type=6 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["brankari"] = $count;


//ZAPASY
$sql = "SELECT * FROM logs WHERE type=5 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["zapasy"] = $count;



//TYMY
$sql = "SELECT * FROM logs WHERE type=8 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["tymy"] = $count;


//GAMELOG
$sql = "SELECT * FROM logs WHERE type=4 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["gamelog"] = $count;


//TREND
$sql = "SELECT * FROM logs WHERE type=10 $sql_date";
$result = $conn->query($sql);
$count = 0;
while($r = mysqli_fetch_assoc($result)) {       
    $count++;
}
$x["trend"] = $count;







$rows[] = $x;
print json_encode($rows);
?>