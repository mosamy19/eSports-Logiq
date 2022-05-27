<?php
header('Access-Control-Allow-Origin: *');
?>

{
  "individual": [
    {
      "productivity": [
        {
          "name": "Produktivita",
          "name_en": "Individual production",
          "type": "individual_productivity",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "G",
              "type": "g",
              "colour": "green",
              "eng": "Goals",
              "desc": "Individuální vstřelené góly",
              "data": "count"
            },
            {
              "name": "sG",
              "type": "sg",
              "colour": "green",
              "eng": "Slot Goals",
              "desc": "Individuální vstřelené góly ze slotu",
              "data": "count"
            },
            {
              "name": "A1",
              "type": "a1",
              "colour": "green",
              "eng": "Primary Assists",
              "desc": "Primární asistence",
              "data": "count"
            },
            {
              "name": "A",
              "type": "a",
              "colour": "green",
              "eng": "Assists",
              "desc": "Asistence",
              "data": "count"
            },
            {
              "name": "P1",
              "type": "p1",
              "colour": "green",
              "eng": "Primary Points",
              "desc": "Primární body (G + A1)",
              "data": "count"
            },
            {
              "name": "P",
              "type": "p",
              "colour": "green",
              "eng": "Points",
              "desc": "Body (G + A)",
              "data": "count"
            },
            {
              "name": "G/60",
              "type": "g60",
              "colour": "green",
              "eng": "Goals per 60",
              "desc": "Individuální vstřelené góly za 60 minut",
              "data": "60"
            },
            {
              "name": "sG/60",
              "type": "sg60",
              "colour": "green",
              "eng": "Slot Goals per 60",
              "desc": "Individuální vstřelené góly ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "A1/60",
              "type": "a1_60",
              "colour": "green",
              "eng": "Primary Assists per 60",
              "desc": "Primární asistence dosažené za 60 minut",
              "data": "60"
            },
            {
              "name": "A/60",
              "type": "a60",
              "colour": "green",
              "eng": "Assists per 60",
              "desc": "Asistence dosažené za 60 minut",
              "data": "60"
            },
            {
              "name": "P1/60",
              "type": "p1_60",
              "colour": "green",
              "eng": "Primary Points per 60",
              "desc": "Primární body (G + A1) dosažené za 60 minut",
              "data": "60"
            },
            {
              "name": "P/60",
              "type": "p60",
              "colour": "green",
              "eng": "Points per 60",
              "desc": "Body (G + A) dosažené za 60 minut",
              "data": "60"
            },
            {
              "name": "G/GF",
              "type": "ggf",
              "colour": "green",
              "eng": "Individual Goals Production",
              "desc": "Podíl individuálních vstřelených gólů ze všech gólů pro tým s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "sG/sGF",
              "type": "sgsgf",
              "colour": "green",
              "eng": "Individual Slot Goals Production",
              "desc": "Podíl individuálních vstřelených gólů ze slotu ze všech gólů ze slotu pro tým s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "A1/A1F",
              "type": "a1a1f",
              "colour": "green",
              "eng": "Individual Primary Assists Production",
              "desc": "Podíl individuálních prvních asistencí ze všech prvních asisteních zaznamenaných týmem s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "P/PF",
              "type": "ppf",
              "colour": "green",
              "eng": "Individual Points Production",
              "desc": "Podíl individuálních bodů ze všech bodů zaznamenaných týmem s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "P1/P1F",
              "type": "p1p1f",
              "colour": "green",
              "eng": "Individual Primary Points Production",
              "desc": "Podíl individuálních primárních bodů ze všech primárních bodů zaznamenaných týmem s hráčem na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "shootout_goals": [
        {
          "name": "Góly z nájezdů",
          "name_en": "Shootout goals",
          "type": "shootout_goals",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SO",
              "type": "so",
              "colour": "green",
              "eng": "Shootouts",
              "desc": "Nájezdy",
              "data": "count"
            },
            {
              "name": "GSO",
              "type": "gso",
              "colour": "green",
              "eng": "Shootout Goals",
              "desc": "Góly z nájezdů",
              "data": "count"
            },
            {
              "name": "GSO%",
              "type": "gso_percent",
              "colour": "green",
              "eng": "Shootout Goals %",
              "desc": "Podíl proměněných nájezdů",
              "data": "percent"
            },
            {
              "name": "SO-D",
              "type": "sod",
              "colour": "green",
              "eng": "Shootout Dekes",
              "desc": "Nájezdy zakončené kličkou",
              "data": "count"
            },
            {
              "name": "GSO-D",
              "type": "gsod",
              "colour": "green",
              "eng": "Shootout Goals from Dekes",
              "desc": "Góly z nájezdů zakončených kličkou",
              "data": "count"
            },
            {
              "name": "GSO-D%",
              "type": "gsod_percent",
              "colour": "green",
              "eng": "Shootout Goals from Dekes %",
              "desc": "Úspěšnost nájezdů zakončených kličkou",
              "data": "percent"
            },
            {
              "name": "SO-S",
              "type": "sos",
              "colour": "green",
              "eng": "Shootout Shots",
              "desc": "Nájezdy zakončené střelou",
              "data": "count"
            },
            {
              "name": "GSO-S",
              "type": "gsos",
              "colour": "green",
              "eng": "Shootout Goals from Shots",
              "desc": "Góly z nájezdů zakončených střelou",
              "data": "count"
            },
            {
              "name": "GSO-S%",
              "type": "gsos_percent",
              "colour": "green",
              "eng": "Shootout Goals from Shots %",
              "desc": "Úspěšnost nájezdů zakončených střelou",
              "data": "percent"
            }
          ]
        }
      ],
      "expected_goals": [
        {
          "name": "Očekávané góly",
          "name_en": "Expected Goals",
          "type": "expected_goals",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "xG",
              "type": "xg",
              "colour": "green",
              "eng": "Expected Goals",
              "desc": "Očekávané góly hráče",
              "data": "count"
            },
            {
              "name": "xG/60",
              "type": "xg60",
              "colour": "green",
              "eng": "Expected Goals per 60",
              "desc": "Očekávané góly hráče za 60 minut",
              "data": "60"
            },
            {
              "name": "G - xG",
              "type": "gxg",
              "colour": "green",
              "eng": "Goals vs. Expected Goals",
              "desc": "Rozdíl vstřelených gólů a očekávaných gólů hráče",
              "data": "60"
            },
            {
              "name": "xG/C%",
              "type": "xgc_percent",
              "colour": "green",
              "eng": "Expected Goals per Shot Percentage",
              "desc": "Průměrná pravděpodobnost vstřelení gólu z jednoho střeleckého pokusu hráče",
              "data": "percent"
            }
          ]
        }
      ],
      "allShots": [
        {
          "name": "Všechny střely",
          "name_en": "All individual shots",
          "type": "individual_allShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "C",
              "type": "c",
              "colour": "green",
              "eng": "Individual Corsi",
              "desc": "Individuální střelecké pokusy",
              "data": "count"
            },
            {
              "name": "C/60",
              "type": "c60",
              "colour": "green",
              "eng": "Individual Corsi per 60",
              "desc": "Individuální střelecké pokusy za 60 minut",
              "data": "60"
            },
            {
              "name": "CSh%",
              "type": "csh_percent",
              "colour": "green",
              "eng": "Individual Corsi Shooting %",
              "desc": "Podíl individuálních vstřelených gólů ze všech individuálních střeleckých pokusů",
              "data": "percent"
            },
            {
              "name": "C/CF",
              "type": "ccf",
              "colour": "green",
              "eng": "Individual Corsi Production",
              "desc": "Podíl všech individuálních střel ze všech střel pro tým s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "MS",
              "type": "ms",
              "colour": "green",
              "eng": "Missed Shots",
              "desc": "Individuální střely mimo branku",
              "data": "count"
            },
            {
              "name": "BS",
              "type": "bs",
              "colour": "green",
              "eng": "Blocked shots (by opponent)",
              "desc": "Individuální střely zblokované soupeřem",
              "data": "count"
            },
            {
              "name": "MS/60",
              "type": "ms60",
              "colour": "green",
              "eng": "Missed Shots per 60",
              "desc": "Individuální střely mimo branku za 60 minut",
              "data": "60"
            },
            {
              "name": "BS/60",
              "type": "bs60",
              "colour": "green",
              "eng": "Blocked shots (by opponent) per 60",
              "desc": "Individuální střely zblokované soupeřem za 60 minut",
              "data": "60"
            },
            {
              "name": "BLK",
              "type": "blk",
              "colour": "red",
              "eng": "Opponent´s Shots Blocked",
              "desc": "Zblokované střely soupeře",
              "data": "count"
            },
            {
              "name": "BLK/60",
              "type": "blk60",
              "colour": "red",
              "eng": "Opponent´s Shots Blocked per 60",
              "desc": "Zblokované střely soupeře za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "unblockedShots": [
        {
          "name": "Nezblokované střely",
          "name_en": "Individual unblocked shots",
          "type": "individual_unblockedShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "F",
              "type": "f",
              "colour": "green",
              "eng": "Individual Fenwick",
              "desc": "Individuální nezblokované střely",
              "data": "count"
            },
            {
              "name": "F/60",
              "type": "f60",
              "colour": "green",
              "eng": "Individual Fenwick per 60",
              "desc": "Individuální nezblokované střely za 60 minut",
              "data": "60"
            },
            {
              "name": "FSh%",
              "type": "fsh_percent",
              "colour": "green",
              "eng": "Individual Fenwick Shooting %",
              "desc": "Podíl vstřelených gólů ze všech individuálních nezblokovaných střel",
              "data": "percent"
            },
            {
              "name": "F/FF",
              "type": "fff",
              "colour": "green",
              "eng": "Individual Fenwick Production",
              "desc": "Podíl individuálních nezblokovaných střel ze všech nezblokovaných střel týmu s hráčem na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "shotsOnGoal": [
        {
          "name": "Střely na branku",
          "name_en": "Shots on goal",
          "type": "individual_shotsOnGoal",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SOG",
              "type": "sog",
              "colour": "green",
              "eng": "Individual Shots On Goal",
              "desc": "Individuální střely na branku",
              "data": "count"
            },
            {
              "name": "SOG/60",
              "type": "sog60",
              "colour": "green",
              "eng": "Individual Shots On Goal per 60",
              "desc": "Individuální střely na branku za 60 minut",
              "data": "60"
            },
            {
              "name": "Sh%",
              "type": "sh_percent",
              "colour": "green",
              "eng": "Individual Shooting %",
              "desc": "Podíl vstřelených gólů ze všech individuálních střel na branku",
              "data": "percent"
            },
            {
              "name": "SOG/C",
              "type": "sogc",
              "colour": "green",
              "eng": "Percentage of Shots On Goal",
              "desc": "Podíl individuálních střel na branku ze všech individuálních střel",
              "data": "percent"
            },
            {
              "name": "SOG/SOGF",
              "type": "sogsogf",
              "colour": "green",
              "eng": "Individual Shots On Goal Production",
              "desc": "Podíl individuálních střel na branku ze všech střel na branku pro tým s hráčem na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "slotShots": [
        {
          "name": "Všechny střely ze slotu",
          "name_en": "All slot shots",
          "type": "individual_slotShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sC",
              "type": "sc",
              "colour": "green",
              "eng": "Individual Slot Shots",
              "desc": "Všechny individuální střely ze slotu",
              "data": "count"
            },
            {
              "name": "sC/60",
              "type": "sc60",
              "colour": "green",
              "eng": "Individual Slot Shots per 60",
              "desc": "Všechny individuální střely ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "sCSh%",
              "type": "scsh_percent",
              "colour": "green",
              "eng": "Individual Slot Shots Shooting %",
              "desc": "Podíl vstřelených gólů ze všech individuálních střel ze slotu",
              "data": "percent"
            },
            {
              "name": "sC/C",
              "type": "scc",
              "colour": "green",
              "eng": "Percentage of Slot Shots",
              "desc": "Podíl všech individuálních střel ze slotu ze všech individuálních střel",
              "data": "percent"
            },
            {
              "name": "sC/sCF",
              "type": "scscf",
              "colour": "green",
              "eng": "Individual Slot Shots Production",
              "desc": "Podíl všech individuálních střel ze slotu ze všech střel ze slotu pro tým s hráčem na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "slotShotsOnGoal": [
        {
          "name": "Všechny střely na branku ze slotu",
          "name_en": "All slot shots on goal",
          "type": "individual_slotShotsOnGoal",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sSOG",
              "type": "ssog",
              "colour": "green",
              "eng": "Individual Slot Shots On Goal",
              "desc": "Individuální střely na branku ze slotu",
              "data": "count"
            },
            {
              "name": "sSOG/60",
              "type": "ssog60",
              "colour": "green",
              "eng": "Individual Slot Shots On Goal per 60",
              "desc": "Individuální střely na branku ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "sSh%",
              "type": "ssh_percent",
              "colour": "green",
              "eng": "Individual Slot Shooting %",
              "desc": "Podíl vstřelených gólů ze všech individuálních střel na branku ze slotu",
              "data": "percent"
            },
            {
              "name": "sSOG/sSOGF",
              "type": "ssogssogf",
              "colour": "green",
              "eng": "Individual Slot Shots On Goal Production",
              "desc": "Podíl individuálních střel na branku ze slotu ze všech střel na branku ze slotu pro tým s hráčem na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "zoneStarts": [
        {
          "name": "Starty v pásmech",
          "name_en": "Zone starts",
          "type": "individual_zoneStarts",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DZS",
              "type": "dzs",
              "colour": "red",
              "eng": "Defensive Zone Starts",
              "desc": "Počet účastí na ledě při vhazováních v obranném pásmu",
              "data": "count"
            },
            {
              "name": "OZS",
              "type": "ozs",
              "colour": "green",
              "eng": "Ofensive Zone Starts",
              "desc": "Počet účastí na ledě při vhazováních v útočném pásmu",
              "data": "count"
            },
            {
              "name": "DZS%",
              "type": "dzs_percent",
              "colour": "red",
              "eng": "Defensive Zone Starts %",
              "desc": "Podíl účastí na ledě při vhazováních v obranném pásmu z celkového počtu účastí na ledě při všech vhazováních",
              "data": "percent"
            },
            {
              "name": "OZS%",
              "type": "ozs_percent",
              "colour": "green",
              "eng": "Ofensive Zone Starts %",
              "desc": "Podíl účastí na ledě při vhazováních v útočném pásmu z celkového počtu účastí na ledě při všech vhazováních",
              "data": "percent"
            },
            {
              "name": "ZSR%",
              "type": "zsr_percent",
              "colour": "red",
              "eng": "Zone Starts Ratio %",
              "desc": "Podíl účastí na ledě při vhazováních v útočném pásmu ze součtu účastí na ledě při vhazováních v útočném a obranném pásmu",
              "data": "percent"
            }
          ]
        }
      ],
      "faceOffs": [
        {
          "name": "Vhazování",
          "name_en": "Faceoffs",
          "type": "individual_faceOffs",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "FO",
              "type": "fo",
              "colour": "white",
              "eng": "Faceoffs",
              "desc": "Účasti na vhazování",
              "data": "count"
            },
            {
              "name": "FOW",
              "type": "fow",
              "colour": "white",
              "eng": "Faceoffs Won",
              "desc": "Vyhraná vhazování",
              "data": "count"
            },
            {
              "name": "FOW%",
              "type": "fow_percent",
              "colour": "white",
              "eng": "Faceoffs Won %",
              "desc": "Podíl vyhraných vhazování ze všech účastí na vhazování",
              "data": "percent"
            },
            {
              "name": "DZFO",
              "type": "dzfo",
              "colour": "red",
              "eng": "Defensive Zone Faceoffs",
              "desc": "Účasti na vhazováních v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZFOW",
              "type": "dzfow",
              "colour": "red",
              "eng": "Defensive Zone Faceoffs Won",
              "desc": "Vyhraná vhazování v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZFOW%",
              "type": "dzfow_percent",
              "colour": "red",
              "eng": "Defensive Zone Faceoffs Won %",
              "desc": "Podíl vyhraných vhazování v obranném pásmu ze všech účastí na vhazováních v obranném pásmu",
              "data": "percent"
            },
            {
              "name": "NZFO",
              "type": "nzfo",
              "colour": "white",
              "eng": "Neutral Zone Faceoffs",
              "desc": "Účasti na vhazováních ve středním pásmu",
              "data": "count"
            },
            {
              "name": "NZFOW",
              "type": "nzfow",
              "colour": "white",
              "eng": "Neutral Zone Faceoffs Won",
              "desc": "Vyhraná vhazování ve středním pásmu",
              "data": "count"
            },
            {
              "name": "NZFOW%",
              "type": "nzfow_percent",
              "colour": "white",
              "eng": "Neutral Zone Faceoffs Won %",
              "desc": "Podíl vyhraných vhazování ve středním pásmu ze všech účastí na vhazováních ve středním pásmu",
              "data": "percent"
            },
            {
              "name": "OZFO",
              "type": "ozfo",
              "colour": "green",
              "eng": "Offensive Zone Faceoffs",
              "desc": "Účasti na vhazováních v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZFOW",
              "type": "ozfow",
              "colour": "green",
              "eng": "Offensive Zone Faceoffs Won",
              "desc": "Vyhraná vhazování v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZFOW%",
              "type": "ozfow_percent",
              "colour": "green",
              "eng": "Offensive Zone Faceoffs Won %",
              "desc": "Podíl vyhraných vhazování v útočném pásmu ze všech účastí na vhazováních v útočném pásmu",
              "data": "percent"
            }
          ]
        }
      ],
      "slotPasses": [
        {
          "name": "Přihrávky do slotu",
          "name_en": "Slot passes",
          "type": "individual_slotPasses",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sP",
              "type": "sp",
              "colour": "green",
              "eng": "Slot Passes",
              "desc": "Přihrávky do slotu",
              "data": "count"
            },
            {
              "name": "sP/60",
              "type": "sp60",
              "colour": "green",
              "eng": "Slot Passes per 60",
              "desc": "Přihrávky do slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "sPC",
              "type": "spc",
              "colour": "green",
              "eng": "Slot Passes Complete",
              "desc": "Zkompletované přihrávky do slotu",
              "data": "count"
            },
            {
              "name": "sPC/60",
              "type": "spc60",
              "colour": "green",
              "eng": "Slot Passes Complete per 60",
              "desc": "Zkompletované přihrávky do slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "sPC/sP",
              "type": "spcsp",
              "colour": "green",
              "eng": "Percentage of Complete Slot Passes",
              "desc": "Podíl zkompletovaných přihrávek do slotu ze všech zkompletovaných přihrávek do slotu vyslaných týmem s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "sPN",
              "type": "spn",
              "colour": "green",
              "eng": "Slot Passes Non-Complete",
              "desc": "Nezkompletovanépřihrávky do slotu",
              "data": "count"
            },
            {
              "name": "sPN/60",
              "type": "spn60",
              "colour": "green",
              "eng": "Slot Passes Non-Complete per 60",
              "desc": "Nezkompletované přihrávky do slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "BLK.sP",
              "type": "blksp",
              "colour": "red",
              "eng": "Opponent´s Slot Passes Blocked",
              "desc": "Zblokované přihrávky soupeře do slotu",
              "data": "count"
            },
            {
              "name": "BLK.sP/60",
              "type": "blksp60",
              "colour": "red",
              "eng": "Opponent´s Slot Passes Blocked per 60",
              "desc": "Zblokované přihrávky soupeře do slotu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "shotsAssists": [
        {
          "name": "Přihrávky na střely",
          "name_en": "All shots assists",
          "type": "individual_shotsAssists",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SA",
              "type": "sa",
              "colour": "green",
              "eng": "Shot Assists",
              "desc": "Přihrávky na střelecké pokusy",
              "data": "count"
            },
            {
              "name": "SA/60",
              "type": "sa60",
              "colour": "green",
              "eng": "Shot Assists per 60",
              "desc": "Přihrávky na střelecké pokusy za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SA",
              "type": "crsa",
              "colour": "green",
              "eng": "Cross-ice Shot Assists",
              "desc": "Křižné přihrávky na střelecké pokusy",
              "data": "count"
            },
            {
              "name": "cr.SA/60",
              "type": "crsa60",
              "colour": "green",
              "eng": "Cross-ice Shot Assists per 60",
              "desc": "Křižné přihrávky na střelecké pokusy za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SA",
              "type": "bnsa",
              "colour": "green",
              "eng": "Behind-the-net Shot Assists",
              "desc": "Přihrávky zpoza branky na střelecké pokusy",
              "data": "count"
            },
            {
              "name": "bn.SA/60",
              "type": "bnsa60",
              "colour": "green",
              "eng": "Behind-the-net Shot Assists per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.SA",
              "type": "1tsa",
              "colour": "green",
              "eng": "One-timer Shot Assists",
              "desc": "Přihrávky na střelecké pokusy z první",
              "data": "count"
            },
            {
              "name": "1T.SA/60",
              "type": "1tsa60",
              "colour": "green",
              "eng": "One-timer Shot Assists per 60",
              "desc": "Přihrávky na střelecké pokusy z první za 60 minut",
              "data": "60"
            },
            {
              "name": "SA/SAF",
              "type": "sasaf",
              "colour": "green",
              "eng": "Individual shots Assists Production",
              "desc": "Podíl individálních přihrávek na střely pro tým s hráčem na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "slotShotsAssists": [
        {
          "name": "Přihrávky na střely ze slotu",
          "name_en": "All slot shots assists",
          "type": "individual_slotShotsAssists",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sSA",
              "type": "ssa",
              "colour": "green",
              "eng": "Slot Shot Assists",
              "desc": "Přihrávky na střelecké pokusy ze slotu",
              "data": "count"
            },
            {
              "name": "sSA/60",
              "type": "ssa60",
              "colour": "green",
              "eng": "Slot Shot Assists per 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.sSA",
              "type": "crssa",
              "colour": "green",
              "eng": "Cross-ice Slot Shot Assists",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu",
              "data": "count"
            },
            {
              "name": "cr.sSA/60",
              "type": "crssa60",
              "colour": "green",
              "eng": "Cross-ice Slot Shot Assists per 60",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.sSA",
              "type": "bnssa",
              "colour": "green",
              "eng": "Behind-the-net Slot Shot Assists",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu",
              "data": "count"
            },
            {
              "name": "bn.sSA/60",
              "type": "bnssa60",
              "colour": "green",
              "eng": "Behind-the-net Slot Shot Assists per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.sSA",
              "type": "1tssa",
              "colour": "green",
              "eng": "One-timer Slot Shot Assists",
              "desc": "Přihrávky na střelecké pokusy z první ze slotu",
              "data": "count"
            },
            {
              "name": "1T.sSA/60",
              "type": "1tssa60",
              "colour": "green",
              "eng": "One-timer Slot Shot Assists per 60",
              "desc": "Přihrávky na střelecké pokusy z první ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "sSA/sSAF",
              "type": "ssassaf",
              "colour": "green",
              "eng": "Individual Shots Assists Production",
              "desc": "Podíl individuálních přihrávek na střely ze slotu ze všech přihrávek na střely ze slotu pro tým s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "sSA/SA",
              "type": "ssasa",
              "colour": "green",
              "eng": "Percentage of Slot Shots Assists",
              "desc": "Podíl přihrávek na střely ze slotu ze všech přihrávek",
              "data": "percent"
            }
          ]
        }
      ],
      "shotType": [
        {
          "name": "Typ střely",
          "name_en": "Shot type",
          "type": "individual_shotType",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "R",
              "type": "r",
              "colour": "green",
              "eng": "Rebound shots",
              "desc": "Dorážky",
              "data": "count"
            },
            {
              "name": "R/60",
              "type": "r60",
              "colour": "green",
              "eng": "Rebound shots per 60",
              "desc": "Dorážky za 60 minut",
              "data": "60"
            },
            {
              "name": "RC",
              "type": "rc",
              "colour": "green",
              "eng": "Rebounds Created",
              "desc": "Střely přímo předcházející dorážce",
              "data": "count"
            },
            {
              "name": "RC/60",
              "type": "rc60",
              "colour": "green",
              "eng": "Rebounds Created per 60",
              "desc": "Střely přímo předcházející dorážce za 60 minut",
              "data": "60"
            },
            {
              "name": "1T",
              "type": "1t",
              "colour": "green",
              "eng": "One-timer",
              "desc": "Střelecké pokusy z první",
              "data": "count"
            },
            {
              "name": "1T/60",
              "type": "1t60",
              "colour": "green",
              "eng": "One-timer per 60",
              "desc": "Střelecké pokusy z první za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "zoneEntries": [
        {
          "name": "Kontrolované vstupy do pásma",
          "name_en": "Controlled zone entries",
          "type": "individual_zoneEntries",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "EN",
              "type": "en",
              "colour": "green",
              "eng": "Controlled Zone Entries",
              "desc": "Kontrolované vstupy do pásma",
              "data": "count"
            },
            {
              "name": "EN/60",
              "type": "en60",
              "colour": "green",
              "eng": "Controlled Zone Entries per 60",
              "desc": "Kontrolované vstupy do pásma za 60 minut",
              "data": "60"
            },
            {
              "name": "EN%",
              "type": "en_percent",
              "colour": "green",
              "eng": "% of Controlled Zone Entries of all Entries",
              "desc": "Podíl kontrolovaných vstupů do pásma ze součtu všech vstupů do pásma (kontrolované vstupy + nahození)",
              "data": "percent"
            },
            {
              "name": "EN.W",
              "type": "enw",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries",
              "desc": "Úspěšné kontrolované vstupy do pásma",
              "data": "count"
            },
            {
              "name": "EN.W/60",
              "type": "enw60",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries per 60",
              "desc": "Úspěšné kontrolované vstupy do pásma za 60 minut",
              "data": "60"
            },
            {
              "name": "EN.W/EN",
              "type": "enwen",
              "colour": "green",
              "eng": "% of Successful Controlled Zone Entries",
              "desc": "Podíl úspěšných kontrolovaných vstupů do pásma ze všech kontrolovaných vstupů do pásma.",
              "data": "percent"
            },
            {
              "name": "EN-DN",
              "type": "endn",
              "colour": "red",
              "eng": "Zone Entries Denials",
              "desc": "Zamezení kontrolovaného vstupu do pásma",
              "data": "count"
            },
            {
              "name": "EN-DN/60",
              "type": "endn60",
              "colour": "red",
              "eng": "Zone Entries Denials per 60",
              "desc": "Zamezení kontrolovaného vstupu do pásma za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "zoneEntriesLedingToShot": [
        {
          "name": "Střely po kontrolovaných vstupech",
          "name_en": "Controlled zone entries leading to shots",
          "type": "individual_zoneEntriesLedingToShot",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "EN→CF",
              "type": "encf",
              "colour": "green",
              "eng": "Zone Entries leading to Shots For",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "EN→CF/60",
              "type": "encf60",
              "colour": "green",
              "eng": "Zone Entries leading to Shots For per 60",
              "desc": "Kontrolované vstupy hráče do pásma s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "EN→CF%",
              "type": "encf_percent",
              "colour": "green",
              "eng": "Zone Entries leading to Shots For %",
              "desc": "Podíl kontrolovaných vstupů hráče do pásma s následným střeleckým pokusem pro tým ze všech kontrolovaných vstupů hráče do pásma",
              "data": "percent"
            },
            {
              "name": "EN→sCF",
              "type": "enscf",
              "colour": "green",
              "eng": "Zone Entries leading to Slot Shots For",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "EN→sCF/60",
              "type": "enscf60",
              "colour": "green",
              "eng": "Zone Entries leading to Slot Shots For per 60",
              "desc": "Kontrolované vstupy hráče do pásma s následným střeleckým pokusem ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "EN→sCF%",
              "type": "enscf_percent",
              "colour": "green",
              "eng": "Zone Entries leading to Slot Shots For %",
              "desc": "Podíl kontrolovaných vstupů hráče do pásma s následným střeleckým pokusem ze slotu pro tým ze všech kontrolovaných vstupů hráče do pásma",
              "data": "percent"
            },
            {
              "name": "EN→GF",
              "type": "en_gf",
              "colour": "green",
              "eng": "Zone Entries leading to Goals For",
              "desc": "Kontrolované vstupy do pásma s následným gólem pro tým",
              "data": "count"
            },
            {
              "name": "EN→GF/60",
              "type": "engf60",
              "colour": "green",
              "eng": "Zone Entries leading to Goals For per 60",
              "desc": "Kontrolované vstupy hráče do pásma s následným gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "EN→GF%",
              "type": "engf_percent",
              "colour": "green",
              "eng": "Zone Entries leading to Goals For %",
              "desc": "Podíl kontrolovaných vstupů hráče do pásma s následným gólem pro tým ze všech kontrolovaných vstupů hráče do pásma",
              "data": "percent"
            },
            {
              "name": "xGF.EN",
              "type": "xgfen",
              "colour": "green",
              "eng": "Expected goals For from Zone Entries",
              "desc": "Očekávané góly pro tým po kontrolovaných vstupech hráče do pásma s následným střeleckým pokusem",
              "data": "count"
            },
            {
              "name": "xGF.EN/60",
              "type": "xgfen60",
              "colour": "green",
              "eng": "Expected goals For from Zone Entries per 60",
              "desc": "Očekávané góly pro tým po kontrolovaných vstupech hráče do pásma s následným střeleckým pokusem za 60 minut",
              "data": "60"
            },
            {
              "name": "EN/ENF",
              "type": "enenf",
              "colour": "green",
              "eng": "Player´s on-ice share of Zone Entries",
              "desc": "Podíl kontrolovaných vstupů hráče do pásma ze všech kontrolovaných vstupů pro tým s hráčem na ledě",
              "data": "count"
            }
          ]
        }
      ],
      "zoneExits": [
        {
          "name": "Kontrolované výstupy z pásma",
          "name_en": "Controlled zone exits",
          "type": "individual_zoneExits",
          "select_type": 2,
          "enabled": true,
          "attributes": [
            {
              "name": "EX",
              "type": "ex",
              "colour": "red",
              "eng": "Controlled Zone Exits",
              "desc": "Kontrolované výstupy z pásma",
              "data": "count"
            },
            {
              "name": "EX/60",
              "type": "ex60",
              "colour": "red",
              "eng": "Controlled Zone Exits per 60",
              "desc": "Kontrolované výstupy z pásma za 60 minut",
              "data": "60"
            },
            {
              "name": "EX%",
              "type": "ex_percent",
              "colour": "red",
              "eng": "% of Controlled Zone Exits of all Exits",
              "desc": "Podíl kontrolovaných výstupů z pásma ze součtu všech výstupů z pásma (kontrolované výstupy + vyhození)",
              "data": "percent"
            },
            {
              "name": "EX.W",
              "type": "exw",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits",
              "desc": "Úspěšné kontrolované výstupy z pásma",
              "data": "count"
            },
            {
              "name": "EX.W/60",
              "type": "exw60",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits per 60",
              "desc": "Úspěšné kontrolované výstupy z pásma za 60 minut",
              "data": "60"
            },
            {
              "name": "EX.W/EX",
              "type": "exwex",
              "colour": "red",
              "eng": "% of Successful Controlled Zone Exits",
              "desc": "Podíl úspěšných kontrolovaných výstupů z pásma ze všech kontrolovaných výstupů z pásma. ",
              "data": "percent"
            },
            {
              "name": "EXC",
              "type": "exc",
              "colour": "red",
              "eng": "Controlled Zone Exits by Carry-in",
              "desc": "Kontrolované výstupy z pásma vyvezením",
              "data": "count"
            },
            {
              "name": "EXC/60",
              "type": "exc60",
              "colour": "red",
              "eng": "Controlled Zone Exits by Carry-in per 60",
              "desc": "Kontrolované výstupy z pásma vyvezením za 60 minut",
              "data": "60"
            },
            {
              "name": "EXP",
              "type": "exp",
              "colour": "red",
              "eng": "Controlled Zone Exits by Pass",
              "desc": "Kontrolované výstupy z pásma přihrávkou",
              "data": "count"
            },
            {
              "name": "EXP/60",
              "type": "exp60",
              "colour": "red",
              "eng": "Controlled Zone Exits by Pass per 60",
              "desc": "Kontrolované výstupy z pásma přihrávkou za 60 minut",
              "data": "60"
            },
            {
              "name": "EXstP",
              "type": "exstp",
              "colour": "red",
              "eng": "Controlled Zone Exits by Strech Pass",
              "desc": "Kontrolované výstupy z pásma přihrávkou za červenou čáru",
              "data": "count"
            },
            {
              "name": "EXstP/60",
              "type": "exstp60",
              "colour": "red",
              "eng": "Controlled Zone Exits by Strech Pass per 60",
              "desc": "Kontrolované výstupy z pásma přihrávkou za červenou čáru za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "dumpins": [
        {
          "name": "Nahození",
          "name_en": "dumpins",
          "type": "individual_dumpins",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DI",
              "type": "di",
              "colour": "green",
              "eng": "Dump-ins",
              "desc": "Nahození puku hráčem",
              "data": "count"
            },
            {
              "name": "DI/60",
              "type": "di60",
              "colour": "green",
              "eng": "Dump-ins per 60",
              "desc": "Nahození puku hráčem za 60 minut",
              "data": "60"
            },
            {
              "name": "DIB",
              "type": "dib",
              "colour": "green",
              "eng": "Dump-in Battles",
              "desc": "Souboje po nahození puku hráčem",
              "data": "count"
            },
            {
              "name": "DIB/60",
              "type": "dib60",
              "colour": "green",
              "eng": "Dump-in Battles per 60",
              "desc": "Souboje po nahození puku hráčem za 60 minut",
              "data": "60"
            },
            {
              "name": "DIB%",
              "type": "dib_percent",
              "colour": "green",
              "eng": "Dump-in Battles %",
              "desc": "Podíl nahození hráče s následným soubojem ze všech nahození",
              "data": "percent"
            },
            {
              "name": "DIBW",
              "type": "dibw",
              "colour": "green",
              "eng": "Dump-in Battles Won",
              "desc": "Nahození hráče s následným vyhraným soubojem",
              "data": "count"
            },
            {
              "name": "DIBW/60",
              "type": "dibw60",
              "colour": "green",
              "eng": "Dump-in Battles Won per 60",
              "desc": "Nahození hráče s následným vyhraným soubojem za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBW%",
              "type": "dibw_percent",
              "colour": "green",
              "eng": "Dump-in Battles Won %",
              "desc": "Podíl nahození hráče s následným vyhraným soubojem ze všech nahození hráče s následným soubojem",
              "data": "percent"
            }
          ]
        }
      ],
      "dumpinsToShots": [
        {
          "name": "Střely po nahození",
          "name_en": "Dump-ins leading to shots",
          "type": "individual_dumpinsToShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DI→CF",
              "type": "dicf",
              "colour": "green",
              "eng": "Dump-ins leading to Shot For",
              "desc": "Nahození hráče s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "DI→CF/60",
              "type": "dicf60",
              "colour": "green",
              "eng": "Dump-ins leading to Shot For per 60",
              "desc": "Nahození hráče s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DI→CF%",
              "type": "dicf_percent",
              "colour": "green",
              "eng": "Dump-ins leading to Shot For %",
              "desc": "Podíl nahození hráče s následným střeleckým pokusem ze slotu pro tým ze všech nahození hráče",
              "data": "percent"
            },
            {
              "name": "DI→sCF",
              "type": "discf",
              "colour": "green",
              "eng": "Dump-ins leading to Slot Shots For",
              "desc": "Nahození hráče s následným střeleckým pokusem ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "DI→sCF/60",
              "type": "discf60",
              "colour": "green",
              "eng": "Dump-ins leading to Slot Shots For per 60",
              "desc": "Nahození hráče s následným střeleckým pokusem ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DI→sCF%",
              "type": "discf_percent",
              "colour": "green",
              "eng": "Dump-ins leading to Slot Shots For %",
              "desc": "Podíl nahození hráče s následným střeleckým pokusem ze slotu pro tým ze všech nahození hráče",
              "data": "percent"
            },
            {
              "name": "DI→GF",
              "type": "digf",
              "colour": "green",
              "eng": "Dump-ins leading to Goals For",
              "desc": "Nahození hráče s následným gólem pro tým",
              "data": "count"
            },
            {
              "name": "DI→GF/60",
              "type": "digf60",
              "colour": "green",
              "eng": "Dump-ins leading to Goals For per 60",
              "desc": "Nahození hráče s následným gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DI→GF%",
              "type": "digf_percent",
              "colour": "green",
              "eng": "Dump-ins leading to Goals For %",
              "desc": "Podíl nahození hráče s následným gólem pro tým ze všech nahození hráče",
              "data": "percent"
            },
            {
              "name": "xGF.DI",
              "type": "xgfdi",
              "colour": "green",
              "eng": "Expected goals For from Dump-ins",
              "desc": "Očekávané góly pro tým po nahození hráče s následným střeleckým pokusem",
              "data": "count"
            },
            {
              "name": "xGF.DI/60",
              "type": "xgfdi60",
              "colour": "green",
              "eng": "Expected goals For from Dump-ins per 60",
              "desc": "Očekávané góly pro tým po nahození hráče s následným střeleckým pokusem za 60 minut",
              "data": "60"
            },
            {
              "name": "DI/DIF",
              "type": "didif",
              "colour": "green",
              "eng": "Player´s on-ice share of Dump-ins",
              "desc": "Podíl nahození hráče ze všech nahození pro tým s hráčem na ledě",
              "data": "count"
            }
          ]
        }
      ],
      "dumpouts": [
        {
          "name": "Vyhození",
          "name_en": "Dump-outs",
          "type": "individual_dumpouts",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DO",
              "type": "do",
              "colour": "red",
              "eng": "Dump-outs",
              "desc": "Vyhození puku hráčem",
              "data": "count"
            },
            {
              "name": "DO/60",
              "type": "do60",
              "colour": "red",
              "eng": "Dump-outs per 60",
              "desc": "Vyhození puku hráčem za 60 minut",
              "data": "60"
            },
            {
              "name": "DOB",
              "type": "dob",
              "colour": "green",
              "eng": "Dump-out Battles",
              "desc": "Souboje po vyhození puku hráčem",
              "data": "count"
            },
            {
              "name": "DOB/60",
              "type": "dob60",
              "colour": "green",
              "eng": "Dump-out Battles per 60",
              "desc": "Souboje po vyhození puku hráčem za 60 minut",
              "data": "60"
            },
            {
              "name": "DOB%",
              "type": "dob_percent",
              "colour": "green",
              "eng": "Dump-out Battles %",
              "desc": "Podíl vyhození hráče s následným soubojem ze všech vyhození hráče ",
              "data": "percent"
            },
            {
              "name": "DOBW",
              "type": "dobw",
              "colour": "green",
              "eng": "Dump-out Battles Won",
              "desc": "Vyhození hráče s následným vyhraným soubojem",
              "data": "count"
            },
            {
              "name": "DOBW/60",
              "type": "dobw60",
              "colour": "green",
              "eng": "Dump-out Battles Won per 60",
              "desc": "Vyhození hráče s následným vyhraným soubojem za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBW%",
              "type": "dobw_percent",
              "colour": "green",
              "eng": "Dump-out Battles Won %",
              "desc": "Podíl vyhození hráče  s následným vyhraným soubojem ze všech vyhození hráče s následným soubojem",
              "data": "percent"
            }
          ]
        }
      ],
      "dumpoutsToShots": [
        {
          "name": "Střely po vyhození",
          "name_en": "Dump-outs leading to shots",
          "type": "individual_dumpoutsToShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DO→CF",
              "type": "docf",
              "colour": "green",
              "eng": "Dump-outs leading to Shots For",
              "desc": "Vyhození hráče s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "DO→CF/60",
              "type": "docf60",
              "colour": "green",
              "eng": "Dump-outs leading to Shots For per 60",
              "desc": "Vyhození hráče s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DO→CF%",
              "type": "docf_percent",
              "colour": "green",
              "eng": "Dump-outs leading to Shots For %",
              "desc": "Podíl vyhození hráče s následným střeleckým pokusem ze slotu pro tým ze všech vyhození hráče",
              "data": "percent"
            },
            {
              "name": "DO→sCF",
              "type": "doscf",
              "colour": "green",
              "eng": "Dump-outs leading to Slot Shots For",
              "desc": "Vyhození hráče s následným střeleckým pokusem ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "DO→sCF/60",
              "type": "doscf60",
              "colour": "green",
              "eng": "Dump-outs leading to Slot Shots For per 60",
              "desc": "Vyhození hráče s následným střeleckým pokusem ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DO→sCF%",
              "type": "doscf_percent",
              "colour": "green",
              "eng": "Dump-outs leading to Slot Shots For %",
              "desc": "Podíl vyhození hráče s následným střeleckým pokusem ze slotu pro tým ze všech vyhození hráče",
              "data": "percent"
            },
            {
              "name": "DO→GF",
              "type": "dogf",
              "colour": "green",
              "eng": "Dump-outs leading to Goals For",
              "desc": "Vyhození hráče s následným gólem pro tým",
              "data": "count"
            },
            {
              "name": "DO→GF/60",
              "type": "dogf60",
              "colour": "green",
              "eng": "Dump-outs leading to Goals For per 60",
              "desc": "Vyhození hráče s následným gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DO→GF%",
              "type": "dogf_percent",
              "colour": "green",
              "eng": "Dump-outs leading to Goals For %",
              "desc": "Podíl vyhození hráče s následným gólem pro tým ze všech vyhození hráče",
              "data": "percent"
            },
            {
              "name": "xGF.DO",
              "type": "xgfdo",
              "colour": "green",
              "eng": "Expected goals For from Dump-outs",
              "desc": "Očekávané góly pro tým po vyhození hráče s následným střeleckým pokusem",
              "data": "count"
            },
            {
              "name": "xGF.DO/60",
              "type": "xgfdo60",
              "colour": "green",
              "eng": "Expected goals For from Dump-outs per 60",
              "desc": "Očekávané góly pro tým po vyhození hráče s následným střeleckým pokusem za 60 minut",
              "data": "60"
            },
            {
              "name": "DO/DOF",
              "type": "dodof",
              "colour": "green",
              "eng": "Player´s on-ice share of Dump-outs",
              "desc": "Podíl vyhození hráče ze všech vyhození pro tým s hráčem na ledě",
              "data": "count"
            }
          ]
        }
      ],
      "penaltiesDrawn": [
        {
          "name": "Získané početní výhody",
          "name_en": "Penalties drawn",
          "type": "individual_penaltiesDrawn",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "PIM",
              "type": "pim",
              "colour": "white",
              "eng": "Penalty Minutes Taken",
              "desc": "Trestné minuty udělené hráči",
              "data": "count"
            },
            {
              "name": "PIM/60",
              "type": "pim60",
              "colour": "white",
              "eng": "Penalty Minutes Taken per 60",
              "desc": "Trestné minuty udělené hráči za 60 minut",
              "data": "60"
            },
            {
              "name": "PIMD",
              "type": "pimd",
              "colour": "white",
              "eng": "Penalty Minutes Drawn",
              "desc": "Trestné minuty získané hráčem",
              "data": "count"
            },
            {
              "name": "PIMD/60",
              "type": "pimd60",
              "colour": "white",
              "eng": "Penalty Minutes Drawn per 60",
              "desc": "Trestné minuty získané hráčem za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "qualityOfTeammates": [
        {
          "name": "Kvalita spoluhráčů",
          "name_en": "Quality of teammates",
          "type": "individual_qualityOfTeammates",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "QT.sCF/60",
              "type": "qtscf60",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita spoluhráčů podle střeleckých pokusů ze slotu pro tým",
              "data": "60"
            },
            {
              "name": "QT.sCA/60",
              "type": "qtsca60",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita spoluhráčů podle střeleckých pokusů ze slotu proti týmu",
              "data": "60"
            },
            {
              "name": "QT.sCF%",
              "type": "qtscf_percent",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita spoluhráčů podle podílu střeleckých pokusů ze slotu pro tým",
              "data": "percent"
            },
            {
              "name": "QT-F.TOI",
              "type": "qtftoi",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita spoluhráčů-útočníků podle odehraného času na ledě",
              "data": "count"
            },
            {
              "name": "QT-D.TOI",
              "type": "qtdtoi",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita spoluhráčů-obránců podle odehraného času na ledě",
              "data": "count"
            },

            {
              "name": "raw QT.sCF/60",
              "type": "raw QT.sCF/60",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita spoluhráčů podle střeleckých pokusů ze slotu pro tým",
              "data": "60"
            },
            {
              "name": "raw QT.sCA/60",
              "type": "raw QT.sCA/60",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita spoluhráčů podle střeleckých pokusů ze slotu proti týmu",
              "data": "60"
            },
            {
              "name": "raw QT.sCF%",
              "type": "raw QT.sCF%",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita spoluhráčů podle podílu střeleckých pokusů ze slotu pro tým",
              "data": "percent"
            },
            {
              "name": "raw QT-F.TOI",
              "type": "raw QT-F.TOI",
              "colour": "white",
              "eng": "",
              "desc": "pro útočníky",
              "data": "count"
            },
            {
              "name": "raw QT-D.TOI",
              "type": "raw QT-D.TOI",
              "colour": "white",
              "eng": "",
              "desc": "pro obránce",
              "data": "count"
            }
          ]
        }
      ],
      "qualityOfOpponents": [
        {
          "name": "Kvalita protihráčů",
          "name_en": "Quality of opponents",
          "type": "individual_qualityOfOpponents",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "QO.sCF/60",
              "type": "qoscf60",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita protihráčů podle střeleckých pokusů ze slotu pro tým",
              "data": "60"
            },
            {
              "name": "QO.sCA/60",
              "type": "qosca60",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita protihráčů podle střeleckých pokusů ze slotu proti týmu",
              "data": "60"
            },
            {
              "name": "QO.sCF%",
              "type": "qoscf_percent",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita protihráčů podle podílu střeleckých pokusů ze slotu pro tým",
              "data": "percent"
            },
            {
              "name": "QO-F.TOI",
              "type": "qoftoi",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita protihráčů-útočníků podle odehraného času na ledě",
              "data": "count"
            },
            {
              "name": "QO-D.TOI",
              "type": "qodtoi",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita protihráčů-obránců podle odehraného času na ledě",
              "data": "count"
            },

            {
              "name": "raw QO.sCF/60",
              "type": "raw QO.sCF/60",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita protihráčů podle střeleckých pokusů ze slotu pro tým",
              "data": "60"
            },
            {
              "name": "raw QO.sCA/60",
              "type": "raw QO.sCA/60",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita protihráčů podle střeleckých pokusů ze slotu proti týmu",
              "data": "60"
            },
            {
              "name": "raw QO.sCF%",
              "type": "raw QO.sCF%",
              "colour": "white",
              "eng": "",
              "desc": "Kvalita protihráčů podle podílu střeleckých pokusů ze slotu pro tým",
              "data": "percent"
            },
            {
              "name": "raw QO-F.TOI",
              "type": "raw QO-F.TOI",
              "colour": "white",
              "eng": "",
              "desc": "pro útočníky",
              "data": "count"
            },
            {
              "name": "raw QO-D.TOI",
              "type": "raw QO-D.TOI",
              "colour": "white",
              "eng": "",
              "desc": "pro obránce",
              "data": "count"
            }
          ]
        }
      ],
      "puckWonOrLostToShot": [
        {
          "name": "Zisky a Ztráty puku před střelou",
          "name_en": "Puck won or lost to shot",
          "type": "puckWonOrLostToShot",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "pW→CF",
              "type": "pwcf",
              "colour": "green",
              "eng": "Puck Won to Shot For",
              "desc": "Zisky puku před střelou pro tým",
              "data": "count"
            },
            {
              "name": "pW→CF/60",
              "type": "pwcf60",
              "colour": "green",
              "eng": "Puck Won to Shot For per 60",
              "desc": "Zisky puku před střelou pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "pW→GF",
              "type": "pwgf",
              "colour": "green",
              "eng": "Puck Won to Goal For",
              "desc": "Zisky puku před gólem pro tým",
              "data": "count"
            },
            {
              "name": "pW→GF/60",
              "type": "pwgf60",
              "colour": "green",
              "eng": "Puck Won to Goal For per 60",
              "desc": "Zisky puku před gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.pW→CF",
              "type": "ozpwcf",
              "colour": "green",
              "eng": "Offensive Zone Puck Won to Shot For",
              "desc": "Zisky puku v útočném pásmu před střelou pro tým",
              "data": "count"
            },
            {
              "name": "OZ.pW→CF/60",
              "type": "ozpwcf60",
              "colour": "green",
              "eng": "Offensive Zone Puck Won to Shot For per 60",
              "desc": "Zisky puku v útočném pásmu před střelou pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.pW→GF",
              "type": "ozpwgf",
              "colour": "green",
              "eng": "Offensive Zone Puck Won to Goal For",
              "desc": "Zisky puku v útočném pásmu před gólem pro tým",
              "data": "count"
            },
            {
              "name": "OZ.pW→GF/60",
              "type": "ozpwgf60",
              "colour": "green",
              "eng": "Offensive Zone Puck Won to Goal For",
              "desc": "Zisky puku v útočném pásmu před gólem pro tým",
              "data": "60"
            },

            {
              "name": "pL→CA",
              "type": "plca",
              "colour": "red",
              "eng": "Puck Lost to Shot Against",
              "desc": "Ztráty puku před střelou soupeře",
              "data": "count"
            },
            {
              "name": "pL→CA/60",
              "type": "plca60",
              "colour": "red",
              "eng": "Puck Lost to Shot Against per 60",
              "desc": "Ztráty puku před střelou soupeře za 60 minut",
              "data": "60"
            },
            {
              "name": "pL→GA",
              "type": "plga",
              "colour": "red",
              "eng": "Puck Lost to Goal Against",
              "desc": "Ztráty puku před gólem soupeře",
              "data": "count"
            },
            {
              "name": "pL→GA/60",
              "type": "plga60",
              "colour": "red",
              "eng": "Puck Lost to Goal Against per 60",
              "desc": "Ztráty puku před gólem soupeře za 60 minut",
              "data": "60"
            },
            {
              "name": "DZ.pL→CA",
              "type": "dzplca",
              "colour": "red",
              "eng": "Defensive Zone Puck Lost to Shot Against",
              "desc": "Ztráty puku v obranném pásmu před střelou soupeře",
              "data": "count"
            },
            {
              "name": "DZ.pL→CA/60",
              "type": "dzplca60",
              "colour": "red",
              "eng": "Defensive Zone Puck Lost to Shot Against per 60",
              "desc": "Ztráty puku v obranném pásmu před střelou soupeře za 60 minut",
              "data": "60"
            },
            {
              "name": "DZ.pL→GA",
              "type": "dzplga",
              "colour": "red",
              "eng": "Defensive Zone Puck Lost to Goal Against",
              "desc": "Ztráty puku v obranném pásmu před gólem soupeře",
              "data": "count"
            },
            {
              "name": "DZ.pL→GA/60",
              "type": "dzplga60",
              "colour": "red",
              "eng": "Defensive Zone Puck Lost to Goal Against per 60",
              "desc": "Ztráty puku v obranném pásmu před gólem soupeře za 60 minut",
              "data": "60"
            }
          ]
        }
      ]
    }
  ],
  "onIce": [
    {
      "allShots": [
        {
          "name": "Střelecké pokusy",
          "name_en": "All shot attempts",
          "type": "onice_allShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "CF",
              "type": "cf",
              "colour": "green",
              "eng": "Corsi For",
              "desc": "Střelecké pokusy pro tým",
              "data": "count"
            },
            {
              "name": "CA",
              "type": "ca",
              "colour": "red",
              "eng": "Corsi Against",
              "desc": "Střelecké pokusy proti týmu",
              "data": "count"
            },
            {
              "name": "CF/60",
              "type": "cf60",
              "colour": "green",
              "eng": "Corsi For per 60",
              "desc": "Střelecké pokusy pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "CA/60",
              "type": "ca60",
              "colour": "red",
              "eng": "Corsi Against per 60",
              "desc": "Střelecké pokusy proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "CF%",
              "type": "cf_percent",
              "colour": "green",
              "eng": "Corsi For %",
              "desc": "Podíl střeleckých pokusů pro tým ze součtu střeleckých pokusů pro a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.CSh%",
              "type": "oncsh_percent",
              "colour": "green",
              "eng": "ON-ICE Corsi Shooting %",
              "desc": "Podíl vstřelených gólů ze všech střeleckých pokusů pro tým",
              "data": "percent"
            },
            {
              "name": "ON.CSv%",
              "type": "oncsv_percent",
              "colour": "red",
              "eng": "ON-ICE Corsi Save %",
              "desc": "Podíl obdržených gólů ze všech střeleckých pokusů proti týmu",
              "data": "percent"
            },
            {
              "name": "CF/60 Rel",
              "type": "cf60_rel",
              "colour": "green",
              "eng": "Corsi For per 60 Relative",
              "desc": "Rozdíl mezi střelami pro tým za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "CA/60 Rel",
              "type": "ca60_rel",
              "colour": "red",
              "eng": "Corsi Against per 60 Relative",
              "desc": "Rozdíl mezi střelami proti týmu za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "CF% Rel",
              "type": "cf_percent_rel",
              "colour": "green",
              "eng": "Corsi For % Relative",
              "desc": "Rozdíl mezi podíly všech střel pro tým ze všech střel pro i proti týmu s hráčem na ledě a bez hráče na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "unblockedShots": [
        {
          "name": "Nezblokované střely",
          "name_en": "All unblocked shots",
          "type": "onice_unblockedShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "FF",
              "type": "ff",
              "colour": "green",
              "eng": "Fenwick For",
              "desc": "Nezblokované střely pro tým",
              "data": "count"
            },
            {
              "name": "FA",
              "type": "fa",
              "colour": "red",
              "eng": "Fenwick Against",
              "desc": "Nezblokované střely proti týmu",
              "data": "count"
            },
            {
              "name": "FF/60",
              "type": "ff60",
              "colour": "green",
              "eng": "Fenwick For per 60",
              "desc": "Nezblokované střely pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "FA/60",
              "type": "fa60",
              "colour": "red",
              "eng": "Fenwick Against per 60",
              "desc": "Nezblokované střely proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "FF%",
              "type": "ff_percent",
              "colour": "green",
              "eng": "Fenwick For %",
              "desc": "Podíl nezblokovaných střel pro tým ze součtu nezblokovaných střel pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.FSh%",
              "type": "onfsh_percent",
              "colour": "red",
              "eng": "ON-ICE Fenwick Save %",
              "desc": "Podíl obdržených gólů ze všech nezblokovaných střel proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.FSv%",
              "type": "onfsv_percent",
              "colour": "green",
              "eng": "ON-ICE Fenwick Shooting %",
              "desc": "Podíl vstřelených gólů ze všech nezblokovaných střel pro tým",
              "data": "percent"
            },
            {
              "name": "FF/60 Rel",
              "type": "ff60_rel",
              "colour": "green",
              "eng": "Fenwick For per 60 Relative",
              "desc": "Rozdíl mezi nezblokovanými střelami pro tým za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "FA/60 Rel",
              "type": "fa60_rel",
              "colour": "red",
              "eng": "Fenwick Against per 60 Relative",
              "desc": "Rozdíl mezi nezblokovanými střelami proti týmu za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "FF% Rel",
              "type": "ff_percent_rel",
              "colour": "green",
              "eng": "Fenwick For % Relative",
              "desc": "Rozdíl mezi podíly nezblokovaných střel pro tým ze všech nezblokovaných střel pro i proti týmu s hráčem na ledě a bez hráče na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "shotsOnGoal": [
        {
          "name": "Střely na branku",
          "name_en": "Shots on goal",
          "type": "onice_shotsOnGoal",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SOGF",
              "type": "sogf",
              "colour": "green",
              "eng": "Shots On Goal For",
              "desc": "Střely na branku pro tým",
              "data": "count"
            },
            {
              "name": "SOGA",
              "type": "soga",
              "colour": "red",
              "eng": "Shots On Goal Against",
              "desc": "Střely na branku proti týmu",
              "data": "count"
            },
            {
              "name": "SOGF/60",
              "type": "sogf60",
              "colour": "green",
              "eng": "Shots On Goal For per 60",
              "desc": "Střely na branku pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGA/60",
              "type": "soga60",
              "colour": "red",
              "eng": "Shots On Goal Against per 60",
              "desc": "Střely na branku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGF%",
              "type": "sogf_percent",
              "colour": "green",
              "eng": "Shots On Goal For %",
              "desc": "Podíl střel na branku pro tým ze součtu střel na branku pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.Sh%",
              "type": "onsh_percent",
              "colour": "green",
              "eng": "ON-ICE Shooting %",
              "desc": "Podíl vstřelených gólů ze všech střel na branku pro tým",
              "data": "percent"
            },
            {
              "name": "ON.Sv%",
              "type": "onsv_percent",
              "colour": "red",
              "eng": "ON-ICE Save %",
              "desc": "Podíl obdržených gólů ze všech střel na branku proti týmu",
              "data": "percent"
            },
            {
              "name": "SOGF/60 Rel",
              "type": "sogf60_rel",
              "colour": "green",
              "eng": "Shots On Goal For per 60 Relative",
              "desc": "Rozdíl mezi střelami na branku pro tým za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "SOGA/60 Rel",
              "type": "soga60_rel",
              "colour": "red",
              "eng": "Shots On Goal Against per 60 Relative",
              "desc": "Rozdíl mezi střelami na branku proti týmu za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "SOGF% Rel",
              "type": "sogf_percent_rel",
              "colour": "green",
              "eng": "Shots On Goal For % Relative",
              "desc": "Rozdíl mezi podíly střel na branku pro tým ze všech střel na branku pro i proti týmu s hráčem na ledě a bez hráče na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "slotShots": [
        {
          "name": "Střelecké pokusy ze slotu",
          "name_en": "Slot shot attempts (scoring chances)",
          "type": "onice_slotShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sCF",
              "type": "scf",
              "colour": "green",
              "eng": "Slot Shot Attempts For ",
              "desc": "Střelecké pokusy ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "sCA",
              "type": "sca",
              "colour": "red",
              "eng": "Slot Shot Attempts Against",
              "desc": "Střelecké pokusy ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sCF/60",
              "type": "scf60",
              "colour": "green",
              "eng": "Slot Shot Attempts For per 60",
              "desc": "Střelecké pokusy ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sCA/60",
              "type": "sca60",
              "colour": "red",
              "eng": "Slot Shot Attempts Against per 60",
              "desc": "Střelecké pokusy ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "sCF%",
              "type": "scf_percent",
              "colour": "green",
              "eng": "Slot Shot Attempts For %",
              "desc": "Podíl střeleckých pokusů ze slotu pro tým ze součtu střeleckých pokusů ze slotu pro a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.sCh%",
              "type": "onsch_percent",
              "colour": "green",
              "eng": "ON-ICE Slot Shot Attempts Shooting %",
              "desc": "Podíl vstřelených gólů ze všech střeleckých pokusů ze slotu pro tým",
              "data": "percent"
            },
            {
              "name": "ON.sCv%",
              "type": "onscv_percent",
              "colour": "red",
              "eng": "ON-ICE Slot Shot Attempts Save %",
              "desc": "Podíl obdržených gólů ze všech střeleckých pokusů ze slotu proti týmu",
              "data": "percent"
            },
            {
              "name": "sCF/60 Rel",
              "type": "scf60_rel",
              "colour": "green",
              "eng": "All Slot Shots For per 60 Relative",
              "desc": "Rozdíl mezi střelami ze slotu pro tým za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "sCA/60 Rel",
              "type": "sca60_rel",
              "colour": "red",
              "eng": "All Slot Shots Against per 60 Relative",
              "desc": "Rozdíl mezi střelami ze slotu proti týmu za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "sCF% Rel",
              "type": "scf_percent_rel",
              "colour": "red",
              "eng": "All Slot Shots For % Relative",
              "desc": "Rozdíl mezi podíly střel ze slotu pro tým ze všech střel ze slotu pro i proti týmu s hráčem na ledě a bez hráče na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "slotShotsOnGoal": [
        {
          "name": "Střely na branku ze slotu",
          "name_en": "Slot shots on goal",
          "type": "onice_slotShotsOnGoal",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sSOGF",
              "type": "ssogf",
              "colour": "green",
              "eng": "Slot Shots On Goal For",
              "desc": "Střely na branku ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "sSOGA",
              "type": "ssoga",
              "colour": "red",
              "eng": "Slot Shots On Goal Against",
              "desc": "Střely na branku ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sSOGF/60",
              "type": "ssogf60",
              "colour": "green",
              "eng": "Slot Shots On Goal For per 60",
              "desc": "Střely na branku ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sSOGA/60",
              "type": "ssoga60",
              "colour": "red",
              "eng": "Slot Shots On Goal Against per 60",
              "desc": "Střely na branku ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "sSOGF%",
              "type": "ssogf_percent",
              "colour": "green",
              "eng": "Slot Shots On Goal For %",
              "desc": "Podíl střel na branku ze slotu pro tým ze součtu všech střel na branku ze slotu pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.sSh%",
              "type": "onssh_percent",
              "colour": "green",
              "eng": "ON-ICE Slot Shooting %",
              "desc": "Podíl vstřelených gólů ze všech střel na branku ze slotu pro tým",
              "data": "percent"
            },
            {
              "name": "ON.sSv%",
              "type": "onssv_percent",
              "colour": "red",
              "eng": "ON-ICE Slot Save %",
              "desc": "Podíl obdržených gólů ze všech střel na branku ze slotu proti týmu",
              "data": "percent"
            },
            {
              "name": "sSOGF/60 Rel",
              "type": "ssogf60_rel",
              "colour": "green",
              "eng": "Slot Shots On Goal For per 60 Relative",
              "desc": "Rozdíl mezi střelami na branku ze slotu pro tým za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "sSOGA/60 Rel",
              "type": "ssoga60_rel",
              "colour": "red",
              "eng": "Slot Shots On Goal Against per 60 Relative",
              "desc": "Rozdíl mezi střelami na branku ze slotu proti týmu za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "sSOGF% Rel",
              "type": "ssogf_percent_rel",
              "colour": "red",
              "eng": "Slot Shots On Goal For % Relative",
              "desc": "Rozdíl mezi podíly střel na branku ze slotu pro tým ze všech střel na branku ze slotu pro i proti týmu s hráčem na ledě a bez hráče na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "expected_goals": [
        {
          "name": "Očekávané góly",
          "name_en": "Expected goals",
          "type": "expected_goals",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "xGF",
              "type": "xgf",
              "colour": "green",
              "eng": "Expected Goals For",
              "desc": "Očekávané góly pro tým",
              "data": "count"
            },
            {
              "name": "xGA",
              "type": "xga",
              "colour": "red",
              "eng": "Expected Goals Against",
              "desc": "Očekávané góly proti týmu",
              "data": "count"
            },
            {
              "name": "xGF/60",
              "type": "xgf60",
              "colour": "green",
              "eng": "Expected Goals For per 60",
              "desc": "Očekávané góly pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "xGA/60",
              "type": "xga60",
              "colour": "red",
              "eng": "Expected Goals Against per 60",
              "desc": "Očekávané góly proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "xGF%",
              "type": "xgf_percent",
              "colour": "red",
              "eng": "Expected Goals For %",
              "desc": "Podíl očekávaných gólů pro tým ze součtu očekávaných gólů pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "xGF/CF%",
              "type": "xgfcf_percent",
              "colour": "green",
              "eng": "Expected Goals For per Shots For Percentage",
              "desc": "Průměrná pravděpodobnost vstřelení gólu z jednoho střeleckého pokusu pro tým (v %)",
              "data": "percent"
            },
            {
              "name": "xGA/CA%",
              "type": "xgaca_percent",
              "colour": "red",
              "eng": "Expected Goals Against per Shots Against Percentage",
              "desc": "Průměrná pravděpodobnost obržení gólu z jednoho střeleckého pokusu proti týmu (v %)",
              "data": "percent"
            },
            {
              "name": "xGF/60 Rel",
              "type": "xgf60_rel",
              "colour": "green",
              "eng": "Expected Goals For per 60 Relative",
              "desc": "Rozdíl mezi očekávanými góly pro tým za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "xGA/60 Rel",
              "type": "xga60_rel",
              "colour": "red",
              "eng": "Expected Goals Against per 60 Relative",
              "desc": "Rozdíl mezi očekávanými góly proti týmu za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "xGF% Rel",
              "type": "xgf_percent_rel",
              "colour": "green",
              "eng": "Expected Goals For % Relative",
              "desc": "Rozdíl mezi podíly očekávaných gólů pro tým ze všech očekávaných gólů pro i proti týmu s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            }
          ]
        }
      ],
      "goals": [
        {
          "name": "Góly",
          "name_en": "Goals",
          "type": "onice_goals",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "GF",
              "type": "gf",
              "colour": "green",
              "eng": "Goals For",
              "desc": "Góly pro tým",
              "data": "count"
            },
            {
              "name": "GA",
              "type": "ga",
              "colour": "red",
              "eng": "Goals Against",
              "desc": "Góly proti týmu",
              "data": "count"
            },
            {
              "name": "GF/60",
              "type": "gf60",
              "colour": "green",
              "eng": "Goals For per 60",
              "desc": "Góly pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "GA/60",
              "type": "ga60",
              "colour": "red",
              "eng": "Goals Against per 60",
              "desc": "Góly proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "GF%",
              "type": "gf_percent",
              "colour": "green",
              "eng": "Goals For %",
              "desc": "Podíl gólů pro tým ze součtu gólů pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "GF/60 Rel",
              "type": "gf60_rel",
              "colour": "green",
              "eng": "Goals For per 60 Relative",
              "desc": "Rozdíl mezi góly pro tým za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "GA/60 Rel",
              "type": "ga60_rel",
              "colour": "red",
              "eng": "Goals Against per 60 Relative",
              "desc": "Rozdíl mezi góly proti týmu za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "GF% Rel",
              "type": "gf_percent_rel",
              "colour": "green",
              "eng": "Goals For % Relative",
              "desc": "Rozdíl mezi podíly gólů pro tým ze všech gólů pro i proti týmu s hráčem na ledě a bez hráče na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "slotGoals": [
        {
          "name": "Góly ze slotu",
          "name_en": "Slot goals",
          "type": "onice_slotGoals",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sGF",
              "type": "sgf",
              "colour": "green",
              "eng": "Slot Goals For",
              "desc": "Góly ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "sGA",
              "type": "sga",
              "colour": "red",
              "eng": "Slot Goals Against",
              "desc": "Góly ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sGF/60",
              "type": "sgf60",
              "colour": "green",
              "eng": "Slot Goals For per 60",
              "desc": "Góly ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sGA/60",
              "type": "sga60",
              "colour": "red",
              "eng": "Slot Goals Against per 60",
              "desc": "Góly ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "sGF%",
              "type": "sgf_percent",
              "colour": "green",
              "eng": "Slot Goals For %",
              "desc": "Podíl gólů ze slotu pro tým ze součtu gólů ze slotu pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "sGF/60 Rel",
              "type": "sgf60_rel",
              "colour": "green",
              "eng": "Slot Goals For per 60 Relative",
              "desc": "Rozdíl mezi góly ze slotu pro tým za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "sGA/60 Rel",
              "type": "sga60_rel",
              "colour": "red",
              "eng": "Slot Goals Against per 60 Relative",
              "desc": "Rozdíl mezi góly ze slotu proti týmu za 60 minut s hráčem na ledě a bez hráče na ledě",
              "data": "60"
            },
            {
              "name": "sGF% Rel",
              "type": "sgf_percent_rel",
              "colour": "red",
              "eng": "Slot Goals For % Relative",
              "desc": "Rozdíl mezi podíly gólů ze slotu pro tým ze všech gólů ze slotu pro i proti týmu s hráčem na ledě a bez hráče na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "slotPasses": [
        {
          "name": "Přihrávky do slotu",
          "name_en": "Slot passes",
          "type": "onice_slotPasses",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sPF",
              "type": "spf",
              "colour": "green",
              "eng": "Slot Passes For",
              "desc": "Přihrávky do slotu pro tým",
              "data": "count"
            },
            {
              "name": "sPF/60",
              "type": "spf60",
              "colour": "green",
              "eng": "Slot Passes For per 60",
              "desc": "Přihrávky do slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sPA",
              "type": "spa",
              "colour": "red",
              "eng": "Slot Passes Against",
              "desc": "Přihrávky do slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sPA/60",
              "type": "spa60",
              "colour": "red",
              "eng": "Slot Passes Against per 60",
              "desc": "Přihrávky do slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sPCF",
              "type": "spcf",
              "colour": "green",
              "eng": "Completed Slot Passes For",
              "desc": "Zkompletované přihrávky do slotu pro tým",
              "data": "count"
            },
            {
              "name": "sPCF/60",
              "type": "spcf60",
              "colour": "green",
              "eng": "Completed Slot Passes For per 60",
              "desc": "Zkompletované přihrávky do slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sPCA",
              "type": "spca",
              "colour": "red",
              "eng": "Completed Slot Passes Against",
              "desc": "Zkompletované přihrávky do slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sPCA/60",
              "type": "spca60",
              "colour": "red",
              "eng": "Completed Shot Passes Against per 60",
              "desc": "Zkompletované přihrávky do slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "sPNA",
              "type": "spna",
              "colour": "red",
              "eng": "Non completed Slot Passes Against",
              "desc": "Soupeřovy nezkompletované přihrávky do slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sPNA/60",
              "type": "spna60",
              "colour": "red",
              "eng": "Non completed Slot Passes Against per 60",
              "desc": "Soupeřovy nezkompletované přihrávky do slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "BLK.sPA",
              "type": "blkspa",
              "colour": "red",
              "eng": "Blocked Slot Passes Against",
              "desc": "Soupeřovy zblokované přihrávky do slotu proti týmu",
              "data": "count"
            },
            {
              "name": "BLK.sPA/60",
              "type": "blkspa60",
              "colour": "red",
              "eng": "Blocked Slot Passes Against per 60",
              "desc": "Soupeřovy zblokované přihrávky do slotu proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "shotsAssists": [
        {
          "name": "Přihrávky na střely",
          "name_en": "Slot passes",
          "type": "onice_shotsAssists",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SAF",
              "type": "saf",
              "colour": "green",
              "eng": "Shot Assists For",
              "desc": "Přihrávky na střelecké pokusy pro tým",
              "data": "count"
            },
            {
              "name": "SAF/60",
              "type": "saf60",
              "colour": "green",
              "eng": "Shot Assists For per 60",
              "desc": "Přihrávky na střelecké pokusy pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "SAA",
              "type": "saa",
              "colour": "red",
              "eng": "Shot Assists Against",
              "desc": "Přihrávky na střelecké pokusy proti týmu",
              "data": "count"
            },
            {
              "name": "SAA/60",
              "type": "saa60",
              "colour": "red",
              "eng": "Shot Assists Against 60",
              "desc": "Přihrávky na střelecké pokusy proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SAF",
              "type": "crsaf",
              "colour": "green",
              "eng": "Cross-ice Shot Assists For",
              "desc": "Křižné přihrávky na střelecké pokusy pro tým",
              "data": "count"
            },
            {
              "name": "cr.SAF/60",
              "type": "crsaf60",
              "colour": "green",
              "eng": "Cross-ice Shot Assists For per 60",
              "desc": "Křižné přihrávky na střelecké pokusy pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SAA",
              "type": "crsaa",
              "colour": "red",
              "eng": "Cross-ice Shot Assists Against",
              "desc": "Křižné přihrávky na střelecké pokusy proti týmu",
              "data": "count"
            },
            {
              "name": "cr.SAA/60",
              "type": "crsaa60",
              "colour": "red",
              "eng": "Cross-ice Shot Assists Against per 60",
              "desc": "Křižné přihrávky na střelecké pokusy proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SAF",
              "type": "bnsaf",
              "colour": "green",
              "eng": "Behind-the-net Shot Assists For",
              "desc": "Přihrávky zpoza branky na střelecké pokusy pro tým",
              "data": "count"
            },
            {
              "name": "bn.SAF/60",
              "type": "bnsaf60",
              "colour": "green",
              "eng": "Behind-the-net Shot Assists For per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SAA",
              "type": "bnsaa",
              "colour": "red",
              "eng": "Behind-the-net Shot Assists Against",
              "desc": "Přihrávky zpoza branky na střelecké pokusy proti týmu",
              "data": "count"
            },
            {
              "name": "bn.SAA/60",
              "type": "bnsaa60",
              "colour": "red",
              "eng": "Behind-the-net Shot Assists Against per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.SAF",
              "type": "1tsaf",
              "colour": "green",
              "eng": "One-timer Shot Assists For",
              "desc": "Přihrávky na střelecké pokusy z první pro tým",
              "data": "count"
            },
            {
              "name": "1T.SAF/60",
              "type": "1tsaf60",
              "colour": "green",
              "eng": "One-timer Shot Assists For per 60",
              "desc": "Přihrávky na střelecké pokusy z první pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.SAA",
              "type": "1tsaa",
              "colour": "red",
              "eng": "One-timer Shot Assists Against",
              "desc": "Přihrávky na střelecké pokusy z první proti týmu",
              "data": "count"
            },
            {
              "name": "1T.SAA/60",
              "type": "1tsaa60",
              "colour": "red",
              "eng": "One-timer Shot Assists Against per 60",
              "desc": "Přihrávky na střelecké pokusy z první proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "slotShotsAssists": [
        {
          "name": "Přihrávky na střely ze slotu",
          "name_en": "All slot shots assists",
          "type": "onice_slotShotsAssists",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sSAF",
              "type": "ssaf",
              "colour": "green",
              "eng": "Slot Shot Assists For",
              "desc": "Přihrávky na střelecké pokusy ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "sSAF/60",
              "type": "ssaf60",
              "colour": "green",
              "eng": "Slot Shot Assists For per 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sSAA",
              "type": "ssaa",
              "colour": "red",
              "eng": "Slot Shot Assists Against",
              "desc": "Přihrávky na střelecké pokusy ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sSAA/60",
              "type": "ssaa60",
              "colour": "red",
              "eng": "Slot Shot Assists Against 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.sSAF",
              "type": "crssaf",
              "colour": "green",
              "eng": "Cross-ice Slot Shot Assists For",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "cr.sSAF/60",
              "type": "crssaf60",
              "colour": "green",
              "eng": "Cross-ice Slot Shot Assists For per 60",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.sSAA",
              "type": "crssaa",
              "colour": "red",
              "eng": "Cross-ice Slot Shot Assists Against",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "cr.sSAA/60",
              "type": "crssaa60",
              "colour": "red",
              "eng": "Cross-ice Slot Shot Assists Against per 60",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.sSAF",
              "type": "bnssaf",
              "colour": "green",
              "eng": "Behind-the-net Slot Shot Assists For",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "bn.sSAF/60",
              "type": "bnssaf60",
              "colour": "green",
              "eng": "Behind-the-net Slot Shot Assists For per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu pro tým za 60 minut ",
              "data": "60"
            },
            {
              "name": "bn.sSAA",
              "type": "bnssaa",
              "colour": "red",
              "eng": "Behind-the-net Slot Shot Assists Against",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "bn.sSAA/60",
              "type": "bnssaa60",
              "colour": "red",
              "eng": "Behind-the-net Slot Shot Assists Against per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.sSAF",
              "type": "1tssaf",
              "colour": "green",
              "eng": "One-timer Slot Shot Assists For",
              "desc": "Přihrávky na střelecké pokusy ze slotu z první pro tým",
              "data": "count"
            },
            {
              "name": "1T.sSAF/60",
              "type": "1tssaf60",
              "colour": "green",
              "eng": "One-timer Slot Shot Assists For per 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu z první pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.sSAA",
              "type": "1tssaa",
              "colour": "red",
              "eng": "One-timer Slot Shot Assists Against",
              "desc": "Přihrávky na střelecké pokusy ze slotu z první proti týmu",
              "data": "count"
            },
            {
              "name": "1T.sSAA/60",
              "type": "1tssaa60",
              "colour": "red",
              "eng": "One-timer Slot Shot Assists Against per 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu z první proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "zoneEntries": [
        {
          "name": "Kontrolované vstupy do pásma",
          "name_en": "Controlled zone entries",
          "type": "onice_zoneEntries",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "ENF",
              "type": "enf",
              "colour": "green",
              "eng": "Controlled Zone Entries For",
              "desc": "Kontrolované vstupy do pásma pro tým",
              "data": "count"
            },
            {
              "name": "ENF/60",
              "type": "enf60",
              "colour": "green",
              "eng": "Controlled Zone Entries For per 60",
              "desc": "Kontrolované vstupy do pásma pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "ENF%",
              "type": "enf_percent",
              "colour": "green",
              "eng": "% of Controlled Zone Entries For of all Entries For",
              "desc": "Podíl kontrolovaných vstupů do pásma pro tým ze součtu všech vstupů do pásma pro tým (kontrolované vstupy + nahození)",
              "data": "percent"
            },
            {
              "name": "ENA",
              "type": "ena",
              "colour": "green",
              "eng": "Controlled Zone Entries Against",
              "desc": "Kontrolované vstupy do pásma proti týmu",
              "data": "count"
            },
            {
              "name": "ENA/60",
              "type": "ena60",
              "colour": "green",
              "eng": "Controlled Zone Entries Against per 60",
              "desc": "Kontrolované vstupy do pásma proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA%",
              "type": "ena_percent",
              "colour": "green",
              "eng": "% of Controlled Zone Entries Against of all Entries Against",
              "desc": "Podíl kontrolovaných vstupů do pásma proti týmu ze součtu všech vstupů do pásma proti týmu (kontrolované vstupy + nahození)",
              "data": "percent"
            },
            {
              "name": "ENF.W",
              "type": "enfw",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries For",
              "desc": "Úspěšné kontrolované vstupy do pásma pro tým",
              "data": "count"
            },
            {
              "name": "ENF.W/60",
              "type": "enfw60",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries For per 60",
              "desc": "Úspěšné kontrolované vstupy do pásma pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA.W",
              "type": "enaw",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries Against",
              "desc": "Úspěšné kontrolované vstupy do pásma proti týmu",
              "data": "count"
            },
            {
              "name": "ENA.W/60",
              "type": "enaw60",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries Against per 60",
              "desc": "Úspěšné kontrolované vstupy do pásma proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA-DN",
              "type": "enadn",
              "colour": "red",
              "eng": "Zone Entries Against - Denials",
              "desc": "Zamezení soupeřových kontrolovaných vstupů do pásma proti týmu",
              "data": "count"
            },
            {
              "name": "ENA-DN/60",
              "type": "enadn60",
              "colour": "red",
              "eng": "Zone Entries Against - Denials per 60",
              "desc": "Zamezení soupeřových kontrolovaných vstupů do pásma proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "zoneEntriesLedingToShot": [
        {
          "name": "Střely po vstupech do pásma",
          "name_en": "Controlled zone entries leading to shots",
          "type": "onice_zoneEntries",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "ENF→CF",
              "type": "enfcf",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Shots For",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem pro tým s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENF→CF/60",
              "type": "enfcf60",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Shots For per 60",
              "desc": "Kontrolované vstupy týmu do pásma s následným střeleckým pokusem pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENF→CF%",
              "type": "enfcf_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Shots For %",
              "desc": "Podíl kontrolovaných vstupů týmu do pásma s následným střeleckým pokusem pro tým ze všech kontrolovaných vstupů do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "ENF→sCF",
              "type": "enfscf",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Slot Shots For",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem ze slotu pro tým s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENF→sCF/60",
              "type": "enfscf60",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Slot Shots For per 60",
              "desc": "Kontrolované vstupy týmu do pásma s následným střeleckým pokusem ze slotu pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENF→sCF%",
              "type": "enfscf_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Slot Shots For %",
              "desc": "Podíl kontrolovaných vstupů týmu do pásma s následným střeleckým pokusem ze slotu pro tým ze všech kontrolovaných vstupů do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "ENF→GF",
              "type": "enfgf",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Goals For",
              "desc": "Kontrolované vstupy do pásma s následným gólem pro tým s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENF→GF/60",
              "type": "enfgf60",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Goals For per 60",
              "desc": "Kontrolované vstupy týmu do pásma s následným gólem pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENF→GF%",
              "type": "enfgf_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Goals For %",
              "desc": "Podíl kontrolovaných vstupů týmu do pásma s následným gólem pro tým ze všech kontrolovaných vstupů do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "xGF.ENF",
              "type": "xgfenf",
              "colour": "green",
              "eng": "Expected goals For from Zone Entries For",
              "desc": "Očekávané góly týmu po kontrolovaných vstupech týmu do pásma s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "xGF.ENF/60",
              "type": "xgfenf60",
              "colour": "green",
              "eng": "Expected goals For from Zone Entries For per 60",
              "desc": "Očekávané góly týmu po kontrolovaných vstupech týmu do pásma s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA→CA",
              "type": "enaca",
              "colour": "green",
              "eng": "Controlled Zone Entries Against resulting in Shot attempts Against",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENA→CA/60",
              "type": "enaca60",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Shots Against",
              "desc": "Kontrolované vstupy soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA→CA%",
              "type": "enaca_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Shots Against %",
              "desc": "Podíl kontrolovaných vstupů soupeře do pásma s následným střeleckým pokusem ze slotu proti týmu ze všech kontrolovaných vstupů soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "ENA→sCA",
              "type": "enasca",
              "colour": "green",
              "eng": "Controlled Zone Entries Against resulting in Slot shot attempts Against",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem ze slotu proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENA→sCA/60",
              "type": "enasca60",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Slot Shots Against",
              "desc": "Kontrolované vstupy soupeře do pásma s následným střeleckým pokusem ze slotu proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA→sCA%",
              "type": "enasca_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Slot Shots Against %",
              "desc": "Podíl kontrolovaných vstupů soupeře do pásma s následným střeleckým pokusem ze slotu proti týmu ze všech kontrolovaných vstupů soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "ENA→GA",
              "type": "enaga",
              "colour": "green",
              "eng": "Controlled Zone Entries Against resulting in Goals Against",
              "desc": "Kontrolované vstupy do pásma s následným gólem proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENA→GA/60",
              "type": "enaga60",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Goals Against",
              "desc": "Kontrolované vstupy soupeře do pásma s následným gólem proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA→GA%",
              "type": "enaga_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Goals Against %",
              "desc": "Podíl kontrolovaných vstupů soupeře do pásma s následným gólem proti týmu ze všech kontrolovaných vstupů soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "xGA.ENA",
              "type": "xgaena",
              "colour": "green",
              "eng": "Expected goals Against from Zone Entries Against",
              "desc": "Očekávané góly soupeře po kontrolovaných vstupech soupeře do pásma s následným střeleckým pokusem proti týmu",
              "data": "count"
            },
            {
              "name": "xGA.ENA/60",
              "type": "xgaena60",
              "colour": "green",
              "eng": "Expected goals Against from Zone Entries Against per 60",
              "desc": "Očekávané góly soupeře po kontrolovaných vstupech soupeře do pásma s následným střeleckým pokusem proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "zoneExits": [
        {
          "name": "Kontrolované výstupy z pásma",
          "name_en": "Controlled zone exits",
          "type": "onice_zoneExits",
          "select_type": 2,
          "enabled": true,
          "attributes": [
            {
              "name": "EXF",
              "type": "exf",
              "colour": "red",
              "eng": "Controlled Zone Exits For",
              "desc": "Kontrolované výstupy z pásma pro tým",
              "data": "count"
            },
            {
              "name": "EXF/60",
              "type": "exf60",
              "colour": "red",
              "eng": "Controlled Zone Exits For per 60",
              "desc": "Kontrolované výstupy z pásma pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "EXF%",
              "type": "exf_percent",
              "colour": "red",
              "eng": "% of Controlled Zone Exits For of all Exits For",
              "desc": "Podíl kontrolovaných výstupů z pásma pro tým ze součtu všech výstupů z pásma pro tým (kontrolované výstupy + vyhození)",
              "data": "percent"
            },
            {
              "name": "EXA",
              "type": "exa",
              "colour": "red",
              "eng": "Controlled Zone Exits Against",
              "desc": "Soupeřovy kontrolované výstupy z pásma proti týmu",
              "data": "count"
            },
            {
              "name": "EXA/60",
              "type": "exa60",
              "colour": "red",
              "eng": "Controlled Zone Exits Against per 60",
              "desc": "Kontrolované výstupy z pásma proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "EXA%",
              "type": "exa_percent",
              "colour": "red",
              "eng": "% of Controlled Zone Exits Against of all Exits Against",
              "desc": "Podíl kontrolovaných výstupů z pásma proti týmu ze součtu všech výstupů z pásma proti týmu (kontrolované výstupy + vyhození)",
              "data": "percent"
            },
            {
              "name": "EXF.W",
              "type": "exfw",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits For",
              "desc": "Úspěšné kontrolované výstupy z pásma pro tým",
              "data": "count"
            },
            {
              "name": "EXF.W/60",
              "type": "exfw60",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits For per 60",
              "desc": "Úspěšné kontrolované výstupy z pásma pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "EXA.W",
              "type": "exaw",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits Against",
              "desc": "Úspěšné kontrolované výstupy z pásma proti týmu",
              "data": "count"
            },
            {
              "name": "EXA.W/60",
              "type": "exaw60",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits Against per 60",
              "desc": "Úspěšné kontrolované výstupy z pásma proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "dumpins": [
        {
          "name": "Nahození",
          "name_en": "Dump-ins",
          "type": "onice_dumpins",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DIF",
              "type": "dif",
              "colour": "green",
              "eng": "Dump-ins For",
              "desc": "Nahození puku pro tým",
              "data": "count"
            },
            {
              "name": "DIF/60",
              "type": "dif60",
              "colour": "green",
              "eng": "Dump-ins For",
              "desc": "Nahození puku pro tým",
              "data": "60"
            },
            {
              "name": "DIBF",
              "type": "dibf",
              "colour": "green",
              "eng": "Dump-in Battles For",
              "desc": "Souboje po nahození puku pro tým",
              "data": "count"
            },
            {
              "name": "DIBF/60",
              "type": "dibf60",
              "colour": "green",
              "eng": "Dump-in Battles For per 60",
              "desc": "Souboje po nahození puku pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBF%",
              "type": "dibf_percent",
              "colour": "green",
              "eng": "Dump-in Battles For %",
              "desc": "Podíl nahození s následným soubojem ze všech nahození pro tým",
              "data": "percent"
            },
            {
              "name": "DIBWF",
              "type": "dibwf",
              "colour": "green",
              "eng": "Dump-in Battles For Won",
              "desc": "Nahození s následným vyhraným soubojem pro tým",
              "data": "count"
            },
            {
              "name": "DIBWF/60",
              "type": "dibwf60",
              "colour": "green",
              "eng": "Dump-in Battles For Won per 60",
              "desc": "Nahození s následným vyhraným soubojem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBWF%",
              "type": "dibwf_percent",
              "colour": "green",
              "eng": "Dump-in Battles For Won %",
              "desc": "Podíl nahození s následným vyhraným soubojem ze všech nahození s následným soubojem pro tým",
              "data": "percent"
            },
            {
              "name": "DIA",
              "type": "dia",
              "colour": "green",
              "eng": "Dump-ins Against",
              "desc": "Nahození puku proti týmu",
              "data": "count"
            },
            {
              "name": "DIA/60",
              "type": "dia60",
              "colour": "green",
              "eng": "Dump-ins Against per 60",
              "desc": "Nahození puku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBA",
              "type": "diba",
              "colour": "green",
              "eng": "Dump-in Battles Against",
              "desc": "Souboje po nahození puku proti týmu",
              "data": "count"
            },
            {
              "name": "DIBA/60",
              "type": "diba60",
              "colour": "green",
              "eng": "Dump-in Battles Against per 60",
              "desc": "Souboje po nahození puku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBWA",
              "type": "dibwa",
              "colour": "green",
              "eng": "Dump-in Battles Against Won",
              "desc": "Nahození proti týmu s následným vyhraným soubojem týmem",
              "data": "count"
            },
            {
              "name": "DIBWA/60",
              "type": "dibwa60",
              "colour": "green",
              "eng": "Dump-in Battles Against Won per 60",
              "desc": "Nahození proti týmu s následným vyhraným soubojem týmem za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBWA%",
              "type": "dibwa_percent",
              "colour": "green",
              "eng": "Dump-in Battles Against Won %",
              "desc": "Podíl nahození proti týmu s následným vyhraným soubojem týmem ze všech nahození s následným soubojem proti týmu",
              "data": "percent"
            }
          ]
        }
      ],
      "dumpinsToShots": [
        {
          "name": "Střely po nahození",
          "name_en": "Dump-ins leading to shots",
          "type": "onice_dumpins",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DIF→CF",
              "type": "difcf",
              "colour": "green",
              "eng": "Dump-ins For leading to Shot For",
              "desc": "Nahození týmu s následným střeleckým pokusem pro tým s hráčem na ledě ",
              "data": "count"
            },
            {
              "name": "DIF→CF/60",
              "type": "difcf60",
              "colour": "green",
              "eng": "Dump-ins For leading to Shot For per 60",
              "desc": "Nahození týmu s následným střeleckým pokusem pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "DIF→CF%",
              "type": "difcf_percent",
              "colour": "green",
              "eng": "Dump-ins For leading to Shot For %",
              "desc": "Podíl nahození týmu do pásma s následným střeleckým pokusem pro tým ze všech nahození do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "DIF→sCF",
              "type": "difscf",
              "colour": "green",
              "eng": "Dump-ins For leading to Slot Shots For",
              "desc": "Nahození týmu s následným střeleckým pokusem ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "DIF→sCF/60",
              "type": "difscf60",
              "colour": "green",
              "eng": "Dump-ins For leading to Slot Shots For per 60",
              "desc": "Nahození týmu s následným střeleckým pokusem ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIF→sCF%",
              "type": "difscf_percent",
              "colour": "green",
              "eng": "Dump-ins For leading to Slot Shots For %",
              "desc": "Podíl nahození týmu s následným střeleckým pokusem ze slotu pro tým ze všech nahození týmu",
              "data": "percent"
            },
            {
              "name": "DIF→GF",
              "type": "difgf",
              "colour": "green",
              "eng": "Dump-ins For leading to Goals For",
              "desc": "Nahození týmu s následným gólem pro tým",
              "data": "count"
            },
            {
              "name": "DIF→GF/60",
              "type": "difgf60",
              "colour": "green",
              "eng": "Dump-ins For leading to Goals For per 60",
              "desc": "Nahození týmu s následným gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIF→GF%",
              "type": "difgf_percent",
              "colour": "green",
              "eng": "Dump-ins For leading to Goals For %",
              "desc": "Podíl nahození týmu s následným gólem pro tým ze všech nahození týmu",
              "data": "percent"
            },
            {
              "name": "xGF.DIF",
              "type": "xgfdif",
              "colour": "green",
              "eng": "Expected goals For from Dump-ins For",
              "desc": "Očekávané góly týmu po nahození týmu do pásma s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "xGF.DIF/60",
              "type": "xgfdif60",
              "colour": "green",
              "eng": "Expected goals For from Dump-ins For per 60",
              "desc": "Očekávané góly týmu po nahození týmu do pásma s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIA→CA",
              "type": "diaca",
              "colour": "green",
              "eng": "Dump-ins Against leading to Shot Against",
              "desc": "Nahození soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "DIA→CA/60",
              "type": "diaca60",
              "colour": "green",
              "eng": "Dump-ins Against leading to Shot Against per 60",
              "desc": "Nahození soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "DIA→CA%",
              "type": "diaca_percent",
              "colour": "green",
              "eng": "Dump-ins Against leading to Shot Against %",
              "desc": "Podíl nahození soupeře do pásma s následným střeleckým pokusem proti týmu ze všech nahození soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "DIA→sCA",
              "type": "diasca",
              "colour": "green",
              "eng": "Dump-ins Against leading to Slot Shots Against",
              "desc": "Nahození soupeře s následným střeleckým pokusem ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "DIA→sCA/60",
              "type": "diasca60",
              "colour": "green",
              "eng": "Dump-ins Against leading to Slot Shots Against per 60",
              "desc": "Nahození soupeře s následným střeleckým pokusem ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DIA→sCA%",
              "type": "diasca_percent",
              "colour": "green",
              "eng": "Dump-ins Against leading to Slot Shots Against %",
              "desc": "Podíl nahození soupeře s následným střeleckým pokusem ze slotu proti týmu ze všech nahození soupeře",
              "data": "percent"
            },
            {
              "name": "DIA→GA",
              "type": "diaga",
              "colour": "green",
              "eng": "Dump-ins Against leading to Goals Against",
              "desc": "Nahození soupeře s následným gólem proti týmu",
              "data": "count"
            },
            {
              "name": "DIA→GA/60",
              "type": "diaga60",
              "colour": "green",
              "eng": "Dump-ins Against leading to Goals Against per 60",
              "desc": "Nahození soupeře s následným gólem proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DIA→GA%",
              "type": "diaga_percent",
              "colour": "green",
              "eng": "Dump-ins Against leading to Goals Against %",
              "desc": "Podíl nahození soupeře s následným gólem proti týmu ze všech nahození soupeře",
              "data": "percent"
            },
            {
              "name": "xGA.DIA",
              "type": "xgadia",
              "colour": "green",
              "eng": "Expected goals Against from Dump-ins Against",
              "desc": "Očekávané góly soupeře po nahození soupeře do pásma s následným střeleckým pokusem proti týmu",
              "data": "count"
            },
            {
              "name": "xGA.DIA/60",
              "type": "xgadia60",
              "colour": "green",
              "eng": "Expected goals Against from Dump-ins Against per 60",
              "desc": "Očekávané góly soupeře po nahození soupeře do pásma s následným střeleckým pokusem proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "dumpouts": [
        {
          "name": "Vyhození",
          "name_en": "Dump-outs",
          "type": "onice_dumpouts",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DOF",
              "type": "dof",
              "colour": "red",
              "eng": "Dump-outs For",
              "desc": "Vyhození puku pro tým",
              "data": "count"
            },
            {
              "name": "DOF/60",
              "type": "dof60",
              "colour": "red",
              "eng": "Dump-outs For per 60",
              "desc": "Vyhození puku pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBF",
              "type": "dobf",
              "colour": "green",
              "eng": "Dump-out Battles For",
              "desc": "Souboje po vyhození puku pro tým",
              "data": "count"
            },
            {
              "name": "DOBF/60",
              "type": "dobf60",
              "colour": "green",
              "eng": "Dump-out Battles For per 60",
              "desc": "Souboje po vyhození puku pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBF%",
              "type": "dobf_percent",
              "colour": "green",
              "eng": "Dump-out Battles For %",
              "desc": "Podíl vyhození s následným soubojem ze všech vyhození pro tým",
              "data": "percent"
            },
            {
              "name": "DOBWF",
              "type": "dobwf",
              "colour": "green",
              "eng": "Dump-out Battles For Won",
              "desc": "Vyhození s následným vyhraným soubojem pro tým",
              "data": "count"
            },
            {
              "name": "DOBWF/60",
              "type": "dobwf60",
              "colour": "green",
              "eng": "Dump-out Battles For Won per 60",
              "desc": "Vyhození s následným vyhraným soubojem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBWF%",
              "type": "dobwf_percent",
              "colour": "green",
              "eng": "Dump-out Battles For Won %",
              "desc": "Podíl vyhození s následným vyhraným soubojem ze všech vyhození s následným soubojem pro tým",
              "data": "percent"
            },
            {
              "name": "DOA",
              "type": "doa",
              "colour": "green",
              "eng": "Dump-outs Against",
              "desc": "Vyhození puku proti týmu",
              "data": "count"
            },
            {
              "name": "DOA/60",
              "type": "doa60",
              "colour": "green",
              "eng": "Dump-outs Against per 60",
              "desc": "Vyhození puku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBA",
              "type": "doba",
              "colour": "red",
              "eng": "Dump-out Battles Against",
              "desc": "Souboje po vyhození puku proti týmu",
              "data": "count"
            },
            {
              "name": "DOBA/60",
              "type": "doba60",
              "colour": "red",
              "eng": "Dump-out Battles Against per 60",
              "desc": "Souboje po vyhození puku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBWA",
              "type": "dobwa",
              "colour": "red",
              "eng": "Dump-out Battles Against Won ",
              "desc": "Vyhození proti týmu s následným vyhraným soubojem týmem",
              "data": "count"
            },
            {
              "name": "DOBWA/60",
              "type": "dobwa60",
              "colour": "red",
              "eng": "Dump-out Battles Against Won per 60",
              "desc": "Vyhození proti týmu s následným vyhraným soubojem týmem za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBWA%",
              "type": "dobwa_percent",
              "colour": "red",
              "eng": "Dump-out Battles Against Won %",
              "desc": "Podíl vyhození proti týmu s následným vyhraným soubojem týmem ze všech vyhození s následným soubojem proti týmu",
              "data": "percent"
            }
          ]
        }
      ],
      "dumpoutsToShots": [
        {
          "name": "Střely po vyhození",
          "name_en": "Dump-outs leading to shots",
          "type": "onice_dumpoutsToShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DOF→CF",
              "type": "dofcf",
              "colour": "green",
              "eng": "Dump-outs For leading to Shot For",
              "desc": "Vyhození týmu s následným střeleckým pokusem pro tým s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "DOF→CF/60",
              "type": "dofcf60",
              "colour": "green",
              "eng": "Dump-outs For leading to Shot For per 60",
              "desc": "Vyhození týmu s následným střeleckým pokusem pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "DOF→CF%",
              "type": "dofcf_percent",
              "colour": "green",
              "eng": "Dump-outs For leading to Shot For %",
              "desc": "Podíl vyhození týmu do pásma s následným střeleckým pokusem pro tým ze všech vyhození do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "DOF→sCF",
              "type": "dofscf",
              "colour": "green",
              "eng": "Dump-outs For leading to Slot Shots For",
              "desc": "Vyhození týmu s následným střeleckým pokusem ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "DOF→sCF/60",
              "type": "dofscf60",
              "colour": "green",
              "eng": "Dump-outs For leading to Slot Shots For per 60",
              "desc": "Vyhození týmu s následným střeleckým pokusem ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOF→sCF%",
              "type": "dofscf_percent",
              "colour": "green",
              "eng": "Dump-outs For leading to Slot Shots For %",
              "desc": "Podíl vyhození týmu s následným střeleckým pokusem ze slotu pro tým ze všech vyhození týmu",
              "data": "percent"
            },
            {
              "name": "DOF→GF",
              "type": "dofgf",
              "colour": "green",
              "eng": "Dump-outs For leading to Goals For",
              "desc": "Vyhození týmu s následným gólem pro tým",
              "data": "count"
            },
            {
              "name": "DOF→GF/60",
              "type": "dofgf60",
              "colour": "green",
              "eng": "Dump-outs For leading to Goals For per 60",
              "desc": "Vyhození týmu s následným gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOF→GF%",
              "type": "dofgf_percent",
              "colour": "green",
              "eng": "Dump-outs For leading to Goals For %",
              "desc": "Podíl vyhození týmu s následným gólem pro tým ze všech vyhození týmu",
              "data": "percent"
            },
            {
              "name": "xGF.DOF",
              "type": "xgfdof",
              "colour": "green",
              "eng": "Expected goals For from Dump-outs For",
              "desc": "Očekávané góly týmu po vyhození týmu do pásma s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "xGF.DOF/60",
              "type": "xgfdof60",
              "colour": "green",
              "eng": "Expected goals For from Dump-outs For per 60",
              "desc": "Očekávané góly týmu po vyhození týmu do pásma s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOA→CA",
              "type": "doaca",
              "colour": "green",
              "eng": "Dump-outs Against leading to Shot Against",
              "desc": "Vyhození soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "DOA→CA/60",
              "type": "doaca60",
              "colour": "green",
              "eng": "Dump-outs Against leading to Shot Against per 60",
              "desc": "Vyhození soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "DOA→CA%",
              "type": "doaca_percent",
              "colour": "green",
              "eng": "Dump-outs Against leading to Shot Against %",
              "desc": "Podíl vyhození soupeře do pásma s následným střeleckým pokusem proti týmu ze všech vyhození soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "DOA→sCA",
              "type": "doasca",
              "colour": "green",
              "eng": "Dump-outs Against leading to Slot Shots Against",
              "desc": "Vyhození soupeře s následným střeleckým pokusem ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "DOA→sCA/60",
              "type": "doasca60",
              "colour": "green",
              "eng": "Dump-outs Against leading to Slot Shots Against per 60",
              "desc": "Vyhození soupeře s následným střeleckým pokusem ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DOA→sCA%",
              "type": "doasca_percent",
              "colour": "green",
              "eng": "Dump-outs Against leading to Slot Shots Against %",
              "desc": "Podíl Vyhození soupeře s následným střeleckým pokusem ze slotu proti týmu ze všech Vyhození soupeře",
              "data": "percent"
            },
            {
              "name": "DOA→GA",
              "type": "doaga",
              "colour": "green",
              "eng": "Dump-outs Against leading to Goals Against",
              "desc": "Vyhození soupeře s následným gólem proti týmu",
              "data": "count"
            },
            {
              "name": "DOA→GA/60",
              "type": "doaga60",
              "colour": "green",
              "eng": "Dump-outs Against leading to Goals Against per 60",
              "desc": "Vyhození soupeře s následným gólem proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DOA→GA%",
              "type": "doaga_percent",
              "colour": "green",
              "eng": "Dump-outs Against leading to Goals Against %",
              "desc": "Podíl vyhození soupeře s následným gólem proti týmu ze všech vyhození soupeře",
              "data": "percent"
            },
            {
              "name": "xGA.DOA",
              "type": "xgadoa",
              "colour": "green",
              "eng": "Expected goals Against from Dump-outs Against",
              "desc": "Očekávané góly soupeře po vyhození soupeře do pásma s následným střeleckým pokusem proti týmu",
              "data": "count"
            },
            {
              "name": "xGA.DOA/60",
              "type": "xgadoa60",
              "colour": "green",
              "eng": "Expected goals Against from Dump-outs Against per 60",
              "desc": "Očekávané góly soupeře po vyhození soupeře do pásma s následným střeleckým pokusem proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "puckPossession": [
        {
          "name": "Držení puku",
          "name_en": "Puck possession",
          "type": "onice_puckPossession",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "pTOI",
              "type": "ptoi",
              "colour": "white",
              "eng": "Team Possession Time",
              "desc": "Celkový čas držení puku týmem s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "pTOI%",
              "type": "ptoi_percent",
              "colour": "white",
              "eng": "Team Possession Time %",
              "desc": "Podíl času držení puku týmem s hráčem na ledě z celkového času hráče na ledě",
              "data": "percent"
            },
            {
              "name": "% pTOI vs OPP",
              "type": "ptoivsopp",
              "colour": "white",
              "eng": "Team Share of Possession Time vs. Opposition",
              "desc": "Podíl času držení puku týmem v porovnání se soupeřem, když byl hráč na ledě",
              "data": "percent"
            },
            {
              "name": "OZ.TOI",
              "type": "oztoi",
              "colour": "green",
              "eng": "Team Offensive Zone Time",
              "desc": "Čas odehraný v útočném pásmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "OZ.TOI%",
              "type": "oztoi_percent",
              "colour": "green",
              "eng": "Team Offensive Zone Time %",
              "desc": "Podíl času odehraném v útočném pásmu z celkového odehraného času s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "OZ.pTOI",
              "type": "ozptoi",
              "colour": "green",
              "eng": "Team Possession Time in Offensive Zone",
              "desc": "Čas držení puku týmem s hráčem na ledě v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZ.pTOI%",
              "type": "ozptoi_percent",
              "colour": "green",
              "eng": "Team Possession Time in Offensive Zone %",
              "desc": "Podíl času držení puku týmem v útočném pásmu z celkového času odehraného v útočném pásmu s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "DZ.TOI",
              "type": "dztoi",
              "colour": "red",
              "eng": "Team Defensive Zone Time",
              "desc": "Čas odehraný v obranném pásmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "DZ.TOI%",
              "type": "dztoi_percent",
              "colour": "red",
              "eng": "Team Defensive Zone Time %",
              "desc": "Podíl času odehraném v obranném pásmu z celkového odehraného času s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "DZ.pTOI",
              "type": "dzptoi",
              "colour": "red",
              "eng": "Team Possession Time in Defensive Zone",
              "desc": "Čas držení puku týmem s hráčem na ledě v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZ.pTOI%",
              "type": "dzptoi_percent",
              "colour": "red",
              "eng": "Team Possession Time in Defensive Zone %",
              "desc": "Podíl času držení puku týmem v obranném pásmu z celkového času odehraného v obranném pásmu s hráčem na ledě",
              "data": "percent"
            },
            {
              "name": "OPP DZ.pTOI",
              "type": "oppdzptoi",
              "colour": "red",
              "eng": "Opposition Defensive Zone Possession Time",
              "desc": "Čas držení puku soupeřem v obranném pásmu, když byl hráč na ledě",
              "data": "count"
            },
            {
              "name": "OPP DZ.pTOI%",
              "type": "oppdzptoi_percent",
              "colour": "red",
              "eng": "Opposition Defensive Zone Possession Time %",
              "desc": "Podíl času držení puku soupeřem v obranném pásmu z celkového času odehraného v obranném pásmu s hráčem na ledě",
              "data": "percent"
            }
          ]
        }
      ],
      "puckPossession2": [
        {
          "name": "Držení puku: zisky a ztráty",
          "name_en": "puck possessions won & lost",
          "type": "onice_puckPossession2",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "p.W",
              "type": "possw",
              "colour": "green",
              "eng": "Possessions Gained",
              "desc": "Získaná držení puku",
              "data": "count"
            },
            {
              "name": "p.W/60",
              "type": "possw60",
              "colour": "green",
              "eng": " Possessions Gained per 60",
              "desc": "Získaná držení puku za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.p.W",
              "type": "ozpossw",
              "colour": "green",
              "eng": "Offensive Zone Possessions Gained",
              "desc": "Získaná držení puku v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZ.p.W/60",
              "type": "ozpossw60",
              "colour": "green",
              "eng": "Offensive Zone Possessions Gained per 60",
              "desc": "Získaná držení puku v útočném pásmu za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.p.W%",
              "type": "ozpossw_percent",
              "colour": "green",
              "eng": "% of Offensive Zone Possessions Gained",
              "desc": "Podíl získaných držení puku v útočném pásmu ze všech získaných držení puku",
              "data": "percent"
            },
            {
              "name": "DZ.p.W",
              "type": "dzpossw",
              "colour": "red",
              "eng": "Defensive Zone Possessions Gained",
              "desc": "Získaná držení puku v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZ.p.W/60",
              "type": "dzpossw60",
              "colour": "red",
              "eng": "Defensive Zone Possessions Gained per 60",
              "desc": "Získaná držení puku v obranném pásmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DZ.p.W%",
              "type": "dzpossw_percent",
              "colour": "red",
              "eng": "% of Defensive Zone Possessions Gained",
              "desc": "Podíl získaných držení puku v obranném pásmu ze všech získaných držení puku",
              "data": "percent"
            },
            {
              "name": "p.L",
              "type": "possl",
              "colour": "red",
              "eng": "Possessions Lost",
              "desc": "Ztracená držení puku",
              "data": "count"
            },
            {
              "name": "p.L/60",
              "type": "possl60",
              "colour": "red",
              "eng": "Possession Lost per 60",
              "desc": "Ztracená držení puku za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.p.L",
              "type": "ozpossl",
              "colour": "red",
              "eng": "Offensive Zone Possessions Lost",
              "desc": "Ztracená držení puku v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZ.p.L/60",
              "type": "ozpossl60",
              "colour": "red",
              "eng": "Offensive Zone Possessions Lost per 60",
              "desc": "Ztracená držení puku v útočném pásmu za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.p.L%",
              "type": "ozpossl_percent",
              "colour": "red",
              "eng": "% of Offensive Zone Possessions Lost",
              "desc": "Podíl ztracených držení puku v útočném pásmu ze všech ztracených držení puku",
              "data": "percent"
            },
            {
              "name": "DZ.p.L",
              "type": "dzpossl",
              "colour": "red",
              "eng": "Defensive Zone Possessions Lost",
              "desc": "Ztracená držení puku v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZ.p.L/60",
              "type": "dzpossl60",
              "colour": "red",
              "eng": "Defensive Zone Possessions Lost per 60",
              "desc": "Ztracená držení puku v obranném pásmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DZ.p.L%",
              "type": "dzpossl_percent",
              "colour": "red",
              "eng": "% of Defensive Zone Possessions Lost",
              "desc": "Podíl ztracených držení puku v obranném pásmu ze všech ztracených držení puku",
              "data": "percent"
            },
            {
              "name": "p.W%",
              "type": "possw_percent",
              "colour": "red",
              "eng": "% of Gained Possessions",
              "desc": "Podíl získaných a ztracených držení puku",
              "data": "percent"
            }
          ]
        }
      ]
    }
  ],
  "teamsData": [
    {
      "allShots": [
        {
          "name": "Střelecké pokusy",
          "name_en": "All shot attempts",
          "type": "teams_allShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "CF",
              "type": "cf",
              "colour": "green",
              "eng": "Corsi For",
              "desc": "Střelecké pokusy pro tým",
              "data": "count"
            },
            {
              "name": "CA",
              "type": "ca",
              "colour": "red",
              "eng": "Corsi Against",
              "desc": "Střelecké pokusy proti týmu",
              "data": "count"
            },
            {
              "name": "CF/60",
              "type": "cf60",
              "colour": "green",
              "eng": "Corsi For per 60",
              "desc": "Střelecké pokusy pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "CA/60",
              "type": "ca60",
              "colour": "red",
              "eng": "Corsi Against per 60",
              "desc": "Střelecké pokusy proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "CF%",
              "type": "cf_percent",
              "colour": "green",
              "eng": "Corsi For %",
              "desc": "Podíl střeleckých pokusů pro tým ze součtu střeleckých pokusů pro a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.CSh%",
              "type": "oncsh_percent",
              "colour": "green",
              "eng": "ON-ICE Corsi Shooting %",
              "desc": "Podíl vstřelených gólů ze všech střeleckých pokusů pro tým",
              "data": "percent"
            },
            {
              "name": "ON.CSv%",
              "type": "oncsv_percent",
              "colour": "red",
              "eng": "ON-ICE Corsi Save %",
              "desc": "Podíl obdržených gólů ze všech střeleckých pokusů proti týmu",
              "data": "percent"
            },
            {
              "name": "BLK",
              "type": "blk",
              "colour": "red",
              "eng": "Opponent´s Shots Blocked",
              "desc": "Zblokované střely soupeře",
              "data": "count"
            },
            {
              "name": "BLK/60",
              "type": "blk60",
              "colour": "red",
              "eng": "Opponent´s Shots Blocked per 60",
              "desc": "Zblokované střely soupeře za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "unblockedShots": [
        {
          "name": "Nezblokované střely",
          "name_en": "All unblocked shots",
          "type": "teams_unblockedShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "FF",
              "type": "ff",
              "colour": "green",
              "eng": "Fenwick For",
              "desc": "Nezblokované střely pro tým",
              "data": "count"
            },
            {
              "name": "FA",
              "type": "fa",
              "colour": "red",
              "eng": "Fenwick Against",
              "desc": "Nezblokované střely proti týmu",
              "data": "count"
            },
            {
              "name": "FF/60",
              "type": "ff60",
              "colour": "green",
              "eng": "Fenwick For per 60",
              "desc": "Nezblokované střely pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "FA/60",
              "type": "fa60",
              "colour": "red",
              "eng": "Fenwick Against per 60",
              "desc": "Nezblokované střely proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "FF%",
              "type": "ff_percent",
              "colour": "green",
              "eng": "Fenwick For %",
              "desc": "Podíl nezblokovaných střel pro tým ze součtu nezblokovaných střel pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.FSh%",
              "type": "onfsh_percent",
              "colour": "red",
              "eng": "ON-ICE Fenwick Save %",
              "desc": "Podíl obdržených gólů ze všech nezblokovaných střel proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.FSv%",
              "type": "onfsv_percent",
              "colour": "green",
              "eng": "ON-ICE Fenwick Shooting %",
              "desc": "Podíl vstřelených gólů ze všech nezblokovaných střel pro tým",
              "data": "percent"
            }
          ]
        }
      ],
      "shotsOnGoal": [
        {
          "name": "Střely na branku",
          "name_en": "Shots on goal",
          "type": "teams_shotsOnGoal",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SOGF",
              "type": "sogf",
              "colour": "green",
              "eng": "Shots On Goal For",
              "desc": "Střely na branku pro tým",
              "data": "count"
            },
            {
              "name": "SOGA",
              "type": "soga",
              "colour": "red",
              "eng": "Shots On Goal Against",
              "desc": "Střely na branku proti týmu",
              "data": "count"
            },
            {
              "name": "SOGF/60",
              "type": "sogf60",
              "colour": "green",
              "eng": "Shots On Goal For per 60",
              "desc": "Střely na branku pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGA/60",
              "type": "soga60",
              "colour": "red",
              "eng": "Shots On Goal Against per 60",
              "desc": "Střely na branku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGF%",
              "type": "sogf_percent",
              "colour": "green",
              "eng": "Shots On Goal For %",
              "desc": "Podíl střel na branku pro tým ze součtu střel na branku pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.Sh%",
              "type": "onsh_percent",
              "colour": "green",
              "eng": "ON-ICE Shooting %",
              "desc": "Podíl vstřelených gólů ze všech střel na branku pro tým",
              "data": "percent"
            },
            {
              "name": "ON.Sv%",
              "type": "onsv_percent",
              "colour": "red",
              "eng": "ON-ICE Save %",
              "desc": "Podíl obdržených gólů ze všech střel na branku proti týmu",
              "data": "percent"
            }
          ]
        }
      ],
      "slotShots": [
        {
          "name": "Střelecké pokusy ze slotu",
          "name_en": "Slot shot attempts (scoring chances)",
          "type": "teams_slotShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sCF",
              "type": "scf",
              "colour": "green",
              "eng": "Slot Shot Attempts For ",
              "desc": "Střelecké pokusy ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "sCA",
              "type": "sca",
              "colour": "red",
              "eng": "Slot Shot Attempts Against",
              "desc": "Střelecké pokusy ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sCF/60",
              "type": "scf60",
              "colour": "green",
              "eng": "Slot Shot Attempts For per 60",
              "desc": "Střelecké pokusy ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sCA/60",
              "type": "sca60",
              "colour": "red",
              "eng": "Slot Shot Attempts Against per 60",
              "desc": "Střelecké pokusy ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "sCF%",
              "type": "scf_percent",
              "colour": "green",
              "eng": "Slot Shot Attempts For %",
              "desc": "Podíl střeleckých pokusů ze slotu pro tým ze součtu střeleckých pokusů ze slotu pro a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.sCh%",
              "type": "onsch_percent",
              "colour": "green",
              "eng": "ON-ICE Slot Shot Attempts Shooting %",
              "desc": "Podíl vstřelených gólů ze všech střeleckých pokusů ze slotu pro tým",
              "data": "percent"
            },
            {
              "name": "ON.sCv%",
              "type": "onscv_percent",
              "colour": "red",
              "eng": "ON-ICE Slot Shot Attempts Save %",
              "desc": "Podíl obdržených gólů ze všech střeleckých pokusů ze slotu proti týmu",
              "data": "percent"
            }
          ]
        }
      ],
      "slotShotsOnGoal": [
        {
          "name": "Střely na branku ze slotu",
          "name_en": "Slot shots on goal",
          "type": "teams_slotShotsOnGoal",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sSOGF",
              "type": "ssogf",
              "colour": "green",
              "eng": "Slot Shots On Goal For",
              "desc": "Střely na branku ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "sSOGA",
              "type": "ssoga",
              "colour": "red",
              "eng": "Slot Shots On Goal Against",
              "desc": "Střely na branku ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sSOGF/60",
              "type": "ssogf60",
              "colour": "green",
              "eng": "Slot Shots On Goal For per 60",
              "desc": "Střely na branku ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sSOGA/60",
              "type": "ssoga60",
              "colour": "red",
              "eng": "Slot Shots On Goal Against per 60",
              "desc": "Střely na branku ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "sSOGF%",
              "type": "ssogf_percent",
              "colour": "green",
              "eng": "Slot Shots On Goal For %",
              "desc": "Podíl střel na branku ze slotu pro tým ze součtu všech střel na branku ze slotu pro tým a proti týmu",
              "data": "percent"
            },
            {
              "name": "ON.sSh%",
              "type": "onssh_percent",
              "colour": "green",
              "eng": "ON-ICE Slot Shooting %",
              "desc": "Podíl vstřelených gólů ze všech střel na branku ze slotu pro tým",
              "data": "percent"
            },
            {
              "name": "ON.sSv%",
              "type": "onssv_percent",
              "colour": "red",
              "eng": "ON-ICE Slot Save %",
              "desc": "Podíl obdržených gólů ze všech střel na branku ze slotu proti týmu",
              "data": "percent"
            },
            {
              "name": "sSOGF/SOGF",
              "type": "ssogfsogf",
              "colour": "green",
              "eng": "% of Slot Shots On Goal of all Shots On Goal",
              "desc": "Podíl střel na branku ze slotu pro tým ze všech střel na branku pro tým",
              "data": "percent"
            }
          ]
        }
      ],
      "expected_goals": [
        {
          "name": "Očekávané góly",
          "name_en": "Expected goals",
          "type": "teams_expected_goals",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "xGF",
              "type": "xgf",
              "colour": "green",
              "eng": "Expected Goals For",
              "desc": "Očekávané góly pro tým",
              "data": "count"
            },
            {
              "name": "xGA",
              "type": "xga",
              "colour": "red",
              "eng": "Expected Goals Against",
              "desc": "Očekávané góly proti týmu",
              "data": "count"
            },
            {
              "name": "xGF/60",
              "type": "xgf60",
              "colour": "green",
              "eng": "Expected Goals For per 60",
              "desc": "Očekávané góly pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "xGA/60",
              "type": "xga60",
              "colour": "red",
              "eng": "Expected Goals Against per 60",
              "desc": "Očekávané góly proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "xGF%",
              "type": "xgf_percent",
              "colour": "green",
              "eng": "Expected Goals For %",
              "desc": "Podíl očekávaných gólů pro tým ze součtu očekávaných gólů pro tým a proti týmu",
              "data": "percent"
            },

            {
              "name": "xGF/CF%",
              "type": "xgfcf_percent",
              "colour": "green",
              "eng": "Expected Goals For per Shots For Percentage",
              "desc": "Průměrná pravděpodobnost vstřelení gólu z jednoho střeleckého pokusu pro tým (v %)",
              "data": "percent"
            },
            {
              "name": "xGA/CA%",
              "type": "xgaca_percent",
              "colour": "red",
              "eng": "Expected Goals Against per Shots Against Percentage",
              "desc": "Průměrná pravděpodobnost obržení gólu z jednoho střeleckého pokusu proti týmu (v %)",
              "data": "percent"
            },
            {
              "name": "GF-xGF",
              "type": "gfxgf",
              "colour": "green",
              "eng": "Goals For vs. Expected Goals For",
              "desc": "Rozdíl mezi góly pro tým a očekávanými góly pro tým",
              "data": "count"
            },
            {
              "name": "GA-xGA",
              "type": "gaxga",
              "colour": "red",
              "eng": "Goals Against vs. Expected Goals Against",
              "desc": "Rozdíl mezi góly proti týmu a očekávanými góly proti týmu",
              "data": "count"
            }
          ]
        }
      ],
      "goals": [
        {
          "name": "Góly",
          "name_en": "Goals",
          "type": "teams_goals",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "GF",
              "type": "gf",
              "colour": "green",
              "eng": "Goals For",
              "desc": "Góly pro tým",
              "data": "count"
            },
            {
              "name": "GA",
              "type": "ga",
              "colour": "red",
              "eng": "Goals Against",
              "desc": "Góly proti týmu",
              "data": "count"
            },
            {
              "name": "GF/60",
              "type": "gf60",
              "colour": "green",
              "eng": "Goals For per 60",
              "desc": "Góly pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "GA/60",
              "type": "ga60",
              "colour": "red",
              "eng": "Goals Against per 60",
              "desc": "Góly proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "GF%",
              "type": "gf_percent",
              "colour": "green",
              "eng": "Goals For %",
              "desc": "Podíl gólů pro tým ze součtu gólů pro tým a proti týmu",
              "data": "percent"
            }
          ]
        }
      ],
      "slotGoals": [
        {
          "name": "Góly ze slotu",
          "name_en": "Slot goals",
          "type": "teams_slotGoals",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sGF",
              "type": "sgf",
              "colour": "green",
              "eng": "Slot Goals For",
              "desc": "Góly ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "sGA",
              "type": "sga",
              "colour": "red",
              "eng": "Slot Goals Against",
              "desc": "Góly ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sGF/60",
              "type": "sgf60",
              "colour": "green",
              "eng": "Slot Goals For per 60",
              "desc": "Góly ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sGA/60",
              "type": "sga60",
              "colour": "red",
              "eng": "Slot Goals Against per 60",
              "desc": "Góly ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "sGF%",
              "type": "sgf_percent",
              "colour": "green",
              "eng": "Slot Goals For %",
              "desc": "Podíl gólů ze slotu pro tým ze součtu gólů ze slotu pro tým a proti týmu",
              "data": "percent"
            }
          ]
        }
      ],
      "faceOffs": [
        {
          "name": "Vhazování",
          "name_en": "Faceoffs",
          "type": "teams_faceOffs",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "FO",
              "type": "fo",
              "colour": "white",
              "eng": "Faceoffs",
              "desc": "Účasti na vhazování",
              "data": "count"
            },
            {
              "name": "FOW",
              "type": "fow",
              "colour": "white",
              "eng": "Faceoffs Won",
              "desc": "Vyhraná vhazování",
              "data": "count"
            },
            {
              "name": "FOW%",
              "type": "fow_percent",
              "colour": "white",
              "eng": "Faceoffs Won %",
              "desc": "Podíl vyhraných vhazování ze všech účastí na vhazování",
              "data": "percent"
            },
            {
              "name": "DZFO",
              "type": "dzfo",
              "colour": "red",
              "eng": "Defensive Zone Faceoffs",
              "desc": "Účasti na vhazováních v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZFOW",
              "type": "dzfow",
              "colour": "red",
              "eng": "Defensive Zone Faceoffs Won",
              "desc": "Vyhraná vhazování v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZFOW%",
              "type": "dzfow_percent",
              "colour": "red",
              "eng": "Defensive Zone Faceoffs Won %",
              "desc": "Podíl vyhraných vhazování v obranném pásmu ze všech účastí na vhazováních v obranném pásmu",
              "data": "percent"
            },
            {
              "name": "NZFO",
              "type": "nzfo",
              "colour": "white",
              "eng": "Neutral Zone Faceoffs",
              "desc": "Účasti na vhazováních ve středním pásmu",
              "data": "count"
            },
            {
              "name": "NZFOW",
              "type": "nzfow",
              "colour": "white",
              "eng": "Neutral Zone Faceoffs Won",
              "desc": "Vyhraná vhazování ve středním pásmu",
              "data": "count"
            },
            {
              "name": "NZFOW%",
              "type": "nzfow_percent",
              "colour": "white",
              "eng": "Neutral Zone Faceoffs Won %",
              "desc": "Podíl vyhraných vhazování ve středním pásmu ze všech účastí na vhazováních ve středním pásmu",
              "data": "percent"
            },
            {
              "name": "OZFO",
              "type": "ozfo",
              "colour": "green",
              "eng": "Offensive Zone Faceoffs",
              "desc": "Účasti na vhazováních v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZFOW",
              "type": "ozfow",
              "colour": "green",
              "eng": "Offensive Zone Faceoffs Won",
              "desc": "Vyhraná vhazování v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZFOW%",
              "type": "ozfow_percent",
              "colour": "green",
              "eng": "Offensive Zone Faceoffs Won %",
              "desc": "Podíl vyhraných vhazování v útočném pásmu ze všech účastí na vhazováních v útočném pásmu",
              "data": "percent"
            }
          ]
        }
      ],
      "puckPossession": [
        {
          "name": "Držení puku",
          "name_en": "Puck possession",
          "type": "onice_puckPossession",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "pTOI",
              "type": "posstoi",
              "colour": "white",
              "eng": "Team Possession Time",
              "desc": "Celkový čas držení puku týmem",
              "data": "count"
            },
            {
              "name": "pTOI%",
              "type": "posstoi_percent",
              "colour": "white",
              "eng": "Team Possession Time %",
              "desc": "Podíl času držení puku týmem z celkového odehraného času týmem",
              "data": "percent"
            },
            {
              "name": "% pTOI vs OPP",
              "type": "percent_posstoivsopp",
              "colour": "white",
              "eng": "Team Share of Possession Time vs. Opposition",
              "desc": "Podíl času držení puku týmem v porovnání se soupeřem",
              "data": "percent"
            },
            {
              "name": "OZ.TOI",
              "type": "oztoi",
              "colour": "green",
              "eng": "Team Offensive Zone Time",
              "desc": "Čas odehraný v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZ.TOI%",
              "type": "oztoi_percent",
              "colour": "green",
              "eng": "Team Offensive Zone Time %",
              "desc": "Podíl času odehraném v útočném pásmu z celkového odehraného času ",
              "data": "percent"
            },
            {
              "name": "OZ.pTOI",
              "type": "ozposstoi",
              "colour": "green",
              "eng": "Team Possession Time in Offensive Zone",
              "desc": "Čas držení puku týmem v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZ.pTOI%",
              "type": "ozposstoi_percent",
              "colour": "green",
              "eng": "Team Possession Time in Offensive Zone %",
              "desc": "Podíl času držení puku týmem v útočném pásmu z celkového času odehraného v útočném pásmu ",
              "data": "percent"
            },
            {
              "name": "DZ.TOI",
              "type": "dztoi",
              "colour": "red",
              "eng": "Team Defensive Zone Time",
              "desc": "Čas odehraný v obranném pásmu ",
              "data": "count"
            },
            {
              "name": "DZ.TOI%",
              "type": "dztoi_percent",
              "colour": "red",
              "eng": "Team Defensive Zone Time %",
              "desc": "Podíl času odehraném v obranném pásmu z celkového odehraného času ",
              "data": "count"
            },
            {
              "name": "DZ.pTOI",
              "type": "dzposstoi",
              "colour": "red",
              "eng": "Team Possession Time in Defensive Zone",
              "desc": "Čas držení puku týmem v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZ.pTOI%",
              "type": "dzposstoi_percent",
              "colour": "red",
              "eng": "Team Possession Time in Defensive Zone %",
              "desc": "Podíl času držení puku týmem v obranném pásmu z celkového času odehraného v obranném pásmu ",
              "data": "percent"
            },
            {
              "name": "OPP DZ.pTOI",
              "type": "oppdzptoi",
              "colour": "red",
              "eng": "Opposition Defensive Zone Possession Time",
              "desc": "Čas držení puku soupeřem v obranném pásmu",
              "data": "count"
            },
            {
              "name": "OPP DZ.pTOI%",
              "type": "oppdzptoi_percent",
              "colour": "red",
              "eng": "Opposition Defensive Zone Possession Time %",
              "desc": "Podíl času držení puku soupeřem v obranném pásmu z celkového času odehraného v obranném pásmu ",
              "data": "percent"
            }
          ]
        }
      ],
      "puckPossession2": [
        {
          "name": "Držení puku: zisky a ztráty",
          "name_en": "puck possessions won & lost",
          "type": "onice_puckPossession2",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "p.W",
              "type": "possw",
              "colour": "green",
              "eng": "Possessions Gained",
              "desc": "Získaná držení puku",
              "data": "count"
            },
            {
              "name": "p.W/60",
              "type": "possw60",
              "colour": "green",
              "eng": " Possessions Gained per 60",
              "desc": "Získaná držení puku za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.p.W",
              "type": "ozpossw",
              "colour": "green",
              "eng": "Offensive Zone Possessions Gained",
              "desc": "Získaná držení puku v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZ.p.W/60",
              "type": "ozpossw60",
              "colour": "green",
              "eng": "Offensive Zone Possessions Gained per 60",
              "desc": "Získaná držení puku v útočném pásmu za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.p.W%",
              "type": "ozpossw_percent",
              "colour": "green",
              "eng": "% of Offensive Zone Possessions Gained",
              "desc": "Podíl získaných držení puku v útočném pásmu ze všech získaných držení puku",
              "data": "percent"
            },
            {
              "name": "DZ.p.W",
              "type": "dzpossw",
              "colour": "red",
              "eng": "Defensive Zone Possessions Gained",
              "desc": "Získaná držení puku v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZ.p.W/60",
              "type": "dzpossw60",
              "colour": "red",
              "eng": "Defensive Zone Possessions Gained per 60",
              "desc": "Získaná držení puku v obranném pásmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DZ.p.W%",
              "type": "dzpossw_percent",
              "colour": "red",
              "eng": "% of Defensive Zone Possessions Gained",
              "desc": "Podíl získaných držení puku v obranném pásmu ze všech získaných držení puku",
              "data": "percent"
            },
            {
              "name": "p.L",
              "type": "possl",
              "colour": "red",
              "eng": "Possessions Lost",
              "desc": "Ztracená držení puku",
              "data": "count"
            },
            {
              "name": "p.L/60",
              "type": "possl60",
              "colour": "red",
              "eng": "Possession Lost per 60",
              "desc": "Ztracená držení puku za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.p.L",
              "type": "ozpossl",
              "colour": "red",
              "eng": "Offensive Zone Possessions Lost",
              "desc": "Ztracená držení puku v útočném pásmu",
              "data": "count"
            },
            {
              "name": "OZ.p.L/60",
              "type": "ozpossl60",
              "colour": "red",
              "eng": "Offensive Zone Possessions Lost per 60",
              "desc": "Ztracená držení puku v útočném pásmu za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.p.L%",
              "type": "ozpossl_percent",
              "colour": "red",
              "eng": "% of Offensive Zone Possessions Lost",
              "desc": "Podíl ztracených držení puku v útočném pásmu ze všech ztracených držení puku",
              "data": "percent"
            },
            {
              "name": "DZ.p.L",
              "type": "dzpossl",
              "colour": "red",
              "eng": "Defensive Zone Possessions Lost",
              "desc": "Ztracená držení puku v obranném pásmu",
              "data": "count"
            },
            {
              "name": "DZ.p.L/60",
              "type": "dzpossl60",
              "colour": "red",
              "eng": "Defensive Zone Possessions Lost per 60",
              "desc": "Ztracená držení puku v obranném pásmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DZ.p.L%",
              "type": "dzpossl_percent",
              "colour": "red",
              "eng": "% of Defensive Zone Possessions Lost",
              "desc": "Podíl ztracených držení puku v obranném pásmu ze všech ztracených držení puku",
              "data": "percent"
            },
            {
              "name": "p.W%",
              "type": "possw_percent",
              "colour": "red",
              "eng": "% of Gained Possessions",
              "desc": "Podíl získaných a ztracených držení puku",
              "data": "percent"
            }
          ]
        }
      ],
      "shotsAssists": [
        {
          "name": "Přihrávky na střely",
          "name_en": "Slot passes",
          "type": "onice_shotsAssists",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SAF",
              "type": "saf",
              "colour": "green",
              "eng": "Shot Assists For",
              "desc": "Přihrávky na střelecké pokusy pro tým",
              "data": "count"
            },
            {
              "name": "SAF/60",
              "type": "saf60",
              "colour": "green",
              "eng": "Shot Assists For per 60",
              "desc": "Přihrávky na střelecké pokusy pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "SAA",
              "type": "saa",
              "colour": "red",
              "eng": "Shot Assists Against",
              "desc": "Přihrávky na střelecké pokusy proti týmu",
              "data": "count"
            },
            {
              "name": "SAA/60",
              "type": "saa60",
              "colour": "red",
              "eng": "Shot Assists Against 60",
              "desc": "Přihrávky na střelecké pokusy proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SAF",
              "type": "crsaf",
              "colour": "green",
              "eng": "Cross-ice Shot Assists For",
              "desc": "Křižné přihrávky na střelecké pokusy pro tým",
              "data": "count"
            },
            {
              "name": "cr.SAF/60",
              "type": "crsaf60",
              "colour": "green",
              "eng": "Cross-ice Shot Assists For per 60",
              "desc": "Křižné přihrávky na střelecké pokusy pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SAA",
              "type": "crsaa",
              "colour": "red",
              "eng": "Cross-ice Shot Assists Against",
              "desc": "Křižné přihrávky na střelecké pokusy proti týmu",
              "data": "count"
            },
            {
              "name": "cr.SAA/60",
              "type": "crsaa60",
              "colour": "red",
              "eng": "Cross-ice Shot Assists Against per 60",
              "desc": "Křižné přihrávky na střelecké pokusy proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SAF",
              "type": "bnsaf",
              "colour": "green",
              "eng": "Behind-the-net Shot Assists For",
              "desc": "Přihrávky zpoza branky na střelecké pokusy pro tým",
              "data": "count"
            },
            {
              "name": "bn.SAF/60",
              "type": "bnsaf60",
              "colour": "green",
              "eng": "Behind-the-net Shot Assists For per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SAA",
              "type": "bnsaa",
              "colour": "red",
              "eng": "Behind-the-net Shot Assists Against",
              "desc": "Přihrávky zpoza branky na střelecké pokusy proti týmu",
              "data": "count"
            },
            {
              "name": "bn.SAA/60",
              "type": "bnsaa60",
              "colour": "red",
              "eng": "Behind-the-net Shot Assists Against per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.SAF",
              "type": "1tsaf",
              "colour": "green",
              "eng": "One-timer Shot Assists For",
              "desc": "Přihrávky na střelecké pokusy z první pro tým",
              "data": "count"
            },
            {
              "name": "1T.SAF/60",
              "type": "1tsaf60",
              "colour": "green",
              "eng": "One-timer Shot Assists For per 60",
              "desc": "Přihrávky na střelecké pokusy z první pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.SAA",
              "type": "1tsaa",
              "colour": "red",
              "eng": "One-timer Shot Assists Against",
              "desc": "Přihrávky na střelecké pokusy z první proti týmu",
              "data": "count"
            },
            {
              "name": "1T.SAA/60",
              "type": "1tsaa60",
              "colour": "red",
              "eng": "One-timer Shot Assists Against per 60",
              "desc": "Přihrávky na střelecké pokusy z první proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "slotShotsAssists": [
        {
          "name": "Přihrávky na střely ze slotu",
          "name_en": "All slot shots assists",
          "type": "onice_slotShotsAssists",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sSAF",
              "type": "ssaf",
              "colour": "green",
              "eng": "Slot Shot Assists For",
              "desc": "Přihrávky na střelecké pokusy ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "sSAF/60",
              "type": "ssaf60",
              "colour": "green",
              "eng": "Slot Shot Assists For per 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "sSAA",
              "type": "ssaa",
              "colour": "red",
              "eng": "Slot Shot Assists Against",
              "desc": "Přihrávky na střelecké pokusy ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sSAA/60",
              "type": "ssaa60",
              "colour": "red",
              "eng": "Slot Shot Assists Against 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.sSAF",
              "type": "crssaf",
              "colour": "green",
              "eng": "Cross-ice Slot Shot Assists For",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "cr.sSAF/60",
              "type": "crssaf60",
              "colour": "green",
              "eng": "Cross-ice Slot Shot Assists For per 60",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.sSAA",
              "type": "crssaa",
              "colour": "red",
              "eng": "Cross-ice Slot Shot Assists Against",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "cr.sSAA/60",
              "type": "crssaa60",
              "colour": "red",
              "eng": "Cross-ice Slot Shot Assists Against per 60",
              "desc": "Křižné přihrávky na střelecké pokusy ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.sSAF",
              "type": "bnssaf",
              "colour": "green",
              "eng": "Behind-the-net Slot Shot Assists For",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "bn.sSAF/60",
              "type": "bnssaf60",
              "colour": "green",
              "eng": "Behind-the-net Slot Shot Assists For per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu pro tým za 60 minut ",
              "data": "60"
            },
            {
              "name": "bn.sSAA",
              "type": "bnssaa",
              "colour": "red",
              "eng": "Behind-the-net Slot Shot Assists Against",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "bn.sSAA/60",
              "type": "bnssaa60",
              "colour": "red",
              "eng": "Behind-the-net Slot Shot Assists Against per 60",
              "desc": "Přihrávky zpoza branky na střelecké pokusy ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.sSAF",
              "type": "1tssaf",
              "colour": "green",
              "eng": "One-timer Slot Shot Assists For",
              "desc": "Přihrávky na střelecké pokusy ze slotu z první pro tým",
              "data": "count"
            },
            {
              "name": "1T.sSAF/60",
              "type": "1tssaf60",
              "colour": "green",
              "eng": "One-timer Slot Shot Assists For per 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu z první pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.sSAA",
              "type": "1tssaa",
              "colour": "red",
              "eng": "One-timer Slot Shot Assists Against",
              "desc": "Přihrávky na střelecké pokusy ze slotu z první proti týmu",
              "data": "count"
            },
            {
              "name": "1T.sSAA/60",
              "type": "1tssaa60",
              "colour": "red",
              "eng": "One-timer Slot Shot Assists Against per 60",
              "desc": "Přihrávky na střelecké pokusy ze slotu z první proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "shotType": [
        {
          "name": "Typ střely",
          "name_en": "Shot type",
          "type": "individual_shotType",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "R",
              "type": "r",
              "colour": "green",
              "eng": "Rebound shots",
              "desc": "Dorážky",
              "data": "count"
            },
            {
              "name": "R/60",
              "type": "r60",
              "colour": "green",
              "eng": "Rebound shots per 60",
              "desc": "Dorážky za 60 minut",
              "data": "60"
            },
            {
              "name": "RC",
              "type": "rc",
              "colour": "green",
              "eng": "Rebounds Created",
              "desc": "Střely přímo předcházející dorážce",
              "data": "count"
            },
            {
              "name": "RC/60",
              "type": "rc60",
              "colour": "green",
              "eng": "Rebounds Created per 60",
              "desc": "Střely přímo předcházející dorážce za 60 minut",
              "data": "60"
            },
            {
              "name": "1T",
              "type": "1t",
              "colour": "green",
              "eng": "One-timer",
              "desc": "Střelecké pokusy z první",
              "data": "count"
            },
            {
              "name": "1T/60",
              "type": "1t60",
              "colour": "green",
              "eng": "One-timer per 60",
              "desc": "Střelecké pokusy z první za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "zoneEntries": [
        {
          "name": "Kontrolované vstupy do pásma",
          "name_en": "Controlled zone entries",
          "type": "onice_zoneEntries",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "ENF",
              "type": "enf",
              "colour": "green",
              "eng": "Controlled Zone Entries For",
              "desc": "Kontrolované vstupy do pásma pro tým",
              "data": "count"
            },
            {
              "name": "ENF/60",
              "type": "enf60",
              "colour": "green",
              "eng": "Controlled Zone Entries For per 60",
              "desc": "Kontrolované vstupy do pásma pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "ENF%",
              "type": "enf_percent",
              "colour": "green",
              "eng": "% of Controlled Zone Entries For of all Entries For",
              "desc": "Podíl kontrolovaných vstupů do pásma pro tým ze součtu všech vstupů do pásma pro tým (kontrolované vstupy + nahození)",
              "data": "percent"
            },
            {
              "name": "ENA",
              "type": "ena",
              "colour": "green",
              "eng": "Controlled Zone Entries Against",
              "desc": "Kontrolované vstupy do pásma proti týmu",
              "data": "count"
            },
            {
              "name": "ENA/60",
              "type": "ena60",
              "colour": "green",
              "eng": "Controlled Zone Entries Against per 60",
              "desc": "Kontrolované vstupy do pásma proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA%",
              "type": "ena_percent",
              "colour": "green",
              "eng": "% of Controlled Zone Entries Against of all Entries Against",
              "desc": "Podíl kontrolovaných vstupů do pásma proti týmu ze součtu všech vstupů do pásma proti týmu (kontrolované vstupy + nahození)",
              "data": "percent"
            },
            {
              "name": "ENF.W",
              "type": "enfw",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries For",
              "desc": "Úspěšné kontrolované vstupy do pásma pro tým",
              "data": "count"
            },
            {
              "name": "ENF.W/60",
              "type": "enfw60",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries For per 60",
              "desc": "Úspěšné kontrolované vstupy do pásma pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA.W",
              "type": "enaw",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries Against",
              "desc": "Úspěšné kontrolované vstupy do pásma proti týmu",
              "data": "count"
            },
            {
              "name": "ENA.W/60",
              "type": "enaw60",
              "colour": "green",
              "eng": "Successful Controlled Zone Entries Against per 60",
              "desc": "Úspěšné kontrolované vstupy do pásma proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA-DN",
              "type": "enadn",
              "colour": "red",
              "eng": "Zone Entries Against - Denials",
              "desc": "Zamezení soupeřových kontrolovaných vstupů do pásma proti týmu",
              "data": "count"
            },
            {
              "name": "ENA-DN/60",
              "type": "enadn60",
              "colour": "red",
              "eng": "Zone Entries Against - Denials per 60",
              "desc": "Zamezení soupeřových kontrolovaných vstupů do pásma proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "zoneEntriesLedingToShot": [
        {
          "name": "Střely po vstupech do pásma",
          "name_en": "Controlled zone entries leading to shots",
          "type": "onice_zoneEntries",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "ENF→CF",
              "type": "enfcf",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Shots For",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem pro tým s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENF→CF/60",
              "type": "enfcf60",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Shots For per 60",
              "desc": "Kontrolované vstupy týmu do pásma s následným střeleckým pokusem pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENF→CF%",
              "type": "enfcf_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Shots For %",
              "desc": "Podíl kontrolovaných vstupů týmu do pásma s následným střeleckým pokusem pro tým ze všech kontrolovaných vstupů do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "ENF→sCF",
              "type": "enfscf",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Slot Shots For",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem ze slotu pro tým s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENF→sCF/60",
              "type": "enfscf60",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Slot Shots For per 60",
              "desc": "Kontrolované vstupy týmu do pásma s následným střeleckým pokusem ze slotu pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENF→sCF%",
              "type": "enfscf_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Slot Shots For %",
              "desc": "Podíl kontrolovaných vstupů týmu do pásma s následným střeleckým pokusem ze slotu pro tým ze všech kontrolovaných vstupů do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "ENF→GF",
              "type": "enfgf",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Goals For",
              "desc": "Kontrolované vstupy do pásma s následným gólem pro tým s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENF→GF/60",
              "type": "enfgf60",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Goals For per 60",
              "desc": "Kontrolované vstupy týmu do pásma s následným gólem pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENF→GF%",
              "type": "enfgf_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries For leading to Goals For %",
              "desc": "Podíl kontrolovaných vstupů týmu do pásma s následným gólem pro tým ze všech kontrolovaných vstupů do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "xGF.ENF",
              "type": "xgfenf",
              "colour": "green",
              "eng": "Expected goals For from Zone Entries For",
              "desc": "Očekávané góly týmu po kontrolovaných vstupech týmu do pásma s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "xGF.ENF/60",
              "type": "xgfenf60",
              "colour": "green",
              "eng": "Expected goals For from Zone Entries For per 60",
              "desc": "Očekávané góly týmu po kontrolovaných vstupech týmu do pásma s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA→CA",
              "type": "enaca",
              "colour": "green",
              "eng": "Controlled Zone Entries Against resulting in Shot attempts Against",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENA→CA/60",
              "type": "enaca60",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Shots Against",
              "desc": "Kontrolované vstupy soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA→CA%",
              "type": "enaca_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Shots Against %",
              "desc": "Podíl kontrolovaných vstupů soupeře do pásma s následným střeleckým pokusem ze slotu proti týmu ze všech kontrolovaných vstupů soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "ENA→sCA",
              "type": "enasca",
              "colour": "green",
              "eng": "Controlled Zone Entries Against resulting in Slot shot attempts Against",
              "desc": "Kontrolované vstupy do pásma s následným střeleckým pokusem ze slotu proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENA→sCA/60",
              "type": "enasca60",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Slot Shots Against",
              "desc": "Kontrolované vstupy soupeře do pásma s následným střeleckým pokusem ze slotu proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA→sCA%",
              "type": "enasca_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Slot Shots Against %",
              "desc": "Podíl kontrolovaných vstupů soupeře do pásma s následným střeleckým pokusem ze slotu proti týmu ze všech kontrolovaných vstupů soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "ENA→GA",
              "type": "enaga",
              "colour": "green",
              "eng": "Controlled Zone Entries Against resulting in Goals Against",
              "desc": "Kontrolované vstupy do pásma s následným gólem proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "ENA→GA/60",
              "type": "enaga60",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Goals Against",
              "desc": "Kontrolované vstupy soupeře do pásma s následným gólem proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "ENA→GA%",
              "type": "enaga_percent",
              "colour": "green",
              "eng": "Controlled Zone Entries Against leading to Goals Against %",
              "desc": "Podíl kontrolovaných vstupů soupeře do pásma s následným gólem proti týmu ze všech kontrolovaných vstupů soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "xGA.ENA",
              "type": "xgaena",
              "colour": "green",
              "eng": "Expected goals Against from Zone Entries Against",
              "desc": "Očekávané góly soupeře po kontrolovaných vstupech soupeře do pásma s následným střeleckým pokusem proti týmu",
              "data": "count"
            },
            {
              "name": "xGA.ENA/60",
              "type": "xgaena60",
              "colour": "green",
              "eng": "Expected goals Against from Zone Entries Against per 60",
              "desc": "Očekávané góly soupeře po kontrolovaných vstupech soupeře do pásma s následným střeleckým pokusem proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "zoneExits": [
        {
          "name": "Kontrolované výstupy z pásma",
          "name_en": "Controlled zone exits",
          "type": "onice_zoneExits",
          "select_type": 2,
          "enabled": true,
          "attributes": [
            {
              "name": "EXF",
              "type": "exf",
              "colour": "red",
              "eng": "Controlled Zone Exits For",
              "desc": "Kontrolované výstupy z pásma pro tým",
              "data": "count"
            },
            {
              "name": "EXF/60",
              "type": "exf60",
              "colour": "red",
              "eng": "Controlled Zone Exits For per 60",
              "desc": "Kontrolované výstupy z pásma pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "EXF%",
              "type": "exf_percent",
              "colour": "red",
              "eng": "% of Controlled Zone Exits For of all Exits For",
              "desc": "Podíl kontrolovaných výstupů z pásma pro tým ze součtu všech výstupů z pásma pro tým (kontrolované výstupy + vyhození)",
              "data": "percent"
            },
            {
              "name": "EXA",
              "type": "exa",
              "colour": "red",
              "eng": "Controlled Zone Exits Against",
              "desc": "Soupeřovy kontrolované výstupy z pásma proti týmu",
              "data": "count"
            },
            {
              "name": "EXA/60",
              "type": "exa60",
              "colour": "red",
              "eng": "Controlled Zone Exits Against per 60",
              "desc": "Kontrolované výstupy z pásma proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "EXA%",
              "type": "exa_percent",
              "colour": "red",
              "eng": "% of Controlled Zone Exits Against of all Exits Against",
              "desc": "Podíl kontrolovaných výstupů z pásma proti týmu ze součtu všech výstupů z pásma proti týmu (kontrolované výstupy + vyhození)",
              "data": "percent"
            },
            {
              "name": "EXF.W",
              "type": "exfw",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits For",
              "desc": "Úspěšné kontrolované výstupy z pásma pro tým",
              "data": "count"
            },
            {
              "name": "EXF.W/60",
              "type": "exfw60",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits For per 60",
              "desc": "Úspěšné kontrolované výstupy z pásma pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "EXA.W",
              "type": "exaw",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits Against",
              "desc": "Úspěšné kontrolované výstupy z pásma proti týmu",
              "data": "count"
            },
            {
              "name": "EXA.W/60",
              "type": "exaw60",
              "colour": "red",
              "eng": "Successful Controlled Zone Exits Against per 60",
              "desc": "Úspěšné kontrolované výstupy z pásma proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "EXF.stP",
              "type": "exf_stp",
              "colour": "red",
              "eng": "Controlled Zone Exits by Strech Pass For",
              "desc": "Kontrolované výstupy z pásma přihrávkou za červenou čáru pro tým",
              "data": "count"
            },
            {
              "name": "EXF.stP/60",
              "type": "exf_stp60",
              "colour": "red",
              "eng": "Controlled Zone Exits by Strech Pass For per 60",
              "desc": "Kontrolované výstupy z pásma přihrávkou za červenou čáru pro tým za 60 minut",
              "data": "count"
            }
          ]
        }
      ],
      "dumpins": [
        {
          "name": "Nahození",
          "name_en": "Dump-ins",
          "type": "onice_dumpins",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DIF",
              "type": "dif",
              "colour": "green",
              "eng": "Dump-ins For",
              "desc": "Nahození puku pro tým",
              "data": "count"
            },
            {
              "name": "DIF/60",
              "type": "dif60",
              "colour": "green",
              "eng": "Dump-ins For",
              "desc": "Nahození puku pro tým",
              "data": "60"
            },
            {
              "name": "DIBF",
              "type": "dibf",
              "colour": "green",
              "eng": "Dump-in Battles For",
              "desc": "Souboje po nahození puku pro tým",
              "data": "count"
            },
            {
              "name": "DIBF/60",
              "type": "dibf60",
              "colour": "green",
              "eng": "Dump-in Battles For per 60",
              "desc": "Souboje po nahození puku pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBF%",
              "type": "dibf_percent",
              "colour": "green",
              "eng": "Dump-in Battles For %",
              "desc": "Podíl nahození s následným soubojem ze všech nahození pro tým",
              "data": "percent"
            },
            {
              "name": "DIBWF",
              "type": "dibwf",
              "colour": "green",
              "eng": "Dump-in Battles For Won",
              "desc": "Nahození s následným vyhraným soubojem pro tým",
              "data": "count"
            },
            {
              "name": "DIBWF/60",
              "type": "dibwf60",
              "colour": "green",
              "eng": "Dump-in Battles For Won per 60",
              "desc": "Nahození s následným vyhraným soubojem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBWF%",
              "type": "dibwf_percent",
              "colour": "green",
              "eng": "Dump-in Battles For Won %",
              "desc": "Podíl nahození s následným vyhraným soubojem ze všech nahození s následným soubojem pro tým",
              "data": "percent"
            },
            {
              "name": "DIA",
              "type": "dia",
              "colour": "green",
              "eng": "Dump-ins Against",
              "desc": "Nahození puku proti týmu",
              "data": "count"
            },
            {
              "name": "DIA/60",
              "type": "dia60",
              "colour": "green",
              "eng": "Dump-ins Against per 60",
              "desc": "Nahození puku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBA",
              "type": "diba",
              "colour": "green",
              "eng": "Dump-in Battles Against",
              "desc": "Souboje po nahození puku proti týmu",
              "data": "count"
            },
            {
              "name": "DIBA/60",
              "type": "diba60",
              "colour": "green",
              "eng": "Dump-in Battles Against per 60",
              "desc": "Souboje po nahození puku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBWA",
              "type": "dibwa",
              "colour": "green",
              "eng": "Dump-in Battles Against Won",
              "desc": "Nahození proti týmu s následným vyhraným soubojem týmem",
              "data": "count"
            },
            {
              "name": "DIBWA/60",
              "type": "dibwa60",
              "colour": "green",
              "eng": "Dump-in Battles Against Won per 60",
              "desc": "Nahození proti týmu s následným vyhraným soubojem týmem za 60 minut",
              "data": "60"
            },
            {
              "name": "DIBWA%",
              "type": "dibwa_percent",
              "colour": "green",
              "eng": "Dump-in Battles Against Won %",
              "desc": "Podíl nahození proti týmu s následným vyhraným soubojem týmem ze všech nahození s následným soubojem proti týmu",
              "data": "percent"
            }
          ]
        }
      ],
      "dumpinsToShots": [
        {
          "name": "Střely po nahození",
          "name_en": "Dump-ins leading to shots",
          "type": "onice_dumpins",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DIF→CF",
              "type": "difcf",
              "colour": "green",
              "eng": "Dump-ins For leading to Shot For",
              "desc": "Nahození týmu s následným střeleckým pokusem pro tým s hráčem na ledě ",
              "data": "count"
            },
            {
              "name": "DIF→CF/60",
              "type": "difcf60",
              "colour": "green",
              "eng": "Dump-ins For leading to Shot For per 60",
              "desc": "Nahození týmu s následným střeleckým pokusem pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "DIF→CF%",
              "type": "difcf_percent",
              "colour": "green",
              "eng": "Dump-ins For leading to Shot For %",
              "desc": "Podíl nahození týmu do pásma s následným střeleckým pokusem pro tým ze všech nahození do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "DIF→sCF",
              "type": "difscf",
              "colour": "green",
              "eng": "Dump-ins For leading to Slot Shots For",
              "desc": "Nahození týmu s následným střeleckým pokusem ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "DIF→sCF/60",
              "type": "difscf60",
              "colour": "green",
              "eng": "Dump-ins For leading to Slot Shots For per 60",
              "desc": "Nahození týmu s následným střeleckým pokusem ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIF→sCF%",
              "type": "difscf_percent",
              "colour": "green",
              "eng": "Dump-ins For leading to Slot Shots For %",
              "desc": "Podíl nahození týmu s následným střeleckým pokusem ze slotu pro tým ze všech nahození týmu",
              "data": "percent"
            },
            {
              "name": "DIF→GF",
              "type": "difgf",
              "colour": "green",
              "eng": "Dump-ins For leading to Goals For",
              "desc": "Nahození týmu s následným gólem pro tým",
              "data": "count"
            },
            {
              "name": "DIF→GF/60",
              "type": "difgf60",
              "colour": "green",
              "eng": "Dump-ins For leading to Goals For per 60",
              "desc": "Nahození týmu s následným gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIF→GF%",
              "type": "difgf_percent",
              "colour": "green",
              "eng": "Dump-ins For leading to Goals For %",
              "desc": "Podíl nahození týmu s následným gólem pro tým ze všech nahození týmu",
              "data": "percent"
            },
            {
              "name": "xGF.DIF",
              "type": "xgfdif",
              "colour": "green",
              "eng": "Expected goals For from Dump-ins For",
              "desc": "Očekávané góly týmu po nahození týmu do pásma s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "xGF.DIF/60",
              "type": "xgfdif60",
              "colour": "green",
              "eng": "Expected goals For from Dump-ins For per 60",
              "desc": "Očekávané góly týmu po nahození týmu do pásma s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DIA→CA",
              "type": "diaca",
              "colour": "green",
              "eng": "Dump-ins Against leading to Shot Against",
              "desc": "Nahození soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "DIA→CA/60",
              "type": "diaca60",
              "colour": "green",
              "eng": "Dump-ins Against leading to Shot Against per 60",
              "desc": "Nahození soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "DIA→CA%",
              "type": "diaca_percent",
              "colour": "green",
              "eng": "Dump-ins Against leading to Shot Against %",
              "desc": "Podíl nahození soupeře do pásma s následným střeleckým pokusem proti týmu ze všech nahození soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "DIA→sCA",
              "type": "diasca",
              "colour": "green",
              "eng": "Dump-ins Against leading to Slot Shots Against",
              "desc": "Nahození soupeře s následným střeleckým pokusem ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "DIA→sCA/60",
              "type": "diasca60",
              "colour": "green",
              "eng": "Dump-ins Against leading to Slot Shots Against per 60",
              "desc": "Nahození soupeře s následným střeleckým pokusem ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DIA→sCA%",
              "type": "diasca_percent",
              "colour": "green",
              "eng": "Dump-ins Against leading to Slot Shots Against %",
              "desc": "Podíl nahození soupeře s následným střeleckým pokusem ze slotu proti týmu ze všech nahození soupeře",
              "data": "percent"
            },
            {
              "name": "DIA→GA",
              "type": "diaga",
              "colour": "green",
              "eng": "Dump-ins Against leading to Goals Against",
              "desc": "Nahození soupeře s následným gólem proti týmu",
              "data": "count"
            },
            {
              "name": "DIA→GA/60",
              "type": "diaga60",
              "colour": "green",
              "eng": "Dump-ins Against leading to Goals Against per 60",
              "desc": "Nahození soupeře s následným gólem proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DIA→GA%",
              "type": "diaga_percent",
              "colour": "green",
              "eng": "Dump-ins Against leading to Goals Against %",
              "desc": "Podíl nahození soupeře s následným gólem proti týmu ze všech nahození soupeře",
              "data": "percent"
            },
            {
              "name": "xGA.DIA",
              "type": "xgadia",
              "colour": "green",
              "eng": "Expected goals Against from Dump-ins Against",
              "desc": "Očekávané góly soupeře po nahození soupeře do pásma s následným střeleckým pokusem proti týmu",
              "data": "count"
            },
            {
              "name": "xGA.DIA/60",
              "type": "xgadia60",
              "colour": "green",
              "eng": "Expected goals Against from Dump-ins Against per 60",
              "desc": "Očekávané góly soupeře po nahození soupeře do pásma s následným střeleckým pokusem proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "dumpouts": [
        {
          "name": "Vyhození",
          "name_en": "Dump-outs",
          "type": "onice_dumpouts",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DOF",
              "type": "dof",
              "colour": "red",
              "eng": "Dump-outs For",
              "desc": "Vyhození puku pro tým",
              "data": "count"
            },
            {
              "name": "DOF/60",
              "type": "dof60",
              "colour": "red",
              "eng": "Dump-outs For per 60",
              "desc": "Vyhození puku pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBF",
              "type": "dobf",
              "colour": "green",
              "eng": "Dump-out Battles For",
              "desc": "Souboje po vyhození puku pro tým",
              "data": "count"
            },
            {
              "name": "DOBF/60",
              "type": "dobf60",
              "colour": "green",
              "eng": "Dump-out Battles For per 60",
              "desc": "Souboje po vyhození puku pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBF%",
              "type": "dobf_percent",
              "colour": "green",
              "eng": "Dump-out Battles For %",
              "desc": "Podíl vyhození s následným soubojem ze všech vyhození pro tým",
              "data": "percent"
            },
            {
              "name": "DOBWF",
              "type": "dobwf",
              "colour": "green",
              "eng": "Dump-out Battles For Won",
              "desc": "Vyhození s následným vyhraným soubojem pro tým",
              "data": "count"
            },
            {
              "name": "DOBWF/60",
              "type": "dobwf60",
              "colour": "green",
              "eng": "Dump-out Battles For Won per 60",
              "desc": "Vyhození s následným vyhraným soubojem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBWF%",
              "type": "dobwf_percent",
              "colour": "green",
              "eng": "Dump-out Battles For Won %",
              "desc": "Podíl vyhození s následným vyhraným soubojem ze všech vyhození s následným soubojem pro tým",
              "data": "percent"
            },
            {
              "name": "DOA",
              "type": "doa",
              "colour": "green",
              "eng": "Dump-outs Against",
              "desc": "Vyhození puku proti týmu",
              "data": "count"
            },
            {
              "name": "DOA/60",
              "type": "doa60",
              "colour": "green",
              "eng": "Dump-outs Against per 60",
              "desc": "Vyhození puku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBA",
              "type": "doba",
              "colour": "red",
              "eng": "Dump-out Battles Against",
              "desc": "Souboje po vyhození puku proti týmu",
              "data": "count"
            },
            {
              "name": "DOBA/60",
              "type": "doba60",
              "colour": "red",
              "eng": "Dump-out Battles Against per 60",
              "desc": "Souboje po vyhození puku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBWA",
              "type": "dobwa",
              "colour": "red",
              "eng": "Dump-out Battles Against Won ",
              "desc": "Vyhození proti týmu s následným vyhraným soubojem týmem",
              "data": "count"
            },
            {
              "name": "DOBWA/60",
              "type": "dobwa60",
              "colour": "red",
              "eng": "Dump-out Battles Against Won per 60",
              "desc": "Vyhození proti týmu s následným vyhraným soubojem týmem za 60 minut",
              "data": "60"
            },
            {
              "name": "DOBWA%",
              "type": "dobwa_percent",
              "colour": "red",
              "eng": "Dump-out Battles Against Won %",
              "desc": "Podíl vyhození proti týmu s následným vyhraným soubojem týmem ze všech vyhození s následným soubojem proti týmu",
              "data": "percent"
            }
          ]
        }
      ],
      "dumpoutsToShots": [
        {
          "name": "Střely po vyhození",
          "name_en": "Dump-outs leading to shots",
          "type": "onice_dumpoutsToShots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "DOF→CF",
              "type": "dofcf",
              "colour": "green",
              "eng": "Dump-outs For leading to Shot For",
              "desc": "Vyhození týmu s následným střeleckým pokusem pro tým s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "DOF→CF/60",
              "type": "dofcf60",
              "colour": "green",
              "eng": "Dump-outs For leading to Shot For per 60",
              "desc": "Vyhození týmu s následným střeleckým pokusem pro tým s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "DOF→CF%",
              "type": "dofcf_percent",
              "colour": "green",
              "eng": "Dump-outs For leading to Shot For %",
              "desc": "Podíl vyhození týmu do pásma s následným střeleckým pokusem pro tým ze všech vyhození do pásma pro tým",
              "data": "percent"
            },
            {
              "name": "DOF→sCF",
              "type": "dofscf",
              "colour": "green",
              "eng": "Dump-outs For leading to Slot Shots For",
              "desc": "Vyhození týmu s následným střeleckým pokusem ze slotu pro tým",
              "data": "count"
            },
            {
              "name": "DOF→sCF/60",
              "type": "dofscf60",
              "colour": "green",
              "eng": "Dump-outs For leading to Slot Shots For per 60",
              "desc": "Vyhození týmu s následným střeleckým pokusem ze slotu pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOF→sCF%",
              "type": "dofscf_percent",
              "colour": "green",
              "eng": "Dump-outs For leading to Slot Shots For %",
              "desc": "Podíl vyhození týmu s následným střeleckým pokusem ze slotu pro tým ze všech vyhození týmu",
              "data": "percent"
            },
            {
              "name": "DOF→GF",
              "type": "dofgf",
              "colour": "green",
              "eng": "Dump-outs For leading to Goals For",
              "desc": "Vyhození týmu s následným gólem pro tým",
              "data": "count"
            },
            {
              "name": "DOF→GF/60",
              "type": "dofgf60",
              "colour": "green",
              "eng": "Dump-outs For leading to Goals For per 60",
              "desc": "Vyhození týmu s následným gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOF→GF%",
              "type": "dofgf_percent",
              "colour": "green",
              "eng": "Dump-outs For leading to Goals For %",
              "desc": "Podíl vyhození týmu s následným gólem pro tým ze všech vyhození týmu",
              "data": "percent"
            },
            {
              "name": "xGF.DOF",
              "type": "xgfdof",
              "colour": "green",
              "eng": "Expected goals For from Dump-outs For",
              "desc": "Očekávané góly týmu po vyhození týmu do pásma s následným střeleckým pokusem pro tým",
              "data": "count"
            },
            {
              "name": "xGF.DOF/60",
              "type": "xgfdof60",
              "colour": "green",
              "eng": "Expected goals For from Dump-outs For per 60",
              "desc": "Očekávané góly týmu po vyhození týmu do pásma s následným střeleckým pokusem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "DOA→CA",
              "type": "doaca",
              "colour": "green",
              "eng": "Dump-outs Against leading to Shot Against",
              "desc": "Vyhození soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě",
              "data": "count"
            },
            {
              "name": "DOA→CA/60",
              "type": "doaca60",
              "colour": "green",
              "eng": "Dump-outs Against leading to Shot Against per 60",
              "desc": "Vyhození soupeře do pásma s následným střeleckým pokusem proti týmu s hráčem na ledě za 60 minut",
              "data": "60"
            },
            {
              "name": "DOA→CA%",
              "type": "doaca_percent",
              "colour": "green",
              "eng": "Dump-outs Against leading to Shot Against %",
              "desc": "Podíl vyhození soupeře do pásma s následným střeleckým pokusem proti týmu ze všech vyhození soupeře do pásma",
              "data": "percent"
            },
            {
              "name": "DOA→sCA",
              "type": "doasca",
              "colour": "green",
              "eng": "Dump-outs Against leading to Slot Shots Against",
              "desc": "Vyhození soupeře s následným střeleckým pokusem ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "DOA→sCA/60",
              "type": "doasca60",
              "colour": "green",
              "eng": "Dump-outs Against leading to Slot Shots Against per 60",
              "desc": "Vyhození soupeře s následným střeleckým pokusem ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DOA→sCA%",
              "type": "doasca_percent",
              "colour": "green",
              "eng": "Dump-outs Against leading to Slot Shots Against %",
              "desc": "Podíl Vyhození soupeře s následným střeleckým pokusem ze slotu proti týmu ze všech Vyhození soupeře",
              "data": "percent"
            },
            {
              "name": "DOA→GA",
              "type": "doaga",
              "colour": "green",
              "eng": "Dump-outs Against leading to Goals Against",
              "desc": "Vyhození soupeře s následným gólem proti týmu",
              "data": "count"
            },
            {
              "name": "DOA→GA/60",
              "type": "doaga60",
              "colour": "green",
              "eng": "Dump-outs Against leading to Goals Against per 60",
              "desc": "Vyhození soupeře s následným gólem proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "DOA→GA%",
              "type": "doaga_percent",
              "colour": "green",
              "eng": "Dump-outs Against leading to Goals Against %",
              "desc": "Podíl vyhození soupeře s následným gólem proti týmu ze všech vyhození soupeře",
              "data": "percent"
            },
            {
              "name": "xGA.DOA",
              "type": "xgadoa",
              "colour": "green",
              "eng": "Expected goals Against from Dump-outs Against",
              "desc": "Očekávané góly soupeře po vyhození soupeře do pásma s následným střeleckým pokusem proti týmu",
              "data": "count"
            },
            {
              "name": "xGA.DOA/60",
              "type": "xgadoa60",
              "colour": "green",
              "eng": "Expected goals Against from Dump-outs Against per 60",
              "desc": "Očekávané góly soupeře po vyhození soupeře do pásma s následným střeleckým pokusem proti týmu za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "puckWonOrLostToShot": [
        {
          "name": "Zisky a Ztráty puku před střelou",
          "name_en": "Puck won or lost to shot",
          "type": "puckWonOrLostToShot",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "pW→CF",
              "type": "pwcf",
              "colour": "green",
              "eng": "Puck Won to Shot For",
              "desc": "Zisky puku před střelou pro tým",
              "data": "count"
            },
            {
              "name": "pW→CF/60",
              "type": "pwcf60",
              "colour": "green",
              "eng": "Puck Won to Shot For per 60",
              "desc": "Zisky puku před střelou pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "pW→GF",
              "type": "pwgf",
              "colour": "green",
              "eng": "Puck Won to Goal For",
              "desc": "Zisky puku před gólem pro tým",
              "data": "count"
            },
            {
              "name": "pW→GF/60",
              "type": "pwgf60",
              "colour": "green",
              "eng": "Puck Won to Goal For per 60",
              "desc": "Zisky puku před gólem pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.pW→CF",
              "type": "ozpwcf",
              "colour": "green",
              "eng": "Offensive Zone Puck Won to Shot For",
              "desc": "Zisky puku v útočném pásmu před střelou pro tým",
              "data": "count"
            },
            {
              "name": "OZ.pW→CF/60",
              "type": "ozpwcf60",
              "colour": "green",
              "eng": "Offensive Zone Puck Won to Shot For per 60",
              "desc": "Zisky puku v útočném pásmu před střelou pro tým za 60 minut",
              "data": "60"
            },
            {
              "name": "OZ.pW→GF",
              "type": "ozpwgf",
              "colour": "green",
              "eng": "Offensive Zone Puck Won to Goal For",
              "desc": "Zisky puku v útočném pásmu před gólem pro tým",
              "data": "count"
            },
            {
              "name": "OZ.pW→GF/60",
              "type": "ozpwgf60",
              "colour": "green",
              "eng": "Offensive Zone Puck Won to Goal For",
              "desc": "Zisky puku v útočném pásmu před gólem pro tým",
              "data": "60"
            },

            {
              "name": "pL→CA",
              "type": "plca",
              "colour": "red",
              "eng": "Puck Lost to Shot Against",
              "desc": "Ztráty puku před střelou soupeře",
              "data": "count"
            },
            {
              "name": "pL→CA/60",
              "type": "plca60",
              "colour": "red",
              "eng": "Puck Lost to Shot Against per 60",
              "desc": "Ztráty puku před střelou soupeře za 60 minut",
              "data": "60"
            },
            {
              "name": "pL→GA",
              "type": "plga",
              "colour": "red",
              "eng": "Puck Lost to Goal Against",
              "desc": "Ztráty puku před gólem soupeře",
              "data": "count"
            },
            {
              "name": "pL→GA/60",
              "type": "plga60",
              "colour": "red",
              "eng": "Puck Lost to Goal Against per 60",
              "desc": "Ztráty puku před gólem soupeře za 60 minut",
              "data": "60"
            },
            {
              "name": "DZ.pL→CA",
              "type": "dzplca",
              "colour": "red",
              "eng": "Defensive Zone Puck Lost to Shot Against",
              "desc": "Ztráty puku v obranném pásmu před střelou soupeře",
              "data": "count"
            },
            {
              "name": "DZ.pL→CA/60",
              "type": "dzplca60",
              "colour": "red",
              "eng": "Defensive Zone Puck Lost to Shot Against per 60",
              "desc": "Ztráty puku v obranném pásmu před střelou soupeře za 60 minut",
              "data": "60"
            },
            {
              "name": "DZ.pL→GA",
              "type": "dzplga",
              "colour": "red",
              "eng": "Defensive Zone Puck Lost to Goal Against",
              "desc": "Ztráty puku v obranném pásmu před gólem soupeře",
              "data": "count"
            },
            {
              "name": "DZ.pL→GA/60",
              "type": "dzplga60",
              "colour": "red",
              "eng": "Defensive Zone Puck Lost to Goal Against per 60",
              "desc": "Ztráty puku v obranném pásmu před gólem soupeře za 60 minut",
              "data": "60"
            }
          ]
        }
      ]
    }
  ],
  "goalkeepersData": [
    {
      "shotsOnGoal": [
        {
          "name": "Střely na branku",
          "name_en": "shots on goal",
          "type": "goalkeepers_shotsOnGoal",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "GA",
              "type": "ga",
              "colour": "white",
              "eng": "Goals Against",
              "desc": "Obdržené góly",
              "data": "count"
            },
            {
              "name": "GA/60",
              "type": "ga60",
              "colour": "white",
              "eng": "Goals Against per 60",
              "desc": "Obržené góly u za 60 minut",
              "data": "60"
            },
            {
              "name": "xGA",
              "type": "xga",
              "colour": "white",
              "eng": "Expected Goals Against",
              "desc": "Obdržené góly",
              "data": "count"
            },
            {
              "name": "xGA/60",
              "type": "xga60",
              "colour": "white",
              "eng": "Expected Goals Against per 60",
              "desc": "Obržené góly u za 60 minut",
              "data": "60"
            },
            {
              "name": "GA-xGA",
              "type": "gaxga",
              "colour": "white",
              "eng": "Goals Against vs. Expected Goals Against",
              "desc": "Rozdíl mezi obdrženými góly a očekávanými obdrženými góly",
              "data": "count"
            },
            {
              "name": "SOGA",
              "type": "soga",
              "colour": "white",
              "eng": "Shots On Goal Against",
              "desc": "Střely na branku proti týmu",
              "data": "count"
            },
            {
              "name": "SOGA/60",
              "type": "soga60",
              "colour": "white",
              "eng": "Shots On Goal Against per 60",
              "desc": "Střely na branku proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "Sv",
              "type": "sv",
              "colour": "white",
              "eng": "Shots saved",
              "desc": "Chycené střely",
              "data": "count"
            },
            {
              "name": "Sv/60",
              "type": "sv60",
              "colour": "white",
              "eng": "Shots saved per 60",
              "desc": "Chycené střely za 60 minut",
              "data": "60"
            },
            {
              "name": "Sv%",
              "type": "sv_percent",
              "colour": "white",
              "eng": "% of Shots saved",
              "desc": "Úspěšnost chycených střel",
              "data": "percent"
            },
            {
              "name": "GSAA",
              "type": "gsaa",
              "colour": "white",
              "eng": "Goals Saved Above Average",
              "desc": "Počet gólů, kterým brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "GSAA/60",
              "type": "gsaa60",
              "colour": "white",
              "eng": "Goals Saved Above Average per 60",
              "desc": "Počet gólů, kterým brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "rebounds": [
        {
          "name": "Dorážky",
          "name_en": "rebounds",
          "type": "goalkeepers_rebounds",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "R.GA",
              "type": "rga",
              "colour": "white",
              "eng": "Rebound Goals Against",
              "desc": "Obdržené góly z dorážek",
              "data": "count"
            },
            {
              "name": "R.GA/60",
              "type": "rga60",
              "colour": "white",
              "eng": "Rebound Goals Against per 60",
              "desc": "Obržené góly z dorážek za 60 minut",
              "data": "60"
            },
            {
              "name": "R.SOGA",
              "type": "rsoga",
              "colour": "white",
              "eng": "Rebound Shots On Goal Against",
              "desc": "Střely na branku z dorážek proti týmu",
              "data": "count"
            },
            {
              "name": "R.SOGA/60",
              "type": "rsoga60",
              "colour": "white",
              "eng": "Rebound Shots On Goal Against per 60",
              "desc": "Střely na branku z dorážek proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "R.Sv",
              "type": "rsv",
              "colour": "white",
              "eng": "Rebounds saved",
              "desc": "Chycené dorážky",
              "data": "count"
            },
            {
              "name": "R.Sv/60",
              "type": "rsv60",
              "colour": "white",
              "eng": "Rebounds saved per 60",
              "desc": "Chycené dorážky za 60 minut",
              "data": "60"
            },
            {
              "name": "R.Sv%",
              "type": "rsv_percent",
              "colour": "white",
              "eng": "% of Rebounds saved",
              "desc": "Úspěšnost chycených dorážek",
              "data": "percent"
            },
            {
              "name": "R.GSAA",
              "type": "rgsaa",
              "colour": "white",
              "eng": "Rebound Goals Saved Above Average",
              "desc": "Počet gólů z dorážek, kterým brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "R.GSAA/60",
              "type": "rgsaa60",
              "colour": "white",
              "eng": "Rebound Goals Saved Above Average per 60",
              "desc": "Počet gólů z dorážek, kterým brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "count"
            }
          ]
        }
      ],
      "onetimers": [
        {
          "name": "Střely z první",
          "name_en": "one-timers",
          "type": "goalkeepers_onetimers",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "1T.GA",
              "type": "1tga",
              "colour": "white",
              "eng": "One-timer Goals Against",
              "desc": "Obdržené góly ze střel z první",
              "data": "count"
            },
            {
              "name": "1T.GA/60",
              "type": "1tga60",
              "colour": "white",
              "eng": "One-timer Goals Against per 60",
              "desc": "Obdržené góly ze střel z první za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.SOGA",
              "type": "1tsoga",
              "colour": "white",
              "eng": "One-timer Shots On Goal Against",
              "desc": "Střely na branku ze střel z první proti týmu",
              "data": "count"
            },
            {
              "name": "1T.SOGA/60",
              "type": "1tsoga60",
              "colour": "white",
              "eng": "One-timer Shots On Goal Against per 60",
              "desc": "Střely na branku ze střel z první proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.Sv",
              "type": "1tsv",
              "colour": "white",
              "eng": "One-timers saved",
              "desc": "Chycené střely z první",
              "data": "count"
            },
            {
              "name": "1T.Sv/60",
              "type": "1tsv60",
              "colour": "white",
              "eng": "One-timers saved per 60",
              "desc": "Chycené střely z první za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.Sv%",
              "type": "1tsv_percent",
              "colour": "white",
              "eng": "% of One-timers saved",
              "desc": "Úspěšnost chycených střel z první",
              "data": "percent"
            },
            {
              "name": "1T.GSAA",
              "type": "1tgsaa",
              "colour": "white",
              "eng": "One-time Goals Saved Above Average",
              "desc": "Počet gólů ze střel z první, kterým brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "1T.GSAA/60",
              "type": "1tgsaa60",
              "colour": "white",
              "eng": "One-timer Goals Saved Above Average per 60",
              "desc": "Počet gólů ze střel z první, kterým brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "assisted_shots": [
        {
          "name": "Střely z přihrávek",
          "name_en": "assisted shots",
          "type": "goalkeepers_assistedshots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SA.GA",
              "type": "saga",
              "colour": "white",
              "eng": "Goals Against from Assisted Shots",
              "desc": "Obdržené góly ze střel, kterým předcházela přihrávka",
              "data": "count"
            },
            {
              "name": "SA.GA/60",
              "type": "saga60",
              "colour": "white",
              "eng": "Goals Against from Assisted Shots per 60",
              "desc": "Obdržené góly ze střel, kterým předcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "SA.SOGA",
              "type": "sasoga",
              "colour": "white",
              "eng": "Assisted Shots On Goal Against",
              "desc": "Střely na branku proti týmu, kterým předcházela přihrávka",
              "data": "count"
            },
            {
              "name": "SA.SOGA/60",
              "type": "sasoga60",
              "colour": "white",
              "eng": "Assisted Shots On Goal Against per 60",
              "desc": "Střely na branku proti týmu, kterým předcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "SA.Sv",
              "type": "sasv",
              "colour": "white",
              "eng": "Assisted Shots Saved",
              "desc": "Chycené střely, kterým předcházela přihrávka",
              "data": "count"
            },
            {
              "name": "SA.Sv/60",
              "type": "sasv60",
              "colour": "white",
              "eng": "Assisted Shots Saved per 60",
              "desc": "Chycené střely, kterým předcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "SA.Sv%",
              "type": "sasv_percent",
              "colour": "white",
              "eng": "% of Assisted Shots Saved",
              "desc": "Úspěšnost chycených střel, kterým předcházela přihrávka",
              "data": "percent"
            },
            {
              "name": "SA.GSAA",
              "type": "sagsaa",
              "colour": "white",
              "eng": "Goals from Assisted Shots Saved Above Average",
              "desc": "Počet gólů ze střel, kterým předcházela přihrávka, jimž brankář zabránil v porovnání s průměrem ligy ",
              "data": "count"
            },
            {
              "name": "SA.GSAA/60",
              "type": "sagsaa60",
              "colour": "white",
              "eng": "Goals from Assisted Shots Saved Above Average per 60",
              "desc": "Počet gólů ze střel, kterým předcházela přihrávka, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "crossice_assisted_shots": [
        {
          "name": "Střely z křižných přihrávek",
          "name_en": "cross-ice assisted shots",
          "type": "goalkeepers_crossice_assisted_shots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "cr.SA.GA",
              "type": "crsaga",
              "colour": "white",
              "eng": "Goals Against from Cross-ice Assisted Shots",
              "desc": "Obdržené góly ze střel, kterým předcházela křižná přihrávka",
              "data": "count"
            },
            {
              "name": "cr.SA.GA/60",
              "type": "crsaga60",
              "colour": "white",
              "eng": "Goals Against from Cross-ice Assisted Shots per 60",
              "desc": "Obdržené góly ze střel, kterým předcházela křižná přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SA.SOGA",
              "type": "crsasoga",
              "colour": "white",
              "eng": "Cross-ice Assisted Shots On Goal Against",
              "desc": "Střely na branku proti týmu, kterým předcházela křižná přihrávka",
              "data": "count"
            },
            {
              "name": "cr.SA.SOGA/60",
              "type": "crsasoga60",
              "colour": "white",
              "eng": "Cross-ice Assisted Shots On Goal Against per 60",
              "desc": "Střely na branku proti týmu, kterým předcházela křižná přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SA.Sv",
              "type": "crsasv",
              "colour": "white",
              "eng": "Cross-ice Assisted Shots Saved",
              "desc": "Chycené střely, kterým předcházela křižná přihrávka",
              "data": "count"
            },
            {
              "name": "cr.SA.Sv/60",
              "type": "crsasv60",
              "colour": "white",
              "eng": "Cross-ice Assisted Shots Saved per 60",
              "desc": "Chycené střely, kterým předcházela křižná přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SA.Sv%",
              "type": "crsasv_percent",
              "colour": "white",
              "eng": "% of Cross-ice Assisted Shots Saved",
              "desc": "Úspěšnost chycených střel, kterým předcházela křižná přihrávka",
              "data": "percent"
            },
            {
              "name": "cr.SA.GSAA",
              "type": "crsagsaa",
              "colour": "white",
              "eng": "Goals from Cross-ice Assisted Shots Saved Above Average",
              "desc": "Počet gólů ze střel, kterým předcházela křižná přihrávka, jimž brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "cr.SA.GSAA/60",
              "type": "crsagsaa60",
              "colour": "white",
              "eng": "Goals from Cross-ice Assisted Shots Saved Above Average per 60",
              "desc": "Počet gólů ze střel, kterým předcházela křižná přihrávka, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "behindthenet_assisted_shots": [
        {
          "name": "Střely z přihrávek zpoza branky",
          "name_en": "behind-the-net assisted shots",
          "type": "goalkeepers_behindthenet_assisted_shots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "bn.SA.GA",
              "type": "bnsaga",
              "colour": "white",
              "eng": "Goals Against from Behind-the-net Assisted Shots",
              "desc": "Obdržené góly ze střel, kterým předcházela přihrávka zpoza branky",
              "data": "count"
            },
            {
              "name": "bn.SA.GA/60",
              "type": "bnsaga60",
              "colour": "white",
              "eng": "Goals Against from Behind-the-net Assisted Shots per 60",
              "desc": "Obdržené góly ze střel, kterým předcházela přihrávka zpoza branky za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SA.SOGA",
              "type": "bnsasoga",
              "colour": "white",
              "eng": "Behind-the-net Assisted Shots On Goal Against",
              "desc": "Střely na branku proti týmu, kterým předcházela přihrávka zpoza branky",
              "data": "count"
            },
            {
              "name": "bn.SA.SOGA/60",
              "type": "bnsasoga60",
              "colour": "white",
              "eng": "Behind-the-net Assisted Shots On Goal Against per 60",
              "desc": "Střely na branku proti týmu, kterým předcházela přihrávka zpoza branky za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SA.Sv",
              "type": "bnsasv",
              "colour": "white",
              "eng": "Behind-the-net Assisted Shots Saved",
              "desc": "Chycené střely, kterým předcházela přihrávka zpoza branky",
              "data": "count"
            },
            {
              "name": "bn.SA.Sv/60",
              "type": "bnsasv60",
              "colour": "white",
              "eng": "Behind-the-net Assisted Shots Saved per 60",
              "desc": "Chycené střely, kterým předcházela přihrávka zpoza branky za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SA.Sv%",
              "type": "bnsasv_percent",
              "colour": "white",
              "eng": "% of Behind-the-net Assisted Shots Saved",
              "desc": "Úspěšnost chycených střel, kterým předcházela přihrávka zpoza branky",
              "data": "percent"
            },
            {
              "name": "bn.SA.GSAA",
              "type": "bnsagsaa",
              "colour": "white",
              "eng": "Goals from Behind-the-net Assisted Shots Saved Above Average",
              "desc": "Počet gólů ze střel, kterým předcházela přihrávka zpoza branky, jimž brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "bn.SA.GSAA/60",
              "type": "bnsagsaa60",
              "colour": "white",
              "eng": "Goals from Behind-the-net Assisted Shots Saved Above Average per 60",
              "desc": "Počet gólů ze střel, kterým předcházela přihrávka zpoza branky, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "non_assisted_shots": [
        {
          "name": "Střely bez přihrávek",
          "name_en": "non-assisted shots",
          "type": "goalkeepers_non_assisted_shots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "nonSA.GA",
              "type": "nonsaga",
              "colour": "white",
              "eng": "Goals Against from Non-Assisted Shots",
              "desc": "Obdržené góly ze střel, kterým nepředcházela přihrávka",
              "data": "count"
            },
            {
              "name": "nonSA.GA/60",
              "type": "nonsaga60",
              "colour": "white",
              "eng": "Goals Against from Non-Assisted Shots per 60",
              "desc": "Obdržené góly ze střel, kterým nepředcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "nonSA.SOGA",
              "type": "nonsasoga",
              "colour": "white",
              "eng": "Non-Assisted Shots On Goal Against",
              "desc": "Střely na branku proti týmu, kterým nepředcházela přihrávka",
              "data": "count"
            },
            {
              "name": "nonSA.SOGA/60",
              "type": "nonsasoga60",
              "colour": "white",
              "eng": "Non-Assisted Shots On Goal Against per 60",
              "desc": "Střely na branku proti týmu, kterým nepředcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "nonSA.Sv",
              "type": "nonsasv",
              "colour": "white",
              "eng": "Non-Assisted Shots Saved",
              "desc": "Chycené střely, kterým nepředcházela přihrávka",
              "data": "count"
            },
            {
              "name": "nonSA.Sv/60",
              "type": "nonsasv60",
              "colour": "white",
              "eng": "Non-Assisted Shots Saved per 60",
              "desc": "Chycené střely, kterým nepředcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "nonSA.Sv%",
              "type": "nonsasv_percent",
              "colour": "white",
              "eng": "% of Non-Assisted Shots Saved",
              "desc": "Úspěšnost chycených střel, kterým nepředcházela přihrávka",
              "data": "percent"
            },
            {
              "name": "nonSA.GSAA",
              "type": "nonsagsaa",
              "colour": "white",
              "eng": "Goals from Non-Assisted Shots Saved Above Average",
              "desc": "Počet gólů ze střel, kterým nepředcházela přihrávka, jimž brankář zabránil v porovnání s průměrem ligy ",
              "data": "count"
            },
            {
              "name": "nonSA.GSAA/60",
              "type": "nonsagsaa60",
              "colour": "white",
              "eng": "Goals from Non-Assisted Shots Saved Above Average per 60",
              "desc": "Počet gólů ze střel, kterým nepředcházela přihrávka, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "basicData": [
        {
          "name": "Základní data",
          "name_en": "basic data",
          "type": "goalkeepers_basic_data",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SO",
              "type": "so",
              "colour": "white",
              "eng": "Shootouts",
              "desc": "Počet nájezdů, kterým brankář čelil",
              "data": "count"
            },
            {
              "name": "SO.SV",
              "type": "sosv",
              "colour": "white",
              "eng": "Shootouts saved",
              "desc": "Chycené nájezdy",
              "data": "count"
            },
            {
              "name": "SO.SV%",
              "type": "sosv_percent",
              "colour": "white",
              "eng": "Shootouts Saved %",
              "desc": "Úspěšnost chycených nájezdů",
              "data": "percent"
            },
            {
              "name": "SO.GSAA",
              "type": "sogsaa",
              "colour": "white",
              "eng": "Shootout Goals Saved Above Average",
              "desc": "Počet gólů z nájezdů, kterým brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            }
          ]
        }
      ],
      "slot_shots_on_goal": [
        {
          "name": "Střely na branku ze slotu",
          "name_en": "slot shots on goal",
          "type": "goalkeepers_slot_shots_on_goal",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "sGA",
              "type": "sga",
              "colour": "purple",
              "eng": "Slot Goals Against",
              "desc": "Obdržené góly ze slotu",
              "data": "count"
            },
            {
              "name": "sGA/60",
              "type": "sga60",
              "colour": "purple",
              "eng": "Slot Goals Against per 60",
              "desc": "Obdržené góly ze slotu u za 60 minut",
              "data": "60"
            },
            {
              "name": "sxGA",
              "type": "sxga",
              "colour": "purple",
              "eng": "Expected Slot Goals Against",
              "desc": "Očekávané obdržené góly ze slotu",
              "data": "count"
            },
            {
              "name": "sxGA/60",
              "type": "sxga60",
              "colour": "purple",
              "eng": "Expected Slot Goals Against per 60",
              "desc": "Očekávané obržené góly ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "sGA - sxGA",
              "type": "sgasxga",
              "colour": "purple",
              "eng": "Slot Goals Against vs. Expected Slot Goals Against",
              "desc": "Rozdíl obdržených gólů ze slotu a očekávaných obdržených gólů ze slotu",
              "data": "count"
            },
            {
              "name": "sGA/60 - sxGA/60",
              "type": "sga60sxga60",
              "colour": "purple",
              "eng": "Slot Goals Against vs. Expected Slot Goals Against per 60",
              "desc": "Rozdíl obdržených gólů ze slotu a očekávaných obdržených gólů ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "sSOGA",
              "type": "ssoga",
              "colour": "purple",
              "eng": "Slot Shots On Goal Against",
              "desc": "Střely na branku ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "sSOGA/60",
              "type": "ssoga60",
              "colour": "purple",
              "eng": "Slot Shots On Goal Against per 60",
              "desc": "Střely na branku ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "sSv",
              "type": "ssv",
              "colour": "purple",
              "eng": "Slot Shots saved",
              "desc": "Chycené střely ze slotu",
              "data": "count"
            },
            {
              "name": "sSv/60",
              "type": "ssv60",
              "colour": "purple",
              "eng": "Slot Shots saved per 60",
              "desc": "Chycené střely ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "sSv%",
              "type": "ssv_percent",
              "colour": "purple",
              "eng": "% of Slot Shots saved",
              "desc": "Úspěšnost chycených střel ze slotu",
              "data": "percent"
            },
            {
              "name": "sGSAA",
              "type": "sgsaa",
              "colour": "purple",
              "eng": "Slot Goals Saved Above Average",
              "desc": "Počet gólů ze slotu, kterým brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "sGSAA/60",
              "type": "sgsaa60",
              "colour": "purple",
              "eng": "Slot Goals Saved Above Average per 60",
              "desc": "Počet gólů ze slotu, kterým brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "slot_rebounds": [
        {
          "name": "Dorážky ze slotu",
          "name_en": "slot rebounds",
          "type": "goalkeepers_slot_rebounds",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "R.sGA",
              "type": "rsga",
              "colour": "purple",
              "eng": "Rebound Slot Goals Against",
              "desc": "Obdržené góly z dorážek ze slotu ",
              "data": "count"
            },
            {
              "name": "R.sGA/60",
              "type": "rsga60",
              "colour": "purple",
              "eng": "Rebound Slot Goals Against per 60",
              "desc": "Obdržené góly z dorážek ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "R.sSOGA",
              "type": "rssoga",
              "colour": "purple",
              "eng": "Rebound Slot Shots On Goal Against",
              "desc": "Střely na branku z dorážek ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "R.sSOGA/60",
              "type": "rssoga60",
              "colour": "purple",
              "eng": "Rebound Slot Shots On Goal Against per 60",
              "desc": "Střely na branku z dorážek ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "R.sSv",
              "type": "rssv",
              "colour": "purple",
              "eng": "Slot Rebounds saved",
              "desc": "Chycené dorážky ze slotu",
              "data": "count"
            },
            {
              "name": "R.sSv/60",
              "type": "rssv60",
              "colour": "purple",
              "eng": "Slot Rebounds saved per 60",
              "desc": "Chycené dorážky ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "R.sSv%",
              "type": "rssv_percent",
              "colour": "purple",
              "eng": "% of Slot Rebounds saved",
              "desc": "Úspěšnost chycených dorážek ze slotu",
              "data": "percent"
            },
            {
              "name": "R.sGSAA",
              "type": "rsgsaa",
              "colour": "purple",
              "eng": "Rebound Slot Goals Saved Above Average",
              "desc": "Počet gólů z dorážek ze slotu, kterým brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "R.sGSAA/60",
              "type": "rsgsaa60",
              "colour": "purple",
              "eng": "Rebound Slot Goals Saved Above Average per 60",
              "desc": "Počet gólů z dorážek ze slotu, kterým brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "slot_one_timers": [
        {
          "name": "Střely z první ze slotu",
          "name_en": "slot one-timers",
          "type": "goalkeepers_slot_one_timers",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "1T.sGA",
              "type": "1tsga",
              "colour": "purple",
              "eng": "One-timer Slot Goals Against",
              "desc": "Obdržené góly ze slotu ze střel z první",
              "data": "count"
            },
            {
              "name": "1T.sGA/60",
              "type": "1tsga60",
              "colour": "purple",
              "eng": "One-timer Slot Goals Against per 60",
              "desc": "Obdržené góly ze slotu ze střel z první za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.sSOGA",
              "type": "1tssoga",
              "colour": "purple",
              "eng": "One-timer Slot Shots On Goal Against",
              "desc": "Střely na branku ze střel z první ze slotu proti týmu",
              "data": "count"
            },
            {
              "name": "1T.sSOGA/60",
              "type": "1tssoga60",
              "colour": "purple",
              "eng": "One-timer Slot Shots On Goal Against per 60",
              "desc": "Střely na branku ze střel z první ze slotu proti týmu za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.sSv",
              "type": "1tssv",
              "colour": "purple",
              "eng": "Slot One-timers saved",
              "desc": "Chycené střely z první ze slotu ",
              "data": "count"
            },
            {
              "name": "1T.sSv/60",
              "type": "1tssv60",
              "colour": "purple",
              "eng": "Slot One-timers saved per 60",
              "desc": "Chycené střely z první ze slotu za 60 minut",
              "data": "60"
            },
            {
              "name": "1T.sSv%",
              "type": "1tssv_percent",
              "colour": "purple",
              "eng": "% of Slot One-timers saved",
              "desc": "Úspěšnost chycených střel z první ze slotu",
              "data": "percent"
            },
            {
              "name": "1T.sGSAA",
              "type": "1tsgsaa",
              "colour": "purple",
              "eng": "One-timer Slot Goals Saved Above Average",
              "desc": "Počet gólů ze střel z první ze slotu, kterým brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "1T.sGSAA/60",
              "type": "1tsgsaa60",
              "colour": "purple",
              "eng": "One-timer Slot Goals Saved Above Average per 60",
              "desc": "Počet gólů ze střel z první ze slotu, kterým brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "slot_assisted_slot_shots": [
        {
          "name": "Střely ze slotu z přihrávek",
          "name_en": "assisted slot shots",
          "type": "goalkeepers_assisted_slot_shots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "SA.sGA",
              "type": "sasga",
              "colour": "purple",
              "eng": "Slot Goals Against from Assisted Slot Shots",
              "desc": "Obdržené góly ze slotu ze střel, kterým předcházela přihrávka",
              "data": "count"
            },
            {
              "name": "SA.sGA/60",
              "type": "sasga60",
              "colour": "purple",
              "eng": "Slot Goals Against from Assisted Slot Shots per 60",
              "desc": "Obdržené góly ze slotu ze střel, kterým předcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "SA.sSOGA",
              "type": "sassoga",
              "colour": "purple",
              "eng": "Assisted Slot Shots On Goal Against",
              "desc": "Střely na branku ze slotu proti týmu, kterým předcházela přihrávka",
              "data": "count"
            },
            {
              "name": "SA.sSOGA/60",
              "type": "sassoga60",
              "colour": "purple",
              "eng": "Assisted Slot Shots On Goal Against per 60",
              "desc": "Střely na branku ze slotu proti týmu, kterým předcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "SA.sSv",
              "type": "sassv",
              "colour": "purple",
              "eng": "Assisted Slot Shots Saved",
              "desc": "Chycené střely ze slotu, kterým předcházela přihrávka",
              "data": "count"
            },
            {
              "name": "SA.sSv/60",
              "type": "sassv60",
              "colour": "purple",
              "eng": "Assisted Slot Shots Saved per 60",
              "desc": "Chycené střely ze slotu, kterým předcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "SA.sSv%",
              "type": "sassv_percent",
              "colour": "purple",
              "eng": "% of Assisted Slot Shots Saved",
              "desc": "Úspěšnost chycených střel ze slotu, kterým předcházela přihrávka",
              "data": "percent"
            },
            {
              "name": "SA.sGSAA",
              "type": "sasgsaa",
              "colour": "purple",
              "eng": "Slot Goals from Assisted Shots Saved Above Average",
              "desc": "Počet gólů ze slotu ze střel, kterým předcházela přihrávka, jimž brankář zabránil v porovnání s průměrem ligy ",
              "data": "count"
            },
            {
              "name": "SA.sGSAA/60",
              "type": "sasgsaa60",
              "colour": "purple",
              "eng": "Slot Goals from Assisted Shots Saved Above Average per 60",
              "desc": "Počet gólů ze slotu ze střel, kterým předcházela přihrávka, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "slot_crossice_assisted_slot_shots": [
        {
          "name": "Střely ze slotu z křižných přihrávek",
          "name_en": "cross-ice assisted slot shots",
          "type": "goalkeepers_crossice_assisted_slot_shots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "cr.SA.sGA",
              "type": "crsasga",
              "colour": "purple",
              "eng": "Slot Goals Against from Cross-ice Assisted Slot Shots",
              "desc": "Obdržené góly ze slotu ze střel, kterým předcházela křižná přihrávka",
              "data": "count"
            },
            {
              "name": "cr.SA.sGA/60",
              "type": "crsasga60",
              "colour": "purple",
              "eng": "Slot Goals Against from Cross-ice Assisted Slot Shots per 60",
              "desc": "Obdržené góly ze slotu ze střel, kterým předcházela křižná přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SA.sSOGA",
              "type": "crsassoga",
              "colour": "purple",
              "eng": "Cross-ice Assisted Slot Shots On Goal Against",
              "desc": "Střely na branku ze slotu proti týmu, kterým předcházela křižná přihrávka",
              "data": "count"
            },
            {
              "name": "cr.SA.sSOGA/60",
              "type": "crsassoga60",
              "colour": "purple",
              "eng": "Cross-ice Assisted Slot Shots On Goal Against per 60",
              "desc": "Střely na branku ze slotu proti týmu, kterým předcházela křižná přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SA.sSv",
              "type": "crsassv",
              "colour": "purple",
              "eng": "Cross-ice Assisted Slot Shots Saved",
              "desc": "Chycené střely ze slotu, kterým předcházela křižná přihrávka",
              "data": "count"
            },
            {
              "name": "cr.SA.sSv/60",
              "type": "crsassv60",
              "colour": "purple",
              "eng": "Cross-ice Assisted Slot Shots Saved per 60",
              "desc": "Chycené střely ze slotu, kterým předcházela křižná přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "cr.SA.sSv%",
              "type": "crsassv_percent",
              "colour": "purple",
              "eng": "% of Cross-ice Assisted Slot Shots Saved",
              "desc": "Úspěšnost chycených střel ze slotu, kterým předcházela křižná přihrávka",
              "data": "percent"
            },
            {
              "name": "cr.SA.sGSAA",
              "type": "crsasgsaa",
              "colour": "purple",
              "eng": "Slot Goals from Cross-ice Assisted Shots Saved Above Average",
              "desc": "Počet gólů ze slotu ze střel, kterým předcházela křižná přihrávka, jimž brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "cr.SA.sGSAA/60",
              "type": "crsasgsaa60",
              "colour": "purple",
              "eng": "Slot Goals from Cross-ice Assisted Shots Saved Above Average per 60",
              "desc": "Počet gólů ze slotu ze střel, kterým předcházela křižná přihrávka, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "slot_behind_the_net_assisted_slot_shots": [
        {
          "name": "Střely ze slotu z přihrávek zpoza branky",
          "name_en": "behind-the-net assisted slot shots",
          "type": "goalkeepers_behind_the_net_assisted_slot_shots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "bn.SA.sGA",
              "type": "bnsasga",
              "colour": "purple",
              "eng": "Slot Goals Against from Behind-the-net Assisted Slot Shots",
              "desc": "Obdržené góly ze slotu ze střel, kterým předcházela přihrávka zpoza branky",
              "data": "count"
            },
            {
              "name": "bn.SA.sGA/60",
              "type": "bnsasga60",
              "colour": "purple",
              "eng": "Slot Goals Against from Behind-the-net Assisted Slot Shots per 60",
              "desc": "Obdržené góly ze slotu ze střel, kterým předcházela přihrávka zpoza branky za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SA.sSOGA",
              "type": "bnsassoga",
              "colour": "purple",
              "eng": "Behind-the-net Assisted Slot Shots On Goal Against",
              "desc": "Střely na branku ze slotu proti týmu, kterým předcházela přihrávka zpoza branky",
              "data": "count"
            },
            {
              "name": "bn.SA.sSOGA/60",
              "type": "bnsassoga60",
              "colour": "purple",
              "eng": "Behind-the-net Assisted Slot Shots On Goal Against per 60",
              "desc": "Střely na branku ze slotu proti týmu, kterým předcházela přihrávka zpoza branky za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SA.sSv",
              "type": "bnsassv",
              "colour": "purple",
              "eng": "Behind-the-net Assisted Slot Shots Saved",
              "desc": "Chycené střely ze slotu, kterým předcházela přihrávka zpoza branky",
              "data": "count"
            },
            {
              "name": "bn.SA.sSv/60",
              "type": "bnsassv60",
              "colour": "purple",
              "eng": "Behind-the-net Assisted Slot Shots Saved per 60",
              "desc": "Chycené střely ze slotu, kterým předcházela přihrávka zpoza branky za 60 minut",
              "data": "60"
            },
            {
              "name": "bn.SA.sSv%",
              "type": "bnsassv_percent",
              "colour": "purple",
              "eng": "% of Behind-the-net Assisted Slot Shots Saved",
              "desc": "Úspěšnost chycených střel ze slotu, kterým předcházela přihrávka zpoza branky",
              "data": "percent"
            },
            {
              "name": "bn.SA.sGSAA",
              "type": "bnsasgsaa",
              "colour": "purple",
              "eng": "Slot Goals from Behind-the-net Assisted Shots Saved Above Average",
              "desc": "Počet gólů ze slotu ze střel, kterým předcházela přihrávka zpoza branky, jimž brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "bn.SA.sGSAA/60",
              "type": "bnsasgsaa60",
              "colour": "purple",
              "eng": "Slot Goals from Behind-the-net Assisted Shots Saved Above Average per 60",
              "desc": "Počet gólů ze slotu ze střel, kterým předcházela přihrávka zpoza branky, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "slot_non_assisted_slot_shots": [
        {
          "name": "Střely ze slotu bez přihrávek",
          "name_en": "non-assisted slot shot",
          "type": "goalkeepers_slot_non_assisted_slot_shots",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "nonSA.sGA",
              "type": "nonsasga",
              "colour": "purple",
              "eng": "Slot Goals Against from Non-Assisted Slot Shots",
              "desc": "Obdržené góly ze slotu ze střel, kterým nepředcházela přihrávka",
              "data": "count"
            },
            {
              "name": "nonSA.sGA/60",
              "type": "nonsasga60",
              "colour": "purple",
              "eng": "Slot Goals Against from Non-Assisted Slot Shots per 60",
              "desc": "Obdržené góly ze slotu ze střel, kterým nepředcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "nonSA.sSOGA",
              "type": "nonsassoga",
              "colour": "purple",
              "eng": "Non-Assisted Slot Shots On Goal Against",
              "desc": "Střely na branku ze slotu proti týmu, kterým nepředcházela přihrávka",
              "data": "count"
            },
            {
              "name": "nonSA.sSOGA/60",
              "type": "nonsassoga60",
              "colour": "purple",
              "eng": "Non-Assisted Slot Shots On Goal Against per 60",
              "desc": "Střely na branku ze slotu proti týmu, kterým nepředcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "nonSA.sSv",
              "type": "nonsassv",
              "colour": "purple",
              "eng": "Non-Assisted Slot Shots Saved",
              "desc": "Chycené střely ze slotu, kterým nepředcházela přihrávka",
              "data": "count"
            },
            {
              "name": "nonSA.sSv/60",
              "type": "nonsassv60",
              "colour": "purple",
              "eng": "Non-Assisted Slot Shots Saved per 60",
              "desc": "Chycené střely ze slotu, kterým nepředcházela přihrávka za 60 minut",
              "data": "60"
            },
            {
              "name": "nonSA.sSv%",
              "type": "nonsassv_percent",
              "colour": "purple",
              "eng": "% of Non-Assisted Slot Shots Saved",
              "desc": "Úspěšnost chycených střel ze slotu, kterým nepředcházela přihrávka",
              "data": "percent"
            },
            {
              "name": "nonSA.sGSAA",
              "type": "nonsasgsaa",
              "colour": "purple",
              "eng": "Slot Goals from Non-Assisted Shots Saved Above Average",
              "desc": "Počet gólů ze slotu ze střel, kterým nepředcházela přihrávka, jimž brankář zabránil v porovnání s průměrem ligy",
              "data": "count"
            },
            {
              "name": "nonSA.sGSAA/60",
              "type": "nonsasgsaa60",
              "colour": "purple",
              "eng": "Slot Goals from Non-Assisted Shots Saved Above Average per 60",
              "desc": "Počet gólů ze slotu ze střel, kterým nepředcházela přihrávka, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "empty____": [
        {
          "name": "",
          "name_en": "",
          "type": "empty",
          "select_type": 1,
          "enabled": false,
          "attributes": []
        }
      ],
      "bottom_right_zone": [
        {
          "name": "Zóna 'vpravo dole'",
          "name_en": "Bottom Right zone",
          "type": "goalkeepers_net_zones1",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "GA.BR",
              "type": "gabr",
              "colour": "white",
              "eng": "Goals Against to Bottom Right of the Net",
              "desc": "Obdržené góly do pravé dolní části branky",
              "data": "count"
            },
            {
              "name": "GA.BR/60",
              "type": "gabr60",
              "colour": "white",
              "eng": "Goals Against to Bottom Right of the Net per 60",
              "desc": "Obdržené góly do pravé dolní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "GA.BR%",
              "type": "gabr_percent",
              "colour": "white",
              "eng": "% of Goals Against to Bottom Right of the Net",
              "desc": "Podíl obdržených gólů do pravé dolní části branky ze všech obdržených gólů",
              "data": "percent"
            },
            {
              "name": "SOGA.BR",
              "type": "sogabr",
              "colour": "white",
              "eng": "Shots on Goals Against to Bottom Right of the Net",
              "desc": "Střely na branku do pravé dolní části branky",
              "data": "count"
            },
            {
              "name": "SOGA.BR/60",
              "type": "sogabr60",
              "colour": "white",
              "eng": "Shots on Goals Against to Bottom Right of the Net per 60",
              "desc": "Střely na branku do pravé dolní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGA.BR%",
              "type": "sogabr_percent",
              "colour": "white",
              "eng": "% of Shots on Goals Against to Bottom Right of the Net",
              "desc": "Podíl střel na branku do pravé dolní části branky ze všech střel na branku",
              "data": "percent"
            },
            {
              "name": "Sv.BR",
              "type": "svbr",
              "colour": "white",
              "eng": "Shots saved in Bottom Right of the Net",
              "desc": "Chycené střely v pravé dolní části branky",
              "data": "count"
            },
            {
              "name": "Sv.BR/60",
              "type": "svbr60",
              "colour": "white",
              "eng": "Shots saved in Bottom Right of the Net per 60",
              "desc": "Chycené střely v pravé dolní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "Sv%.BR",
              "type": "sv_percent_br",
              "colour": "white",
              "eng": "% of Shots saved in the Bottom Right of the Net",
              "desc": "Úspěšnost chycených střel do pravé dolní části branky",
              "data": "percent"
            },
            {
              "name": "GSAA.BR",
              "type": "gsaabr",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Bottom Right of the Net",
              "desc": "Počet gólů do pravé dolní části branky, jimž brankář zabránil v porovnání s průměrem ligy ",
              "data": "count"
            },
            {
              "name": "GSAA.BR/60",
              "type": "gsaabr60",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Bottom Right of the Net per 60",
              "desc": "Počet gólů do pravé dolní části branky, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "upper_right_zone": [
        {
          "name": "Zóna 'vpravo nahoře'",
          "name_en": "Upper Right zone",
          "type": "goalkeepers_net_zones2",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "GA.UR",
              "type": "gaur",
              "colour": "white",
              "eng": "Goals Against to Upper Right of the Net",
              "desc": "Obdržené góly do pravé horní části branky",
              "data": "count"
            },
            {
              "name": "GA.UR/60",
              "type": "gaur60",
              "colour": "white",
              "eng": "Goals Against to Upper Right of the Net per 60",
              "desc": "Obdržené góly do pravé horní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "GA.UR%",
              "type": "gaur_percent",
              "colour": "white",
              "eng": "% of Goals Against to Upper Right of the Net",
              "desc": "Podíl obdržených gólů do pravé horní části branky ze všech obdržených gólů",
              "data": "percent"
            },
            {
              "name": "SOGA.UR",
              "type": "sogaur",
              "colour": "white",
              "eng": "Shots on Goals Against to Upper Right of the Net",
              "desc": "Střely na branku do pravé horní části branky",
              "data": "count"
            },
            {
              "name": "SOGA.UR/60",
              "type": "sogaur60",
              "colour": "white",
              "eng": "Shots on Goals Against to Upper Right of the Net per 60",
              "desc": "Střely na branku do pravé horní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGA.UR%",
              "type": "sogaur_percent",
              "colour": "white",
              "eng": "% of Shots on Goals Against to Upper Right of the Net",
              "desc": "Podíl střel na branku do pravé horní části branky ze všech střel na branku",
              "data": "percent"
            },
            {
              "name": "Sv.UR",
              "type": "svur",
              "colour": "white",
              "eng": "Shots saved in Upper Right of the Net",
              "desc": "Chycené střely v pravé horní části branky",
              "data": "count"
            },
            {
              "name": "Sv.UR/60",
              "type": "svur60",
              "colour": "white",
              "eng": "Shots saved in Bottom Right of the Net per 60",
              "desc": "Chycené střely v pravé dolní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "Sv%.UR",
              "type": "sv_percent_ur",
              "colour": "white",
              "eng": "% of Shots saved in the Upper Right of the Net",
              "desc": "Úspěšnost chycených střel do pravé horní části branky",
              "data": "percent"
            },
            {
              "name": "GSAA.UR",
              "type": "gsaaur",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Upper Right of the Net",
              "desc": "Počet gólů do pravé horní části branky, jimž brankář zabránil v porovnání s průměrem ligy ",
              "data": "count"
            },
            {
              "name": "GSAA.UR/60",
              "type": "gsaaur60",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Upper Right of the Net per 60",
              "desc": "Počet gólů do pravé horní části branky, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "bottom_left_zone": [
        {
          "name": "Zóna 'vlevo dole'",
          "name_en": "Bottom Left zone",
          "type": "goalkeepers_net_zones3",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "GA.BL",
              "type": "gabl",
              "colour": "white",
              "eng": "Goals Against to Bottom Left of the Net",
              "desc": "Obdržené góly do levé dolní části branky",
              "data": "count"
            },
            {
              "name": "GA.BL/60",
              "type": "gabl60",
              "colour": "white",
              "eng": "Goals Against to Bottom Left of the Net per 60",
              "desc": "Obdržené góly do levé dolní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "GA.BL%",
              "type": "gabl_percent",
              "colour": "white",
              "eng": "% of Goals Against to Bottom Left of the Net",
              "desc": "Podíl obdržených gólů do levé dolní části branky ze všech obdržených gólů",
              "data": "percent"
            },
            {
              "name": "SOGA.BL",
              "type": "sogabl",
              "colour": "white",
              "eng": "Shots on Goals Against to Bottom Left of the Net",
              "desc": "Střely na branku do levé dolní části branky",
              "data": "count"
            },
            {
              "name": "SOGA.BL/60",
              "type": "sogabl60",
              "colour": "white",
              "eng": "Shots on Goals Against to Bottom Left of the Net per 60",
              "desc": "Střely na branku do levé dolní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGA.BL%",
              "type": "sogabl_percent",
              "colour": "white",
              "eng": "% of Shots on Goals Against to Bottom Left of the Net",
              "desc": "Podíl střel na branku do levé dolní části branky ze všech střel na branku",
              "data": "percent"
            },
            {
              "name": "Sv.BL",
              "type": "svbl",
              "colour": "white",
              "eng": "Shots saved in Bottom Left of the Net",
              "desc": "Chycené střely v levé dolní části branky",
              "data": "count"
            },
            {
              "name": "Sv.BL/60",
              "type": "svbl60",
              "colour": "white",
              "eng": "Shots saved in Bottom Left of the Net per 60",
              "desc": "Chycené střely v levé dolní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "Sv%.BL",
              "type": "sv_percent_bl",
              "colour": "white",
              "eng": "% of Shots saved in the Bottom Left of the Net",
              "desc": "Úspěšnost chycených střel do levé dolní části branky",
              "data": "percent"
            },
            {
              "name": "GSAA.BL",
              "type": "gsaabl",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Bottom Left of the Net",
              "desc": "Počet gólů do levé dolní části branky, jimž brankář zabránil v porovnání s průměrem ligy ",
              "data": "count"
            },
            {
              "name": "GSAA.BL/60",
              "type": "gsaabl60",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Bottom Left of the Net per 60",
              "desc": "Počet gólů do levé dolní části branky, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "upper_left_zone": [
        {
          "name": "Zóna 'vlevo nahoře'",
          "name_en": "Upper Left zone",
          "type": "goalkeepers_net_zones4",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "GA.UL",
              "type": "gaul",
              "colour": "white",
              "eng": "Goals Against to Upper Left of the Net",
              "desc": "Obdržené góly do levé horní části branky",
              "data": "count"
            },
            {
              "name": "GA.UL/60",
              "type": "gaul60",
              "colour": "white",
              "eng": "Goals Against to Upper Left of the Net per 60",
              "desc": "Obdržené góly do levé horní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "GA.UL%",
              "type": "gaul_percent",
              "colour": "white",
              "eng": "% of Goals Against to Upper Left of the Net",
              "desc": "Podíl obdržených gólů do levé horní části branky ze všech obdržených gólů",
              "data": "percent"
            },
            {
              "name": "SOGA.UL",
              "type": "sogaul",
              "colour": "white",
              "eng": "Shots on Goals Against to Upper Left of the Net",
              "desc": "Střely na branku do levé horní části branky",
              "data": "count"
            },
            {
              "name": "SOGA.UL/60",
              "type": "sogaul60",
              "colour": "white",
              "eng": "Shots on Goals Against to Upper Left of the Net per 60",
              "desc": "Střely na branku do levé horní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGA.UL%",
              "type": "sogaul_percent",
              "colour": "white",
              "eng": "% of Shots on Goals Against to Upper Left of the Net",
              "desc": "Podíl střel na branku do levé horní části branky ze všech střel na branku",
              "data": "percent"
            },
            {
              "name": "Sv.UL",
              "type": "svul",
              "colour": "white",
              "eng": "Shots saved in Upper Left of the Net",
              "desc": "Chycené střely v levé horní části branky",
              "data": "count"
            },
            {
              "name": "Sv.UL/60",
              "type": "svul60",
              "colour": "white",
              "eng": "Shots saved in Bottom Left of the Net per 60",
              "desc": "Chycené střely v levé dolní části branky za 60 minut",
              "data": "60"
            },
            {
              "name": "Sv%.UL",
              "type": "sv_percent_ul",
              "colour": "white",
              "eng": "% of Shots saved in the Upper Left of the Net",
              "desc": "Úspěšnost chycených střel do levé horní části branky",
              "data": "percent"
            },
            {
              "name": "GSAA.UL",
              "type": "gsaaul",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Upper Left of the Net",
              "desc": "Počet gólů do levé horní části branky, jimž brankář zabránil v porovnání s průměrem ligy ",
              "data": "count"
            },
            {
              "name": "GSAA.UL/60",
              "type": "gsaaul60",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Upper Left of the Net per 60",
              "desc": "Počet gólů do levé horní části branky, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "five_hole_zone": [
        {
          "name": "Zóna 'mezi betony'",
          "name_en": "Five Hole zone",
          "type": "goalkeepers_net_zones5",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "GA.FH",
              "type": "gafh",
              "colour": "white",
              "eng": "Goals Against to Five Hole of the Net",
              "desc": "Obdržené góly mezi betony",
              "data": "count"
            },
            {
              "name": "GA.FH/60",
              "type": "gafh60",
              "colour": "white",
              "eng": "Goals Against to Five Hole of the Net per 60",
              "desc": "Obdržené góly mezi betony za 60 minut",
              "data": "60"
            },
            {
              "name": "GA.FH%",
              "type": "gafh_percent",
              "colour": "white",
              "eng": "% of Goals Against to Five Hole of the Net",
              "desc": "Podíl obdržených gólů mezi betony ze všech obdržených gólů",
              "data": "percent"
            },
            {
              "name": "SOGA.FH",
              "type": "sogafh",
              "colour": "white",
              "eng": "Shots on Goals Against to Five Hole of the Net",
              "desc": "Střely na branku mezi betony",
              "data": "count"
            },
            {
              "name": "SOGA.FH/60",
              "type": "sogafh60",
              "colour": "white",
              "eng": "Shots on Goals Against to Five Hole of the Net per 60",
              "desc": "Střely na branku mezi betony za 60 minut",
              "data": "60"
            },
            {
              "name": "SOGA.FH%",
              "type": "sogafh_percent",
              "colour": "white",
              "eng": "% of Shots on Goals Against to Five Hole of the Net",
              "desc": "Podíl střel na branku mezi betony ze všech střel na branku",
              "data": "percent"
            },
            {
              "name": "Sv.FH",
              "type": "svfh",
              "colour": "white",
              "eng": "Shots saved in Five Hole of the Net",
              "desc": "Chycené střely mezi betony",
              "data": "count"
            },
            {
              "name": "Sv.FH/60",
              "type": "svfh60",
              "colour": "white",
              "eng": "Shots saved in Five Hole of the Net per 60",
              "desc": "Chycené střely mezi betony za 60 minut",
              "data": "60"
            },
            {
              "name": "Sv%.FH",
              "type": "sv_percent_fh",
              "colour": "white",
              "eng": "% of Shots saved in the Five Hole of the Net",
              "desc": "Úspěšnost chycených střel mezi betony",
              "data": "percent"
            },
            {
              "name": "GSAA.FH",
              "type": "gsaafh",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Five Hole of the Net",
              "desc": "Počet gólů mezi betony, jimž brankář zabránil v porovnání s průměrem ligy ",
              "data": "count"
            },
            {
              "name": "GSAA.FH/60",
              "type": "gsaafh60",
              "colour": "white",
              "eng": "Goals Saved Above Average in the Five Hole of the Net per 60",
              "desc": "Počet gólů mezi betony, jimž brankář zabránil v porovnání s průměrem ligy za 60 minut",
              "data": "60"
            }
          ]
        }
      ],
      "goalie_chest_zone": [
        {
          "name": "Zóna 'hruď brankáře'",
          "name_en": "Goalie Chest zone",
          "type": "goalkeepers_net_zones6",
          "select_type": 1,
          "enabled": true,
          "attributes": [
            {
              "name": "Sv.CE",
              "type": "svce",
              "colour": "white",
              "eng": "Shots saved at Goalie Chest",
              "desc": "Chycené střely do hrudi brankáře",
              "data": "count"
            },
            {
              "name": "Sv.CE/60",
              "type": "svce60",
              "colour": "white",
              "eng": "Shots saved at Goalie Chest per 60",
              "desc": "Chycené střely do hrudi brankáře za 60 minut",
              "data": "60"
            }
          ]
        }
      ]
    }
  ]
}
