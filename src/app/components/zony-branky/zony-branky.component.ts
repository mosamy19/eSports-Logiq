import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService } from "../../services/default/default.service";
import { IndividualStatsService } from "../../services/individual-stats/individual-stats.service";

@Component({
  selector: "zony-branky",
  templateUrl: "./zony-branky.component.html",
  styleUrls: ["./zony-branky.component.scss"],
  providers: [DefaultService, IndividualStatsService],
})
export class ZonyBrankyComponent implements OnInit, OnChanges {
  filter_team: string = "";
  teams_list: any[] = [];
  players_list: any = [];
  filter_goalkeeper: string;

  loading: boolean = false;

  data: any = [];
  data_relativeToCompetition: any = [];

  @Input() filter_team_input: any;
  @Input() filter_seasonPart: any;
  @Input() filter_lastGames: number;
  @Input() filter_countOfPlayer: string = "5:5";
  @Input() filter_matchState: string = "";
  @Input() filter_homeAway: string = "";
  @Input() filter_opponents: any = [];
  @Input() filter_dateFrom: string;
  @Input() filter_dateTo: string;
  @Input() filter_minutes_from: number;
  @Input() filter_minutes_to: number;
  @Input() filter_minTOI: number;
  @Input() filter_situationType: string = "";
  @Input() filter_situationTime: number;

  @Input() show_skala_zony: boolean;

  /* table_settings: any[] = [
        { "type": "gabr_percent", "name": "sv.BR%", "colour": "purple" },
        { "type": "gabl_percent", "name": "sv.BL%", "colour": "purple" },
        { "type": "gaur_percent", "name": "sv.UR%", "colour": "purple" },
        { "type": "gaul_percent", "name": "sv.UL%", "colour": "purple" },
        { "type": "gafh_percent", "name": "sv.FH%", "colour": "purple" },
    ]; */

  table_settings: any[] = [
    { type: "br.sv_percent", name: "BR.Sv%", colour: "purple" },
    { type: "bl.sv_percent", name: "BL.Sv%", colour: "purple" },
    { type: "ur.sv_percent", name: "UR.Sv%", colour: "purple" },
    { type: "ul.sv_percent", name: "UL.Sv%", colour: "purple" },
    { type: "fh.sv_percent", name: "FH.Sv%", colour: "purple" },

    { type: "br.ga", name: "BR.GA", colour: "purple" },
    { type: "bl.ga", name: "BL.GA", colour: "purple" },
    { type: "ur.ga", name: "UR.GA", colour: "purple" },
    { type: "ul.ga", name: "UL.GA", colour: "purple" },
    { type: "fh.ga", name: "FH.GA", colour: "purple" },
  ];

  gabr_percent: number = 0;
  gabl_percent: number = 0;
  gaur_percent: number = 0;
  gaul_percent: number = 0;
  gafh_percent: number = 0;

  gabr: number = 0;
  gabl: number = 0;
  gaur: number = 0;
  gaul: number = 0;
  gafh: number = 0;

  gabr_percent_class: string = "st1";
  gabl_percent_class: string = "st1";
  gaur_percent_class: string = "st1";
  gaul_percent_class: string = "st1";
  gafh_percent_class: string = "st1";

  data_loaded: boolean = false;

  constructor(
    private individualStatsService: IndividualStatsService,
    private defaultService: DefaultService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.filter_seasonPart != undefined) {
      this.loadData();
    }
  }

  ngOnChanges() {}

  reloadData() {
    if (this.filter_seasonPart != undefined) {
      console.log("Loading");
      if (this.filter_goalkeeper != "" && this.filter_goalkeeper != undefined) {
        this.selectGoalkeeper();
      }
      //
    }
  }

  loadData() {
    console.log("filter_countOfPlayer", this.filter_countOfPlayer);
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
                hokejczId: player["hokejczId"],
              };
              localStorage.setItem(player["uuid"], JSON.stringify(key));
            });

            //load team player list
            var index: any = this.teams_list.findIndex(
              (x) => x.uuid == team["uuid"]
            );
            if (index === -1) {
              if (this.filter_team_input == "ALL") {
                this.teams_list.push({
                  uuid: team["uuid"],
                  name: team["name"],
                  shortName: team["shortName"],
                  shortcut: team["shortcut"],
                  team: team["uuid"],
                  players: "",
                });
              } else {
                if (team["uuid"] == this.filter_team_input) {
                  this.teams_list.push({
                    uuid: team["uuid"],
                    name: team["name"],
                    shortName: team["shortName"],
                    shortcut: team["shortcut"],
                    team: team["uuid"],
                    players: "",
                  });
                }
              }
            } else console.log("object already exists");
          });
        }
      });
    });
  }

  getPlayerList() {
    this.players_list = [];
    this.filter_goalkeeper = "";
    this.data_loaded = false;

    this.gabr_percent_class = "st1";
    this.gabl_percent_class = "st1";
    this.gaur_percent_class = "st1";
    this.gaul_percent_class = "st1";
    this.gafh_percent_class = "st1";

    let uuids = this.filter_seasonPart.split(",");
    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(
        localStorage.getItem("competition_details")
      );
      competition_details.forEach((loaded_data, index) => {
        if (typeof loaded_data[item] != "undefined") {
          loaded_data[item]["teams"].forEach((team, index) => {
            if (team["uuid"] == this.filter_team) {
              team["players"].forEach((player, index) => {
                var index: any = this.players_list.findIndex(
                  (x) => x.uuid == player["uuid"]
                );
                if (index === -1) {
                  player["short_name"] =
                    player["surname"] + " " + player["name"][0] + ".";
                  if (player.position == "GK") {
                    this.players_list.push(player);
                  }
                } else console.log("object already exists");
              });
            }
          });
        }
      });
    });
    //this.players_list.sort(this.sortBy('surname', false));
  }

  selectGoalkeeper() {
    this.loading = true;

    this.data = [];

    this.individualStatsService
      .getIndividualStatsGoalkeepers(
        this.filter_seasonPart,
        this.filter_team_input,
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
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings,
        undefined,
        undefined
      )
      .subscribe(
        (loaded_data) => {
          if (this.filter_team_input == "ALL") {
            //alert("ALL nejde teď");

            loaded_data.forEach((item, index) => {
              if (item["team"] == this.filter_team) {
                item["players"].forEach((item2) => {
                  if (item2["player"] == this.filter_goalkeeper) {
                    this.data.push(item2["stats"]);
                  }
                });
              }
            });
            console.log("DATA", this.data);

            if (this.data.length == 0) {
              alert(
                "K tomuto brankáři na základě vybraných filtrů neexistují žádná data."
              );
              this.filter_team = "";
              this.filter_goalkeeper = "";
              this.players_list = [];
              this.data_loaded = false;
              this.loading = false;
              this.gabr_percent_class = "st1";
              this.gabl_percent_class = "st1";
              this.gaur_percent_class = "st1";
              this.gaul_percent_class = "st1";
              this.gafh_percent_class = "st1";

              this.loadData();
            }
            this.gabr_percent = this.data[0]["br.sv_percent"];
            this.gabl_percent = this.data[0]["bl.sv_percent"];
            this.gaur_percent = this.data[0]["ur.sv_percent"];
            this.gaul_percent = this.data[0]["ul.sv_percent"];
            this.gafh_percent = this.data[0]["fh.sv_percent"];

            this.gabr = this.data[0]["br.ga"];
            this.gabl = this.data[0]["bl.ga"];
            this.gaur = this.data[0]["ur.ga"];
            this.gaul = this.data[0]["ul.ga"];
            this.gafh = this.data[0]["fh.ga"];
          } else {
            loaded_data.forEach((item, index) => {
              if (item["player"] == this.filter_goalkeeper) {
                this.data.push(item["stats"]);
              }
            });

            if (this.data.length == 0) {
              alert(
                "K tomuto brankáři na základě vybraných filtrů neexistují žádná data."
              );
              this.filter_team = "";
              this.filter_goalkeeper = "";
              this.players_list = [];
              this.data_loaded = false;
              this.loading = false;
              this.gabr_percent_class = "st1";
              this.gabl_percent_class = "st1";
              this.gaur_percent_class = "st1";
              this.gaul_percent_class = "st1";
              this.gafh_percent_class = "st1";

              this.loadData();
            }
            console.log("DATA", this.data);
            this.gabr_percent = this.data[0]["br.sv_percent"];
            this.gabl_percent = this.data[0]["bl.sv_percent"];
            this.gaur_percent = this.data[0]["ur.sv_percent"];
            this.gaul_percent = this.data[0]["ul.sv_percent"];
            this.gafh_percent = this.data[0]["fh.sv_percent"];
            this.gabr = this.data[0]["br.ga"];
            this.gabl = this.data[0]["bl.ga"];
            this.gaur = this.data[0]["ur.ga"];
            this.gaul = this.data[0]["ul.ga"];
            this.gafh = this.data[0]["fh.ga"];
          }

          this.data_relativeToCompetition = [];

          this.individualStatsService
            .getGoalkeepersStatsRelativeTo(
              this.filter_seasonPart,
              this.filter_team_input,
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
              this.filter_situationType,
              this.filter_situationTime,
              "competition",
              this.table_settings
            )
            .subscribe(
              (loaded_data) => {
                if (this.filter_team_input == "ALL") {
                  //alert("ALL nejde teď");
                  loaded_data.forEach((item, index) => {
                    if (item["team"] == this.filter_team) {
                      item["players"].forEach((item2) => {
                        if (item2["player"] == this.filter_goalkeeper) {
                          this.data_relativeToCompetition.push(item2["stats"]);
                        }
                      });
                    }
                  });

                  //console.log(JSON.stringify(this.data_relativeToCompetition));

                  this.gabr_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["br.sv_percent"] / 10
                    ).toFixed();
                  this.gabl_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["bl.sv_percent"] / 10
                    ).toFixed();
                  this.gaur_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["ur.sv_percent"] / 10
                    ).toFixed();
                  this.gaul_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["ul.sv_percent"] / 10
                    ).toFixed();
                  this.gafh_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["fh.sv_percent"] / 10
                    ).toFixed();

                  //alert(JSON.stringify(this.gabr_percent_class));
                  console.log(
                    "data_relativeToCompetition",
                    this.data_relativeToCompetition
                  );
                  console.log("gabr_percent_class", this.gabr_percent_class);
                  console.log("gabl_percent_class", this.gabl_percent_class);
                  console.log("gaur_percent_class", this.gaur_percent_class);
                  console.log("gaul_percent_class", this.gaul_percent_class);
                  console.log("gafh_percent_class", this.gafh_percent_class);

                  this.data_loaded = true;
                  this.loading = false;
                } else {
                  loaded_data.forEach((item, index) => {
                    if (item["player"] == this.filter_goalkeeper) {
                      this.data_relativeToCompetition.push(item["stats"]);
                    }
                  });

                  //console.log(JSON.stringify(this.data_relativeToCompetition));

                  this.gabr_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["br.sv_percent"] / 10
                    ).toFixed();
                  this.gabl_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["bl.sv_percent"] / 10
                    ).toFixed();
                  this.gaur_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["ur.sv_percent"] / 10
                    ).toFixed();
                  this.gaul_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["ul.sv_percent"] / 10
                    ).toFixed();
                  this.gafh_percent_class =
                    "cell-" +
                    Number(
                      this.data_relativeToCompetition[0]["fh.sv_percent"] / 10
                    ).toFixed();

                  //alert(JSON.stringify(this.gabr_percent_class));
                  console.log(
                    "data_relativeToCompetition",
                    this.data_relativeToCompetition
                  );
                  console.log("gabr_percent_class", this.gabr_percent_class);
                  console.log("gabl_percent_class", this.gabl_percent_class);
                  console.log("gaur_percent_class", this.gaur_percent_class);
                  console.log("gaul_percent_class", this.gaul_percent_class);
                  console.log("gafh_percent_class", this.gafh_percent_class);

                  this.data_loaded = true;
                  this.loading = false;
                }
              },
              (err) => {
                //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                //this.defaultService.logout();
                //window.location.reload();
              }
            );
        },
        (err) => {
          this.loading = false;
          alert(
            "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
          //this.defaultService.logout();
          //window.location.reload();
        }
      );
  }
}
