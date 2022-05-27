import { Injectable, isDevMode } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { Observable as RxObservable, Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Injectable()
export class IndividualStatsService {
  public token: object;

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

  getIndividualStats(
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
    metricFilter_metric: string,
    metricFilter_value: number
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

    let metricFilter = {
      metric: metricFilter_metric,
      value: metricFilter_value,
    };
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
      metricFilter = undefined;
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
      metricFilter: metricFilter,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    //check metricFilter attributes
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
    } else {
      if (attributes.includes(metricFilter_metric) == false) {
        attributes.push(metricFilter_metric);
      }
    }

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

  getPlayerCard(
    competitions: string,
    teamUuid: string,
    playerUuid: string,
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
    metricFilter_metric: string,
    metricFilter_value: number
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

    let metricFilter = {
      metric: metricFilter_metric,
      value: metricFilter_value,
    };
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
      metricFilter = undefined;
    }

    var body = {
      /* 'gameState': countOfPlayer,
            "scoreState": scoreState,
            "place": place,
            "opponentTeams": opponentTeams,
            "dateFrom": dateFrom,
            "dateTo": dateTo,
            "timeFrom": timeFrom,
            "timeTo": timeTo,
            'lastPlayedMatches': lastPlayedMatches,
            "timeOnIce": timeOnIce,
            "afterEvent": afterEvent,
            "metricFilter": metricFilter */
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    //check metricFilter attributes
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
    } else {
      if (attributes.includes(metricFilter_metric) == false) {
        attributes.push(metricFilter_metric);
      }
    }
    body["metrics"] = attributes;

    //alert(JSON.stringify(body));

    return this.http
      .get(
        this.api_url +
          "/api/v1/player/" +
          competitions +
          "/" +
          teamUuid +
          "/" +
          playerUuid,
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

  getIndividualStatsRank(
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
    metricFilter_metric: string,
    metricFilter_value: number,
    sub_filter_player_post: string
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

    let metricFilter = {
      metric: metricFilter_metric,
      value: metricFilter_value,
    };
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
      metricFilter = undefined;
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
      metricFilter: metricFilter,
    };

    console.log("BODY", body);

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    //check metricFilter attributes
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
    } else {
      if (attributes.includes(metricFilter_metric) == false) {
        attributes.push(metricFilter_metric);
      }
    }

    body["metrics"] = attributes;

    if (sub_filter_player_post != "ALL") {
      body["playersPosition"] = sub_filter_player_post;
    }

    //alert(JSON.stringify(body));

    if (teamUuid == "ALL") {
      return this.http
        .post(this.api_url + "/api/v1/rank/" + competitions, body, options)
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
          this.api_url + "/api/v1/rank/" + competitions + "/" + teamUuid,
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

  getIndividualStatsSimilar(
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
    playerUuid: string,
    stick: string,
    metricFilter_metric: string,
    metricFilter_value: number
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

    if (stick == "ALL") {
      stick = undefined;
    }

    let metricFilter = {
      metric: metricFilter_metric,
      value: metricFilter_value,
    };
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
      metricFilter = undefined;
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
      metricFilter: metricFilter,
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    //check metricFilter attributes
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
    } else {
      if (attributes.includes(metricFilter_metric) == false) {
        attributes.push(metricFilter_metric);
      }
    }

    body["metrics"] = attributes;

    //console.log(JSON.stringify(body));

    //console.log(this.api_url + "/api/v1/similarPlayers/" + competitions + "/" + playerUuid + "/" + teamUuid);

    return this.http
      .post(
        this.api_url +
          "/api/v1/similarPlayers/" +
          competitions +
          "/" +
          playerUuid +
          "/" +
          teamUuid,
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

  getIndividualStatsSimilarByNumbers(
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
    selected_attributes: any,
    stick: string,
    value_of_attribute: any,
    metricFilter_metric: string,
    metricFilter_value: number
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

    if (stick == "ALL") {
      stick = undefined;
    }

    let metrics = [];
    value_of_attribute.forEach((item) => {
      metrics.push({ metric: item.type, value: item.value });
    });

    let metricFilter = {
      metric: metricFilter_metric,
      value: metricFilter_value,
    };
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
      metricFilter = undefined;
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
      metrics: metrics,
      metricFilter: metricFilter,
    };

    // body["metrics"] = attributes;

    //console.log(JSON.stringify(body));

    //console.log(this.api_url + "/api/v1/similarPlayers/" + competitions + "/" + playerUuid + "/" + teamUuid);

    return this.http
      .post(
        this.api_url + "/api/v1/similarPlayers/" + competitions,
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

  getIndividualStatsGoalkeepers(
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
    metricFilter_metric: string,
    metricFilter_value: number
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

    let metricFilter = {
      metric: metricFilter_metric,
      value: metricFilter_value,
    };
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
      metricFilter = undefined;
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
      //"metricFilter": metricFilter,
    };

    console.log("BODY", body);

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    console.log("ATTRIBUTES", attributes);
    body["metrics"] = attributes;

    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
    } else {
      if (attributes.includes(metricFilter_metric) == false) {
        attributes.push(metricFilter_metric);
      }
    }

    //console.log(JSON.stringify(body));

    if (teamUuid == "ALL") {
      return this.http
        .post(
          this.api_url + "/api/v1/goalkeeper/" + competitions,
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
          this.api_url + "/api/v1/goalkeeper/" + competitions + "/" + teamUuid,
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

  getIndividualStatsGoalkeepersAverages(
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
    };

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    //console.log(JSON.stringify(body));

    return this.http
      .post(
        this.api_url + "/api/v1/average/" + competitions + "/goalkeeper",
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

  getGoalkeepersShots(
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
    goalkeeper: string
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
    };

    console.log("body", body);
    console.log("goalkeeper", goalkeeper);
    console.log("competitions", competitions);
    console.log("teamUuid", teamUuid);
    console.log("options", options);

    return this.http
      .post(
        this.api_url +
          "/api/v1/shot/" +
          competitions +
          "/" +
          teamUuid +
          "/goalkeeper/" +
          goalkeeper,
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
  shootouts(
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
    goalkeeper: string
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
      gameState: undefined,
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
    /* console.log("________ Individual stats shootout service ________")
        console.log("body",body);
        console.log("competitions",competitions);
        console.log("teamUuid",teamUuid);
        console.log("options",options);
        console.log("________ _________________________________ ________") */

    return this.http
      .post(
        this.api_url + "/api/v1/shootout/" + competitions + "/" + teamUuid,
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

  getIndividualStatsRelativeTo(
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
    relative_to: string,
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

    if (relative_to == "competition") {
      var relative_to_url = "percentile";
    } else if (relative_to == "team") {
      var relative_to_url = "percentile";
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

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    console.log(JSON.stringify(body));
    console.log(
      this.api_url +
        "/api/v1/individual/" +
        competitions +
        "/" +
        relative_to_url
    );

    if (teamUuid == "ALL") {
      return this.http
        .post(
          this.api_url +
            "/api/v1/individual/" +
            competitions +
            "/" +
            relative_to_url,
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
          this.api_url +
            "/api/v1/individual/" +
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
          //alert(e);
          if (e.status === 401) {
            return Observable.throw("Unauthorized");
          }
        });
    }
  }

  getGoalkeepersStatsRelativeTo(
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
    relative_to: string,
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

    if (relative_to == "competition") {
      var relative_to_url = "percentile";
    } else if (relative_to == "team") {
      var relative_to_url = "percentile";
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

    console.log("Attributes SERV:", selected_attributes);

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });
    body["metrics"] = attributes;

    if (teamUuid == "ALL") {
      console.log(
        this.api_url +
          "/api/v1/goalkeeper/" +
          competitions +
          "/" +
          relative_to_url
      );
      return this.http
        .post(
          this.api_url +
            "/api/v1/goalkeeper/" +
            competitions +
            "/" +
            relative_to_url,
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
      console.log(
        this.api_url +
          "/api/v1/goalkeeper/" +
          competitions +
          "/" +
          teamUuid +
          "/" +
          relative_to_url
      );
      return this.http
        .post(
          this.api_url +
            "/api/v1/goalkeeper/" +
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
          //alert(e);
          if (e.status === 401) {
            return Observable.throw("Unauthorized");
          }
        });
    }
  }

  getIndividualStatRecords(
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
    metricFilter_metric: string,
    metricFilter_value: number
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

    let metricFilter = {
      metric: metricFilter_metric,
      value: metricFilter_value,
    };
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
      metricFilter = undefined;
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

    let attributes = [];
    selected_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        attributes.push(item["type"]);
      }
    });

    //check metricFilter attributes
    if (
      metricFilter_metric == undefined ||
      metricFilter_metric == "" ||
      metricFilter_value == undefined
    ) {
    } else {
      if (attributes.includes(metricFilter_metric) == false) {
        attributes.push(metricFilter_metric);
      }
    }

    body["metrics"] = attributes;
    //alert(JSON.stringify(body));

    if (teamUuid == "ALL") {
      return this.http
        .post(
          this.api_url + "/api/v1/matchRecords/" + competitions,
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
          this.api_url +
            "/api/v1/matchRecords/" +
            competitions +
            "/" +
            teamUuid,
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
}
