<?php
header('Access-Control-Allow-Origin: *');
?>

{
    "report_evenstrength": [{
        "text": "Góly",
        "name": "GF",
        "type": "gf",
        "percent_name": null,
        "percent": null,
        "p_name": "G",
        "p_type": "g"
    }, {
        "text": "Očekávané góly",
        "name": "xGF",
        "type": "xgf",
        "percent_name": "xGF%",
        "percent": "xgf_percent",
        "p_name": "xG",
        "p_type": "xg"
    }, {
        "text": "Střely",
        "name": "CF",
        "type": "cf",
        "percent_name": "CF%",
        "percent": "cf_percent",
        "p_name": "C",
        "p_type": "c"
    }, {
        "text": "Střely s vysokou nebezpečností",
        "name": "HD.CF",
        "type": "hd.cf",
        "percent_name": "HD.CF [%]",
        "percent": "hd.cf_pct",
        "p_name": "HD.C",
        "p_type": "hd.c"
    }, {
        "text": "Střely na branku",
        "name": "SOGF",
        "type": "sogf",
        "percent_name": "SOGF%",
        "percent": "sogf_percent",
        "p_name": "SOG",
        "p_type": "sog"
    }, {
        "text": "Střely z rychlého útoku",
        "name": "R.CF",
        "type": "r.cf",
        "percent_name": "R.CF [%]",
        "percent": "r.cf_pct",
        "p_name": "R.C",
        "p_type": "r.c"
    }, {
        "text": "Střely z přečíslení",
        "name": "O.CF",
        "type": "o.cf",
        "percent_name": "O.CF [%]",
        "percent": "o.cf_pct",
        "p_name": "O.C",
        "p_type": "o.c"
    }, {
        "text": "Střely z forecheckingu",
        "name": "F.CF",
        "type": "f.cf",
        "percent_name": "F.CF [%]",
        "percent": "f.cf_pct",
        "p_name": "F.C",
        "p_type": "f.c"
    }, {
        "text": "Střely z dlouhého útoku",
        "name": "L.CF",
        "type": "l.cf",
        "percent_name": "L.CF [%]",
        "percent": "l.cf_pct",
        "p_name": "L.C",
        "p_type": "l.c"
    }, {
        "text": "Přihrávky na střely",
        "name": "SAF",
        "type": "saf",
        "percent_name": null,
        "percent": null,
        "p_name": "SA",
        "p_type": "sa"
    }, {
        "text": "Křižné přihrávky na střely",
        "name": "cr.SAF",
        "type": "cr.saf",
        "percent_name": "cr.SAF [%]",
        "percent": "cr.saf_pct",
        "p_name": "cr.SA",
        "p_type": "cr.sa"
    }, {
        "text": "Zisky puku vedoucí ke střele",
        "name": "pW→CF",
        "type": "pwcf",
        "percent_name": "pW→CF [%]",
        "percent": "pwcf_pct",
        "p_name": "pW→CF",
        "p_type": "pwcf"
    }, {
        "text": "Zisky puku v út. pásmu vedoucí ke střele",
        "name": "OZ.pW→CF",
        "type": "oz.pwcf",
        "percent_name": "OZ.pW→CF [%]",
        "percent": "oz.pwcf_pct",
        "p_name": "OZ.pW→CF",
        "p_type": "oz.pwcf"
    }, {
        "text": "Vstupy do pásma",
        "name": "EnF",
        "type": "enf",
        "percent_name": null,
        "percent": null,
        "p_name": "En",
        "p_type": "en"
    }, {
        "text": "Vstupy do pásma přihrávkou",
        "name": "P.EnF",
        "type": "p.enf",
        "percent_name": "P.EnF [%]",
        "percent": "p.enf_pct",
        "p_name": "P.En",
        "p_type": "p.en"
    }, {
        "text": "Vstupy do pásma zavezením",
        "name": "C.EnF",
        "type": "c.enf",
        "percent_name": "C.EnF [%]",
        "percent": "c.enf_pct",
        "p_name": "C.En",
        "p_type": "c.en"
    }, {
        "text": "Vstupy do pásma vedoucí ke střele",
        "name": "EnF→CF",
        "type": "enfcf",
        "percent_name": "EnF→CF [%]",
        "percent": "enfcf_pct",
        "p_name": "En→CF",
        "p_type": "encf"
    }, {
        "text": "Zamezení vstupů soupeře do pásma",
        "name": "EnDF",
        "type": "endf",
        "percent_name": "EnDF [%]",
        "percent": "endf_pct",
        "p_name": "EnD",
        "p_type": "end"
    }, {
        "text": "Nahození puku do pásma",
        "name": "DIF",
        "type": "dif",
        "percent_name": null,
        "percent": null,
        "p_name": "DI",
        "p_type": "di"
    }, {
        "text": "Vyhrané souboje po nahození",
        "name": "DIBFW",
        "type": "dibfw",
        "percent_name": "DIBFW [%]",
        "percent": "dibfw_pct",
        "p_name": "DIBW",
        "p_type": "dibw"
    }, {
        "text": "Výstupy z pásma",
        "name": "ExF",
        "type": "exf",
        "percent_name": null,
        "percent": null,
        "p_name": "Ex",
        "p_type": "ex"
    }, {
        "text": "Výstupy vedoucí ke vstupu do pásma",
        "name": "ExF→EnF",
        "type": "exfenf",
        "percent_name": "ExF→EnF [%]",
        "percent": "exfenf_pct",
        "p_name": "Ex→En",
        "p_type": "exen"
    }, {
        "text": "Vyhození z pásma",
        "name": "DOF",
        "type": "dof",
        "percent_name": null,
        "percent": null,
        "p_name": "DO",
        "p_type": "do"
    }, {
        "text": "Vyhraná vhazování",
        "name": "FOW",
        "type": "fow",
        "percent_name": "FOW%",
        "percent": "fow_percent",
        "p_name": "FOW",
        "p_type": "fow"
    }, {
        "text": "Menší dvouminutové tresty",
        "name": "Pen2",
        "type": "pen2",
        "percent_name": null,
        "percent": null,
        "p_name": "Pen2",
        "p_type": "pen2"
    }, {
        "text": "Čas odehraný v útočném pásmu",
        "name": "OZ.TOI",
        "type": "oz.toi",
        "percent_name": "OZ.TOI [%]",
        "percent": "oz.toi_pct",
        "p_name": "OZ.TOI",
        "p_type": "oz.toi"
    }, {
        "text": "Čas držení puku v útočném pásmu",
        "name": "OZ.pTOI",
        "type": "oz.ptoi",
        "percent_name": "OZ.pTOI [%]",
        "percent": "oz.ptoi_pct",
        "p_name": "OZ.pTOI",
        "p_type": "oz.ptoi"
    }],
    "report_powerplay": [{
        "text": "Čas na ledě",
        "name": "TOI",
        "type": "toi",
        "percent_name": null,
        "percent": null,
        "p_name": "TOI",
        "p_type": "toi"
    }, {
        "text": "Góly",
        "name": "GF",
        "type": "gf",
        "percent_name": null,
        "percent": null,
        "p_name": "G",
        "p_type": "g"
    }, {
        "text": "Očekávané góly",
        "name": "xGF",
        "type": "xgf",
        "percent_name": null,
        "percent": null,
        "p_name": "xG",
        "p_type": "xg"
    }, {
        "text": "Střely",
        "name": "CF",
        "type": "cf",
        "percent_name": null,
        "percent": null,
        "p_name": "C",
        "p_type": "c"
    }, {
        "text": "Střely s vysokou nebezpečností",
        "name": "HD.CF",
        "type": "hd.cf",
        "percent_name": "HD.CF [%]",
        "percent": "hd.cf_pct",
        "p_name": "HD.C",
        "p_type": "hd.c"
    }, {
        "text": "Vstupy do pásma",
        "name": "EnF",
        "type": "enf",
        "percent_name": null,
        "percent": null,
        "p_name": "En",
        "p_type": "en"
    }, {
        "text": "Vstupy do pásma přihrávkou",
        "name": "P.EnF",
        "type": "p.enf",
        "percent_name": "P.EnF [%]",
        "percent": "p.enf_pct",
        "p_name": "P.En",
        "p_type": "p.en"
    }, {
        "text": "Vstupy do pásma zavezením",
        "name": "C.EnF",
        "type": "c.enf",
        "percent_name": "C.EnF [%]",
        "percent": "c.enf_pct",
        "p_name": "C.En",
        "p_type": "c.en"
    }, {
        "text": "Vyhraná vhazování",
        "name": "FOW",
        "type": "fow",
        "percent_name": "FOW%",
        "percent": "fow_percent",
        "p_name": "FOW",
        "p_type": "fow"
    }, {
        "text": "Čas odehraný v útočném pásmu",
        "name": "OZ.TOI",
        "type": "oz.toi",
        "percent_name": "OZ.TOI [%]",
        "percent": "oz.toi_pct",
        "p_name": "OZ.TOI",
        "p_type": "oz.toi"
    }, {
        "text": "Čas držení puku v útočném pásmu",
        "name": "OZ.pTOI",
        "type": "oz.ptoi",
        "percent_name": "OZ.pTOI [%]",
        "percent": "oz.ptoi_pct",
        "p_name": "OZ.pTOI",
        "p_type": "oz.ptoi"
    }]
}