import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { Observable as RxObservable, Observable } from "rxjs/Observable";
import { Router } from '@angular/router';


@Injectable()
export class FormationsOverviewService {
    public token: string;

    api_url: string = "http://logiq.statistics.datasport.cz";


    constructor(private router: Router, private http: Http) {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser;

       /*  if (isDevMode()) {
            this.api_url = "http://logiq-test-2.statistics.datasport.cz";
        } */
        if (isDevMode()) {
            this.api_url = "http://logiq-test.statistics.datasport.cz";
        }
    }


    getDataWithPlayer(competitions: string, playerUuid: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_situationType: string, filter_situationTime: number, selected_attributes: any) {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.token['access_token'] });
        let options = new RequestOptions({ headers: headers });

        if (place == "") { place = undefined; }
        if (opponentTeams.length == 0) { opponentTeams = undefined; }
        if (countOfPlayer == "") { countOfPlayer = undefined; }
        if (scoreState == "") { scoreState = undefined; }
        if (dateFrom == "NaN-NaN-NaN") { dateFrom = undefined; }
        if (dateTo == "NaN-NaN-NaN") { dateTo = undefined; }

        if (timeFrom == null) { timeFrom = undefined; } else { timeFrom = timeFrom * 60; }
        if (timeTo == null) { timeTo = undefined; } else { timeTo = timeTo * 60; }
        if (lastPlayedMatches == null) { lastPlayedMatches = undefined; }
        if (timeOnIce == null) { timeOnIce = undefined; } else { timeOnIce = timeOnIce * 60; }

        let afterEvent = {
            "event": filter_situationType,
            "length": filter_situationTime
        };

        if (filter_situationType == undefined || filter_situationTime == undefined) {
            afterEvent = undefined;
        }

        var body = {
            'gameState': countOfPlayer,
            "scoreState": scoreState,
            "place": place,
            "opponentTeams": opponentTeams,
            "dateFrom": dateFrom,
            "dateTo": dateTo,
            "timeFrom": timeFrom,
            "timeTo": timeTo,
            'lastPlayedMatches': lastPlayedMatches,
            "timeOnIce": timeOnIce,
            "afterEvent": afterEvent
        };

        console.log("body",body);

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes;

        return this.http.post(this.api_url + "/api/v1/playersFormation/" + competitions + "/" + playerUuid + "/" + teamUuid, body, options).map(res => res.json())


            .catch(e => {

                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }

            });
    }


    getDataWithoutPlayer(competitions: string, playerUuid: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_situationType: string, filter_situationTime: number, selected_attributes: any) {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.token['access_token'] });
        let options = new RequestOptions({ headers: headers });
        /* alert("GET DATA"); */
        if (place == "") { place = undefined; }
        if (opponentTeams.length == 0) { opponentTeams = undefined; }
        if (countOfPlayer == "") { countOfPlayer = undefined; }
        if (scoreState == "") { scoreState = undefined; }
        if (dateFrom == "NaN-NaN-NaN") { dateFrom = undefined; }
        if (dateTo == "NaN-NaN-NaN") { dateTo = undefined; }

        if (timeFrom == null) { timeFrom = undefined; } else { timeFrom = timeFrom * 60; }
        if (timeTo == null) { timeTo = undefined; } else { timeTo = timeTo * 60; }
        if (lastPlayedMatches == null) { lastPlayedMatches = undefined; }
        if (timeOnIce == null) { timeOnIce = undefined; } else { timeOnIce = timeOnIce * 60; }

        let afterEvent = {
            "event": filter_situationType,
            "length": filter_situationTime
        };

        if (filter_situationType == undefined || filter_situationTime == undefined) {
            afterEvent = undefined;
        }



        var body = {
            'gameState': countOfPlayer,
            "scoreState": scoreState,
            "place": place,
            "opponentTeams": opponentTeams,
            "dateFrom": dateFrom,
            "dateTo": dateTo,
            "timeFrom": timeFrom,
            "timeTo": timeTo,
            'lastPlayedMatches': lastPlayedMatches,
            "timeOnIce": timeOnIce,
            "afterEvent": afterEvent
        };

        /* console.log("body",body) */

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes;

        console.log('team uuid');
        console.log(teamUuid);

        if (teamUuid == "ALL") {
          /* alert("ALL") */
            return this.http.post(this.api_url + "/api/v1/competitionFormation/" + competitions, body, options).map(res => res.json())
                .catch(e => {
                    if (e.status === 401) {
                        return Observable.throw('Unauthorized');
                    }
                });
        } else {
            return this.http.post(this.api_url + "/api/v1/teamsFormation/" + competitions + "/" + teamUuid, body, options).map(res => res.json())
                .catch(e => {
                    if (e.status === 401) {
                        return Observable.throw('Unauthorized');
                    }
                });
        }


    }


    getDataWithPlayerRelativeTo(competitions: string, playerUuid: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_situationType: string, filter_situationTime: number, relative_to: string, selected_attributes: any) {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.token['access_token'] });
        let options = new RequestOptions({ headers: headers });

        if (place == "") { place = undefined; }
        if (opponentTeams.length == 0) { opponentTeams = undefined; }
        if (countOfPlayer == "") { countOfPlayer = undefined; }
        if (scoreState == "") { scoreState = undefined; }
        if (dateFrom == "NaN-NaN-NaN") { dateFrom = undefined; }
        if (dateTo == "NaN-NaN-NaN") { dateTo = undefined; }

        if (timeFrom == null) { timeFrom = undefined; } else { timeFrom = timeFrom * 60; }
        if (timeTo == null) { timeTo = undefined; } else { timeTo = timeTo * 60; }
        if (lastPlayedMatches == null) { lastPlayedMatches = undefined; }
        if (timeOnIce == null) { timeOnIce = undefined; } else { timeOnIce = timeOnIce * 60; }

        let afterEvent = {
            "event": filter_situationType,
            "length": filter_situationTime
        };

        if (filter_situationType == undefined || filter_situationTime == undefined) {
            afterEvent = undefined;
        }

        var relative_to_url = "";

        if (relative_to == "competition") {
            relative_to_url = "percentile";
        } else if (relative_to == "team") {
            relative_to_url = "percentile";
        }

        var body = {
            'gameState': countOfPlayer,
            "scoreState": scoreState,
            "place": place,
            "opponentTeams": opponentTeams,
            "dateFrom": dateFrom,
            "dateTo": dateTo,
            "timeFrom": timeFrom,
            "timeTo": timeTo,
            'lastPlayedMatches': lastPlayedMatches,
            "timeOnIce": timeOnIce,
            "afterEvent": afterEvent
        };

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes;



        return this.http.post(this.api_url + "/api/v1/playersFormation/" + competitions + "/" + playerUuid + "/" + teamUuid + "/" + relative_to_url, body, options).map(res => res.json())


            .catch(e => {

                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }

            });
    }


    getDataWithoutPlayerRelativeTo(competitions: string, playerUuid: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_situationType: string, filter_situationTime: number, relative_to: string, selected_attributes: any) {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.token['access_token'] });
        let options = new RequestOptions({ headers: headers });

        if (place == "") { place = undefined; }
        if (opponentTeams.length == 0) { opponentTeams = undefined; }
        if (countOfPlayer == "") { countOfPlayer = undefined; }
        if (scoreState == "") { scoreState = undefined; }
        if (dateFrom == "NaN-NaN-NaN") { dateFrom = undefined; }
        if (dateTo == "NaN-NaN-NaN") { dateTo = undefined; }

        if (timeFrom == null) { timeFrom = undefined; } else { timeFrom = timeFrom * 60; }
        if (timeTo == null) { timeTo = undefined; } else { timeTo = timeTo * 60; }
        if (lastPlayedMatches == null) { lastPlayedMatches = undefined; }
        if (timeOnIce == null) { timeOnIce = undefined; } else { timeOnIce = timeOnIce * 60; }

        let afterEvent = {
            "event": filter_situationType,
            "length": filter_situationTime
        };

        if (filter_situationType == undefined || filter_situationTime == undefined) {
            afterEvent = undefined;
        }

        if (relative_to == "competition") {
            var relative_to_url = "percentile";
        } else if (relative_to == "team") {
            var relative_to_url = "percentile";
        }

        var body = {
            'gameState': countOfPlayer,
            "scoreState": scoreState,
            "place": place,
            "opponentTeams": opponentTeams,
            "dateFrom": dateFrom,
            "dateTo": dateTo,
            "timeFrom": timeFrom,
            "timeTo": timeTo,
            'lastPlayedMatches': lastPlayedMatches,
            "timeOnIce": timeOnIce,
            "afterEvent": afterEvent
        };

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes;

        if (teamUuid == "ALL") {
            return this.http.post(this.api_url + "/api/v1/competitionFormation/" + competitions + "/" + relative_to_url, body, options).map(res => res.json())
                .catch(e => {
                    if (e.status === 401) {
                        return Observable.throw('Unauthorized');
                    }
                });
        } else {
            return this.http.post(this.api_url + "/api/v1/teamsFormation/" + competitions + "/" + teamUuid + "/" + relative_to_url, body, options).map(res => res.json())
                .catch(e => {
                    if (e.status === 401) {
                        return Observable.throw('Unauthorized');
                    }
                });
        }


    }
}
