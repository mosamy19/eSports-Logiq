import { Injectable, isDevMode } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { Observable as RxObservable, Observable } from "rxjs/Observable";
import { Router } from '@angular/router';


@Injectable()
export class TrendService {
    public token: string;

    api_url: string = "http://logiq.statistics.datasport.cz";


    constructor(private router: Router, private http: Http) {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser;

        /* if (isDevMode()) {
            this.api_url = "http://logiq-test-2.statistics.datasport.cz";
        } */
        if (isDevMode()) {
            this.api_url = "http://logiq.statistics.datasport.cz";
        }
    }


    getTrendIndividual(competitions: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string, filter_selected_players1: string, filter_selected_players2: string, filter_selected_players3: string, filter_selected_players4: string, filter_selected_players5: string, filter_selected_players6: string, filter_situationType: string, filter_situationTime: number, selected_attributes: any) {
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

        if (filter_situationType == "") { filter_situationType = undefined; }
        if (filter_situationTime == null) { filter_situationTime = undefined; }

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

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes;

        return this.http.post(this.api_url + "/api/v1/trend/" + competitions + "/individual/" + teamUuid + "/" + filter_playerId_select1, body, options).map(res => res.json())


            .catch(e => {
                //alert(e);

                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }

            });
    }

    getTrendGoalkeeper(competitions: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string, filter_selected_players1: string, filter_selected_players2: string, filter_selected_players3: string, filter_selected_players4: string, filter_selected_players5: string, filter_selected_players6: string, filter_situationType: string, filter_situationTime: number, selected_attributes: any) {
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

        if (filter_situationType == "") { filter_situationType = undefined; }
        if (filter_situationTime == null) { filter_situationTime = undefined; }

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

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes;

        return this.http.post(this.api_url + "/api/v1/trend/" + competitions + "/goalkeeper/" + teamUuid + "/" + filter_playerId_select1, body, options).map(res => res.json())


            .catch(e => {
                //alert(e);

                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }

            });
    }

    getTrendTeam(competitions: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string, filter_selected_players1: string, filter_selected_players2: string, filter_selected_players3: string, filter_selected_players4: string, filter_selected_players5: string, filter_selected_players6: string, filter_situationType: string, filter_situationTime: number, selected_attributes: any) {
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

        if (filter_situationType == "") { filter_situationType = undefined; }
        if (filter_situationTime == null) { filter_situationTime = undefined; }

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

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes;

        return this.http.post(this.api_url + "/api/v1/trend/" + competitions + "/team/" + teamUuid, body, options).map(res => res.json())


            .catch(e => {
                //alert(e);

                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }

            });
    }

    getTrendFormation(competitions: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string, filter_selected_players1: string, filter_selected_players2: string, filter_selected_players3: string, filter_selected_players4: string, filter_selected_players5: string, filter_selected_players6: string, filter_situationType: string, filter_situationTime: number, selected_attributes: any) {
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

        if (filter_situationType == "") { filter_situationType = undefined; }
        if (filter_situationTime == null) { filter_situationTime = undefined; }

        let afterEvent = {
            "event": filter_situationType,
            "length": filter_situationTime
        };

        if (filter_situationType == undefined || filter_situationTime == undefined) {
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
                'player': filter_playerId_select1,
                'on': filter_selected_players1_bool
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
                'player': filter_playerId_select2,
                'on': filter_selected_players2_bool
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
                'player': filter_playerId_select3,
                'on': filter_selected_players3_bool
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
                'player': filter_playerId_select4,
                'on': filter_selected_players4_bool
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
                'player': filter_playerId_select5,
                'on': filter_selected_players5_bool
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
                'player': filter_playerId_select6,
                'on': filter_selected_players6_bool
            });
        }

        var body = {
            'formation': formation,
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

        return this.http.post(this.api_url + "/api/v1/trend/" + competitions + "/formation/" + teamUuid, body, options).map(res => res.json())


            .catch(e => {
                //alert(e);

                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }

            });
    }



    getTrendTableFormation(competitions: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string, filter_selected_players1: string, filter_selected_players2: string, filter_selected_players3: string, filter_selected_players4: string, filter_selected_players5: string, filter_selected_players6: string, filter_situationType: string, filter_situationTime: number, selected_attributes: any) {
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

        if (filter_situationType == "") { filter_situationType = undefined; }
        if (filter_situationTime == null) { filter_situationTime = undefined; }

        let afterEvent = {
            "event": filter_situationType,
            "length": filter_situationTime
        };

        if (filter_situationType == undefined || filter_situationTime == undefined) {
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
                'player': filter_playerId_select1,
                'on': filter_selected_players1_bool
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
                'player': filter_playerId_select2,
                'on': filter_selected_players2_bool
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
                'player': filter_playerId_select3,
                'on': filter_selected_players3_bool
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
                'player': filter_playerId_select4,
                'on': filter_selected_players4_bool
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
                'player': filter_playerId_select5,
                'on': filter_selected_players5_bool
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
                'player': filter_playerId_select6,
                'on': filter_selected_players6_bool
            });
        }

        var body = {
            'formation': formation,
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

        return this.http.post(this.api_url + "/api/v1/trend/" + competitions + "/formation/" + teamUuid, body, options).map(res => res.json())


            .catch(e => {
                //alert(e);

                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }

            });
    }




    getFormationByPeriod(competitions: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string, filter_selected_players1: string, filter_selected_players2: string, filter_selected_players3: string, filter_selected_players4: string, filter_selected_players5: string, filter_selected_players6: string, filter_situationType: string, filter_situationTime: number, selected_attributes: any, periodBy: string, period_date_from: string, period_date_to: string, matches_list_range: any) {
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

        let formation = [];

        let filter_selected_players1_bool;
        if (filter_selected_players1 == "on") {
            filter_selected_players1_bool = true;
        } else {
            filter_selected_players1_bool = false;
        }
        if (filter_playerId_select1 != "") {
            formation.push({
                'player': filter_playerId_select1,
                'on': filter_selected_players1_bool
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
                'player': filter_playerId_select2,
                'on': filter_selected_players2_bool
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
                'player': filter_playerId_select3,
                'on': filter_selected_players3_bool
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
                'player': filter_playerId_select4,
                'on': filter_selected_players4_bool
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
                'player': filter_playerId_select5,
                'on': filter_selected_players5_bool
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
                'player': filter_playerId_select6,
                'on': filter_selected_players6_bool
            });
        }


        if (periodBy == "calendar") {
            if (period_date_from != "") {
                dateFrom = period_date_from;
            }
            if (period_date_to != "") {
                dateTo = period_date_to;
            }
        } else if (periodBy == "matches") {
            if (matches_list_range.length == 0) {
                matches_list_range = undefined;
            }
        }

        var body = {
            'formation': formation,
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
            "afterEvent": afterEvent,
            'matches': matches_list_range
        };

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });
        body["metrics"] = attributes;

        //alert(JSON.stringify(body));


        return this.http.post(this.api_url + "/api/v1/formation/" + competitions + "/" + teamUuid, body, options).map(res => res.json())

            .catch(e => {
                if (e.status === 401) {
                    return Observable.throw('Unauthorized');
                }
            });
    }



    getIndividualStatsTrend(competitions: string, teamUuid: string, lastPlayedMatches: number, countOfPlayer: string, scoreState: string, place: string, opponentTeams: any[], dateFrom: string, dateTo: string, timeFrom: number, timeTo: number, timeOnIce: number, filter_situationType: string, filter_situationTime: number, selected_attributes: any, metricFilter_metric: string, metricFilter_value: number, periodBy: string, period_date_from: string, period_date_to: string, matches_list_range: any) {
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

        if (filter_situationType == "") { filter_situationType = undefined; }
        if (filter_situationTime == null) { filter_situationTime = undefined; }

        let afterEvent = {
            "event": filter_situationType,
            "length": filter_situationTime
        };

        if (filter_situationType == undefined || filter_situationTime == undefined) {
            afterEvent = undefined;
        }


        let metricFilter = {
            "metric": metricFilter_metric,
            "value": metricFilter_value
        }
        if (metricFilter_metric == undefined || metricFilter_metric == '' || metricFilter_value == undefined) {
            metricFilter = undefined;
        }


        if (periodBy == "calendar") {
            if (period_date_from != "") {
                dateFrom = period_date_from;
            }
            if (period_date_to != "") {
                dateTo = period_date_to;
            }
        } else if (periodBy == "matches") {
            if (matches_list_range.length == 0) {
                matches_list_range = undefined;
            }
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
            "afterEvent": afterEvent,
            "metricFilter": metricFilter,
            'matches': matches_list_range
        };

        let attributes = [];
        selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                attributes.push(item["type"])
            }
        });

        //check metricFilter attributes
        if (metricFilter_metric == undefined || metricFilter_metric == '' || metricFilter_value == undefined) {
        } else {
            if (attributes.includes(metricFilter_metric) == false) {
                attributes.push(metricFilter_metric)
            }
        }



        body["metrics"] = attributes;

        //alert(JSON.stringify(body));


        if (teamUuid == "ALL") {
            return this.http.post(this.api_url + "/api/v1/individual/" + competitions, body, options).map(res => res.json())
                .catch(e => {
                    //alert(e);
                    if (e.status === 401) {
                        return Observable.throw('Unauthorized');
                    }
                });

        } else {
            return this.http.post(this.api_url + "/api/v1/individual/" + competitions + "/" + teamUuid, body, options).map(res => res.json())
                .catch(e => {
                    //alert(e);
                    if (e.status === 401) {
                        return Observable.throw('Unauthorized');
                    }
                });
        }
    }



}
