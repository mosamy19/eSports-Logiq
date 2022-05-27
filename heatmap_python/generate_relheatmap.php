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

$ret = [
    'result' => 'OK',
];

$data = file_get_contents("php://input");
$filter_shoot_category_heat = htmlspecialchars($_GET['filter_shoot_category_heat']);

$random_filename = md5(uniqid(rand(), true));


//$file = file_get_contents("./shots.json");

$json = json_decode($data, true);

$shots_list = [];

array_push($shots_list, ['x','y','z']);

$count_red = 0;
$count_blue = 0;


foreach ($json as $item) {
    //$x_pos = calculateHorizontalPositionToPercent($item['x'],$item['y']);
    //$y_pos = calculateVerticalPositionToPercent($item['x'],$item['y']);

    $x_pos = $item['x'];
    $y_pos = $item['y'];

    $z_pos = $item['z'][$filter_shoot_category_heat];

    if($z_pos!=0) {
        array_push($shots_list, [$x_pos,$y_pos,$z_pos]);
    }

}


array_push($shots_list, [0,0,0]);
array_push($shots_list, [0,-100,0]);
array_push($shots_list, [0,100,0]);
array_push($shots_list, [50,100,0]);
array_push($shots_list, [100,100,0]);
array_push($shots_list, [50,-100,0]);
array_push($shots_list, [100,-100,0]);
array_push($shots_list, [100,0,0]);



$fp = fopen("relheatmaps/$random_filename.csv", 'w');

foreach ($shots_list as $fields) {
    fputcsv($fp, $fields);
}

fclose($fp);

$date = date("Y-m-d-H:i:s");
shell_exec("python generate_relheatmap.py $random_filename > log/".$date."_debug_rel.log 2>&1");

$im = imagecreatefrompng("relheatmaps/".$random_filename.".png");
$im2 = $im;
//$im2 = imagecrop($im, ['x' => 55, 'y' => 100, 'width' => 500, 'height' => 580]);
if ($im2 !== FALSE) {
    imagepng($im2, "relheatmaps/".$random_filename.".png");
    imagedestroy($im2);

    $filename = "relheatmaps/".$random_filename.".png";
    $handle = fopen($filename, "rb");
    $contents = fread($handle, filesize($filename));
    fclose($handle);
    imagepng($im2, "relheatmaps/".$random_filename.".png");

    //echo $contents;

}
imagedestroy($im);


$json_image->url = "http://hockeylogic-test.sh10w1.esports.cz/heatmap_python/relheatmaps/$random_filename.png";
$json_image = json_encode($json_image);
echo $json_image;




// na základě X pozice otočit hodnoty, kvůli hřišti
function calculateHorizontalPositionToPercent($x, $y) {
    $position = round(($y + 100) / 2);
    return ($x <= 0) ? $position : 100 - $position;
}

// zrcadlové otočení pro hosty (X hodnoty v kladných číslech)
function calculateVerticalPositionToPercent($x) {
    return ($x <= 0) ? round($x + 100) : round(100 - $x);
}
?>