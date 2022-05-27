import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '../../pipes/translate.pipe';

import { GamesService } from '../../services/games/games.service';
import { FormationsAnalysisService } from '../../services/formations-analysis/formations-analysis.service';
import { count } from 'rxjs-compat/operator/count';

@Component({
    selector: 'vystupy',
    templateUrl: './vystupy.component.html',
    styleUrls: ['./vystupy.component.scss'],
    providers: [FormationsAnalysisService, DefaultService, GamesService, TranslatePipe]

})

export class VystupyComponent implements OnInit, AfterViewInit {

    @Output() onInvertChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() _downloadMap: EventEmitter<any> = new EventEmitter<any>();
    @Input() shots_team: boolean = false;
    @Input() teams_list_input: any = [];
    @Input() players: any = [];
    @Input() toi: any = [];

    teams_list: any = [];

    @Output() onOpenVideoPlayer: EventEmitter<any> = new EventEmitter<any>();

    @Input() gameslist: any = [];
    @Input() filter_seasonPart: string = "";
    @Input() filter_team: string = "";
    @Input() filter_dateFrom: string = "";
    @Input() filter_dateTo: string = "";
    @Input() filter_lastGames: number;
    @Input() filter_situationType: string = "";
    @Input() filter_situationTime: number;
    @Input() filter_countOfPlayer: string;
    @Input() filter_matchState: string = "";
    @Input() filter_homeAway: string = "";
    @Input() filter_minutes_from: number;
    @Input() filter_minutes_to: number;
    @Input() filter_opponents: any = [];
    @Input() filter_minTOI: number;

    @Input() filter_playerId_select1: string = "";
    @Input() filter_playerId_select2: string = "";
    @Input() filter_playerId_select3: string = "";
    @Input() filter_playerId_select4: string = "";
    @Input() filter_playerId_select5: string = "";
    @Input() filter_playerId_select6: string = "";


    @Input() filter_selected_players1: string = "on";
    @Input() filter_selected_players2: string = "on";
    @Input() filter_selected_players3: string = "on";
    @Input() filter_selected_players4: string = "on";
    @Input() filter_selected_players5: string = "on";
    @Input() filter_selected_players6: string = "on";


    vstupy_data_onice: any = [];
    vstupy_data_individual: any = [];
    vstupy_data_team: any = [];

    kontrolovany_vstup_nahodenie: string = "kontrolovane_vstupy";


    main_games_select: string = "ALL";
    games: any = [];
    players_list: any = [];
    render_pro_proti: string = "PRO";

    invert: boolean = true;

    games_list_loading: boolean = true;

    porovnat_s: string = "";
    zapojeni_hrace: string = "individual";
    vystupy_dle_uspesnosti: string = "ALL";
    //vysledek_vstupu: string = "ALL";
    vystupy_dle_tlaku: string = "ALL";

    zapojeni_hrace_proti: string = "onice";
    //vstupy_dle_uspesnosti_soupere: string = "ALL";

    vystupy_dle_uspesnosti_soupere: string = "ALL";

    shotmapInfobarOpen: boolean = false;
    enter_category: string = "KON";
    enter_danger: string = "ALL";
    dumpin_result: string = "ALL";
    players2:any = [];
    toi2: number = 0;
    xG:number = 0;
    goals: number = 0;
    vysledek_vstupu: string = "ALL";
    vstupy_dle_uspesnosti: string = "ALL";
    count_of_players: number = 0;
    vstupy_dle_uspesnosti_soupere: string = "ALL";

    player_enabled: boolean = false;

    left_data: any = [];
    center_data: any = [];
    right_data: any = [];

    loading: boolean = true;

    enter_end: string = "ALL";

    circles: any = [];

    video_selected_match: string = "";


    //video match
    video_selected_player: string = "";
    video_selected: any;
    active_video: string = "";
    show_video_player: boolean = false;
    video_url: string = "";
    video_url_safe: any;
    video_orderby: string = "time";
    modal_videos: any = [];

    @Output() _loadVystupyProPlayer: EventEmitter<any> = new EventEmitter<any>();
    @Output() _loadVystupyProTeam: EventEmitter<any> = new EventEmitter<any>();
    @Output() _loadVystupyProtiPlayer: EventEmitter<any> = new EventEmitter<any>();
    @Output() _loadVystupyProtiTeam: EventEmitter<any> = new EventEmitter<any>();
    @Output() _loadAllVystupyData: EventEmitter<any> = new EventEmitter<any>();
    @Output() _loadAllVystupyDataProti: EventEmitter<any> = new EventEmitter<any>();


    selected_button_spot: string = "";

    constructor(private formationsAnalysisService: FormationsAnalysisService, private gamesService: GamesService, private translate: TranslatePipe, private defaultService: DefaultService, private router: Router, private activatedRoute: ActivatedRoute, public sanitizer: DomSanitizer) {

    }

    ngOnInit() {
      this.teams_list = this.teams_list_input;
      this.loadAllVystupyData();
      this.checkPlayers();
    }

    ngAfterViewInit() {
      // volani v service commented, protoze pouzivame data z formations-analysis.component, predavane jako @Input skrze gameslist
        // load games
        // this.games_list_loading = true;
        // this.gamesService.getGamesList(this.filter_seasonPart, this.filter_team, "", this.filter_dateFrom, this.filter_dateTo, this.filter_lastGames, this.filter_situationType, this.filter_situationTime).subscribe(loaded_data => {
            // this.games_list = loaded_data;
            // console.log(JSON.stringify(loaded_data));
            this.games_list_loading = false;
            // let games_list = [];
            // loaded_data.forEach((item, index) => {
            //     games_list.push({ id: index, match: item['uuid'], homeTeam: item['homeTeamUuid'], awayTeam: item['awayTeamUuid'], score: item["score"], matchDate: item['date'], active: true });
            // });


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


            this.games = this.gameslist;


            this.reloadPlayers();

            if (this.filter_team !== '') {
              this.loadData();
            } else {
              alert("Vyberte tým");
            }

            console.log("GAMES",this.games)
        // });

    }

    checkPlayers(){
      if(this.players){
        this.players.forEach(element => {
          this.players2.push(element.playerUUID)
        });
      }
    }

    setEnterCategory(filter:string){
        this.shotmapInfobarOpen = false;
        this.enter_category = filter;
        if(this.filter_team != ''){
          this.loadData();
        }else{
          alert("Vyberte tým");
        }
      }

      setEnterSuccess(filter:string){
        this.vystupy_dle_uspesnosti = filter;
        this.vystupy_dle_uspesnosti_soupere = filter;
        this.getVstupy();
      }

      setEnterShot(filter:string){
        this.vysledek_vstupu = filter;
        this.getVstupy();
      }

      setDumpinResult(filter:string){
        this.dumpin_result = filter;
        this.getVstupy();
      }

      setEnterEnd(set:string){
        this.enter_end = set;
        this.getVstupy();
      }

      setEnterDanger(filter:string){
        this.enter_danger = filter;
        this.getVstupy();
      }

      filterEndType(toFilter:any){
        if(this.enter_end == "ALL"){
          return toFilter;
        }else if(this.enter_end == "shot"){
          let filtered = [];
          toFilter.forEach(element => {
            if(element.shot != null){
              filtered.push(element)
            }
          });
          return filtered;
        }else if(this.enter_end == "slotShot"){
          let filtered = [];
          toFilter.forEach(element => {
            if(element.shot != null && element.shot.inSlot){
              filtered.push(element)
            }
          });
          return filtered;
        }
        else if (this.enter_end == "attack"){
          let filtered = [];
          toFilter.forEach(element => {
            if(element.followingEvent == "gain"){
              filtered.push(element)
            }
          });
          return filtered;
        }
        else if (this.enter_end == "loss"){
          let filtered = [];
          toFilter.forEach(element => {
            if(element.followingEvent == "denial"){
              filtered.push(element)
            }
          });
          return filtered;
        }
        else if(this.enter_end == "goal"){
          let filtered = [];
          toFilter.forEach(element => {
            if(element.shot != null && element.shot.type == "G"){
              filtered.push(element)
            }
          });
          return filtered;
        }

      }

      filterEnterDanger(toFilter:any){
        if(this.enter_danger == "ALL"){
          return toFilter;
        }else if(this.enter_danger == "HD"){
          let filtered = [];
          toFilter.forEach(element => {
            if(element.shot != null && element.shot.shotDanger == "HD"){
              filtered.push(element)
            }
          });
          return filtered;
        }
        else if(this.enter_danger == "MD"){
          let filtered = [];
          toFilter.forEach(element => {
            if(element.shot != null && element.shot.shotDanger == "MD"){
              filtered.push(element)
            }
          });
          return filtered;
        }
        else if(this.enter_danger == "LD"){
          let filtered = [];
          toFilter.forEach(element => {
            if(element.shot != null && element.shot.shotDanger == "LD"){
              filtered.push(element)
            }
          });
          return filtered;
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

    reloadPlayers() {
        if (this.shots_team == false && this.players != undefined) {
            this.players.forEach((item, index) => {
                if (item.playerUUID != "") {
                    this.players_list.push({ uuid: item.playerUUID, enabled: item.enabled });
                }
            });
        }

        this.player_enabled = false;
        this.players_list.forEach(item => {
            if (item.enabled == true) {
                this.player_enabled = true;
            }
        });
    }

    renderKontrolovaneNahodenie(selected: string){

        if(selected != "" && selected != undefined){
          this.kontrolovany_vstup_nahodenie = selected;
        }
      this.renderShots();
    }

    invertChanged(invert: boolean) {
        this.onInvertChanged.emit(invert);
    }

    mainGamesSelect(selected: string) {
      if(this.filter_team != ''){
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

          this.loadData();
        }else{
          alert("Vyberte tým");
        }
    }

    renderProProti(selected: string) {
        this.render_pro_proti = selected;
        this.main_games_select = "ALL";

        if (selected == "PRO" ) {
        this.loadAllVystupyData();
        } else if (selected == "PROTI") {
        this.loadAllVystupyDataProti();
        }else if(selected == "PLAYER"){
        this.loadAllVystupyData();
        }

        this.setGoals();
        this.setXg();
        this.renderShots();
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

    dangerFilter(entrie){
        if(this.enter_danger == "ALL"){
          return true;
        }
        else{
          return this.enter_danger == entrie ? true : false;
        }

    }

    checkEnterCategory(type:string){
        if(type == "carry") return true;
        else return false;

    }

    getXgTotalProti(post: string) {
        let count = 0;
        let data1 = [];
        let data2 = [];

        let count_of_players = 0;
        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            count_of_players = count_of_players + 1;
          }
        });

        if (count_of_players == 0) {
          data1 = this.vstupy_data_team["against"][post];

         // console.log("JOJO " + JSON.stringify(this.vstupy_data_team["against"]));
        } else {
          data1 = this.vstupy_data_onice["against"][post];
        }

        //byla strela?
        if(this.enter_category == "KON"){
          data1.forEach((item) => {
            if (this.checkEnterCategory(item["type"]) && this.checkEnterDanger(item)) {
              if (this.vysledek_vstupu == "shot") {
                if (item.shot != null) {
                  if (item["shot"]["inSlot"] == true) {
                    data2.push(item);
                  }
                }
              } else if (this.vysledek_vstupu == "shot_attempt") {
                if (item.shot != null) {
                  data2.push(item);
                }
              } else if (this.vysledek_vstupu == "goal") {
                if (item.shot != null && item["shot"]["type"] == "G") {
                  data2.push(item);
                }
              } else if (this.vysledek_vstupu == "ALL") {
                data2.push(item);
              }
            }
          });

          if (this.vstupy_dle_uspesnosti == "ALL") {
            data2.forEach((item) => {
              if(item.shot != null){
                count = count + Number(item.shot.xG);
              }
            });
          } else if (this.vstupy_dle_uspesnosti == "success") {
            data2.forEach((item) => {
              if (item.successful == true) {
                if(item.shot != null){
                  count = count + Number(item.shot.xG);
                }
              }
            });
          } else if (this.vstupy_dle_uspesnosti == "nosuccess") {
            data2.forEach((item) => {
              if (item.successful != true) {
                if(item.shot != null){
                  count = count + Number(item.shot.xG);
                }
              }
            });
          }
        }else if(this.enter_category == "NAH"){
          data1.forEach(item =>{
            if (this.vysledek_vstupu == "ALL" && this.dangerFilter(item.shotDanger)) {
              data2.push(item);
            }else if(this.vysledek_vstupu == "shot_attempt" && this.dangerFilter(item.shotDanger)){
              if(item.finish != "none"){
                data2.push(item);
              }
            }else if(this.vysledek_vstupu == "shot" && this.dangerFilter(item.shotDanger)){
              if(item.finish == "slotShot"){
                data2.push(item);
              }
            }else if(this.vysledek_vstupu == "goal" && this.dangerFilter(item.shotDanger)){
              if(item.finish == "goal"){
                data2.push(item);
              }
            }
          })
          if (this.dumpin_result == "ALL") {
            data2.forEach((item) => {
              if(item.xG != null){
                count = count + Number(item.xG);
              }
            });
          }else if(this.dumpin_result == "fight"){
            data2.forEach((item) => {
              if(item.battle){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }else if(this.dumpin_result == "stonks"){
            data2.forEach((item) => {
              if(item.battle && item.battleWon){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }else if(this.dumpin_result == "notStonks"){
            data2.forEach((item) => {
              if(item.battle && !item.battleWon){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }else if(this.dumpin_result == "shot"){
            data2.forEach((item) => {
              if(item.finish != "none"){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }
          else if(this.dumpin_result == "slotShot"){
            data2.forEach((item) => {
              if(item.finish == "slotShot"){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }else if(this.dumpin_result == "goal"){
            data2.forEach((item) => {
              if(item.finish == "goal"){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }
        }


        if (count > 0) {
          /* this.xG = Math.round((count + Number.EPSILON) * 100) / 100; */
          return Math.round((count + Number.EPSILON) * 100) / 100;
        } else {
          /* this.xG = 0; */
          return 0;
        }
      }

    playSelectedVideos(side:string,player:string){
        this.video_url = "";
        this.video_url_safe = "";
        this.active_video = "";
        this.modal_videos = [];

        let data1 = [];
        let data2 = [];
        let data3 = [];
        let data4 = [];
        let count_of_players = 0;
        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            count_of_players = count_of_players + 1;
          }
        });

        //data select by count of players and render filter
        if(count_of_players == 0){
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_team["for"][side]
            //
          }
          else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_team["against"][side]
            //
          }

        }else if(count_of_players == 1){
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"][side]
            //
          }
          else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"][side]
            //
          }else if(this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"][side]
            //
          }
        }
        else if(count_of_players >= 1){
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"][side]
            //
          }
          else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"][side]
            //
          }else if(this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"][side]
            //
          }
        }
        //Filters for controled entries

        if(this.enter_category == "KON"){
          data1 = this.filterEnterDanger(data1);
          data1 = this.filterEndType(data1);
          data1.forEach(element => {
            //filter pre uspesnost
            if(this.vystupy_dle_uspesnosti == "ALL" && ((this.render_pro_proti != "PLAYER" && element.type == "carry") || element.player == player)){
              data2.push(element);
            }else if(this.vystupy_dle_uspesnosti == "success" && element.successful && ((this.render_pro_proti != "PLAYER" && element.type == "carry") || element.player == player)){
              data2.push(element);
            }
            else if(this.vystupy_dle_uspesnosti == "nosuccess" && !element.successful && ((this.render_pro_proti != "PLAYER" && element.type == "carry") || element.player == player)){
              data2.push(element);
            }
          });
          data2.forEach(element => {
            if(this.vysledek_vstupu == "ALL"){
              data3.push(element);
            }else if(this.vysledek_vstupu == "shot_attempt" && element.shot != null){
              data3.push(element);
            }
            else if(this.vysledek_vstupu == "shot" && element.shot != null && element.shot.inSlot){
              data3.push(element);
            }
            else if(this.vysledek_vstupu == "goal" && element.shot != null && element.shot.type == "G"){
              data3.push(element);
            }
          });
          data3.forEach(element => {
            if(this.enter_danger == "ALL"){
              data4.push(element);
            }
            else if(element.shot != null && element.shot.shotDanger == this.enter_danger){
              data4.push(element);
            }
          });
          //Filters for dump-ins
        }else if(this.enter_category == "NAH"){
          data1.forEach(element => {
            if(this.vysledek_vstupu == "ALL" && (this.render_pro_proti != "PLAYER" || element.player == player) && this.dangerFilter(element.shotDanger)){
              data2.push(element);
            }else if(this.vysledek_vstupu == "shot_attempt" && element.finish != "none" && (this.render_pro_proti != "PLAYER" || element.player == player) && this.dangerFilter(element.shotDanger)){
              data2.push(element);
            }
            else if(this.vysledek_vstupu == "shot" && element.finish == "slotShot" && (this.render_pro_proti != "PLAYER" || element.player == player) && this.dangerFilter(element.shotDanger)){
              data2.push(element);
            }
            else if(this.vysledek_vstupu == "goal" && element.finish == "goal" && (this.render_pro_proti != "PLAYER" || element.player == player) && this.dangerFilter(element.shotDanger)){
              data2.push(element);
            }
          });

          data2.forEach(element => {
            if(this.dumpin_result == "ALL"){
              data3.push(element);
            }
            else if(this.dumpin_result == "fight" && element.battle){
              data3.push(element);
            }
            else if(this.dumpin_result == "stonks" && element.battleWon){
              data3.push(element);
            }
            else if(this.dumpin_result == "notStonks" && !element.battleWon && element.battle){
              data3.push(element);
            }
            else if(this.dumpin_result == "shot" && element.finish != "none" && (this.render_pro_proti != "PLAYER" || element.player == player)){
              data3.push(element);
            }
            else if(this.dumpin_result == "slotShot" && element.finish == "slotShot" && (this.render_pro_proti != "PLAYER" || element.player == player)){
              data3.push(element);
            }
            else if(this.dumpin_result == "goal" && element.finish == "goal" && (this.render_pro_proti != "PLAYER" || element.player == player)){
              data3.push(element);
            }
          });
          data4 = data3;
        }


        if(data4.length != 0){
          console.log("side",side);
          console.log("data4",data4);

          this.modal_videos = data4;
          this.modal_videos.sort((a, b) => {
            return a.time - b.time;
          });
          this.openVideoPlayer();
        }
    }

    getXgAllTeamPro(post: string) {
        let count = 0;
        let data1 = [];
        let data2 = [];

        let count_of_players = 0;
        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            count_of_players = count_of_players + 1;
          }
        });
        //kotva
        if(count_of_players == 0){
          data1 = this.vstupy_data_team["for"][post];
        }else if(count_of_players > 0){
          data1 = this.vstupy_data_individual["for"][post];
        }
        /* console.log("data1");
        console.log(data1); */
        //byla strela?
        if(this.enter_category == "KON"){
          data1 = this.filterEnterDanger(data1);
          data1 = this.filterEndType(data1);
          data1.forEach((item) => {
            if (this.checkEnterCategory(item["type"]) && this.checkEnterDanger(item)) {
              if (this.vysledek_vstupu == "shot") {
                if (item.shot != null) {
                  if (item["shot"]["inSlot"] == true) {
                    data2.push(item);
                  }
                }
              } else if (this.vysledek_vstupu == "shot_attempt") {
                if (item.shot != null) {
                  data2.push(item);
                }
              } else if (this.vysledek_vstupu == "goal") {
                if (item.shot != null && item["shot"]["type"] == "G") {
                  data2.push(item);
                }
              } else if (this.vysledek_vstupu == "ALL") {
                data2.push(item);
              }
            }
          });


          if (this.vstupy_dle_uspesnosti == "ALL") {
            data2.forEach((item) => {
              if(item.shot != null){
                count = count + Number(item.shot.xG);
              }
            });
          } else if (this.vstupy_dle_uspesnosti == "success") {
            data2.forEach((item) => {
              if (item.successful == true) {
                if(item.shot != null){
                  count = count + Number(item.shot.xG);
                }
              }
            });
          } else if (this.vstupy_dle_uspesnosti == "nosuccess") {
            data2.forEach((item) => {
              if (item.successful != true) {
                if(item.shot != null){
                  count = count + Number(item.shot.xG);
                }
              }
            });
          }
        }else if(this.enter_category == "NAH"){
          data1.forEach(item =>{
            if (this.vysledek_vstupu == "ALL" && this.dangerFilter(item.shotDanger)) {
              data2.push(item);
            }else if(this.vysledek_vstupu == "shot_attempt" && this.dangerFilter(item.shotDanger)){
              if(item.finish != "none"){
                data2.push(item);
              }
            }else if(this.vysledek_vstupu == "shot" && this.dangerFilter(item.shotDanger)){
              if(item.finish == "slotShot"){
                data2.push(item);
              }
            }else if(this.vysledek_vstupu == "goal" && this.dangerFilter(item.shotDanger)){
              if(item.finish == "goal"){
                data2.push(item);
              }
            }
          })
          if (this.dumpin_result == "ALL") {
            data2.forEach((item) => {
              if(item.xG != null){;
                count = count + Number(item.xG);
              }
            });
          }else if(this.dumpin_result == "fight"){
            data2.forEach((item) => {
              if(item.battle){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }else if(this.dumpin_result == "stonks"){
            data2.forEach((item) => {
              if(item.battle && item.battleWon){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }else if(this.dumpin_result == "notStonks"){
            data2.forEach((item) => {
              if(item.battle && !item.battleWon){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }else if(this.dumpin_result == "shot"){
            data2.forEach((item) => {
              if(item.finish != "none"){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }
          else if(this.dumpin_result == "slotShot"){
            data2.forEach((item) => {
              if(item.finish == "slotShot"){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }else if(this.dumpin_result == "goal"){
            data2.forEach((item) => {
              if(item.finish == "goal"){
                if(item.xG != null){
                  count = count + Number(item.xG);
                }
              }
            });
          }
        }


        if (count > 0) {
          /* this.xG = Math.round((count + Number.EPSILON) * 100) / 100; */
          return Math.round((count + Number.EPSILON) * 100) / 100;
        } else {
          /* this.xG = 0; */
          return 0;
        }
    }

    openInfobar(){
        this.shotmapInfobarOpen = !this.shotmapInfobarOpen;
    }

    checkEnterDanger(type:any){

        if(this.enter_danger == "ALL"){
          return true;
        }
        else if(this.enter_danger == "LD" && type.shot != null){
          if(type.shot.shotDanger=="LD" ){
            return true;
          }else{
            return false;
          }
        }
        else if(this.enter_danger == "MD" && type.shot != null){
          if(type.shot.shotDanger=="MD"){
            return true;
          }else{
            return false;
          }
        }
        else if(this.enter_danger == "HD" && type.shot != null){
          if(type.shot.shotDanger=="HD"){
            return true;
          }else{
            return false;
          }
        }else{
          return false;
        }
      }

    getXg(uuid: string, post: string){
        let count = 0;
        let data1 = [];
        let data2 = [];

        let count_of_players = 0;
        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            count_of_players = count_of_players + 1;
          }
        });

        if (count_of_players == 1) {
          data1 = this.vstupy_data_onice["for"][post];
        } else if (count_of_players > 1) {
          data1 = this.vstupy_data_onice["for"][post];
        }

        //byla strela?
        if(this.enter_category == "KON"){
          data1.forEach((item) => {
            if (item.player == uuid && this.checkEnterDanger(item)) {
              if (this.vysledek_vstupu == "shot") {
                if (item.shot != null) {
                  if (item["shot"]["inSlot"] == true) {
                    data2.push(item);
                  }
                }
              } else if (this.vysledek_vstupu == "shot_attempt") {
                if (item.shot != null) {
                  data2.push(item);
                }
              }else if (this.vysledek_vstupu == "ALL") {
                  data2.push(item);
              } else if (this.vysledek_vstupu == "goal") {
                if (item.shot != null && item["shot"]["type"] == "G") {
                  data2.push(item);
                }
              }
            }
          });

          if (this.vstupy_dle_uspesnosti == "ALL") {
            data2.forEach((item) => {
              if(item.shot != null){
                  count = count + Number(item.shot.xG);
              }
            });
          } else if (this.vstupy_dle_uspesnosti == "success") {
            data2.forEach((item) => {
              if (item.successful == true) {
                if(item.shot != null){
                    count = count + Number(item.shot.xG);
                }
              }
            });
          } else if (this.vstupy_dle_uspesnosti == "nosuccess") {
            data2.forEach((item) => {
              if (item.successful != true) {
                if(item.shot != null){
                    count = count + Number(item.shot.xG);
                }
              }
            });
          }
        }else if(this.enter_category == "NAH"){
          data1.forEach((item) => {
            if (item.player == uuid && this.dangerFilter(item.shotDanger)) {
              if (this.vysledek_vstupu == "shot") {
                  if (item.finish == "slotShot") {
                    data2.push(item);
                  }
              } else if (this.vysledek_vstupu == "shot_attempt") {
                if (item.finish != "none") {
                  data2.push(item);
                }
              }else if (this.vysledek_vstupu == "ALL") {
                  data2.push(item);
              } else if (this.vysledek_vstupu == "goal") {
                if (item.finish == "goal") {
                  data2.push(item);
                }
              }
            }
          });

          if(this.dumpin_result == "ALL"){
            data2.forEach(item =>{
                count = count + Number(item.xG);
            })
          }else if(this.dumpin_result == "stonks"){
            data2.forEach(item =>{
              if(item.battleWon){
                  count = count + Number(item.xG);
              }
            })
          }else if(this.dumpin_result == "notStonks"){
            data2.forEach(item =>{
              if(!item.battleWon && item.battle ){
                  count = count + Number(item.xG);
              }
            })
          }else if(this.dumpin_result == "battle"){
            data2.forEach(item =>{
              if(item.battle ){
                  count = count + Number(item.xG);
              }
            })
          }else if(this.dumpin_result == "shot"){
            data2.forEach((item) => {
              if(item.finish != "none"){
                count = count + 1;
              }
            });
          }
          else if(this.dumpin_result == "slotShot"){
            data2.forEach((item) => {
              if(item.finish == "slotShot"){
                count = count + 1;
              }
            });
          }else if(this.dumpin_result == "goal"){
            data2.forEach((item) => {
              if(item.finish == "goal"){
                count = count + 1;
              }
            });
          }
        }


        if (count > 0) {
          /* this.xG = Math.round((count + Number.EPSILON) * 100) / 100; */
          return Math.round((count + Number.EPSILON) * 100) / 100;
        } else {
          /* this.xG = 0; */
          return 0;
        }
    }

    getValueEnterDanger(danger:string){
        let data1 = [];
        let count_of_players = 0;
        let count = 0;

        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            count_of_players = count_of_players + 1;
          }
        });

        if (count_of_players == 0) {
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_team["for"]["total"];

          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_team["against"]["total"];
          }
          data1.forEach(element => {
            if(this.enter_category == "KON"){
              if(element.shot != null){
                if(element.shot.shotDanger == danger){
                    if(element.type == "carry"){
                      count = count + 1;
                    }
                }
              }
            }else{
              if(element.shotDanger != null){
                if(element.shotDanger == danger){
                  count = count + 1;
                }
              }
            }

          });

        }else if(count_of_players == 1){
          if(this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"]["total"];
            console.log("data1",data1)
            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null && this.players2.includes(element.player)){
                  if(element.shot.shotDanger == danger){
                    count = count + 1;
                  }
                }
              }else{
                if(element.shotDanger != null && this.players2.includes(element.player)){
                  if(element.shotDanger == danger){
                    count = count + 1;
                  }
                }
              }
            });
            console.log("Count:", count)
            //
          }else if( this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"]["total"];

            data1.forEach(element => {

              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger){
                      if(element.type == "carry"){
                        count = count + 1;
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger){
                      if(element.type == "carry"){
                        count = count + 1;
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }
        }else if(count_of_players >= 1){
          if(this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"]["total"];

              data1.forEach(element => {
                if(this.enter_category == "KON"){
                  if(element.shot != null && this.players2.includes(element.player)){
                    if(element.shot.shotDanger == danger){
                      count = count + 1;
                    }
                  }
                }else{
                  if(element.shotDanger != null && this.players2.includes(element.player)){
                    if(element.shotDanger == danger){
                      count = count + 1;
                    }
                  }
                }
              });

              console.log("Count:",count)
            //
          }else if( this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger){
                      if(element.type == "carry"){
                        count = count + 1;
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger){
                      if(element.type == "carry"){
                        count = count + 1;
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }
        }
        //console.log("data1",data1)

        return count;
    }

    getXgEnterDanger(danger:string){
        let data1 = [];
        let count_of_players = 0;
        let count = 0;

        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            count_of_players = count_of_players + 1;
          }
        });

        if (count_of_players == 0) {
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_team["for"]["total"];

          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_team["against"]["total"];
          }

          data1.forEach(element => {
            if(this.enter_category == "KON"){
              if(element.shot != null){
                if(element.shot.shotDanger == danger){
                    if(element.type == "carry"){
                      count = count + Number(element.shot.xG);
                    }
                }
              }
            }else{
              if(element.shotDanger != null){
                if(element.shotDanger == danger){
                  count = count + Number(element.xG);
                }
              }
            }

          });

        }else if(count_of_players == 1){
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger){
                      if(element.type == "carry"){
                        count = count + Number(element.shot.xG);
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger){
                    count = count + Number(element.xG);
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null && this.players2.includes(element.player)){
                  if(element.shot.shotDanger == danger){
                    count = count + Number(element.shot.xG);
                  }
                }
              }else{
                if(element.shotDanger != null && this.players2.includes(element.player)){
                  if(element.shotDanger == danger){
                    count = count + Number(element.xG);
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger){
                      if(element.type == "carry"){
                        count = count + Number(element.shot.xG);
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger){
                    count = count + Number(element.xG);
                  }
                }
              }
            });
            //
          }
        }else if(count_of_players >= 1){
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"]["total"];

              data1.forEach(element => {
                if(this.enter_category == "KON"){
                  if(element.shot != null){
                    if(element.shot.shotDanger == danger){
                        if(element.type == "carry"){
                          count = count + Number(element.shot.xG);
                        }
                    }
                  }
                }else{
                  if(element.shotDanger != null){
                    if(element.shotDanger == danger){
                      count = count + Number(element.xG);
                    }
                  }
                }
              });
            //
          }else if( this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null && this.players2.includes(element.player)){
                  if(element.shot.shotDanger == danger){
                    count = count + Number(element.shot.xG);
                  }
                }
              }else{
                if(element.shotDanger != null && this.players2.includes(element.player)){
                  if(element.shotDanger == danger){
                    count = count + Number(element.xG);
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];

              data1.forEach(element => {
                if(this.enter_category == "KON"){
                  if(element.shot != null){
                    if(element.shot.shotDanger == danger){
                        if(element.type == "carry"){
                          count = count + Number(element.shot.xG);
                        }
                    }
                  }
                }else{
                  if(element.shotDanger != null){
                    if(element.shotDanger == danger){
                      count = count + Number(element.xG);
                    }
                  }
                }
              });
            //
          }
        }
        console.log("count",count)
        if (count > 0) {
          return Math.round((count + Number.EPSILON) * 100) / 100;
        } else {
          return 0;
        }

    }

    getGoalseEnterDanger(danger:string){
        let data1 = [];
        let count_of_players = 0;
        let count = 0;

        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            count_of_players = count_of_players + 1;
          }
        });

        if (count_of_players == 0) {
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_team["for"]["total"];

          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_team["against"]["total"];
          }

          /* data1.forEach(element => {
            if(element.shot != null){
              if(element.shot.shotDanger == danger && element.shot.type == "G"){
                count = count + 1;
              }
            }
          }); */
          data1.forEach(element => {
            if(this.enter_category == "KON"){
              if(element.shot != null){
                if(element.shot.shotDanger == danger && element.shot.type == "G"){
                    if(element.type == "carry"){
                      count = count + 1;
                    }
                }
              }
            }else{
              if(element.shotDanger != null){
                if(element.shotDanger == danger && element.finish == "goal"){
                  count = count + 1;
                }
              }
            }
          });

        } else if(count_of_players == 1) {
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger && element.shot.type == "G"){
                      if(element.type == "carry"){
                        count = count + 1;
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger && element.finish == "goal"){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger && element.shot.type == "G" && this.players2.includes(element.player)){
                    count = count + 1;
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger && element.finish == "goal" && this.players2.includes(element.player)){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger && element.shot.type == "G"){
                      if(element.type == "carry"){
                        count = count + 1;
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger && element.finish == "goal"){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }
        }else if(count_of_players >= 1) {
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_onice["for"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger && element.shot.type == "G"){
                      if(element.type == "carry"){
                        count = count + 1;
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger && element.finish == "goal"){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger && element.shot.type == "G" && this.players2.includes(element.player)){
                        count = count + 1;
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger && element.finish == "goal" && this.players2.includes(element.player)){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }else if( this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];

            data1.forEach(element => {
              if(this.enter_category == "KON"){
                if(element.shot != null){
                  if(element.shot.shotDanger == danger && element.shot.type == "G"){
                      if(element.type == "carry"){
                        count = count + 1;
                      }
                  }
                }
              }else{
                if(element.shotDanger != null){
                  if(element.shotDanger == danger && element.finish == "goal"){
                    count = count + 1;
                  }
                }
              }
            });
            //
          }
        }

        return count;
    }

    toggleGame(id: number) {
        this.main_games_select = "SELECTED";
        if(this.filter_team != ''){
        this.games.forEach((item, index) => {
            if (item.id == id) {
                if (item.active == true) {
                    this.games[index]["active"] = false;
                } else {
                    this.games[index]["active"] = true;
                }
            }
        });


          this.loadData();
        }else{
          alert("Vyberte tým");
        }
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
        this.renderShots();
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

    loadData() {

        this.toi2 = 0;
        this.toi.forEach(toi => {
          this.games.forEach(game => {
            if(game.active && game.match == toi.match){
              this.toi2 = this.toi2 + toi.toi;
            }
          });
        });


        this.loading = true;
        let matches = [];
        this.games.forEach(item => {
            if (item.active == true) {
                matches.push(item.match);
            }
        });

        let count_of_players = 0;
        this.players_list.forEach(player => {
            if (player.enabled == true) {
                count_of_players = count_of_players + 1;
            }
        });

        if (matches.length > 0) {
            if (count_of_players == 1) {
                if(this.enter_category == "KON"){
                  this.render_pro_proti = 'PLAYER';
                this.formationsAnalysisService
                  .getZoneExitsIndividual(
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
                    matches
                  )
                  .subscribe(
                    (loaded_data) => {
                      console.log("loaded Player data zone exits", loaded_data)
                      let all_vstupy_for = [];
                      loaded_data["for"]["left"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["center"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["right"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["total"] = all_vstupy_for;

                      let all_vstupy_against = [];
                      loaded_data["against"]["left"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["center"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["right"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["total"] = all_vstupy_against;

                      this.vstupy_data_individual = loaded_data;

                      /* console.log("vstupy_data_individual");
                      console.log(this.vstupy_data_individual); */

                      this.formationsAnalysisService
                        .getFormationZoneExitsOnice(
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
                          matches
                        )
                        .subscribe(
                          (loaded_data) => {
                            let all_vstupy_for = [];
                            loaded_data["for"]["left"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["center"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["right"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["total"] = all_vstupy_for;

                            let all_vstupy_against = [];
                            loaded_data["against"]["left"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["center"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["right"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["total"] = all_vstupy_against;

                            this.vstupy_data_onice = loaded_data;
                            //this.vstupy_data_team = loaded_data;


                            this.loading = false;
                            this.setGoals();
                            this.setXg();
                            this.renderShots();

                          },
                          (err) => {
                            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                          }
                        );


                    },
                    (err) => {
                      //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                    }
                  );
                }else if(this.enter_category == "NAH"){
                  this.render_pro_proti = 'PLAYER';
                this.formationsAnalysisService
                  .getDumpOuts(
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
                    matches
                  )
                  .subscribe(
                    (loaded_data) => {
                      let all_vstupy_for = [];
                      loaded_data["for"]["left"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["center"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["right"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["total"] = all_vstupy_for;

                      let all_vstupy_against = [];
                      loaded_data["against"]["left"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["center"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["right"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["total"] = all_vstupy_against;

                      this.vstupy_data_individual = loaded_data;

                      /* console.log("vstupy_data_individual");
                      console.log(this.vstupy_data_individual); */

                      this.formationsAnalysisService
                        .getDumpOutsFormations(
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
                          matches
                        )
                        .subscribe(
                          (loaded_data) => {
                            let all_vstupy_for = [];
                            loaded_data["for"]["left"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["center"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["right"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["total"] = all_vstupy_for;

                            let all_vstupy_against = [];
                            loaded_data["against"]["left"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["center"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["right"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["total"] = all_vstupy_against;

                            this.vstupy_data_onice = loaded_data;

                           /*  console.log("vstupy_data_onice");
                            console.log(this.vstupy_data_onice); */

                            this.loading = false;

                          },
                          (err) => {
                            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                          }
                        );

                      this.loading = false;
                      this.setGoals();
                      this.setXg();
                      this.renderShots();
                    },
                    (err) => {
                      //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                    }
                  );
                }

              } else if (count_of_players > 1) {
                this.render_pro_proti = 'PLAYER';

                if(this.enter_category == "KON"){
                  this.formationsAnalysisService
                  .getFormationZoneExitsOnice(
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
                    matches
                  )
                  .subscribe(
                    (loaded_data) => {
                      let all_vstupy_for = [];
                      loaded_data["for"]["left"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["center"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["right"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["total"] = all_vstupy_for;

                      let all_vstupy_against = [];
                      loaded_data["against"]["left"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["center"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["right"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["total"] = all_vstupy_against;

                      this.vstupy_data_onice = loaded_data;

                      this.formationsAnalysisService
                        .getZoneExitsIndividual(
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
                          matches
                        )
                        .subscribe(
                          (loaded_data) => {

                            console.log("Loaded Data More Players", loaded_data)
                            let all_vstupy_for = [];
                            loaded_data["for"]["left"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["center"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["right"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["total"] = all_vstupy_for;

                            let all_vstupy_against = [];
                            loaded_data["against"]["left"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["center"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["right"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["total"] = all_vstupy_against;

                            this.vstupy_data_individual = loaded_data;

                            this.loading = false;
                            this.setGoals();
                            this.setXg();
                            this.renderShots();
                          },
                          (err) => {
                            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                          }
                        );
                    },
                    (err) => {
                      //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                    }
                  );
                }else if(this.enter_category == "NAH"){
                  this.formationsAnalysisService
                  .getDumpOutsFormations(
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
                    matches
                  )
                  .subscribe(
                    (loaded_data) => {
                      let all_vstupy_for = [];
                      loaded_data["for"]["left"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["center"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["right"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["total"] = all_vstupy_for;

                      let all_vstupy_against = [];
                      loaded_data["against"]["left"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["center"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["right"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["total"] = all_vstupy_against;

                      this.vstupy_data_onice = loaded_data;

                      this.formationsAnalysisService
                        .getDumpOuts(
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
                          matches
                        )
                        .subscribe(
                          (loaded_data) => {
                            let all_vstupy_for = [];
                            loaded_data["for"]["left"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["center"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["right"].forEach((vstup) => {
                              all_vstupy_for.push(vstup);
                            });
                            loaded_data["for"]["total"] = all_vstupy_for;

                            let all_vstupy_against = [];
                            loaded_data["against"]["left"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["center"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["right"].forEach((vstup) => {
                              all_vstupy_against.push(vstup);
                            });
                            loaded_data["against"]["total"] = all_vstupy_against;

                            this.vstupy_data_individual = loaded_data;

                            this.loading = false;
                            this.setGoals();
                            this.setXg();
                            this.renderShots();
                          },
                          (err) => {
                            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                          }
                        );
                    },
                    (err) => {
                      //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                    }
                  );
                }

              } else if (count_of_players == 0) {
                if(this.enter_category == "KON"){
                  this.formationsAnalysisService
                  .getZoneExitsIndividual(
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
                    matches
                  )
                  .subscribe(
                    (loaded_data) => {

                      let all_vstupy_for = [];
                      loaded_data["for"]["left"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["center"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["right"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["total"] = all_vstupy_for;

                      let all_vstupy_against = [];
                      loaded_data["against"]["left"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["center"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["right"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["total"] = all_vstupy_against;

                      this.vstupy_data_team = loaded_data;

                     /*  console.log("vstupy_data_individual");
                      console.log(this.vstupy_data_individual) */

                      this.setGoals();
                      this.setXg();

                      this.loading = false;
                      this.renderShots();
                    },
                    (err) => {
                      //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                    }
                  )
                }else if(this.enter_category == "NAH"){

                  this.formationsAnalysisService.getDumpOuts(
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
                      matches
                  ).subscribe((loaded_data)=>{
                    console.log("DumpOuts data:", loaded_data)
                    let all_vstupy_for = [];
                      loaded_data["for"]["left"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["center"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["right"].forEach((vstup) => {
                        all_vstupy_for.push(vstup);
                      });
                      loaded_data["for"]["total"] = all_vstupy_for;

                      let all_vstupy_against = [];
                      loaded_data["against"]["left"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["center"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["right"].forEach((vstup) => {
                        all_vstupy_against.push(vstup);
                      });
                      loaded_data["against"]["total"] = all_vstupy_against;

                      this.vstupy_data_team = loaded_data;

                      /* console.log("loaded DumpIns");
                      console.log(this.vstupy_data_team); */
                      this.setGoals();
                      this.setXg();
                      this.loading = false;
                      this.renderShots();
                    ;
                  },(err) => {
                    //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                  })
                }



              }
        } else {
            this.loading = false;
        }

    }

    getValue(uuid: string, post: string) {
        let count = 0;

        let data1 = [];
        let data2 = [];

        let count_of_players = 0;
        this.players_list.forEach(player => {
            if (player.enabled == true) {
                count_of_players = count_of_players + 1;
            }
        });

        if (count_of_players == 1) {
            data1 = this.vstupy_data_onice["for"][post];
        }else if (count_of_players > 1) {
            data1 = this.vstupy_data_onice["for"][post];
        }
        console.log("uuid", uuid)

        if(this.enter_category == "KON"){
          data1 = this.filterEnterDanger(data1);
          data1 = this.filterEndType(data1);

          data1.forEach(item => {
              if (item.player == uuid) {
                  if (this.vystupy_dle_tlaku == "pod_tlakem") {
                      if (item.underPressure == true) {
                          data2.push(item);
                      }
                  } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                      if (item.underPressure == false) {
                          data2.push(item);
                      }
                  } else if (this.vystupy_dle_tlaku == "ALL") {
                      data2.push(item);
                  }
              }
          });
          if (this.vystupy_dle_uspesnosti == "ALL") {
              data2.forEach(item => {
                  count = count + 1;
              });
          } else if (this.vystupy_dle_uspesnosti == "success") {
              data2.forEach(item => {
                  if (item.successful == true) {
                      count = count + 1;
                  }
              });
          } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
              data2.forEach(item => {
                  if (item.successful != true) {
                      count = count + 1;
                  }
              });
          }
        }else if(this.enter_category == "NAH"){
          data1.forEach(item => {
            if (item.player == uuid && this.dangerFilter(item.shotDanger)) {
              data2.push(item);
            }
          });
          if (this.dumpin_result == "ALL") {
            data2.forEach((item) => {
                count = count + 1;

            });
          }else if(this.dumpin_result == "fight"){
            data2.forEach((item) => {
              if(item.battle){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "stonks"){
            data2.forEach((item) => {
              if(item.battle && item.battleWon){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "notStonks"){
            data2.forEach((item) => {
              if(item.battle && !item.battleWon){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "shot"){
            data2.forEach((item) => {
              if(item.finish != "none"){
                count = count + 1;
              }
            });
          }else if(this.dumpin_result == "slotShot"){
            data2.forEach((item) => {
              if(item.finish == "slotShot"){
                count = count + 1;
              }
            });
          }else if(this.dumpin_result == "goal"){
            data2.forEach((item) => {
              if(item.finish == "goal"){
                count = count + 1;
              }
            });
          }
        }

        return count;
    }

    setGoals(){
        let data1 = [];
        let active_players = [];

        let count_of_players = 0;
        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            active_players.push(player.uuid);
            count_of_players = count_of_players + 1;
          }
        });

        if(count_of_players == 0){
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_team["for"]["total"];
          }else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_team["against"]["total"];
          }
        }else if(count_of_players == 1){
          //
          if(this.render_pro_proti == "PLAYER" || this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"]["total"];
            //
          }else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];
            //
          }
        }else if(count_of_players > 1){
          if(this.render_pro_proti == "PLAYER" || this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_onice["for"]["total"];
          }else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];
          }
        }


        this.goals = 0;
        data1.forEach(element => {
          if(element.shot != null && this.enter_category == "KON"){
            if(element.shot.type == "G" && active_players.includes(element["player"]) && this.render_pro_proti == "PLAYER"){

              this.goals = this.goals + 1;
            }else if(element.shot.type == "G" && (this.render_pro_proti == "PRO" || this.render_pro_proti == "PROTI") && element.type == "carry"){

              this.goals = this.goals + 1;
            }
          }else if(this.enter_category == "NAH" && element.finish == "goal" ){
            if(active_players.includes(element["player"]) && this.render_pro_proti == "PLAYER"){

              this.goals = this.goals + 1;
            }else if(this.render_pro_proti == "PRO" || this.render_pro_proti == "PROTI"){

              this.goals = this.goals + 1;
            }

          }
        });
    }

      setXg(){
        let count = 0;
        let data1 = [];
        let active_players = [];

        let count_of_players = 0;
        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            active_players.push(player.uuid);
            count_of_players = count_of_players + 1;
          }
        });

        if (count_of_players == 1) {
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"]["total"];
            //
          }else if(this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_individual["for"]["total"];
            //
          }else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];
            //
          }
        } else if (count_of_players > 1) {
          //
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_individual["for"]["total"];
            //
          }else if(this.render_pro_proti == "PLAYER"){
            data1 = this.vstupy_data_onice["for"]["total"];
            //
          }else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_onice["against"]["total"];
            //
          }
        }else if(count_of_players == 0){
          if(this.render_pro_proti == "PRO"){
            data1 = this.vstupy_data_team["for"]["total"];
          }else if(this.render_pro_proti == "PROTI"){
            data1 = this.vstupy_data_team["against"]["total"];
          }
        }

      if(this.enter_category == "KON"){
        data1.forEach(element => {
          if(active_players.includes(element["player"]) && this.render_pro_proti == "PLAYER"){
            if(element.shot != null){
              count = count +  Number(element.shot.xG);
            }
          }else if((this.render_pro_proti == "PRO" || this.render_pro_proti == "PROTI") && element.type == "carry") {
            if(element.shot != null){
              count = count +  Number(element.shot.xG)
            }
          }

        });
      }else if(this.enter_category == "NAH"){
        data1.forEach(element => {
          if(active_players.includes(element["player"]) && this.render_pro_proti == "PLAYER"){
            if(element.xG != null){
              count = count +  Number(element.xG)
            }
          }else if(this.render_pro_proti == "PRO" || this.render_pro_proti == "PROTI"){
            if(element.xG != null){
              count = count +  Number(element.xG)
            }
          }

        });
      }
        this.xG = Math.round((count + Number.EPSILON) * 100) / 100;
    }

    getValueAllTeamPro(post: string) {
        let count = 0;
        let data1 = [];
        let data2 = [];

        let count_of_players = 0;
        let active_players = [];

        this.players_list.forEach((player) => {
          if (player.enabled == true) {
            active_players.push(player.uuid);
            count_of_players = count_of_players + 1;
          }
        });
        if(count_of_players == 0){
          data1 = this.vstupy_data_team["for"][post];
        }else if(count_of_players > 0){
          data1 = this.vstupy_data_individual["for"][post];
        }


        //byla strela?
        if(this.enter_category == "KON"){
          data1 = this.filterEnterDanger(data1);
          data1 = this.filterEndType(data1);
          data1.forEach(item => {
              if (this.vystupy_dle_tlaku == "pod_tlakem") {
                  if (item.underPressure == true) {
                      data2.push(item);
                  }
              } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                  if (item.underPressure == false) {
                      data2.push(item);
                  }
              } else if (this.vystupy_dle_tlaku == "ALL") {
                  data2.push(item);
              }
          });

          if (this.vystupy_dle_uspesnosti == "ALL") {
              data2.forEach(item => {
                  count = count + 1;
              });
          } else if (this.vystupy_dle_uspesnosti == "success") {
              data2.forEach(item => {
                  if (item.successful == true) {
                      count = count + 1;
                  }
              });
          } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
              data2.forEach(item => {
                  if (item.successful != true) {
                      count = count + 1;
                  }
              });
          }
        }else if(this.enter_category == "NAH"){
          data1.forEach(item =>{
            if (this.vysledek_vstupu == "ALL" && this.dangerFilter(item.shotDanger)) {
              data2.push(item);
            }else if(this.vysledek_vstupu == "shot_attempt" && this.dangerFilter(item.shotDanger)){
              if(item.finish != "none"){
                data2.push(item);
              }
            }else if(this.vysledek_vstupu == "shot" && this.dangerFilter(item.shotDanger)){
              if(item.finish == "slotShot"){
                data2.push(item);
              }
            }else if(this.vysledek_vstupu == "goal" && this.dangerFilter(item.shotDanger)){
              if(item.finish == "goal"){
                data2.push(item);
              }
            }
          })
          if (this.dumpin_result == "ALL") {
            data2.forEach((item) => {
                count = count + 1;

            });
          }else if(this.dumpin_result == "fight"){
            data2.forEach((item) => {
              if(item.battle){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "stonks"){
            data2.forEach((item) => {
              if(item.battle && item.battleWon){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "notStonks"){
            data2.forEach((item) => {
              if(item.battle && !item.battleWon){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "shot"){
            data2.forEach((item) => {
              if(item.finish != "none"){
                count = count + 1;
              }
            });
          }
          else if(this.dumpin_result == "slotShot"){
            data2.forEach((item) => {
              if(item.finish == "slotShot"){
                count = count + 1;
              }
            });
          }else if(this.dumpin_result == "goal"){
            data2.forEach((item) => {
              if(item.finish == "goal"){
                count = count + 1;
              }
            });
          }
        }

        return count;
    }

    getValueTotalProti(post: string) {
        let count = 0;

        let data1 = [];
        let data2 = [];


        let count_of_players = 0;
        this.players_list.forEach(player => {
            if (player.enabled == true) {
                count_of_players = count_of_players + 1;
            }
        });

        if (count_of_players == 0) {
            data1 = this.vstupy_data_team["against"][post];

        } else {
            data1 = this.vstupy_data_onice["against"][post];
        }


        //byla strela?
        if(this.enter_category == "KON"){
          data1 = this.filterEnterDanger(data1);
          data1 = this.filterEndType(data1);
          data1.forEach(item => {
              if (this.vystupy_dle_tlaku == "pod_tlakem") {
                  if (item.underPressure == true) {
                      data2.push(item);
                  }
              } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                  if (item.underPressure == false) {
                      data2.push(item);
                  }
              } else if (this.vystupy_dle_tlaku == "ALL") {
                  data2.push(item);
              }
          });

          if (this.vystupy_dle_uspesnosti == "ALL") {
              data2.forEach(item => {
                  count = count + 1;
              });
          } else if (this.vystupy_dle_uspesnosti == "success") {
              data2.forEach(item => {
                  if (item.successful == true) {
                      count = count + 1;
                  }
              });
          } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
              data2.forEach(item => {
                  if (item.successful != true) {
                      count = count + 1;
                  }
              });
          }
        }else if(this.enter_category == "NAH"){
          data1.forEach(item =>{
            if (this.vysledek_vstupu == "ALL" && this.dangerFilter(item.shotDanger)) {
              data2.push(item);
            }else if(this.vysledek_vstupu == "shot_attempt" && this.dangerFilter(item.shotDanger)){
              if(item.finish != "none"){
                data2.push(item);
              }
            }else if(this.vysledek_vstupu == "shot" && this.dangerFilter(item.shotDanger)){
              if(item.finish == "slotShot"){
                data2.push(item);
              }
            }else if(this.vysledek_vstupu == "goal" && this.dangerFilter(item.shotDanger)){
              if(item.finish == "goal"){
                data2.push(item);
              }
            }
          })
          if (this.dumpin_result == "ALL") {
            data2.forEach((item) => {
                count = count + 1;

            });
          }else if(this.dumpin_result == "fight"){
            data2.forEach((item) => {
              if(item.battle){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "stonks"){
            data2.forEach((item) => {
              if(item.battle && item.battleWon){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "notStonks"){
            data2.forEach((item) => {
              if(item.battle && !item.battleWon){
                  count = count + 1;

              }
            });
          }else if(this.dumpin_result == "shot"){
            data2.forEach((item) => {
              if(item.finish != "none"){
                count = count + 1;
              }
            });
          }
          else if(this.dumpin_result == "slotShot"){
            data2.forEach((item) => {
              if(item.finish == "slotShot"){
                count = count + 1;
              }
            });
          }else if(this.dumpin_result == "goal"){
            data2.forEach((item) => {
              if(item.finish == "goal"){
                count = count + 1;
              }
            });
          }
        }

        return count;
    }


    getValueAllTeamProti(post: string) {
        let count = 0;

        let data1 = [];
        let data2 = [];


        data1 = this.vstupy_data_team["against"][post];


        //byla strela?
        data1.forEach(item => {
            data2.push(item);
        });

        data2.forEach(item => {
            count = count + 1;
        });

        return count;
    }



    getValueProtiHracemZamezene(uuid: string, post: string) {
        let count = 0;

        let data1 = [];
        let data2 = [];


        data1 = this.vstupy_data_onice["against"][post];

        data1.forEach(vstup => {
            data2.push(vstup);
            count = count + 1;
        });

        return count;
    }

    getVstupy() {
        let post = "total";
        let data1 = [];
        let data2 = [];
        let data3 = [];


        let count_of_players = 0;
        let active_players = [];
        this.players_list.forEach(player => {
            if (player.enabled == true) {
                count_of_players = count_of_players + 1;
                active_players.push(player.uuid);

            }
        });

        if (this.render_pro_proti == "PRO" || this.render_pro_proti == "PLAYER") {
            if (count_of_players == 1) {
              console.log("Exits data",this.vstupy_data_individual)
                data1 = this.vstupy_data_individual["for"][post];
                /* data1.forEach(element => {
                  if(element.type != 'carry'){
                  }
                }); */
                //byla strela?
                data1 = this.filterEnterDanger(data1);
                data1 = this.filterEndType(data1);
                data1.forEach(item => {
                    if (active_players.includes(item["player"])) {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    }
                });

                if (this.vystupy_dle_uspesnosti == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }

            } else if (count_of_players > 1) {
                data1 = this.vstupy_data_onice["for"]["total"];
                data1 = this.filterEnterDanger(data1);
                data1 = this.filterEndType(data1);
                data1.forEach(item => {
                    if (active_players.includes(item["player"])) {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    }
                });

                if (this.vystupy_dle_uspesnosti == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }
            } else if (count_of_players == 0) {
              data1 = this.vstupy_data_team["for"]["total"];

              data1 = this.filterEnterDanger(data1);
              data1 = this.filterEndType(data1);
              data1.forEach(item => {
                  if (this.vystupy_dle_tlaku == "pod_tlakem") {
                      if (item.underPressure == true) {
                          data2.push(item);
                      }
                  } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                      if (item.underPressure == false) {
                          data2.push(item);
                      }
                  } else if (this.vystupy_dle_tlaku == "ALL") {
                      data2.push(item);
                  }
              });

              if (this.vystupy_dle_uspesnosti == "ALL") {
                  data2.forEach(item => {
                      data3.push(item);
                  });
              } else if (this.vystupy_dle_uspesnosti == "success") {
                  data2.forEach(item => {
                      if (item.successful == true) {
                          data3.push(item);
                      }
                  });
              } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                  data2.forEach(item => {
                      if (item.successful != true) {
                          data3.push(item);
                      }
                  });
              }
            }
        } else if (this.render_pro_proti == "PROTI") {
            if (count_of_players == 1) {
                if (this.zapojeni_hrace_proti == "onice") {
                    data1 = this.vstupy_data_onice["against"][post];
                    //byla strela?
                    data1.forEach(item => {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    });

                    if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                        data2.forEach(item => {
                            data3.push(item);
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                        data2.forEach(item => {
                            if (item.successful == true) {
                                data3.push(item);
                            }
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                        data2.forEach(item => {
                            if (item.successful != true) {
                                data3.push(item);
                            }
                        });
                    }
                } else if (this.zapojeni_hrace_proti == "individual") {
                    data1 = this.vstupy_data_individual["against"][post];

                    data1.forEach(item => {
                        data3.push(item);
                    });

                }
            } else if (count_of_players > 1) {
                if (this.zapojeni_hrace_proti == "onice") {
                    data1 = this.vstupy_data_onice["against"][post];
                    //byla strela?
                    data1.forEach(item => {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    });

                    if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                        data2.forEach(item => {
                            data3.push(item);
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                        data2.forEach(item => {
                            if (item.successful == true) {
                                data3.push(item);
                            }
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                        data2.forEach(item => {
                            if (item.successful != true) {
                                data3.push(item);
                            }
                        });
                    }
                } else if (this.zapojeni_hrace_proti == "individual") {
                    data1 = this.vstupy_data_onice["against"][post];
                    //byla strela?
                    data1.forEach(item => {
                        data3.push(item);
                    });
                }
            } else if (count_of_players == 0) {
                if (this.zapojeni_hrace_proti == "onice") {
                    data1 = this.vstupy_data_team["against"][post];
                    //byla strela?
                    data1.forEach(item => {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    });

                    if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                        data2.forEach(item => {
                            data3.push(item);
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                        data2.forEach(item => {
                            if (item.successful == true) {
                                data3.push(item);
                            }
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                        data2.forEach(item => {
                            if (item.successful != true) {
                                data3.push(item);
                            }
                        });
                    }
                } else if (this.zapojeni_hrace_proti == "individual") {
                    data1 = this.vstupy_data_team["against"][post];

                    data1.forEach(item => {
                        data3.push(item);
                    });
                }
            }
        }

        console.log("data3", data3)
        return data3;

    }

    showLoadedData() {
        let matches = [];
        this.games.forEach(item => {
            if (item.active == true) {
                matches.push(item.match);
            }
        });
        if (matches.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    playBuly(player: string, post: string) {

        this.video_selected_player = "";

        this.video_url = "";
        this.video_url_safe = "";
        this.active_video = "";

        this.modal_videos = [];

        let count = 0;
        let data1 = [];
        let data2 = [];
        let data3 = [];

        let count_of_players = 0;
        let active_players = [];
        this.players_list.forEach(player => {
            if (player.enabled == true) {
                count_of_players = count_of_players + 1;
                active_players.push(player.uuid);

            }
        });


        if (this.render_pro_proti == "PRO") {
            if (count_of_players == 1) {
                data1 = this.vstupy_data_individual["for"][post];
                //byla strela?
                data1 = this.filterEnterDanger(data1);
                data1 = this.filterEndType(data1);
                data1.forEach(item => {
                    if (active_players.includes(item["player"])) {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    }
                });

                if (this.vystupy_dle_uspesnosti == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }
            } else if (count_of_players > 1) {
                data1 = this.vstupy_data_onice["for"][post];
                //byla strela?
                data1 = this.filterEnterDanger(data1);
                data1 = this.filterEndType(data1);
                data1.forEach(item => {
                    if (item["player"] == player) {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    }
                });

                if (this.vystupy_dle_uspesnosti == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }
            } else if (count_of_players == 0) {
                data1 = this.vstupy_data_team["for"][post];
                //byla strela?
                data1 = this.filterEnterDanger(data1);
                data1 = this.filterEndType(data1);
                data1.forEach(item => {
                    if (this.vystupy_dle_tlaku == "pod_tlakem") {
                        if (item.underPressure == true) {
                            data2.push(item);
                        }
                    } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                        if (item.underPressure == false) {
                            data2.push(item);
                        }
                    } else if (this.vystupy_dle_tlaku == "ALL") {
                        data2.push(item);
                    }
                });

                if (this.vystupy_dle_uspesnosti == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }
            }
        } else if (this.render_pro_proti == "PROTI") {
            if (count_of_players == 1) {
                data1 = this.vstupy_data_onice["against"][post];
                //byla strela?

                if (this.zapojeni_hrace_proti == "onice") {
                    data1.forEach(item => {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    });

                    if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                        data2.forEach(item => {
                            data3.push(item);
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                        data2.forEach(item => {
                            if (item.successful == true) {
                                data3.push(item);
                            }
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                        data2.forEach(item => {
                            if (item.successful != true) {
                                data3.push(item);
                            }
                        });
                    }
                } else if (this.zapojeni_hrace_proti == "individual") {
                    data1.forEach(item => {
                        data3.push(item);
                    });
                }
            } else if (count_of_players > 1) {
                data1 = this.vstupy_data_onice["against"][post];
                //byla strela?
                data1.forEach(item => {
                    if (this.vystupy_dle_tlaku == "pod_tlakem") {
                        if (item.underPressure == true) {
                            data2.push(item);
                        }
                    } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                        if (item.underPressure == false) {
                            data2.push(item);
                        }
                    } else if (this.vystupy_dle_tlaku == "ALL") {
                        data2.push(item);
                    }
                });

                if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }
            } else if (count_of_players == 0) {
                data1 = this.vstupy_data_team["against"][post];
                //byla strela?
                data1.forEach(item => {
                    if (this.vystupy_dle_tlaku == "pod_tlakem") {
                        if (item.underPressure == true) {
                            data2.push(item);
                        }
                    } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                        if (item.underPressure == false) {
                            data2.push(item);
                        }
                    } else if (this.vystupy_dle_tlaku == "ALL") {
                        data2.push(item);
                    }
                });

                if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }
            }
        }





        data3.forEach((item, index) => {
            let color = 0;
            let player_uuid = "";
            if (player == "") {
                player_uuid = item["player"];
            } else {
                player_uuid = player;
            }
            this.modal_videos.push({
                index: 0,
                player: player_uuid,
                color: color,
                videoId: item["videoId"],
                time: item["time"],
                videoTime: item["videoTime"],
                homeTeam: item["homeTeam"],
                awayTeam: item["awayTeam"],
                matchDate: item["matchDate"],
                realTime: item["realTime"],
                score: item["score"],
                download_type: "vstup",
                gameState: item["gameState"],
                vstup_successful: item["successful"]
            });
            count = count + 1;
        });

        this.modal_videos.sort((a, b) => { return a.time - b.time; });

        if (count > 0) {
            //this.show_video_player = true;
            this.openVideoPlayer();
        } else {
            alert("Pro tuto pozici neexistují vstupy.")
        }
    }

    renderShots() {

      this.circles = [];

        let data1 = [];
        let data2 = [];
        let data3 = [];

        let active_players = [];
        let count_of_players = 0;
        this.players_list.forEach(player => {
            if (player.enabled == true) {
                active_players.push(player.uuid);
                count_of_players = count_of_players + 1;

            }
        });


        if (this.render_pro_proti == "PRO", this.render_pro_proti == "PLAYER") {
            if (count_of_players == 1) {
                data1 = this.vstupy_data_individual["for"]["total"];

                data1 = this.filterEnterDanger(data1);
                data1 = this.filterEndType(data1);
                data1.forEach(item => {
                    if (active_players.includes(item["player"])) {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    }
                });

                if (this.vystupy_dle_uspesnosti == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }

            } else if (count_of_players > 1) {
                data1 = this.vstupy_data_onice["for"]["total"];
                data1 = this.filterEnterDanger(data1);
                data1 = this.filterEndType(data1);
                data1.forEach(item => {
                    if (active_players.includes(item["player"])) {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    }
                });

                if (this.vystupy_dle_uspesnosti == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }
            } else if (count_of_players == 0) {
                data1 = this.vstupy_data_team["for"]["total"];
                data1 = this.filterEnterDanger(data1);
                data1 = this.filterEndType(data1);
                //byla strela?
                data1.forEach(item => {
                    if (this.vystupy_dle_tlaku == "pod_tlakem") {
                        if (item.underPressure == true) {
                            data2.push(item);
                        }
                    } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                        if (item.underPressure == false) {
                            data2.push(item);
                        }
                    } else if (this.vystupy_dle_tlaku == "ALL") {
                        data2.push(item);
                    }
                });

                if (this.vystupy_dle_uspesnosti == "ALL") {
                    data2.forEach(item => {
                        data3.push(item);
                    });
                } else if (this.vystupy_dle_uspesnosti == "success") {
                    data2.forEach(item => {
                        if (item.successful == true) {
                            data3.push(item);
                        }
                    });
                } else if (this.vystupy_dle_uspesnosti == "nosuccess") {
                    data2.forEach(item => {
                        if (item.successful != true) {
                            data3.push(item);
                        }
                    });
                }

            }
        } else if (this.render_pro_proti == "PROTI") {
            if (this.zapojeni_hrace_proti == "onice") {
                if (count_of_players == 1) {
                    data1 = this.vstupy_data_onice["against"]["total"];
                    data1 = this.filterEnterDanger(data1);
                    data1 = this.filterEndType(data1);
                    data1.forEach(item => {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    });

                    if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                        data2.forEach(item => {
                            data3.push(item);
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                        data2.forEach(item => {
                            if (item.successful == true) {
                                data3.push(item);
                            }
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                        data2.forEach(item => {
                            if (item.successful != true) {
                                data3.push(item);
                            }
                        });
                    }

                } else if (count_of_players > 1) {
                    data1 = this.vstupy_data_onice["against"]["total"];
                    data1 = this.filterEnterDanger(data1);
                    data1 = this.filterEndType(data1);
                    data1.forEach(item => {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    });

                    if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                        data2.forEach(item => {
                            data3.push(item);
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                        data2.forEach(item => {
                            if (item.successful == true) {
                                data3.push(item);
                            }
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                        data2.forEach(item => {
                            if (item.successful != true) {
                                data3.push(item);
                            }
                        });
                    }


                } else if (count_of_players == 0) {
                    data1 = this.vstupy_data_team["against"]["total"];
                    data1 = this.filterEnterDanger(data1);
                    data1 = this.filterEndType(data1);
                    data1.forEach(item => {
                        if (this.vystupy_dle_tlaku == "pod_tlakem") {
                            if (item.underPressure == true) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "bez_tlaku") {
                            if (item.underPressure == false) {
                                data2.push(item);
                            }
                        } else if (this.vystupy_dle_tlaku == "ALL") {
                            data2.push(item);
                        }
                    });

                    if (this.vystupy_dle_uspesnosti_soupere == "ALL") {
                        data2.forEach(item => {
                            data3.push(item);
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "success") {
                        data2.forEach(item => {
                            if (item.successful == true) {
                                data3.push(item);
                            }
                        });
                    } else if (this.vystupy_dle_uspesnosti_soupere == "nosuccess") {
                        data2.forEach(item => {
                            if (item.successful != true) {
                                data3.push(item);
                            }
                        });
                    }

                }
            } else if (this.zapojeni_hrace_proti == "individual") {
                //sakra kdyz je zamezenej tak prece nema strelu... no nevadi
                if (count_of_players == 0) {
                    data1 = this.vstupy_data_team["against"]["total"];
                } else {
                    data1 = this.vstupy_data_onice["against"]["total"];
                    data1.forEach(vstup => {
                        data3.push(vstup);
                    });
                }

            }
        }

        this.circles = [];
        data3.forEach(item => {
            if (item["shot"] != null) {
                let top = this.calculateVerticalPositionToPercent(item['shot']['x']);
                let left = this.calculateHorizontalPositionToPercent(item['shot']['x'], item['shot']['y']);
                let pos_x = Math.ceil((600 * left) / 100);
                let pos_y = Math.ceil((600 * top) / 100);

                this.circles.push({
                    color: this.getShooter(item["shot"]["player"]),
                    x: pos_x,
                    y: pos_y,
                    data: item
                });
            }
        });

        this.circles = this.removeDupliactes(this.circles);

        this.redrawVstupyInGames();

    }

    shotClick(shot: any) {
        console.log("Kliknuta strela " + JSON.stringify(shot));
        this.video_selected_player = "";
        this.video_url = "";
        this.video_url_safe = "";
        this.active_video = "";
        this.modal_videos = [];

        this.modal_videos.push({
            index: 1,
            player: shot["data"]["shot"]["player"],
            color: this.getShooter(shot["data"]["shot"]["player"]),
            videoId: shot["data"]["videoId"],
            time: shot["data"]["time"],
            videoTime: shot["data"]["videoTime"],
            homeTeam: shot["data"]["homeTeam"],
            awayTeam: shot["data"]["awayTeam"],
            matchDate: shot["data"]["matchDate"],
            score: shot["data"]["score"],
            download_type: "vstup",
            gameState: shot["data"]["gameState"],
            vstup_successful: shot["data"]["successful"]
        });

        this.openVideoPlayer();
    }

    getShooter(uuid: string) {
        let value = 0;
        this.players_list.forEach((item, index) => {
            if (item.uuid == uuid) {
                value = index + 1;
            }
        });
        return value;
    }

    removeDupliactes(values) {
        let concatArray = values.map(eachValue => {
            return Object.values(eachValue).join('')
        })
        let filterValues = values.filter((value, index) => {
            return concatArray.indexOf(concatArray[index]) === index

        })
        return filterValues
    }

    calculateHorizontalPositionToPercent(x, y) {
        var position = Math.ceil((y + 100) / 2);
        return (x <= 0) ? position : 100 - position;
    }

    calculateVerticalPositionToPercent(x) {
        return (x <= 0) ? Math.ceil(x + 100) : Math.ceil(100 - x);
    }

    getPlayerJersey(uuid: string, datax: any) {
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

    openVideoPlayer() {
        this.onOpenVideoPlayer.emit(this.modal_videos);
    }

    getBottomPadding() {
        let count = 0;
        this.players.forEach(item => {
            if (item.playerUUID != "") {
                count = count + 1;
            }
        });

        let styles = {};
        if (count == 1) {
            styles = {
                'padding-bottom': '50px'
            };
        } else if (count == 2) {
            styles = {
                'padding-bottom': '90px'
            };
        } else if (count == 3) {
            styles = {
                'padding-bottom': '110px'
            };
        } else if (count == 4) {
            styles = {
                'padding-bottom': '150px'
            };
        } else if (count == 5) {
            styles = {
                'padding-bottom': '180px'
            };
        } else if (count == 6) {
            styles = {
                'padding-bottom': '210px'
            };
        } else {
            styles = {
                'padding-bottom': '0'
            };
        }

        return styles;
    }

    redrawVstupyInGames() {
        let new_games = [];

        let count_of_players = 0;
        this.players_list.forEach(player => {
            if (player.enabled == true) {
                count_of_players = count_of_players + 1;
            }
        });


        if (count_of_players == 0) {
            if (this.render_pro_proti == "PRO") {
                this.games.forEach(game => {
                    game["circles"] = [];
                    let counter = 0;
                    this.getVstupy().forEach((circle, index) => {
                        if (game.match == circle.match) {
                            counter = counter + 1;
                        }
                    });
                    game["circles"].push({ count: counter, color: 0, player: "x" });

                    new_games.push(game);
                });
            } else if (this.render_pro_proti == "PROTI") {
                if (this.zapojeni_hrace_proti == "onice") {
                    this.games.forEach(game => {
                        game["circles"] = [];
                        let counter = 0;
                        this.getVstupy().forEach((circle, index) => {
                            if (game.match == circle.match) {
                                counter = counter + 1;
                            }
                        });
                        game["circles"].push({ count: counter, color: 0, player: "x" });

                        new_games.push(game);
                    });
                } else if (this.zapojeni_hrace_proti == "individual") {
                    console.log("picovina");
                    this.games.forEach(game => {
                        game["circles"] = [];
                        let counter = 0;
                        this.getVstupy().forEach((circle, index) => {
                            if (game.match == circle.match) {
                                counter = counter + 1;
                            }
                        });
                        game["circles"].push({ count: counter, color: 0, player: "x" });

                        new_games.push(game);
                    });


                }
            }
        } else if (count_of_players == 1) {//kotva1
            if (this.render_pro_proti == "PRO" || this.render_pro_proti == "PLAYER") {

                this.games.forEach(game => {
                    game["circles"] = [];
                    this.players_list.forEach((player, index) => {
                        let counter = 0;
                        this.getVstupy().forEach(circle => {

                            if (player.uuid == circle.player && game.match == circle.match) {
                                counter = counter + 1;
                            }
                        });
                        game["circles"].push({ count: counter, color: index + 1, player: player.uuid });
                    });
                    new_games.push(game);
                });
            } else if (this.render_pro_proti == "PROTI") {
                if (this.zapojeni_hrace_proti == "onice") {
                    this.games.forEach(game => {
                        game["circles"] = [];
                        let counter = 0;
                        this.getVstupy().forEach((circle, index) => {
                            if (game.match == circle.match) {
                                counter = counter + 1;
                            }
                        });
                        game["circles"].push({ count: counter, color: 0, player: "x" });

                        new_games.push(game);
                    });
                } else if (this.zapojeni_hrace_proti == "individual") {

                    this.games.forEach(game => {
                        game["circles"] = [];
                        this.players_list.forEach((player, index) => {
                            let counter = 0;
                            this.getVstupy().forEach((circle, index) => {

                                if (player.uuid == circle.blocker && game.match == circle.match) {
                                    counter = counter + 1;
                                }
                            });

                            game["circles"].push({ count: counter, color: index + 1, player: player.uuid });
                        });
                        new_games.push(game);
                    });

                }
            }
        } else if (count_of_players > 1) {
            if (this.render_pro_proti == "PRO"  || this.render_pro_proti == "PLAYER") {
                this.games.forEach(game => {
                    game["circles"] = [];
                    this.players_list.forEach((player, index) => {
                        let counter = 0;
                        this.getVstupy().forEach(circle => {
                            if (player.uuid == circle.player && game.match == circle.match) {
                                counter = counter + 1;
                            }
                        });
                        game["circles"].push({ count: counter, color: index + 1, player: player.uuid });
                    });
                    new_games.push(game);
                });
            } else if (this.render_pro_proti == "PROTI") {
                if (count_of_players == 1) {
                    this.games.forEach(game => {
                        game["circles"] = [];
                        let counter = 0;
                        this.getVstupy().forEach((circle, index) => {
                            if (game.match == circle.match) {
                                counter = counter + 1;
                            }
                        });
                        game["circles"].push({ count: counter, color: 0, player: "x" });

                        new_games.push(game);
                    });
                } else if (count_of_players > 1) {

                    this.games.forEach(game => {
                        game["circles"] = [];
                        this.players_list.forEach((player, index) => {
                            let counter = 0;
                            this.getVstupy().forEach((circle, index) => {

                                if (player.uuid == circle.blocker && game.match == circle.match) {
                                    counter = counter + 1;
                                }
                            });

                            game["circles"].push({ count: counter, color: index + 1, player: player.uuid });
                        });
                        new_games.push(game);
                    });

                }
            }
        }
        this.games = new_games;

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

        if (this.render_pro_proti == "PRO" || this.render_pro_proti == "PLAYER") {
          if (player == "all") {
            this.getVstupy().forEach((item) => {
              if (this.shots_team == true) {
                if (item.match == match.match) {
                  this.modal_videos.push(item);
                }
              } else {
                this.players_list.forEach((player, index) => {
                  if (
                    item.match == match.match &&
                    player.enabled == true &&
                    item.player == player.uuid &&
                    this.render_pro_proti == "PLAYER"
                  ) {
                    this.modal_videos.push(item);
                  }else if(item.match == match.match){
                    this.modal_videos.push(item);
                  }
                });
              }
            });
          } else {
            this.getVstupy().forEach((item) => {
              //console.log(JSON.stringify(item));
              if (item.player == player && item.match == match.match) {
                this.modal_videos.push(item);
              }
            });
          }
        } else if (this.render_pro_proti == "PROTI") {
          if (this.zapojeni_hrace_proti == "onice") {
            if (player == "all") {
              this.getVstupy().forEach((item) => {
                if (item.match == match.match) {
                  this.modal_videos.push(item);
                }
              });
            } else {
              this.getVstupy().forEach((item) => {
                if (item.match == match.match) {
                  this.modal_videos.push(item);
                }
              });
            }
          } else if (this.zapojeni_hrace_proti == "individual") {
            if (player == "all") {
              this.getVstupy().forEach((item) => {
                if (item.match == match.match) {
                  item["player"] = item.blocker;
                  this.modal_videos.push(item);
                }
              });
            } else {
              this.getVstupy().forEach((item) => {
                if (item.match == match.match) {
                  item["player"] = item.blocker;
                  this.modal_videos.push(item);
                }
              });
            }
          }
        }
        console.log("modal_videos",this.modal_videos);
        this.modal_videos.sort((a, b) => {
          return a.time - b.time;
        });

        /* console.log("Modal VIdeo 1");
        console.log(this.modal_videos); */

        this.openVideoPlayer();
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

        let count_of_players = 0;
        let players_list = [];
        this.players_list.forEach(player => {
            if (player.enabled == true) {
                count_of_players = count_of_players + 1;
                players_list.push(player.uuid);

            }
        });

        if (this.render_pro_proti == "PRO") {
            if (count_of_players == 0) {
                this.getVstupy().forEach(item => {
                    if (games_list.includes(item.match)) {
                        this.modal_videos.push(item);
                    }
                });
            } else if (count_of_players == 1) {
                this.getVstupy().forEach(item => {
                    if (games_list.includes(item.match) && players_list.includes(item.player)) {
                        this.modal_videos.push(item);
                    }
                });
            } else if (count_of_players > 1) {
                this.getVstupy().forEach(item => {
                    if (games_list.includes(item.match)) {
                        this.modal_videos.push(item);
                    }
                });
            }
        } else if (this.render_pro_proti == "PROTI") {
            if (this.zapojeni_hrace_proti == "onice") {
                if (count_of_players == 0) {
                    this.getVstupy().forEach(item => {
                        if (games_list.includes(item.match)) {
                            this.modal_videos.push(item);
                        }
                    });
                } else if (count_of_players == 1) {
                    this.getVstupy().forEach(item => {
                        if (games_list.includes(item.match)) {
                            this.modal_videos.push(item);
                        }
                    });
                } else if (count_of_players > 1) {
                    this.getVstupy().forEach(item => {
                        if (games_list.includes(item.match)) {
                            this.modal_videos.push(item);
                        }
                    });
                }
            } else if (this.zapojeni_hrace_proti == "individual") {
                if (count_of_players == 0) {

                    this.getVstupy().forEach(item => {
                        if (games_list.includes(item.match) && item.blocker != "") {
                            item["player"] = item.blocker;
                            this.modal_videos.push(item);
                        }
                    });

                } else if (count_of_players == 1) {

                    players_list.forEach(player => {
                        this.getVstupy().forEach(item => {

                            console.log(JSON.stringify(item) + "   " + player);
                            if (games_list.includes(item.match) && item.blocker == player) {
                                item["player"] = item.blocker;
                                this.modal_videos.push(item);
                            }
                        });

                    });
                } else if (count_of_players > 1) {
                    players_list.forEach(player => {
                        this.getVstupy().forEach(item => {
                            if (games_list.includes(item.match) && item.blocker == player) {
                                item["player"] = item.blocker;
                                this.modal_videos.push(item);
                            }
                        });

                    });
                }
            }
        }



        this.modal_videos.sort((a, b) => { return a.time - b.time; });
        this.openVideoPlayer();
    }

    stringy(data: any) {
        return JSON.stringify(data);
    }







    loadVystupyProPlayer(player: string, spot: string, clicked_spot: string) {
        let matches = [];
        this.games.forEach(item => {
            if (item.active == true) {
                matches.push(item.match);
            }
        });
        this.selected_button_spot = clicked_spot;

        this._loadVystupyProPlayer.emit({ player: player, spot: spot, matches: matches });
    }

    loadVystupyProTeam(spot: string, clicked_spot: string) {
        let matches = [];
        this.games.forEach(item => {
            if (item.active == true) {
                matches.push(item.match);
            }
        });
        this.selected_button_spot = clicked_spot;
        this._loadVystupyProTeam.emit({ spot: spot, matches: matches });
    }

    loadVystupyProtiPlayer(player: string, spot: string, clicked_spot: string) {
        let matches = [];
        this.games.forEach(item => {
            if (item.active == true) {
                matches.push(item.match);
            }
        });
        this.selected_button_spot = clicked_spot;
        this._loadVystupyProtiPlayer.emit({ player: player, spot: spot, matches: matches });
    }

    loadVystupyProtiTeam(spot: string, clicked_spot: string) {
        let matches = [];
        this.games.forEach(item => {
            if (item.active == true) {
                matches.push(item.match);
            }
        });
        this.selected_button_spot = clicked_spot;
        this._loadVystupyProtiTeam.emit({ spot: spot, matches: matches });
    }


    loadAllVystupyData() {
        let matches = [];
        this.games.forEach(item => {
            if (item.active == true) {
                matches.push(item.match);
            }
        });
        this._loadAllVystupyData.emit({ matches: matches });
    }

    loadAllVystupyDataProti() {
        let matches = [];
        this.games.forEach(item => {
            if (item.active == true) {
                matches.push(item.match);
            }
        });
        this._loadAllVystupyDataProti.emit({ matches: matches });
    }

    downloadMap(){
        this._downloadMap.emit("vystupy")
      }
}
