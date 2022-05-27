import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService } from "../../services/default/default.service";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslatePipe } from "../../pipes/translate.pipe";

import { GamesService } from "../../services/games/games.service";
import { FormationsAnalysisService } from "../../services/formations-analysis/formations-analysis.service";

@Component({
  selector: "heatmap",
  templateUrl: "./heatmap.component.html",
  styleUrls: ["./heatmap.component.scss"],
  providers: [
    FormationsAnalysisService,
    DefaultService,
    GamesService,
    TranslatePipe,
  ],
})
export class HeatMapComponent implements OnInit {
  @Output() onInvertChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() shots_team: boolean = false;
  @Input() teams_list_input: any = [];
  @Input() players: any = [];
  @Input() shots: any = [];
  @Input() gameslist: any = [];
  @Input() filter_seasonPart: string = "";
  @Input() filter_team: string = "";
  @Input() filter_dateFrom: string = "";
  @Input() filter_dateTo: string = "";
  @Input() filter_lastGames: number;
  @Input() filter_situationType: string = "";
  @Input() filter_situationTime: number;
  @Input() filter_countOfPlayer: string = "5:5";
  @Input() filter_matchState: string = "";
  @Input() filter_homeAway: string = "";
  @Input() filter_minutes_from: number;
  @Input() filter_minutes_to: number;
  @Input() filter_opponents: any = [];
  @Input() filter_minTOI: number;
  @Input() toi: any[];
  @Input() xG: number;
  @Input() g: number;

  teams_list:any = [];
  show_mask: boolean = false;

  shotmapInfobarOpen: boolean = false;

  main_games_select: string = "ALL";
  games: any = [];
  players_list: any = [];
  render_pro_proti: string = "PRO";

  invert: boolean = true;

  games_list_loading: boolean = true;

  porovnat_s: string = "league";
  zapojeni_hrace: string = "on-ice";
  kategorie_strel: string = "cf60";

  circles : any;

  shot_type: string = "";

  heatmap_loading: boolean = false;

  heatmap_pro_url: string = "/assets/hriste_760x582@2x.png";
  heatmap_proti_url: string = "/assets/hriste_760x582@2x.png";
  heatmap_hrac_url: string = "/assets/hriste_760x582@2x.png";
  heatpro_data: any = [];
  heatproti_data: any = [];

  nebezpecnost_strel: string = "ALL";
  action_type: string = "";
  player_enabled: boolean = false;

  constructor(
      private formationsAnalysisService: FormationsAnalysisService,
      private gamesService: GamesService,
      private translate: TranslatePipe,
      private defaultService: DefaultService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      public sanitizer: DomSanitizer,
      private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // volani v service commented, protoze pouzivame data z formations-analysis.component,
    // predavane jako @Input skrze gameslist

    console.log('shots in ngOnInit', this.shots);
    this.teams_list = this.teams_list_input;
    this.games_list_loading = false;
    var seenGames = {};
    this.gameslist = this.gameslist.filter(function (currentObject) {
      if (currentObject.match in seenGames) {
        return false;
      } else {
        seenGames[currentObject.match] = true;
        return true;
      }
    });

    this.gameslist.sort(function (a, b) {
      a = new Date(a.matchDate);
      b = new Date(b.matchDate);
      return a > b ? -1 : a < b ? 1 : 0;
    });
    setTimeout(() => this.reloadShots(), 3000);
    this.reloadPlayers();
    this.games = this.gameslist;
    this.loadHeatmap();
    // this.reloadShots();
  }

  reloadPlayers() {
    if (this.shots_team == false && this.players != undefined) {
      this.players.forEach((item, index) => {
        if (item.playerUUID != "") {
          this.players_list.push({
            uuid: item.playerUUID,
            enabled: item.enabled,
          });
        }
      });
    }

    this.player_enabled = false;
    this.players_list.forEach((item) => {
      if (item.enabled == true) {
        this.player_enabled = true;
      }
    });
  }

  invertChanged(invert: boolean) {
    this.onInvertChanged.emit(invert);
  }

  getCustomToi(match: string): number{
    let toi;
    this.toi.forEach( item => {
      if(item.match == match){
        toi = item.toi;
      }
    });
    return toi;
  }

  getAllToi(){
    let count = 0
    this.games.forEach( item1 => {
      this.toi.forEach(item2 => {
        if(item1.match == item2.match && item1.active == true){
          count = count + item2.toi;
        }
      });
    });

    return count;
  }

  mainGamesSelect(selected: string) {
    this.main_games_select = selected;
    if (selected == "ALL") {
      this.games.forEach((item, index) => {
        this.games[index]["active"] = true;
      });
    } else {
      this.games.forEach((item, index) => {
        this.games[index]["active"] = false;
      });
    }
    this.reloadShots();
  }

  checkAllGamesSelected() {
    let foundNoActive = false;
    this.games.forEach((item) => {
      if (item.active === false) {
        foundNoActive = true;
      }
    });
    if (foundNoActive) {
      return true;
    } else {
      return false;
    }
  }

  renderAssistProProti(selected: string) {
    this.render_pro_proti = selected;
    this.main_games_select = "ALL";
    this.show_mask = false;

    this.heatmap_pro_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_proti_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_hrac_url = "/assets/hriste_760x582@2x.png";

    if (selected === "HRAC") {
      this.zapojeni_hrace = "individual";
    } else if (selected === "PRO") {
      this.zapojeni_hrace = "on-ice";
    } else if (selected === "PROTI") {
      this.zapojeni_hrace = "on-ice";
    }

    this.reloadShots();
  }

  getTeamNameShortcut(uuid: string) {
    let team_name = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        team_name = item["shortcut"];
      }
    });

    if (team_name == "") {
      team_name = uuid;
    }

    return team_name;
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

  reloadShots(){
    console.log('shots in reloadShots', this.shots);
    let filtered_shots = [];

    if(this.render_pro_proti == "HRAC" || this.render_pro_proti == "PRO" ){
      filtered_shots = this.shots.for;
    }else if(this.render_pro_proti == "PROTI"){
      filtered_shots = this.shots.against;
    }

    console.log('Filtered Shots BEFORE: ', filtered_shots);

    filtered_shots = this.filterGameShots(filtered_shots);
    filtered_shots = this.filterShotCategory(filtered_shots);
    filtered_shots = this.filterShotDanger(filtered_shots);
    filtered_shots = this.filterShotType(filtered_shots);

    console.log("Filtered Shots: ", filtered_shots);

    this.circles = filtered_shots;
    //For xG & Goals of Shots
    let xG = 0;
    let g = 0;
    filtered_shots.forEach(shot => {
      if(shot.xG != ""){
        xG = xG + Number(shot.xG)
      }
      if(shot.type == "G"){
        g = g + 1;
      }
    });
    this.xG = Math.round((xG + Number.EPSILON) * 100) / 100;
    this.g = g;
    this.cd.detectChanges();
  }

  //Seting Up Filters For Shots
  setShotCategory(type:string){
    this.kategorie_strel = type;
    this.reloadShots();
  }

  setShotDanger(type:string){
    this.nebezpecnost_strel = type;
    this.reloadShots();
  }

  setActionType(type: string) {
    this.action_type = type;
    this.reloadShots();
  }

  //Filters for shots

  //Filter for selected matches
  filterGameShots(shots:any[]) {
    let filtered_shots = [];
    if (shots !== undefined && shots.length > 0) {
      shots.forEach(shot => {
        this.games.forEach((game) => {
          if (game.active == true && game.match == shot.match) {
            filtered_shots.push(shot);
          }
        });
      });
    }
    return filtered_shots;
  }

  //filter for selected shot category
  filterShotCategory(shots:any[]){
    if(this.kategorie_strel == 'cf60'){
      return shots;

    }else if(this.kategorie_strel == 'sogf60'){
      let filtered_shots = [];
      shots.forEach( shot => {
        if(shot.netZone != null){
          filtered_shots.push(shot)
        }
      })
      return filtered_shots;

    }else if(this.kategorie_strel == 'gf60'){
      let filtered_shots = [];
      shots.forEach(shot => {
        if(shot.type == "G"){
          filtered_shots.push(shot)
        }
      });
      return filtered_shots;
    }
  }

  //Filter for selected shot dabger
  filterShotDanger(shots:any[]){
    if(this.nebezpecnost_strel == "ALL"){
      return shots;
    }else{
      let filtered_shots = [];
      shots.forEach(shot => {
        if(this.nebezpecnost_strel == shot.shotDanger){
          filtered_shots.push(shot);
        }
      })
      return filtered_shots;
    }
  }

  //Filter for selected shot type
  filterShotType(shots:any[]){
    console.log("Shots", shots)
    if(this.action_type == ''){
      return shots;

    }else if (this.action_type == 'f.'){
      let filtered_shots = [];
      shots.forEach(shot => {
        if(shot.forecheck){
          filtered_shots.push(shot);
        }
      });
      return filtered_shots;

    }else if(this.action_type == 'r.'){
      let filtered_shots = [];
      shots.forEach(shot => {
        if(shot.rush){
          filtered_shots.push(shot);
        }
      });
      return filtered_shots;

    }else if(this.action_type == 'o.'){
      let filtered_shots = [];
      shots.forEach(shot => {
        if(shot.rush){
          filtered_shots.push(shot);
        }
      });
      return filtered_shots;

    }else if(this.action_type == 'l.'){
      let filtered_shots = [];
      shots.forEach(shot => {
        if(shot.long){
          filtered_shots.push(shot);
        }
      });
      return filtered_shots;

    }else if(this.action_type == 'a.'){
      let filtered_shots = [];
      shots.forEach(shot => {
        if(shot.afterFO){
          filtered_shots.push(shot);
        }
      });
      return filtered_shots;

    }
  }

  //Filters for shots End

  toggleGame(id: number) {
    this.main_games_select = "SELECTED";

    this.games.forEach((item, index) => {
      if (item.id == id) {
        if (item.active == true) {
          this.games[index]["active"] = false;
        } else {
          this.games[index]["active"] = true;
        }
      }
    });

    this.reloadShots();
  }

  togglePlayer(uuid: string) {
    let new_players_list = [];
    this.players_list.forEach((item, index) => {
      if (item.uuid == uuid) {
        if (item.enabled == true) {
          item["enabled"] = false;
          new_players_list.push(item);
        } else if (item.enabled == false) {
          item["enabled"] = true;
          new_players_list.push(item);
        }
      } else {
        new_players_list.push(item);
      }
    });

    this.players_list = new_players_list;
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

  porovnatS(type: string) {
    if (this.porovnat_s == type) {
      this.porovnat_s = "";
    } else {
      this.porovnat_s = type;
    }

    if(this.porovnat_s == "chance"){
      this.kategorie_strel = "gfxgf60";
    }else{
      this.kategorie_strel = "cf60";
      this.setActionType('');
    }
  }

  loadHeatmap() {
    this.heatmap_loading = true;
    let shot_category = "";

    if (this.player_enabled == false) {
      console.log("Není vybrán hráč.");

      if (this.porovnat_s == "") {
        console.log("Neporovnává se s ničím.");

        shot_category = this.getShotCategoryHeatmap(this.kategorie_strel);
        this.loadHeatmapOfTeam(shot_category);
      } else if (this.porovnat_s == "league") {
        console.log("Porovnává se s průměrem ligy.");

        shot_category = this.getShotCategoryHeatmap(this.kategorie_strel);
        console.log("Kategorie strel", shot_category)

        this.loadHeatmapOfTeamRelativeToLeague(shot_category);
      } else if(this.porovnat_s == "chance"){
        console.log("Porovnává se proměnování šancí.");

        shot_category = "gfxgf60";
        //this.kategorie_strel = "gfxgf60";
        this.loadHeatmapOfTeamRelativeToLeague(shot_category);
      }
    } else {
      console.log("Je vybrán aspoň jeden hráč.");

      if (this.zapojeni_hrace == "individual") {
        //console.log("Je vybrán individual režim");

        shot_category = this.getShotCategoryHeatmap(this.kategorie_strel);
        this.loadIndividualHeatmap(shot_category);
      } else if (this.zapojeni_hrace == "on-ice") {
        //console.log("Je vybrán on-ice režim");

        if (this.porovnat_s == "") {
          //console.log("Neporovnává se s ničím.");

          shot_category = this.getShotCategoryHeatmap(this.kategorie_strel);
          this.loadHeatmapOfFormation(shot_category);
        } else if (this.porovnat_s == "league") {
          //console.log("Porovnává se s průměrem ligy.");

          shot_category = this.getShotCategoryHeatmap(this.kategorie_strel);
          this.loadHeatmapOfFormationRelativeToLeague(shot_category);
        } else if (this.porovnat_s == "team") {
          //console.log("Porovnává se s průměrem týmu.");

          shot_category = this.getShotCategoryHeatmap(this.kategorie_strel);
          this.loadHeatmapOfFormationRelativeToTeam(shot_category);
        }else if(this.porovnat_s == "chance"){

          /* shot_category = this.getShotCategoryHeatmap(this.kategorie_strel); */
          shot_category = "gfxgf60";
          //this.kategorie_strel = "gfxgf60";
          this.loadHeatmapOfTeamRelativeToLeague(shot_category);
        }
      }
    }
    this.cd.detectChanges();
    this.reloadShots();
  }

  loadHeatmapOfFormation(shot_category: string) {
    //alert("loadHeatmapOfFormation");

    this.heatmap_pro_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_proti_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_hrac_url = "/assets/hriste_760x582@2x.png";

    this.heatpro_data = [];
    this.heatproti_data = [];

    let player1_id = "";
    let player2_id = "";
    let player3_id = "";
    let player4_id = "";
    let player5_id = "";
    let player6_id = "";

    let player1_state = "";
    let player2_state = "";
    let player3_state = "";
    let player4_state = "";
    let player5_state = "";
    let player6_state = "";

    this.players_list.forEach((item, index) => {
      if (index == 0) {
        player1_id = item.uuid;
        if (item.enabled == true) {
          player1_state = "on";
        }
      } else if (index == 1) {
        player2_id = item.uuid;
        if (item.enabled == true) {
          player2_state = "on";
        }
      } else if (index == 2) {
        player3_id = item.uuid;
        if (item.enabled == true) {
          player3_state = "on";
        }
      } else if (index == 3) {
        player4_id = item.uuid;
        if (item.enabled == true) {
          player4_state = "on";
        }
      } else if (index == 4) {
        player5_id = item.uuid;
        if (item.enabled == true) {
          player5_state = "on";
        }
      } else if (index == 5) {
        player6_id = item.uuid;
        if (item.enabled == true) {
          player6_state = "on";
        }
      }
    });

    let enabled_matches_list = [];
    this.games.forEach((item) => {
      if (item.active) {
        enabled_matches_list.push(item.match);
      }
    });

    this.formationsAnalysisService
    .getHeatmapOfFormation(
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
        player1_id,
        player2_id,
        player3_id,
        player4_id,
        player5_id,
        player6_id,
        player1_state,
        player2_state,
        player3_state,
        player4_state,
        player5_state,
        player6_state,
        this.filter_situationType,
        this.filter_situationTime,
        enabled_matches_list,
        this.nebezpecnost_strel
    )
    .subscribe(
        (loaded_data) => {
          this.heatmap_loading = true;

          this.heatpro_data = [];

          let shots_1 = [];
          let shots_2 = [];

          loaded_data["for"].forEach((item, index) => {
            let shot_z = item["z"][shot_category];
            this.heatpro_data.push([item["x"], item["y"], shot_z]);
          });
          this.formationsAnalysisService
          .getNormalHeatmapImage(this.heatpro_data)
          .subscribe((loaded_data) => {
            this.heatmap_pro_url = loaded_data["url"];
            this.heatmap_hrac_url = loaded_data["url"];
            console.log("heatmap_pro_url",this.heatmap_pro_url);
            this.heatmap_loading = false;
            this.show_mask = true;
          });

          this.heatmap_loading = true;
          this.heatproti_data = [];
          loaded_data["against"].forEach((item, index) => {
            let shot_z = item["z"][shot_category];
            this.heatproti_data.push([item["x"], item["y"], shot_z]);
          });
          this.formationsAnalysisService
          .getNormalHeatmapImage(this.heatproti_data)
          .subscribe((loaded_data) => {
            this.heatmap_proti_url = loaded_data["url"];
            this.heatmap_loading = false;
            this.show_mask = true;
          });
        },
        (err) => {
          alert(
              "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
          //this.defaultService.logout();
        }
    );
  }

  loadHeatmapOfTeam(shot_category: string) {
    //alert("loadHeatmapOfTeam");
    this.heatmap_pro_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_proti_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_hrac_url = "/assets/hriste_760x582@2x.png";

    this.heatpro_data = [];
    this.heatproti_data = [];

    let enabled_matches_list = [];
    this.games.forEach((item) => {
      if (item.active) {
        enabled_matches_list.push(item.match);
      }
    });

    this.formationsAnalysisService
    .getHeatmapOfTeam(
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
        this.filter_situationType,
        this.filter_situationTime,
        enabled_matches_list,
        this.nebezpecnost_strel
    )
    .subscribe(
        (loaded_data) => {
          this.heatpro_data = [];
          loaded_data["for"].forEach((item, index) => {
            let shot_z = item["z"][shot_category];
            this.heatpro_data.push([item["x"], item["y"], shot_z]);
          });
          this.formationsAnalysisService
          .getNormalHeatmapImage(this.heatpro_data)
          .subscribe((loaded_data) => {
            this.heatmap_pro_url = loaded_data["url"];
            this.heatmap_hrac_url = loaded_data["url"];
            console.log("heatmap_pro_url",this.heatmap_pro_url);
          });

          this.heatproti_data = [];
          loaded_data["against"].forEach((item, index) => {
            let shot_z = item["z"][shot_category];
            this.heatproti_data.push([item["x"], item["y"], shot_z]);
          });
          this.formationsAnalysisService
          .getNormalHeatmapImage(this.heatproti_data)
          .subscribe((loaded_data) => {
            this.heatmap_proti_url = loaded_data["url"];
            this.heatmap_loading = false;
            this.show_mask = true;
          });
        },
        (err) => {
          alert(
              "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
          //this.defaultService.logout();
        }
    );
  }

  loadIndividualHeatmap(shot_category: string) {
    if (shot_category == "cf60") {
      shot_category = "c60";
    } else if (shot_category == "sogf60") {
      shot_category = "sog60";
    } else if (shot_category == "gf60") {
      shot_category = "g60";
    } else if (shot_category == "ff60") {
      shot_category = "f60";
    }

    this.heatmap_pro_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_proti_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_hrac_url = "/assets/hriste_760x582@2x.png";

    this.heatpro_data = [];
    this.heatproti_data = [];

    let enabled_matches_list = [];
    this.games.forEach((item) => {
      if (item.active) {
        enabled_matches_list.push(item.match);
      }
    });

    let count_enabled = 0;
    this.players_list.forEach((item) => {
      if (item.enabled == true) {
        count_enabled = count_enabled + 1;
      }
    });

    if (count_enabled == 0) {
      alert(
          "Pro heatmapu střel samotného hráče je nutné, aby byl vybrán alespoň jeden hráč."
      );
      this.heatmap_loading = false;
    } else if (count_enabled > 1) {
      alert(
          "Pro heatmapu střel samotného hráče je nutné, aby byl vybrán pouze jeden hráč."
      );
      this.heatmap_loading = false;
    } else {
      let selected_player = "";
      this.players_list.forEach((item) => {
        if (item.enabled == true) {
          selected_player = item.uuid;
        }
      });

      this.formationsAnalysisService
      .getIndividualHeatmap(
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
          selected_player,
          this.filter_situationType,
          this.filter_situationTime,
          enabled_matches_list,
          this.nebezpecnost_strel
      )
      .subscribe(
          (loaded_data) => {
            this.heatpro_data = [];
            loaded_data["for"].forEach((item, index) => {
              let shot_z = item["z"][shot_category];
              this.heatpro_data.push([item["x"], item["y"], shot_z]);
            });
            this.formationsAnalysisService
            .getNormalHeatmapImage(this.heatpro_data)
            .subscribe((loaded_data) => {
              this.heatmap_pro_url = loaded_data["url"];
              this.heatmap_hrac_url = loaded_data["url"];
              console.log("heatmap_pro_url",this.heatmap_pro_url);
            });

            this.heatproti_data = [];
            loaded_data["against"].forEach((item, index) => {
              let shot_z = item["z"][shot_category];
              this.heatproti_data.push([item["x"], item["y"], shot_z]);
            });
            this.formationsAnalysisService
            .getNormalHeatmapImage(this.heatproti_data)
            .subscribe((loaded_data) => {
              this.heatmap_proti_url = loaded_data["url"];
              this.heatmap_loading = false;
              this.show_mask = true;
            });
          },
          (err) => {
            alert(
                "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
            );
            //this.defaultService.logout();
          }
      );
    }
  }

  loadHeatmapOfTeamRelativeToLeague(shot_category: string) {
    //alert("loadHeatmapOfTeamRelativeToLeague");

    this.heatmap_pro_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_proti_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_hrac_url = "/assets/hriste_760x582@2x.png";

    this.heatpro_data = [];
    this.heatproti_data = [];

    let enabled_matches_list = [];
    this.games.forEach((item) => {
      if (item.active) {
        enabled_matches_list.push(item.match);
      }
    });


    this.formationsAnalysisService
    .getHeatmapOfTeamRelativeToLeague(
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
        this.filter_situationType,
        this.filter_situationTime,
        enabled_matches_list,
        this.nebezpecnost_strel
    )
    .subscribe(
        (loaded_data) => {
          //console.log("kozlo   " + JSON.stringify(loaded_data));
          this.heatpro_data = [];
          console.log("SHOT CATEGORY", shot_category)
          console.log("THIS KATEGORIE STRIEL", this.kategorie_strel)
          loaded_data["for"].forEach((item, index) => {
            let shot_z = item["z"][shot_category];
            this.heatpro_data.push([item["x"], item["y"], shot_z]);
          });
          /* console.log("Loaded_data Heatmap", loaded_data);
          console.log("kategorie_strel", this.kategorie_strel); */

          if(this.porovnat_s == "chance"){
            this.formationsAnalysisService
            .getChanceHeatmapImage(loaded_data["for"], this.action_type + this.kategorie_strel)
            .subscribe((loaded_data) => {
              this.heatmap_pro_url = loaded_data["url"];
              this.heatmap_hrac_url = loaded_data["url"];
              console.log("heatmap_pro_url",this.heatmap_pro_url);
            });

            this.heatproti_data = [];
            loaded_data["against"].forEach((item, index) => {
              let shot_z = item["z"][shot_category];
              this.heatproti_data.push([item["x"], item["y"], shot_z]);
            });
            this.formationsAnalysisService
            .getChanceHeatmapImage(
                loaded_data["against"],
                this.kategorie_strel
            )
            .subscribe((loaded_data) => {
              this.heatmap_proti_url = loaded_data["url"];
              this.heatmap_loading = false;
              this.show_mask = true;
            });
          }else{
            this.formationsAnalysisService
            .getRelativeHeatmapImage(loaded_data["for"], this.action_type + this.kategorie_strel)
            .subscribe((loaded_data) => {
              this.heatmap_pro_url = loaded_data["url"];
              this.heatmap_hrac_url = loaded_data["url"];
              console.log("heatmap_pro_url",this.heatmap_pro_url);
            });
            console.log("LOADED DATA", loaded_data)
            this.heatproti_data = [];
            loaded_data["against"].forEach((item, index) => {
              let shot_z = item["z"][shot_category];
              this.heatproti_data.push([item["x"], item["y"], shot_z]);
            });
            this.formationsAnalysisService
            .getRelativeHeatmapImage(
                loaded_data["against"],
                this.kategorie_strel
            )
            .subscribe((loaded_data) => {
              this.heatmap_proti_url = loaded_data["url"];
              this.heatmap_loading = false;
              this.show_mask = true;
            });
          }

        },
        (err) => {
          alert(
              "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
          //this.defaultService.logout();
        }
    );
  }

  getShotsCount(type: string) {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.shotDanger === type) {
        count = count + 1;
      }
    });
    return count;
  }

  getXg(type: string) {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.shotDanger === type) {
        count = count + Number(shot.xG);
      }
    });
    if (count > 0) {
      return Math.round((count + Number.EPSILON) * 100) / 100;
    } else {
      return 0;
    }
  }

  getGoalsCount(type: string) {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.shotDanger === type && shot.type == "G") {
        count = count + 1;
      }
    });
    return count;
  }

  getAllGoals() {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.type === "G") {
        count = count + 1;
      }
    });
    return count;
  }

  getAllXg() {
    let count = 0;
    this.circles.forEach((shot) => {
      count = count + Number(shot.xG);
    });
    if (count > 0) {
      return Math.round((count + Number.EPSILON) * 100) / 100;
    } else {
      return 0;
    }
  }

  loadHeatmapOfFormationRelativeToTeam(shot_category: string) {
    this.heatmap_pro_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_proti_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_hrac_url = "/assets/hriste_760x582@2x.png";

    this.heatpro_data = [];
    this.heatproti_data = [];

    let enabled_matches_list = [];
    this.games.forEach((item) => {
      if (item.active) {
        enabled_matches_list.push(item.match);
      }
    });


    let player1_id = "";
    let player2_id = "";
    let player3_id = "";
    let player4_id = "";
    let player5_id = "";
    let player6_id = "";

    let player1_state = "";
    let player2_state = "";
    let player3_state = "";
    let player4_state = "";
    let player5_state = "";
    let player6_state = "";

    this.players_list.forEach((item, index) => {
      if (index == 0) {
        player1_id = item.uuid;
        if (item.enabled == true) {
          player1_state = "on";
        }
      } else if (index == 1) {
        player2_id = item.uuid;
        if (item.enabled == true) {
          player2_state = "on";
        }
      } else if (index == 2) {
        player3_id = item.uuid;
        if (item.enabled == true) {
          player3_state = "on";
        }
      } else if (index == 3) {
        player4_id = item.uuid;
        if (item.enabled == true) {
          player4_state = "on";
        }
      } else if (index == 4) {
        player5_id = item.uuid;
        if (item.enabled == true) {
          player5_state = "on";
        }
      } else if (index == 5) {
        player6_id = item.uuid;
        if (item.enabled == true) {
          player6_state = "on";
        }
      }
    });

    this.formationsAnalysisService
    .getHeatmapOfFormationRelativeToTeam(
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
        player1_id,
        player2_id,
        player3_id,
        player4_id,
        player5_id,
        player6_id,
        player1_state,
        player2_state,
        player3_state,
        player4_state,
        player5_state,
        player6_state,
        this.filter_situationType,
        this.filter_situationTime,
        enabled_matches_list,
        this.nebezpecnost_strel
    )
    .subscribe(
        (loaded_data) => {
          //console.log(JSON.stringify(loaded_data));

          this.heatpro_data = [];
          loaded_data["for"].forEach((item, index) => {
            let shot_z = item["z"][shot_category];
            this.heatpro_data.push([item["x"], item["y"], shot_z]);
          });
          this.formationsAnalysisService
          .getRelativeHeatmapImage(loaded_data["for"], this.kategorie_strel)
          .subscribe((loaded_data) => {
            //alert(JSON.stringify(loaded_data));
            this.heatmap_pro_url = loaded_data["url"];
            this.heatmap_hrac_url = loaded_data["url"];
            console.log("heatmap_pro_url",this.heatmap_pro_url);
          });

          this.heatproti_data = [];
          loaded_data["against"].forEach((item, index) => {
            let shot_z = item["z"][shot_category];
            this.heatproti_data.push([item["x"], item["y"], shot_z]);
          });
          this.formationsAnalysisService
          .getRelativeHeatmapImage(
              loaded_data["against"],
              this.kategorie_strel
          )
          .subscribe((loaded_data) => {
            //alert(JSON.stringify(loaded_data));
            this.heatmap_proti_url = loaded_data["url"];
            this.heatmap_loading = false;
            this.show_mask = true;
          });
        },
        (err) => {
          alert(
              "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
          //this.defaultService.logout();
        }
    );
  }

  loadHeatmapOfFormationRelativeToLeague(shot_category: string) {
    //alert("loadHeatmapOfFormationRelativeToLeague");

    this.heatmap_pro_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_proti_url = "/assets/hriste_760x582@2x.png";
    this.heatmap_hrac_url = "/assets/hriste_760x582@2x.png";

    this.heatpro_data = [];
    this.heatproti_data = [];

    let enabled_matches_list = [];
    this.games.forEach((item) => {
      if (item.active) {
        enabled_matches_list.push(item.match);
      }
    });


    let player1_id = "";
    let player2_id = "";
    let player3_id = "";
    let player4_id = "";
    let player5_id = "";
    let player6_id = "";

    let player1_state = "";
    let player2_state = "";
    let player3_state = "";
    let player4_state = "";
    let player5_state = "";
    let player6_state = "";

    this.players_list.forEach((item, index) => {
      if (index == 0) {
        player1_id = item.uuid;
        if (item.enabled == true) {
          player1_state = "on";
        }
      } else if (index == 1) {
        player2_id = item.uuid;
        if (item.enabled == true) {
          player2_state = "on";
        }
      } else if (index == 2) {
        player3_id = item.uuid;
        if (item.enabled == true) {
          player3_state = "on";
        }
      } else if (index == 3) {
        player4_id = item.uuid;
        if (item.enabled == true) {
          player4_state = "on";
        }
      } else if (index == 4) {
        player5_id = item.uuid;
        if (item.enabled == true) {
          player5_state = "on";
        }
      } else if (index == 5) {
        player6_id = item.uuid;
        if (item.enabled == true) {
          player6_state = "on";
        }
      }
    });

    this.formationsAnalysisService
    .getHeatmapOfFormationRelativeToLeague(
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
        player1_id,
        player2_id,
        player3_id,
        player4_id,
        player5_id,
        player6_id,
        player1_state,
        player2_state,
        player3_state,
        player4_state,
        player5_state,
        player6_state,
        this.filter_situationType,
        this.filter_situationTime,
        enabled_matches_list,
        this.nebezpecnost_strel
    )
    .subscribe(
        (loaded_data) => {
          //console.log(JSON.stringify(loaded_data));

          this.heatpro_data = [];
          loaded_data["for"].forEach((item, index) => {
            let shot_z = item["z"][shot_category];
            this.heatpro_data.push([item["x"], item["y"], shot_z]);
          });
          if(this.porovnat_s == "chance"){
            this.formationsAnalysisService
            .getChanceHeatmapImage(loaded_data["for"], this.kategorie_strel)
            .subscribe((loaded_data) => {
              //alert(JSON.stringify(loaded_data));
              this.heatmap_pro_url = loaded_data["url"];
              console.log("heatmap_pro_url",this.heatmap_pro_url);
            });

            this.heatproti_data = [];
            loaded_data["against"].forEach((item, index) => {
              let shot_z = item["z"][shot_category];
              this.heatproti_data.push([item["x"], item["y"], shot_z]);
            });
            this.formationsAnalysisService
            .getChanceHeatmapImage(
                loaded_data["against"],
                this.kategorie_strel
            )
            .subscribe((loaded_data) => {
              //alert(JSON.stringify(loaded_data));
              this.heatmap_proti_url = loaded_data["url"];
              this.heatmap_loading = false;
              this.show_mask = true;
            });
          }else{
            this.formationsAnalysisService
            .getRelativeHeatmapImage(loaded_data["for"], this.kategorie_strel)
            .subscribe((loaded_data) => {
              //alert(JSON.stringify(loaded_data));
              this.heatmap_pro_url = loaded_data["url"];
              console.log("heatmap_pro_url",this.heatmap_pro_url);
            });

            this.heatproti_data = [];
            loaded_data["against"].forEach((item, index) => {
              let shot_z = item["z"][shot_category];
              this.heatproti_data.push([item["x"], item["y"], shot_z]);
            });
            this.formationsAnalysisService
            .getRelativeHeatmapImage(
                loaded_data["against"],
                this.kategorie_strel
            )
            .subscribe((loaded_data) => {
              //alert(JSON.stringify(loaded_data));
              this.heatmap_proti_url = loaded_data["url"];
              this.heatmap_loading = false;
              this.show_mask = true;
            });
          }

        },
        (err) => {
          alert(
              "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
          //this.defaultService.logout();
        }
    );
  }

  toggleShotmapInfobar() {
    if (this.shotmapInfobarOpen) {
      this.shotmapInfobarOpen = false;
    } else {
      this.shotmapInfobarOpen = true;
    }
  }

  getShotCategoryHeatmap(shoot_category: string) {
    let shoot_category_name = "";

    if (shoot_category == "gf60") {
      shoot_category_name = "gf60";
    } else if (shoot_category == "sogf60") {
      shoot_category_name = "sogf60";
    } else if (shoot_category == "cf60") {
      shoot_category_name = "cf60";
    } else if (shoot_category == "ff60") {
      shoot_category_name = "ff60";
    } else if (shoot_category == "gfxgf60") {
      shoot_category_name = "gfxgf60";
    }

    /* if (this.action_type === "") {
      shoot_category_name = shoot_category_name;
    } else if (this.action_type === "forecheck") {
      shoot_category_name = "f_" + shoot_category_name;
    } else if (this.action_type === "rush") {
      shoot_category_name = "r_" + shoot_category_name;
    } else if (this.action_type === "oddManRush") {
      shoot_category_name = "o_" + shoot_category_name;
    } */

    return shoot_category_name;
  }
}
