import { Component, OnInit, isDevMode, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DefaultService, TranslatePipe]
})
export class DashboardComponent implements OnInit {

  text: string;
  competitions_data: any = [];
  seasons_list: any = [];
  competitions_list: any = [];
  competition_details: any = [];
  loading_data: boolean = true;

  //filters
  filter_season: any = [];
  seasons_select_list = [];
  dropdownSettings = {};
  filter_seasonPart: string = "";
  filter_team: string = "ALL";
  teams_list: any[];
  filter_countOfPlayer: string = "5:5";
  boolProd: boolean = true;

  dataLoaded: boolean;
  loading: boolean;

  constructor(private translate: TranslatePipe, private cd: ChangeDetectorRef, private defaultService: DefaultService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router) {
    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }


    this.dropdownSettings = {
      singleSelection: false,
      text: "Vybrat sezonu",
      selectAllText: 'Vybrat vše',
      unSelectAllText: 'Odebrat vše',
      enableSearchFilter: false,
      classes: "multiselect"
    };

  }

  ngOnInit() {

    this.forceToLoadDatasets()
    this.checkLoggedTime();
    if (localStorage.getItem("loaded_data") == null) {
      this.dashboardInit();
    } else {
      this.getCompetitions();
    }

    this.loadDefinedDatasest();

  }

  forceToLoadDatasets(){
    this.defaultService.getAttributesUserList(JSON.parse(localStorage.getItem('logged_user'))[0]["id"]).subscribe(loaded_data => {
      console.log("Loaded datasets dashboard:", loaded_data)
      
    },
      err => {
        alert("ERROR HTDS")
      }
    );
  }

  dashboardInit() {
    localStorage.setItem("competition_details", JSON.stringify(this.competition_details));
    this.defaultService.getCompetitions().subscribe(loaded_data => {
      this.competitions_data = loaded_data;
      localStorage.setItem("seasons_list", JSON.stringify(this.competitions_data));
      this.competitions_data.forEach((item, index) => {
        this.seasons_select_list.push({ "id": index, "itemName": item['name'] });
        item["competitions"].forEach((item, index) => {
          this.competitions_list.push(item);
        });
        localStorage.setItem("competitions_list", JSON.stringify(this.competitions_list));
      });
      this.seasons_select_list.reverse();
      localStorage.setItem("competitions_data", JSON.stringify(this.seasons_select_list));
      this.load_competition_details();
    },
      err => {
        //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
        //this.defaultService.logout();
        window.location.reload();
      }
    );
  }



  //filters -start
  getCompetitions() {
    this.seasons_list = JSON.parse(localStorage.getItem("seasons_list"));

    this.seasons_select_list = [];
    this.filter_season = [];

    this.seasons_list.forEach((item, index) => {
      let next_season = parseInt(item['name']) + 1;
      this.seasons_select_list.push({ "id": item['name'], "itemName": item['name'] + " - " + next_season });
    });
    //this.seasons_select_list.reverse();

    this.filter_season.push(this.seasons_select_list[0]);

    this.getSeasonParts();

    this.dataLoaded = false;
    this.loading = false;
    this.cd.detectChanges();

  }

  getSeasonParts() {
    this.filter_seasonPart = "";
    this.filter_team = "ALL";
    this.teams_list = [];

    this.dataLoaded = false;
    this.loading = false;

    let playoff = [];
    let base = [];
    let playout = [];
    let relegation = [];
    let preliminary = [];

    this.competitions_list = [];

    this.competitions_list = [
      { id: 0, name: this.translate.transform("zakladni_cast"), part: "base", uuids: "" },
      { id: 1, name: "Play-off", part: "playoff", uuids: "" },
      { id: 2, name: "Play-out", part: "playout", uuids: "" },
      { id: 3, name: this.translate.transform("baraz"), part: "relegation", uuids: "" },
      { id: 4, name: this.translate.transform("preliminary"), part: "preliminary", uuids: "" }
    ];


    if (this.filter_season != undefined) {

      this.filter_season.forEach((item, index) => {
        this.seasons_list.forEach((item2, index) => {
          if (item["id"] == item2["name"]) {
            item2["competitions"].forEach((item3, index) => {
              item3["season"] = item2["name"];

              if (item3["part"] == "base") {
                base.push(item3["uuid"]);
              } else if (item3["part"] == "playoff") {
                playoff.push(item3["uuid"]);
              } else if (item3["part"] == "playout") {
                playout.push(item3["uuid"]);
              } else if (item3["part"] == "relegation") {
                relegation.push(item3["uuid"]);
              } else if (item3["part"] == "preliminary") {
                preliminary.push(item3["uuid"]);
              }

            });
          }
        });
      });

      this.competitions_list = [
        { id: 0, name: this.translate.transform("zakladni_cast"), part: "base", uuids: this.itemsToStringApi(base) },
        { id: 1, name: "Play-off", part: "playoff", uuids: this.itemsToStringApi(playoff) },
        { id: 2, name: "Play-out", part: "playout", uuids: this.itemsToStringApi(playout) },
        { id: 3, name: this.translate.transform("baraz"), part: "relegation", uuids: this.itemsToStringApi(relegation) },
        { id: 4, name: this.translate.transform("preliminary"), part: "preliminary", uuids: this.itemsToStringApi(preliminary) },
      ];

    }

    this.filter_seasonPart = this.competitions_list[0]["uuids"];
    this.getTeamsData();
  }

  getTeamsData() {
    this.filter_team = "ALL";
    this.teams_list = [];

    this.dataLoaded = false;
    this.loading = false;

    let uuids = this.filter_seasonPart.split(",");


    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(localStorage.getItem("competition_details"));


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
                "stick": player["stick"],
                "hokejczId": player["hokejczId"]
              }
              localStorage.setItem(player["uuid"], JSON.stringify(key));
            });


            //load team player list
            var index: any = this.teams_list.findIndex(x => x.uuid == team["uuid"])
            if (index === -1) {
              this.teams_list.push({
                "uuid": team["uuid"],
                "name": team["name"],
                "shortName": team["shortName"],
                "shortcut": team["shortcut"],
                "team": team["uuid"],
                "players": ""
              });
            } else console.log("object already exists")


          });
        }


      });

    });

    this.loading_data = false;

  }

  vybratTeamCheck() {
    this.dataLoaded = false;
    this.loading = false;
  }

  checkLoggedTime() {
    let dt1 = new Date(localStorage.getItem('logged_date'));
    console.log("dt1",dt1)
    let dt2 = new Date();
    console.log("dt2",dt2)
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    console.log("diff0",diff)
    diff /= (60 * 60);
    console.log("diff1",diff);
    console.log("diff",Math.round(diff));
    if (Math.abs(Math.round(diff)) > 6) {
      alert("Platnost relace přihlášení vypršela. Přihlaste se znovu.");
      this.defaultService.logout();
    }
  }


  load_competition_details() {


    this.competitions_list.forEach((item, index) => {

      this.defaultService.getCompetitionDetail(item['uuid']).subscribe(loaded_data => {


        this.competition_details = JSON.parse(localStorage.getItem("competition_details"));
        this.competition_details.push({ [item['uuid']]: loaded_data });
        localStorage.setItem("competition_details", JSON.stringify(this.competition_details));


        this.loadAttributes();


      });
    });
  }

  loadDefinedDatasest(){
    this.defaultService.getDefinedSets().subscribe(loaded_data => {
      localStorage.setItem('defined_sets', JSON.stringify(loaded_data));
    });
  }

  loadAttributes() {


    this.defaultService.getAllAttributes().subscribe(loaded_data => {
      /* console.log("getAllAttributes Response:", loaded_data)
      for (let item in loaded_data["players"][0]["individual"][0]) {
        loaded_data["players"][0]["individual"][0][item][0]["types"].forEach(type => {
          console.log("ATT", type)
        });
      }
      for (let item in loaded_data["players"][0]["individual"][0]) {
        loaded_data["players"][0]["individual"][0][item][0]["types"].forEach(type => {
          type["attributes"].forEach(attribute=> {
            attribute["on-ice"] = false;
          });
        });
      }
      for (let item in loaded_data["players"][0]["onIce"][0]) {
        loaded_data["players"][0]["onIce"][0][item][0]["types"].forEach(type => {
          type["attributes"].forEach(attribute=> {
            attribute["on-ice"] = false;
          });
        });
      } */

      localStorage.setItem('loaded_attributes', JSON.stringify(loaded_data));


      setTimeout(() => {
        localStorage.setItem("loaded_data", "loaded");

        this.getCompetitions();

      }, 5000);


    });



  }

  itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.itemName;
      }).join(', ');
  }

  itemsToStringApi(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item;
      }).join(',');
  }






}
