import { Component, OnInit, ElementRef, ViewChild, NgZone, isDevMode } from '@angular/core';

import { Location } from '@angular/common';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { DatepickerOptions } from 'ng2-datepicker';
import * as csLocale from 'date-fns/locale/cs';

//import * as _ from "lodash";
import { WOWYService } from '../../services/wowy/wowy.service';
import { DefaultService } from '../../services/default/default.service';
import { isThisISOWeek } from 'date-fns';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
declare var require: any
var accents = require('remove-accents');
import { TranslatePipe } from '../../pipes/translate.pipe';

var csv_options = {
  quoteStrings: '"',
  fieldSeparator: ';',
  decimalseparator: '.',
  type: "text/csv;charset=ISO-8859-1;"
};

@Component({
  selector: 'app-wowy',
  templateUrl: './wowy.component.html',
  styleUrls: ['./wowy.component.scss'],
  providers: [WOWYService, DefaultService, TranslatePipe]
})
export class WOWYComponent implements OnInit {
  @ViewChild('graphscroll') private graphScrollContainer: ElementRef;
  //@ViewChild('filter_name_input') private filter_name_input: ElementRef;

  data: any;
  data_graph: any;

  tab: string;
  more_filters: boolean;

  players_list: any = [];
  date_from: any;
  date_to: any;


  full_players_list: any = [];

  dataLoaded: boolean;
  loading: boolean;
  data_loading: boolean = false;
  no_data: boolean = false;

  team_averages: any = [];
  competition_averages: any = [];

  tab_small: string;

  graph_scroll: number = 0;

  canscrollprev: boolean = false;
  canscrollnext: boolean = true;


  teams_list: any[];
  seasons_list: any[];

  competitions_list: any = [];
  selected_player: any;

  tois: any = [];
  min_toi: number;
  max_toi: number;

  //filters
  filter_season: any = [];
  filter_seasonPart: string = "";
  filter_team: string = "";
  filter_player: string = "";


  filter_countOfPlayer: string = "5:5";
  filter_minTOI: number;
  filter_lastGames: number;
  filter_dateFrom: string;
  filter_dateTo: string;
  filter_homeAway: string = "";
  filter_matchState: string = "";
  filter_minutes_from: number;
  filter_minutes_to: number;
  filter_opponent: string = "";
  filter_opponents: any = [];

  filter_hraci_spolu: boolean = true;
  filter_hraci_zvlast: boolean = true;
  filter_spoluhraci_zvlast: boolean = false;
  filter_posts: string = "ALL";
  filter_s_bez: boolean = false;

  filter_situationType: string = "";
  filter_situationTime: number;

  filterby: string = "toi";
  //filters end




  table_settings: any[] = [
    { "type": "cf60", "name": "CF/60", "colour": "green" },
    { "type": "ca60", "name": "CA/60", "colour": "red" },
    { "type": "cf_percent", "name": "CF%", "colour": "green" },
    { "type": "cf_percent_rel", "name": "CF% Rel", "colour": "green" },
    { "type": "scf60", "name": "sCF/60", "colour": "green" },
    { "type": "sca60", "name": "sCA/60", "colour": "red" },
    { "type": "scf_percent", "name": "sCF%", "colour": "green" },
    { "type": "scf_percent_rel", "name": "sCF% Rel", "colour": "green" },
    { "type": "onsh_percent", "name": "ON.Sh%", "colour": "green" },
    { "type": "onsv_percent", "name": "ON.Sv%", "colour": "red" }
  ];

  toggle_table_settings: boolean = false;




  graph_settings: any[] = [
    { "type": "cf60", "name": "CF/60", "enabled": true },
    { "type": "ca60", "name": "CA/60", "enabled": true },
    { "type": "cf_percent", "name": "CF%", "enabled": true },
    { "type": "scf60", "name": "SCF/60", "enabled": false },
    { "type": "sca60", "name": "SCA/60", "enabled": false },
    { "type": "scf_percent", "name": "SCF%", "enabled": false },
    //{ "type": "gf60", "name": "GF/60", "enabled": false },
    //{ "type": "ga60", "name": "GA/60", "enabled": false },
    { "type": "gf_percent", "name": "GF%", "enabled": false },
    { "type": "zsr_percent", "name": "ZSR%", "enabled": false },
  ];
  toggle_graph_settings: boolean = false;
  selected_graph: string = "cf60";
  selected_graph_name: string = "cf60";


  seasons_select_list = [];
  selectedItems = [];
  dropdownSettings = {};

  list_order: number = 0;

  boolProd: boolean = true;

  constructor(private translate: TranslatePipe, private wowyService: WOWYService, private defaultService: DefaultService, private zone: NgZone, private location: Location, private activatedRoute: ActivatedRoute) {

    this.tab = "";
    this.more_filters = false;

    this.selectedItems = [
    ];
    this.dropdownSettings = {
      singleSelection: false,
      text: "Vybrat sezonu",
      selectAllText: 'Vybrat vše',
      unSelectAllText: 'Odebrat vše',
      enableSearchFilter: false,
      classes: "multiselect"
    };


    this.dataLoaded = false;
    this.loading = false;


    this.tab_small = "kruhovy";

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }

  }


  ngOnInit() {
    this.getCompetitions();

    this.trackOpenPage();
  }

  showTab(tab: string) {
    this.tab = tab;
    if (this.tab == "vizualizace") {
      this.filter_s_bez = false;
    }
  }

  showMoreFilters() {
    if (this.more_filters == true) {
      this.more_filters = false;
    } else {
      this.more_filters = true;
    }
  }



  addOpponent(opponent_id: string) {
    if (this.filter_opponents.includes(opponent_id)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent == opponent_id) {
          delete this.filter_opponents[index];
        }
      });
    } else {
      this.filter_opponents.push(opponent_id);
    }
    this.filter_opponents.slice();
  }

  checkSelectedOpponent(opponent_id: string) {
    return this.filter_opponents.includes(opponent_id);
  }

  setOpponentsAll() {
    this.filter_opponents = [];
    this.filter_opponents.slice();
  }

  vybratTeamCheck() {
    if (this.filter_opponents.includes(this.filter_team)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent == this.filter_team) {
          delete this.filter_opponents[index];
        }
      });
    }
  }

  checkNonselectedOpponent() {
    this.filter_opponents = this.removeShitNulls(this.filter_opponents);
    if (this.filter_opponents.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  removeShitNulls(array) {
    return array.filter(function (e) {
      return e;
    });
  }




  loadData() {
    this.checkLoggedTime();

    this.setDefaultOrderRow();
    this.filter_s_bez = false;


    if (this.tab == "") {
      this.tab = "data";
    }

    this.loading = true;
    this.data_loading = true;

    // TODO PRIDAT NOVOU API BEZ NUTNOSTI VYBRAT FILTER_PLAYER
    this.wowyService.getWowy(this.filter_seasonPart, this.filter_player, this.filter_team, this.filter_lastGames, this.filter_countOfPlayer, this.filter_matchState, this.filter_homeAway, this.filter_opponents, this.filter_dateFrom, this.filter_dateTo, this.filter_minutes_from, this.filter_minutes_to, this.filter_minTOI, this.filter_situationType, this.filter_situationTime, this.table_settings).subscribe(loaded_data => {
      //get token data

      //console.log(JSON.stringify(loaded_data));


      this.no_data = false;
      if (loaded_data["wowy"]["selected_player"].length == 0 || loaded_data["wowy"]["stats"].length == 0) {
        this.no_data = true;
      }

      this.selected_player = "";
      this.selected_player = loaded_data["wowy"]["selected_player"];

      this.data = loaded_data["wowy"]["stats"];


      this.data_graph = this.data;


      this.data.forEach((item, index) => {


        this.data[index]["toi"] = item["stats"][0]['toi'];
        this.data[index]["gp"] = item["stats"][0]['gp'];

        this.table_settings.forEach((item2, index2) => {
          this.data[index][item2['type']] = item["stats"][0][item2['type']];
        });

      });


      //console.log(JSON.stringify(this.data));



      this.tois = [];
      this.data.forEach((item, index) => {
        this.tois.push(item["stats"][0]["toi"]);
        this.tois.push(item["stats"][1]["toi"]);
        this.tois.push(item["stats"][2]["toi"]);
      });

      this.max_toi = Math.max.apply(Math, this.tois);
      this.min_toi = Math.min.apply(Math, this.tois);


      //alert(this.max_toi + " " + this.min_toi);

      this.loading = false;
      this.dataLoaded = true;


    }, err => {
      //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
      //this.defaultService.logout();
      window.location.reload();
    });

  }



  hraci_spolu_toggle() {
    if (this.filter_hraci_spolu == true) {
      this.filter_hraci_spolu = false;
    } else {
      this.filter_hraci_spolu = true;
    }
  }


  hraci_zvlast_toggle() {
    if (this.filter_hraci_zvlast == true) {
      this.filter_hraci_zvlast = false;
    } else {
      this.filter_hraci_zvlast = true;
    }
  }

  spoluhraci_zvlast_toggle() {
    if (this.filter_spoluhraci_zvlast == true) {
      this.filter_spoluhraci_zvlast = false;
    } else {
      this.filter_spoluhraci_zvlast = true;
    }
  }


  smallTab_toggle(type: string) {
    this.tab_small = type;
  }



  scroll_next() {
    this.graph_scroll = this.graph_scroll + 154;
    this.graphScrollContainer.nativeElement.scrollLeft = this.graph_scroll;

    if (this.graph_scroll > 0) {
      this.canscrollprev = true;
    }
  }

  scroll_prev() {
    this.graph_scroll = this.graph_scroll - 154;
    this.graphScrollContainer.nativeElement.scrollLeft = this.graph_scroll;

    if (this.graph_scroll == 0) {
      this.canscrollprev = false;
    }
  }


  dateFromChange(date: string) {
    var date_string = new Date(date);
    var dayIndex = date_string.getDate();
    var monthIndex = date_string.getMonth() + 1;
    var year = date_string.getFullYear()
    var month = "";
    var day = "";
    if (monthIndex < 10) {
      month = "0" + monthIndex;
    } else {
      month = monthIndex.toString();
    }
    if (dayIndex < 10) {
      day = "0" + dayIndex;
    } else {
      day = dayIndex.toString();
    }

    this.filter_dateFrom = year + "-" + month + "-" + day;
  }

  dateToChange(date: string) {
    var date_string = new Date(date);
    var dayIndex = date_string.getDate();
    var monthIndex = date_string.getMonth() + 1;
    var year = date_string.getFullYear()
    var month = "";
    var day = "";
    if (monthIndex < 10) {
      month = "0" + monthIndex;
    } else {
      month = monthIndex.toString();
    }
    if (dayIndex < 10) {
      day = "0" + dayIndex;
    } else {
      day = dayIndex.toString();
    }
    this.filter_dateTo = year + "-" + month + "-" + day;
  }


  //filters -start
  getCompetitions() {
    this.seasons_list = JSON.parse(localStorage.getItem("seasons_list"));
    this.seasons_list.forEach((item, index) => {
      let next_season = parseInt(item['name']) + 1;
      this.seasons_select_list.push({ "id": item['name'], "itemName": item['name'] + " - " + next_season });
    });
    //this.seasons_select_list.reverse();

    this.filter_season.push(this.seasons_select_list[0]);
    this.getSeasonParts();
  }

  getSeasonParts() {
    this.filter_seasonPart = "";
    this.filter_team = "";
    this.filter_player = "";
    this.teams_list = [];
    this.players_list = [];
    //this.filter_name_input.nativeElement.value = "";

    let playoff = [];
    let base = [];
    let playout = [];
    let relegation = [];
    let preliminary = [];

    this.competitions_list = [];

    this.competitions_list = [
      { id: 0, name: this.translate.transform("zakladni_cast"), part: "base", uuids: "" },
      { id: 1, name: "Play-off", part: "playoff", uuids: "" },
      { id: 2, name: "Play-out", part: "playout", uuids: "" },
      { id: 3, name: this.translate.transform("baraz"), part: "relegation", uuids: "" },
      { id: 4, name: this.translate.transform("preliminary"), part: "preliminary", uuids: "" }
    ];


    if (this.filter_season != undefined) {

      this.filter_season.forEach((item, index) => {
        this.seasons_list.forEach((item2, index) => {
          if (item["id"] == item2["name"]) {
            item2["competitions"].forEach((item3, index) => {
              item3["season"] = item2["name"];

              if (item3["part"] == "base") {
                base.push(item3["uuid"]);
              } else if (item3["part"] == "playoff") {
                playoff.push(item3["uuid"]);
              } else if (item3["part"] == "playout") {
                playout.push(item3["uuid"]);
              } else if (item3["part"] == "relegation") {
                relegation.push(item3["uuid"]);
              } else if (item3["part"] == "preliminary") {
                preliminary.push(item3["uuid"]);
              }
            });
          }
        });
      });

      this.competitions_list = [
        { id: 0, name: this.translate.transform("zakladni_cast"), part: "base", uuids: this.itemsToStringApi(base) },
        { id: 1, name: "Play-off", part: "playoff", uuids: this.itemsToStringApi(playoff) },
        { id: 2, name: "Play-out", part: "playout", uuids: this.itemsToStringApi(playout) },
        { id: 3, name: this.translate.transform("baraz"), part: "relegation", uuids: this.itemsToStringApi(relegation) },
        { id: 4, name: this.translate.transform("preliminary"), part: "preliminary", uuids: this.itemsToStringApi(preliminary) },
      ];

    }

    this.filter_seasonPart = this.competitions_list[0]["uuids"];
    this.getTeamsData();
  }



  getTeamsData() {
    this.filter_team = "";
    this.teams_list = [];
    this.players_list = [];
    this.filter_player = "";
    //this.filter_name_input.nativeElement.value = "";

    let uuids = this.filter_seasonPart.split(",");
    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(localStorage.getItem("competition_details"));

      competition_details.forEach((item2, index) => {


        if (typeof item2[item] != 'undefined') {
          item2[item]["teams"].forEach((team, index) => {

            //load full players seznam
            team["players"].forEach((player, index) => {
              let key = {
                "uuid": player["uuid"],
                "name": player["name"],
                "surname": player["surname"],
                "position": player["position"],
                "team": team["uuid"],
                "jersey": player["jersey"],
                "stick": player["stick"],
                "hokejczId": player["hokejczId"]
              }
              localStorage.setItem(player["uuid"], JSON.stringify(key));
            });


            //load team player list
            var index: any = this.teams_list.findIndex(x => x.uuid == team["uuid"])
            if (index === -1) {
              this.teams_list.push({
                "uuid": team["uuid"],
                "name": team["name"],
                "shortName": team["shortName"],
                "shortcut": team["shortcut"],
                "team": team["uuid"],
                "players": ""
              });
            } else console.log("object already exists")


          });
        }


      });

    });



  }


  getPlayerList() {
    this.players_list = [];
    this.filter_player = "";
    //this.filter_name_input.nativeElement.value = "";

    let uuids = this.filter_seasonPart.split(",");

    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(localStorage.getItem("competition_details"));

      competition_details.forEach((loaded_data, index) => {

        if (typeof loaded_data[item] != 'undefined') {

          loaded_data[item]["teams"].forEach((team, index) => {

            if (team["uuid"] == this.filter_team) {


              team["players"].forEach((player, index) => {

                var index: any = this.players_list.findIndex(x => x.uuid == player["uuid"])
                if (index === -1) {
                  player["short_name"] = player["surname"] + " " + player["name"][0] + ".";
                  this.players_list.push(player);
                } else console.log("object already exists")


              });


            }

          });


        }
      });
    });

    this.players_list.sort(this.sortBy('surname', false));



    if (this.filter_team == this.filter_opponent) {
      this.filter_opponent = "";
    }
  }

  sortBy(key, reverse) {
    var moveSmaller = reverse ? 1 : -1;
    var moveLarger = reverse ? -1 : 1;

    /**
     * @param  {*} a
     * @param  {*} b
     * @return {Number}
     */
    return function (a, b) {
      if (a[key] < b[key]) {
        return moveSmaller;
      }
      if (a[key] > b[key]) {
        return moveLarger;
      }
      return 0;
    };
  }

  playerChanged(newVal) {
    this.filter_player = newVal["uuid"];
  }

  playerChangedDetectDeleted(value) {
    //alert(value);
    if (value == undefined || value == "") {
      this.filter_player = "";
    }
  }

  playerListFormatter = (data: any) => {
    let pos_name = "";
    if (data.position == "DE") {
      pos_name = "O";
    } else if (data.position == "FO") {
      pos_name = "Ú";
    }
    let html = "<span class='players-list-post players-list-post-" + data.position + "'>" + pos_name + "</span>" + data.surname + " " + data.name[0] + ".";
    return html;
  }

  changedOrder(event) {
    this.filterby = event;
  }
  //filters end




  recount() {

    var old = this.data_graph;

    if (this.filter_s_bez) {

      this.data.forEach((item, index) => {
        this.table_settings.forEach((item) => {
          this.data[index]['stats'][1][item['type']] = (this.data[index]['stats'][1][item['type']] + this.data[index]['stats'][0][item['type']]);

          this.data[index]['stats'][2][item['type']] = (this.data[index]['stats'][2][item['type']] + this.data[index]['stats'][0][item['type']]);



          if (Number.isNaN(this.data[index]['stats'][1][item['type']])) {
            this.data[index]['stats'][1][item['type']] = 0;
          }
          if (Number.isNaN(this.data[index]['stats'][1][item['type']])) {
            this.data[index]['stats'][2][item['type']] = 0;
          }
        });
      });


      this.filter_s_bez = false;

    } else {
      this.filter_s_bez = true;


      this.data.forEach((item, index) => {
        this.table_settings.forEach((item) => {
          this.data[index]['stats'][1][item['type']] = (this.data[index]['stats'][1][item['type']] - this.data[index]['stats'][0][item['type']]);
          this.data[index]['stats'][2][item['type']] = (this.data[index]['stats'][2][item['type']] - this.data[index]['stats'][0][item['type']]);
          if (Number.isNaN(this.data[index]['stats'][1][item['type']])) {
            this.data[index]['stats'][1][item['type']] = 0;
          }
          if (Number.isNaN(this.data[index]['stats'][1][item['type']])) {
            this.data[index]['stats'][2][item['type']] = 0;
          }
        });

      });


    }

  }



  toggleTableAttributes(select: string) {
    this.table_settings.forEach((item, index) => {
      if (item['type'] == select) {

        if (item['enabled'] == false) {
          this.table_settings[index]['enabled'] = true;
        } else {
          this.table_settings[index]['enabled'] = false;
        }

      }
    });
  }

  getTableToggleAttributes(attribute: string) {

    let style = "";

    this.table_settings.forEach((item, index) => {
      if (item['type'] == attribute) {

        if (item['enabled'] == false) {
          style = "hidden";
        } else {
          style = "";
        }

      }
    });

    return style;

  }


  toggleGraphAttributes(select: string) {
    let enabled = 0;

    this.graph_settings.forEach((item, index) => {
      if (item['enabled'] == true) {
        enabled = enabled + 1;
      }
    });



    this.graph_settings.forEach((item, index) => {
      if (item['type'] == select) {

        if (item['enabled'] == false) {
          this.graph_settings[index]['enabled'] = true;
        } else {
          this.graph_settings[index]['enabled'] = false;
        }

      }
    });



  }




  toggleTableSettings() {
    if (this.toggle_table_settings == true) {
      this.toggle_table_settings = false;
    } else {
      this.toggle_table_settings = true;
    }
  }

  getGraphSettings() {
    return this.graph_settings.filter((setting) => setting.enabled === true);
  }


  toggleGraphSettings() {
    if (this.toggle_graph_settings == true) {
      this.toggle_graph_settings = false;
    } else {
      this.toggle_graph_settings = true;
    }
  }


  graphSelectRow(type: string, name: string) {
    this.selected_graph = type;
    this.selected_graph_name = name;
  }

  getPlayerPost(uuid: string) {
    if (uuid != undefined) {
      if (localStorage.getItem(uuid) != null) {
        return JSON.parse(localStorage.getItem(uuid))["position"];
      } else {
        return "no-post";
      }
    } else {
      return "no-post";
    }
  }

  getPlayerName(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return "" + uuid;
    } else {
      let surname = JSON.parse(localStorage.getItem(uuid))["surname"];
      let name = JSON.parse(localStorage.getItem(uuid))["name"];

      if (surname == "Klima") {
        let name2 = "";
        console.log(name);
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
  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.itemName;
      }).join(', ');
  }

  public itemsToStringApi(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item;
      }).join(',');
  }


  uniqEs6 = (arrArg) => {
    return arrArg.filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos;
    });
  }


  drawGraphCircle(value: number, type: string, toi: number) {
    let styles = {};

    let maximal_size = 150;
    let minimal_size = 50;

    let size = Math.round(this.scaleBetween(toi, minimal_size, maximal_size, this.min_toi, this.max_toi));

    if (size > 70) {
      //size = maximal_size;
    }

    styles['bottom'] = "calc(" + value + "% - " + size / 2 + "px)";
    styles['width'] = size + "px";
    styles['height'] = size + "px";
    styles['right'] = "-" + size / 2 + "px";

    return styles;
  }

  scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
  }


  formationAnalysisLink(filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string) {

    //SEASON
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") { filter_homeAway = undefined; }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") { filter_matchState = undefined; }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) { filter_opponents = undefined; }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") { filter_situationType = undefined; }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    let attributes_list = [];
    this.table_settings.forEach(item => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();


    return "formations-analysis/" + filter_season + "/" + filter_seasonPart + "/" + filter_team + "/" + filter_countOfPlayer + "/" + filter_minTOI + "/" + filter_lastGames + "/" + filter_dateFrom + "/" + filter_dateTo + "/" + filter_homeAway + "/" + filter_matchState + "/" + filter_minutes_from + "/" + filter_minutes_to + "/" + filter_opponents + "/" + filter_playerId_select1 + "/" + filter_playerId_select2 + "/" + filter_playerId_select3 + "/" + filter_playerId_select4 + "/" + filter_playerId_select5 + "/" + filter_playerId_select6 + "/" + filter_situationType + "/" + filter_situationTime + "/" + attributes_list_string;
  }

  trendLink(filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string) {

    //SEASON
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") { filter_homeAway = undefined; }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") { filter_matchState = undefined; }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) { filter_opponents = undefined; }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") { filter_situationType = undefined; }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    let attributes_list = [];
    this.table_settings.forEach(item => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();


    return "trend/formation/" + filter_season + "/" + filter_seasonPart + "/" + filter_team + "/" + filter_countOfPlayer + "/" + filter_minTOI + "/" + filter_lastGames + "/" + filter_dateFrom + "/" + filter_dateTo + "/" + filter_homeAway + "/" + filter_matchState + "/" + filter_minutes_from + "/" + filter_minutes_to + "/" + filter_opponents + "/" + filter_playerId_select1 + "/" + filter_playerId_select2 + "/" + filter_playerId_select3 + "/" + filter_playerId_select4 + "/" + filter_playerId_select5 + "/" + filter_playerId_select6 + "/" + filter_situationType + "/" + filter_situationTime + "/" + attributes_list_string;
  }


  gamelogLink(filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string) {

    //SEASON
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") { filter_homeAway = undefined; }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") { filter_matchState = undefined; }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) { filter_opponents = undefined; }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") { filter_situationType = undefined; }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    let attributes_list = [];
    this.table_settings.forEach(item => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    return "gamelog/" + filter_season + "/" + filter_seasonPart + "/" + filter_team + "/" + filter_countOfPlayer + "/" + filter_minTOI + "/" + filter_lastGames + "/" + filter_dateFrom + "/" + filter_dateTo + "/" + filter_homeAway + "/" + filter_matchState + "/" + filter_minutes_from + "/" + filter_minutes_to + "/" + filter_opponents + "/" + filter_playerId_select1 + "/" + filter_playerId_select2 + "/" + filter_playerId_select3 + "/" + filter_playerId_select4 + "/" + filter_playerId_select5 + "/" + filter_playerId_select6 + "/" + filter_situationType + "/" + filter_situationTime + "/" + attributes_list_string;
  }

  bullshit() {
    alert(JSON.stringify(this.filter_season));
  }



  onChangedAttributes(new_attributes: any) {

    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings = clean_attributes;
    this.loadData();
  }


  formatValue(value: any) {
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }
  }




  getAttributeColour(type: string) {

    let colour = "no-colour";
    let attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

    if (type != null || type != undefined) {
      if (type.startsWith("r_")) {
        type = type.substring(2);
      } else if (type.startsWith("o_")) {
        type = type.substring(2);
      } else if (type.startsWith("f_")) {
        type = type.substring(2);
      } else if (type.startsWith("up_")) {
        type = type.substring(3);
      } else if (type.startsWith("np_")) {
        type = type.substring(3);
      }
    }

    if (type != null || type != undefined) {

      for (let item in attributes["individual"][0]) {
        //console.log(JSON.stringify());
        attributes["individual"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            colour = item["colour"];
          }
        });
      }

      for (let item in attributes["onIce"][0]) {
        //console.log(JSON.stringify());
        attributes["onIce"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            colour = item["colour"];
          }
        });
      }

      /*
      for (let item in attributes["teamsData"][0]) {
        //console.log(JSON.stringify());
        attributes["teamsData"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            colour = item["colour"];
          }
        });
      }
      */

    }
    return colour;

  }

  getAttributeText(type: string, show_what: number) {

    let title = "";
    let desc = "";

    if (type != null) {
      if (type.startsWith("r_")) {
        type = type.substring(2);
      } else if (type.startsWith("o_")) {
        type = type.substring(2);
      } else if (type.startsWith("up_")) {
        type = type.substring(3);
      } else if (type.startsWith("np_")) {
        type = type.substring(3);
      }
    }

    let attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

    for (let item in attributes["individual"][0]) {
      //console.log(JSON.stringify());
      attributes["individual"][0][item][0]["attributes"].forEach((item, index) => {
        if (item["type"] == type) {
          title = item["eng"];
          desc = item["desc"];
        }
      });
    }

    for (let item in attributes["onIce"][0]) {
      //console.log(JSON.stringify());
      attributes["onIce"][0][item][0]["attributes"].forEach((item, index) => {
        if (item["type"] == type) {
          title = item["eng"];
          desc = item["desc"];
        }
      });
    }

    /*
    for (let item in attributes["teamsData"][0]) {
      //console.log(JSON.stringify());
      attributes["teamsData"][0][item][0]["attributes"].forEach((item, index) => {
        if (item["type"] == type) {
          title = item["eng"];
          desc = item["desc"];
        }
      });
    }
    */

    if (show_what == 1) {
      return title;
    } else if (show_what == 2) {
      return desc;
    } else {
      return "";
    }

  }





  downloadCSV() {
    let data = [];
    let th = ["Hraci", "GP", "TOI"];

    let th_types = ["gp", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    //alert(JSON.stringify(th_types));


    let row = [];
    let data_final = [];



    this.data.forEach((item, index) => {
      row.push(item);
    });

    row.forEach((item, index) => {
      let data_row = [];

      item["stats"].forEach((item2, index2) => {
        if (index2 == 0) {
          data_row = [accents.remove(this.getPlayerName(this.selected_player[0]['uuid'])) + " s " + accents.remove(this.getPlayerName(item["uuid"]))];
        } else if (index2 == 1) {
          data_row = [accents.remove(this.getPlayerName(this.selected_player[0]['uuid'])) + " bez " + accents.remove(this.getPlayerName(item["uuid"]))];
        } else if (index2 == 2) {
          data_row = [accents.remove(this.getPlayerName(item["uuid"])) + " bez " + accents.remove(this.getPlayerName(this.selected_player[0]['uuid']))];
        }
        //alert(JSON.stringify(item2));

        //data_row.push(item2);

        let selected_data = [];
        th_types.forEach((item3, index3) => {

          if (item3 == "toi") {
            selected_data.push(this.formatSecondsDecimal((item2[item3])));
          } else if (item2 == "oztoi") {
            selected_data.push(this.formatSecondsDecimal((item2[item3])));
          } else if (item2 == "dzposstoi") {
            selected_data.push(this.formatSecondsDecimal((item2[item3])));
          } else if (item2 == "oppdzptoi") {
            selected_data.push(this.formatSecondsDecimal((item2[item3])));


          } else if (item2 == "dztoi") {
            selected_data.push(this.formatSecondsDecimal((item2[item3])));

          } else if (item2 == "ozposstoi") {
            selected_data.push(this.formatSecondsDecimal((item2[item3])));

          } else if (item2 == "posstoi") {
            selected_data.push(this.formatSecondsDecimal((item2[item3])));




          } else {
            selected_data.push(String(item2[item3]));
          }
          console.log(selected_data);

        });

        selected_data.forEach(element => {
          data_row.push(element);

        });


        data_final.push(data_row);

      });

    });



    let with_header = [];
    with_header.push(th);

    data_final.forEach((item, index2) => {
      with_header.push(item);
    });

    //console.log(JSON.stringify(with_header));

    //new Angular5Csv(with_header, 'wowy', csv_options);
    this.defaultService.downloadXLS(with_header).subscribe(loaded_data => {
      window.location.assign(loaded_data["url"]);
    });
  }


  formatSeconds(seconds: number) {
    var date = new Date(seconds * 1000);
    var hh: any = date.getUTCHours();
    var mm: any = date.getUTCMinutes();
    var ss: any = date.getSeconds();
    let mh = mm + (60 * hh);

    if (mh < 10) { mh = "0" + mh; }
    if (ss < 10) { ss = "0" + ss; }

    return mh + ":" + ss;
  }

  formatSecondsDecimal(seconds: number) {
    return seconds / 60;
  }


  dict_reverse(obj) {
    let new_obj = {}
    let rev_obj = Object.keys(obj).reverse();
    rev_obj.forEach(function (i) {
      new_obj[i] = obj[i];
    })
    return new_obj;
  }

  setDefaultOrderRow() {
    this.list_order = 0;
  }
  addOrderRow() {
    this.list_order = this.list_order + 1;
  }

  checkLoggedTime() {
    let dt1 = new Date(localStorage.getItem('logged_date'));
    let dt2 = new Date();
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);

    if (Math.abs(Math.round(diff)) > 6) {
      alert("Platnost relace přihlášení vypršela. Přihlaste se znovu.");
      this.defaultService.logout();
    }
  }

  //TRACKING
  trackOpenPage() {
    let logged_user = JSON.parse(localStorage.getItem('logged_user'));
    this.defaultService.addEvent(logged_user[0].id, logged_user[0].user, "Byla otevřena obrazovka spoluhráči.", 9).subscribe(loaded_data => {
    });
  }

}


