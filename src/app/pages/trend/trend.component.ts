import { Component, OnInit, ElementRef, ViewChild, NgZone, isDevMode, HostListener } from '@angular/core';

import { Location } from '@angular/common';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { DatepickerOptions } from 'ng2-datepicker';
import * as csLocale from 'date-fns/locale/cs';

//import * as _ from "lodash";
import { TrendService } from '../../services/trend/trend.service';
import { DefaultService } from '../../services/default/default.service';
import { createTrue } from 'typescript';
import { FormationsAnalysisService } from '../../services/formations-analysis/formations-analysis.service';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';


@Component({
  selector: 'trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.scss'],
  providers: [TrendService, DefaultService, TranslatePipe, FormationsAnalysisService]
})
export class TrendComponent implements OnInit {

  //filters
  filter_season: any = [];
  filter_seasonPart: string = "";
  filter_team: string = "";
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
  filter_born_from: number;
  filter_born_to: number;
  filter_posts: string = "ALL";
  filter_situationType: string = "";
  filter_situationTime: number;

  filterby: string = "toi";
  //filters


  more_filters: boolean = false;

  tab: string = "";

  teams_list: any[];

  dataLoaded: boolean;
  loading: boolean;


  seasons_select_list = [];
  dropdownSettings = {};
  seasons_list: any[];

  competitions_list: any = [];



  toggle_table_settings: boolean = false;



  filter_playerId_select1: string = "";
  filter_playerId_select2: string = "";
  filter_playerId_select3: string = "";
  filter_playerId_select4: string = "";
  filter_playerId_select5: string = "";
  filter_playerId_select6: string = "";


  filter_selected_players1: string = "on";
  filter_selected_players2: string = "on";
  filter_selected_players3: string = "on";
  filter_selected_players4: string = "on";
  filter_selected_players5: string = "on";
  filter_selected_players6: string = "on";


  table_settings_graph: any[] = [
    { "type": "cf60", "name": "CF/60", "colour": "green" },
    { "type": "ca60", "name": "CA/60", "colour": "red" },
    { "type": "cf_percent", "name": "CF%", "colour": "green" },
    { "type": "cf_percent_rel", "name": "CF% Rel", "colour": "red" }
  ];


  table_settings: any[] = [
    { "type": "cf60", "name": "CF/60", "colour": "green" },
    { "type": "ca60", "name": "CA/60", "colour": "red" },
    { "type": "cf_percent", "name": "CF%", "colour": "green" },
    { "type": "sc", "name": "sC", "colour": "green" },
    { "type": "sc60", "name": "sC/60", "colour": "green" },
    { "type": "scf60", "name": "sCF/60", "colour": "green" },
    { "type": "sca60", "name": "sCA/60", "colour": "red" },
    { "type": "scf_percent", "name": "sCF%", "colour": "green" },
    { "type": "g", "name": "G", "colour": "green" },
    { "type": "g60", "name": "G/60", "colour": "green" },
    { "type": "ga60", "name": "GA/60", "colour": "red" },
    { "type": "gf_percent", "name": "GF%", "colour": "green" },
    { "type": null, "name": null, "colour": null },
    { "type": null, "name": null, "colour": null },
    { "type": null, "name": null, "colour": null },
    { "type": null, "name": null, "colour": null }
  ];


  data: any = [];

  selected_attributes_string: string = "";

  canvas_type: string = "normal";

  boolProd: boolean = true;

  filter_vyber_dat_dle: boolean = false;


  @ViewChild('lol') private lol: ElementRef;
  @ViewChild('chart') private chart: ElementRef;
  @HostListener('window:scroll', ['$event'])

  public lineChartLabels: Label[] = [];
  public lineChartData: Array<any> = [];
  public lineChartColors: Color[] = [];

  public lineChartOptions: (ChartOptions) = {};
  show_canvas_tooltip: boolean = false;
  canvas_tooltip_left: number = 0;
  canvas_tooltip_top: number = 0;
  public lineChartLegend = true;
  public lineChartType = 'line';
  tooltip_value: string = "";
  tooltip_date: string = "";
  tooltip_match: string = "";


  filter_graph_attribute: string = "cf60";

  trend_type: string = "";

  data_graph: any = [];

  data_table: any = [];

  trend_limits: any[] = [
    { "date_from": "", "date_to": "", "match_from": null, "match_to": null }
  ];
  trend_date_from: any = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  trend_date_to: any = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  trend_match_from: any = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  trend_match_to: any = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];

  trend_table_loading: boolean = false;
  matches_list: any = [];

  constructor(private translate: TranslatePipe, private formationsAnalysisService: FormationsAnalysisService, private router: Router, private trendService: TrendService, private defaultService: DefaultService, private zone: NgZone, private location: Location, private activatedRoute: ActivatedRoute, private elem: ElementRef) {

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

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['trend_type'] != undefined) {
        this.trend_type = params['trend_type'];
        //alert(this.trend_type);
      }
    });

  }

  ngOnInit() {
    this.getCompetitions();
    this.checkExistParameter();
    this.trackOpenPage();

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
    this.teams_list = [];

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

  changedOrder(event) {
    this.filterby = event;
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

  showMoreFilters() {
    if (this.more_filters == true) {
      this.more_filters = false;
    } else {
      this.more_filters = true;
    }
  }

  showTab(tab: string) {
    this.tab = tab;
  }


  toggleTableSettings() {
    if (this.toggle_table_settings == true) {
      this.toggle_table_settings = false;
    } else {
      this.toggle_table_settings = true;
    }
  }


  loadData() {
    this.checkLoggedTime();

    this.loading = true;
    this.dataLoaded = true;

    if (this.tab == "") {
      this.tab = "trend";
    }


    if (this.trend_type == "individual") {
      this.trendService.getTrendIndividual(this.filter_seasonPart, this.filter_team, this.filter_lastGames, this.filter_countOfPlayer, this.filter_matchState, this.filter_homeAway, this.filter_opponents, this.filter_dateFrom, this.filter_dateTo, this.filter_minutes_from, this.filter_minutes_to, this.filter_minTOI, this.filter_playerId_select1, this.filter_playerId_select2, this.filter_playerId_select3, this.filter_playerId_select4, this.filter_playerId_select5, this.filter_playerId_select6, this.filter_selected_players1, this.filter_selected_players2, this.filter_selected_players3, this.filter_selected_players4, this.filter_selected_players5, this.filter_selected_players6, this.filter_situationType, this.filter_situationTime, this.table_settings).subscribe(loaded_data => {
        this.data_graph = loaded_data;
        this.renderGraph();
      }, err => {
      });
    } else if (this.trend_type == "team") {
      this.trendService.getTrendTeam(this.filter_seasonPart, this.filter_team, this.filter_lastGames, this.filter_countOfPlayer, this.filter_matchState, this.filter_homeAway, this.filter_opponents, this.filter_dateFrom, this.filter_dateTo, this.filter_minutes_from, this.filter_minutes_to, this.filter_minTOI, this.filter_playerId_select1, this.filter_playerId_select2, this.filter_playerId_select3, this.filter_playerId_select4, this.filter_playerId_select5, this.filter_playerId_select6, this.filter_selected_players1, this.filter_selected_players2, this.filter_selected_players3, this.filter_selected_players4, this.filter_selected_players5, this.filter_selected_players6, this.filter_situationType, this.filter_situationTime, this.table_settings).subscribe(loaded_data => {
        this.data_graph = loaded_data;
        this.renderGraph();
      }, err => {
      });
    } else if (this.trend_type == "formation") {
      this.trendService.getTrendFormation(this.filter_seasonPart, this.filter_team, this.filter_lastGames, this.filter_countOfPlayer, this.filter_matchState, this.filter_homeAway, this.filter_opponents, this.filter_dateFrom, this.filter_dateTo, this.filter_minutes_from, this.filter_minutes_to, this.filter_minTOI, this.filter_playerId_select1, this.filter_playerId_select2, this.filter_playerId_select3, this.filter_playerId_select4, this.filter_playerId_select5, this.filter_playerId_select6, this.filter_selected_players1, this.filter_selected_players2, this.filter_selected_players3, this.filter_selected_players4, this.filter_selected_players5, this.filter_selected_players6, this.filter_situationType, this.filter_situationTime, this.table_settings).subscribe(loaded_data => {
        this.data_graph = loaded_data;
        //console.log(JSON.stringify(loaded_data));
        this.renderGraph();
      }, err => {
      });
    }
  }


  reloadGraphData() {
    this.checkLoggedTime();

    this.loading = true;
    this.dataLoaded = true;

    if (this.tab == "") {
      this.tab = "trend";
    }

  }



  renderGraph() {
    let months = [];

    this.data_graph.forEach(item => {

      this.matches_list.push(item["match"]);

      let year = new Date(item["date"]).getFullYear();
      let month = new Date(item["date"]).getMonth() + 1;
      let month_final = "";
      if (month < 10) {
        month_final = "0" + month;
      } else {
        month_final = String(month);
      }

      months.push(year + "-" + month_final + "-01")
    });
    months = months.filter(function (item, pos) {
      return months.indexOf(item) == pos;
    });

    let min_date = months[0];
    let max_date = months.slice(-1).pop();
    max_date = new Date(max_date);
    max_date.setMonth(max_date.getMonth() + 1);
    max_date = max_date.getUTCFullYear() + '-' +
      ('00' + (max_date.getUTCMonth() + 1)).slice(-2) + '-' +
      ('00' + max_date.getUTCDate()).slice(-2);
    this.lineChartLabels = [];

    months.forEach(item => {
      this.lineChartLabels.push(new Date(item).toLocaleString())
    });


    //data
    let data_raw = [];
    let data = [];
    //console.log(JSON.stringify(this.data_graph));

    this.data_graph.forEach(item => {
      let attribute_value = 0;

      if (item["stats"] == null) {
        attribute_value = undefined;
      } else {
        attribute_value = item["stats"][this.filter_graph_attribute];
      }

      //console.log(attribute_value);

      data.push({
        t: new Date(item["date"]),
        y: attribute_value
      });

      if (item["stats"] == null) {
        //data_raw.push(undefined);
      } else {
        data_raw.push(item["stats"][this.filter_graph_attribute]);
      }

    });

    let y_data_min = 0;

    let a = data_raw.reduce((acc, val) => (acc > val) ? acc : val);
    let y_data_max = Math.ceil(a);


    let y_ticks = {
      beginAtZero: true,
      min: y_data_min,
      max: y_data_max,
    };

    this.lineChartData = [{
      label: this.filter_graph_attribute,
      data: data
    }];
    this.lineChartColors = [{
      backgroundColor: 'transparent',
      borderColor: '#ff1744',
      borderWidth: 3,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#151d22',
      pointHoverBackgroundColor: '#151d22',
      pointHoverBorderColor: '#151d22',
      pointBorderWidth: 3,
      pointRadius: 5,
      pointHoverBorderWidth: 3,
      pointHoverRadius: 5
    }];
    this.lineChartOptions = {
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            callback: function (value) {
              return new Date(value).getMonth() + 1 + "/" + new Date(value).getFullYear();
            }
          },
          type: 'time',
          distribution: 'linear',
          time: {
            unit: 'month',
            min: min_date,
            max: max_date,
            displayFormats: {
              'day': 'YYYY-MM-DD'
            }
          }
        }],
        yAxes: [{
          display: true,
          ticks: y_ticks,
          gridLines: {
            display: true,
            zeroLineColor: '#151d22'
          },
        }]
      },
      tooltips: {
        enabled: false,
        custom: (tooltipModel) => {
          var tooltipEl = this.lol;

          if (!tooltipEl) {
            this.show_canvas_tooltip = true;
            if (tooltipModel.dataPoints !== undefined) {
              const date = tooltipModel.dataPoints[0].xLabel;
              const value = tooltipModel.dataPoints[0].yLabel;
              this.tooltip_value = value;
              this.tooltip_date = date;


              var sql_date;
              sql_date = new Date(date);
              sql_date = sql_date.getUTCFullYear() + '-' +
                ('00' + (sql_date.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + sql_date.getUTCDate()).slice(-2);

              //console.log(JSON.stringify(this.data_graph));
              this.data_graph.forEach(item => {
                if (item["date"] == sql_date) {
                  this.tooltip_match = this.getTeamName(item["homeTeam"]) + " - " + this.getTeamName(item["awayTeam"]) + " " + item["score"]["home"] + ":" + item["score"]["away"] + "" + this.getGameState(item["score"]["state"]);
                }
              });

            }
          }

          if (tooltipModel.opacity === 0) {
            this.show_canvas_tooltip = false;
          }

          if (tooltipModel.body) {
            //alert(JSON.stringify(tooltipModel.body));
          }

          var position = this.chart.nativeElement.getBoundingClientRect();
          this.canvas_tooltip_left = position.left + window.pageXOffset + tooltipModel.caretX;
          this.canvas_tooltip_top = position.top + window.pageYOffset + tooltipModel.caretY;
        }
      }
    };
    this.loading = false;
    this.dataLoaded = true;
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

  getPlayerPost(uuid: string) {
    if (uuid != undefined) {
      return JSON.parse(localStorage.getItem(uuid))["position"];
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

  getTeamName(uuid: string) {
    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] == uuid) {
        shortcut = item['shortcut'];
      }
    });

    return shortcut;
  }

  getTeamName2(uuid: string) {
    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] == uuid) {
        shortcut = item['name'];
      }
    });

    return shortcut;
  }


  getGameState(state: string) {
    let game_state = "";

    if (state == "normal") {
      game_state = "";
    } else if (state == "overtime") {
      game_state = "p";
    } else if (state == "shooting") {
      game_state = "sn";
    }
    return game_state;
  }

  getPlayerTeamShort(uuid: string) {
    uuid = JSON.parse(localStorage.getItem(uuid))["team"];
    //alert(JSON.stringify(uuid));
    //console.log(JSON.stringify(this.teams_list));
    let team = "";
    let keepGoing = true;
    this.teams_list.forEach((item, index) => {
      if (keepGoing) {
        if (item["team"] == uuid) {
          //console.log(JSON.stringify(item));
          keepGoing = false;
          team = item["shortcut"];
        } else {
          team = "";
        }
      }
    });

    return team;

  }

  getTeamLogo(uuid: string) {

    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        shortcut = item["shortcut"];
      }
    });

    return this.getPlayerTeamLogo(shortcut);

  }

  getPlayerTeamLogo(team_shortcut: string) {
    if (team_shortcut == "MHK") {
      return "../assets/logos/29579d3e-1502-4ec0-80e3-f5ead6d22fb0.png";
    } else if (team_shortcut == "OLO") {
      return "../assets/logos/71760283-d630-4c7f-b52f-e0b193a622cd.png";
    } else if (team_shortcut == "TRI") {
      return "../assets/logos/55d9085b-58b5-4c52-bc73-42fdc106c944.png";
    } else if (team_shortcut == "CHM") {
      return "../assets/logos/1460b1ac-a5a9-4819-997e-afa26b512299.png";
    } else if (team_shortcut == "LIT") {
      return "../assets/logos/3c08ada2-3fd6-49b7-974d-2db9c92676ac.png";
    } else if (team_shortcut == "LIB") {
      return "../assets/logos/3c85029c-140f-4971-96d2-76a95f429c2b.png";
    } else if (team_shortcut == "PLZ") {
      return "../assets/logos/524e1ff0-e670-42d9-93aa-8ba35bb94942.png";
    } else if (team_shortcut == "PCE") {
      return "../assets/logos/f9b85077-6ea5-4769-9bba-27d5da8e97bd.png"
    } else if (team_shortcut == "ZLN") {
      return "../assets/logos/eec5f929-a5bb-4bf4-8e69-34d0a274c661.png";
    } else if (team_shortcut == "VIT") {
      return "../assets/logos/99f32b0e-ddcc-4330-8ef5-66c8bbdd22ba.png";
    } else if (team_shortcut == "SPA") {
      return "../assets/logos/9af95c87-b24b-411b-a615-c1d86861fca5.png";
    } else if (team_shortcut == "KOM") {
      return "../assets/logos/69802e5a-b9de-4bc0-8001-f5e11d0f2048.png";
    } else if (team_shortcut == "MBL") {
      return "../assets/logos/b4a4a812-fd88-47e4-a626-be3300b390cc.png";
    } else if (team_shortcut == "JIH") {
      return "../assets/logos/e3bf29fb-e963-4922-9064-1b6101047a9e.png";
    } else if (team_shortcut == "KVA") {
      return "../assets/logos/302630a7-3aff-4303-9539-951bdd605ab9.png";
    } else if (team_shortcut == "KLA") {
      return "../assets/logos/42bafa4d-5e60-4f00-81c5-4f44ffa55927.png";
    } else if (team_shortcut == "CEB") {
      return "../assets/logos/732e68fc-13c7-45a8-bb51-5eeab8b10283.png";
    }
  }

  checkExistParameter() {

    let parameters_exists_reload_data = false;

    this.activatedRoute.params.subscribe((params: Params) => {

      if (params['filter_season'] != undefined) {
        this.filter_season = [];

        let filter_season = params['filter_season'];
        let filter_season_list = filter_season.split(',');

        filter_season_list.forEach((item, index) => {
          let next_season = parseInt(item) + 1;
          this.filter_season.push({ "id": item, "itemName": item + " - " + next_season });
        });

        this.filter_seasonPart = "";

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_seasonPart'] != undefined) {
        this.getSeasonParts();
        this.filter_seasonPart = params['filter_seasonPart'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_team'] != undefined) {
        this.filter_team = params['filter_team'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_countOfPlayer'] != undefined) {
        this.filter_countOfPlayer = params['filter_countOfPlayer'];

        if (params['filter_countOfPlayer'] == "ALL") {
          this.filter_countOfPlayer = "";
        }
        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_minTOI'] != undefined && params['filter_minTOI'] != "undefined") {
        this.filter_minTOI = parseInt(params['filter_minTOI']);

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_lastGames'] != undefined && params['filter_lastGames'] != "undefined") {
        this.more_filters = true;
        this.filter_lastGames = parseInt(params['filter_lastGames']);

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_dateFrom'] != undefined && params['filter_dateFrom'] != "undefined") {
        this.more_filters = true;
        this.filter_dateFrom = params['filter_dateFrom'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_dateTo'] != undefined && params['filter_dateTo'] != "undefined") {
        this.more_filters = true;
        this.filter_dateTo = params['filter_dateTo'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_homeAway'] != undefined && params['filter_homeAway'] != "undefined") {
        this.more_filters = true;
        this.filter_homeAway = params['filter_homeAway'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_matchState'] != undefined && params['filter_matchState'] != "undefined") {
        this.more_filters = true;
        this.filter_matchState = params['filter_matchState'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_minutes_from'] != undefined && params['filter_minutes_from'] != "undefined") {
        this.more_filters = true;
        this.filter_minutes_from = parseInt(params['filter_minutes_from']);

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_minutes_to'] != undefined && params['filter_minutes_to'] != "undefined") {
        this.more_filters = true;
        this.filter_minutes_to = parseInt(params['filter_minutes_to']);

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_opponents'] != undefined && params['filter_opponents'] != "undefined") {
        this.more_filters = true;


        this.filter_opponents = params['filter_opponents'].split(",");

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_playerId_select1'] != undefined && params['filter_playerId_select1'] != 'undefined') {
        this.more_filters = true;
        this.filter_playerId_select1 = params['filter_playerId_select1'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_playerId_select2'] != undefined && params['filter_playerId_select2'] != 'undefined') {
        this.more_filters = true;
        this.filter_playerId_select2 = params['filter_playerId_select2'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_playerId_select3'] != undefined && params['filter_playerId_select3'] != 'undefined') {
        this.more_filters = true;
        this.filter_playerId_select3 = params['filter_playerId_select3'];

        //
        parameters_exists_reload_data = true;
      }


      if (params['filter_playerId_select4'] != undefined && params['filter_playerId_select4'] != 'undefined') {
        this.more_filters = true;
        this.filter_playerId_select4 = params['filter_playerId_select4'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_playerId_select5'] != undefined && params['filter_playerId_select5'] != 'undefined') {
        this.more_filters = true;
        this.filter_playerId_select5 = params['filter_playerId_select5'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_playerId_select6'] != undefined && params['filter_playerId_select6'] != 'undefined') {
        this.more_filters = true;
        this.filter_playerId_select6 = params['filter_playerId_select6'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_situationType'] != undefined && params['filter_situationType'] != 'undefined') {
        this.more_filters = true;
        this.filter_situationType = params['filter_situationType'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_situationTime'] != undefined && params['filter_situationTime'] != 'undefined') {
        this.more_filters = true;
        this.filter_situationTime = parseInt(params['filter_situationTime']);

        //
        parameters_exists_reload_data = true;
      }

      if (params['selected_attributes'] != undefined && params['selected_attributes'] != 'undefined') {
        this.more_filters = true;
        this.selected_attributes_string = params['selected_attributes'];
        //alert(JSON.stringify(this.table_settings) + "   " + this.selected_attributes_string);

        let parameter_attributes = this.selected_attributes_string.split(',');


        let loaded_attributes = [];
        let attributes = JSON.parse(localStorage.getItem('loaded_attributes'));



        for (let item in attributes["individual"][0]) {
          attributes["individual"][0][item][0]["attributes"].forEach((item, index) => {
            loaded_attributes.push(item);
          });
        }

        for (let item in attributes["onIce"][0]) {
          attributes["onIce"][0][item][0]["attributes"].forEach((item, index) => {
            loaded_attributes.push(item);
          });
        }



        let new_r = [];
        let new_o = [];
        let new_f = [];

        loaded_attributes.forEach(item => {
          const attribute = {
            "name": 'R_' + item["name"],
            "type": 'r_' + item["type"],
            "colour": item["colour"],
            "eng": item["eng"],
            "desc": item["desc"],
            "data": item["data"],
          };
          new_r.push(attribute);
        });

        loaded_attributes.forEach(item => {
          const attribute = {
            "name": 'O_' + item["name"],
            "type": 'o_' + item["type"],
            "colour": item["colour"],
            "eng": item["eng"],
            "desc": item["desc"],
            "data": item["data"],
          };
          new_o.push(attribute);
        });

        loaded_attributes.forEach(item => {
          const attribute = {
            "name": 'F_' + item["name"],
            "type": 'f_' + item["type"],
            "colour": item["colour"],
            "eng": item["eng"],
            "desc": item["desc"],
            "data": item["data"],
          };
          new_f.push(attribute);
        });


        new_r.forEach(item => {
          loaded_attributes.push(item);
        });
        new_o.forEach(item => {
          loaded_attributes.push(item);
        });
        new_f.forEach(item => {
          loaded_attributes.push(item);
        });



        this.table_settings = [];
        parameter_attributes.forEach(item => {
          loaded_attributes.forEach(element => {
            if (element['type'] == item) {
              this.table_settings.push({ "type": element['type'], "name": element['name'], "colour": element['colour'] });
            }
          });
        });

        this.table_settings.forEach((item, index) => {
          if (index == 0) {
            this.filter_graph_attribute = item["type"];
          }
        });

        //
        parameters_exists_reload_data = true;
      }

      if (parameters_exists_reload_data == true) {
        this.loadData();
      }

    });

  }

  onChangedAttributes(new_attributes: any) {
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (index == 0) {
        this.filter_graph_attribute = item["type"];
      }

      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings = clean_attributes;
    this.loadData();
    this.loadTrendDataLine();
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

      for (let item in attributes["goalkeepersData"][0]) {
        //console.log(JSON.stringify());
        attributes["goalkeepersData"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            colour = item["colour"];
          }
        });
      }

    }
    return colour;

  }

  getAttributeName(type: string) {

    let name = "no-name";
    let attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

    if (type != null || type != undefined) {
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

    if (type != null || type != undefined) {

      for (let item in attributes["individual"][0]) {
        //console.log(JSON.stringify());
        attributes["individual"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            name = item["name"];
          }
        });
      }

      for (let item in attributes["onIce"][0]) {
        //console.log(JSON.stringify());
        attributes["onIce"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            name = item["name"];
          }
        });
      }

      /*
      for (let item in attributes["teamsData"][0]) {
        //console.log(JSON.stringify());
        attributes["teamsData"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            name = item["name"];
          }
        });
      }
      */

      for (let item in attributes["goalkeepersData"][0]) {
        //console.log(JSON.stringify());
        attributes["goalkeepersData"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            name = item["name"];
          }
        });
      }

    }
    return name;

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

  filterVyberDatDle(actual_value: boolean) {
    this.data_table = [];
    this.trend_limits = [];
    this.trend_limits = [{ "date_from": "", "date_to": "", "match_from": null, "match_to": null }];

    this.trend_date_from = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    this.trend_date_to = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    this.trend_match_from = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    this.trend_match_to = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];

    if (this.filter_vyber_dat_dle == true) {
      this.filter_vyber_dat_dle = false;
    } else {
      this.filter_vyber_dat_dle = true;
    }
  }


  addNewPeriod() {
    if (this.filter_vyber_dat_dle == false) {
      if ((this.trend_limits[this.trend_limits.length - 1]["date_from"] == "" && this.trend_limits[this.trend_limits.length - 1]["date_to"] == "")) {
        alert("Další řádek se přidá ve chvíli, kdy budou předchozí filtry vyplněny.");
      } else {
        this.trend_limits.push({ "date_from": "", "date_to": "", "match_from": null, "match_to": null });
      }
    } else {
      if ((this.trend_limits[this.trend_limits.length - 1]["match_from"] == null && this.trend_limits[this.trend_limits.length - 1]["match_to"] == null)) {
        alert("Další řádek se přidá ve chvíli, kdy budou předchozí filtry vyplněny.");
      } else {
        this.trend_limits.push({ "date_from": "", "date_to": "", "match_from": null, "match_to": null });
      }
    }
  }

  changeTrendDateFrom(date: string, index: number) {
    this.trend_limits[index]["date_from"] = date;
  }

  changeTrendDateTo(date: string, index: number) {
    this.trend_limits[index]["date_to"] = date;
  }

  changeTrendMatchFrom(match: number, index: number) {
    this.trend_limits[index]["match_from"] = match;
  }

  changeTrendMatchTo(match: number, index: number) {
    this.trend_limits[index]["match_to"] = match;
  }


  loadTrendDataLine() {
    this.trend_table_loading = true;
    let periodBy = "";
    if (this.filter_vyber_dat_dle == false) {
      periodBy = "calendar";
    } else {
      periodBy = "matches";
    }
    this.data_table = [];


    this.trend_limits.forEach((item, index) => {

      let period_date_from = item["date_from"];
      let period_date_to = item["date_to"];
      let period_match_from = item["match_from"];
      let period_match_to = item["match_to"];
      let matches_list_range = this.matches_list.slice(period_match_from - 1, period_match_to);
      this.trendService.getIndividualStatsTrend(this.filter_seasonPart, this.filter_team, this.filter_lastGames, this.filter_countOfPlayer, this.filter_matchState, this.filter_homeAway, this.filter_opponents, this.filter_dateFrom, this.filter_dateTo, this.filter_minutes_from, this.filter_minutes_to, this.filter_minTOI, this.filter_situationType, this.filter_situationTime, this.table_settings, undefined, undefined, periodBy, period_date_from, period_date_to, matches_list_range).subscribe(loaded_data => {
        loaded_data.forEach(stat_row => {
          //console.log(this.filter_playerId_select1);
          //console.log(JSON.stringify(stat_row));
          if (stat_row["player"] == this.filter_playerId_select1) {
            let data_edited = stat_row["stats"];
            data_edited["id"] = index;
            this.data_table.push(data_edited);
          }
        });


        let data_empty = {};
        if (this.data_table.length == 0) {
          this.table_settings.forEach((item) => {
            data_empty[item["type"]] = 0;
            data_empty['toi'] = 0;
          });
          this.data_table.push(data_empty);
        }


        this.loading = false;
        this.dataLoaded = true;
        this.trend_table_loading = false;

      }, err => { });

    });



  }


  //TRACKING
  trackOpenPage() {
    let logged_user = JSON.parse(localStorage.getItem('logged_user'));
    this.defaultService.addEvent(logged_user[0].id, logged_user[0].user, "Byla otevřena obrazovka trend.", 10).subscribe(loaded_data => {
    });
  }



}
