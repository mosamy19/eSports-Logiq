import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  isDevMode,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
  selector: "video-modal",
  templateUrl: "./video-modal.component.html",
  styleUrls: ["./video-modal.component.scss"],
  providers: [TranslatePipe],
})
export class VideoComponent implements OnInit {
  video_url: any = "";

  start_video_time: string = "";

  @Output() myEvent = new EventEmitter<string>();

  @Input() videoData: any;
  @Input() player_uuid: string;
  @Input() videoTitle: any = [];
  @Input() video_player_type: string = "";

  videoData_new: any = [];

  videoId: string = "";

  selected_video: string = "";
  filter_situationType: string = "shots";

  boolProd: boolean = true;

  toggleVideoModal() {
    this.myEvent.emit("eventDesc");
  }

  constructor(
    private translate: TranslatePipe,
    public sanitizer: DomSanitizer
  ) {
    this.sanitizer = sanitizer;

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }
  }

  ngOnInit() {
    //console.log(JSON.stringify(this.videoData));
    let new_video_list = [];

    let shotsOnGoal_data = [];
    let goals_data = [];
    let chances_data = [];
    let shots_data = [];

    if (this.video_player_type == "team") {
      this.videoData["players"].forEach((player) => {
        player["shotsOnGoal"].forEach((shotsOnGoal) => {
          shotsOnGoal["player"] = player["player"];
          shotsOnGoal_data.push(shotsOnGoal);
        });
      });

      shotsOnGoal_data.sort((a, b) => {
        return a.time - b.time;
      });
      this.videoData_new["shotsOnGoal"] = shotsOnGoal_data;

      this.videoData["players"].forEach((player) => {
        player["goals"].forEach((goals) => {
          goals["player"] = player["player"];
          goals_data.push(goals);
        });
      });
      goals_data.sort((a, b) => {
        return a.time - b.time;
      });
      this.videoData_new["goals"] = goals_data;

      this.videoData["players"].forEach((player) => {
        player["chances"].forEach((chances) => {
          chances["player"] = player["player"];
          chances_data.push(chances);
        });
      });
      chances_data.sort((a, b) => {
        return a.time - b.time;
      });
      this.videoData_new["chances"] = chances_data;

      this.videoData["players"].forEach((player) => {
        player["shots"].forEach((shots) => {
          shots["player"] = player["player"];
          shots_data.push(shots);
        });
      });
      shots_data.sort((a, b) => {
        return a.time - b.time;
      });
      this.videoData_new["shots"] = shots_data;

      console.log(JSON.stringify(this.videoData_new));
    } else if (this.video_player_type == "player") {
      this.videoData_new = this.videoData;

      console.log(JSON.stringify(this.videoData_new));
    }

    this.videoId = this.videoData["videoPlayer"]["videoId"];
    this.start_video_time = this.videoData["videoPlayer"]["videoTime"];
  }

  getTrustedUrl(url: any, video_id: string) {
    this.selected_video = video_id;
    this.video_url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getRealVideoStart(action_time: string) {
    this.start_video_time = action_time;
    //alert(action_time);
    return action_time;
  }

  diff_minutes(dt2, dt1) {
    var diff = dt2.getTime() - dt1.getTime();
    diff /= 1000;
    return Math.abs(Math.round(diff));
  }

  stopVideo() {
    this.selected_video = "";
    this.video_url = this.sanitizer.bypassSecurityTrustResourceUrl("");
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

  getGameState(state: string) {
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
}
