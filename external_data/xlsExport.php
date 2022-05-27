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

//header ( "Content-type: application/vnd.ms-excel" );
//header ( "Content-Disposition: attachment; filename=foo_bar.xls" );
 
$json_data = file_get_contents("php://input");


//$string = file_get_contents("individual-stats.json");
$json = json_decode($json_data, true);

//print_r($json_a);
 
$body = '<html xmlns:x="urn:schemas-microsoft-com:office:excel"> <head> <xml> <x:ExcelWorkbook> <x:ExcelWorksheets> <x:ExcelWorksheet> <x:Name>Hockey Logic</x:Name> <x:WorksheetOptions> <Print> <x:GridLines /> </Print> </x:WorksheetOptions> </x:ExcelWorksheet> </x:ExcelWorksheets> </x:ExcelWorkbook> </xml> </head> <style>.text{ mso-number-format:"\@";/*force text*/ }</style> <body>';
$body = $body . "<table border='1'>";
foreach ($json as $item) {
    $body = $body . "<tr>";

    $count = 0;
    foreach ($item as $item2) {

        if($count==0) {
            $item2=str_replace("__","",$item2);
            $style = "";
            $class = "text";
        
        } else if ($count==1) {
            $style = "";
            $class = "text";
        
        } else {
            $style = "mso-number-format: Fixed;";
            $class = ""; 
        }
        //$item2 = str_replace(":","&#720;",$item2);
        /*
        if (strpos($item2, ':') !== false) {
            if(strlen($item2)==5) {
                $item2 = "00:".$item2;
            }
        }
        */

        $body = $body . "<td style='".$style."' class='".$class."'>".$item2."</td>";
        //echo "<td style='mso-number-format: "\@";'>".$item2."</td>";
        $count++;
    }
    $body = $body . "</tr>";
}
$body = $body . "</table>";
$body = $body . "</body></html>";

//echo $body;

$random = generateRandomString();
file_put_contents("xls_exports/".$random.".xls", $body);



function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
?>
{"url": "http://hockeylogic.sh10w1.esports.cz/external_data/xlsDownload.php?id=<?php echo $random;?>"}