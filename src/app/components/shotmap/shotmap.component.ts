import { element } from 'protractor';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService } from "../../services/default/default.service";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslatePipe } from "../../pipes/translate.pipe";
import { stringify } from "@angular/core/src/render3/util";

/* import html2canvas from "html2canvas";
import { saveAs } from "file-saver"; */
import { FormationsAnalysisService } from "../../services/formations-analysis/formations-analysis.service";
import {cloneDeep} from "lodash"

@Component({
  selector: "shotmap",
  templateUrl: "./shotmap.component.html",
  styleUrls: ["./shotmap.component.scss"],
  providers: [DefaultService, TranslatePipe, FormationsAnalysisService],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShotMapComponent implements OnInit, AfterViewInit {
  @Output() onInvertChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenVideoPlayer: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenVideoPlayer2: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadShots: EventEmitter<any> = new EventEmitter();
  @Output() _downloadMap: EventEmitter<any> = new EventEmitter<any>();

  @Output() onLoadAgainst: EventEmitter<any> = new EventEmitter<any>();

  @Output() onSelectedGame: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("games_list") private games_list: ElementRef;
  graph_scroll: number = 0;
  canscrollprev: boolean = false;

  invert: boolean = true;

  shot_category: string = "SGMB";
  shot_type: string = "";
  action_type: string = "";
  puck_move: string = "";
  shot_location: string = "ALL";

  main_games_select: string = "ALL";
  render_shot_pro_proti: string = "HRAC";

  shotDangerType: string = "";

  showVideoModal: boolean = false;

  filter_zone: string = "";


  games: any = [];
  last5Games: any = [];
  last5Tois:any = [];
  circles: any = [];

  shotsLoaded: boolean = false;
  loading: boolean = false;

  selected_shot: any = [];

  //toi matches
  selected_matches: any = [];

  //video
  show_video_player: boolean = false;
  video_url: string = "";
  video_url_safe: any;
  video_orderby: string = "time";

  modal_videos: any = [];

  tooltip_x: number = 0;
  tooltip_y: number = 0;

  //video match
  show_video_player_match: boolean = false;
  video_selected_player: string = "";
  video_selected_match: any;

  players_list: any = [];

  active_video: string = "";

  circles_without_last_filter: any = [];

  render_shot_pro_type: string = "hrac";

  shotmapInfobarOpen: boolean = false;

  shot_nav: string = "typy_akce";
  teams_list: any = [];

  @Input() shots: any = [];
  @Input() players: any = [];
  @Input() shots_team: boolean = false;
  @Input() teams_list_input: any = [];
  @Input() gameslist: any = [];
  @Input() filter_team: string = "";

  @Input() filter_playerId_select1: string = "";
  @Input() filter_playerId_select2: string = "";
  @Input() filter_playerId_select3: string = "";
  @Input() filter_playerId_select4: string = "";
  @Input() filter_playerId_select5: string = "";

  @Input() pro_proti_shots: string = "PRO";

  @Input() selected_games:any = [];

  @Input() toi: any = [];
  toi2: number;

  show_only_one_shot: boolean = false;

  @ViewChild("canvas") canvas: ElementRef;
  context: CanvasRenderingContext2D;

  @ViewChild("exportpng") exportpng;
  exporting_png: boolean = false;

  shots_FULL: any = [];

  constructor(
    private formationsAnalysisService: FormationsAnalysisService,
    private translate: TranslatePipe,
    private defaultService: DefaultService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
    this.sanitizer = sanitizer;
  }

  ngOnInit() {
    this.loading = true;
    //console.log("JAJ " + JSON.stringify(this.shots));
    console.log('shots....', this.shots);
    this.teams_list = this.teams_list_input;
    console.log("Shots selected games", this.selected_games);
    if(this.selected_games.length != 0){
      this.selected_games.forEach(game => {
        this.selected_matches.push(game.match);
      });
    }
    if(this.chceckPlayersCount()){
      this.mainGamesSelect("ALL");
    }
    this.reloadPlayers();
    this.reloadGames();
  }

  ngAfterViewInit() {
    this.loading = true;
    if(this.chceckPlayersCount()){
      this.mainGamesSelect("ALL");
    }
    this.reloadPlayers();
    this.reloadGames();
    this.loading = false;
  }

  chceckPlayersCount(){
    let count = 0;
    if(this.filter_playerId_select1 != ""){
      count = count + 1;
    }
    if(this.filter_playerId_select2 != ""){
      count = count + 1;
    }
    if(this.filter_playerId_select3 != ""){
      count = count + 1;
    }
    if(this.filter_playerId_select4 != ""){
      count = count + 1;
    }
    if(this.filter_playerId_select5 != ""){
      count = count + 1;
    }
    return count >= 2
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

    if (this.shots_team) {
      this.render_shot_pro_proti = "PRO";
    }
  }

  downloadMap(){
    this._downloadMap.emit("vstupy")
  }

  reloadGames() {
    if (this.shots.hasOwnProperty("for")) {
      this.graph_scroll = 0;

      let games_list = [];

      if(this.selected_games.length == 0){
        this.gameslist.forEach((item, index) => {
          let activeGame = false;
          if (index === 0) {
            activeGame = true;
            this.selected_matches.push(item.match);
          }
          games_list.push({
            id: index,
            match: item["match"],
            homeTeam: item["homeTeam"],
            awayTeam: item["awayTeam"],
            score: item["score"],
            matchDate: item["matchDate"],
            active: activeGame,
          });
        });
      }else if(this.selected_games.length != 0){
          this.gameslist.forEach((item, index) => {
            let activeGame = false;
            games_list.push({
              id: index,
              match: item["match"],
              homeTeam: item["homeTeam"],
              awayTeam: item["awayTeam"],
              score: item["score"],
              matchDate: item["matchDate"],
              active: activeGame,
            });
          });

          console.log("games_list", games_list)
          games_list.forEach(item => {
            this.selected_matches.forEach((item2) => {
              if(item.match == item2){
                item.active = true;
              }
            });
          });
      }

      var seenGames = {};
      games_list = games_list.filter(function (currentObject) {
        if (currentObject.match in seenGames) {
          return false;
        } else {
          seenGames[currentObject.match] = true;
          return true;
        }
      });
      this.games = games_list;

      games_list.sort(function (a, b) {
        a = new Date(a.matchDate);
        b = new Date(b.matchDate);
        return a > b ? -1 : a < b ? 1 : 0;
      });


      if(this.selected_games.length != 0){
        this.selected_games.forEach(element => {
          this.toggleGame(element.id,"",element.matchDate)
        });
      }

      for (let index = 0; index < 5; index++) {
        this.last5Games.push(this.games[index])
      }
      //console.log("games_list",games_list);
      //console.log("selected_matches",this.selected_matches);
      //console.log("games",this.games);
      this.reloadShots();
    }
    this.loading = false;
  }


  reloadShots() {

    let gamesToUp = []
    //console.log("GAMES",this.games)
    this.games.forEach(element => {
      if(element.active === true){
        gamesToUp.push(element);
      }
    });
    this.onSelectedGame.emit(gamesToUp);
    gamesToUp = [];

    //console.log("shots",this.shots);

    let canvas: CanvasRenderingContext2D = this.canvas.nativeElement.getContext(
      "2d"
    );
    let canvas_width = 760;
    let canvas_height = 760;
    canvas.clearRect(0, 0, canvas_height, canvas_height);

    this.closeVideo();

    this.circles = [];

    let shots_1 = [];
    let shots_2 = [];
    let shots_3 = [];
    let shots_4 = [];
    let shots_5 = [];
    let shots_6 = [];
    let shots_7 = [];
    let shots_8 = [];
    let shots_9 = [];

    this.shots_FULL = [];

    if (this.render_shot_pro_proti == "PRO") {
      this.shots["for"].forEach((item, index) => {
        let top = this.calculateVerticalPositionToPercent(item["x"]);
        let left = this.calculateHorizontalPositionToPercent(
          item["x"],
          item["y"]
        );
        let pos_x = Math.ceil((760 * left) / 100);
        let pos_y = Math.ceil((760 * top) / 100);

        shots_1.push({
          match: item["match"],
          x: pos_x,
          y: pos_y,
          type: item["type"],
          inSlot: item["inSlot"],
          time: item["time"],
          videoId: item["videoId"],
          videoTime: item["videoTime"],
          player: item["player"],
          netZone: item["netZone"],
          shotAssist: item["shotAssist"],
          oneTimer: item["oneTimer"],
          realTime: item["realTime"],
          matchDate: item["matchDate"],
          homeTeam: this.getTeamNameShortcut(item["homeTeam"]),
          awayTeam: this.getTeamNameShortcut(item["awayTeam"]),
          score: item["score"],
          item: item["time"],
          gameState: item["gameState"],
          rush: item["rush"],
          oddManRush: item["oddManRush"],
          long: item["long"],
          afterFO: item["afterFO"],
          rebounds: item["rebounds"],
          reboundsCreated: item["reboundsCreated"],
          forecheck: item["forecheck"],
          color: 0,
          download_type: "shots",
          shotDanger: item["shotDanger"],
          xG: item["xG"],
          emptyNet: item["emptyNet"],
        });
      });
      this.shots_FULL = this.shots["for"];
    } else if (this.render_shot_pro_proti == "HRAC") {
      let uuids = [];
      this.players_list.forEach((item) => {
        uuids.push(item.uuid);
      });
      this.shots["for"].forEach((item, index) => {
        let top = this.calculateVerticalPositionToPercent(item["x"]);
        let left = this.calculateHorizontalPositionToPercent(
          item["x"],
          item["y"]
        );
        let pos_x = Math.ceil((760 * left) / 100);
        let pos_y = Math.ceil((760 * top) / 100);
        if (uuids.includes(item["player"])) {
          shots_1.push({
            match: item["match"],
            x: pos_x,
            y: pos_y,
            type: item["type"],
            inSlot: item["inSlot"],
            time: item["time"],
            videoId: item["videoId"],
            videoTime: item["videoTime"],
            player: item["player"],
            netZone: item["netZone"],
            shotAssist: item["shotAssist"],
            oneTimer: item["oneTimer"],
            realTime: item["realTime"],
            matchDate: item["matchDate"],
            homeTeam: this.getTeamNameShortcut(item["homeTeam"]),
            awayTeam: this.getTeamNameShortcut(item["awayTeam"]),
            score: item["score"],
            item: item["time"],
            gameState: item["gameState"],
            rush: item["rush"],
            oddManRush: item["oddManRush"],
            long: item["long"],
            afterFO: item["afterFO"],
            rebounds: item["rebounds"],
            reboundsCreated: item["reboundsCreated"],
            forecheck: item["forecheck"],
            color: 0,
            download_type: "shots",
            shotDanger: item["shotDanger"],
            xG: item["xG"],
            emptyNet: item["emptyNet"],
          });
        }
      });
      this.shots_FULL = this.shots["for"];
    } else if (this.render_shot_pro_proti == "PROTI") {
      this.shots["against"].forEach((item, index) => {

        let top = this.calculateVerticalPositionToPercent(item["x"]);
        let left = this.calculateHorizontalPositionToPercent(
          item["x"],
          item["y"]
        );
        let pos_x = Math.ceil((760 * left) / 100);
        let pos_y = Math.ceil((760 * top) / 100);
        shots_1.push({
          match: item["match"],
          x: pos_x,
          y: pos_y,
          type: item["type"],
          inSlot: item["inSlot"],
          time: item["time"],
          videoId: item["videoId"],
          videoTime: item["videoTime"],
          player: item["player"],
          netZone: item["netZone"],
          shotAssist: item["shotAssist"],
          oneTimer: item["oneTimer"],
          realTime: item["realTime"],
          matchDate: item["matchDate"],
          homeTeam: this.getTeamNameShortcut(item["homeTeam"]),
          awayTeam: this.getTeamNameShortcut(item["awayTeam"]),
          score: item["score"],
          item: item["time"],
          gameState: item["gameState"],
          rush: item["rush"],
          oddManRush: item["oddManRush"],
          long: item["long"],
          afterFO: item["afterFO"],
          rebounds: item["rebounds"],
          reboundsCreated: item["reboundsCreated"],
          forecheck: item["forecheck"],
          color: 0,
          download_type: "shots",
          shotDanger: item["shotDanger"],
          xG: item["xG"],
          emptyNet: item["emptyNet"],
        });
      });
      this.shots_FULL = this.shots["against"];
    }
    //console.log(JSON.stringify(shots_1));

    shots_1.forEach((shot, index) => {
      this.games.forEach((game) => {
        if (game.active == true && game.match == shot.match) {
          shots_2.push(shot);
        }
      });
    });

    let shot_categories = this.shot_category.split("");
    //JE ZE SLOTU?
    if (shot_categories.includes("_")) {
      shots_2.forEach((shot, index) => {
        shot_categories.forEach((shot_cat, index) => {
          if (shot_cat == shot["type"]) {
            if (shot["inSlot"] == true) {
              shots_3.push(shot);
            }
          }
        });
      });
    } else {
      shots_2.forEach((shot, index) => {
        shot_categories.forEach((shot_cat, index) => {
          if (shot_cat == shot["type"]) {
            shots_3.push(shot);
          }
        });
      });
    }

    if (this.render_shot_pro_proti == "PRO") {
      //FILTRACE AKTIVNICH HRACU
      if (this.shots_team == true) {
        shots_3.forEach((shot, index) => {
          shots_4.push(shot);
        });
      } else {
        shots_3.forEach((shot, index) => {
          if (this.render_shot_pro_type == "hrac") {
            shot["color"] = this.getPlayerColour(shot.player);
            shots_4.push(shot);
          } else if (this.render_shot_pro_type == "tym") {
            shot["color"] = 0;
            shots_4.push(shot);
          }
        });
      }
    } else if (this.render_shot_pro_proti == "HRAC") {
      //FILTRACE AKTIVNICH HRACU
      if (this.shots_team == true) {
        shots_3.forEach((shot, index) => {
          shots_4.push(shot);
        });
      } else {
        shots_3.forEach((shot, index) => {
          if (this.render_shot_pro_type == "hrac") {
            shot["color"] = this.getPlayerColour(shot.player);
            shots_4.push(shot);
          } else if (this.render_shot_pro_type == "tym") {
            shot["color"] = 0;
            shots_4.push(shot);
          }
        });
      }
    } else {
      shots_3.forEach((shot, index) => {
        shots_4.push(shot);
      });
    }

    //ONE TIMER
    if (this.shot_type == "1T") {
      shots_4.forEach((shot, index) => {
        if (shot["oneTimer"] == true) {
          shots_5.push(shot);
        }
      });
      //Dorážka
    } else if (this.shot_type == "R") {
      shots_4.forEach((shot, index) => {
        if (shot["rebounds"] == true) {
          shots_5.push(shot);
        }
      });
      //střela před dorážkou
    } else if (this.shot_type == "RC") {
      shots_4.forEach((shot, index) => {
        if (shot["reboundsCreated"] == true) {
          shots_5.push(shot);
        }
      });
    } else {
      shots_4.forEach((shot, index) => {
        shots_5.push(shot);
      });
    }

    //TYP AKCE
    //Rychlý útok
    if (this.action_type == "rush") {
      shots_5.forEach((shot, index) => {
        if (shot["rush"] == true) {
          shots_6.push(shot);
        }
      });
      //Přečíslení
    } else if (this.action_type == "oddManRush") {
      shots_5.forEach((shot, index) => {
        if (shot["oddManRush"] == true) {
          shots_6.push(shot);
        }
      });
    } else if (this.action_type == "forecheck") {
      shots_5.forEach((shot, index) => {
        if (shot["forecheck"] == true) {
          shots_6.push(shot);
        }
      });
    } else if (this.action_type == "long") {
      shots_5.forEach((shot, index) => {
        if (shot["long"] == true) {
          shots_6.push(shot);
        }
      });
    } else if (this.action_type == "afterFo") {
      shots_5.forEach((shot, index) => {
        if (shot["afterFO"] == true) {
          shots_6.push(shot);
        }
      });
    } else {
      shots_5.forEach((shot, index) => {
        shots_6.push(shot);
      });
    }

    shots_6.forEach((shot, index) => {
      if (this.filter_zone != "") {
        if (shot["netZone"] == this.filter_zone) {
          shots_7.push(shot);
        }
      } else {
        shots_7.push(shot);
      }
    });

    if (this.shot_location == "SLOT") {
      shots_7.forEach((shot, index) => {
        if (shot.inSlot) {
          shots_8.push(shot);
        }
      });
      console.log("Shot8", shots_8)
    } else {
      shots_7.forEach((shot, index) => {
        shots_8.push(shot);
      });
    }

    shots_8.forEach((shot, index) => {
      if (this.shotDangerType === "") {
        shots_9.push(shot);
      } else if (this.shotDangerType === "HD") {
        if (shot.shotDanger === "HD") {
          shots_9.push(shot);
        }
      } else if (this.shotDangerType === "MD") {
        if (shot.shotDanger === "MD") {
          shots_9.push(shot);
        }
      } else if (this.shotDangerType === "LD") {
        if (shot.shotDanger === "LD") {
          shots_9.push(shot);
        }
      }
    });

    this.circles_without_last_filter = shots_9;
    this.circles = shots_9;

    if (this.shots_team == false) {
      this.redrawShotsInGames();
    } else {
      this.redrawShotsInGames();
    }
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

  getIndividualShots(gameMatch: string){
    let shots: any = []
    this.shots_FULL.forEach((shot,index) => {
      if(shot.match == gameMatch){
        shots.push(shot);
      }
    });
    return shots
  }

  getAllToi(){
    let count = 0
    this.selected_matches.forEach( item1 => {
      this.toi.forEach(item2 => {
        if(item1 == item2.match){
            count = count + item2.toi;
        }
      });
    });

    this.toi2 = count;
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

  getRoundNumber(value:any, decimals:number){
    return parseFloat(value).toFixed(decimals);
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

  getGoalsCount(type: string) {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.shotDanger === type && shot.type == "G") {
        count = count + 1;
      }
    });
    return count;
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

  getPlayerColour(player: string) {
    let colour = 0;
    if (player === this.filter_playerId_select1) {
      colour = 1;
    } else if (player === this.filter_playerId_select2) {
      colour = 2;
    } else if (player === this.filter_playerId_select3) {
      colour = 3;
    } else if (player === this.filter_playerId_select4) {
      colour = 4;
    } else if (player === this.filter_playerId_select5) {
      colour = 5;
    }
    return colour;
  }

  toggleActionType(type: string) {
    this.action_type = type;
    this.reloadShots();
  }

  toggleShotType(type: string) {
    this.shot_type = type;
    this.reloadShots();
  }

  redrawShotsInGames() {
    let new_games = [];

    if (this.render_shot_pro_proti == "PRO") {
      this.games.forEach((game) => {
        game["circles"] = [];

        if (this.shots_team == false) {
          if (this.render_shot_pro_type == "hrac") {
            let counter = 0;
            this.circles.forEach((circle) => {
              if (game.match == circle.match) {
                counter = counter + 1;
              }
            });

            game["circles"].push({ count: counter, color: 0, player: "all" });
          } else if (this.render_shot_pro_type == "tym") {
            let counter = 0;

            this.circles.forEach((circle) => {
              if (game.match == circle.match) {
                counter = counter + 1;
              }
            });
            game["circles"].push({ count: counter, color: 0, player: "all" });
          }
        } else {
          let counter = 0;
          this.circles.forEach((circle) => {
            if (game.match == circle.match) {
              counter = counter + 1;
            }
          });

          game["circles"].push({ count: counter, color: 0, player: "all" });
        }

        new_games.push(game);
      });
    } else if (this.render_shot_pro_proti == "HRAC") {
      this.games.forEach((game) => {
        game["circles"] = [];

        if (this.shots_team == false) {
          if (this.render_shot_pro_type == "hrac") {
            let counter = 0;
            this.circles.forEach((circle) => {
              if (game.match == circle.match) {
                counter = counter + 1;
              }
            });

            game["circles"].push({ count: counter, color: 0, player: "all" });
          } else if (this.render_shot_pro_type == "tym") {
            let counter = 0;

            this.circles.forEach((circle) => {
              if (game.match == circle.match) {
                counter = counter + 1;
              }
            });

            game["circles"].push({ count: counter, color: 0, player: "all" });
          }
        } else {
          let counter = 0;
          this.circles.forEach((circle) => {
            if (game.match == circle.match) {
              counter = counter + 1;
            }
          });

          game["circles"].push({ count: counter, color: 0, player: "all" });
        }

        new_games.push(game);
      });
    } else if (this.render_shot_pro_proti == "PROTI") {
      this.games.forEach((game) => {
        game["circles"] = [];

        let counter = 0;

        this.circles.forEach((circle) => {
          if (game.match == circle.match) {
            counter = counter + 1;
          }
        });

        game["circles"].push({ count: counter, color: 0 });

        new_games.push(game);
      });
    }

    this.games = new_games;
  }

  mainGamesSelect(selected: string) {
    this.closeVideo();
    this.main_games_select = selected;
    if (selected == "ALL") {
      this.selected_matches = [];

      this.loading = true;

      /* var matches = [];
      this.games.forEach(game => {
        matches.push(game.match)
      }); */

      this.loadShots.emit({match: [], callback: ()=>{
        this.shotsLoaded = true;
        this.games.forEach((item, index) => {
          this.games[index]["active"] = true;
          this.selected_matches.push(item.match);
        });
        console.log("GAMES", this.games)
        console.log("GAMES SELECTED", this.selected_matches)
        this.reloadShots();
        this.loading = false;
      }})

    } else {
      this.games.forEach((item, index) => {
        this.games[index]["active"] = false;
        this.selected_matches = [];
      });


      this.reloadShots();
    }

    if(this.filter_team == ''){
      this.loading = false;
    }

  }

  renderShotProProti(selected: string) {
    this.render_shot_pro_proti = selected;
    //this.selected_matches = []

    this.closeVideo();
    this.main_games_select = "ALL";

    if (selected == "PROTI") {
      if (typeof this.shots["against"] != "undefined") {
        this.reloadGames();
        this.reloadShots();
      } else {
        //this.onLoadAgainst2();
        this.reloadGames();
        this.reloadShots();
      }
    } else {
      this.reloadGames();
      this.reloadShots();
    }
  }

  loadLastGames(toLoad: number){
    //console.log("loadLastGames()")
    this.shot_nav = 'poslednich_5_zapasu';
    if(!this.shotsLoaded){
      for (let index = 0; index < toLoad; index++) {
         this.loadShots.emit({match: [this.gameslist[index].match],callback: ()=>{
           if(index == toLoad -1 ){
             //this.shot_nav = 'poslednich_5_zapasu';
           }
         }})
      }
    }

  }

  toggleGame(id: number, match: string, match_date: string) {
    console.log("ID", id);
    console.log("Match", match)
    if(!this.shotsLoaded && match != ""){
      this.loading = true;
      this.loadShots.emit({match: [match], callback: ()=>{

      this.closeVideo();
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

      //const isInArr = (element) => element === match;

      if(this.selected_matches.includes(match)){
        this.selected_matches.forEach((item,index) => {
          if(item == match){
            this.selected_matches.splice(index,1);
          }
        });

      } else{
        this.selected_matches.push(match)
      }
      this.reloadShots();
      this.loading = false;
    }})
    }else{
      this.closeVideo();
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

      //this.selected_matches = this.selected_games;

      //const isInArr = (element) => element === match;

      if(this.selected_matches.includes(match)){
        this.selected_matches.forEach((item,index) => {
          if(item == match){
            this.selected_matches.splice(index,1);
          }
        });
      } else{
        this.selected_matches.push(match)
      }
      this.reloadShots();
      this.loading = false;
    }

    if(this.filter_team == ''){
      this.loading = false;
    }
  }

  toggleShotLocation(type: string) {
    this.shot_location = type;
    this.reloadShots();
  }

  getShotTypeTooltip(type: string) {
    let value = "";
    if (type == "G") {
      value = "Gól";
    } else if (type == "S") {
      value = this.translate.transform("strela_na_branku");
    } else if (type == "M") {
      value = this.translate.transform("strela_mimo");
    } else if (type == "B") {
      value = this.translate.transform("zblokovana_strela");
    } else {
      value = type;
    }
    return value;
  }

  getShotType(video) {
    let value = "";
    /*
      gól (G)
      střela na branku (SOG)
      střela na branku ze slotu (sSOG)
      střelecký pokus ze slotu (sC)
      střelecký pokus (C)
      */

    if (
      video.type == "G" ||
      video.type == "S" ||
      video.type == "M" ||
      video.type == "B"
    ) {
      value = "C";
    }

    if (video.type == "G" || video.type == "S") {
      if (video.inSlot == true) {
        value = "sSOG";
      } else {
        value = "SOG";
      }
    }

    if ((video.type == "M" || video.type == "B") && video.inSlot == true) {
      value = "sC";
    }

    if ((video.type == "M" || video.type == "B") && video.inSlot == false) {
      value = "C";
    }

    if (video.type == "G") {
      value = "G";
    }

    return value;
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

    this.reloadShots();
  }

  toggleShotmapInfobar() {
    if (this.shotmapInfobarOpen) {
      this.shotmapInfobarOpen = false;
    } else {
      this.shotmapInfobarOpen = true;
    }
  }

  shotClick(shot: any) {
    this.video_url = "";
    this.video_url_safe = "";
    this.active_video = "";

    this.tooltip_x = shot.x;
    this.tooltip_y = shot.y;

    /*
        let match = shot.match;
        let team = this.filter_team;
        let time = shot.time;

        alert(match + " " + team + " " + time);

        this.formationsAnalysisService.getShotInfo(match, team, time).subscribe(loaded_data => {
            alert(JSON.stringify(loaded_data));

        },
            err => {
                alert("Chyba .");

            });

        */
    this.selected_shot = shot;
    this.showVideoModal = true;
  }

  toggleShotCategoryFilter(type: string) {
    this.shot_category = type;
    this.reloadShots();
  }

  toggleShotDangerType(type: string) {
    this.shotDangerType = type;
    this.reloadShots();
  }

  checkExistCircles(circles: any) {
    let count = 0;
    circles.forEach((item) => {
      count = count + item["count"];
    });

    if (count == 0) {
      return false;
    } else {
      return true;
    }
  }

  closeVideo() {
    this.selected_shot = [];
    this.showVideoModal = false;
    this.active_video = "";
  }

  closeVideoPlayer() {
    this.show_video_player = false;
    this.active_video = "";
  }

  showVideo(match_id: string, time: string) {
    this.video_url = "";
    this.video_url_safe = "";
    this.active_video = "";

    this.show_video_player = true;
    this.video_url =
      "http://hockeylogic.sh10w1.esports.cz/video_player/video.php?starttime=" +
      time +
      "&id=" +
      match_id;
    this.video_url_safe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.video_url
    );
  }

  playVideo(match_id: string, time: string) {
    this.video_url = "";
    this.video_url_safe = "";
    this.active_video = "";

    this.active_video = match_id + "" + time;

    this.video_url =
      "http://hockeylogic.sh10w1.esports.cz/video_player/video.php?starttime=" +
      time +
      "&id=" +
      match_id;
    this.video_url_safe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.video_url
    );
  }

  stopVideo(match_id: string, time: string) {
    this.video_url = "";
    this.video_url_safe = "";
    this.active_video = "";
  }

  scroll_bottom() {
    this.graph_scroll = this.graph_scroll + 44;
    this.games_list.nativeElement.scrollTop = this.graph_scroll;
  }

  scroll_top() {
    if (this.graph_scroll > 0) {
      this.graph_scroll = this.graph_scroll - 44;
      this.games_list.nativeElement.scrollTop = this.graph_scroll;
    }

    if (this.graph_scroll >= 0) {
      this.canscrollprev = true;
    }
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

  getGameState2(state: string) {
    let value = state;
    if (state == null) {
      value = "";
    } else {
      if (state == "EV") {
        value = this.translate.transform("rovnovazny_stav");
      }
      if (state == "PP") {
        value = this.translate.transform("presilovka");
      }
      if (state == "PK") {
        value = this.translate.transform("oslabeni");
      }
      if (state.includes(":") == true) {
        value = value.replace(":", "/");
      }
    }
    return value;
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

  // na základě X pozice otočit hodnoty, kvůli hřišti
  calculateHorizontalPositionToPercent(x, y) {
    var position = Math.ceil((y + 100) / 2);
    return x <= 0 ? position : 100 - position;
  }

  // zrcadlové otočení pro hosty (X hodnoty v kladných číslech)
  calculateVerticalPositionToPercent(x) {
    return x <= 0 ? Math.ceil(x + 100) : Math.ceil(100 - x);
  }

  invertChanged(invert: boolean) {
    this.closeVideo();
    this.onInvertChanged.emit(invert);
  }

  openVideoPlayer() {
    this.onOpenVideoPlayer.emit(this.modal_videos);
  }

  openSmallVideo(data: any) {
    this.onOpenVideoPlayer.emit(data);
  }

  onLoadAgainst2() {
    this.onLoadAgainst.emit(this.render_shot_pro_proti);
  }

  playGameVideo(match, player, shot) {
    this.video_selected_player = player;
    this.video_selected_match = match;

    this.video_url = "";
    this.video_url_safe = "";
    this.active_video = "";

    this.modal_videos = [];
    //alert("xx" + JSON.stringify(match));
    //alert("player: " + player + "    " + JSON.stringify(game) + "    ");

    if (player == "all" || player == undefined) {
      this.circles.forEach((item) => {
        if (item.match == match.match) {
          this.modal_videos.push(item);
        }
      });

    } else {
      this.circles.forEach((item) => {
        //console.log(JSON.stringify(item));
        if (item.player == player && item.match == match.match) {
          this.modal_videos.push(item);
        }
      });
    }

    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });

    if (shot != undefined) {
      let selected_shot = [];
      this.show_only_one_shot = true;

      this.modal_videos.forEach((item) => {
        if (
          shot.match == item.match &&
          shot.x == item.x &&
          shot.y == item.y &&
          shot.time == item.time
        ) {
          selected_shot.push(item);
        }
      });

      this.modal_videos = selected_shot;
    } else {
      this.show_only_one_shot = false;
    }

    this.show_video_player_match = true;

    this.openVideoPlayer();
  }

  changeVideoOrderBy() {
    this.modal_videos = [];
    //alert("xx" + JSON.stringify(match));
    //alert("player: " + player + "    " + JSON.stringify(game) + "    ");

    if (this.video_selected_player == "all") {
      this.circles.forEach((item) => {
        if (item.match == this.video_selected_match.match) {
          this.modal_videos.push(item);
        }
      });
    } else {
      this.circles.forEach((item) => {
        if (
          item.player == this.video_selected_player &&
          item.match == this.video_selected_match.match
        ) {
          this.modal_videos.push(item);
        }
      });
    }

    if (this.video_orderby == "time") {
      this.modal_videos.sort(function (a, b) {
        return a.time - b.time;
      });
    } else if (this.video_orderby == "players") {
      let videos = this.modal_videos;
      this.modal_videos = [];

      videos.sort(function (a, b) {
        return a.time - b.time;
      });

      this.players_list.forEach((item2, index) => {
        videos.forEach((item) => {
          if (item.player == item2.uuid) {
            item["color"] = index + 1;
            this.modal_videos.push(item);
          }
        });
      });
    }
  }

  closeVideoPlayerMatch() {
    this.show_video_player_match = false;
  }

  getPlayerJersey(uuid: string) {
    let data = JSON.parse(localStorage.getItem(uuid));

    if (data != null) {
      if (uuid != null && uuid != undefined) {
        let jersey_number = data["jersey"];

        return jersey_number;
      }
    } else {
      return "";
    }
  }

  stringy(string_text) {
    //console.log(JSON.stringify(string_text));

    return JSON.stringify(string_text);
  }

  isGameChecked() {
    let count = 0;
    this.games.forEach((item) => {
      if (item.active == true) {
        count = count + 1;
      }
    });
    if (count > 0) {
      return false;
    } else {
      return true;
    }
  }

  openAllVideos() {
    this.video_url = "";
    this.video_url_safe = "";
    this.active_video = "";
    this.modal_videos = [];

    let games_list = [];
    this.games.forEach((item) => {
      if (item.active == true) {
        games_list.push(item.match);
      }
    });

    this.circles.forEach((item) => {
      if (games_list.includes(item.match)) {
        this.modal_videos.push(item);
      }
    });
    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });
    this.openVideoPlayer();
  }

  download() {
    alert("Toto stáhne soubor videa");
  }

  selectGoalZone(zone: string) {
    if (this.filter_zone == zone) {
      this.filter_zone = "";
    } else {
      this.filter_zone = zone;
    }

    this.reloadShots();
  }

  getNetZoneNumbers(zone: string) {
    //console.log(JSON.stringify(this.circles_without_last_filter));
    let count = 0;
    let total_count = 0;

    this.circles_without_last_filter.forEach((item) => {
      total_count = total_count + 1;
      if (item["netZone"] == zone) {
        count = count + 1;
      }
    });

    let percent = 100 / (total_count / count);
    percent = Math.round(percent * 100) / 100;
    if (isNaN(percent)) {
      percent = 0;
    }

    return count;
  }

  /* exportShotmap() {
    this.exporting_png = true;
    this.closeVideo();
    html2canvas(this.exportpng.nativeElement).then((canvas) => {
      //this.exportpng.nativeElement.appendChild(canvas);
      canvas.toBlob((blob) => {
        saveAs(blob, "shotmap_export.png");
      });
      this.exporting_png = false;
    });
  } */

  renderShotProType(type: string) {
    this.render_shot_pro_type = type;
    this.reloadShots();
  }
}
