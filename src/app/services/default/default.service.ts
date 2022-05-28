import { Injectable, isDevMode } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { Observable as RxObservable, Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import { Router } from "@angular/router";
import { Alert } from "selenium-webdriver";

@Injectable()
export class DefaultService {
  public token: string;

  api_url: string = "http://logiq.statistics.datasport.cz";
  test_api_url: string = "http://logiq-test.statistics.datasport.cz";

  constructor(private router: Router, private http: Http) {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.token = currentUser;

    /*  if (isDevMode()) {
            this.api_url = "http://logiq-test-2.statistics.datasport.cz";
        } */
    if (isDevMode()) {
      this.api_url = "http://logiq-test.statistics.datasport.cz";
    }
  }

  getToken(post: {
    grant_type: string;
    client_id: string;
    client_secret: string;
  }) {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    console.log("Proběhl relogin.");
    var body = {
      grant_type: "client_credentials",
      client_id: post["client_id"],
      client_secret: post["client_secret"],
    };

    return this.http
      .post(this.api_url + "/api/v1/token", body, options)
      .map((res: Response) => res.json())
      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }
  getTokenTest(post: {
    grant_type: string;
    client_id: string;
    client_secret: string;
  }) {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    console.log("Proběhl relogin.");
    var body = {
      grant_type: "client_credentials",
      client_id: post["client_id"],
      client_secret: post["client_secret"],
    };

    return this.http
      .post(this.test_api_url + "/api/v1/token", body, options)
      .map((res: Response) => res.json())
      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loaded_data");
    this.router.navigate(["/"]);
  }

  getCompetitions() {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(this.api_url + "/api/v1/competition", options)
      .map((res) => res.json())
      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getCompetitionDetail(uuid: string) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .get(this.api_url + "/api/v1/competition/" + uuid, options)
      .map((res) => res.json())
      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getAverages(
    competitions: string,
    lastPlayedMatches: number,
    countOfPlayer: string,
    scoreState: string,
    place: string,
    opponentTeams: any[],
    dateFrom: string,
    dateTo: string,
    timeFrom: number,
    timeTo: number,
    timeOnIce: number,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (place == "") {
      place = undefined;
    }
    if (opponentTeams.length == 0) {
      opponentTeams = undefined;
    }
    if (countOfPlayer == "") {
      countOfPlayer = undefined;
    }
    if (scoreState == "") {
      scoreState = undefined;
    }
    if (dateFrom == "NaN-NaN-NaN") {
      dateFrom = undefined;
    }
    if (dateTo == "NaN-NaN-NaN") {
      dateTo = undefined;
    }

    if (timeFrom == null) {
      timeFrom = undefined;
    }
    if (timeTo == null) {
      timeTo = undefined;
    }
    if (lastPlayedMatches == null) {
      lastPlayedMatches = undefined;
    }
    if (timeOnIce == null) {
      timeOnIce = undefined;
    } else {
      timeOnIce = timeOnIce * 60;
    }

    let afterEvent = {
      event: filter_situationType,
      length: filter_situationTime,
    };

    if (
      filter_situationType == undefined ||
      filter_situationTime == undefined
    ) {
      afterEvent = undefined;
    }

    var body = {
      gameState: countOfPlayer,
      scoreState: scoreState,
      place: place,
      opponentTeams: opponentTeams,
      dateFrom: dateFrom,
      dateTo: dateTo,
      timeFrom: timeFrom,
      timeTo: timeTo,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    return this.http
      .post(this.api_url + "/api/v1/average/" + competitions, body, options)
      .map((res) => res.json())

      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeamToi(
    competitions: string,
    lastPlayedMatches: number,
    countOfPlayer: string,
    scoreState: string,
    place: string,
    opponentTeams: any[],
    dateFrom: string,
    dateTo: string,
    timeFrom: number,
    timeTo: number,
    timeOnIce: number,
    filter_situationType: string,
    filter_situationTime: number,
    teamUuid: string,
    players_list: any[]
  ) {
    /* selected_attributes: any, */
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (place == "") {
      place = undefined;
    }
    if (opponentTeams.length == 0) {
      opponentTeams = undefined;
    }
    if (countOfPlayer == "") {
      countOfPlayer = undefined;
    }
    if (scoreState == "") {
      scoreState = undefined;
    }
    if (dateFrom == "NaN-NaN-NaN") {
      dateFrom = undefined;
    }
    if (dateTo == "NaN-NaN-NaN") {
      dateTo = undefined;
    }
    if (timeFrom == null) {
      timeFrom = undefined;
    } else {
      timeFrom = timeFrom * 60;
    }
    if (timeTo == null) {
      timeTo = undefined;
    } else {
      timeTo = timeTo * 60;
    }
    if (lastPlayedMatches == null) {
      lastPlayedMatches = undefined;
    }
    if (timeOnIce == null) {
      timeOnIce = undefined;
    } else {
      timeOnIce = timeOnIce * 60;
    }

    let afterEvent = {
      event: filter_situationType,
      length: filter_situationTime,
    };

    if (
      filter_situationType == undefined ||
      filter_situationTime == undefined
    ) {
      afterEvent = undefined;
    }

    let formation = [];

    if (players_list.length != 0) {
      players_list.forEach((element) => {
        formation.push({
          player: element,
          on: true,
        });
      });
    }

    var body = {
      formation: formation,
      gameState: countOfPlayer,
      scoreState: scoreState,
      place: place,
      opponentTeams: opponentTeams,
      dateFrom: dateFrom,
      dateTo: dateTo,
      timeFrom: timeFrom,
      timeTo: timeTo,
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
    };

    /* let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes; */

    return this.http
      .post(
        this.api_url + "/api/v1/toi/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getVideo(competitions: string, matchUuid: string, playerUuid: string) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });
    var body = {};

    return this.http
      .post(
        this.api_url +
          "/api/v1/video/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          playerUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getVideoTeam(competitions: string, matchUuid: string, teamUuid: string) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });
    var body = {};

    return this.http
      .post(
        this.api_url + "/api/v1/video/" + competitions + "/" + matchUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getAllAttributes() {
    let url = "";

    if (isDevMode()) {
      url =
        "http://hockeylogic.sh10w1.esports.cz/mock/attributes_test_new.php?id=" +
        Math.floor(Date.now() / 1000);
    } else {
      url =
        "http://hockeylogic.sh10w1.esports.cz/mock/attributes_test_new.php?id=" +
        Math.floor(Date.now() / 1000);
    }

    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getHelp() {
    let url = "";

    if (isDevMode()) {
      url =
        "http://hockeylogic.sh10w1.esports.cz/mock/help_HL.php?id=" +
        Math.floor(Date.now() / 1000);
    } else {
      url =
        "http://hockeylogic.sh10w1.esports.cz/mock/help_HL.php?id=" +
        Math.floor(Date.now() / 1000);
    }

    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getDefinedSets() {
    let url = "";

    if (isDevMode()) {
      url =
        "http://hockeylogic.sh10w1.esports.cz/mock/datasets_test.php?id=" +
        Math.floor(Date.now() / 1000);
    } else {
      url =
        "http://hockeylogic.sh10w1.esports.cz/mock/datasets_test.php?id=" +
        Math.floor(Date.now() / 1000);
    }

    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  isUserLogged() {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .get(this.api_url + "/api/v1/competition", options)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getUserLocation() {
    return this.http
      .get("http://ip-api.com/json")
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getAttributesUserList(id: number) {
    let url = "";
    url =
      "http://hockeylogic.sh10w1.esports.cz/external_data/getData.php?id=" +
      id +
      "&cache=" +
      Math.floor(Date.now() / 1000);

    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getReportNormal() {
    let url = "";

    if (isDevMode()) {
      url =
        "http://hockeylogic.sh10w1.esports.cz/mock/report_metrics.php?id=" +
        Math.floor(Date.now() / 1000);
    } else {
      url =
        "http://hockeylogic.sh10w1.esports.cz/mock/report_metrics.php?id=" +
        Math.floor(Date.now() / 1000);
    }

    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  setAttributesUserList(id: number, data: string) {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });

    var body = {
      data: data,
    };
    // alert("Loading ...");

    return this.http
      .post(
        "http://hockeylogic.sh10w1.esports.cz/external_data/saveData.php?id=" +
          id,
        body,
        options
      )
      .map((res: Response) => res.json())
      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  downloadXLS(body: any) {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });

    body = JSON.stringify(body);

    var url =
      "http://hockeylogic.sh10w1.esports.cz/external_data/xlsExport.php";

    return this.http.post(url, body).map((res) => res.json());
  }

  //tracking!!!!!
  loginUser(user: string, pass: string, resolution: string) {
    let url = "http://hockeylogic.sh10w1.esports.cz/tracking_api/?page=login";

    var body = {
      user: user,
      pass: pass,
      resolution: resolution,
    };

    return this.http.post(url, body).map((res) => res.json());
  }

  getLogins(user_id: string) {
    let url = "";
    url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/index.php?page=getLogins&user_id=" +
      user_id +
      "&cache=" +
      Math.floor(Date.now() / 1000);
    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getUsers() {
    let url = "";
    url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/index.php?page=getUsers&cache=" +
      Math.floor(Date.now() / 1000);
    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  toggleActiveUser(user_id: number, state: number) {
    let url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/?page=toggleActiveUser";

    var body = {
      user_id: user_id,
      state: state,
    };

    return this.http.post(url, body).map((res) => res.json());
  }

  toggleAdminUser(user_id: number, state: number) {
    let url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/?page=toggleAdminUser";

    var body = {
      user_id: user_id,
      state: state,
    };

    return this.http.post(url, body).map((res) => res.json());
  }

  toggleTestUser(user_id: number, state: number) {
    let url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/?page=toggleTestUser";

    var body = {
      user_id: user_id,
      state: state,
    };

    return this.http.post(url, body).map((res) => res.json());
  }

  editUserPassword(user_id: number, password: string) {
    let url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/?page=editUserPass";

    var body = {
      user_id: user_id,
      password: password,
    };

    return this.http.post(url, body).map((res) => res.json());
  }

  getLogs(user_id: string) {
    let url = "";
    url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/index.php?page=getLogs&user_id=" +
      user_id +
      "&cache=" +
      Math.floor(Date.now() / 1000);
    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  addEvent(user: number, user_email: string, event: string, type: number) {
    let url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/?page=addEvent";
    var body = {
      user: user,
      user_email: user_email,
      event: event,
      type: type,
    };
    return this.http.post(url, body).map((res) => res.json());
  }

  getPagesPercent() {
    let url = "";
    url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/index.php?page=getPagesPercent&" +
      "&cache=" +
      Math.floor(Date.now() / 1000);
    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getPagesPercentWithDate(dateFrom: string, dateTo: string) {
    let url = "";
    url =
      "http://hockeylogic.sh10w1.esports.cz/tracking_api/index.php?page=getPagesPercent&dateFrom=" +
      dateFrom +
      "&dateTo=" +
      dateTo +
      "&cache=" +
      Math.floor(Date.now() / 1000);
    return this.http
      .get(url)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  addUser(email: string, password: string) {
    let url = "http://hockeylogic.sh10w1.esports.cz/tracking_api/?page=addUser";

    var body = {
      email: email,
      password: password,
    };

    return this.http.post(url, body).map((res) => res.json());
  }

  //VIDEO
  createVideo(user: string, videos: any) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    let url = this.api_url + "/api/v1/videoCut/bundle";

    var body = {
      customer: user,
      videos: [videos],
    };

    return this.http.post(url, body, options).map((res) => res.json());
  }

  createVideoList(user: string, videos: any) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    let url = this.api_url + "/api/v1/videoCut/bundle";

    var body = {
      customer: user,
      videos: videos,
    };

    return this.http.post(url, body, options).map((res) => res.json());
  }

  searchVideo(user: string) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    let url = this.api_url + "/api/v1/videoCut/search";

    var body = {
      customer: user,
    };
    return this.http.post(url, body, options).map((res) => res.json());
  }

  sendEmail(body: any) {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });

    body = JSON.stringify(body);

    var url =
      "http://hockeylogic.sh10w1.esports.cz/external_data/sendEmail.php" +
      "?cache=" +
      Math.floor(Date.now() / 1000);

    return this.http.post(url, body).map((res) => res.json());
  }
}
