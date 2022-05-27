import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy, } from '@angular/core';
import { PlayerIndex } from '@angular/core/src/render3/interfaces/player';
import { SelectModule } from 'ng2-select';

@Component({
  selector: 'video-raids',
  templateUrl: './video-raids.component.html',
  styleUrls: ['./video-raids.component.scss'],

})
export class VideoRaidsComponent implements OnInit, AfterViewInit {
  @Input() raids: any = [];
  @Input() gameslist: any = [];
  @Input() teams_list_input: any = [];
  @Input() selected_games:any = [];
  @Input() filter_team: any = "";
  @Input() filter_playerId_select1: string = "";
  @Input() filter_playerId_select2: string = "";
  @Input() filter_playerId_select3: string = "";
  @Input() filter_playerId_select4: string = "";
  @Input() filter_playerId_select5: string = "";

  teams_list: any = [];

  @Output() _downloadMap: EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpenVideoPlayer: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("games_list") private games_list: ElementRef;

  selected_matches: any = [];
  modal_videos:any = [];
  total_data: any = [];
  games: any = [];

  isTeam: boolean = true;
  loading: boolean = false;
  shotsLoaded: boolean = false;
  showVideoModal: boolean = false;

  main_games_select: string = "ALL";
  end_result: string = "ALL";
  end_type: string = "ALL";
  end_side: string = "ALL";

  constructor() {
  }

  ngOnInit() {
    this.teams_list = this.teams_list_input;
    this.reloadGames();
    this.mainGamesSelect("ALL")
  }

  ngAfterViewInit(){


    console.log("Player 1", this.filter_playerId_select1)

    setTimeout(() => { 
      if(
        this.filter_playerId_select1 != "" ||
        this.filter_playerId_select2 != "" ||
        this.filter_playerId_select3 != "" ||
        this.filter_playerId_select4 != "" ||
        this.filter_playerId_select5 != "" 
      ){
        this.isTeam = false;
        this.fillTotalData();
      }else{
        let data = [];
        let data2= {};
        this.raids.forEach(element => {
          data.push(element);
        });
        data2['color'] = 0;
        data2['data'] = data;
        data2['name'] = this.filter_team;
        this.total_data.push(data2);
        console.log("total data", this.total_data);
      }
  
      console.log("IsTeam",this.isTeam);
      this.gameRaids();
     }, 200);

     console.log("Raids:", this.raids)
  }

  gameRaids(){
    this.games.forEach(game => {
      let shots = [];
      this.raids.forEach(shot => {
        if(shot.skater.team == this.filter_team){
          if(shot.match == game.match){
            shots.push(shot);
          }
        }
      });
      game['circles'] = shots;
    });

    console.log("games", this.games)
  }

  fillTotalData(){
    if(this.filter_playerId_select1 != ""){
      let data = [];
      let data2= {};
      this.raids.forEach(element => {
        if(element.skater.player == this.filter_playerId_select1){
          data.push(element);
        }
      });
      data2['color'] = 1;
      data2['data'] = data
      data2['name'] = this.filter_playerId_select1;
      this.total_data.push(data2);
    }
    if(this.filter_playerId_select2 != ""){
      let data = [];
      let data2= {};
      this.raids.forEach(element => {
        if(element.skater.player == this.filter_playerId_select2){
          data.push(element);
        }
      });
      data2['color'] = 2;
      data2['data'] = data
      data2['name'] = this.filter_playerId_select2;
      this.total_data.push(data2);
    }
    if(this.filter_playerId_select3 != ""){
      let data = [];
      let data2= {};
      this.raids.forEach(element => {
        if(element.skater.player == this.filter_playerId_select3){
          data.push(element);
        }
      });
      data2['color'] = 3;
      data2['data'] = data;
      data2['name'] = this.filter_playerId_select3;
      this.total_data.push(data2);
    }
    if(this.filter_playerId_select4 != ""){
      let data = [];
      let data2= {};
      this.raids.forEach(element => {
        if(element.skater.player == this.filter_playerId_select4){
          data.push(element);
        }
      });
      data2['color'] = 4;
      data2['data'] = data;
      data2['name'] = this.filter_playerId_select4;
      this.total_data.push(data2);
    }
    if(this.filter_playerId_select5 != ""){
      let data = [];
      let data2= {};
      this.raids.forEach(element => {
        if(element.skater.player == this.filter_playerId_select5){
          data.push(element);
        }
      });
      data2['color'] = 5;
      data2['data'] = data;
      data2['name'] = this.filter_playerId_select5;
      this.total_data.push(data2);
    }

    console.log("total data", this.total_data);
  }

  reloadGames() {

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
    console.log("Selected Games",this.selected_games)
  }

  mainGamesSelect(selected: string) {
    this.closeVideo();
    this.selected_matches = [];
    this.main_games_select = selected;

    if (selected == "ALL") {
      this.games.forEach((item, index) => {
        this.games[index]["active"] = true;
        this.selected_matches.push(item.match)
      });
    } else {
      this.games.forEach((item, index) => {
        this.games[index]["active"] = false;
      });
    }

    //this.reloadAssists();
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



  getCount(data:any ,side: string){
    let filtered = data;
    filtered = this.filterSelectedMatch(filtered);
    filtered = this.filterEndResult(filtered);
    filtered = this.filterEndSide(filtered);
    filtered = this.filterEndType(filtered);
    filtered = this.filterZone(filtered,side);
    filtered = this.filterTeam(filtered);

    return filtered.length;
  }

  getGoals(data:any ,side: string){
    let filtered = data;
    filtered = this.filterSelectedMatch(filtered);
    filtered = this.filterEndSide(filtered);
    filtered = this.filterEndType(filtered);
    filtered = this.filterZone(filtered,side);
    filtered = this.filterTeam(filtered);

    let goals = [];
    filtered.forEach(element => {
      if(element.goal){
        goals.push(element);
      }
    });

    return goals.length;
  }

  getPercent(data: any, side: string){
    let filtered = data;
    let won = 0;

    filtered = this.filterSelectedMatch(filtered);
    filtered = this.filterEndResult(filtered);
    filtered = this.filterEndSide(filtered);
    filtered = this.filterEndType(filtered);
    filtered = this.filterZone(filtered,side)
    filtered = this.filterTeam(filtered);
    
    filtered.forEach(element => {
      if(element.goal == true){
        won = won + 1;
      }
    });

    let value = Math.round((100 / filtered.length) * won);

    if(!isNaN(value)){
      return value
    }else{
      return 0;
    }
  }

  playVideo(data: any, zone:string){
    let filtered = data;
    this.modal_videos = [];

    filtered = this.filterSelectedMatch(filtered);
    filtered = this.filterEndResult(filtered);
    filtered = this.filterEndSide(filtered);
    filtered = this.filterEndType(filtered);
    filtered = this.filterZone(filtered,zone);
    filtered = this.filterTeam(filtered);

    filtered.forEach((item, index) => {

      if(item.time == null){
        item.time = 1;
      }
      if(item.videoTime == null){
        item.videoTime = 1;
      }

      this.modal_videos.push({
        "index": index,
        "player": item.skater.player,
        "color": data.color,
        "videoId": item.videoId,
        "time": item.time,
        "videoTime": item.videoTime,
        "homeTeam": item["skater"]["team"],
        "awayTeam": item["goalkeeper"]["team"],
        "matchDate": item["matchDate"],
        "score": item["score"],
        "download_type": "shootout",
        "buly_won": item["won"],
        "gameState": item["gameState"],
      })
    });

    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });
    this.openVideoPlayer();
  }

  getTeamNameShort(uuid: string) {
    let team_name = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        team_name = item["name"];
      }
    });

    return team_name;
  }

  getName(name:string){
    if(this.isTeam){
      return this.getTeamNameShort(this.filter_team)
    }else{
     return this.getPlayerName(name)
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

  getCountAll(data){
    let filtered = data;
    filtered = this.filterSelectedMatch(filtered);
    filtered = this.filterEndResult(filtered);
    filtered = this.filterEndSide(filtered);
    filtered = this.filterEndType(filtered);
    filtered = this.filterTeam(filtered);
    return filtered.length;
  }

  getGoalsAll(data){
    let filtered = data;
    filtered = this.filterSelectedMatch(filtered);
    let goals = [];
    filtered.forEach(element => {
      if(element.goal == true){
        goals.push(element);
      }
    });
    filtered = goals;
    filtered = this.filterEndSide(filtered);
    filtered = this.filterEndType(filtered);
    filtered = this.filterTeam(filtered);
    return filtered.length;
  }

  getPercentAll(data){
    let filtered = data;
    let won = 0;

    filtered = this.filterSelectedMatch(filtered);
    filtered = this.filterEndResult(filtered);
    filtered = this.filterEndSide(filtered);
    filtered = this.filterEndType(filtered);
    filtered = this.filterTeam(filtered);
    
    filtered.forEach(element => {
      if(element.goal == true){
        won = won + 1;
      }
    });

    let value = Math.round((100 / filtered.length) * won);

    if(!isNaN(value)){
      return value
    }else{
      return 0;
    }
  }

  toggleGame(id: number, match: string, match_date: string) {
    console.log("ID", id)
    this.selected_matches = [];
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

    this.games.forEach(element => {
      if(element.active){
        this.selected_matches.push(element.match)
      }
    });

  }

  closeVideo() {

    this.showVideoModal = false;
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

  playGameVideo(match, player, shot) {
    console.log("Match Videos", match);
    this.modal_videos = [];

    match.forEach((item, index) => {

      if(item.skater.team == this.filter_team){
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
          "homeTeam": item["skater"]["team"],
          "awayTeam": item["goalkeeper"]["team"],
          "matchDate": item["matchDate"],
          "score": item["score"],
          "download_type": "shootout",
          "buly_won": item["won"],
          "gameState": item["gameState"],
        })
      }

    });

    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });
    this.openVideoPlayer();
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

    console.log("Games", this.games)

    all.forEach((item, index) => {
      if(item.skater.team == this.filter_team){
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
          "homeTeam": item["skater"]["team"],
          "awayTeam": item["goalkeeper"]["team"],
          "matchDate": item["matchDate"],
          "score": item["score"],
          "download_type": "shootout",
          "buly_won": item["won"],
          "gameState": item["gameState"],
        })
      }
    })

    this.modal_videos.sort((a, b) => {
      return a.time - b.time;
    });
    this.openVideoPlayer();
  }

  setEndResult(set: string){
    this.end_result = set;
  }

  setEndType(set: string){
    this.end_type = set;
  }

  setEndSide(set: string){
    this.end_side = set;
  }

  filterEndResult(data:any){
    let filtered_data = [];
    if(data != undefined){
      if(this.end_result == "goal"){
        data.forEach(element => {
          if(element.goal){
            filtered_data.push(element);
          }
        });
      }else{
        return data;
      }
      return filtered_data;
    }
    
  }

  filterEndType(data:any){
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

  filterEndSide(data:any){
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

  filterSelectedMatch(data){
    let data1 = [];
    data.forEach(element => {
      if(this.selected_matches.includes(element.match)){
        data1.push(element);
      }
    });
    return data1;
  }

  filterTeam(data){
    let data1 = []
    data.forEach(element => {
      if(element.skater.team == this.filter_team){
        data1.push(element);
      }
    });
    return data1;
  }

  filterZone(data, zone){
    let filtered = [];
    if(zone === "ALL"){
      return data
    }else{
      data.forEach(element => {
        if(element.gateZone == zone){
          filtered.push(element);
        }
      });
      return filtered;
    }
  }

  openVideoPlayer() {
    this.onOpenVideoPlayer.emit(this.modal_videos);
}

  downloadMap(){
    this._downloadMap.emit("najezdy")
  }
  
}
