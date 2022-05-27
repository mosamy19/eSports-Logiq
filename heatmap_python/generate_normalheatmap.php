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
$random_filename = md5(uniqid(rand(), true));
//$file = file_get_contents("./shots.json");

$json = json_decode($data, true);
$shots_list = [];
array_push($shots_list, ['x','y','z']);
$count_red = 0;
$count_blue = 0;

foreach ($json as $item) {
    $x_pos = $item[0];
    $y_pos = $item[1];
    $z_pos = $item[2];
    array_push($shots_list, [$x_pos,$y_pos,$z_pos]);
}

array_push($shots_list, [0,0,0]);
array_push($shots_list, [0,-100,0]);
array_push($shots_list, [0,100,0]);
array_push($shots_list, [50,100,0]);
array_push($shots_list, [100,100,0]);
array_push($shots_list, [50,-100,0]);
array_push($shots_list, [100,-100,0]);
array_push($shots_list, [100,0,0]);

$fp = fopen("normalheatmaps/$random_filename.csv", 'w');

foreach ($shots_list as $fields) {
    fputcsv($fp, $fields);
}

fclose($fp);
$date = date("Y-m-d-H:i:s");
shell_exec("python generate_normalheatmap.py $random_filename > log/".$date."_debug.log 2>&1");

$im = imagecreatefrompng("normalheatmaps/".$random_filename.".png");
$im2 = $im;

if ($im2 !== FALSE) {
    imagepng($im2, "normalheatmaps/".$random_filename.".png");
    imagedestroy($im2);

    $filename = "normalheatmaps/".$random_filename.".png";
    $handle = fopen($filename, "rb");
    $contents = fread($handle, filesize($filename));
    fclose($handle);
    imagepng($im2, "normalheatmaps/".$random_filename.".png");

    //echo $contents;

}
imagedestroy($im);

$json_image->url = "http://hockeylogic-test.sh10w1.esports.cz/heatmap_python/normalheatmaps/$random_filename.png";
$json_image = json_encode($json_image);
echo $json_image;
?>