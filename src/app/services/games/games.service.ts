import { Injectable, isDevMode } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { Observable as RxObservable, Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Injectable()
export class GamesService {
  public token: string;

  api_url: string = "http://logiq.statistics.datasport.cz";

  constructor(private router: Router, private http: Http) {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.token = currentUser;

    /*  if (isDevMode()) {
            this.api_url = "http://logiq-test-2.statistics.datasport.cz";
        } */
    if (isDevMode()) {
      this.api_url = "http://logiq.statistics.datasport.cz";
    }
  }

  getAllGamesList(
    competitions: string,
    dateFrom: string,
    dateTo: string,
    lastPlayedMatches: number,
    filter_situationType: string,
    filter_situationTime: number
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    console.log("Competetion", competitions);
    if (dateFrom == "NaN-NaN-NaN") {
      dateFrom = undefined;
    }
    if (dateTo == "NaN-NaN-NaN") {
      dateTo = undefined;
    }
    if (lastPlayedMatches == null) {
      lastPlayedMatches = undefined;
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
      dateFrom: dateFrom,
      dateTo: dateTo,
      lastPlayedMatches: lastPlayedMatches,
      afterEvent: afterEvent,
    };

    return this.http
      .get(this.api_url + "/api/v1/match/" + competitions, options)
      .map((res) => res.json())
      .catch((e) => {
        //alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getGamesList(
    competitions: string,
    team1Uuid: string,
    team2Uuid: string,
    dateFrom: string,
    dateTo: string,
    lastPlayedMatches: number,
    filter_situationType: string,
    filter_situationTime: number
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (dateFrom == "NaN-NaN-NaN") {
      dateFrom = undefined;
    }
    if (dateTo == "NaN-NaN-NaN") {
      dateTo = undefined;
    }
    if (lastPlayedMatches == null) {
      lastPlayedMatches = undefined;
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
      dateFrom: dateFrom,
      dateTo: dateTo,
      lastPlayedMatches: lastPlayedMatches,
      afterEvent: afterEvent,
    };
    console.log("Competetion", competitions);

    if (team2Uuid != "") {
      return this.http
        .post(
          this.api_url +
            "/api/v1/match/" +
            competitions +
            "/" +
            team1Uuid +
            "/" +
            team2Uuid,
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
    } else {
      return this.http
        .post(
          this.api_url + "/api/v1/match/" + competitions + "/" + team1Uuid,
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
  }

  getGamesListByTeam(
    competitions: string,
    team1Uuid: string,
    dateFrom: string,
    dateTo: string,
    lastPlayedMatches: number,
    filter_situationType: string,
    filter_situationTime: number,
    players: any
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (dateFrom == "NaN-NaN-NaN") {
      dateFrom = undefined;
    }
    if (dateTo == "NaN-NaN-NaN") {
      dateTo = undefined;
    }
    if (lastPlayedMatches == null) {
      lastPlayedMatches = undefined;
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

    //alert(JSON.stringify(players));

    let formation = [];
    players.forEach((item) => {
      if (item.playerUUID != "") {
        formation.push({
          player: item.playerUUID,
          on: true,
        });
      }
    });

    var body = {
      dateFrom: dateFrom,
      dateTo: dateTo,
      lastPlayedMatches: lastPlayedMatches,
      formation: formation,
    };

    //alert(JSON.stringify(body));

    return this.http
      .post(
        this.api_url + "/api/v1/match/" + competitions + "/" + team1Uuid,
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

  getTeamsData(
    competitions: string,
    matchUuid: string,
    team1Uuid: string,
    scoreState: string,
    timeFrom: number,
    timeTo: number,
    countOfPlayer: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (scoreState == "") {
      scoreState = undefined;
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
    if (countOfPlayer == "") {
      countOfPlayer = undefined;
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
      timeFrom: timeFrom,
      timeTo: timeTo,
      afterEvent: afterEvent,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    attributes.push("cf_percent");
    attributes.push("sogf");
    attributes.push("scf_percent");
    attributes.push("fow_percent");
    body["metrics"] = attributes;

    return this.http
      .post(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/team",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        alert(e);

        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getGraphicOverview(
    competitions: string,
    matchUuid: string,
    team1Uuid: string
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });
    console.log("Match id", matchUuid);
    return this.http
      .get(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/preview",
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getReport(competitions: string, matchUuid: string, team1Uuid: string) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    console.log("Match id", matchUuid);
    console.log("competitions", competitions);
    console.log("teamuuid", team1Uuid);
    return this.http
      .get(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/summary",
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getBlock1(
    competitions: string,
    matchUuid: string,
    team1Uuid: string,
    fisrtBlockGameState: string,
    firstBlockGamePart: number
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (
      fisrtBlockGameState === undefined ||
      fisrtBlockGameState === null ||
      fisrtBlockGameState === ""
    ) {
      fisrtBlockGameState = "5:5";
      alert("error GSGR0");
    }
    if (firstBlockGamePart === undefined || firstBlockGamePart === NaN) {
      firstBlockGamePart = null;
      alert("error GSGR1");
    }

    var body = {
      gameState: fisrtBlockGameState,
      gamePart: firstBlockGamePart,
    };

    console.log("body", body);

    return this.http
      .post(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/summary/block1",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getBlock2(
    competitions: string,
    matchUuid: string,
    team1Uuid: string,
    secondBlockGameState: string,
    secondBlockGamePart: number
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (
      secondBlockGameState === undefined ||
      secondBlockGameState === null ||
      secondBlockGameState === ""
    ) {
      secondBlockGameState = "5:5";
      alert("error GSGR2");
    }
    if (secondBlockGamePart === undefined || secondBlockGamePart === NaN) {
      secondBlockGameState = null;
      alert("error GSGR3");
    }

    var body = {
      gameState: secondBlockGameState,
      gamePart: secondBlockGamePart,
    };

    return this.http
      .post(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/summary/block2",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        alert(e);
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getPlayersData(
    competitions: string,
    matchUuid: string,
    team1Uuid: string,
    scoreState: string,
    timeFrom: number,
    timeTo: number,
    countOfPlayer: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (scoreState == "") {
      scoreState = undefined;
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
    if (countOfPlayer == "") {
      countOfPlayer = undefined;
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
      timeFrom: timeFrom,
      timeTo: timeTo,
      afterEvent: afterEvent,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    //console.log(JSON.stringify(body));
    //console.log(this.api_url + "/api/v1/match/" + competitions + "/" + matchUuid + "/" + team1Uuid + "/player");

    return this.http
      .post(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/player",
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

  getGoalkeepersData(
    competitions: string,
    matchUuid: string,
    team1Uuid: string,
    scoreState: string,
    timeFrom: number,
    timeTo: number,
    countOfPlayer: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (scoreState == "") {
      scoreState = undefined;
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
    if (countOfPlayer == "") {
      countOfPlayer = undefined;
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
      timeFrom: timeFrom,
      timeTo: timeTo,
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
      .post(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/goalkeeper",
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

  getFormationsData(
    competitions: string,
    matchUuid: string,
    team1Uuid: string,
    scoreState: string,
    timeFrom: number,
    timeTo: number,
    countOfPlayer: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (scoreState == "") {
      scoreState = undefined;
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
    if (countOfPlayer == "") {
      countOfPlayer = undefined;
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
      timeFrom: timeFrom,
      timeTo: timeTo,
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
      .post(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/formation",
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

  getH2H(
    competitions: string,
    matchUuid: string,
    team1Uuid: string,
    scoreState: string,
    timeFrom: number,
    timeTo: number,
    countOfPlayer: string,
    filter_situationType: string,
    filter_situationTime: number
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (scoreState == "") {
      scoreState = undefined;
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
    if (countOfPlayer == "") {
      countOfPlayer = undefined;
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
      //"scoreState": scoreState,
      //"timeFrom": timeFrom,
      //"timeTo": timeTo,
      afterEvent: afterEvent,
    };

    //alert("body-h2H" + JSON.stringify(body));

    return this.http
      .post(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/headToHead",
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

  getFlow(
    competitions: string,
    matchUuid: string,
    team1Uuid: string,
    scoreState: string,
    timeFrom: number,
    timeTo: number,
    filter_situationType: string,
    filter_situationTime: number,
    countOfPlayer: string
  ) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    if (scoreState == "") {
      scoreState = undefined;
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
    if (countOfPlayer == "") {
      countOfPlayer = undefined;
    }

    var body = {
      gameState: countOfPlayer,
      scoreState: scoreState,
      timeFrom: timeFrom,
      timeTo: timeTo,
      afterEvent: afterEvent,
    };

    return this.http
      .post(
        this.api_url +
          "/api/v1/match/" +
          competitions +
          "/" +
          matchUuid +
          "/" +
          team1Uuid +
          "/flow",
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
}
