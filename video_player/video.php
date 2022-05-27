<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title></title>


  <link rel="stylesheet" href="https://assets.livebox.cz/flowplayer/7.2.7/skin/skin.css">
  
  
  <link rel="stylesheet" href="https://play.elh.livebox.cz/css/vod.css">
    <link rel="stylesheet" href="https://play.elh.livebox.cz/font-awesome-4.7.0/css/font-awesome.min.css">
    <script src="https://assets.livebox.cz/jquery-1.11.1.min.js"  type="text/javascript"></script>
    <script type="text/javascript">
    /* <![CDATA[ */
                    //document.write(unescape("%3Cscript src='//play.elh.livebox.cz/js/cms-player.js?__toka"+ Math.floor(Math.random()*1073741824)+"__="+Math.floor(Math.random()*1073741824)+"' type='text/javascript'%3E%3C/script%3E"));
                    document.write(unescape("%3Cscript src='//play.elh.livebox.cz/js/cms-player-v7.2.7.js?__toka"+ Math.floor(Math.random()*1073741824)+"__="+Math.floor(Math.random()*1073741824)+"' type='text/javascript'%3E%3C/script%3E"));

    /* ]]> */
  </script>
  <style>
	  body {
		  padding: 0;
		  margin: 0;
	  }
  </style>
  </head>
  <body>
		 
		
		<div id="lbx"></div>
		
		<?php
		$secret_key = "zJh99ENCJ82aSp9LOipTB0zxNsw";
		$stream_id = "_any_";
		$expiry = time() + 14400; // 4 hours;
		
		$data = $stream_id . "|" . $expiry;
		$token = $data . "|" . hash_hmac("sha1", $data, $secret_key);
		
		$time = $_GET["starttime"];
		if($time>=5) {
			$time = $time -5;
		}
		?>
		
		<script type="text/javascript">
		$( document ).ready(function() {
		
		  LiveboxCMSPlayer.vod({
		                  dom_id: 'lbx', //DOM ID
		                  auth: '<?php echo $token?>',  // autorizacni token, viz. zaslany dokument ke generovani
		                  video: '<?php echo $_GET["id"] ?>', // nazev vod i kdyz se jedna o Live, je pak na prvni pohled videt o jaky se jednalo zapas
		                  categoryId: '',  //parametr pro GA  sumarizace kategorii, link na video na HTV, uvadet setjne id, pod kterym je video dostupnena HTV, stejne jako kategorii
		                  //matchId: 2524203, // id zapasu hokej.cz pokud existuje, jinak prazdne
		                  type: 19, // pevne dane cislo
		                  userId: "",  // id uzivatele hokejka pokud je uzivatel prihlasen jinak prazdne
		                  uIp: '192.168.8.144', // ip adresa
		                  playfromURL: '/temp',  // url ze ktereho bylo video prehrano
		                  playPos: 0, //0 -  main | 1 -  top | 2 - recommended | 3 - embed
		                  platforms: 'desktop', // nahradit parametrureceny pro start prehravace
		                  poster: './video_poster.png', //pozadi obrazku
		                  autostart: true,
		                  countdown: 0,
		                  starttime: '<?php echo $time ?>',
		                  mute: false
		  });
		
		});
		
		</script>

  </body>
</html>
