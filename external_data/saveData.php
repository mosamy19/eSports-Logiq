<?php
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET,HEAD,OPTIONS,POST,PUT'); 
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization'); 

header('Content-Type: application/json, text/html; charset=utf-8');

include "db.php";

$id = pg_escape_string($_GET['id']);

$post_json = json_decode(file_get_contents('php://input'), true);
$body = $post_json['data'];

//$body = '[{"id":1,"name":"Útočná data","data":[{"type":"cf60","name":"CF/60","colour":"green"},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null}]},{"id":2,"name":"Obranná data data","data":[{"type":"sog","name":"SOG","colour":"green"},{"type":"dzs","name":"DZS","colour":"red"},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null},{"type":null,"name":null,"colour":null}]}]';

$sql= "SELECT * FROM saved_attributes WHERE id='".pg_escape_string($_GET['id'])."'";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {

        $sql = "UPDATE saved_attributes SET data='$body' WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
        } else {
        }



    }
} else {

    $sql = "INSERT INTO saved_attributes (id, data) VALUES ('$id', '$body')";
    if ($conn->query($sql) === TRUE) {

        $sql = "UPDATE saved_attributes SET data='$body' WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
        } else {
        }
    

    } else {
    }


}



echo "{'done': true}";

