import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
  isDevMode,
} from "@angular/core";

import { Location } from "@angular/common";

import { Router, ActivatedRoute, Params } from "@angular/router";

import { DatepickerOptions } from "ng2-datepicker";
import * as csLocale from "date-fns/locale/cs";

import * as _ from "lodash";
import { GamelogService } from "../../services/gamelog/gamelog.service";
import { DefaultService } from "../../services/default/default.service";
import { createTrue } from "typescript";

import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import { TranslatePipe } from "../../pipes/translate.pipe";
var accents = require("remove-accents");

@Component({
  selector: "gamelog",
  templateUrl: "./gamelog.component.html",
  styleUrls: ["./gamelog.component.scss"],
  providers: [GamelogService, DefaultService, TranslatePipe],
})
export class GamelogComponent implements OnInit {
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

  //iCF, iCF/60, CF, CA, CF/60, CA/60, CF%, CF/60 Rel, CA/60 Rel, CF% Rel,
  //iSCF, iSCF/60, SCF, SCA, SCF/60, SCA/60, SCF%, SCF/60 Rel, SCA/60 Rel, SCF% Rel,
  //GF, GA, GF/60, GA/60, GF%, GF/60 Rel, GA/60 Rel, GF% Rel
  //G, G/60, A/60, P/60,
  //OZS, DZS, ZSR%

  table_settings: any[] = [
    { type: "cf60", name: "CF/60", colour: "green" },
    { type: "ca60", name: "CA/60", colour: "red" },
    { type: "cf_percent", name: "CF%", colour: "green" },
    { type: "sc", name: "sC", colour: "green" },
    { type: "sc60", name: "sC/60", colour: "green" },
    { type: "scf60", name: "sCF/60", colour: "green" },
    { type: "sca60", name: "sCA/60", colour: "red" },
    { type: "scf_percent", name: "sCF%", colour: "green" },
    { type: "g", name: "G", colour: "green" },
    { type: "g60", name: "G/60", colour: "green" },
    { type: "ga60", name: "GA/60", colour: "red" },
    { type: "gf_percent", name: "GF%", colour: "green" },
    { type: null, name: null, colour: null },
    { type: null, name: null, colour: null },
    { type: null, name: null, colour: null },
    { type: null, name: null, colour: null },
  ];

  data: any = [];

  selected_attributes_string: string = "";

  gamelog_type_goalkeepers: boolean = false;
  canvas_type: string = "normal";

  boolProd: boolean = true;

  constructor(
    private translate: TranslatePipe,
    private router: Router,
    private gamelogService: GamelogService,
    private defaultService: DefaultService,
    private zone: NgZone,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.gamelog_type_goalkeepers = this.router.url.includes(
      "gamelog_goalkeepers"
    );

    this.dropdownSettings = {
      singleSelection: false,
      text: "Vybrat sezonu",
      selectAllText: "Vybrat vše",
      unSelectAllText: "Odebrat vše",
      enableSearchFilter: false,
      classes: "multiselect",
    };

    this.dataLoaded = false;
    this.loading = false;

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }
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
      let next_season = parseInt(item["name"]) + 1;
      this.seasons_select_list.push({
        id: item["name"],
        itemName: item["name"] + " - " + next_season,
      });
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
      {
        id: 0,
        name: this.translate.transform("zakladni_cast"),
        part: "base",
        uuids: "",
      },
      { id: 1, name: "Play-off", part: "playoff", uuids: "" },
      { id: 2, name: "Play-out", part: "playout", uuids: "" },
      {
        id: 3,
        name: this.translate.transform("baraz"),
        part: "relegation",
        uuids: "",
      },
      {
        id: 4,
        name: this.translate.transform("preliminary"),
        part: "preliminary",
        uuids: "",
      },
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
        {
          id: 0,
          name: this.translate.transform("zakladni_cast"),
          part: "base",
          uuids: this.itemsToStringApi(base),
        },
        {
          id: 1,
          name: "Play-off",
          part: "playoff",
          uuids: this.itemsToStringApi(playoff),
        },
        {
          id: 2,
          name: "Play-out",
          part: "playout",
          uuids: this.itemsToStringApi(playout),
        },
        {
          id: 3,
          name: this.translate.transform("baraz"),
          part: "relegation",
          uuids: this.itemsToStringApi(relegation),
        },
        {
          id: 4,
          name: this.translate.transform("preliminary"),
          part: "preliminary",
          uuids: this.itemsToStringApi(preliminary),
        },
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
      var competition_details = JSON.parse(
        localStorage.getItem("competition_details")
      );

      competition_details.forEach((item2, index) => {
        if (typeof item2[item] != "undefined") {
          item2[item]["teams"].forEach((team, index) => {
            //load full players seznam
            team["players"].forEach((player, index) => {
              let key = {
                uuid: player["uuid"],
                name: player["name"],
                surname: player["surname"],
                position: player["position"],
                team: team["uuid"],
                jersey: player["jersey"],
                stick: player["stick"],
                hokejczId: player["hokejczId"],
              };
              localStorage.setItem(player["uuid"], JSON.stringify(key));
            });

            //load team player list
            var index: any = this.teams_list.findIndex(
              (x) => x.uuid == team["uuid"]
            );
            if (index === -1) {
              this.teams_list.push({
                uuid: team["uuid"],
                name: team["name"],
                shortName: team["shortName"],
                shortcut: team["shortcut"],
                team: team["uuid"],
                players: "",
              });
            } else console.log("object already exists");
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
    var year = date_string.getFullYear();
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
    var year = date_string.getFullYear();
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
      })
      .join(", ");
  }

  public itemsToStringApi(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item;
      })
      .join(",");
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
      this.tab = "gamelog";
    }

    this.data = [];

    //alert(JSON.stringify(this.table_settings));

    if (this.router.url.includes("gamelog_goalkeepers") == false) {
      this.gamelogService
        .getGamelog(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings
        )
        .subscribe(
          (loaded_data) => {
            this.data = loaded_data;

            if (
              this.filter_playerId_select1 == "" &&
              this.filter_playerId_select2 == "" &&
              this.filter_playerId_select3 == "" &&
              this.filter_playerId_select4 == "" &&
              this.filter_playerId_select5 == "" &&
              this.filter_playerId_select6 == ""
            ) {
              this.canvas_type = "teams";
            }

            this.data.forEach((item, index) => {
              this.data[index]["uuid"] = item["uuid"];

              this.data[index]["homeTeamUuid"] = item["info"]["homeTeamUuid"];
              this.data[index]["awayTeamUuid"] = item["info"]["awayTeamUuid"];
              this.data[index]["date"] = item["info"]["date"];
              this.data[index]["home_score"] = item["info"]["score"]["home"];
              this.data[index]["away_score"] = item["info"]["score"]["away"];
              this.data[index]["state_score"] = item["info"]["score"]["state"];

              this.table_settings.forEach((item2, index2) => {
                this.data[index][item2["type"]] = item["stats"][item2["type"]];
              });

              this.data[index]["toi"] = item["stats"]["toi"];
            });

            //console.log(JSON.stringify(this.data));

            this.loading = false;
            this.dataLoaded = false;
          },
          (err) => {
            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
            //this.defaultService.logout();
            window.location.reload();
          }
        );
    } else {
      this.canvas_type = "goalkeepers";

      this.gamelogService
        .getGamelogGoalkeeper(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings
        )
        .subscribe(
          (loaded_data) => {
            this.data = loaded_data;

            this.data.forEach((item, index) => {
              this.data[index]["uuid"] = item["uuid"];

              this.data[index]["homeTeamUuid"] = item["info"]["homeTeamUuid"];
              this.data[index]["awayTeamUuid"] = item["info"]["awayTeamUuid"];
              this.data[index]["date"] = item["info"]["date"];
              this.data[index]["home_score"] = item["info"]["score"]["home"];
              this.data[index]["away_score"] = item["info"]["score"]["away"];
              this.data[index]["state_score"] = item["info"]["score"]["state"];

              this.table_settings.forEach((item2, index2) => {
                this.data[index][item2["type"]] = item["stats"][item2["type"]];
              });

              this.data[index]["toi"] = item["stats"]["toi"];
            });

            //console.log(JSON.stringify(this.data));

            this.loading = false;
            this.dataLoaded = false;
          },
          (err) => {
            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
            //this.defaultService.logout();
            // window.location.reload();
          }
        );
    }
  }

  getTableToggleAttributes(attribute: string) {
    let style = "";

    this.table_settings.forEach((item, index) => {
      if (item["type"] == attribute) {
        if (item["enabled"] == false) {
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
      if (item["type"] == select) {
        if (item["enabled"] == false) {
          this.table_settings[index]["enabled"] = true;
        } else {
          this.table_settings[index]["enabled"] = false;
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
      if (item["uuid"] == uuid) {
        shortcut = item["shortcut"];
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
      return "../assets/logos/f9b85077-6ea5-4769-9bba-27d5da8e97bd.png";
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
      if (params["filter_season"] != undefined) {
        this.filter_season = [];

        let filter_season = params["filter_season"];
        let filter_season_list = filter_season.split(",");

        filter_season_list.forEach((item, index) => {
          let next_season = parseInt(item) + 1;
          this.filter_season.push({
            id: item,
            itemName: item + " - " + next_season,
          });
        });

        this.filter_seasonPart = "";

        //
        parameters_exists_reload_data = true;
      }

      if (params["filter_seasonPart"] != undefined) {
        this.getSeasonParts();
        this.filter_seasonPart = params["filter_seasonPart"];

        //
        parameters_exists_reload_data = true;
      }

      if (params["filter_team"] != undefined) {
        this.filter_team = params["filter_team"];

        //
        parameters_exists_reload_data = true;
      }

      if (params["filter_countOfPlayer"] != undefined) {
        this.filter_countOfPlayer = params["filter_countOfPlayer"];

        if (params["filter_countOfPlayer"] == "ALL") {
          this.filter_countOfPlayer = "";
        }
        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_minTOI"] != undefined &&
        params["filter_minTOI"] != "undefined"
      ) {
        this.filter_minTOI = parseInt(params["filter_minTOI"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_lastGames"] != undefined &&
        params["filter_lastGames"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_lastGames = parseInt(params["filter_lastGames"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_dateFrom"] != undefined &&
        params["filter_dateFrom"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_dateFrom = params["filter_dateFrom"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_dateTo"] != undefined &&
        params["filter_dateTo"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_dateTo = params["filter_dateTo"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_homeAway"] != undefined &&
        params["filter_homeAway"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_homeAway = params["filter_homeAway"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_matchState"] != undefined &&
        params["filter_matchState"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_matchState = params["filter_matchState"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_minutes_from"] != undefined &&
        params["filter_minutes_from"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_minutes_from = parseInt(params["filter_minutes_from"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_minutes_to"] != undefined &&
        params["filter_minutes_to"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_minutes_to = parseInt(params["filter_minutes_to"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_opponents"] != undefined &&
        params["filter_opponents"] != "undefined"
      ) {
        this.more_filters = true;

        this.filter_opponents = params["filter_opponents"].split(",");

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_playerId_select1"] != undefined &&
        params["filter_playerId_select1"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_playerId_select1 = params["filter_playerId_select1"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_playerId_select2"] != undefined &&
        params["filter_playerId_select2"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_playerId_select2 = params["filter_playerId_select2"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_playerId_select3"] != undefined &&
        params["filter_playerId_select3"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_playerId_select3 = params["filter_playerId_select3"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_playerId_select4"] != undefined &&
        params["filter_playerId_select4"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_playerId_select4 = params["filter_playerId_select4"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_playerId_select5"] != undefined &&
        params["filter_playerId_select5"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_playerId_select5 = params["filter_playerId_select5"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_playerId_select6"] != undefined &&
        params["filter_playerId_select6"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_playerId_select6 = params["filter_playerId_select6"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_situationType"] != undefined &&
        params["filter_situationType"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_situationType = params["filter_situationType"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_situationTime"] != undefined &&
        params["filter_situationTime"] != "undefined"
      ) {
        this.more_filters = true;
        this.filter_situationTime = parseInt(params["filter_situationTime"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["selected_attributes"] != undefined &&
        params["selected_attributes"] != "undefined"
      ) {
        this.more_filters = true;
        this.selected_attributes_string = params["selected_attributes"];
        //alert(JSON.stringify(this.table_settings) + "   " + this.selected_attributes_string);

        let parameter_attributes = this.selected_attributes_string.split(",");

        let loaded_attributes = [];
        let attributes = JSON.parse(localStorage.getItem("loaded_attributes"));

        if (this.gamelog_type_goalkeepers) {
          for (let item in attributes["goalkeepersData"][0]) {
            attributes["goalkeepersData"][0][item][0]["attributes"].forEach(
              (item, index) => {
                loaded_attributes.push(item);
              }
            );
          }
        } else {
          for (let item in attributes["individual"][0]) {
            attributes["individual"][0][item][0]["attributes"].forEach(
              (item, index) => {
                loaded_attributes.push(item);
              }
            );
          }

          for (let item in attributes["onIce"][0]) {
            attributes["onIce"][0][item][0]["attributes"].forEach(
              (item, index) => {
                loaded_attributes.push(item);
              }
            );
          }

          for (let item in attributes["teamsData"][0]) {
            attributes["teamsData"][0][item][0]["attributes"].forEach(
              (item, index) => {
                loaded_attributes.push(item);
              }
            );
          }
        }

        let new_r = [];
        let new_o = [];
        let new_f = [];

        loaded_attributes.forEach((item) => {
          const attribute = {
            name: "R_" + item["name"],
            type: "r_" + item["type"],
            colour: item["colour"],
            eng: item["eng"],
            desc: item["desc"],
            data: item["data"],
          };
          new_r.push(attribute);
        });

        loaded_attributes.forEach((item) => {
          const attribute = {
            name: "O_" + item["name"],
            type: "o_" + item["type"],
            colour: item["colour"],
            eng: item["eng"],
            desc: item["desc"],
            data: item["data"],
          };
          new_o.push(attribute);
        });

        loaded_attributes.forEach((item) => {
          const attribute = {
            name: "F_" + item["name"],
            type: "f_" + item["type"],
            colour: item["colour"],
            eng: item["eng"],
            desc: item["desc"],
            data: item["data"],
          };
          new_f.push(attribute);
        });

        new_r.forEach((item) => {
          loaded_attributes.push(item);
        });
        new_o.forEach((item) => {
          loaded_attributes.push(item);
        });
        new_f.forEach((item) => {
          loaded_attributes.push(item);
        });

        this.table_settings = [];
        parameter_attributes.forEach((item) => {
          loaded_attributes.forEach((element) => {
            if (element["type"] == item) {
              this.table_settings.push({
                type: element["type"],
                name: element["name"],
                colour: element["colour"],
              });
            }
          });
        });

        //
        parameters_exists_reload_data = true;
      }

      if (parameters_exists_reload_data == true) {
        this.table_settings = this.table_settings.reduce((unique, o) => {
          if (!unique.some((obj) => obj.type === o.type)) {
            unique.push(o);
          }
          return unique;
        }, []);

        this.loadData();
      }
    });
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

  getAttributeColour(type: string) {
    let colour = "no-colour";
    let attributes = JSON.parse(localStorage.getItem("loaded_attributes"));

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
        attributes["individual"][0][item][0]["attributes"].forEach(
          (item, index) => {
            if (item["type"] == type) {
              colour = item["colour"];
            }
          }
        );
      }

      for (let item in attributes["onIce"][0]) {
        //console.log(JSON.stringify());
        attributes["onIce"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            colour = item["colour"];
          }
        });
      }

      for (let item in attributes["teamsData"][0]) {
        //console.log(JSON.stringify());
        attributes["teamsData"][0][item][0]["attributes"].forEach(
          (item, index) => {
            if (item["type"] == type) {
              colour = item["colour"];
            }
          }
        );
      }

      for (let item in attributes["goalkeepersData"][0]) {
        //console.log(JSON.stringify());
        attributes["goalkeepersData"][0][item][0]["attributes"].forEach(
          (item, index) => {
            if (item["type"] == type) {
              colour = item["colour"];
            }
          }
        );
      }
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
      } else if (type.startsWith("f_")) {
        type = type.substring(2);
      } else if (type.startsWith("up_")) {
        type = type.substring(3);
      } else if (type.startsWith("np_")) {
        type = type.substring(3);
      }
    }

    let attributes = JSON.parse(localStorage.getItem("loaded_attributes"));

    for (let item in attributes["individual"][0]) {
      //console.log(JSON.stringify());
      attributes["individual"][0][item][0]["attributes"].forEach(
        (item, index) => {
          if (item["type"] == type) {
            title = item["eng"];
            desc = item["desc"];
          }
        }
      );
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

    for (let item in attributes["teamsData"][0]) {
      attributes["teamsData"][0][item][0]["attributes"].forEach(
        (item, index) => {
          if (item["type"] == type) {
            title = item["eng"];
            desc = item["desc"];
          }
        }
      );
    }

    if (show_what == 1) {
      return title;
    } else if (show_what == 2) {
      return desc;
    } else {
      return "";
    }
  }

  stringy(data: any) {
    return JSON.stringify(data);
  }

  formatSeconds(seconds: number) {
    var date = new Date(seconds * 1000);
    var hh: any = date.getUTCHours();
    var mm: any = date.getUTCMinutes();
    var ss: any = date.getSeconds();
    let mh = mm + 60 * hh;

    if (mh < 10) {
      mh = "0" + mh;
    }
    if (ss < 10) {
      ss = "0" + ss;
    }

    return mh + ":" + ss;
  }

  checkLoggedTime() {
    let dt1 = new Date(localStorage.getItem("logged_date"));
    let dt2 = new Date();
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;

    if (Math.abs(Math.round(diff)) > 6) {
      alert("Platnost relace přihlášení vypršela. Přihlaste se znovu.");
      this.defaultService.logout();
    }
  }

  downloadCSV() {
    let data = [];
    let th = ["Zapas", "TOI"];

    let th_types = ["zapas", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data.push(th);

    let row = [];

    this.data.forEach((item, index) => {
      console.log(JSON.stringify(item));

      let home_team = this.getTeamName(item["info"]["homeTeamUuid"]);
      let away_team = this.getTeamName(item["info"]["awayTeamUuid"]);
      let date = this.formatDate(item["info"]["date"]);
      let score =
        item["info"]["score"]["home"] +
        ":" +
        item["info"]["score"]["away"] +
        "" +
        this.getGameState(item["info"]["score"]["state"]);

      item["stats"]["zapas"] =
        home_team + " - " + away_team + "  " + date + "  " + score;
      row.push(item["stats"]);
    });

    row.forEach((item, index) => {
      let selected_data = [];
      th_types.forEach((item2, index2) => {
        if (item2 == "toi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "oztoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "ozposstoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "posstoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "dztoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "dzposstoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "oppdzptoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "zapas") {
          selected_data.push(String(item[item2]));
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      data.push(selected_data);
    });

    data = JSON.parse(JSON.stringify(data));

    data.forEach((item, index) => {
      data[index]["toi"] = this.formatSeconds(item["toi"]);
    });

    let json = JSON.stringify(data);
    let withStrings = JSON.parse(json, (key, val) =>
      typeof val !== "object" && val !== null ? String(val) : val
    );

    let final_data = JSON.parse(JSON.stringify(withStrings));

    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
    //new Angular5Csv(withStrings, 'individual-stats', csv_options);
  }

  formatDate(value: string): any {
    let date = new Date(value);
    return (
      Number(date.getDate()) +
      "." +
      Number(date.getMonth() + 1) +
      "." +
      Number(date.getFullYear())
    );
  }

  //TRACKING
  trackOpenPage() {
    let logged_user = JSON.parse(localStorage.getItem("logged_user"));
    this.defaultService
      .addEvent(
        logged_user[0].id,
        logged_user[0].user,
        "Byla otevřena obrazovka gamelog.",
        4
      )
      .subscribe((loaded_data) => {});
  }
}
