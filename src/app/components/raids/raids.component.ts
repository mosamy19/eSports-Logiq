import { element } from 'protractor';
import { Component, OnInit, AfterViewInit, EventEmitter, ElementRef, ViewChild, Input, Output} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '../../pipes/translate.pipe';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

@Component({
    selector: 'raids',
    templateUrl: './raids.component.html',
    styleUrls: ['./raids.component.scss'],
    providers: [DefaultService, TranslatePipe]

})

export class RaidsComponent implements OnInit,AfterViewInit {
  @Output() onChangePlayer: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenVideoPlayer: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('games_list') private games_list: ElementRef;

  @Input() raids: any = [];
  @Input() selected_games:any = [];
  @Input() players: any = [];
  @Input() gameslist: any = [];
  @Input() teams_list: any = [];
  @Input() toi: any=[];
  @Input() filter_team: string = "";
  @Input() filter_goalkeeper: string = "";
  @Input() filter_seasonPart: any;
  @Input() filter_team_input: any;

  left_stick: any = [];
  right_stick: any = [];

  main_games_select: string = "ALL";
  games: any = [];
  circles: any = [];
  goalkeeper: string = "";

  show_video_player_match: boolean = false;
  video_selected_player: string = "";
  video_selected_match: any;
  active_video: string = "";
  show_video_player: boolean = false;
  video_url: string = "";
  video_url_safe: any;
  video_orderby: string = "time";
  modal_videos: any = [];
  show_only_one_shot: boolean = false;

  end_result: string = "ALL";
  end_type: string = "ALL";
  end_side: string = "ALL";
  end_hockey: string = "ALL";

    constructor(private router: Router, private activatedRoute: ActivatedRoute,private translate: TranslatePipe, private defaultService: DefaultService) {}

    ngOnInit() {
        this.reloadGames();
        this.loadData();
        this.mainGamesSelect('ALL')
    }

    ngAfterViewInit(){
      this.goalkeeper = this.filter_goalkeeper;
      setTimeout(() => { 
        
        this.gameRaids();
       }, 200);
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
  


  reloadGames() {
    console.log("GamesList:", this.gameslist)
    let games_list = [];

    if(this.selected_games.length == 0){
      this.gameslist.forEach((item, index) => {
        let activeGame = false;
        if (index === 0) {
          activeGame = true;
          this.selected_games.push(item.match);
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
    games_list.sort(function (a, b) {
      a = new Date(a.matchDate);
      b = new Date(b.matchDate);
      return a > b ? -1 : a < b ? 1 : 0;
    });
    console.log("Games:", this.games)

  }

  gameRaids(){
    
    this.games.forEach(game => {
      let shots = [];
      this.raids.forEach(shot => {
        if(shot.match == game.match && this.filter_team_input == shot.goalkeeper.team){
          shots.push(shot);
        }
      });
      game['circles'] = shots;
    });
  }

    mainGamesSelect(selected: string) {
        //this.closeVideo();
        this.selected_games = [];
        this.main_games_select = selected;
        if (selected == "ALL") {
            this.games.forEach((item, index) => {
                this.games[index]["active"] = true;
                this.selected_games.push(item.match)
            });
        } else {
            this.games.forEach((item, index) => {
                this.games[index]["active"] = false;
            });
        }

        //this.reloadShots();
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

    toggleGame(id: number) {
        //this.closeVideo();
        this.main_games_select = "SELECTED";
        this.selected_games = [];
        this.games.forEach((item, index) => {
            if (item.id == id) {
                if (item.active == true) {
                    this.games[index]["active"] = false;
                } else {
                    this.games[index]["active"] = true;
                }
            }
        });

        this.games.forEach(element => {
          if(element.active){
            this.selected_games.push(element.match)
          }
        });
        //this.reloadShots();
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

  changePlayer(){
    //this.getCountAll();
    /* if(this.filter_goalkeeper != ''){
      this.onChangePlayer.emit(this.filter_goalkeeper)
    } */
  }

  setEndResult(type:string) {
    this.end_result = type;
    //this.filterShots();
  }
  setEndType(type:string) {
    this.end_type = type;
    //this.filterShots();
  }

  setEndSide(type: string) {
    this.end_side = type;
    //this.filterShots();
  }

  setEndHockey(type:string) {
    this.end_hockey = type;
    //this.filterShots();
  }

  setGolie(type:string){
    this.filter_goalkeeper = type;
  }

  filterEndResult(data:any[]) {
    if(this.end_result == "goal"){
      let filtered_data = [];
      data.forEach(item => {
        if(item.goal){
          filtered_data.push(item);
        }
      });
      return filtered_data;
    }else{
      return data;
    }
  }

  filterEndType(data:any[]){
    let filtered_data = [];
    if(data != undefined){
      if(this.end_type == "shot"){
        data.forEach(element => {
          if(element.finish == "shot"){
            filtered_data.push(element)
          }
        });
        return filtered_data;

      }else if( this.end_type == "trick"){
        data.forEach(element => {
          if(element.finish == "feint"){
            filtered_data.push(element)
          }
        });
        return filtered_data;
      }else{
        return data;
      }
    }
  }

  filterEndSide(data:any[]){
    let filtered_data = [];
    if(data != undefined){
      if(this.end_side == "FH"){
        data.forEach(element => {
          if(element.stickSide == "forehand"){
            filtered_data.push(element)
          }
        });
        return filtered_data;
      }else if( this.end_side == "BH"){
        data.forEach(element => {
          if(element.stickSide == "backhand"){
            filtered_data.push(element)
          }
        });
        return filtered_data;
      }else{
        return data;
      }
    }
  }

  filterGolie(data:any[]){
    let filtered_data =[];
    data.forEach(element => {
      if(element.goalkeeper.player == this.goalkeeper){
        filtered_data.push(element);
      }
    });
    return filtered_data;
  }

  filterZone(data: any, zone: string){
    let filtered_data = [];
    if(zone == "ALL"){
      return data;
    }else{
      data.forEach(element => {
        if(element.gateZone == zone){
          filtered_data.push(element);
        }
      });
  
      return filtered_data;
    }
  }

  filterSkaterStick(data:any[]){
    if(this.end_hockey == "left"){
      let data1 = []
      data.forEach(element => {
        if(this.left_stick.includes(element.skater.player)){
          data1.push(element)
        }
      });
      return data1
    }
    else if(this.end_hockey == "right"){
      let data1 = []
      data.forEach(element => {
        if(this.right_stick.includes(element.skater.player)){
          data1.push(element)
        }
      });
      return data1
    }else{
      return data;
    }
  }

  filterSelectedMatch(data){
    let data1 = [];
    data.forEach(element => {
      if(this.selected_games.includes(element.match)){
        data1.push(element);
      }
    });
    return data1;
  }

  downloadMap() {

        //this.closeVideo();
        html2canvas(document.querySelector('.download')).then((canvas) => {
          canvas.toBlob((blob) => {
            saveAs(blob, "export.png");
          });
        })
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

  getCount(zone: string) {
    let data = this.raids;
    data = this.filterSelectedMatch(data);
    data = this.filterGolie(data);
    data = this.filterEndResult(data);
    data = this.filterEndSide(data);
    data = this.filterEndType(data);
    data = this.filterSkaterStick(data);
    data = this.filterZone(data,zone)
    return data.length
  }

  getCountAll() {
    let data = this.raids;
    data = this.filterSelectedMatch(data);
    data = this.filterGolie(data);
    data = this.filterEndResult(data);
    data = this.filterEndSide(data);
    data = this.filterEndType(data);
    data = this.filterSkaterStick(data);

    return data.length
  }

  getGoals(zone: string) {
    let data = this.raids;
    data = this.filterSelectedMatch(data);
    data = this.filterGolie(data);
    data = this.filterEndSide(data);
    data = this.filterEndType(data);
    data = this.filterSkaterStick(data);
    data = this.filterZone(data,zone)
    let goals =[];
    data.forEach(element => {
      if(element.goal){
        goals.push(element)
      }
    });
    return goals.length
  }

  getGoalsAll() {
    let data = this.raids;
    data = this.filterSelectedMatch(data);
    data = this.filterGolie(data);
    data = this.filterEndSide(data);
    data = this.filterEndType(data);
    data = this.filterSkaterStick(data);

    let goals =[];
    data.forEach(element => {
      if(element.goal){
        goals.push(element)
      }
    });
    return goals.length
  }

  getPercent(zone: string) {
    let percent = 100 - (Math.round((100 / this.getCount(zone)) * this.getGoals(zone)));
    if(!isNaN(percent)){
      return percent;
    }else{
      return 0;
    }
  }

  getPercentAll() {
    let percent = 100 - (Math.round((100 / this.getCountAll()) * this.getGoalsAll()));
    if(!isNaN(percent)){
      return percent;
    }else{
      return 0;
    }
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
    this.modal_videos = [];
    let all = [];
    this.games.forEach(item => {
      if (item.active == true) {
        item.circles.forEach(element => {
          all.push(element)
        });
      }
    });
    console.log("Games:", this.games);

    all.forEach((item, index) => {
      if(item.time == null){
        item.time = 1;
      }
      this.modal_videos.push(
        {
        "index": index,
        "player": item.skater.player,
        "color": 0,
        "videoId": item.videoId,
        "time": item.time,
        "videoTime": item.videoTime,
        "homeTeam": item["homeTeam"],
        "awayTeam": item["awayTeam"],
        "matchDate": item["matchDate"],
        "score": item["score"],
        "download_type": "buly",
        "buly_won": item["won"],
        "gameState": item["gameState"],
      })
    })


    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });
    this.openVideoPlayer();
  }

  playVideo(zone:string){
    let data = this.raids;
    data = this.filterSelectedMatch(data);
    data = this.filterGolie(data);
    data = this.filterEndResult(data);
    data = this.filterEndSide(data);
    data = this.filterEndType(data);
    data = this.filterSkaterStick(data);
    data = this.filterZone(data,zone);

    console.log("Circles", this.circles)
    console.log("Raids", this.raids)
    console.log("Data:", data)

    data.forEach((item,index) => {
      if(item.time == null){
        item.time = 1;
      }
      this.modal_videos.push({
        "index": index,
        "player": item.goalkeeper.player,
        "color": 0,
        "videoId": item.videoId,
        "time": item.time,
        "videoTime": item.videoTime,
        "homeTeam": item["homeTeam"],
        "awayTeam": item["awayTeam"],
        "matchDate": item["matchDate"],
        "score": item["score"],
        "download_type": "buly",
        "buly_won": item["won"],
        "gameState": item["gameState"],
      }) 
    });
    this.openVideoPlayer();
  }

  playGameVideo(match, player, shot) {

    match.forEach((item, index) => {

      if(item.time == null){
        item.time = 1;
      }
      if(item.videoTime == null){
        item.videoTime = 1;
      }

      this.modal_videos.push({
        "index": index,
        "player": item.skater.player,
        "color": 0,
        "videoId": item.videoId,
        "time": item.time,
        "videoTime": item.videoTime,
        "homeTeam": item["homeTeam"],
        "awayTeam": item["awayTeam"],
        "matchDate": item["matchDate"],
        "score": item["score"],
        "download_type": "buly",
        "buly_won": item["won"],
        "gameState": item["gameState"],
      })
    });

    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });
       
        this.openVideoPlayer();
  }

  

  openVideoPlayer() {
        this.onOpenVideoPlayer.emit(this.modal_videos);
    }
}
