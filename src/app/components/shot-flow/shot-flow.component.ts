import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { cloneDeep } from "lodash"
import * as Konva from 'konva';

@Component({
  selector: 'app-shot-flow',
  templateUrl: './shot-flow.component.html',
  styleUrls: ['./shot-flow.component.scss']
})
export class ShotFlowComponent implements OnInit, OnChanges {
  @Input() data: any = [];
  @Input() team: string = "";
  sdp_data: any = [];
  
  logo_size: number;
  logo_size_half: number;

  graph_width: number;
  graph_height: number;
  screen_width: number;
  screen_height: number;

  loading: boolean = true;
  error: boolean = false;
  max_icetime: number = 0;
  min_icetime: number = 0;

  @Input() stadium: string = "";

  constructor() { }

  ngOnInit() {
   this.render()
  }

  ngOnChanges(){
    this.render()
  }

  render(){
    /*  let id = params['id'];

    let stadium = params['stadium'];
    this.stadium = stadium;

    let team_id = 0
    if (stadium == "home") {
      team_id = loaded_data['teamInfo']['team'][0]['id']
    } else if (stadium == "away") {
      team_id = loaded_data['teamInfo']['opponent'][0]['id']
    } */

    //this.sdp_data = loaded_data;
    this.sdp_data = cloneDeep(this.data[this.team]) ;


    this.logo_size = 40;
    this.logo_size_half = this.logo_size / 2;


    this.graph_width = 500;
    this.graph_height = 500;

    document.getElementById("graph-container").style.width = this.graph_width + 70 + "px";
    document.getElementById("graph-container").style.height = this.graph_height + 70 + "px";

    
    const stage = new Konva.Stage({
      container: 'container',
      width: this.graph_width,
      height: this.graph_height
    });




    /* LOAD DATA */

    // Najdi meze grafu (bounding box)
    //var maxX = Math.max.apply(Math, this.sdp_data.map(function (o) { return o['cf60']; }))
    //var minX = Math.min.apply(Math, this.sdp_data.map(function (o) { return o['cf60']; }))
    //var maxY = Math.max.apply(Math, this.sdp_data.map(function (o) { return o['ca60']; }))
    //var minY = Math.min.apply(Math, this.sdp_data.map(function (o) { return o['ca60']; }))

    var maxX = 40;
    var minX = 0;
    var minY = 0;
    var maxY = 40;

    //console.log("BB: <" + this.screen_width + ", " + this.screen_height + ">")
    //console.log("X: <" + minX + ", " + maxX + ">")
    //console.log("Y: <" + minY + ", " + maxY + ">")

    // Přidej/uber 0.5% na všechny strany ať to není namačkané v grafu
    minX -= 0
    maxX += 0
    minY -= 0
    maxY += 0

    // TODO Vykresli osy

    //console.log("X: <" + minX + ", " + maxX + ">")
    //console.log("Y: <" + minY + ", " + maxY + ">")


    console.log("Data",this.data)
    //najdi nejvetsi icetime
    let ice_times = [];
    console.log("spd data", this.sdp_data)

    this.sdp_data.forEach(element => {
      element["toi"] = element.toi;
      element["name"] = this.getPlayerName(element.uuid)
    });

    this.sdp_data.forEach(element => {
      ice_times.push(element["toi"]);
    });
    this.max_icetime = Math.max.apply(Math, ice_times.map(function (o) { return o; }))
    this.min_icetime = Math.min.apply(Math, ice_times.map(function (o) { return o; }))


    
    var canvas_inner_for_data = document.getElementById("container");

    this.sdp_data.forEach(element => {



      //vypocet velikosti kruhu
      var circle_size = this.Remap(element["toi"], this.min_icetime, this.max_icetime, 10, 30);

      var player_circle = document.createElement("div");
      player_circle.setAttribute("id", "player");
      if (this.stadium == "home") {
        player_circle.className += " player-circle";
      } else {
        player_circle.className += " player-circle";

        player_circle.className += " player-circle-away";

      }



      player_circle.style.left = ( 40 + (this.graph_width / (maxX - minX) * (element['cf'] - minX))).toFixed(1)+ "px";
      player_circle.style.top = (40 + (this.graph_height - (this.graph_height - (this.graph_height / (maxY - minY)) * (element['ca'] - minY)))).toFixed(1) + 45 + "px";
      player_circle.style.width = circle_size + "px";
      player_circle.style.height = circle_size + "px";

      var name = document.createElement("div");
      var name_text = document.createTextNode(element["name"]);
      name.appendChild(name_text);
      name.setAttribute("class", "name");
      name.style.bottom = - circle_size / 2 + 15 + "px";
      name.style.left = circle_size  + "px";
      //name.style.bottom = circle_size + "px";
      //name.style.left = 0 + "px";
      name.style.zIndex = "" + circle_size;
      player_circle.appendChild(name);


      var label = document.getElementById("tooltip");
      var tooltip_title = document.getElementById("tooltip_title");
      var tooltip_toigp = document.getElementById("tooltip_toigp");
      var tooltip_cfpercent = document.getElementById("tooltip_cfpercent");
      var tooltip_cf = document.getElementById("tooltip_cf");
      var tooltip_ca = document.getElementById("tooltip_ca");

      let cas = this.formatTOI(element['toi']);


      player_circle.addEventListener('mousemove', function (e) {
        // update tooltip
        var mousePos = stage.getPointerPosition();


        //přetékání tooltipu JEBAT
        label.style.left = 10 + "px";
        label.style.top = 10 + "px";


        label.style.opacity = "1";
        label.style.visibility = "visible";
        tooltip_title.innerHTML = element['name'];
        tooltip_toigp.innerHTML = cas;
        tooltip_cfpercent.innerHTML = element['cf_percent'].toFixed(1) + "%";
        tooltip_cf.innerHTML = element['cf'];
        tooltip_ca.innerHTML = element['ca'];
      }, true);

      player_circle.addEventListener('mouseout', function (e) {
        label.style.opacity = "0";
        label.style.visibility = "hidden";
      }, true);



      canvas_inner_for_data.appendChild(player_circle);
    });


    this.loading = false;
  }

  getPlayerName(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return "" + uuid;
    } else {
      let surname = JSON.parse(localStorage.getItem(uuid))["surname"];
      let name = JSON.parse(localStorage.getItem(uuid))["name"];

      if (surname == "Klima") {
        let name2 = "";
        //console.log(name);
        if (name == "Kelly Philip") {
          name2 = "Kl.";
        }
        if (name == "Kevin") {
          name2 = "Kv.";
        }

        return surname + " " + name2;
      } else {
        return surname + " " + name[0] + ".";
      }
    }
  }

  formatTOI(seconds) {
    var date = new Date(seconds * 1000);
    var hh: any = date.getUTCHours();
    var mm: any = date.getUTCMinutes();
    var ss: any = date.getSeconds();


    let mh = mm + (60 * hh);

    if (mh < 10) { mh = "0" + mh; }
    if (ss < 10) { ss = "0" + ss; }

    return mh + ":" + ss;
  }

  Remap(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) / (in_max - in_min)) * (out_max - out_min) + out_min;
  }
}
