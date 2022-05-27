import { Component, OnInit, Input, OnChanges, EventEmitter, Output, AfterViewInit} from '@angular/core';


@Component({
    selector: 'shotmap-small',
    templateUrl: './shotmap-small.component.html',
    styleUrls: ['./shotmap-small.component.scss']
})
export class ShotmapSmallComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() shots_FULL: any = [];
    @Input() teams_list: any = [];
    @Input() games: any = [];
    @Input() type: string = '';
    @Input() render_shot_pro_proti: string = '';
    @Input() shots_team: boolean;
    @Input() render_shot_pro_type: string = '';
    @Input() shot_category: string = '';
    @Input() filter_zone: string = '';
    @Input() shot_type: string = '';
    @Input() shot_location: string = '';
    @Input() shotDangerType: string = '';
    @Input() map_type: string = '';
    @Input() action_type: string = '';
    @Input() player_uuid: string = '';
    @Input() gameId: string = '';
    @Input() last5Games: boolean = false;
    @Input() danger: string = '';

    @Input() toi: number;

    @Output() openSmallVideo: EventEmitter<any> = new EventEmitter<any>();
    @Output() openshotmapInfobar: EventEmitter<any> = new EventEmitter<any>();

    @Input() filter_playerId_select1: string = "";
    @Input() filter_playerId_select2: string = "";
    @Input() filter_playerId_select3: string = "";
    @Input() filter_playerId_select4: string = "";
    @Input() filter_playerId_select5: string = "";

    @Input() players_list: any = [];

    circles: any = [];
    @Input() shotmapInfobarOpen: boolean = false;

    video_url: string = "";
    video_url_safe: any;
    active_video: string = "";
    tooltip_x: number = 0;
    tooltip_y: number = 0;
    selected_shot: any = [];
    showVideoModal: boolean = false;

    video_selected_player: string = "";
    video_selected_match: any;
    modal_videos: any = [];
    show_only_one_shot: boolean = false;
    show_video_player_match: boolean = false;

    constructor() { }

    ngOnInit() {
        
    }

    ngAfterViewInit(){
        this.reloadShots()
    }

    ngOnChanges() {
      this.reloadShots()
    }

    reloadShots() {
        this.circles = [];
        let shots_filter1 = [];
        let shots_filter2 = [];
        let shots_filter3 = [];
        let shots_filter4 = [];
        let shots_filter5 = [];
        let shots_filter6 = [];
        let shots_filter7 = [];
        let shots_filter8 = [];
        let shots_filter9 = [];
        let shots_filter10 = [];
        let shots_filter11 = [];
        let shots_filter12 = [];

        let shots_final = [];

        this.shots_FULL.forEach((item,index) => {
            let top = this.calculateVerticalPositionToPercent(item['x']);
            let left = this.calculateHorizontalPositionToPercent(item['x'], item['y']);
            let pos_x = Math.ceil((462 * left) / 100);
            let pos_y = Math.ceil((462 * top) / 100);
            shots_filter1.push({
              match: item['match'],
              x: pos_x, y: pos_y,
              type: item['type'],
              inSlot: item['inSlot'],
              time: item['time'],
              videoId: item['videoId'],
              videoTime: item['videoTime'],
              player: item['player'],
              netZone: item['netZone'],
              shotAssist: item['shotAssist'],
              oneTimer: item['oneTimer'],
              realTime: item['realTime'],
               matchDate: item['matchDate'],
               homeTeam: this.getTeamNameShortcut(item['homeTeam']),
               awayTeam: this.getTeamNameShortcut(item['awayTeam']),
               score: item['score'], item: item['time'],
               gameState: item['gameState'],
               rush: item['rush'],
               long: item['long'],
               afterFO: item ['afterFO'],
               oddManRush: item['oddManRush'],
               rebounds: item['rebounds'],
               reboundsCreated: item['reboundsCreated'],
               forecheck: item['forecheck'],
               color: 0,
               download_type: "shots",
               shotDanger: item['shotDanger'],
               xG: item['xG'] });
        });

        shots_filter1.forEach((shot, index) => {
            shots_filter2.push(shot);
        });

        shots_filter1.forEach((shot, index) => {
            shots_filter3.push(shot);
        });

        if (this.render_shot_pro_proti == "PRO") {
            //FILTRACE AKTIVNICH HRACU
            if (this.shots_team == true) {
                shots_filter3.forEach((shot, index) => {
                    shots_filter4.push(shot);
                });
            } else {
                shots_filter3.forEach((shot, index) => {

                    if (this.render_shot_pro_type == "hrac") {
                        shot["color"] = this.getPlayerColour(shot.player);
                        shots_filter4.push(shot);
                    } else if (this.render_shot_pro_type == "tym") {
                        shot["color"] = 0;
                        shots_filter3.push(shot);
                    }
                });
            }
        } else if (this.render_shot_pro_proti == "HRAC") {
            //FILTRACE AKTIVNICH HRACU
            if (this.shots_team == true) {
                shots_filter3.forEach((shot, index) => {
                    shots_filter4.push(shot);
                });
            } else {
                shots_filter3.forEach((shot, index) => {

                    if (this.render_shot_pro_type == "hrac") {
                        shot["color"] = this.getPlayerColour(shot.player);
                        shots_filter4.push(shot);
                    } else if (this.render_shot_pro_type == "tym") {
                        shot["color"] = 0;
                        shots_filter4.push(shot);
                    }
                });
            }
        } else {
            shots_filter3.forEach((shot, index) => {
                shots_filter4.push(shot);
            });
        }

        if (this.render_shot_pro_proti == "PRO") {
            shots_filter4.forEach((item, index) => {
                shots_filter5.push(item);
            });
        } else if (this.render_shot_pro_proti == "HRAC") {
            let uuids = [];
            this.players_list.forEach(item => {
                uuids.push(item.uuid);
            });
            shots_filter4.forEach((item, index) => {
                if (uuids.includes(item["player"])) {
                    shots_filter5.push(item);
                }
            });
        } else if (this.render_shot_pro_proti == "PROTI") {
            shots_filter4.forEach((item, index) => {
                shots_filter5.push(item);
            });
        }

        if (this.shot_category == "G" || this.shot_category == "SG" || this.shot_category == "SG_") {
            shots_filter5.forEach((shot, index) => {
                if (this.filter_zone != "") {
                    if (shot["netZone"] == this.filter_zone) {
                        shots_filter6.push(shot);
                    }
                } else {
                    shots_filter6.push(shot);
                }
            });
        } else {
            shots_filter5.forEach((shot, index) => {
                shots_filter6.push(shot);
            });
        }

        //ONE TIMER
        if (this.shot_type == "1T") {
            shots_filter6.forEach((shot, index) => {
                if (shot["oneTimer"] == true) {
                    shots_filter7.push(shot);
                }
            });
            //Dorážka
        } else if (this.shot_type == "R") {
            shots_filter6.forEach((shot, index) => {
                if (shot["rebounds"] == true) {
                    shots_filter7.push(shot);
                }
            });
            //střela před dorážkou
        } else if (this.shot_type == "RC") {
            shots_filter6.forEach((shot, index) => {
                if (shot["reboundsCreated"] == true) {
                    shots_filter7.push(shot);
                }
            });
        } else {
            shots_filter6.forEach((shot, index) => {
                shots_filter7.push(shot);
            });
        }

        let shot_categories = this.shot_category.split('');
        //JE ZE SLOTU?
        if (shot_categories.includes("_")) {
            shots_filter7.forEach((shot, index) => {
                shot_categories.forEach((shot_cat, index) => {
                    if (shot_cat == shot["type"]) {
                        if (shot["inSlot"] == true) {
                            shots_filter8.push(shot);
                        }
                    }
                });
            });
        } else {
            shots_filter7.forEach((shot, index) => {
                shot_categories.forEach((shot_cat, index) => {
                    if (shot_cat == shot["type"]) {
                        shots_filter8.push(shot);
                    }
                });
            });
        }

        if (this.shot_location == "SLOT") {
            shots_filter8.forEach((shot, index) => {
                if (shot.inSlot) {
                    shots_filter9.push(shot);
                }
            });
        } else {
            shots_filter8.forEach((shot, index) => {
                shots_filter9.push(shot);
            });
        }
        if(this.map_type != "nebezpecnost_strel"){
            shots_filter9.forEach((shot, index) => {
                if (this.shotDangerType === '') {
                    shots_filter10.push(shot);
                } else if (this.shotDangerType === 'HD') {
                    if (shot.shotDanger === 'HD') {
                        shots_filter10.push(shot);
                    }
                } else if (this.shotDangerType === 'MD') {
                    if (shot.shotDanger === 'MD') {
                        shots_filter10.push(shot);
                    }
                } else if (this.shotDangerType === 'LD') {
                    if (shot.shotDanger === 'LD') {
                        shots_filter10.push(shot);
                    }
                }
            });
        }else{
            shots_filter9.forEach((shot, index) => {
                if (this.danger === 'HD') {
                    if (shot.shotDanger === 'HD') {
                        shots_filter10.push(shot);
                    }
                } else if (this.danger === 'MD') {
                    if (shot.shotDanger === 'MD') {
                        shots_filter10.push(shot);
                    }
                } else if (this.danger === 'LD') {
                    if (shot.shotDanger === 'LD') {
                        shots_filter10.push(shot);
                    }
                }
            });
        }
        

        if (this.map_type === 'typy_akce') {
            shots_filter10.forEach((shot, index) => {
                this.games.forEach(game => {
                    if (game.active == true && game.match == shot.match) {
                        shots_filter11.push(shot);
                    }
                });
            });

            shots_filter11.forEach(shot => {
                if (this.type === 'forecheck') {
                    if (shot.forecheck === true) {
                        shots_final.push(shot);
                    }
                } else if (this.type === 'rush') {
                    if (shot.rush === true) {
                        shots_final.push(shot);
                    }
                }else if (this.type === 'long') {
                    if (shot.long === true) {
                        shots_final.push(shot);
                    }
                }else if (this.type === 'afterFO') {
                    if (shot.afterFO === true) {
                        shots_final.push(shot);
                    }
                } else if (this.type === 'oddManRush') {
                    if (shot.oddManRush === true) {
                        shots_final.push(shot);
                    }
                } else {

                }
            });
        } else if (this.map_type === 'hraci_spolu') {
            shots_filter10.forEach((shot, index) => {
                this.games.forEach(game => {
                    if (game.active == true && game.match == shot.match) {
                        shots_filter11.push(shot);
                    }
                });
            });

            if (this.action_type == "rush") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["rush"] == true) {
                        shots_filter12.push(shot);
                    }
                });
                //Přečíslení
            } else if (this.action_type == "oddManRush") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["oddManRush"] == true) {
                        shots_filter12.push(shot);
                    }
                });
            } else if (this.action_type == "forecheck") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["forecheck"] == true) {
                        shots_filter12.push(shot);
                    }
                });
            } else if (this.action_type == "long") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["long"] == true) {
                        shots_filter12.push(shot);
                    }
                });
            } else if (this.action_type == "afterFO") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["afterFO"] == true) {
                        shots_filter12.push(shot);
                    }
                });
            } else {
                shots_filter11.forEach((shot, index) => {
                    shots_filter12.push(shot);
                });
            }


            shots_filter12.forEach((shot, index) => {
                if (shot.player === this.player_uuid) {
                    shots_final.push(shot);
                }
            });

        } else if (this.map_type === 'poslednich_5_zapasu') {
            shots_filter10.forEach((shot, index) => {
                shots_filter11.push(shot)
            });

            if (this.action_type == "rush") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["rush"] == true) {
                        shots_final.push(shot);
                    }
                });
                //Přečíslení
            } else if (this.action_type == "oddManRush") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["oddManRush"] == true) {
                        shots_final.push(shot);
                    }
                });
            } else if (this.action_type == "long") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["long"] == true) {
                        shots_final.push(shot);
                    }
                });
            } else if (this.action_type == "afterFO") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["afterFO"] == true) {
                        shots_final.push(shot);
                    }
                });
            } else if (this.action_type == "forecheck") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["forecheck"] == true) {
                        shots_final.push(shot);
                    }
                });
            } else {
                shots_filter11.forEach((shot, index) => {
                    shots_final.push(shot);
                });
            }
        }else if (this.map_type === 'nebezpecnost_strel') {
            shots_filter10.forEach((shot, index) => {
                shots_filter11.push(shot)
            });

            if (this.action_type == "rush") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["rush"] == true) {
                        shots_final.push(shot);
                    }
                });
                //Přečíslení
            } else if (this.action_type == "oddManRush") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["oddManRush"] == true) {
                        shots_final.push(shot);
                    }
                });
            } else if (this.action_type == "long") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["long"] == true) {
                        shots_final.push(shot);
                    }
                });
            } else if (this.action_type == "afterFO") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["afterFO"] == true) {
                        shots_final.push(shot);
                    }
                });
            } else if (this.action_type == "forecheck") {
                shots_filter11.forEach((shot, index) => {
                    if (shot["forecheck"] == true) {
                        shots_final.push(shot);
                    }
                });
            } else {
                shots_filter11.forEach((shot, index) => {
                    shots_final.push(shot);
                });
            }
        }

        this.circles = shots_final;
    }


    shotClick(shot: any) {
        this.video_url = "";
        this.video_url_safe = "";
        this.active_video = "";

        this.tooltip_x = shot.x;
        this.tooltip_y = shot.y;

        this.selected_shot = shot;

        this.showVideoModal = true;
    }

    playGameVideo(match, player, shot) {

        this.video_selected_player = player;
        this.video_selected_match = match;

        this.video_url = "";
        this.video_url_safe = "";
        this.active_video = "";


        this.modal_videos = [];

        if (player == "all" || player == undefined) {
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

    openVideoPlayer() {
        this.openSmallVideo.emit(this.modal_videos);
    }

    getRoundNumber(value:any, decimals:number){
      return parseFloat(value).toFixed(decimals);
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

    closeVideo() {
        this.selected_shot = [];
        this.showVideoModal = false;
        this.active_video = "";
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

    toggleShotmapInfobar() {
        if (this.shotmapInfobarOpen) {
            this.shotmapInfobarOpen = false;
            this.openshotmapInfobar.emit()
        } else {
            this.shotmapInfobarOpen = true;
            this.openshotmapInfobar.emit()
        }
    }

    getAllGoals() {
        let count = 0;
        this.circles.forEach(shot => {
            if (shot.type === 'G') {
                count = count + 1;
            }
        });
        return count;
    }

    /* getToi(){
      if(this.toi != undefined){
        this.toi.forEach( (toi,index) => {
        if(toi.match == this.gameId){
          return toi[index].toi
        }
      });}

    } */

    getAllXg() {
        let count = 0;
        this.circles.forEach(shot => {
            count = count + Number(shot.xG);
        });
        return Math.round((count + Number.EPSILON) * 100) / 100;
    }

    getXg(type: string) {
        let count = 0;
        this.circles.forEach(shot => {
            if (shot.shotDanger === type) {
                count = count + Number(shot.xG);
            }
        });
        return Math.round((count + Number.EPSILON) * 100) / 100;
    }

    getShotsCount(type: string) {
        let count = 0;
        this.circles.forEach(shot => {
            if (shot.shotDanger === type) {
                count = count + 1;
            }
        });
        return count;
    }

    getGoalsCount(type: string) {
        let count = 0;
        console.log("circles",this.circles)
        this.circles.forEach(shot => {
            if (shot.shotDanger === type && shot.type === "G") {
                count = count + 1;
            }
        });
        return count;
    }

}
