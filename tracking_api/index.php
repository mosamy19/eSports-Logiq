<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Max-Age: 1728000');
    header('Content-Length: 0');
    header('Content-Type: text/plain');
    die();
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require "inc/db.php";

$page = $_GET["page"];

if($page =="login") {
    include "login.php";
} else if($page =="getLogins") {
    include "getLogins.php";
} else if($page =="getUsers") {
    include "getUsers.php";
} else if($page =="toggleActiveUser") {
    include "toggleActiveUser.php";
} else if($page =="toggleAdminUser") {
    include "toggleAdminUser.php";
} else if($page =="editUserPass") {
    include "editUserPass.php";
} else if($page =="getLogs") {
    include "getLogs.php";
} else if($page =="addEvent") {
    include "addEvent.php";
} else if($page =="getPagesPercent") {
    include "getPagesPercent.php";
} else if($page =="addUser") {
    include "addUser.php";
} else if($page =="toggleTestUser") {
    include "toggleTestUser.php";
}