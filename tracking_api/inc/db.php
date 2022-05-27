<?php
$dbhost = "dita.esports.cz";
$dbuser = "hockeylogiq";
$dbpass = "q8avB8TJCmmtCwoy";

$dbname = "hockeylogiq";


$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

mysqli_set_charset ($conn, "utf8");
mysqli_query('SET NAMES UTF8');



if(! $conn ){
   die('Could not connect: ' . mysqli_error());
}
mysqli_close($con);