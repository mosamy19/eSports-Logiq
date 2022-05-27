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

import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Item } from "angular2-multiselect-dropdown";

@Component({
  selector: "assistmap",
  templateUrl: "./assistmap.component.html",
  styleUrls: ["./assistmap.component.scss"],
  providers: [DefaultService, TranslatePipe],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssistMapComponent implements OnInit, AfterViewInit {
  @Output() onInvertChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenVideoPlayer: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoadAgainst: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectedGame: EventEmitter<any> = new EventEmitter<any>();
  @Output() badLoad: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("games_list") private games_list: ElementRef;
  graph_scroll: number = 0;
  canscrollprev: boolean = false;

  invert: boolean = true;

  assist_category: string = "SA";
  assist_type: string = "";
  action_type: string = "";
  shot_category: string = "BMGS";
  puck_move: string = "";

  main_games_select: string = "ALL";
  render_assist_pro_proti: string = "";

  showVideoModal: boolean = false;

  games: any = [];
  circles: any = [];

  selected_assist: any = [];

  //video
  show_video_player: boolean = false;
  video_url: string = "";
  video_url_safe: any;
  video_orderby: string = "time";

  modal_videos: any = [];

  //video match
  show_video_player_match: boolean = false;
  video_selected_player: string = "";
  video_selected_match: any;

  players_list: any = [];
  active_video: string = "";
  show_only_one_shot: boolean = false;

  draw_all_categories: string = "yes";

  shot_location: string = "ALL";

  tooltip_x: number = 0;
  tooltip_y: number = 0;

  shotDangerType: string = "";

  shotmapInfobarOpen: boolean = false;

  @Input() assists: any = [];

  @Input() players: any = [];
  @Input() assists_team: boolean = false;
  @Input() teams_list: any = [];
  @Input() gameslist: any = [];

  @Input() filter_playerId_select1: string = "";
  @Input() filter_playerId_select2: string = "";
  @Input() filter_playerId_select3: string = "";
  @Input() filter_playerId_select4: string = "";
  @Input() filter_playerId_select5: string = "";

  @Input() toi: any=[];

  @Input() selected_games:any = [];

  @Input() pro_proti_assists: string = "PRO";

  @ViewChild("canvas") canvas: ElementRef;
  context: CanvasRenderingContext2D;

  @ViewChild("exportpng") exportpng;
  exporting_png: boolean = false;

  constructor(
    private translate: TranslatePipe,
    private defaultService: DefaultService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
    this.sanitizer = sanitizer;
  }

  ngOnInit() {
    //console.log("gameslist", this.gameslist) 
  }

  ngAfterViewInit() {
    this.render_assist_pro_proti = this.pro_proti_assists;

    this.reloadPlayers();
    this.reloadGames();
  }

  reloadPlayers() {
    if (this.assists_team == false && this.players != undefined) {
      this.players.forEach((item, index) => {
        if (item.playerUUID != "") {
          this.players_list.push({
            uuid: item.playerUUID,
            enabled: item.enabled,
          });
        }
      });
    }
  }

  reloadGames() {
    
    if (this.assists.hasOwnProperty("for")) {
      //console.log("Nice :D")
      this.graph_scroll = 0;

      let games_list = [];

      if(this.selected_games.length == 0){
        this.gameslist.forEach((item, index) => {
          let activeGame = false;
          if (index === 0) {
            activeGame = true;
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
      }

      var seenGames = {};
      games_list = games_list.filter((currentObject) => {
        if (currentObject.match in seenGames) {
          return false;
        } else {
          seenGames[currentObject.match] = true;
          return true;
        }
      });

      this.games = games_list;
      //console.log("games",this.games);

      games_list.sort(function (a, b) {
        a = new Date(a.matchDate);
        b = new Date(b.matchDate);
        return a > b ? -1 : a < b ? 1 : 0;
      });


      if(this.selected_games.length != 0){
        this.selected_games.forEach(element => {
          this.toggleGame(element.id,);
        });
      }else{
        this.reloadAssists();
      }
    
      //console.log(JSON.stringify(this.games));

      
    }else{
      //console.log("O_o WtF");
      this.badLoad.emit('mapa_prihravek');
    }
  }

  getAssistXg(data:any){
    console.log("SELECTED ASSIST:", data)
    return Math.round((data.shot.xG + Number.EPSILON) * 100) / 100;;
  }

  reloadAssists() {

    let gamesToUp = []
    this.games.forEach(element => {
      if(element.active === true){
        gamesToUp.push(element);
      }
    });
    this.onSelectedGame.emit(gamesToUp);
    gamesToUp = [];


    let canvas: CanvasRenderingContext2D = this.canvas.nativeElement.getContext(
      "2d"
    );
    let canvas_width = 760;
    let canvas_height = 760;
    canvas.clearRect(0, 0, canvas_height, canvas_height);

    this.closeVideo();

    this.circles = [];



    let assists_1 = [];
    let assists_2 = [];
    let assists_3 = [];
    let assists_4 = [];
    let assists_5 = [];
    let assists_6 = [];
    let assists_7 = [];
    let assists_8 = [];


    if (this.render_assist_pro_proti == "PRO") {
      this.assists["for"].forEach((item, index) => {

        let top = this.calculateVerticalPositionToPercent(item["x"]);
        let left = this.calculateHorizontalPositionToPercent(
          item["x"],
          item["y"]
        );
        let pos_x = Math.ceil((760 * left) / 100);
        let pos_y = Math.ceil((760 * top) / 100);
        assists_1.push({
          match: item["match"],
          x: pos_x,
          y: pos_y,
          type: item["type"],
          inSlot: item["inSlot"],
          time: item["time"],
          afterFO: item['afterFO'],
          long: item['long'],
          videoId: item["videoId"],
          videoTime: item["videoTime"],
          player: item["player"],
          netZone: item["netZone"],
          shot: item["shot"],
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
          nonCompletedSlot: item["nonCompletedSlot"],
          completedSlot: item["completedSlot"],
          blocked: item["blocked"],
          behindTheNet: item["behindTheNet"],
          crossIce: item["crossIce"],
          blockedToSlot: item["blockedToSlot"],
          forecheck: item["forecheck"],
          color: 0,
          download_type: "assists",
        });
      });
    } else if (this.render_assist_pro_proti == "PROTI") {
      this.assists["against"].forEach((item, index) => {
        let top = this.calculateVerticalPositionToPercent(item["x"]);
        let left = this.calculateHorizontalPositionToPercent(
          item["x"],
          item["y"]
        );
        let pos_x = Math.ceil((760 * left) / 100);
        let pos_y = Math.ceil((760 * top) / 100);
        assists_1.push({
          match: item["match"],
          x: pos_x,
          y: pos_y,
          type: item["type"],
          inSlot: item["inSlot"],
          time: item["time"],
          afterFO: item['afterFO'],
          long: item['long'],
          videoId: item["videoId"],
          videoTime: item["videoTime"],
          player: item["player"],
          netZone: item["netZone"],
          shot: item["shot"],
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
          nonCompletedSlot: item["nonCompletedSlot"],
          completedSlot: item["completedSlot"],
          blocked: item["blocked"],
          behindTheNet: item["behindTheNet"],
          crossIce: item["crossIce"],
          blockedToSlot: item["blockedToSlot"],
          forecheck: item["forecheck"],
          color: 0,
          download_type: "assists",
        });
      });
    } else if (this.render_assist_pro_proti == "HRAC") {
      this.assists["for"].forEach((item, index) => {
        let top = this.calculateVerticalPositionToPercent(item["x"]);
        let left = this.calculateHorizontalPositionToPercent(
          item["x"],
          item["y"]
        );
        let pos_x = Math.ceil((750 * left) / 100);
        let pos_y = Math.ceil((760 * top) / 100);
        assists_1.push({
          match: item["match"],
          x: pos_x,
          y: pos_y,
          type: item["type"],
          inSlot: item["inSlot"],
          time: item["time"],
          afterFO: item['afterFO'],
          long: item['long'],
          videoId: item["videoId"],
          videoTime: item["videoTime"],
          player: item["player"],
          netZone: item["netZone"],
          shot: item["shot"],
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
          nonCompletedSlot: item["nonCompletedSlot"],
          completedSlot: item["completedSlot"],
          blocked: item["blocked"],
          behindTheNet: item["behindTheNet"],
          crossIce: item["crossIce"],
          blockedToSlot: item["blockedToSlot"],
          forecheck: item["forecheck"],
          color: 0,
          download_type: "assists",
        });
      });
    }

    assists_1.forEach((shot, index) => {
      this.games.forEach((game) => {
        if (game.active == true && game.match == shot.match) {
          assists_2.push(shot);
        }
      });
    });

    if (this.render_assist_pro_proti == "PRO") {
      assists_2.forEach((shot, index) => {
        shot["color"] = this.getPlayerColour(shot.player);

        assists_3.push(shot);
      });
    } else if (this.render_assist_pro_proti == "HRAC") {
      //FILTRACE AKTIVNICH HRACU
      if (this.assists_team == true) {
        assists_2.forEach((shot, index) => {
          assists_3.push(shot);
        });
      } else {
        assists_2.forEach((shot, index) => {
          this.players_list.forEach((player, index_player) => {
            if (player.uuid == shot.player && player.enabled == true) {
              shot["color"] = index_player + 1;
              assists_3.push(shot);
            }
          });
        });
      }
    } else if (this.render_assist_pro_proti == "PROTI") {
      assists_2.forEach((shot, index) => {
        assists_3.push(shot);
      });
    }

    let shot_categories = this.shot_category.split("");
    assists_3.forEach((shot, index) => {
      if (shot["shot"] != null) {
        shot_categories.forEach((shot_cat, index) => {
          if (shot_cat == shot["shot"]["type"]) {
            assists_4.push(shot);
          }
        });
      }
    });

    if (this.shot_location == "ALL") {
      assists_4.forEach((shot, index) => {
        assists_5.push(shot);
      });
    } else if (this.shot_location == "SLOT") {
      assists_4.forEach((shot, index) => {
        if (shot.shot != null) {
          if (shot["shot"]["inSlot"] == true) {
            assists_5.push(shot);
          }
        }
      });
    }

    //typ prihravky
    //Přihrávky zpoza branky
    if (this.assist_type == "behindTheNet") {
      assists_5.forEach((shot, index) => {
        if (shot["behindTheNet"] == true) {
          assists_6.push(shot);
        }
      });
    } else if (this.assist_type == "crossIce") {
      assists_5.forEach((shot, index) => {
        if (shot["shot"] != null) {
          if (shot["shot"]["crossIce"] == true) {
            assists_6.push(shot);
          }
        }
      });
    } else if (this.assist_type == "oneTimer") {
      assists_5.forEach((shot, index) => {
        if (shot["shot"] != null) {
          if (shot["shot"]["oneTimer"] == true) {
            assists_6.push(shot);
          }
        }
      });
    } else {
      assists_5.forEach((shot, index) => {
        assists_6.push(shot);
      });
    }

    //TYP AKCE
    //Rychlý útok
    if (this.action_type == "rush") {
      assists_6.forEach((shot, index) => {
        if (shot["rush"] == true) {
          assists_7.push(shot);
        }
      });
      //Přečíslení
    } else if (this.action_type == "oddManRush") {
      assists_6.forEach((shot, index) => {
        if (shot["oddManRush"] == true) {
          assists_7.push(shot);
        }
      });
    } else if (this.action_type == "long") {
      assists_6.forEach((shot, index) => {
        if (shot["long"] == true) {
          assists_7.push(shot);
        }
      });
    }else if (this.action_type == "afterFO") {
      assists_6.forEach((shot, index) => {
        if (shot["afterFO"] == true) {
          assists_7.push(shot);
        }
      });
    }else if (this.action_type == "forecheck") {
      assists_6.forEach((shot, index) => {
        if (shot["forecheck"] == true) {
          assists_7.push(shot);
        }
      });
    } else {
      assists_6.forEach((shot, index) => {
        assists_7.push(shot);
      });
    }

    if (this.shotDangerType == "HD") {
      assists_7.forEach((shot, index) => {
        if (shot["shot"]["shotDanger"] == "HD") {
          assists_8.push(shot);
        }
      });
    } else if (this.shotDangerType == "MD") {
      assists_7.forEach((shot, index) => {
        if (shot["shot"]["shotDanger"] == "MD") {
          assists_8.push(shot);
        }
      });
    } else if (this.shotDangerType == "LD") {
      assists_7.forEach((shot, index) => {
        if (shot["shot"]["shotDanger"] == "LD") {
          assists_8.push(shot);
        }
      });
    } else {
      assists_7.forEach((shot, index) => {
        assists_8.push(shot);
      });
    }

    this.circles = assists_8;

    this.drawAllTrajectories();

    if (this.assists_team == false) {
      this.redrawAssistsInGames();
    } else {
      this.redrawAssistsInGames();
    }
  }

  setActionType(type: string) {
    this.action_type = type;
    this.reloadAssists();
  }

  toggleShotDangerType(type: string) {
    this.shotDangerType = type;
    this.reloadAssists();
  }

  changeShotCategory(type: string) {
    this.shot_category = type;
    this.reloadAssists();
  }

  onLoadAgainst2() {
    this.onLoadAgainst.emit();
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

  redrawAssistsInGames() {
    let new_games = [];

    if (this.render_assist_pro_proti == "PRO") {
      this.games.forEach((game) => {
        game["circles"] = [];

        if (this.assists_team == false) {
          let counter = 0;
          this.circles.forEach((circle) => {
            if (game.match == circle.match) {
              counter = counter + 1;
            }
          });

          game["circles"].push({ count: counter, color: 0, player: "all" });
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
    } else if (this.render_assist_pro_proti == "HRAC") {
      this.games.forEach((game) => {
        game["circles"] = [];

        if (this.assists_team == false) {
          let counter = 0;
          this.circles.forEach((circle) => {
            if (game.match == circle.match) {
              counter = counter + 1;
            }
          });

          game["circles"].push({ count: counter, color: 0, player: "all" });
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
    } else if (this.render_assist_pro_proti == "PROTI") {
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

    //console.log("JSONNN " + JSON.stringify(this.games));
  }

  toggleShotmapInfobar() {
    if (this.shotmapInfobarOpen) {
      this.shotmapInfobarOpen = false;
    } else {
      this.shotmapInfobarOpen = true;
    }
  }

  setAssistType(type: string) {
    this.assist_type = type;
    this.reloadAssists();
  }

  mainGamesSelect(selected: string) {
    this.closeVideo();
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

    this.reloadAssists();
  }

  stringy(data: any) {
    return JSON.stringify(data);
  }

  renderAssistProProti(selected: string) {
    this.render_assist_pro_proti = selected;

    this.closeVideo();
    this.main_games_select = "ALL";

    if (selected == "PROTI") {
      if (typeof this.assists["against"] != "undefined") {
        this.reloadGames();
        this.reloadAssists();
        this.drawAllTrajectories();
      } else {
        this.onLoadAgainst2();
      }
    } else if (selected == "HRAC") {
      this.reloadGames();
      this.reloadAssists();
      this.drawAllTrajectories();
    } else {
      this.reloadGames();
      this.reloadAssists();
      this.drawAllTrajectories();
    }
  }

  toggleGame(id: number) {
    console.log("ID", id)
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
    this.reloadAssists();
  }

  getAssistTypeTooltip(data: any) {
    let value = "";

    if (data["shot"] == null) {
      value = "Přihrávka do slotu bez střely";
    } else {
      value = "Přihrávka na střelu";
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

    this.reloadAssists();
  }

  assistClick(assist: any) {
    this.tooltip_x = assist.x;
    this.tooltip_y = assist.y;

    this.video_url = "";
    this.video_url_safe = "";
    this.active_video = "";
    this.drawAllTrajectories();
    this.drawTrajectory(assist);
    this.selected_assist = assist;
    this.showVideoModal = true;
  }

  drawTrajectory(assist: any) {
    let canvas: CanvasRenderingContext2D = this.canvas.nativeElement.getContext(
      "2d"
    );
    let canvas_width = 760;
    let canvas_height = 760;
    //canvas.clearRect(0, 0, canvas_height, canvas_height);

    let draw_canvas: CanvasRenderingContext2D = canvas;

    let stroke_color = "#fff";

    if (assist["color"] === 1) {
      stroke_color = "#d91e28";
    } else if (assist["color"] === 2) {
      stroke_color = "#8b32fc";
    } else if (assist["color"] === 3) {
      stroke_color = "#0d70c3";
    } else if (assist["color"] === 4) {
      stroke_color = "#057d79";
    } else if (assist["color"] === 5) {
      stroke_color = "#d02471";
    } else if (assist["color"] === 0) {
      stroke_color = "#000";
    }

    if (assist.shot != null) {
      //assist
      let top = this.calculateVerticalPositionToPercent(assist.shot.x);
      let left = this.calculateHorizontalPositionToPercent(
        assist.shot.x,
        assist.shot.y
      );
      let pos_x = Math.ceil((760 * left) / 100);
      let pos_y = Math.ceil((760 * top) / 100);

      draw_canvas.beginPath();
      draw_canvas.strokeStyle = stroke_color;
      draw_canvas.lineWidth = 2;
      draw_canvas.moveTo(assist.x, assist.y);
      draw_canvas.lineTo(pos_x, pos_y);
      draw_canvas.stroke();

      draw_canvas.beginPath();
      draw_canvas.arc(pos_x, pos_y, 9, 0, 2 * Math.PI, false);
      draw_canvas.fillStyle = stroke_color;
      draw_canvas.fill();
      draw_canvas.lineWidth = 1;
      draw_canvas.strokeStyle = "#fff";
      draw_canvas.stroke();
    }

    if (assist.shot != null && assist.shot.type === "G") {
      let top = this.calculateVerticalPositionToPercent(assist.shot.x);
      let left = this.calculateHorizontalPositionToPercent(
        assist.shot.x,
        assist.shot.y
      );
      let pos_x = Math.ceil((760 * left) / 100);
      let pos_y = Math.ceil((760 * top) / 100);
      draw_canvas.font = "500 12px verdana, sans-serif";
      draw_canvas.fillStyle = "#fff";
      draw_canvas.fillText("G", pos_x - 5, pos_y + 4);
    }

    /*
        draw_canvas.beginPath();
        draw_canvas.arc(assist.x, assist.y, 2, 0, 2 * Math.PI, false);
        draw_canvas.fillStyle = '#151d22';
        draw_canvas.fill();
        draw_canvas.lineWidth = 1;
        draw_canvas.strokeStyle = stroke_color;
        draw_canvas.stroke();
*/
  }

  drawAllTrajectoriesSelect(draw_all_categories_select) {
    //alert(draw_all_categories_select);
    if (draw_all_categories_select == "no") {
      this.draw_all_categories = "yes";
    } else {
      this.draw_all_categories = "no";
    }
    let canvas: CanvasRenderingContext2D = this.canvas.nativeElement.getContext(
      "2d"
    );
    let canvas_width = 760;
    let canvas_height = 760;
    canvas.clearRect(0, 0, canvas_height, canvas_height);
    this.closeVideo();
    this.drawAllTrajectories();
  }

  setShotLocation(type: string) {
    this.shot_location = type;
    this.reloadAssists();
  }

  drawAllTrajectories() {
    let render_all_trajectories = this.draw_all_categories;

    if (render_all_trajectories == "yes") {
      let canvas: CanvasRenderingContext2D = this.canvas.nativeElement.getContext(
        "2d"
      );
      let canvas_width = 760;
      let canvas_height = 760;
      canvas.clearRect(0, 0, canvas_height, canvas_height);

      /* vykresli vsechny trajektorie*/
      let draw_canvas: CanvasRenderingContext2D = canvas;
      this.circles.forEach((assist) => {
        //console.log(JSON.stringify(assist['color']));

        let stroke_color = "#fff";

        if (assist["color"] === 1) {
          stroke_color = "rgba(217,30,40,0.3)";
        } else if (assist["color"] === 2) {
          stroke_color = "rgba(139,50,252,0.3)";
        } else if (assist["color"] === 3) {
          stroke_color = "rgba(13,112,195,0.3)";
        } else if (assist["color"] === 4) {
          stroke_color = "rgba(5,125,121,0.3)";
        } else if (assist["color"] === 5) {
          stroke_color = "rgba(208,36,113,0.3)";
        } else if (assist["color"] === 0) {
          stroke_color = "rgba(0,0,0,0.3)";
        }

        if (assist.shot != null) {
          //assist
          let top = this.calculateVerticalPositionToPercent(assist.shot.x);
          let left = this.calculateHorizontalPositionToPercent(
            assist.shot.x,
            assist.shot.y
          );
          let pos_x = Math.ceil((760 * left) / 100);
          let pos_y = Math.ceil((760 * top) / 100);

          draw_canvas.beginPath();
          draw_canvas.strokeStyle = "#fff";
          draw_canvas.lineWidth = 5;
          draw_canvas.moveTo(assist.x, assist.y);
          draw_canvas.lineTo(pos_x, pos_y);
          draw_canvas.stroke();

          draw_canvas.beginPath();
          draw_canvas.strokeStyle = stroke_color;
          draw_canvas.lineWidth = 2;
          draw_canvas.moveTo(assist.x, assist.y);
          draw_canvas.lineTo(pos_x, pos_y);
          draw_canvas.stroke();

          draw_canvas.beginPath();
          draw_canvas.arc(pos_x, pos_y, 9, 0, 2 * Math.PI, false);
          draw_canvas.fillStyle = stroke_color;
          draw_canvas.fill();
          draw_canvas.lineWidth = 1;
          draw_canvas.strokeStyle = "#fff";
          draw_canvas.stroke();
        }

        draw_canvas.beginPath();
        draw_canvas.arc(assist.x, assist.y, 2, 0, 2 * Math.PI, false);
        draw_canvas.fillStyle = "#151d22";
        draw_canvas.fill();
        draw_canvas.lineWidth = 1;
        draw_canvas.strokeStyle = stroke_color;
        draw_canvas.stroke();

        if (assist.shot != null && assist.shot.type === "G") {
          let top = this.calculateVerticalPositionToPercent(assist.shot.x);
          let left = this.calculateHorizontalPositionToPercent(
            assist.shot.x,
            assist.shot.y
          );
          let pos_x = Math.ceil((760 * left) / 100);
          let pos_y = Math.ceil((760 * top) / 100);
          draw_canvas.font = "500 12px verdana, sans-serif";
          draw_canvas.fillStyle = "#fff";
          draw_canvas.fillText("G", pos_x - 5, pos_y + 4);
        }
      });
      /* vykresli vsechny trajektorie*/
    } else {
      let canvas: CanvasRenderingContext2D = this.canvas.nativeElement.getContext(
        "2d"
      );
      let canvas_width = 760;
      let canvas_height = 760;
      canvas.clearRect(0, 0, canvas_height, canvas_height);
    }
  }

  getAssistAngle(assist: any) {
    if (assist["shot"] != null) {
      let x2 = assist["x"];
      let y2 = assist["y"];

      let x1 = assist["shot"]["x"];
      let y1 = assist["shot"]["y"];

      let top = this.calculateVerticalPositionToPercent(x1);
      let left = this.calculateHorizontalPositionToPercent(x1, y1);
      let pos_x = Math.ceil((760 * left) / 100);
      let pos_y = Math.ceil((760 * top) / 100);

      let angle = Number((Math.atan2(y2 - pos_y, x2 - pos_x) * 180) / Math.PI);
      angle = angle - 180;
      return angle;
    } else {
      let x2 = assist["x"];
      let y2 = assist["y"];

      let x1 = 61;
      let y1 = 0;

      let top = this.calculateVerticalPositionToPercent(x1);
      let left = this.calculateHorizontalPositionToPercent(x1, y1);
      let pos_x = Math.ceil((760 * left) / 100);
      let pos_y = Math.ceil((760 * top) / 100);

      let angle = Number((Math.atan2(y2 - pos_y, x2 - pos_x) * 180) / Math.PI);
      angle = angle - 180;
      return angle;
    }
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
    this.selected_assist = [];
    //this.drawTrajectory([]);
    this.drawAllTrajectories();

    this.showVideoModal = false;
  }

  closeVideoPlayer() {
    this.show_video_player = false;
  }

  showVideo(match_id: string, time: string) {
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
    //this.drawTrajectory([]);
    this.drawAllTrajectories();

    this.onInvertChanged.emit(invert);

    this.mainGamesSelect("ALL");
  }

  jsonRender(json) {
    return JSON.stringify(json);
  }

  detectActivePass(pass) {
    if (
      pass.match == this.selected_assist.match &&
      pass.x == this.selected_assist.x &&
      pass.y == this.selected_assist.y &&
      pass.time == this.selected_assist.time
    ) {
      return true;
    } else {
      return false;
    }
  }

  getAllGoals() {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.shot.type === "G") {
        count = count + 1;
      }
    });
    return count;
  }

  getAllXg() {
    let count = 0;
    this.circles.forEach((shot) => {
      count = count + Number(shot.shot.xG);
    });
    if (count > 0) {
      return Math.round((count + Number.EPSILON) * 100) / 100;
    } else {
      return 0;
    }
  }

  getAllToi(){
    let count = 0;
    //console.log("games",this.games);
    this.toi.forEach(toi => {
      this.games.forEach(game => {
        if(game.active && game.match == toi.match){
          count = count + toi.toi;
        }
      });
    });
    return count;
  }

  getXg(type: string) {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.shot.shotDanger === type) {
        count = count + Number(shot.shot.xG);
      }
    });
    if (count > 0) {
      return Math.round((count + Number.EPSILON) * 100) / 100;
    } else {
      return 0;
    }
  }

  getShotsCount(type: string) {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.shot.shotDanger === type) {
        count = count + 1;
      }
    });
    return count;
  }

  getGoalsCount(type: string) {
    let count = 0;
    this.circles.forEach((shot) => {
      if (shot.shot.shotDanger === type && shot.shot.type == "G") {
        count = count + 1;
      }
    });
    return count;
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

  getAssistType(video) {
    //alert(JSON.stringify(video));
    let value = "";
    /*
      gól (G)
      střela na branku (SOG)
      střela na branku ze slotu (sSOG)
      střelecký pokus ze slotu (sC)
      střelecký pokus (C)
      */
    if (video["shot"] != null) {
      if (
        video["shot"]["type"] == "G" ||
        video["shot"]["type"] == "S" ||
        video["shot"]["type"] == "M" ||
        video["shot"]["type"] == "B"
      ) {
        value = "C";
      }

      if (video["shot"]["type"] == "G" || video["shot"]["type"] == "S") {
        if (video.inSlot == true) {
          value = "sSOG";
        } else {
          value = "SOG";
        }
      }

      if (
        (video["shot"]["type"] == "M" || video["shot"]["type"] == "B") &&
        video.inSlot == true
      ) {
        value = "sC";
      }

      if (
        (video["shot"]["type"] == "M" || video["shot"]["type"] == "B") &&
        video.inSlot == false
      ) {
        value = "C";
      }

      if (video["shot"]["type"] == "G") {
        value = "G";
      }
    } else {
      value = "";
    }

    return value;
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

  openVideoPlayer() {
    this.onOpenVideoPlayer.emit(this.modal_videos);
  }

  exportShotmap() {
    this.exporting_png = true;
    this.closeVideo();
    html2canvas(this.exportpng.nativeElement).then((canvas) => {
      //this.exportpng.nativeElement.appendChild(canvas);
      canvas.toBlob(function (blob) {
        saveAs(blob, "shotmap_export.png");
      });
      this.exporting_png = false;
    });
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
}
