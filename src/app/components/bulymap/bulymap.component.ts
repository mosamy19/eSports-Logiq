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
  ChangeDetectorRef
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DefaultService } from "../../services/default/default.service";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslatePipe } from "../../pipes/translate.pipe";
import { ToastrService } from "ngx-toastr";

import { FormationsAnalysisService } from "../../services/formations-analysis/formations-analysis.service";
import { TestBed } from "@angular/core/testing";
import { element } from "protractor";
import { cloneDeep } from "lodash"

@Component({
  selector: "bulymap",
  templateUrl: "./bulymap.component.html",
  styleUrls: ["./bulymap.component.scss"],
  providers: [DefaultService, TranslatePipe, FormationsAnalysisService],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulyMapComponent implements OnInit, AfterViewInit {
  @Output() onInvertChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadFaceoffDataClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadAllFaceoffDataClick: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Output() loadAllFaceoffDataByPosClick: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Output() onOpenVideoPlayer: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectedGame: EventEmitter<any> = new EventEmitter<any>();

  invert: boolean = true;

  main_games_select: string = "ALL";

  showVideoModal: boolean = false;

  games: any = [];
  circles: any = [];

  showAllMatches: boolean = true;

  selected_shot: any = [];

  //video
  show_video_player: boolean = false;
  video_url: string = "";
  video_url_safe: any;
  video_orderby: string = "time";

  modal_videos: any = [];

  loadd_parts = 0;
  //video match
  video_selected_player: string = "";
  video_selected: any;

  players_list: any = [];

  active_players: any = [];

  active_video: string = "";

  left_stick: any = [];
  right_stick: any = [];


  loadingOpponents: boolean = true;
  dataOpponents: any[] = [];
  table_settings_opponents: any[] = [
    { type: "fo", name: "FO", colour: "white" },
    { type: "fow", name: "FOW", colour: "white" },
    { type: "fow_percent", name: "FOW%", colour: "green" },
  ];

  @Input() players: any = [];
  @Input() shots_team: boolean = false;
  @Input() teams_list_input: any = [];

  teams_list: any = [];

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

  @Input() selected_teams_against: any = [];

  @Input() gameslist: any = [];
  @Input() selected_games: any = [];

  stick_side: string = "ALL";
  bully_result: string= "ALL";
  bully_finish: string= "ALL";
  
  allFaceOffs: any = [];
  filteredFaceOffs: any = [];

  active_games: any = [];

  data: any = [];

  defenseDefenseLeft_data: any = [];
  defenseDefenseRight_data: any = [];
  defenseNeutralLeft_data: any = [];
  defenseNeutralRight_data: any = [];
  center_data: any = [];
  offenseDefenseLeft_data: any = [];
  offenseDefenseRight_data: any = [];
  offenseNeutralLeft_data: any = [];
  offenseNeutralRight_data: any = [];

  total_data: any = [];
  leftSide_data: any = [];
  rightSide_data: any = [];

  enemy_teams:any = [];
  selected_opponent: string = "ALL";

  dataLoaded: boolean;
  loading: boolean;

  constructor(
    private formationsAnalysisService: FormationsAnalysisService,
    private translate: TranslatePipe,
    private defaultService: DefaultService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
  ) {
    this.sanitizer = sanitizer;
  }

  ngOnInit() {
    
  }

  testLog(data:any,name:string){
    console.log(name,data)
  }

  ngAfterViewInit() {
    console.log("PLayers", this.players)
    this.teams_list = this.teams_list_input;
    this.games = this.gameslist;
    this.checkPlayers();
    this.selectAllGames();
    if(this.teams_list != ''){
      this.getAPI();
    }else{
      alert("Vyberte tým");
    }
    
    console.log("players",this.players)
  }

  checkPlayers(){
    console.log("PLAYERS 1", this.players)
    this.players.forEach(player => {
      if(player.playerUUID !== "" ){
        this.shots_team = false
        this.active_players.push(player.playerUUID)
        console.log("active_players", this.active_players)
      }
    });
  }

  stringy(data: any) {
    return JSON.stringify(data);
  }

  loadPlayersStick() {
    let uuids = this.filter_seasonPart.split(",");

    uuids.forEach((item, index) => {
        var competition_details = JSON.parse(localStorage.getItem("competition_details"));
        competition_details.forEach((item2, index) => {
            if (typeof item2[item] != 'undefined') {
                item2[item]["teams"].forEach((team, index) => {

                    if(this.filter_team != team.uuid){
                      this.enemy_teams.push(team);
                    }
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
                    
                });
            }
        });
        this.enemy_teams.forEach(team => {
          team.players.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
         
        });
    });

}

  getAPI(){
    this.loading = true;
    if (this.shots_team == true) {
      this.formationsAnalysisService
      .getTeamFaceoff(
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
        null
      )
      .subscribe(loaded_data => {
        console.log("loaded_data",loaded_data);

        this.data = loaded_data;

        loaded_data.defense.faceOffs.forEach(element => {
          this.allFaceOffs.push(element);
        });
        loaded_data.offense.faceOffs.forEach(element => {
          this.allFaceOffs.push(element);
        });
        loaded_data.neutral.faceOffs.forEach(element => {
          this.allFaceOffs.push(element);
        });

        console.log("ALL",this.allFaceOffs)
        this.loadPlayersStick();

        this.faceOffsFilter();
        
        this.cd.detectChanges();
      })
    }else{
      console.log("Active PLAYERS", this.active_players)
      this.active_players.forEach((player, index) => {
        this.loading = true
          this.formationsAnalysisService
          .getPlayerFaceoff(
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
            player,
            this.filter_situationType,
            this.filter_situationTime,
            null
          ) 
          .subscribe(loaded_data => {

            loaded_data["player"] = player;
            loaded_data.defense.faceOffs.forEach(element => {
              this.allFaceOffs.push(element);
            });
            loaded_data.offense.faceOffs.forEach(element => {
              this.allFaceOffs.push(element);
            });
            loaded_data.neutral.faceOffs.forEach(element => {
              this.allFaceOffs.push(element);
            });

            this.data.push(loaded_data);

            if(index + 1 == this.active_players.length){

              this.loadPlayersStick();
              this.faceOffsFilter();
            }
            

            
          })
      });
      this.loading = false;
      console.log("Loaded DATA", this.data)
      this.cd.detectChanges();
      /* if(this.active_players.length == this.data.length){
        
      }else{
        setTimeout(()=>{
          console.log("Reload!")
          this.totalData()
        }, 200)
      } */
    }
  }

  redrawShotsInGames(data) {
    let new_games = [];

    this.games.forEach(game => {
        game["circles"] = [];
        game["faceOffs"] = [];
            let counter = 0;
              data.forEach(circle => {
                if (game.match == circle.matchUuid) {
                    counter = counter + 1;
                    game["faceOffs"].push(circle);
                }
              });
              
            

            game["circles"].push({ count: counter});
        new_games.push(game);

    });

    this.games = new_games;
  }

  
  faceOffsFilter(){
    
    let faceOffs = this.allFaceOffs
    faceOffs =  this.filterBullyResult(faceOffs);
    faceOffs = this.filterBullyFinish(faceOffs);
    faceOffs = this.filterStickSide(faceOffs);
    faceOffs = this.enemyFilter(faceOffs);
    this.redrawShotsInGames(faceOffs);
    faceOffs = this.filterSelectedMatch(faceOffs);

    this.defenseDefenseLeftData();
    this.defenseDefenseRightData();
    this.defenseNeutralLeftData()
    this.defenseNeutralRightData();
    this.centerData();
    this.offenseDefenseLeftData();
    this.offenseDefenseRightData();
    this.offenseNeutralLeftData()
    this.offenseNeutralRightData();
    this.totalData();
    this.leftSideData();
    this.rightSideData();
    
    console.log("loaded DATA2", this.data)
    this.cd.detectChanges();
    this.loading = false;
  }

  enemyFilter(data){
    if(this.selected_opponent === "ALL"){
      return data
    }else{
      let data1 = []
      data.forEach(element => {
        if(element.opponentUuid == this.selected_opponent){
          data1.push(element);
        }
      });
      return data1
    }
  }

  totalData(){
    this.total_data = [];
    
    if(this.shots_team){
      let faceOffs = []
      
      this.data['defense']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
      this.data['offense']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
      this.data['neutral']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.total_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{

      console.log("DATA", this.data)
      this.data.forEach((data2,index) => {
        let faceOffs = []
        console.log("Data2", data2)

        data2['defense']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
        data2['offense']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
        data2['neutral']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
    
        faceOffs = this.filterBullyFinish(faceOffs);
        faceOffs = this.filterStickSide(faceOffs);
        faceOffs = this.filterSelectedMatch(faceOffs);
        faceOffs = this.enemyFilter(faceOffs);
        let count = faceOffs.length;
        faceOffs =  this.filterBullyResult(faceOffs);

        let won = 0;
        let lose = 0;
        faceOffs.forEach(element => {
          element.won ? won = won + 1 : lose = lose + 1;
        });

        let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data2.player){
            color = element.color
          }
        });


        this.total_data.push({
          "faceOffs" : faceOffs,
          "count" : count,
          "won" : won,
          "lose" : lose,
          "color" : color
        })
      });
    }
      
  }

  leftSideData(){
    this.leftSide_data = [];
    
    if(this.shots_team){
      let faceOffs = []
      
      this.data['defenseDefenseLeft']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
      this.data['defenseNeutralLeft']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
      this.data['offenseDefenseLeft']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
      this.data['offenseNeutralLeft']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.leftSide_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = []

        data['defenseDefenseLeft']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
        data['defenseNeutralLeft']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
        data['offenseDefenseLeft']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
        data['offenseNeutralLeft']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
    
        faceOffs = this.filterBullyFinish(faceOffs);
        faceOffs = this.filterStickSide(faceOffs);
        faceOffs = this.filterSelectedMatch(faceOffs);
        faceOffs = this.enemyFilter(faceOffs);
        let count = faceOffs.length;
        faceOffs =  this.filterBullyResult(faceOffs);

        let won = 0;
        let lose = 0;
        faceOffs.forEach(element => {
          element.won ? won = won + 1 : lose = lose + 1;
        });

        let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

        this.leftSide_data.push({
          "faceOffs" : faceOffs,
          "count" : count,
          "won" : won,
          "lose" : lose,
          "color" : color
        })
      });
    }
  }

  rightSideData(){
    this.rightSide_data = [];
    
    if(this.shots_team){
      let faceOffs = []
      
      this.data['defenseDefenseRight']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
      this.data['defenseNeutralRight']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
      this.data['offenseDefenseRight']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
      this.data['offenseNeutralRight']['faceOffs'].forEach(element => {
        faceOffs.push(element)
      });
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.rightSide_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = []

        data['defenseDefenseRight']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
        data['defenseNeutralRight']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
        data['offenseDefenseRight']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
        data['offenseNeutralRight']['faceOffs'].forEach(element => {
          faceOffs.push(element)
        });
    
        faceOffs = this.filterBullyFinish(faceOffs);
        faceOffs = this.filterStickSide(faceOffs);
        faceOffs = this.filterSelectedMatch(faceOffs);
        faceOffs = this.enemyFilter(faceOffs);
        let count = faceOffs.length;
        faceOffs =  this.filterBullyResult(faceOffs);

        let won = 0;
        let lose = 0;
        faceOffs.forEach(element => {
          element.won ? won = won + 1 : lose = lose + 1;
        });

        let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

        this.rightSide_data.push({
          "faceOffs" : faceOffs,
          "count" : count,
          "won" : won,
          "lose" : lose,
          "color" : color
        })
      });
    }
  }

  defenseDefenseLeftData(){
    this.defenseDefenseLeft_data = [];

    if(this.shots_team){
      let faceOffs = this.data['defenseDefenseLeft']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.defenseDefenseLeft_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['defenseDefenseLeft']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

      this.defenseDefenseLeft_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : color
      })
      });
    }
    
  }

  defenseDefenseRightData(){
    this.defenseDefenseRight_data = [];

    if(this.shots_team){
      let faceOffs = this.data['defenseDefenseRight']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.defenseDefenseRight_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['defenseDefenseRight']['faceOffs']
    
        faceOffs = this.filterBullyFinish(faceOffs);
        faceOffs = this.filterStickSide(faceOffs);
        faceOffs = this.filterSelectedMatch(faceOffs);
        faceOffs = this.enemyFilter(faceOffs);
        let count = faceOffs.length;
        faceOffs =  this.filterBullyResult(faceOffs);

        let won = 0;
        let lose = 0;
        faceOffs.forEach(element => {
          element.won ? won = won + 1 : lose = lose + 1;
        });

        let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

        this.defenseDefenseRight_data.push({
          "faceOffs" : faceOffs,
          "count" : count,
          "won" : won,
          "lose" : lose,
          "color" : color
        })
      });
    }
    
  }

  defenseNeutralLeftData(){
    this.defenseNeutralLeft_data = [];

    if(this.shots_team){
      let faceOffs = this.data['defenseNeutralLeft']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.defenseNeutralLeft_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['defenseNeutralLeft']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

      this.defenseNeutralLeft_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : color
      })
      });
    }
    
  }

  defenseNeutralRightData(){
    this.defenseNeutralRight_data = [];

    if(this.shots_team){
      let faceOffs = this.data['defenseNeutralRight']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.defenseNeutralRight_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['defenseNeutralRight']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

      this.defenseNeutralRight_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : color
      })
      });
    }
    
  }

  centerData(){
    this.center_data = [];

    if(this.shots_team){
      let faceOffs = this.data['center']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.center_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['center']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

      this.center_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : color
      })
      });
    }
    
  }

  offenseDefenseLeftData(){
    this.offenseDefenseLeft_data = [];

    if(this.shots_team){
      let faceOffs = this.data['offenseDefenseLeft']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.offenseDefenseLeft_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['offenseDefenseLeft']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

      this.offenseDefenseLeft_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : color
      })
      });
    }
    
  }

  offenseDefenseRightData(){
    this.offenseDefenseRight_data = [];

    if(this.shots_team){
      let faceOffs = this.data['offenseDefenseRight']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.offenseDefenseRight_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['offenseDefenseRight']['faceOffs']
    
        faceOffs = this.filterBullyFinish(faceOffs);
        faceOffs = this.filterStickSide(faceOffs);
        faceOffs = this.filterSelectedMatch(faceOffs);
        faceOffs = this.enemyFilter(faceOffs);
        let count = faceOffs.length;
        faceOffs =  this.filterBullyResult(faceOffs);

        let won = 0;
        let lose = 0;
        faceOffs.forEach(element => {
          element.won ? won = won + 1 : lose = lose + 1;
        });

        let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

        this.offenseDefenseRight_data.push({
          "faceOffs" : faceOffs,
          "count" : count,
          "won" : won,
          "lose" : lose,
          "color" : color
        })
      });
    }
    
  }

  offenseNeutralLeftData(){
    this.offenseNeutralLeft_data = [];

    if(this.shots_team){
      let faceOffs = this.data['offenseNeutralLeft']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.offenseNeutralLeft_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['offenseNeutralLeft']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

      this.offenseNeutralLeft_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : color
      })
      });
    }
    
  }

  offenseNeutralRightData(){
    this.offenseNeutralRight_data = [];

    if(this.shots_team){
      let faceOffs = this.data['offenseNeutralRight']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      this.offenseNeutralRight_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : 0
      })
    }else{
      this.data.forEach((data,index) => {
        let faceOffs = data['offenseNeutralRight']['faceOffs']
    
      faceOffs = this.filterBullyFinish(faceOffs);
      faceOffs = this.filterStickSide(faceOffs);
      faceOffs = this.filterSelectedMatch(faceOffs);
      faceOffs = this.enemyFilter(faceOffs);
      let count = faceOffs.length;
      faceOffs =  this.filterBullyResult(faceOffs);

      let won = 0;
      let lose = 0;
      faceOffs.forEach(element => {
        element.won ? won = won + 1 : lose = lose + 1;
      });

      let color = 0;
        this.players.forEach(element => {
          if(element.playerUUID == data.player){
            color = element.color
          }
        });

      this.offenseNeutralRight_data.push({
        "faceOffs" : faceOffs,
        "count" : count,
        "won" : won,
        "lose" : lose,
        "color" : color
      })
      });
    }
    
  }

  

  filterSelectedMatch(data){
    let data1 = [];
    data.forEach(element => {
      if(this.active_games.includes(element.matchUuid)){
        data1.push(element);
      }
    });
    return data1;
  }

  filterBullyResult(data){
    if(this.bully_result === "ALL"){
      return data;

    }else if(this.bully_result === "won"){
      let data1 = [];
      
      data.forEach(element => {
        if(element.won == true){
          data1.push(element);
        }
      });
      return data1;

    }else if(this.bully_result === "lose"){
      let data1 = [];
      data.forEach(element => {
        if(element.won == false){
          data1.push(element);
        }
      });
      return data1;
    }
  }

  filterBullyFinish(data){
    if(this.bully_finish === "ALL"){
      return data;

    }else if(this.bully_finish === "shot"){ 
      let data1 = [];
      data.forEach(element => {
        if(element.finish != "none"){
          data1.push(element)
        }
      });
      return data1;

    }else if(this.bully_finish === "slotShot"){
      let data1 = [];
      data.forEach(element => {
        if(element.finish == "slotShot" || element.finish == "goal"){
          data1.push(element)
        }
      });
      return data1;

    }else if(this.bully_finish === "goal"){
      let data1 = [];
      data.forEach(element => {
        if(element.finish == "goal"){
          data1.push(element)
        }
      });
      return data1;
    }
  }

  filterStickSide(data){
    if(this.stick_side === "ALL"){
      return data;

    }else if(this.stick_side === "left"){
      let data1 = []
      data.forEach(element => {
        if(this.left_stick.includes(element.opponentUuid)){
          data1.push(element)
        }
      });
      return data1

    }else if(this.stick_side === "right"){
      let data1 = []
      data.forEach(element => {
        if(this.right_stick.includes(element.opponentUuid)){
          data1.push(element)
        }
      });
      return data1

    }
  }

  setBullyResult(result){
    this.bully_result = result;
    this.faceOffsFilter();
  }

  setBullyFinish(finish){
    this.bully_finish = finish;
    this.faceOffsFilter();
  }

  setStickSide(side){
    this.stick_side = side;
    this.faceOffsFilter();
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

  toggleGame(id: number) {
    //this.closeVideo();
    this.main_games_select = "SELECTED";

    this.games.forEach((item, index) => {
        if (item.id == id) {
            if (item.active == true) {
              this.games[index]["active"] = false;
              let index2 = this.active_games.indexOf(item.match)
              this.active_games.splice(index2,1)
            } else {
                this.games[index]["active"] = true;
                this.active_games.push(item.match)
            }
        }
    });
    this.faceOffsFilter()
  }

  mainGamesSelect(selected: string) {
    //this.closeVideo();
    this.active_games = []
    this.main_games_select = selected;
    if (selected == "ALL") {
        this.games.forEach((item, index) => {
            this.games[index]["active"] = true;
            this.active_games.push(item.match)
        });
    } else {
        this.games.forEach((item, index) => {
            this.games[index]["active"] = false;
        });
    }
    
    this.faceOffsFilter()
  }

  selectAllGames(){
    this.games.forEach(item => {
      this.active_games.push(item.match)
    });
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

  getPomer(data){
    if(this.bully_result == "won"){
      return data.won
    }else if(this.bully_result == "ALL"){
      return data.count;
    }else {
      return data.lose;
    }
  }

  getPercent(data){
    if(this.bully_result == "ALL" || this.bully_result == "won"){
      let value = Math.round((100 / data["count"]) * data["won"])
      if(value >= 0){
        return value
      }else{
        return 0
      }
      
    }else {
      let value = Math.round((100 / data["count"]) * data["lose"])
      if(value >= 0){
        return value
      }else{
        return 0
      }
    }
  }

  closeVideoPlayer() {
    this.show_video_player = false;
  }

  openVideoPlayer() {
    this.onOpenVideoPlayer.emit(this.modal_videos);
  }

  playBulyPlace(data){
    this.modal_videos = [];

    data.faceOffs.forEach((item, index) => {
      this.modal_videos.push({
        "index": index,
        "player": item.playerUuid,
        "color": data.color,
        "videoId": item["videoId"],
        "time": item["time"],
        "videoTime": item["videoTime"],
        "homeTeam": item["homeTeam"],
        "awayTeam": item["awayTeam"],
        "matchDate": item["matchDate"],
        "score": item["score"],
        "download_type": "buly",
        "buly_won": item["won"],
        "gameState": item["gameState"],
      });
    });

    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });

    this.openVideoPlayer();
  }

  openAllVideos(){
    this.modal_videos = [];
    let toPlay = [];
    this.games.forEach(element => {
      if(element.active){
        element.faceOffs.forEach(element => {
          toPlay.push(element);
        });
      }
    });

    toPlay.forEach((item, index) => {
      this.modal_videos.push({
        "index": index,
        "player": item.playerUuid,
        "color": 0,
        "videoId": item["videoId"],
        "time": item["time"],
        "videoTime": item["videoTime"],
        "homeTeam": item["homeTeam"],
        "awayTeam": item["awayTeam"],
        "matchDate": item["matchDate"],
        "score": item["score"],
        "download_type": "buly",
        "buly_won": item["won"],
        "gameState": item["gameState"],
      });
    });

    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });

    this.openVideoPlayer();
  }

  getPlayerShortName(f_name,l_name){
    return l_name +" " + f_name.substring(0, 1) + "."
  }

  /* playBulyPlaceByGame(data){
    this.modal_videos = [];
    data.faceOffs.forEach((item, index) => {
      this.modal_videos.push({
        "index": index,
        "player": item.playerUuid,
        "color": data.color,
        "videoId": item["videoId"],
        "time": item["time"],
        "videoTime": item["videoTime"],
        "homeTeam": item["homeTeam"],
        "awayTeam": item["awayTeam"],
        "matchDate": item["matchDate"],
        "score": item["score"],
        "download_type": "buly",
        "buly_won": item["won"],
        "gameState": item["gameState"],
      });
    });

    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });

    this.openVideoPlayer();
  } */
}
