import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';

@Component({
  selector: 'downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
  providers: [DefaultService]
})
export class DownloadsComponent implements OnInit {

  loading: boolean = true;
  download_data: any = [];

  linkArray: any = [];


  constructor(private defaultService: DefaultService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.loadData();
    setInterval(() => {
      this.loadData();
    }, 10000);

    /*
    this.data["left"].forEach(item => {
      if (item.player == "abe576d6-896a-496e-90ce-8f0c5ccc637c") {
        if (item.shot != null) {
          if (item["shot"]["inSlot"] == true) {
            console.log("LOL");
          }
        }
      }
    });

    this.data["center"].forEach(item => {
      if (item.player == "abe576d6-896a-496e-90ce-8f0c5ccc637c") {
        if (item.shot != null) {
          if (item["shot"]["inSlot"] == true) {
            console.log("LOL");
          }
        }
      }
    });

    this.data["right"].forEach(item => {
      if (item.player == "abe576d6-896a-496e-90ce-8f0c5ccc637c") {
        if (item.shot != null) {
          if (item["shot"]["inSlot"] == true) {
            console.log("LOL");
          }
        }
      }
    });
    */

  }

  loadData() {
    this.download_data = [];
    let logged_user = JSON.parse(localStorage.getItem('logged_user'))[0]["user"];
    this.defaultService.searchVideo(logged_user).subscribe(loaded_data => {
      loaded_data.forEach(item => {

        item["videos"].forEach((video, index) => {
          if (index == 0) {
            if (video["description"] != null) {
              video["video_text"] = video["description"].split(';');
              if (item["videos"].length > 1) {
                video["video_multiple"] = "(více videosouborů)";
              }
            } else {
              video["video_text"] = [];
            }
            //alert(JSON.stringify(video));
            video["timestamp"] = video["video_text"][5];


            if (video["timestamp"] != undefined && video["description"] != "") {
              this.download_data.push(video);
            }
          }


        });


        this.linkArray = [];
        this.download_data.forEach(item => {
          if (item["cut"] != null) {
            this.linkArray.push(item["cut"]["url"]);
          }
        });


      });

      this.download_data.sort((a, b) => {
        if (b.timestamp != undefined) {
          return b.timestamp.localeCompare(a.timestamp);
        }
      });


      //console.log(JSON.stringify(loaded_data));
      this.loading = false;
    });
  }

  getBulyState(state: string) {
    return state;
  }

  getVstupState(state: string) {
    if (Boolean(state) == true) {
      return "successful";
    } else {
      return "unsuccessful";
    }
  }

  downloadAll() {
    this.linkArray.forEach(element => {
      window.open(element);
    });
  }

}


