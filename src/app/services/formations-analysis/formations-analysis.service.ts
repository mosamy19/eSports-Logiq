import { Injectable, isDevMode } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { Observable as RxObservable, Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Injectable()
export class FormationsAnalysisService {
  public token: string;

  api_url: string = "http://logiq-test.statistics.datasport.cz";

  constructor(private router: Router, private http: Http) {
    var currentUser_test = JSON.parse(localStorage.getItem("currentUser_test"));
    this.token = currentUser_test;

    /* if (isDevMode()) {
      this.api_url = "http://logiq-test-2.statistics.datasport.cz";
    } */
    if (isDevMode()) {
      this.api_url = "http://logiq-test.statistics.datasport.cz";
    }
  }

  getFormation(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,

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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    //alert(JSON.stringify(body));

    return this.http
      .post(
        this.api_url + "/api/v1/formation/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getFormationRelative(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any,
    relative_to: string
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    //alert(JSON.stringify(body));

    if (relative_to == "competition") {
      var relative_to_url = "percentile";
    } else if (relative_to == "team") {
      var relative_to_url = "percentile";
    }

    return this.http
      .post(
        this.api_url +
        "/api/v1/formation/" +
        competitions +
        "/" +
        teamUuid +
        "/" +
        relative_to_url,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeammates(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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
        "/api/v1/formation/" +
        competitions +
        "/" +
        teamUuid +
        "/teammate",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeamsPercentil(
    competitions: string,
    teamUuid: string,
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

    var body = {
      formation: [],
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
        "/api/v1/formation/" +
        competitions +
        "/" +
        teamUuid +
        "/index",
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

  getTeammatesRelativeTo(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any,
    relative_to: string
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    if (relative_to == "competition") {
      var relative_to_url = "relativeToLeague";
    } else if (relative_to == "team") {
      var relative_to_url = "relativeToTeam";
    }

    return this.http
      .post(
        this.api_url +
        "/api/v1/formation/" +
        competitions +
        "/" +
        teamUuid +
        "/teammate/" +
        relative_to_url,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getOpponentsRelativeTo(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any,
    relative_to: string
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    if (relative_to == "competition") {
      var relative_to_url = "relativeToLeague";
    } else if (relative_to == "team") {
      var relative_to_url = "relativeToTeam";
    }

    return this.http
      .post(
        this.api_url +
        "/api/v1/formation/" +
        competitions +
        "/" +
        teamUuid +
        "/opponent/" +
        relative_to_url,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getOpponents(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any,
    matches: any
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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
      matches: matches,
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
        "/api/v1/formation/" +
        competitions +
        "/" +
        teamUuid +
        "/opponent",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getFormationShotsFor(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/formation",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getFormationShotsAgainst(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/formation/against",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeamShotsFor(
    competitions: string,
    teamUuid: string,
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
    matches: any
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
    /* dateFrom: dateFrom,
      dateTo: dateTo, */
    let all_matces;
    if (matches.length == 0) {
      all_matces = undefined;
    } else {
      all_matces = matches;
    }
    var body = {
      gameState: countOfPlayer,
      scoreState: scoreState,
      place: place,
      opponentTeams: opponentTeams,
      matches: all_matces,
      timeFrom: timeFrom,
      timeTo: timeTo,
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
    };

    /* console.log("body", body)
    console.log("Competetions", competitions)
    console.log("Options", options) */
    //alert(this.api_url + "/api/v1/shot/" + competitions + "/" + teamUuid + "    " + JSON.stringify(body));

    return this.http
      .post(
        this.api_url + "/api/v1/shot/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeamShotsForAgainst(
    competitions: string,
    teamUuid: string,
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
    filter_situationTime: number
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

    var body = {
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

    //alert(this.api_url + "/api/v1/shot/" + competitions + "/" + teamUuid + "    " + JSON.stringify(body));

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/against",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getFormationAssistsFor(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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

    return this.http
      .post(
        this.api_url +
        "/api/v1/pass/" +
        competitions +
        "/" +
        teamUuid +
        "/formation",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeamAssistsFor(
    competitions: string,
    teamUuid: string,
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
    filter_situationTime: number
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

    var body = {
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

    return this.http
      .post(
        this.api_url + "/api/v1/pass/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getFormationAssistsAgainst(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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

    return this.http
      .post(
        this.api_url +
        "/api/v1/pass/" +
        competitions +
        "/" +
        teamUuid +
        "/formation/against",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeamAssistsAgainst(
    competitions: string,
    teamUuid: string,
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
    filter_situationTime: number
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

    var body = {
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

    return this.http
      .post(
        this.api_url +
        "/api/v1/pass/" +
        competitions +
        "/" +
        teamUuid +
        "/against",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getShotInfo(match: string, player: string, time: number) {
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .get(
        this.api_url +
        "/api/v1/shot?match=" +
        match +
        "&player=" +
        player +
        "&time=" +
        time,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  //heatmaps

  getIndividualHeatmap(
    competitions: string,
    teamUuid: string,
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
    player: string,
    filter_situationType: string,
    filter_situationTime: number,
    enabled_matches_list: any,
    shotDanger: string
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

    if (shotDanger === "" || shotDanger === "ALL") {
      shotDanger = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: enabled_matches_list,
      shotDanger: shotDanger,
    };

    console.log("Heatmap body", body);

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/heatmap/individual/" +
        player,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getHeatmapOfTeam(
    competitions: string,
    teamUuid: string,
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
    enabled_matches_list: any,
    shotDanger: string
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

    if (shotDanger === "" || shotDanger === "ALL") {
      shotDanger = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: enabled_matches_list,
      shotDanger: shotDanger,
    };

    console.log("Heatmap body", body);

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/heatmap/team",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getHeatmapOfTeamRelativeToLeague(
    competitions: string,
    teamUuid: string,
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
    enabled_matches_list: any,
    shotDanger: string
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

    if (shotDanger === "" || shotDanger === "ALL") {
      shotDanger = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: enabled_matches_list,
      shotDanger: shotDanger,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/heatmap/team/relativeToLeague",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getHeatmapOfFormation(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    enabled_matches_list: any,
    shotDanger: string
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
      });
    }

    if (shotDanger === "" || shotDanger === "ALL") {
      shotDanger = undefined;
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
      matches: enabled_matches_list,
      shotDanger: shotDanger,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/heatmap/formation",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getHeatmapOfFormationRelativeToTeam(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    enabled_matches_list: any,
    shotDanger: string
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
      });
    }

    if (shotDanger === "" || shotDanger === "ALL") {
      shotDanger = undefined;
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
      matches: enabled_matches_list,
      shotDanger: shotDanger,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/heatmap/formation/relativeToTeam",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getHeatmapOfFormationRelativeToLeague(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    enabled_matches_list: any,
    shotDanger: string
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
      });
    }

    if (shotDanger === "" || shotDanger === "ALL") {
      shotDanger = undefined;
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
      matches: enabled_matches_list,
      shotDanger: shotDanger,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/shot/" +
        competitions +
        "/" +
        teamUuid +
        "/heatmap/formation/relativeToLeague",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getRelativeHeatmapImage(body: any, filter_shoot_category_heat: string) {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });

    body = JSON.stringify(body);

    var url =
      "http://hockeylogic-test.sh10w1.esports.cz/heatmap_python/generate_relheatmap.php?filter_shoot_category_heat=" +
      filter_shoot_category_heat;

    console.log("Relative To image");
    return this.http.post(url, body).map((res) => res.json());
  }

  getChanceHeatmapImage(body: any, filter_shoot_category_heat: string) {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });

    body = JSON.stringify(body);

    var url =
      "http://hockeylogic-test.sh10w1.esports.cz/heatmap_python/generate_chanceheatmap.php?filter_shoot_category_heat=" +
      filter_shoot_category_heat;

    console.log("Relative To image");
    return this.http.post(url, body).map((res) => res.json());
  }

  getNormalHeatmapImage(body: any) {
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });

    body = JSON.stringify(body);

    var url =
      "http://hockeylogic-test.sh10w1.esports.cz/heatmap_python/generate_normalheatmap.php";
    console.log("Normal To image");
    return this.http.post(url, body).map((res) => res.json());
  }

  getTeamFaceoff(
    competitions: string,
    teamUuid: string,
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
    stick: string
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

    if (stick == "") {
      stick = null;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      stick: stick,
    };

    return this.http
      .post(
        this.api_url + "/api/v1/faceOff/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())
      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getPlayerFaceoff(
    competitions: string,
    teamUuid: string,
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
    filter_player: string,
    filter_situationType: string,
    filter_situationTime: number,
    stick: string
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

    if (stick == "") {
      stick = null;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      stick: stick,
    };

    //console.log(this.api_url + "/api/v1/faceOff/" + competitions + "/" + teamUuid + "/" + filter_player);

    return this.http
      .post(
        this.api_url +
        "/api/v1/faceOff/" +
        competitions +
        "/" +
        teamUuid +
        "/" +
        filter_player,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getPlayerFaceoffSpoluhraci(
    type: string,
    competitions: string,
    teamUuid: string,
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
    filter_player: string,
    filter_situationType: string,
    filter_situationTime: number,
    stick: string,
    spot: string,
    matches: any
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

    if (stick == "") {
      stick = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      stick: stick,
      matches: matches,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/faceOff/" +
        competitions +
        "/" +
        teamUuid +
        "/" +
        filter_player +
        "/teammate/" +
        type +
        "/" +
        spot,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getPlayerFaceoffProtihraci(
    type: string,
    competitions: string,
    teamUuid: string,
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
    filter_player: string,
    filter_situationType: string,
    filter_situationTime: number,
    stick: string,
    spot: string,
    matches: any[]
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

    if (stick == "") {
      stick = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      stick: stick,
      matches: matches,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/faceOff/" +
        competitions +
        "/" +
        teamUuid +
        "/" +
        filter_player +
        "/opponent/" +
        type +
        "/" +
        spot,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeamFaceoffSpoluhraci(
    type: string,
    competitions: string,
    teamUuid: string,
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
    stick: string,
    spot: string,
    matches: any
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

    if (stick == "") {
      stick = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      stick: stick,
      matches: matches,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/faceOff/" +
        competitions +
        "/" +
        teamUuid +
        "/teammate/" +
        type +
        "/" +
        spot,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getTeamFaceoffProtihraci(
    type: string,
    competitions: string,
    teamUuid: string,
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
    stick: string,
    spot: string,
    matches: any
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

    if (stick == "") {
      stick = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      stick: stick,
      matches: matches,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/faceOff/" +
        competitions +
        "/" +
        teamUuid +
        "/opponent/" +
        type +
        "/" +
        spot,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getIndividualStatsTeammates(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    body["metrics"] = attributes;

    //alert(JSON.stringify(body));

    if (teamUuid == "ALL") {
      return this.http
        .post(
          this.api_url + "/api/v1/individual/" + competitions,
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
          this.api_url + "/api/v1/individual/" + competitions + "/" + teamUuid,
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

  getZoneEntryTeammate(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any,
    spot: string
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    if (spot == "total") {
      spot = "";
    } else {
      spot = "/" + spot;
    }

    body["metrics"] = attributes;

    //alert("JSON " + JSON.stringify(body));
    //alert("URL " + this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid + "/teammate" + spot);
    //competitions/teamUuid/opponent/place

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneEntry/" +
        competitions +
        "/" +
        teamUuid +
        "/teammate" +
        spot,
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

  getZoneEntryOpponents(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any,
    spot: string
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    if (spot == "total") {
      spot = "";
    } else {
      spot = "/" + spot;
    }

    body["metrics"] = attributes;

    //alert(JSON.stringify(body));
    //competitions/teamUuid/opponent/place

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneEntry/" +
        competitions +
        "/" +
        teamUuid +
        "/opponent" +
        spot,
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

  getZoneEntryTeammateFormation(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any,
    spot: string,
    formation: any
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    if (spot == "total") {
      spot = "";
    } else {
      spot = "/" + spot;
    }

    body["metrics"] = attributes;
    body["formation"] = formation;

    //alert(JSON.stringify(body));
    //competitions/teamUuid/opponent/place

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneEntry/" +
        competitions +
        "/" +
        teamUuid +
        "/teammate" +
        spot,
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

  getZoneEntryOpponentsFormation(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any,
    spot: string,
    formation: any
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    if (spot == "total") {
      spot = "";
    } else {
      spot = "/" + spot;
    }

    body["metrics"] = attributes;
    body["formation"] = formation;

    //alert(JSON.stringify(body));
    //competitions/teamUuid/opponent/place

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneEntry/" +
        competitions +
        "/" +
        teamUuid +
        "/opponent" +
        spot,
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

  getFormationZoneEntriesOnice(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    matches: any
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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
      matches: matches,
    };

    //console.log(JSON.stringify(body));
    //console.log("LOL" + this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid + "/formation" + "   " + JSON.stringify(body));

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneEntry/" +
        competitions +
        "/" +
        teamUuid +
        "/formation",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getZoneEntriesIndividual(
    competitions: string,
    teamUuid: string,
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
    matches: any
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

    var body = {
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
      matches: matches,
    };

    console.log("TEST");
    console.log(
      this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid
    );
    console.log(JSON.stringify(body));

    return this.http
      .post(
        this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getDumpIns(
    competitions: string,
    teamUuid: string,
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
    matches: any
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

    var body = {
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
      matches: matches,
    };

    console.log("TEST");
    console.log(
      this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid
    );
    console.log(JSON.stringify(body));

    return this.http
      .post(
        this.api_url + "/api/v1/dumpIn/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getDumpOuts(
    competitions: string,
    teamUuid: string,
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
    matches: any
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

    var body = {
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
      matches: matches,
    };

    console.log(JSON.stringify(body));

    return this.http
      .post(
        this.api_url + "/api/v1/dumpOut/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getDumpInsFormations(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    matches: any
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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
      matches: matches,
    };

    /* console.log("body");
    console.log(body); */

    //console.log(JSON.stringify(body));
    //console.log("LOL" + this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid + "/formation" + "   " + JSON.stringify(body));

    return this.http
      .post(
        this.api_url +
        "/api/v1/dumpIn/" +
        competitions +
        "/" +
        teamUuid +
        "/formation",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getDumpOutsFormations(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    matches: any
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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
      matches: matches,
    };

    /* console.log("body");
    console.log(body); */

    //console.log(JSON.stringify(body));
    //console.log("LOL" + this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid + "/formation" + "   " + JSON.stringify(body));

    return this.http
      .post(
        this.api_url +
        "/api/v1/dumpOut/" +
        competitions +
        "/" +
        teamUuid +
        "/formation",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getFaceoffOpponents(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    selected_attributes: any,
    matches: any
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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
      matches: matches,
    };

    return this.http
      .post(
        this.api_url +
        "/api/v1/faceOff/" +
        competitions +
        "/" +
        teamUuid +
        "/opponent",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getFormationZoneExitsOnice(
    competitions: string,
    teamUuid: string,
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
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_selected_players1: string,
    filter_selected_players2: string,
    filter_selected_players3: string,
    filter_selected_players4: string,
    filter_selected_players5: string,
    filter_selected_players6: string,
    filter_situationType: string,
    filter_situationTime: number,
    matches: any
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

    let filter_selected_players1_bool;
    if (filter_selected_players1 == "on") {
      filter_selected_players1_bool = true;
    } else {
      filter_selected_players1_bool = false;
    }
    if (filter_playerId_select1 != "") {
      formation.push({
        player: filter_playerId_select1,
        on: filter_selected_players1_bool,
      });
    }

    let filter_selected_players2_bool;
    if (filter_selected_players2 == "on") {
      filter_selected_players2_bool = true;
    } else {
      filter_selected_players2_bool = false;
    }
    if (filter_playerId_select2 != "") {
      formation.push({
        player: filter_playerId_select2,
        on: filter_selected_players2_bool,
      });
    }

    let filter_selected_players3_bool;
    if (filter_selected_players3 == "on") {
      filter_selected_players3_bool = true;
    } else {
      filter_selected_players3_bool = false;
    }
    if (filter_playerId_select3 != "") {
      formation.push({
        player: filter_playerId_select3,
        on: filter_selected_players3_bool,
      });
    }

    let filter_selected_players4_bool;
    if (filter_selected_players4 == "on") {
      filter_selected_players4_bool = true;
    } else {
      filter_selected_players4_bool = false;
    }
    if (filter_playerId_select4 != "") {
      formation.push({
        player: filter_playerId_select4,
        on: filter_selected_players4_bool,
      });
    }

    let filter_selected_players5_bool;
    if (filter_selected_players5 == "on") {
      filter_selected_players5_bool = true;
    } else {
      filter_selected_players5_bool = false;
    }
    if (filter_playerId_select5 != "") {
      formation.push({
        player: filter_playerId_select5,
        on: filter_selected_players5_bool,
      });
    }

    let filter_selected_players6_bool;
    if (filter_selected_players6 == "on") {
      filter_selected_players6_bool = true;
    } else {
      filter_selected_players6_bool = false;
    }
    if (filter_playerId_select6 != "") {
      formation.push({
        player: filter_playerId_select6,
        on: filter_selected_players6_bool,
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
      matches: matches,
    };

    //console.log(JSON.stringify(body));
    //console.log("LOL" + this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid + "/formation" + "   " + JSON.stringify(body));

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneExit/" +
        competitions +
        "/" +
        teamUuid +
        "/formation",
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getZoneExitsIndividual(
    competitions: string,
    teamUuid: string,
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
    matches: any
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

    var body = {
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
      matches: matches,
    };

    console.log("TEST");
    console.log(
      this.api_url + "/api/v1/zoneExit/" + competitions + "/" + teamUuid
    );
    console.log(JSON.stringify(body));

    return this.http
      .post(
        this.api_url + "/api/v1/zoneExit/" + competitions + "/" + teamUuid,
        body,
        options
      )
      .map((res) => res.json())

      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  getZoneExitsTeammate(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any,
    spot: string
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    if (spot == "total") {
      spot = "";
    } else {
      spot = "/" + spot;
    }

    body["metrics"] = attributes;

    //alert("JSON " + JSON.stringify(body));
    //alert("URL " + this.api_url + "/api/v1/zoneEntry/" + competitions + "/" + teamUuid + "/teammate" + spot);
    //competitions/teamUuid/opponent/place

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneExit/" +
        competitions +
        "/" +
        teamUuid +
        "/teammate" +
        spot,
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

  getZoneExitsOpponents(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any,
    spot: string
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    if (spot == "total") {
      spot = "";
    } else {
      spot = "/" + spot;
    }

    body["metrics"] = attributes;

    //alert(JSON.stringify(body));
    //competitions/teamUuid/opponent/place

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneExit/" +
        competitions +
        "/" +
        teamUuid +
        "/opponent" +
        spot,
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

  getZoneExitsTeammateFormation(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any,
    spot: string,
    formation: any
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    if (spot == "total") {
      spot = "";
    } else {
      spot = "/" + spot;
    }

    body["metrics"] = attributes;
    body["formation"] = formation;

    //alert(JSON.stringify(body));
    //competitions/teamUuid/opponent/place

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneExit/" +
        competitions +
        "/" +
        teamUuid +
        "/teammate" +
        spot,
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

  getZoneExitsOpponentsFormation(
    competitions: string,
    teamUuid: string,
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
    selected_attributes: any,
    matches: any,
    spot: string,
    formation: any
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

    if (filter_situationType == "") {
      filter_situationType = undefined;
    }
    if (filter_situationTime == null) {
      filter_situationTime = undefined;
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
      lastPlayedMatches: lastPlayedMatches,
      timeOnIce: timeOnIce,
      afterEvent: afterEvent,
      matches: matches,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    if (spot == "total") {
      spot = "";
    } else {
      spot = "/" + spot;
    }

    body["metrics"] = attributes;
    body["formation"] = formation;

    //alert(JSON.stringify(body));
    //competitions/teamUuid/opponent/place

    return this.http
      .post(
        this.api_url +
        "/api/v1/zoneExit/" +
        competitions +
        "/" +
        teamUuid +
        "/opponent" +
        spot,
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



  getCompetitionDetails(
    uuid: string) {
    debugger;
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .get(
        this.api_url +
        "/api/v1/competition/" + uuid,
        options
      )
      .map((res) => res.json())
      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }

  createVideoClip(clip: any) {
    debugger;
    let headers = new Headers({
      Authorization: "Bearer " + this.token["access_token"],
    });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .post(
        this.api_url +
        "/api/v1/videoCoach/videoClip",
        clip,
        options
      )
      .map((res) => res.json())
      .catch((e) => {
        if (e.status === 401) {
          return Observable.throw("Unauthorized");
        }
      });
  }
}
