import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormatSecondsPipe } from '../../pipes/formatSeconds.pipe';

@Component({
  selector: 'player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})


export class PlayerCardComponent implements OnInit, AfterViewInit {

  @Input() header: string = ""
  @Input() toi : boolean = false;
  @Input() data: any = [];
  percentile: number = 0;
  toi_value: number = null;
  loaded = false

  selected_data: any = [];

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    if(this.data != null){
      this.percentile = this.data.percentile;
      this.toi_value = this.data.metrics.toi;
    }

    if(this.header == "utok"){
      this.loadAttack();
    }else if(this.header == "obrana"){
      this.loadDefend();
    }else if(this.header == "tranzice"){
      this.loadTranzitions();
    }else if(this.header == "presilove_hry"){
      this.loadPowePlays();
    }else if(this.header == "oslabeni"){
      this.loadPenaltyKilling();
    }
    this.loaded = true;
  }

  loadAttack(){
    if(this.data != null){
      this.selected_data = {
        "row_1": {
          "name": "goly",
          "att_name": "G/60",
          "att_value": this.data.metrics["g60"],
          "percent": this.data.percentiles["g60"]
        },
        "row_2": {
          "name": "ocekavane_goly",
          "att_name": "xG/60",
          "att_value": this.data.metrics["xg60"],
          "percent": this.data.percentiles["xg60"]
        },
        "row_3": {
          "name": "produktivita",
          "att_name": "P/GF [%]",
          "att_value": this.data.metrics["pgf_pct"],
          "percent": this.data.percentiles["pgf_pct"]
        },
        "row_4": {
          "name": "prihravky_na_strelu",
          "att_name": "SA/CF [%]",
          "att_value": this.data.metrics["sacf_pct"],
          "percent": this.data.percentiles["sacf_pct"]
        },
        "row_5": {
          "name": "ocekavane_goly_z_prihravek",
          "att_name": "xGF_SA/60",
          "att_value": this.data.metrics["xgf_sa60"],
          "percent": this.data.percentiles["xgf_sa60"]
        },
        "row_6": {
          "name": "vliv_na_vstrelene_goly_tymu",
          "att_name": "GF/60 Rel",
          "att_value": this.data.metrics["gf60_rel"],
          "percent": this.data.percentiles["gf60_rel"]
        },
        "row_7": {
          "name": "vliv_na_ocekavane_goly_tymu",
          "att_name": "xGF/60 Rel",
          "att_value": this.data.metrics["xgf60_rel"],
          "percent": this.data.percentiles["xgf60_rel"]
        },
      }
    }else{
      this.selected_data = {
        "row_1": {
          "name": "goly",
          "att_name": "G/60",
          "att_value": 0,
          "percent": 0
        },
        "row_2": {
          "name": "ocekavane_goly",
          "att_name": "xG/60",
          "att_value": 0,
          "percent": 0
        },
        "row_3": {
          "name": "produktivita",
          "att_name": "P/GF [%]",
          "att_value": 0,
          "percent": 0
        },
        "row_4": {
          "name": "prihravky_na_strelu",
          "att_name": "SA/CF [%]",
          "att_value": 0,
          "percent": 0
        },
        "row_5": {
          "name": "ocekavane_goly_z_prihravek",
          "att_name": "xGF_SA/60",
          "att_value": 0,
          "percent": 0
        },
        "row_6": {
          "name": "vliv_na_vstrelene_goly_tymu",
          "att_name": "GF/60 Rel",
          "att_value": 0,
          "percent": 0
        },
        "row_7": {
          "name": "vliv_na_ocekavane_goly_tymu",
          "att_name": "xGF/60 Rel",
          "att_value": 0,
          "percent": 0
        },
      }
    }
    
  }

  loadDefend(){
    if(this.data != null){
      this.selected_data = {
        "row_1": {
          "name": "bloky_strely_soupere",
          "att_name": "BLK/CA [%]",
          "att_value": this.data.metrics["blkca_pct"],
          "percent": this.data.percentiles["blkca_pct"]
        },
        "row_2": {
          "name": "zamezeni_vstupu_do_pasma",
          "att_name": "EnD/60",
          "att_value": this.data.metrics["end60"],
          "percent": this.data.percentiles["end60"]
        },
        "row_3": {
          "name": "uspesnost_zamezeni_vstupu",
          "att_name": "EnD [%]",
          "att_value": this.data.metrics["end_pct"],
          "percent": this.data.percentiles["end_pct"]
        },
        "row_4": {
          "name": "ztraty_puku_v_obrannem_pasmu",
          "att_name": "DZ.pL→CA/60",
          "att_value": this.data.metrics["dz.plca60"],
          "percent": this.data.percentiles["dz.plca60"]
        },
        "row_5": {
          "name": "vliv_na_uspesnost_souboju_po_nahozeni",
          "att_name": "DIBAW [%] Rel",
          "att_value": this.data.metrics["dibaw_pct_rel"],
          "percent": this.data.percentiles["dibaw_pct_rel"]
        },
        "row_6": {
          "name": "vliv_na_obdrzene_goly_tymu",
          "att_name": "GA/60 Rel",
          "att_value": this.data.metrics["ga60_rel"],
          "percent": this.data.percentiles["ga60_rel"]
        },
        "row_7": {
          "name": "vliv_na_ocekavane_goly_soupere",
          "att_name": "xGA/60 Rel",
          "att_value": this.data.metrics["xga60_rel"],
          "percent": this.data.percentiles["xga60_rel"]
        },
      }
    }else{
      this.selected_data = {
        "row_1": {
          "name": "bloky_strely_soupere",
          "att_name": "BLK/CA [%]",
          "att_value": 0,
          "percent": 0
        },
        "row_2": {
          "name": "zamezeni_vstupu_do_pasma",
          "att_name": "EnD/60",
          "att_value": 0,
          "percent": 0
        },
        "row_3": {
          "name": "uspesnost_zamezeni_vstupu",
          "att_name": "EnD [%]",
          "att_value": 0,
          "percent": 0
        },
        "row_4": {
          "name": "ztraty_puku_v_obrannem_pasmu",
          "att_name": "DZ.pL→CA/60",
          "att_value": 0,
          "percent": 0
        },
        "row_5": {
          "name": "vliv_na_uspesnost_souboju_po_nahozeni",
          "att_name": "DIBAW [%] Rel",
          "att_value": 0,
          "percent": 0
        },
        "row_6": {
          "name": "vliv_na_obdrzene_goly_tymu",
          "att_name": "GA/60 Rel",
          "att_value": 0,
          "percent": 0
        },
        "row_7": {
          "name": "vliv_na_ocekavane_goly_soupere",
          "att_name": "xGA/60 Rel",
          "att_value": 0,
          "percent": 0
        },
      }
    }
    
  }

  loadTranzitions(){
    if(this.data != null){
      this.selected_data = {
        "row_1": {
          "name": "kontrolovane_vstupy_do_pasma",
          "att_name": "En/60",
          "att_value": this.data.metrics["en60"],
          "percent": this.data.percentiles["en60"]
        },
        "row_2": {
          "name": "uspesnost_kontrolovanych_vstupu",
          "att_name": "EnW [%]",
          "att_value": this.data.metrics["enw_pct"],
          "percent": this.data.percentiles["enw_pct"]
        },
        "row_3": {
          "name": "preference_kontrolovanych_vstupu",
          "att_name": "EnR%",
          "att_value": this.data.metrics["enr_percent"],
          "percent": this.data.percentiles["enr_percent"]
        },
        "row_4": {
          "name": "nahozeni_se_soubojem",
          "att_name": "DIB/60",
          "att_value": this.data.metrics["dib60"],
          "percent": this.data.percentiles["dib60"]
        },
        "row_5": {
          "name": "kontrolovane_vystupy_z_pasma",
          "att_name": "Ex/60",
          "att_value": this.data.metrics["ex60"],
          "percent": this.data.percentiles["ex60"]
        },
        "row_6": {
          "name": "prechod_z_obranneho_do_utocneho_pasma",
          "att_name": "Ex→En/60",
          "att_value": this.data.metrics["exen60"],
          "percent": this.data.percentiles["exen60"]
        },
        "row_7": {
          "name": "vystupy_z_pasma_prihravkou",
          "att_name": "P.Ex [%]",
          "att_value": this.data.metrics["p.ex_pct"],
          "percent": this.data.percentiles["p.ex_pct"]
        },
      }
    }else{
      this.selected_data = {
        "row_1": {
          "name": "kontrolovane_vstupy_do_pasma",
          "att_name": "En/60",
          "att_value": 0,
          "percent": 0
        },
        "row_2": {
          "name": "uspesnost_kontrolovanych_vstupu",
          "att_name": "EnW [%]",
          "att_value": 0,
          "percent": 0
        },
        "row_3": {
          "name": "preference_kontrolovanych_vstupu",
          "att_name": "EnR%",
          "att_value": 0,
          "percent": 0
        },
        "row_4": {
          "name": "nahozeni_se_soubojem",
          "att_name": "DIB/60",
          "att_value": 0,
          "percent": 0
        },
        "row_5": {
          "name": "kontrolovane_vystupy_z_pasma",
          "att_name": "Ex/60",
          "att_value": 0,
          "percent": 0
        },
        "row_6": {
          "name": "prechod_z_obranneho_do_utocneho_pasma",
          "att_name": "Ex→En/60",
          "att_value": 0,
          "percent": 0
        },
        "row_7": {
          "name": "vystupy_z_pasma_prihravkou",
          "att_name": "P.Ex [%]",
          "att_value": 0,
          "percent": 0
        },
      }
    }
  }

  loadPowePlays(){
    if(this.data != null){
      this.selected_data = {
        "row_1": {
          "name": "goly",
          "att_name": "G/60",
          "att_value": this.data.metrics["g60"],
          "percent": this.data.percentiles["g60"]
        },
        "row_2": {
          "name": "ocekavane_goly",
          "att_name": "xG/60",
          "att_value": this.data.metrics["xg60"],
          "percent": this.data.percentiles["xg60"]
        },
        "row_3": {
          "name": "prihravky_na_strelu",
          "att_name": "SA/CF [%]",
          "att_value": this.data.metrics["sacf_pct"],
          "percent": this.data.percentiles["sacf_pct"]
        },
        "row_4": {
          "name": "ocekavane_goly_z_prihravek",
          "att_name": "xGF_SA/60",
          "att_value": this.data.metrics["xgf_sa60"],
          "percent": this.data.percentiles["xgf_sa60"]
        },
        "row_5": {
          "name": "kontrolovane_vstupy_do_pasma",
          "att_name": "En/60",
          "att_value": this.data.metrics["en60"],
          "percent": this.data.percentiles["en60"]
        },
        "row_6": {
          "name": "vliv_na_vstrelene_goly_tymu",
          "att_name": "GF/60 Rel",
          "att_value": this.data.metrics["gf60_rel"],
          "percent": this.data.percentiles["gf60_rel"]
        },
        "row_7": {
          "name": "vliv_na_ocekavane_goly_tymu",
          "att_name": "xGF/60 Rel",
          "att_value": this.data.metrics["xgf60_rel"],
          "percent": this.data.percentiles["xgf60_rel"]
        },
      }
    }else{
      this.selected_data = {
        "row_1": {
          "name": "goly",
          "att_name": "G/60",
          "att_value": 0,
          "percent": 0
        },
        "row_2": {
          "name": "ocekavane_goly",
          "att_name": "xG/60",
          "att_value": 0,
          "percent": 0
        },
        "row_3": {
          "name": "prihravky_na_strelu",
          "att_name": "SA/CF [%]",
          "att_value": 0,
          "percent": 0
        },
        "row_4": {
          "name": "ocekavane_goly_z_prihravek",
          "att_name": "xGF_SA/60",
          "att_value": 0,
          "percent": 0
        },
        "row_5": {
          "name": "kontrolovane_vstupy_do_pasma",
          "att_name": "En/60",
          "att_value": 0,
          "percent": 0
        },
        "row_6": {
          "name": "vliv_na_vstrelene_goly_tymu",
          "att_name": "GF/60 Rel",
          "att_value": 0,
          "percent": 0
        },
        "row_7": {
          "name": "vliv_na_ocekavane_goly_tymu",
          "att_name": "xGF/60 Rel",
          "att_value": 0,
          "percent": 0
        },
      }
    }
  }

  loadPenaltyKilling(){
    if(this.data != null){
      this.selected_data = {
        "row_1": {
          "name": "bloky_strely_soupere",
          "att_name": "BLK/CA [%]",
          "att_value": this.data.metrics["blkca_pct"],
          "percent": this.data.percentiles["blkca_pct"]
        },
        "row_2": {
          "name": "zamezeni_vstupu_do_pasma",
          "att_name": "EnD/60",
          "att_value": this.data.metrics["end60"],
          "percent": this.data.percentiles["end60"]
        },
        "row_3": {
          "name": "kontrolovane_vstupy_do_pasma",
          "att_name": "En/60",
          "att_value": this.data.metrics["en60"],
          "percent": this.data.percentiles["en60"]
        },
        "row_4": {
          "name": "kontrolovane_vystupy_z_pasma",
          "att_name": "Ex/60",
          "att_value": this.data.metrics["ex60"],
          "percent": this.data.percentiles["ex60"]
        },
        "row_5": {
          "name": "vyhozeni",
          "att_name": "DO/60",
          "att_value": this.data.metrics["do60"],
          "percent": this.data.percentiles["do60"]
        },
        "row_6": {
          "name": "vliv_na_obdrzene_goly_tymu",
          "att_name": "GA/60 Rel",
          "att_value": this.data.metrics["ga60_rel"],
          "percent": this.data.percentiles["ga60_rel"]
        },
        "row_7": {
          "name": "vliv_na_ocekavane_goly_soupere",
          "att_name": "xGA/60 Rel",
          "att_value": this.data.metrics["xga60_rel"],
          "percent": this.data.percentiles["xga60_rel"]
        },
      }
    }else{
      this.selected_data = {
        "row_1": {
          "name": "bloky_strely_soupere",
          "att_name": "BLK/CA [%]",
          "att_value": 0,
          "percent": 0
        },
        "row_2": {
          "name": "zamezeni_vstupu_do_pasma",
          "att_name": "EnD/60",
          "att_value": 0,
          "percent": 0
        },
        "row_3": {
          "name": "kontrolovane_vstupy_do_pasma",
          "att_name": "En/60",
          "att_value": 0,
          "percent": 0
        },
        "row_4": {
          "name": "kontrolovane_vystupy_z_pasma",
          "att_name": "Ex/60",
          "att_value": 0,
          "percent": 0
        },
        "row_5": {
          "name": "vyhozeni",
          "att_name": "DO/60",
          "att_value": 0,
          "percent": 0
        },
        "row_6": {
          "name": "vliv_na_obdrzene_goly_tymu",
          "att_name": "GA/60 Rel",
          "att_value": 0,
          "percent": 0
        },
        "row_7": {
          "name": "vliv_na_ocekavane_goly_soupere",
          "att_name": "xGA/60 Rel",
          "att_value": 0,
          "percent": 0
        },
      }
    }
  }

  checkNull(data: any){
    console.log("check null")
    if(data == null || data == undefined || data == 0){
      return 0
    }else{
      return  data;
    }
  }

  

  getColor(value){
    if(this.toi_value === null){
      return "color0"
    }else if(value <= 12.5){
      return "color1"
    }else if(value >= 12.5 &&  value < 25){
      return "color2"
    }else if(value >= 25 &&  value < 37.5){
      return "color3"
    }else if(value >= 37.5 &&  value < 50){
      return "color4"
    }else if(value >= 50 &&  value < 62.5){
      return "color5"
    }else if(value >= 62.5 &&  value < 75){
      return "color6"
    }else if(value >= 75 &&  value < 87.5){
      return "color7"
    }else if(value >= 87.5){
      return "color8"
    }else if( value == null){
      return ''
    }
  }

}
