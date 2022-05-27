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
  ComponentFactoryResolver
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { stringify } from '@angular/core/src/render3/util';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';



@Component({
    selector: 'shotmap-goalkeeper',
    templateUrl: './shotmap_goalkeeper.component.html',
    styleUrls: ['./shotmap_goalkeeper.component.scss'],
    providers: [DefaultService, TranslatePipe],
    // changeDetection: ChangeDetectionStrategy.OnPush


})
export class ShotMapGoalkeeperComponent implements OnInit, AfterViewInit {

    @Output() onInvertChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() onChangePlayer: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('games_list') private games_list: ElementRef;
    graph_scroll: number = 0;
    canscrollprev: boolean = false;

    invert: boolean = true;

    action_type: string = "";
    puck_move: string = "";

    main_games_select: string = "ALL";

    showVideoModal: boolean = false;

    circles_full: any = [];


    games: any = [];
    circles: any = [];
    circles_static: any = [];
    circles_xg: any = [];
    //filters
    shot_category: string = "ALL";
    shot_location: string = "ALL";
    shot_type:string = "ALL";
    shot_danger:string = "ALL";
    shot_action:string = "ALL";
    shot_side: string = "ALL";

    tooltip_x: number = 0;
    tooltip_y: number = 0;

    selected_shot: any = [];

    filter_zone: string = "";

    //video
    show_video_player: boolean = false;
    video_url: string = "";
    video_url_safe: any;
    video_orderby: string = "time";


    modal_videos: any = [];

    shotmapInfobarOpen: boolean = false;

    //video match
    show_video_player_match: boolean = false;
    video_selected_player: string = "";
    video_selected_match: any;

    players_list: any = [];

    left_stick: any = [];
    right_stick: any = [];

    active_video: string = "";


    @Input() shots: any = [];
    @Input() players: any = [];
    @Input() teams_list: any = [];
    @Input() toi: any=[];
    @Input() filter_team: string = "";
    @Input() filter_goalkeeper: string = "";
    @Input() filter_seasonPart: any;
    @Input() filter_team_input: any;

    show_only_one_shot: boolean = false;

    @ViewChild('canvas') canvas: ElementRef;
    context: CanvasRenderingContext2D;

    @ViewChild("exportpng") exportpng;
    exporting_png: boolean = false;

    //

    @Output() onOpenVideoPlayer: EventEmitter<any> = new EventEmitter<any>();


    constructor(private translate: TranslatePipe, private defaultService: DefaultService, private router: Router, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer) {
        this.sanitizer = sanitizer;
    }

    ngOnInit() {
      console.log('shots..', this.shots);
        if (this.filter_seasonPart != undefined) {
            this.loadData();
        }
    }

    loadData() {
        let uuids = this.filter_seasonPart.split(",");
        console.log("uuids",uuids)

        uuids.forEach((item, index) => {
            var competition_details = JSON.parse(localStorage.getItem("competition_details"));
            console.log("compet. details",competition_details);
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
                                "hokejczId": player["hokejczId"]
                            }
                            localStorage.setItem(player["uuid"], JSON.stringify(key));

                            if(player.stick == "left"){
                                if(this.left_stick.indexOf(player.uuid) === -1){
                                    this.left_stick.push(player.uuid)
                                }
                            }else if(player.stick == "right"){
                                if(this.right_stick.indexOf(player.uuid) === -1){
                                    this.right_stick.push(player.uuid)
                                }
                            }
                        });
                        //load team player list
                        var index: any = this.teams_list.findIndex(x => x.uuid == team["uuid"])
                        if (index === -1) {
                            if (this.filter_team_input == "ALL") {
                                this.teams_list.push({
                                    "uuid": team["uuid"],
                                    "name": team["name"],
                                    "shortName": team["shortName"],
                                    "shortcut": team["shortcut"],
                                    "team": team["uuid"],
                                    "players": ""
                                });
                            } else {
                                if (team['uuid'] == this.filter_team_input) {
                                    this.teams_list.push({
                                        "uuid": team["uuid"],
                                        "name": team["name"],
                                        "shortName": team["shortName"],
                                        "shortcut": team["shortcut"],
                                        "team": team["uuid"],
                                        "players": ""
                                    });
                                }
                            }
                        } else console.log("object already exists")
                    });
                }
            });
        });
    }

    toggleShotmapInfobar() {
      if (this.shotmapInfobarOpen) {
        this.shotmapInfobarOpen = false;
      } else {
        this.shotmapInfobarOpen = true;
      }
    }

    getShotsCount(type: string) {
      let count = 0;
      this.circles_static.forEach((shot) => {
        if (shot.shotDanger === type) {
          count = count + 1;
        }
      });
      return count;
    }

    getXg(type: string) {
      let count = 0;
      this.circles_static.forEach((shot) => {
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
      this.circles_static.forEach((shot) => {
        if (shot.shotDanger === type && shot.type == "G") {
          count = count + 1;
        }
      });
      return count;
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

    getAllXg() {
      let count = 0;
      this.circles_xg.forEach((shot) => {
        count = count + Number(shot.xG);
      });
      if (count > 0) {
        return Math.round((count + Number.EPSILON) * 100) / 100;
      } else {
        return 0;
      }
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

    changePlayer(){
        if(this.filter_goalkeeper != ''){
            this.onChangePlayer.emit(this.filter_goalkeeper)
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

    ngAfterViewInit() {
        this.reloadGames();
    }

    reloadGames() {

        this.graph_scroll = 0;

        let games_list = [];
        this.shots.forEach((item, index) => {
            games_list.push({ id: index, match: item['match'], homeTeam: item['homeTeam'], awayTeam: item['awayTeam'], score: item["score"], matchDate: item['matchDate'], active: true });
        });

        var seenGames = {};
        games_list = games_list.filter(function (currentObject) {
            if (currentObject.match in seenGames) {
                return false;
            } else {
                seenGames[currentObject.match] = true;
                return true;
            }
        });

        games_list.sort(function (a, b) {
            a = new Date(a.matchDate);
            b = new Date(b.matchDate);
            return a > b ? -1 : a < b ? 1 : 0;
        });


        this.games = games_list;


        this.reloadShots();
    }



    reloadShots() {
        let canvas: CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");
        let canvas_width = 760;
        let canvas_height = 760;
        canvas.clearRect(0, 0, canvas_height, canvas_height);


        this.closeVideo();

        this.circles = [];

        let shots_1 = [];
        let shots_2 = [];
        let shots_3 = [];


        this.shots.forEach((item, index) => {
            let top = this.calculateVerticalPositionToPercent(item['x']);
            let left = this.calculateHorizontalPositionToPercent(item['x'], item['y']);
            let pos_x = Math.ceil((760 * left) / 100);
            let pos_y = Math.ceil((760 * top) / 100);
            //console.log(JSON.stringify(item));
            shots_1.push({afterFO:item['afterFO'], long:item['long'],shotDanger:item['shotDanger'], xG:item['xG'], match: item['match'], x: pos_x, y: pos_y, type: item['type'], inSlot: item['inSlot'], time: item['time'], videoId: item['videoId'], videoTime: item['videoTime'], player: item['player'], netZone: item['netZone'], shotAssist: item['shotAssist'], oneTimer: item['oneTimer'], realTime: item['realTime'], matchDate: item['matchDate'], homeTeam: this.getTeamNameShortcut(item['homeTeam']), awayTeam: this.getTeamNameShortcut(item['awayTeam']), score: item['score'], item: item['time'], gameState: item['gameState'], rush: item['rush'], oddManRush: item['oddManRush'], rebounds: item['rebounds'], reboundsCreated: item['reboundsCreated'], forecheck: item['forecheck'], color: 0, download_type: "goalkeeper_shots" });
        });


        shots_1.forEach((shot, index) => {
            this.games.forEach(game => {
                if (game.active == true && game.match == shot.match) {
                    shots_2.push(shot);
                }
            });
        });


        //shots_2 = this.shotAssistFilter(shots_2);

        shots_2 = this.shotLocationFilter(shots_2);
        shots_2 = this.shotTypeFilter(shots_2);
        shots_2 = this.shotActionFilter(shots_2);
        shots_2 = this.shotSideFilter(shots_2);



        this.circles_full = shots_2;


        //mapa bl, br, ul, ur, fh, ce
        if (this.filter_zone == "bl") {
            shots_2.forEach((shot, index) => {
                console.log(JSON.stringify(shot));
                if (shot["netZone"] == "bl") {
                    shots_3.push(shot);
                }
            });
        } else if (this.filter_zone == "br") {
            shots_2.forEach((shot, index) => {
                console.log(JSON.stringify(shot));
                if (shot["netZone"] == "br") {
                    shots_3.push(shot);
                }
            });
        } else if (this.filter_zone == "ul") {
            shots_2.forEach((shot, index) => {
                console.log(JSON.stringify(shot));
                if (shot["netZone"] == "ul") {
                    shots_3.push(shot);
                }
            });
        } else if (this.filter_zone == "ur") {
            shots_2.forEach((shot, index) => {
                console.log(JSON.stringify(shot));
                if (shot["netZone"] == "ur") {
                    shots_3.push(shot);
                }
            });
        } else if (this.filter_zone == "fh") {
            shots_2.forEach((shot, index) => {
                console.log(JSON.stringify(shot));
                if (shot["netZone"] == "fh") {
                    shots_3.push(shot);
                }
            });
        } else if (this.filter_zone == "ce") {
            shots_2.forEach((shot, index) => {
                console.log(JSON.stringify(shot));
                if (shot["netZone"] == "ce") {
                    shots_3.push(shot);
                }
            });
        } else {
            shots_2.forEach((shot, index) => {
                shots_3.push(shot);
            });
        }

        this.circles_xg = shots_3;
        this.circles_xg = this.shotDangerFilter(this.circles_xg);

        this.circles_static = shots_3;
        shots_3 = this.shotCategoryFilter(shots_3);

        shots_3 = this.shotDangerFilter(shots_3);


        this.circles = shots_3;
        this.redrawShotsInGames();

    }

    shotAssistFilter(shots:any[]){

    }

    shotCategorySet(selected:string){
        this.shot_category = selected;
        this.reloadShots();
    }

    shotCategoryFilter(shots:any[]){
        if(this.shot_category == "G"){
            let shots1 = [];
            shots.forEach(shot => {
                //was a goal ?
                if(shot.type == "G"){
                    shots1.push(shot);
                }
            })
            return shots1
        }else{
            let shots1 = [];
            shots.forEach(shot => {
                if(shot.type == "S" || shot.type == "G"){
                    shots1.push(shot);
                }
            })
            return shots1;
        }

    }

    shotLocationSet(selected:string){
        this.shot_location = selected;
        this.reloadShots();
    }

    shotLocationFilter(shots:any[]){
        if(this.shot_location == "slot"){
            let data1 = [];
            //was a shot from slot ?
            shots.forEach(shot => {
                if(shot.inSlot){
                    data1.push(shot);
                }
            })
            return data1;
        }else{
            return shots
        }
    }

    shotTypeSet(selected:string){
        this.shot_type= selected;
        this.reloadShots();
    }

    shotTypeFilter(shots:any[]){
        if(this.shot_type == "z_prvni"){
            let data1 = [];
            shots.forEach(shot => {
                if(shot.oneTimer){
                    data1.push(shot);
                }
            })
            return data1;
        }else if(this.shot_type == "dorazky"){
            let data1 = [];
            shots.forEach(shot => {
                if(shot.rebounds){
                    data1.push(shot);
                }
            })
            return data1;
        }else{
            return shots
        }
    }

    shotDangerSet(selected:string){
        this.shot_danger = selected;
        this.reloadShots();
    }

    shotDangerFilter(shots:any[]){
        if(this.shot_danger == "high"){
            let data1 = [];
            shots.forEach(shot => {
                if(shot.shotDanger == "HD"){
                    data1.push(shot);
                }
            })
            return data1;
        }else if(this.shot_danger == "medium"){
            let data1 = [];
            shots.forEach(shot => {
                if(shot.shotDanger == "MD"){
                    data1.push(shot);
                }
            })
            return data1;
        }else if(this.shot_danger == "low"){
            let data1 = [];
            shots.forEach(shot => {
                if(shot.shotDanger == "LD"){
                    data1.push(shot);
                }
            })
            return data1;
        }else{
            return shots;
        }
    }
    shotActionSet(selected:string){
        this.shot_action = selected;
        this.reloadShots();
    }

    shotActionFilter(shots:any[]){
        if(this.shot_action == "forcek"){
            let data1 = [];
            shots.forEach(shot =>{
                if(shot.forecheck){
                    data1.push(shot);
                }
            })
            return data1;

        }else if(this.shot_action == "rychly_utok"){
            let data1 = [];
            shots.forEach(shot =>{
                if(shot.rush){
                    data1.push(shot);
                }
            })
            return data1;

        }else if(this.shot_action === "dlouhy_utok"){
            let data1 = [];
            shots.forEach(shot =>{
                if(shot.long){
                    data1.push(shot);
                }
            })
            return data1;

        }else if(this.shot_action === "precisleni"){
            let data1 = [];
            shots.forEach(shot =>{
                if(shot.oddManRush){
                    data1.push(shot);
                }
            })
            return data1;

        }else if(this.shot_action === "po_vhazovani"){
            let data1 = [];
            shots.forEach(shot =>{
                if(shot.afterFO){
                    data1.push(shot);
                }
            })
            return data1;

        }else{
            return shots;
        }
    }

    shotSideSet(selected){
        this.shot_side = selected;
        this.reloadShots();
    }

    shotSideFilter(shots:any[]){
        if(this.shot_side === "left"){
            let data1 =[];
            shots.forEach(shot => {
                if(this.left_stick.includes(shot.player)){
                    data1.push(shot);
                }
            })
            return data1;
        }else if(this.shot_side === "right"){
            let data1 =[];
            shots.forEach(shot => {
                if(this.right_stick.includes(shot.player)){
                    data1.push(shot);
                }
            })
            return data1;
        }else{
            return shots;
        }
    }
    ///////////////////////////////////////

    redrawShotsInGames() {
        let new_games = [];

        this.games.forEach(game => {
            game["circles"] = [];

                let counter = 0;

                this.circles.forEach(circle => {
                    if (game.match == circle.match) {
                        counter = counter + 1;
                    }
                });

                game["circles"].push({ count: counter});




            new_games.push(game);

        });



        this.games = new_games;
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

        this.reloadShots();
    }


    toggleGame(id: number) {
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
        this.reloadShots();
    }

    getShotTypeTooltip(type: string) {
        let value = "";
        if (type == "G") {
            value = "Gól";
        }
        else if (type == "S") {
            value = this.translate.transform("strela_na_branku");
        }
        else if (type == "M") {
            value = this.translate.transform("strela_mimo");
        }
        else if (type == "B") {
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

        if (video.type == "G" || video.type == "S" || video.type == "M" || video.type == "B") {
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


    shotClick(shot: any) {
        this.video_url = "";
        this.video_url_safe = "";
        this.active_video = "";

        this.tooltip_x = shot.x;
        this.tooltip_y = shot.y;

        this.selected_shot = shot;
        this.showVideoModal = true;

        //this.drawTrajectory(shot);
    }

    getRoundNumber(value:any, decimals:number){
        return parseFloat(value).toFixed(decimals);
    }


    drawTrajectory(shot: any) {
        let canvas: CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");
        let canvas_width = 600;
        let canvas_height = 600;
        canvas.clearRect(0, 0, canvas_height, canvas_height);

        let draw_canvas: CanvasRenderingContext2D = canvas;

        let stroke_color = "#fff";
        if (this.invert == true) {
            stroke_color = "#000";
        }

        if (shot.shotAssist != null) {
            //assist
            /*
            let top = this.calculateVerticalPositionToPercent(shot.shotAssist.x);
            let left = this.calculateHorizontalPositionToPercent(shot.shotAssist.x, shot.shotAssist.y);
            let pos_x = Math.ceil((600 * left) / 100);
            let pos_y = Math.ceil((600 * top) / 100);

            draw_canvas.beginPath();
            draw_canvas.strokeStyle = stroke_color;
            draw_canvas.lineWidth = 5;
            draw_canvas.moveTo(shot.x, shot.y);
            draw_canvas.lineTo(pos_x, pos_y);
            draw_canvas.stroke();

            draw_canvas.beginPath();
            draw_canvas.arc(pos_x, pos_y, 6, 0, 2 * Math.PI, false);
            draw_canvas.fillStyle = stroke_color;
            draw_canvas.fill();
            draw_canvas.lineWidth = 5;
            draw_canvas.strokeStyle = stroke_color;
            draw_canvas.stroke();
            */
        }


        draw_canvas.beginPath();
        draw_canvas.arc(shot.x, shot.y, 8, 0, 2 * Math.PI, false);
        draw_canvas.fillStyle = '#151d22';
        draw_canvas.fill();
        draw_canvas.lineWidth = 5;
        draw_canvas.strokeStyle = stroke_color;
        draw_canvas.stroke();

    }

    checkExistCircles(circles: any) {
        let count = 0;
        circles.forEach(item => {
            count = count + item['count'];
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
        this.drawTrajectory([]);
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
        this.video_url = "http://hockeylogic.sh10w1.esports.cz/video_player/video.php?starttime=" + time + "&id=" + match_id;
        this.video_url_safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.video_url);
    }


    playVideo(match_id: string, time: string) {
        this.video_url = "";
        this.video_url_safe = "";
        this.active_video = "";

        this.active_video = match_id + '' + time;

        this.video_url = "http://hockeylogic.sh10w1.esports.cz/video_player/video.php?starttime=" + time + "&id=" + match_id;
        this.video_url_safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.video_url);
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

    isGameChecked() {
        let count = 0;
        this.games.forEach(item => {
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
        return (x <= 0) ? position : 100 - position;
    }

    // zrcadlové otočení pro hosty (X hodnoty v kladných číslech)
    calculateVerticalPositionToPercent(x) {
        return (x <= 0) ? Math.ceil(x + 100) : Math.ceil(100 - x);
    }


    invertChanged(invert: boolean) {
        this.closeVideo();
        this.drawTrajectory([]);
        this.onInvertChanged.emit(invert);
    }


    capture() {
        /*
        var node = document.getElementById('shotmap');

        htmlToImage.toPng(node)
            .then(function (dataUrl) {
                var img = new Image();
                img.src = dataUrl;
                document.body.appendChild(img);
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
            */
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

        if (player == "all") {
            this.circles.forEach(item => {
                if (item.match == match.match) {
                    this.modal_videos.push(item);
                }
            });
        } else {
            this.circles.forEach(item => {
                //console.log(JSON.stringify(item));
                if (item.player == player && item.match == match.match) {
                    this.modal_videos.push(item);
                }
            });
        }

        this.modal_videos.sort((a, b) => { return a.time - b.time; })

        if (shot != undefined) {
            let selected_shot = [];
            this.show_only_one_shot = true;

            this.modal_videos.forEach(item => {
                if (shot.match == item.match && shot.x == item.x && shot.y == item.y && shot.time == item.time) {
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
            this.circles.forEach(item => {
                if (item.match == this.video_selected_match.match) {
                    this.modal_videos.push(item);
                }
            });
        } else {
            this.circles.forEach(item => {
                if (item.player == this.video_selected_player && item.match == this.video_selected_match.match) {
                    this.modal_videos.push(item);
                }
            });
        }


        if (this.video_orderby == "time") {
            this.modal_videos.sort(function (a, b) { return a.time - b.time; })
        } else if (this.video_orderby == "players") {
            let videos = this.modal_videos;
            this.modal_videos = [];

            videos.sort(function (a, b) { return a.time - b.time; })

            this.players_list.forEach((item2, index) => {
                videos.forEach(item => {
                    if (item.player == item2.uuid) {
                        item['color'] = index + 1;
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

    download() {
        alert("Toto stáhne soubor videa");
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


    selectGoalZone(zone: string) {
        if (this.filter_zone == zone) {
            this.filter_zone = "";
        } else {
            this.filter_zone = zone;
        }

        this.reloadShots();
    }

    openVideoPlayer() {
        console.log("Modal videos", this.modal_videos)
        this.onOpenVideoPlayer.emit(this.modal_videos);
    }

    getNetZoneNumbers(zone: string) {
        //console.log(JSON.stringify(this.circles_without_last_filter));
        let count = 0;
        let total_count = 0;
        let circles = this.circles_full;

        circles = this.shotCategoryFilter(circles)

        circles.forEach(item => {
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

    openAllVideos() {
        this.video_url = "";
        this.video_url_safe = "";
        this.active_video = "";
        this.modal_videos = [];


        let games_list = [];
        this.games.forEach(item => {
            if (item.active == true) {
                games_list.push(item.match);
            }
        });

        this.circles.forEach(item => {
            if (games_list.includes(item.match)) {
                this.modal_videos.push(item);
            }
        });
        this.modal_videos.sort((a, b) => { return a.time - b.time; });
        this.openVideoPlayer();
    }

    downloadMap() {
        /* this.exporting_png = true; */
        this.closeVideo();
        html2canvas(document.querySelector('.download')).then((canvas) => {
          //this.exportpng.nativeElement.appendChild(canvas);
          canvas.toBlob((blob) => {
            saveAs(blob, "export.png");
          });
          /* this.exporting_png = false; */
        })
    }
}
