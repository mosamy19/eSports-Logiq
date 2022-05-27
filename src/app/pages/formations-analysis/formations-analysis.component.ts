import { element } from 'protractor';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
  AfterViewInit,
  isDevMode,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ComponentFactoryResolver,
} from '@angular/core';

import { Location } from '@angular/common';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { DatepickerOptions } from 'ng2-datepicker';
import * as csLocale from 'date-fns/locale/cs';

// import * as _ from "lodash";
import { FormationsAnalysisService } from '../../services/formations-analysis/formations-analysis.service';
import { DefaultService } from '../../services/default/default.service';
import { IndividualStatsService } from '../../services/individual-stats/individual-stats.service';

import { DomSanitizer } from '@angular/platform-browser';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

import { TranslatePipe } from '../../pipes/translate.pipe';

import { GamesService } from '../../services/games/games.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

declare var require: any;
const accents = require('remove-accents');

const csv_options = {
  quoteStrings: '"',
  fieldSeparator: ';',
  decimalseparator: '.',
  type: 'text/csv;charset=ISO-8859-1;',
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'formations-analysis',
  templateUrl: './formations-analysis.component.html',
  styleUrls: ['./formations-analysis.component.scss'],
  providers: [
    FormationsAnalysisService,
    GamesService,
    DefaultService,
    TranslatePipe,
    IndividualStatsService
  ],
})
export class FormationsAnalysisComponent implements OnInit, AfterViewInit {
  data: any = [];
  spoluhraci_data: any;
  protihraci_data: any;

  tab: string;
  more_filters: boolean;

  tab_small_viz = '';

  players_list: any;
  date_from: any;
  date_to: any;

  dataLoaded: boolean;
  loading = true;
  teams_list: any[];
  seasons_list: any[];
  graph_averages: any;

  selected_players_list: any = [];

  // filters
  filter_season: any = [];
  filter_seasonPart = '';
  filter_team = '';
  filter_player = '';

  filter_countOfPlayer = '5:5';
  filter_minTOI: number;
  filter_lastGames: number;
  filter_dateFrom: string;
  filter_dateTo: string;
  filter_homeAway = '';
  readonly HOME_AWAY = ['home', 'away'];
  filter_matchState = '';
  filter_minutes_from: number;
  filter_minutes_to: number;
  filter_opponent = '';
  filter_opponents: any = [];
  filter_hraci_spolu = true;
  filter_hraci_zvlast = true;
  filter_spoluhraci_zvlast = true;
  filter_posts = 'ALL';
  filter_table_teams = '';

  filter_situationType = '';
  filter_situationTime: number;

  filter_shoot_category = 'SGMB';
  filter_shoot_category_heat = 'cf60';
  filter_zapojeni_hrace = '';
  heatmap_compare = '';

  filter_assist_category = 'SGMB';

  filter_selected_players1 = 'on';
  filter_selected_players2 = 'on';
  filter_selected_players3 = 'on';
  filter_selected_players4 = 'on';
  filter_selected_players5 = 'on';
  filter_selected_players6 = 'on';

  filter_playerId_select1 = '';
  filter_playerId_select2 = '';
  filter_playerId_select3 = '';
  filter_playerId_select4 = '';
  filter_playerId_select5 = '';
  filter_playerId_select6 = '';

  filter_playerId_select1_template = '';
  filter_playerId_select2_template = '';
  filter_playerId_select3_template = '';
  filter_playerId_select4_template = '';
  filter_playerId_select5_template = '';
  filter_playerId_select6_template = '';

  filter_playerId_select1_on_template = '';
  filter_playerId_select2_on_template = '';
  filter_playerId_select3_on_template = '';
  filter_playerId_select4_on_template = '';
  filter_playerId_select5_on_template = '';
  filter_playerId_select6_on_template = '';

  faceOffsData: any = [];

  isSelectedMinOnePlayerHeat = false;

  filterby1 = 'toi';
  filterby2 = 'toi';
  filterby3 = 'toi';
  filterby4 = 'fo';
  filterby5 = 'fo';

  showDots: any = [];
  // filters end

  selected_team = '';

  selected_attributes_string = '';

  selected_teams: any = [];

  toi: any = [];
  xG: number;
  g: number;

  playerMoreInfoData: any = [];

  locale = {
    applyLabel: 'ok',
    format: 'DD.MM.YYYY',
    displayFormat: 'DD.MM.YYYY',
    firstDay: 1,
    clearLabel: '',
    daysOfWeek: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
    monthNames: [
      'Leden',
      'Únor',
      'Březen',
      'Duben',
      'Květen',
      'Červen',
      'Červenec',
      'Srpen',
      'Září',
      'Říjen',
      'Listopad',
      'Prosinec',
    ],
  };

  table_settings: any[] = [
    { type: 'cf60', name: 'CF/60', colour: 'green' },
    { type: 'ca60', name: 'CA/60', colour: 'red' },
    { type: 'cf_percent', name: 'CF%', colour: 'green' },
    { type: 'cf_percent_rel', name: 'CF% Rel', colour: 'green' },
    { type: 'scf60', name: 'sCF/60', colour: 'green' },
    { type: 'sca60', name: 'sCA/60', colour: 'red' },
    { type: 'scf_percent', name: 'sCF%', colour: 'green' },
    { type: 'scf_percent_rel', name: 'sCF% Rel', colour: 'green' },
    { type: 'onsh_percent', name: 'ON.Sh%', colour: 'green' },
    { type: 'onsv_percent', name: 'ON.Sv%', colour: 'red' },
    { type: 'xg', name: 'xG', colour: 'green' },
    { type: 'g', name: 'G', colour: 'green' },
  ];

  table_settings_buly: any[] = [
    { type: 'fo', name: 'FO', colour: 'white' },
    { type: 'fow', name: 'FOW', colour: 'white' },
    { type: 'fow_percent', name: 'FOW%', colour: 'green' },
  ];

  vstupy_spoluhraci_data: any = [];
  table_settings_vstupy_spoluhraci: any[] = [
    { type: 'en', name: 'EN', colour: 'green' },
    { type: 'en60', name: 'EN/60', colour: 'green' },
    { type: 'enw', name: 'EN.W', colour: ' ' },
    { type: 'enw60', name: 'EN.W/60', colour: 'green' },
    { type: 'enwen', name: 'EN.W/EN', colour: 'green' },
    { type: 'enscf', name: 'EN→sCF', colour: 'green' },
    { type: 'enscfen', name: 'EN→sCF/EN', colour: 'green' },
  ];

  vstupy_protihraci_data: any = [];
  table_settings_vstupy_protihraci: any[] = [
    { type: 'en', name: 'EN', colour: 'green' },
    { type: 'en60', name: 'EN/60', colour: 'green' },
    { type: 'enw', name: 'EN.W', colour: ' ' },
    { type: 'enw60', name: 'EN.W/60', colour: 'green' },
    { type: 'enwen', name: 'EN.W/EN', colour: 'green' },
    { type: 'enscf', name: 'EN→sCF', colour: 'green' },
    { type: 'enscfen', name: 'EN→sCF/EN', colour: 'green' },
  ];

  is_relative_heatmap = false;
  isLoadingRelativeHeatmap = false;

  isLoadingHeatmap = false;

  competitions_list: any[];

  seasons_select_list = [];
  toggle_table_settings = false;
  selectedItems = [];
  dropdownSettings = {};
  dropdownSettings2 = {};

  subtab = 'spoluhraci';

  heat: any;
  shots: any = [];
  shotsForLast5: any = [];
  shotsArrFor: any = [];
  shotsArrAgainst: any = [];
  allLoaded = false;
  added_shots: any = [];
  assists: any = [];

  shots_assists_team: any = [];

  shots_team = true;
  assists_team = true;

  heat_radius1 = 25;
  heat_radius2 = 23;

  heat_gradient: any = {
    0.6: '#00bfa5',
    0.7: '#64dd17',
    0.8: '#ffab00',
    1.0: '#ff1744',
  };

  selected_daterange: any;

  heatpro_data: any = [];
  heatproti_data: any = [];

  rel_heatpro_data: any = [];
  rel_heatproti_data: any = [];

  relative_heatmap_pro_url = '';
  relative_heatmap_proti_url = '';

  raids: any = [];

  normal_heatmap_pro_url = '';
  normal_heatmap_proti_url = '';

  list_order = 0;

  boolProd = true;

  average_compare_main = '';
  show_skala_main = false;
  skala_loading_main = true;
  data_relativeToCompetition_main: any = [];
  data_relativeToTeam_main: any = [];

  average_compare_spoluhraci = '';
  show_skala_spoluhraci = false;
  skala_loading_spoluhraci = true;
  data_relativeToCompetition_spoluhraci: any = [];
  data_relativeToTeam_spoluhraci: any = [];

  average_compare_protihraci = '';
  data_relativeToCompetition_protihraci: any = [];
  data_relativeToTeam_protihraci: any = [];

  skala_loading_protihraci = true;
  show_skala_protihraci = false;

  shotmap_invert = true;

  buly_list_any_stick: any = [];
  buly_list_left_stick: any = [];
  buly_list_right_stick: any = [];

  subtab_vhazovani = 'spoluhraci';
  faceoff_data_loaded = false;
  faceoff_data_loading = false;
  buly_spoluhraci_data: any = [];
  buly_protihraci_data: any = [];

  @ViewChild('full_content') private full_content_scroll: ElementRef;

  subtab_old = '';

  @ViewChild('shotmapleft') shotmapleft: ElementRef;
  @ViewChild('shotmapright') shotmapright: ElementRef;
  @ViewChild('assistmap') assistmap: ElementRef;
  context: CanvasRenderingContext2D;

  loading_assists = true;

  protihraci_buly_selected_player = '';

  show_video_player = false;

  videos_data: any = [];

  subtab_vstupy = 'spoluhraci';
  vstupy_data_loading = false;
  vstupy_data_loaded = false;

  gameslist: any = [];

  pro_proti_shots = 'PRO';
  pro_proti_assists = 'PRO';

  active_player1 = false;
  active_player2 = false;
  active_player3 = false;
  active_player4 = false;
  active_player5 = false;
  active_player6 = false;

  selected_games: any = [];

  constructor(
    private gamesService: GamesService,
    private translate: TranslatePipe,
    private formationsAnalysisService: FormationsAnalysisService,
    private defaultService: DefaultService,
    private zone: NgZone,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private individualStatsService: IndividualStatsService
  ) {
    this.sanitizer = sanitizer;

    this.tab = '';
    this.more_filters = false;

    this.selectedItems = [];

    if (localStorage.language === 'cz') {
      this.dropdownSettings = {
        singleSelection: false,
        text: 'Vybrat sezonu',
        selectAllText: 'Vybrat vše',
        unSelectAllText: 'Odebrat vše',
        enableSearchFilter: false,
        classes: 'multiselect'
      };

      this.dropdownSettings2 = {
        singleSelection: false,
        text: 'Všechny týmy',
        selectAllText: 'Vybrat vše',
        unSelectAllText: 'Odebrat vše',
        enableSearchFilter: false,
        classes: 'multiselect'
      };
    } else if (localStorage.language === 'en') {
      this.dropdownSettings = {
        singleSelection: false,
        text: 'Select season',
        selectAllText: 'Select all',
        unSelectAllText: 'Remove all',
        enableSearchFilter: false,
        classes: 'multiselect'
      };

      this.dropdownSettings2 = {
        singleSelection: false,
        text: 'All teams',
        selectAllText: 'Select all',
        unSelectAllText: 'Remove all',
        enableSearchFilter: false,
        classes: 'multiselect'
      };
    }

    this.showDots = [
      {
        enabled: true,
        playerUUID: '',
        color: 1
      },
      {
        enabled: true,
        playerUUID: '',
        color: 2
      },
      {
        enabled: true,
        playerUUID: '',
        color: 3
      },
      {
        enabled: true,
        playerUUID: '',
        color: 4
      },
      {
        enabled: true,
        playerUUID: '',
        color: 5
      },
      {
        enabled: true,
        playerUUID: '',
        color: 6
      },
    ];

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }

    this.dataLoaded = false;
    this.loading = false;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getCompetitions();

    this.checkExistParameter();

    this.trackOpenPage();
  }

  onSelectedGame(event) {
    this.selected_games = event;
  }

  showTab(tab: string) {
    this.loading = true;
    this.shots = [];
    this.shotsArrFor = [];
    this.shotsArrAgainst = [];
    this.allLoaded = false;
    this.added_shots = [];

    this.tab = tab;
    if (tab === 'vizualizace') {
      this.loading = true;
      if (
        this.filter_playerId_select1 === '' &&
        this.filter_playerId_select2 === '' &&
        this.filter_playerId_select3 === '' &&
        this.filter_playerId_select4 === '' &&
        this.filter_playerId_select5 === '' &&
        this.filter_playerId_select6 === ''
      ) {
        this.shots_team = true;
      } else {
        this.shots_team = false;
      }

      if (this.selected_players_list.length === 0) {
        this.shots_team = true;
      }

      // console.log("TEST", this.filter_selected_players1)
      if (this.selected_games.length === 0) {
        if (this.gameslist.length > 0) {
          this.loadShots({match: [this.gameslist[0].match]});
        } else {
          this.loading = false;
          setTimeout(() => alert('Nebyla nalezena zadna shoda v datech pro vybrane tymy'), 1000);
        }
      } else {
        const selected_games = [];
        this.selected_games.forEach(game => {
          selected_games.push(game.match);
        });
        this.loadShots({match: selected_games});
      }


    } else {
      this.dataLoaded = true;
      this.loading = false;
      this.tab_small_viz = 'shots';
    }
  }

  showMoreFilters() {
    if (this.more_filters === true) {
      this.more_filters = false;
    } else {
      this.more_filters = true;
    }
  }

  selectTeams() {
    this.filter_opponents = [];
    this.selected_teams.forEach((item) => {
      this.filter_opponents.push(item.uuid);
    });
  }

  addOpponent(opponent_id: string) {
    if (this.filter_opponents.includes(opponent_id)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent === opponent_id) {
          delete this.filter_opponents[index];
        }
      });
    } else {
      this.filter_opponents.push(opponent_id);
    }
    this.filter_opponents.slice();
  }

  checkSelectedOpponent(opponent_id: string) {
    return this.filter_opponents.includes(opponent_id);
  }

  setOpponentsAll() {
    this.filter_opponents = [];
    this.filter_opponents.slice();
  }

  vybratTeamCheck() {
    if (this.filter_opponents.includes(this.filter_team)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent === this.filter_team) {
          delete this.filter_opponents[index];
        }
      });
    }
  }

  checkNonselectedOpponent() {
    this.filter_opponents = this.removeShitNulls(this.filter_opponents);
    if (this.filter_opponents.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  removeShitNulls(array) {
    return array.filter(function (e) {
      return e;
    });
  }

  /* Pridane */
  heatmapCompare(data: string) {

  }

  /* Pridane */
  load_heatmap() {

  }

  loadData(type: string, clean_match: boolean) {
    if (type === 'shootouts') {
      this.filter_countOfPlayer = '';
    }
    if (this.active_player1) {
      this.filter_selected_players1 = 'on';
    } else {
      this.filter_selected_players1 = 'off';
    }
    if (this.active_player2) {
      this.filter_selected_players2 = 'on';
    } else {
      this.filter_selected_players2 = 'off';
    }
    if (this.active_player3) {
      this.filter_selected_players3 = 'on';
    } else {
      this.filter_selected_players3 = 'off';
    }
    if (this.active_player4) {
      this.filter_selected_players4 = 'on';
    } else {
      this.filter_selected_players4 = 'off';
    }
    if (this.active_player5) {
      this.filter_selected_players5 = 'on';
    } else {
      this.filter_selected_players5 = 'off';
    }

    this.checkLoggedTime();

    this.heatmap_compare = '';

    this.is_relative_heatmap = false;
    this.relative_heatmap_pro_url = '';
    this.relative_heatmap_proti_url = '';

    this.normal_heatmap_pro_url = '';
    this.normal_heatmap_proti_url = '';

    // this.tab = "";
    // this.subtab = "spoluhraci";
    this.dataLoaded = true;

    this.filter_zapojeni_hrace = '';

    const player1_on_off = this.filter_selected_players1;
    const player2_on_off = this.filter_selected_players2;
    const player3_on_off = this.filter_selected_players3;
    const player4_on_off = this.filter_selected_players4;
    const player5_on_off = this.filter_selected_players5;
    const player6_on_off = this.filter_selected_players6;

    this.showDots = [
      {
        enabled: true,
        playerUUID: '',
        color: 1
      },
      {
        enabled: true,
        playerUUID: '',
        color: 2
      },
      {
        enabled: true,
        playerUUID: '',
        color: 3
      },
      {
        enabled: true,
        playerUUID: '',
        color: 4
      },
      {
        enabled: true,
        playerUUID: '',
        color: 5
      },
      {
        enabled: true,
        playerUUID: '',
        color: 6
      },
    ];

    this.selected_players_list = [];
    if (this.filter_playerId_select1.length > 0 && this.active_player1) {
      if (player1_on_off === 'on') {
        this.selected_players_list.push(this.filter_playerId_select1);
        this.showDots[0]['playerUUID'] = this.filter_playerId_select1;
      }
    }
    if (this.filter_playerId_select2.length > 0 && this.active_player2) {
      if (player2_on_off === 'on') {
        this.selected_players_list.push(this.filter_playerId_select2);
        this.showDots[1]['playerUUID'] = this.filter_playerId_select2;
      }
    }
    if (this.filter_playerId_select3.length > 0 && this.active_player3) {
      if (player3_on_off === 'on') {
        this.selected_players_list.push(this.filter_playerId_select3);
        this.showDots[2]['playerUUID'] = this.filter_playerId_select3;
      }
    }
    if (this.filter_playerId_select4.length > 0 && this.active_player4) {
      if (player4_on_off === 'on') {
        this.selected_players_list.push(this.filter_playerId_select4);
        this.showDots[3]['playerUUID'] = this.filter_playerId_select4;
      }
    }
    if (this.filter_playerId_select5.length > 0 && this.active_player5) {
      if (player5_on_off === 'on') {
        this.selected_players_list.push(this.filter_playerId_select5);
        this.showDots[4]['playerUUID'] = this.filter_playerId_select5;
      }
    }
    if (this.filter_playerId_select6.length > 0 && this.active_player6) {
      if (player6_on_off === 'on') {
        this.selected_players_list.push(this.filter_playerId_select6);
        this.showDots[5]['playerUUID'] = this.filter_playerId_select6;
      }
    }


    if (this.selected_players_list.length === 0) {
      this.shots_team = true;
    }

    /* console.log("selected player LIST", this.selected_players_list)
    this.selected_players_list.forEach((item, index) => {
      this.showDots[index]["playerUUID"] = item;
    }); */

    if (this.tab === '') {
      this.tab = 'vizualizace';
    }

    const tab_old = this.tab;
    this.tab_small_viz = type;
    this.subtab_old = this.tab_small_viz;

    this.smallTabViz_toggle(this.tab_small_viz);

    this.isSelectedMinOnePlayer();

    this.selected_team = this.filter_team;

    this.loading = true;

    this.average_compare_main = '';
    this.show_skala_main = false;

    this.average_compare_spoluhraci = '';
    this.show_skala_spoluhraci = false;

    // data pro zapasy na leve strane obrazovky
    this.gamesService
      .getGamesList(
        this.filter_seasonPart,
        this.filter_team,
        '',
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_lastGames,
        this.filter_situationType,
        this.filter_situationTime
      )
      .subscribe((loaded_data) => {
        const games_list = [];
        loaded_data.forEach((item, index) => {
          console.log('filter_oponents ', this.filter_opponents);
          if (this.filter_opponents.length === 0) {
            games_list.push({
              id: index,
              match: item['uuid'],
              length: item['length'],
              homeTeam: item['homeTeamUuid'],
              awayTeam: item['awayTeamUuid'],
              score: item['score'],
              matchDate: item['date'],
              active: true,
            });
          } else if (this.filter_opponents.includes(item.awayTeamUuid) || this.filter_opponents.includes(item.homeTeamUuid)) {
            games_list.push({
              id: index,
              match: item['uuid'],
              length: item['length'],
              homeTeam: item['homeTeamUuid'],
              awayTeam: item['awayTeamUuid'],
              score: item['score'],
              matchDate: item['date'],
              active: true,
            });
          }
        });

        this.gameslist = games_list;
        console.log('Domaci tym ', this.filter_team);
        if (this.HOME_AWAY.includes(this.filter_homeAway)) {
          this.gameslist = this.gameslist.filter((game) => this.filter_homeAway === this.HOME_AWAY[0] ? game.homeTeam === this.filter_team :
            game.awayTeam === this.filter_team);
        }
        console.log('games list po filtraci ', this.gameslist);
        this.loading = false;
        this.showTab(tab_old);
        this.getTeamMatches();
      });

    /* this.formationsAnalysisService
      .getFormation(
        this.filter_seasonPart,
        this.filter_team,
        this.filter_lastGames,
        this.filter_countOfPlayer,
        this.filter_matchState,
        this.filter_homeAway,
        this.filter_opponents,
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_minTOI,
        this.filter_playerId_select1,
        this.filter_playerId_select2,
        this.filter_playerId_select3,
        this.filter_playerId_select4,
        this.filter_playerId_select5,
        this.filter_playerId_select6,
        this.filter_selected_players1,
        this.filter_selected_players2,
        this.filter_selected_players3,
        this.filter_selected_players4,
        this.filter_selected_players5,
        this.filter_selected_players6,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings
      )
      .subscribe(
        (loaded_data) => {

          this.toi = loaded_data.toi;
          this.xG = loaded_data.xg;
          this.g = loaded_data.g;
        },
        (err) => {
          alert(
            "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
        }
      ); */

    this.formationsAnalysisService
      .getTeammates(
        this.filter_seasonPart,
        this.filter_team,
        this.filter_lastGames,
        this.filter_countOfPlayer,
        this.filter_matchState,
        this.filter_homeAway,
        this.filter_opponents,
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_minTOI,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings_buly
      )
      .subscribe(
        (loaded_data) => {
          loaded_data.forEach((item) => {
            this.faceOffsData.push(item);
          });

          if (this.tab_small_viz === 'faceoffs') {
            this.faceOffsData.forEach(data => {
              this.players_list.forEach((data2, index) => {
                if (data.player === data2.uuid) {
                  this.players_list[index]['winRate'] = data.stats.fo;
                }
              });
            });
            this.players_list.sort(this.sortBy('winRate', true));
          }

        },
        (err) => {
          alert(
            'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
          );
        }
      );

    if (clean_match) {
      this.selected_games = [];
    }
    this.added_shots = [];

    this.heatpro_data = [];
    this.heatproti_data = [];

    this.cd.detectChanges();
  }

  getTeamMatches() {
    this.dataLoaded = true;
    this.loading = true;
    const matches = [];
    this.toi = [];

    this.defaultService.getTeamToi(
      this.filter_seasonPart,
      this.filter_lastGames,
      this.filter_countOfPlayer,
      this.filter_matchState,
      this.filter_homeAway,
      this.filter_opponents,
      this.filter_dateFrom,
      this.filter_dateTo,
      this.filter_minutes_from,
      this.filter_minutes_to,
      this.filter_minTOI,
      this.filter_situationType,
      this.filter_situationTime,
      this.filter_team,
      this.selected_players_list
      ).subscribe(loaded_data => {
      loaded_data.forEach(data => {
        this.toi.push({
          'match': data.matchUuid,
          'toi': data.toi
        });
      });
    });
    this.loading = false;
    /* this.gameslist.forEach( (item,index) => {
      matches.push(item.match)
      this.gamesService.
        getTeamsData(
          this.filter_seasonPart,
          item.match,
          this.filter_team,
          this.filter_matchState,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_countOfPlayer,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings)
          .subscribe(loaded_data => {
            this.toi.push({
              'match': item.match,
              'toi': loaded_data[0].stats.toi
            });
          }
        );
    }); */

  }

  clearPlayer(player: number) {
    if (player === 1) {
      this.filter_playerId_select1 = '';
      this.active_player1 = false;
      this.changeSelectedPlayersList('', 1);
    } else if (player === 2) {
      this.filter_playerId_select2 = '';
      this.active_player2 = false;
      this.changeSelectedPlayersList('', 2);
    } else if (player === 3) {
      this.filter_playerId_select3 = '';
      this.active_player3 = false;
      this.changeSelectedPlayersList('', 3);
    } else if (player === 4) {
      this.filter_playerId_select4 = '';
      this.active_player4 = false;
      this.changeSelectedPlayersList('', 4);
    } else if (player === 5) {
      this.filter_playerId_select5 = '';
      this.active_player5 = false;
      this.changeSelectedPlayersList('', 5);
    }
  }

  loadShots(event: any) {
    if (this.filter_team !== '') {
      this.shots_team ? this.loadVizualizacePage(event) : this.loadVizualizacePage2(event);
    } else {
      alert('Vyberte tým');
    }

  }

  loadVizualizacePage(event: any) {
    if (this.tab_small_viz === 'heatmap') {
      const matches = [];
      this.gameslist.forEach(element => {
        matches.push(element.match);
      });
      event.match = matches;

    }

    if (this.gameslist.length === this.selected_games.length) {
      event.match = [];
    }

    this.pro_proti_shots = 'PRO';
    if (event.match === undefined) {
      this.shotsArrFor = [];
    }

    const isInArr = (shot) => shot === event.match;

    if (event.match.length === 0) {
      this.shotsArrFor = [];
    }


    if (!this.added_shots.some(isInArr)) {
      event.match.forEach(element => {
        this.added_shots.push(element);
      });

      const matches = event.match;
      // Load shots for

      this.formationsAnalysisService
      .getTeamShotsFor(
        this.filter_seasonPart,
        this.filter_team,
        this.filter_lastGames,
        this.filter_countOfPlayer,
        this.filter_matchState,
        this.filter_homeAway,
        this.filter_opponents,
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_minTOI,
        this.filter_situationType,
        this.filter_situationTime,
        matches
      )
      .subscribe(
        (loaded_data) => {
          if (event.match !== undefined) {
            loaded_data.forEach(element => {
              this.shotsArrFor.push(element);
            });
            this.shots['for'] = this.shotsArrFor;
          } else {
            this.shots['for'] = loaded_data;
          }

          // this.shots_team = true;

          this.dataLoaded = true;
          this.loading = false;

          // Load shots against
          this.onLoadAgainstShots(event);
        },
        (err) => {
          alert(
            'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
          );
          // this.defaultService.logout();
          this.dataLoaded = true;
          this.loading = false;
        }
      );
    } else {
      if (event.callback) {
        event.callback();
      } else {
        console.log('No callback :(');
      }

    }
  }

  testing(data: any) {
    console.log('Testing', data);
  }

  loadVizualizacePage2(event: any) {
    this.pro_proti_shots = 'PRO';

    /* if(event.matchDate === undefined){
      this.shotsArrFor = [];
    } */

    const isInArr = (shot) => shot === event.match;
    if (!this.added_shots.some(isInArr)) {

      event.match.forEach(element => {
        this.added_shots.push(element);
      });

    // pokud je vybran hrac
      this.formationsAnalysisService
        .getFormationShotsFor(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime
        )
        .subscribe(
          (loaded_data) => {
            if (event.matchDate !== undefined) {

              loaded_data.forEach(element => {
                this.shotsArrFor.push(element);
              });
              this.shots['for'] = this.shotsArrFor;
            } else {
              this.shots['for'] = loaded_data;
            }

            // this.shots_team = false;

            this.dataLoaded = true;
            this.loading = false;

            // Load shots against
            this.onLoadAgainstShots(event);
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
            this.dataLoaded = true;
            this.loading = false;
          }
        );
    } else {
      if (event.callback) {
        event.callback();
      } else {
        console.log('No callback :(');
      }
    }
  }

  onLoadAgainstShots(event: any) {

    this.pro_proti_shots = 'PROTI';
    if (this.shots_team) {
      this.formationsAnalysisService
          .getTeamShotsForAgainst(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_situationType,
            this.filter_situationTime
            )
          .subscribe(
            (loaded_data) => {
              if (event.matchDate !== undefined) {
                loaded_data.forEach(element => {
                  this.shotsArrAgainst.push(element);
                });
                this.shots['against'] = this.shotsArrAgainst;
              } else {
                this.shots['against'] = loaded_data;
              }

              this.dataLoaded = true;
              this.loading = false;
              if (event.callback) {
                event.callback();
              } else {
                console.log('No callback :(');
              }

            },
            (err) => {
              alert(
                'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
              );
              // this.defaultService.logout();
              this.dataLoaded = true;
              this.loading = false;
            }
          );
    } else {
      this.formationsAnalysisService
        .getFormationShotsAgainst(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime
        )
        .subscribe(
          (loaded_data) => {
            if (event.matchDate !== undefined) {
              loaded_data.forEach(element => {
                this.shotsArrAgainst.push(element);
              });
              this.shots['against'] = this.shotsArrAgainst;
            } else {
              this.shots['against'] = loaded_data;
            }

            this.dataLoaded = true;
            this.loading = false;

            if (event.callback) {
              event.callback();
            } else {
              console.log('No callback :(');
            }
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
            this.dataLoaded = true;
            this.loading = false;
          }
        );
    }
  }

  onLoadAgainstAssist() {
    this.dataLoaded = true;
    this.loading = true;

    this.pro_proti_assists = 'PROTI';

    if (this.shots_team === true) {
      this.formationsAnalysisService
        .getTeamAssistsAgainst(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime
        )
        .subscribe(
          (loaded_data) => {
            this.assists['against'] = loaded_data;
            this.dataLoaded = true;
            this.loading = false;
          },
          (err) => {
            alert('Chyba asistencí. 1');
            // this.defaultService.logout();
            this.dataLoaded = true;
            this.loading = false;
          }
        );
    } else {
      this.formationsAnalysisService
        .getFormationAssistsAgainst(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime
        )
        .subscribe(
          (loaded_data) => {
            this.assists['against'] = loaded_data;
            // load end

            this.dataLoaded = true;
            this.loading = false;
          },
          (err) => {
            alert('Chyba .');
            // this.defaultService.logout();
            this.dataLoaded = true;
            this.loading = false;
          }
        );
    }
  }

  // filters -start
  getCompetitions() {

    this.seasons_list = JSON.parse(localStorage.getItem('seasons_list'));
    this.seasons_list.forEach((item, index) => {
      const next_season = parseInt(item['name']) + 1;
      this.seasons_select_list.push({
        id: item['name'],
        itemName: item['name'] + ' - ' + next_season,
      });
    });
    // this.seasons_select_list.reverse();

    this.filter_season.push(this.seasons_select_list[0]);
    this.getSeasonParts();
  }

  toggleActivePlayer(player: number) {
    if (player === 1) {
      if (this.active_player1) {
        this.active_player1 = false;
      } else {
        this.active_player1 = true;
      }
    } else if (player === 2) {
      if (this.active_player2) {
        this.active_player2 = false;
      } else {
        this.active_player2 = true;
      }
    } else if (player === 3) {
      if (this.active_player3) {
        this.active_player3 = false;
      } else {
        this.active_player3 = true;
      }
    } else if (player === 4) {
      if (this.active_player4) {
        this.active_player4 = false;
      } else {
        this.active_player4 = true;
      }
    } else if (player === 5) {
      if (this.active_player5) {
        this.active_player5 = false;
      } else {
        this.active_player5 = true;
      }
    }
    this.loadData(this.tab_small_viz, true);
  }

  getSeasonParts() {
    this.filter_seasonPart = '';
    this.filter_team = '';
    this.filter_player = '';
    this.teams_list = [];
    this.players_list = [];

    const playoff = [];
    const base = [];
    const playout = [];
    const relegation = [];
    const preliminary = [];

    this.competitions_list = [];

    this.competitions_list = [
      {
        id: 0,
        name: this.translate.transform('zakladni_cast'),
        part: 'base',
        uuids: '',
      },
      { id: 1, name: 'Play-off', part: 'playoff', uuids: '' },
      { id: 2, name: 'Play-out', part: 'playout', uuids: '' },
      {
        id: 3,
        name: this.translate.transform('baraz'),
        part: 'relegation',
        uuids: '',
      },
      {
        id: 4,
        name: this.translate.transform('preliminary'),
        part: 'preliminary',
        uuids: '',
      },
    ];

    if (this.filter_season !== undefined) {
      this.filter_season.forEach((item, index) => {
        this.seasons_list.forEach((item2, index) => {
          if (item['id'] === item2['name']) {
            item2['competitions'].forEach((item3, index) => {
              item3['season'] = item2['name'];

              if (item3['part'] === 'base') {
                base.push(item3['uuid']);
              } else if (item3['part'] === 'playoff') {
                playoff.push(item3['uuid']);
              } else if (item3['part'] === 'playout') {
                playout.push(item3['uuid']);
              } else if (item3['part'] === 'relegation') {
                relegation.push(item3['uuid']);
              } else if (item3['part'] === 'preliminary') {
                preliminary.push(item3['uuid']);
              }
            });
          }
        });
      });

      this.competitions_list = [
        {
          id: 0,
          name: this.translate.transform('zakladni_cast'),
          part: 'base',
          uuids: this.itemsToStringApi(base),
        },
        {
          id: 1,
          name: 'Play-off',
          part: 'playoff',
          uuids: this.itemsToStringApi(playoff),
        },
        {
          id: 2,
          name: 'Play-out',
          part: 'playout',
          uuids: this.itemsToStringApi(playout),
        },
        {
          id: 3,
          name: this.translate.transform('baraz'),
          part: 'relegation',
          uuids: this.itemsToStringApi(relegation),
        },
        {
          id: 4,
          name: this.translate.transform('preliminary'),
          part: 'preliminary',
          uuids: this.itemsToStringApi(preliminary),
        },
      ];
    }

    this.filter_seasonPart = this.competitions_list[0]['uuids'];
    this.getTeamsData();
  }

  getTeamsData() {
    this.filter_team = '';
    this.teams_list = [];
    this.players_list = [];
    this.filter_player = '';

    const uuids = this.filter_seasonPart.split(',');
    uuids.forEach((item, index) => {
      const competition_details = JSON.parse(
        localStorage.getItem('competition_details')
      );

      competition_details.forEach((item2) => {
        if (typeof item2[item] !== 'undefined') {
          item2[item]['teams'].forEach((team) => {
            // load full players seznam
            team['players'].forEach((player) => {
              const key = {
                uuid: player['uuid'],
                name: player['name'],
                surname: player['surname'],
                position: player['position'],
                team: team['uuid'],
                jersey: player['jersey'],
                stick: player['stick'],
                hokejczId: player['hokejczId'],
              };
              localStorage.setItem(player['uuid'], JSON.stringify(key));
            });

            // load team player list
            const index: any = this.teams_list.findIndex(
              (x) => x.uuid === team['uuid']
            );

            if (index === -1) {
              this.teams_list.push({
                id: team['uuid'],
                uuid: team['uuid'],
                itemName: team['name'],
                name: team['name'],
                shortName: team['shortName'],
                shortcut: team['shortcut'],
                team: team['uuid'],
                players: '',
              });
            } else { console.log('object already exists'); }
          });
        }
      });
    });
  }

  getPlayerList() {
    this.players_list = [];
    this.filter_player = '';

    const uuids = this.filter_seasonPart.split(',');

    uuids.forEach((item, index) => {
      const competition_details = JSON.parse(
        localStorage.getItem('competition_details')
      );

      competition_details.forEach((loaded_data) => {
        if (typeof loaded_data[item] !== 'undefined') {
          loaded_data[item]['teams'].forEach((team) => {
            if (team['uuid'] === this.filter_team) {
              team['players'].forEach((player) => {
                const index: any = this.players_list.findIndex(
                  (x) => x.uuid === player['uuid']
                );
                if (index === -1) {
                  player['short_name'] =
                    player['surname'] + ' ' + player['name'][0] + '.';
                  this.players_list.push(player);
                }
              });
            }
          });
        }
      });
    });


    this.players_list.sort(this.sortBy('surname', false));

    if (this.filter_team === this.filter_opponent) {
      this.filter_opponent = '';
    }

    if (this.tab_small_viz === 'heatmap') {
      this.loadData('heatmap', true);
    }
  }

  checkReload() {
    if (this.tab_small_viz === 'heatmap') {
      this.loadData('heatmap', true);
    }
  }

  sortBy(key, reverse) {
    const moveSmaller = reverse ? 1 : -1;
    const moveLarger = reverse ? -1 : 1;

    /**
     * @param  {*} a
     * @param  {*} b
     * @return {Number}
     */
    return function (a, b) {
      if (a[key] < b[key]) {
        return moveSmaller;
      }
      if (a[key] > b[key]) {
        return moveLarger;
      }
      return 0;
    };
  }

  changedOrder(event, type) {
    if (type === 1) {
      this.filterby1 = event;
    } else if (type === 2) {
      this.filterby2 = event;
    } else if (type === 3) {
      this.filterby3 = event;
    } else if (type === 4) {
      this.filterby4 = event;
    } else if (type === 5) {
      this.filterby5 = event;
    }
  }

  dateRangeChange($event) {
    if ($event.startDate === null || $event.startDate === undefined) {
      this.filter_dateFrom = undefined;
    } else {
      const filter_dateFrom = $event.startDate.toDate();
      this.filter_dateFrom = filter_dateFrom
        .toISOString()
        .slice(0, 10)
        .replace('T', ' ');
    }

    if ($event.endDate === null || $event.endDate === undefined) {
      this.filter_dateTo = undefined;
    } else {
      const filter_dateTo = $event.endDate.toDate();
      this.filter_dateTo = filter_dateTo
        .toISOString()
        .slice(0, 10)
        .replace('T', ' ');
    }
  }

  // filters end
  dateFromChange(date: string) {
    const date_string = new Date(date);
    const dayIndex = date_string.getDate();
    const monthIndex = date_string.getMonth() + 1;
    const year = date_string.getFullYear();
    let month = '';
    let day = '';
    if (monthIndex < 10) {
      month = '0' + monthIndex;
    } else {
      month = monthIndex.toString();
    }
    if (dayIndex < 10) {
      day = '0' + dayIndex;
    } else {
      day = dayIndex.toString();
    }

    this.filter_dateFrom = year + '-' + month + '-' + day;
  }

  dateToChange(date: string) {
    const date_string = new Date(date);
    const dayIndex = date_string.getDate();
    const monthIndex = date_string.getMonth() + 1;
    const year = date_string.getFullYear();
    let month = '';
    let day = '';
    if (monthIndex < 10) {
      month = '0' + monthIndex;
    } else {
      month = monthIndex.toString();
    }
    if (dayIndex < 10) {
      day = '0' + dayIndex;
    } else {
      day = dayIndex.toString();
    }
    this.filter_dateTo = year + '-' + month + '-' + day;
  }

  toggleTableAttributes(select: string) {
    this.table_settings.forEach((item, index) => {
      if (item['type'] === select) {
        if (item['enabled'] === false) {
          this.table_settings[index]['enabled'] = true;
        } else {
          this.table_settings[index]['enabled'] = false;
        }
      }
    });
  }

  getTableToggleAttributes(attribute: string) {
    let style = '';

    this.table_settings.forEach((item, index) => {
      if (item['type'] === attribute) {
        if (item['enabled'] === false) {
          style = 'hidden';
        } else {
          style = '';
        }
      }
    });

    return style;
  }

  toggleTableSettings() {
    if (this.toggle_table_settings === true) {
      this.toggle_table_settings = false;
    } else {
      this.toggle_table_settings = true;
    }
  }

  setPlayerOn(player: number) {
    if (player === 1) {
      this.filter_selected_players1 = 'on';
    } else if (player === 2) {
      this.filter_selected_players2 = 'on';
    } else if (player === 3) {
      this.filter_selected_players3 = 'on';
    } else if (player === 4) {
      this.filter_selected_players4 = 'on';
    } else if (player === 5) {
      this.filter_selected_players5 = 'on';
    } else if (player === 6) {
      this.filter_selected_players6 = 'on';
    }
  }

  setPlayerOff(player: number) {
    if (player === 1) {
      this.filter_selected_players1 = 'off';
    } else if (player === 2) {
      this.filter_selected_players2 = 'off';
    } else if (player === 3) {
      this.filter_selected_players3 = 'off';
    } else if (player === 4) {
      this.filter_selected_players4 = 'off';
    } else if (player === 5) {
      this.filter_selected_players5 = 'off';
    } else if (player === 6) {
      this.filter_selected_players6 = 'off';
    }
  }

  showSubTab(subtab: string) {
    this.subtab = subtab;
  }

  getPlayerFaceoffData(playerUUID: string) {
    let value = '';
    this.faceOffsData.forEach((item) => {

      if (item.player === playerUUID) {
        value =
          Math.round(item.stats.fo) +
          '; ' +
          Math.round(item.stats.fow_percent) +
          '%';
      }
    });
    if (value === '') {
      return '';
    } else {
      return '(' + value + ')';
    }
  }

  getPlayerRaidData(playerUUID: string) {
    let total = 0;
    let goals = 0;
    this.raids.forEach((item) => {
      if (item.skater.player === playerUUID) {
        total = total + 1;
        if (item.goal) {
          goals = goals + 1;
        }
      }
    });
    if (total === 0 ) {
      return '';
    } else {
      return '(' + total + '; ' + (Math.round((100 / total * goals))) + '%)';
    }
  }

  showSubTabVhazovani(subtab: string) {
    this.subtab_vhazovani = subtab;
  }

  showSubTabVstupy(subtab: string) {
    this.subtab_vstupy = subtab;
  }

  smallTabViz_toggle(type: string) {
    this.tab_small_viz = type;
    this.shotmap_invert = true;

    // if (type !== 'shots') {
    //   this.shotmap_invert = true;
    // }

    if (type === 'heatmap') {
    }

    if (type === 'faceoffs') {
    }

    if (type === 'entries') {
      // this.loadAllVstupyData();
    }

    if (type === 'shootouts') {
      this.loadRaids();
    }

    if (type === 'passes') {
      this.dataLoaded = false;
      this.loading = true;

      if (this.shots_team === true) {
        this.formationsAnalysisService
          .getTeamAssistsFor(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_situationType,
            this.filter_situationTime
          )
          .subscribe(
            (loaded_data) => {
              this.assists['for'] = loaded_data;

              this.dataLoaded = true;
              this.loading = false;
            },
            (err) => {
              alert('Chyba asistencí. 1');
              // this.defaultService.logout();
              this.dataLoaded = false;
              this.loading = true;
            }
          );
      } else {
        this.formationsAnalysisService
          .getFormationAssistsFor(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_playerId_select1,
            this.filter_playerId_select2,
            this.filter_playerId_select3,
            this.filter_playerId_select4,
            this.filter_playerId_select5,
            this.filter_playerId_select6,
            this.filter_selected_players1,
            this.filter_selected_players2,
            this.filter_selected_players3,
            this.filter_selected_players4,
            this.filter_selected_players5,
            this.filter_selected_players6,
            this.filter_situationType,
            this.filter_situationTime
          )
          .subscribe(
            (loaded_data) => {
              this.assists['for'] = loaded_data;
              // load end

              this.dataLoaded = true;
              this.loading = false;
            },
            (err) => {
              alert('Chyba .');
              // this.defaultService.logout();\
              this.dataLoaded = true;
              this.loading = false;
            }
          );
      }
    }
    if (this.tab_small_viz === 'faceoffs') {
      this.faceOffsData.forEach(data => {
        this.players_list.forEach((data2, index) => {
          if (data.player === data2.uuid) {
            this.players_list[index]['winRate'] = data.stats.fo;
          }
        });
      });
      this.players_list.sort(this.sortBy('winRate', true));
    }
  }

  loadRaids() {
    this.loading = true;
    this.individualStatsService.shootouts(this.filter_seasonPart, this.filter_team, this.filter_lastGames, this.filter_countOfPlayer, this.filter_matchState, this.filter_homeAway, this.filter_opponents, this.filter_dateFrom, this.filter_dateTo, this.filter_minutes_from, this.filter_minutes_to, this.filter_minTOI, this.filter_situationType, this.filter_situationTime, undefined).subscribe(loaded_data => {
      this.raids = loaded_data;
      this.loading = false;

      this.players_list.forEach(player => {
        let total = 0;
        // let goals = 0;
        this.raids.forEach((item) => {
          if (item.skater.player === player.uuid) {
            total = total + 1;
            /* if(item.goal){
              goals = goals + 1;
            } */
          }
        });
        if (total === 0) {
          player['winRate'] = 0;
        } else {
          /* player['winRate'] = Math.round((100 / total * goals)) */
          player['winRate'] = total;
        }

      });

      this.players_list.sort(this.sortBy('winRate', true));
    }, err => {
      alert('Error: \'VRS\'');
    });
  }

  getPlayerPost(uuid: string) {
    if (uuid !== undefined) {
      if (localStorage.getItem(uuid) !== null) {
        return JSON.parse(localStorage.getItem(uuid))['position'];
      } else {
        return 'no-post';
      }
    } else {
      return 'no-post';
    }
  }

  getPlayerJersey(uuid: string) {
    const data = JSON.parse(localStorage.getItem(uuid));

    if (data !== null) {
      if (uuid !== null && uuid !== undefined) {
        const jersey_number = data['jersey'];

        return jersey_number;
      }
    } else {
      return '';
    }
  }

  getPlayerName(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return '' + uuid;
    } else {
      const surname = JSON.parse(localStorage.getItem(uuid))['surname'];
      const name = JSON.parse(localStorage.getItem(uuid))['name'];

      if (surname === 'Klima') {
        let name2 = '';
        if (name === 'Kelly Philip') {
          name2 = 'Kl.';
        }
        if (name === 'Kevin') {
          name2 = 'Kv.';
        }

        return surname + ' ' + name2;
      } else {
        return surname + ' ' + name[0] + '.';
      }
    }
  }

  getPlayerStick(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return '--- ' + uuid;
    } else {
      let stick = JSON.parse(localStorage.getItem(uuid))['stick'];
      if (stick === 'left') {
        stick = 'L';
      } else {
        stick = 'R';
      }
      return stick;
    }
  }

  getPlayerPostName(uuid: string) {
    if (uuid !== undefined) {
      if (localStorage.getItem(uuid) !== null) {
        if (JSON.parse(localStorage.getItem(uuid))['position'] === 'DE') {
          return 'O';
        } else if (JSON.parse(localStorage.getItem(uuid))['position'] === 'FO') {
          return 'Ú';
        } else {
          return '';
        }
      } else {
        return 'no-post';
      }
    } else {
      return '';
    }
  }

  getPlayerTeam(uuid: string) {
    if (uuid !== undefined) {
      if (localStorage.getItem(uuid) !== null) {
        return JSON.parse(localStorage.getItem(uuid))['team'];
      } else {
        return 'no-team';
      }
    } else {
      return 'no-team';
    }
  }

  getPlayerTeamShort(uuid: string) {
    if (localStorage.getItem(uuid) !== null) {
      uuid = JSON.parse(localStorage.getItem(uuid))['team'];
      // alert(JSON.stringify(uuid));
      // console.log(JSON.stringify(this.teams_list));
      let team = '';
      let keepGoing = true;
      this.teams_list.forEach((item, index) => {
        if (keepGoing) {
          if (item['team'] === uuid) {
            // console.log(JSON.stringify(item));
            keepGoing = false;
            team = item['shortcut'];
          } else {
            team = '';
          }
        }
      });

      return team;
    } else {
      return '';
    }
  }

  getTeamLogo(uuid: string) {
    let shortcut = '';
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] === uuid) {
        shortcut = item['shortcut'];
      }
    });

    return this.getPlayerTeamLogo(shortcut);
  }

  getTeamNameShort(uuid: string) {
    let team_name = '';
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] === uuid) {
        team_name = item['name'];
      }
    });

    return team_name;
  }

  getTeamNameShortcut(uuid: string) {
    let team_name = '';
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] === uuid) {
        team_name = item['shortcut'];
      }
    });

    return team_name;
  }

  getTeamShort(team_hash: string) {
    let team_shortcut = '';
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] === team_hash) {
        team_shortcut = item['shortcut'];
      }
    });

    return team_shortcut;
  }

  getPlayerTeamLogo(team_shortcut: string) {
    if (team_shortcut === 'MHK') {
      return '../assets/logos/29579d3e-1502-4ec0-80e3-f5ead6d22fb0.png';
    } else if (team_shortcut === 'OLO') {
      return '../assets/logos/71760283-d630-4c7f-b52f-e0b193a622cd.png';
    } else if (team_shortcut === 'TRI') {
      return '../assets/logos/55d9085b-58b5-4c52-bc73-42fdc106c944.png';
    } else if (team_shortcut === 'CHM') {
      return '../assets/logos/1460b1ac-a5a9-4819-997e-afa26b512299.png';
    } else if (team_shortcut === 'LIT') {
      return '../assets/logos/3c08ada2-3fd6-49b7-974d-2db9c92676ac.png';
    } else if (team_shortcut === 'LIB') {
      return '../assets/logos/3c85029c-140f-4971-96d2-76a95f429c2b.png';
    } else if (team_shortcut === 'PLZ') {
      return '../assets/logos/524e1ff0-e670-42d9-93aa-8ba35bb94942.png';
    } else if (team_shortcut === 'PCE') {
      return '../assets/logos/f9b85077-6ea5-4769-9bba-27d5da8e97bd.png';
    } else if (team_shortcut === 'ZLN') {
      return '../assets/logos/eec5f929-a5bb-4bf4-8e69-34d0a274c661.png';
    } else if (team_shortcut === 'VIT') {
      return '../assets/logos/99f32b0e-ddcc-4330-8ef5-66c8bbdd22ba.png';
    } else if (team_shortcut === 'SPA') {
      return '../assets/logos/9af95c87-b24b-411b-a615-c1d86861fca5.png';
    } else if (team_shortcut === 'KOM') {
      return '../assets/logos/69802e5a-b9de-4bc0-8001-f5e11d0f2048.png';
    } else if (team_shortcut === 'MBL') {
      return '../assets/logos/b4a4a812-fd88-47e4-a626-be3300b390cc.png';
    } else if (team_shortcut === 'JIH') {
      return '../assets/logos/e3bf29fb-e963-4922-9064-1b6101047a9e.png';
    } else if (team_shortcut === 'KVA') {
      return '../assets/logos/302630a7-3aff-4303-9539-951bdd605ab9.png';
    } else if (team_shortcut === 'KLA') {
      return '../assets/logos/42bafa4d-5e60-4f00-81c5-4f44ffa55927.png';
    } else if (team_shortcut === 'CEB') {
      return '../assets/logos/732e68fc-13c7-45a8-bb51-5eeab8b10283.png';
    }
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.itemName;
      })
      .join(', ');
  }

  public itemsToStringApi(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item;
      })
      .join(',');
  }

  uniqEs6 = (arrArg) => {
    return arrArg.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });
  }

  changeSelectedPlayersList(event, type: number) {
    this.dataLoaded = false;
    this.loading = false;
    // this.tab = "";
    // this.tab_small_viz = "shots";

    if (type === 1) {
      this.active_player1 = true;
      if (
        event === this.filter_playerId_select2 ||
        event === this.filter_playerId_select3 ||
        event === this.filter_playerId_select4 ||
        event === this.filter_playerId_select5 ||
        event === this.filter_playerId_select6
      ) {
        this.filter_playerId_select1 = '';
      }
    }

    if (type === 2) {
      this.active_player2 = true;
      if (
        event === this.filter_playerId_select1 ||
        event === this.filter_playerId_select3 ||
        event === this.filter_playerId_select4 ||
        event === this.filter_playerId_select5 ||
        event === this.filter_playerId_select6
      ) {
        this.filter_playerId_select2 = '';
      }
    }

    if (type === 3) {
      this.active_player3 = true;
      if (
        event === this.filter_playerId_select1 ||
        event === this.filter_playerId_select2 ||
        event === this.filter_playerId_select4 ||
        event === this.filter_playerId_select5 ||
        event === this.filter_playerId_select6
      ) {
        this.filter_playerId_select3 = '';
      }
    }

    if (type === 4) {
      this.active_player4 = true;
      if (
        event === this.filter_playerId_select1 ||
        event === this.filter_playerId_select2 ||
        event === this.filter_playerId_select3 ||
        event === this.filter_playerId_select5 ||
        event === this.filter_playerId_select6
      ) {
        this.filter_playerId_select4 = '';
      }
    }

    if (type === 5) {
      this.active_player5 = true;
      if (
        event === this.filter_playerId_select1 ||
        event === this.filter_playerId_select2 ||
        event === this.filter_playerId_select3 ||
        event === this.filter_playerId_select4 ||
        event === this.filter_playerId_select6
      ) {
        this.filter_playerId_select5 = '';
      }
    }

    if (type === 6) {
      this.active_player6 = true;
      if (
        event === this.filter_playerId_select1 ||
        event === this.filter_playerId_select2 ||
        event === this.filter_playerId_select3 ||
        event === this.filter_playerId_select4 ||
        event === this.filter_playerId_select5
      ) {
        this.filter_playerId_select6 = '';
      }
    }

    this.loadData(this.tab_small_viz, true);
  }

  checkExistParameter() {
    let parameters_exists_reload_data = false;

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['filter_season'] !== undefined) {
        this.filter_season = [];

        const filter_season = params['filter_season'];
        const filter_season_list = filter_season.split(',');

        filter_season_list.forEach((item, index) => {
          const next_season = parseInt(item) + 1;
          this.filter_season.push({
            id: item,
            itemName: item + ' - ' + next_season,
          });
        });

        this.filter_seasonPart = '';

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_seasonPart'] !== undefined) {
        this.getSeasonParts();
        this.filter_seasonPart = params['filter_seasonPart'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_team'] !== undefined) {
        this.filter_team = params['filter_team'];
        this.getPlayerList();

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_countOfPlayer'] !== undefined) {
        this.filter_countOfPlayer = params['filter_countOfPlayer'];

        if (this.filter_countOfPlayer === '5:5-FO') {
          this.filter_countOfPlayer = '5:5';
        }

        if (this.filter_countOfPlayer === '5:5-DE') {
          this.filter_countOfPlayer = '5:5';
        }

        if (this.filter_countOfPlayer === 'ALL') {
          this.filter_countOfPlayer = '';
        }

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_minTOI'] !== undefined &&
        params['filter_minTOI'] !== 'undefined'
      ) {
        this.filter_minTOI = parseInt(params['filter_minTOI']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_lastGames'] !== undefined &&
        params['filter_lastGames'] !== 'undefined' &&
        params['filter_lastGames'] !== '0'
      ) {
        this.more_filters = true;
        // tslint:disable-next-line:radix
        this.filter_lastGames = parseInt(params['filter_lastGames']);
        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_dateFrom'] !== undefined &&
        params['filter_dateFrom'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_dateFrom = params['filter_dateFrom'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_dateTo'] !== undefined &&
        params['filter_dateTo'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_dateTo = params['filter_dateTo'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_homeAway'] !== undefined &&
        params['filter_homeAway'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_homeAway = params['filter_homeAway'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_matchState'] !== undefined &&
        params['filter_matchState'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_matchState = params['filter_matchState'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_minutes_from'] !== undefined &&
        params['filter_minutes_from'] !== 'undefined'
      ) {
        // this.more_filters = true;
        // tslint:disable-next-line:radix
        this.filter_minutes_from = parseInt(params['filter_minutes_from']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_minutes_to'] !== undefined &&
        params['filter_minutes_to'] !== 'undefined'
      ) {
        // this.more_filters = true;
        // tslint:disable-next-line:radix
        this.filter_minutes_to = parseInt(params['filter_minutes_to']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_opponents'] !== undefined &&
        params['filter_opponents'] !== 'undefined'
      ) {
        // this.more_filters = true;

        this.filter_opponents = params['filter_opponents'].split(',');

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_playerId_select1'] !== undefined &&
        params['filter_playerId_select1'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_playerId_select1 = params['filter_playerId_select1'];
        //
        parameters_exists_reload_data = true;
        this.active_player1 = true;
      }

      if (
        params['filter_playerId_select2'] !== undefined &&
        params['filter_playerId_select2'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_playerId_select2 = params['filter_playerId_select2'];

        //
        parameters_exists_reload_data = true;
        this.active_player2 = true;
      }

      if (
        params['filter_playerId_select3'] !== undefined &&
        params['filter_playerId_select3'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_playerId_select3 = params['filter_playerId_select3'];

        //
        parameters_exists_reload_data = true;
        this.active_player3 = true;
      }

      if (
        params['filter_playerId_select4'] !== undefined &&
        params['filter_playerId_select4'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_playerId_select4 = params['filter_playerId_select4'];

        //
        parameters_exists_reload_data = true;
        this.active_player4 = true;
      }

      if (
        params['filter_playerId_select5'] !== undefined &&
        params['filter_playerId_select5'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_playerId_select5 = params['filter_playerId_select5'];

        //
        parameters_exists_reload_data = true;
        this.active_player5 = true;
      }

      if (
        params['selected_match'] !== undefined &&
        params['selected_match'] !== 'undefined'
      ) {
        this.selected_games = [];
        this.selected_games.push({
          match: params['selected_match']
      });
      }
      if (
        params['filter_playerId_select6'] !== undefined &&
        params['filter_playerId_select6'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_playerId_select6 = params['filter_playerId_select6'];

        //
        parameters_exists_reload_data = true;
        this.active_player6 = true;
      }

      if (
        params['filter_situationType'] !== undefined &&
        params['filter_situationType'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_situationType = params['filter_situationType'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_situationTime'] !== undefined &&
        params['filter_situationTime'] !== 'undefined'
      ) {
        // this.more_filters = true;
        // tslint:disable-next-line:radix
        this.filter_situationTime = parseInt(params['filter_situationTime']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_opponents'] !== undefined &&
        params['filter_opponents'] !== 'undefined'
        ) {
        const filter_opponents = params.filter_opponents.split(',');

        filter_opponents.forEach(opponent => {
          this.teams_list.forEach(team => {
            if (opponent === team.id) {
              this.selected_teams.push(team);
            }
          });
        });
        this.filter_opponents = filter_opponents;
      }

      if (
        params['selected_attributes'] !== undefined &&
        params['selected_attributes'] !== 'undefined'
      ) {
        // this.more_filters = true;
        this.selected_attributes_string = params['selected_attributes'];
        // alert(JSON.stringify(this.table_settings) + "   " + this.selected_attributes_string);

        const parameter_attributes = this.selected_attributes_string.split(',');

        const loaded_attributes = [];
        const attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

        for (const item in attributes['players'][0]['individual'][0]) {
          attributes['players'][0]['individual'][0][item][0]['types'].forEach(
            (item, index) => {
              item['attributes'].forEach(item2 => {
                item2['onIce'] = false;
                loaded_attributes.push(item2);
              });
            }
          );
        }

        for (const item in attributes['players'][0]['onIce'][0]) {
          attributes['players'][0]['onIce'][0][item][0]['types'].forEach(
            (item, index) => {
              item['attributes'].forEach(item2 => {
                item2['onIce'] = true;
                loaded_attributes.push(item2);
              });
            }
          );
        }

        this.table_settings = [];
        parameter_attributes.forEach((item) => {
          loaded_attributes.forEach((element) => {
            if (element['type'] === item) {
              this.table_settings.push({
                type: element['type'],
                name: element['name'],
                colour: element['colour'],
                eng: element['eng'],
                desc: element['desc'],
                data: element['data'],
                onIce: element['onIce'],
                origin: element['type'],
                types: []
              });
            }
          });
        });

        //
        parameters_exists_reload_data = true;
      }
      if (parameters_exists_reload_data === true) {
        this.loadData('shots', false);
      }
    });
  }

  getShotCategoryHeatmap(shoot_category: string) {
    let shoot_category_name = '';

    if (shoot_category === 'gf60') {
      shoot_category_name = 'gf60';
    } else if (shoot_category === 'sogf60') {
      shoot_category_name = 'sogf60';
    } else if (shoot_category === 'cf60') {
      shoot_category_name = 'cf60';
    } else if (shoot_category === 'ff60') {
      shoot_category_name = 'ff60';
    }

    return shoot_category_name;
  }

  Remap(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) / (in_max - in_min)) * (out_max - out_min) + out_min;
  }

  isSelectedMinOnePlayer() {
    if (
      this.filter_playerId_select1 !== '' ||
      this.filter_playerId_select2 !== '' ||
      this.filter_playerId_select3 !== '' ||
      this.filter_playerId_select4 !== '' ||
      this.filter_playerId_select5 !== '' ||
      this.filter_playerId_select6 !== ''
    ) {
      this.isSelectedMinOnePlayerHeat = true;
    } else {
      this.isSelectedMinOnePlayerHeat = false;
    }
  }

  onshot_zChange1(val) {
    this.heat_radius1 = val;
  }

  onshot_zChange2(val) {
    this.heat_radius2 = val;
  }

  round(value: number) {
    return value.toFixed(2);
  }

  onChangedAttributes(new_attributes: any) {
    const clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item['type'] !== null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings = clean_attributes;
    this.loadData(this.tab_small_viz, true);
  }

  getAttributeColour(type: string) {
    let colour = 'no-colour';
    const attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

    if (type !== null || type !== undefined) {
      if (type.startsWith('r_')) {
        type = type.substring(2);
      } else if (type.startsWith('o_')) {
        type = type.substring(2);
      } else if (type.startsWith('f_')) {
        type = type.substring(2);
      } else if (type.startsWith('up_')) {
        type = type.substring(3);
      } else if (type.startsWith('np_')) {
        type = type.substring(3);
      }
    }

    if (type !== null || type !== undefined) {
      for (const item in attributes['individual'][0]) {
        attributes['individual'][0][item][0]['attributes'].forEach(
          (item, index) => {
            if (item['type'] === type) {
              colour = item['colour'];
            }
          }
        );
      }

      for (const item in attributes['onIce'][0]) {
        attributes['onIce'][0][item][0]['attributes'].forEach((item, index) => {
          if (item['type'] === type) {
            colour = item['colour'];
          }
        });
      }

      /*
            for (let item in attributes["teamsData"][0]) {
                //console.log(JSON.stringify());
                attributes["teamsData"][0][item][0]["attributes"].forEach((item, index) => {
                    if (item["type"] === type) {
                        colour = item["colour"];
                    }
                });
            }
            */
    }
    return colour;
  }

  getAttributeText(type: string, show_what: number) {
    let title = '';
    let desc = '';

    if (type !== null) {
      if (type.startsWith('r_')) {
        type = type.substring(2);
      } else if (type.startsWith('o_')) {
        type = type.substring(2);
      } else if (type.startsWith('up_')) {
        type = type.substring(3);
      } else if (type.startsWith('np_')) {
        type = type.substring(3);
      }
    }

    const attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

    for (const item in attributes['individual'][0]) {
      // console.log(JSON.stringify());
      attributes['individual'][0][item][0]['attributes'].forEach(
        (item, index) => {
          if (item['type'] === type) {
            title = item['eng'];
            desc = item['desc'];
          }
        }
      );
    }

    for (const item in attributes['onIce'][0]) {
      // console.log(JSON.stringify());
      attributes['onIce'][0][item][0]['attributes'].forEach((item, index) => {
        if (item['type'] === type) {
          title = item['eng'];
          desc = item['desc'];
        }
      });
    }

    /*
        for (let item in attributes["teamsData"][0]) {
            attributes["teamsData"][0][item][0]["attributes"].forEach((item, index) => {
                if (item["type"] === type) {
                    title = item["eng"];
                    desc = item["desc"];
                }
            });
        }
        */

    if (show_what === 1) {
      return title;
    } else if (show_what === 2) {
      return desc;
    } else {
      return '';
    }
  }

  stringy(assist: any) {
    return JSON.stringify(assist);
  }

  downloadCSVSpoluhraci() {
    let data = [];
    const th = ['Tym', 'Pozice', 'Jmeno hrace', 'GP', 'TOI'];
    const th_types = ['team', 'post', 'uuid', 'gp', 'toi'];

    this.table_settings.forEach((item, index) => {
      if (item['type'] !== null) {
        th.push(item['name']);
        th_types.push(item['type']);
      }
    });

    data.push(th);

    const row = [];
    this.spoluhraci_data.forEach((item, index) => {
      row.push(item);
    });

    // console.log(JSON.stringify(row));

    row.forEach((item, index) => {
      const selected_data = [];
      th_types.forEach((item2, index2) => {
        if (item2 === 'toi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'oztoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'ozposstoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'posstoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'dztoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'dzposstoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'oppdzptoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'uuid') {
          selected_data.push(accents.remove(this.getPlayerName(item[item2])));
        } else if (item2 === 'post') {
          selected_data.push(this.getPlayerPostName(item.uuid));
        } else if (item2 === 'team') {
          selected_data.push(this.getPlayerTeamShort(item.uuid));
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      if (this.filter_posts === 'ALL') {
        data.push(selected_data);
      } else if (this.filter_posts === 'DE') {
        if (this.getPlayerPost(item['uuid']) === 'DE') {
          data.push(selected_data);
        }
      } else if (this.filter_posts === 'FO') {
        if (this.getPlayerPost(item['uuid']) === 'FO') {
          data.push(selected_data);
        }
      }
    });

    data = JSON.parse(JSON.stringify(data));

    const final_data = JSON.parse(JSON.stringify(data));

    // new Angular5Csv(final_data, 'formations-analysis', csv_options);
    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data['url']);
    });
  }

  downloadCSVProtihraci() {
    let data = [];
    const th = ['Tym', 'Pozice', 'Jmeno hrace', 'GP', 'TOI'];
    const th_types = ['team', 'post', 'uuid', 'gp', 'toi'];

    this.table_settings.forEach((item, index) => {
      if (item['type'] !== null) {
        th.push(item['name']);
        th_types.push(item['type']);
      }
    });

    data.push(th);

    const row = [];

    this.protihraci_data.forEach((item, index) => {
      if (this.filter_table_teams === '') {
        row.push(item);
      } else {
        if (
          this.getTeamNameShortcut(this.getPlayerTeam(item['uuid'])) ===
          this.getTeamNameShortcut(this.filter_table_teams)
        ) {
          row.push(item);
        }
      }
    });

    row.forEach((item, index) => {
      const selected_data = [];
      th_types.forEach((item2, index2) => {
        if (item2 === 'toi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'oztoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'ozposstoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'posstoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'dztoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'dzposstoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'oppdzptoi') {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 === 'uuid') {
          selected_data.push(accents.remove(this.getPlayerName(item[item2])));
        } else if (item2 === 'post') {
          selected_data.push(this.getPlayerPostName(item.uuid));
        } else if (item2 === 'team') {
          selected_data.push(this.getPlayerTeamShort(item.uuid));
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      if (this.filter_posts === 'ALL') {
        data.push(selected_data);
      } else if (this.filter_posts === 'DE') {
        if (this.getPlayerPost(item['uuid']) === 'DE') {
          data.push(selected_data);
        }
      } else if (this.filter_posts === 'FO') {
        if (this.getPlayerPost(item['uuid']) === 'FO') {
          data.push(selected_data);
        }
      }
    });

    data = JSON.parse(JSON.stringify(data));

    const final_data = JSON.parse(JSON.stringify(data));

    // new Angular5Csv(final_data, 'formations-analysis');
    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data['url']);
    });
  }

  formatSeconds(seconds: number) {
    const date = new Date(seconds * 1000);
    const hh: any = date.getUTCHours();
    const mm: any = date.getUTCMinutes();
    let ss: any = date.getSeconds();
    let mh = mm + 60 * hh;

    if (mh < 10) {
      mh = '0' + mh;
    }
    if (ss < 10) {
      ss = '0' + ss;
    }

    return mh + ':' + ss;
  }

  formatSecondsDecimal(seconds: number) {
    return seconds / 60;
  }

  setDefaultOrderRow() {
    this.list_order = 0;
  }

  addOrderRow() {
    this.list_order = this.list_order + 1;
  }

  // detekce existence videa. Je az od sezony 2017>
  checkVideoExists() {
    let exists = true;
    this.filter_season.forEach((item) => {
      if (item['id'] === '2017' && this.filter_season.length === 1) {
        exists = false;
      }
    });
    return exists;
  }

  checkLoggedTime() {
    const dt1 = new Date(localStorage.getItem('logged_date'));
    const dt2 = new Date();
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;

    if (Math.abs(Math.round(diff)) > 6) {
      alert('Platnost relace přihlášení vypršela. Přihlaste se znovu.');
      this.defaultService.logout();
    }
  }

  averageCompareMain(compare_what: string) {
    if (this.average_compare_main === compare_what) {
      this.average_compare_main = '';
      this.average_compare_spoluhraci = '';
      this.average_compare_protihraci = '';
    } else {
      this.average_compare_main = compare_what;
      this.average_compare_spoluhraci = compare_what;
      this.average_compare_protihraci = compare_what;
    }
  }

  active_skala_main() {
    if (this.show_skala_main === true) {
      this.show_skala_main = false;
      this.show_skala_spoluhraci = false;
      this.show_skala_protihraci = false;
    } else {
      if (this.average_compare_main !== '') {
        this.show_skala_main = true;
        this.show_skala_spoluhraci = true;
        this.show_skala_protihraci = true;
        this.loadSkalaMain();
        this.loadSkalaSpoluhraci();
        this.loadSkalaProtihraci();
      } else {
        alert('Je nutné vybrat typ porovnání.');
      }
    }
  }

  loadSkalaMain() {
    this.skala_loading_main = true;

    this.data_relativeToCompetition_main = [];
    this.data_relativeToTeam_main = [];

    this.formationsAnalysisService
      .getFormationRelative(
        this.filter_seasonPart,
        this.filter_team,
        this.filter_lastGames,
        this.filter_countOfPlayer,
        this.filter_matchState,
        this.filter_homeAway,
        this.filter_opponents,
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_minTOI,
        this.filter_playerId_select1,
        this.filter_playerId_select2,
        this.filter_playerId_select3,
        this.filter_playerId_select4,
        this.filter_playerId_select5,
        this.filter_playerId_select6,
        this.filter_selected_players1,
        this.filter_selected_players2,
        this.filter_selected_players3,
        this.filter_selected_players4,
        this.filter_selected_players5,
        this.filter_selected_players6,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings,
        'competition'
      )
      .subscribe(
        (loaded_data) => {
          this.data_relativeToCompetition_main = loaded_data;

          this.formationsAnalysisService
            .getFormationRelative(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings,
              'team'
            )
            .subscribe(
              (loaded_data) => {
                this.data_relativeToTeam_main = loaded_data;

                const temporary_data_relativeToTeam = this
                  .data_relativeToTeam_main;

                const temporary_data_relativeToCompetition = this
                  .data_relativeToCompetition_main;

                this.data_relativeToCompetition_main = temporary_data_relativeToCompetition;
                this.data_relativeToTeam_main = temporary_data_relativeToTeam;
                this.skala_loading_main = false;
              },
              (err) => {
                // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                // this.defaultService.logout();
                // window.location.reload();
              }
            );
        },
        (err) => {
          // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          // this.defaultService.logout();
          // window.location.reload();
        }
      );
    // this.sendEvent(this.filter_team);
  }

  getSkalaColourMain(attribute: string) {
    let data = [];
    let cell_value = '';

    if (this.average_compare_main === 'team') {
      data = this.data_relativeToTeam_main;
    } else if (this.average_compare_main === 'competition') {
      data = this.data_relativeToCompetition_main;
    }
    // console.log(JSON.stringify(data));

    if (this.show_skala_main) {
      cell_value = 'cell-' + data[attribute];
      return cell_value;
    }
  }

  averageCompareSpoluhraci(compare_what: string) {
    if (this.average_compare_spoluhraci === compare_what) {
      this.average_compare_spoluhraci = '';
    } else {
      this.average_compare_spoluhraci = compare_what;
    }
  }

  active_skala_spoluhraci() {
    if (this.show_skala_spoluhraci === true) {
      this.show_skala_spoluhraci = false;
    } else {
      if (this.average_compare_spoluhraci !== '') {
        this.show_skala_spoluhraci = true;

        this.loadSkalaSpoluhraci();
      } else {
        alert('Je nutné vybrat typ porovnání.');
      }
    }
  }

  loadSkalaSpoluhraci() {
    this.skala_loading_spoluhraci = true;

    this.data_relativeToCompetition_spoluhraci = [];
    this.data_relativeToTeam_spoluhraci = [];

    this.formationsAnalysisService
      .getTeammatesRelativeTo(
        this.filter_seasonPart,
        this.filter_team,
        this.filter_lastGames,
        this.filter_countOfPlayer,
        this.filter_matchState,
        this.filter_homeAway,
        this.filter_opponents,
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_minTOI,
        this.filter_playerId_select1,
        this.filter_playerId_select2,
        this.filter_playerId_select3,
        this.filter_playerId_select4,
        this.filter_playerId_select5,
        this.filter_playerId_select6,
        this.filter_selected_players1,
        this.filter_selected_players2,
        this.filter_selected_players3,
        this.filter_selected_players4,
        this.filter_selected_players5,
        this.filter_selected_players6,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings,
        'competition'
      )
      .subscribe(
        (loaded_data) => {
          this.data_relativeToCompetition_spoluhraci = loaded_data;

          this.formationsAnalysisService
            .getTeammatesRelativeTo(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings,
              'team'
            )
            .subscribe(
              (loaded_data) => {
                this.data_relativeToTeam_spoluhraci = loaded_data;

                const temporary_data_relativeToTeam = [];
                this.data_relativeToTeam_spoluhraci.forEach((item, index) => {
                  // console.log(JSON.stringify(item));
                  const player_row = item;
                  item['team'] = item['team'];
                  temporary_data_relativeToTeam.push(item);
                });

                const temporary_data_relativeToCompetition = [];
                this.data_relativeToCompetition_spoluhraci.forEach(
                  (item, index) => {
                    const player_row = item;
                    item['team'] = item['team'];
                    temporary_data_relativeToCompetition.push(item);
                  }
                );

                this.data_relativeToCompetition_spoluhraci = temporary_data_relativeToCompetition;
                this.data_relativeToTeam_spoluhraci = temporary_data_relativeToTeam;

                this.skala_loading_spoluhraci = false;
              },
              (err) => {
                // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                // this.defaultService.logout();
                window.location.reload();
              }
            );
        },
        (err) => {
          // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          // this.defaultService.logout();
          window.location.reload();
        }
      );

    // this.sendEvent(this.filter_team);
  }

  loadSkalaProtihraci() {
    this.skala_loading_protihraci = true;

    this.data_relativeToCompetition_protihraci = [];
    this.data_relativeToTeam_protihraci = [];

    this.formationsAnalysisService
      .getOpponentsRelativeTo(
        this.filter_seasonPart,
        this.filter_team,
        this.filter_lastGames,
        this.filter_countOfPlayer,
        this.filter_matchState,
        this.filter_homeAway,
        this.filter_opponents,
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_minTOI,
        this.filter_playerId_select1,
        this.filter_playerId_select2,
        this.filter_playerId_select3,
        this.filter_playerId_select4,
        this.filter_playerId_select5,
        this.filter_playerId_select6,
        this.filter_selected_players1,
        this.filter_selected_players2,
        this.filter_selected_players3,
        this.filter_selected_players4,
        this.filter_selected_players5,
        this.filter_selected_players6,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings,
        'competition'
      )
      .subscribe(
        (loaded_data) => {
          this.data_relativeToCompetition_protihraci = loaded_data;

          this.formationsAnalysisService
            .getOpponentsRelativeTo(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings,
              'team'
            )
            .subscribe(
              (loaded_data) => {
                this.data_relativeToTeam_protihraci = loaded_data;

                const temporary_data_relativeToTeam = [];
                this.data_relativeToTeam_protihraci.forEach((item, index) => {
                  // console.log(JSON.stringify(item));
                  const player_row = item;
                  item['team'] = item['team'];
                  temporary_data_relativeToTeam.push(item);
                });

                const temporary_data_relativeToCompetition = [];
                this.data_relativeToCompetition_protihraci.forEach(
                  (item, index) => {
                    const player_row = item;
                    item['team'] = item['team'];
                    temporary_data_relativeToCompetition.push(item);
                  }
                );

                this.data_relativeToCompetition_protihraci = temporary_data_relativeToCompetition;
                this.data_relativeToTeam_protihraci = temporary_data_relativeToTeam;

                this.skala_loading_protihraci = false;
              },
              (err) => {
                // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                // this.defaultService.logout();
                window.location.reload();
              }
            );
        },
        (err) => {
          // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          // this.defaultService.logout();
          window.location.reload();
        }
      );

    // this.sendEvent(this.filter_team);
  }

  getSkalaColourSpoluhraci(player_uuid: string, attribute: string) {
    let data = [];
    let cell_value = '';

    if (this.average_compare_spoluhraci === 'team') {
      data = this.data_relativeToTeam_spoluhraci;
    } else if (this.average_compare_spoluhraci === 'competition') {
      data = this.data_relativeToCompetition_spoluhraci;
    }

    if (this.show_skala_spoluhraci) {
      data.forEach((item) => {
        if (item['player'] === player_uuid) {
          cell_value = 'cell-' + item['stats'][attribute];
        }
      });

      return cell_value;
    }
  }

  getSkalaColourProtihraci(player_uuid: string, attribute: string) {
    let data = [];
    let cell_value = '';

    if (this.average_compare_protihraci === 'team') {
      data = this.data_relativeToTeam_protihraci;
    } else if (this.average_compare_protihraci === 'competition') {
      data = this.data_relativeToCompetition_protihraci;
    }

    if (this.show_skala_protihraci) {
      data.forEach((item) => {
        if (item['player'] === player_uuid) {
          cell_value = 'cell-' + item['stats'][attribute];
        }
      });

      return cell_value;
    }
  }

  invertChanged(invert: boolean) {
    this.shotmap_invert = invert;
  }

  loadFaceoffData(data: any) {
    this.faceoff_data_loaded = false;
    this.faceoff_data_loading = true;
    this.scrollToBottom();

    let stick;
    if (data.stick === 'ALL') {
      stick = undefined;
    } else if (data.stick === 'against_L') {
      stick = 'left';
    } else if (data.stick === 'against_R') {
      stick = 'right';
    }

    let type = 'spot';
    if (
      data.spot === 'neutral' ||
      data.spot === 'defense' ||
      data.spot === 'offense'
    ) {
      type = 'zone';
      if (data.spot === 'neutral') {
        data.spot = 'N';
      }
      if (data.spot === 'defense') {
        data.spot = 'D';
      }
      if (data.spot === 'offense') {
        data.spot = 'O';
      }
    }

    this.protihraci_buly_selected_player = data.player;

    if (data.spot === 'total') {
      this.loadAllFaceoffData(data);
    } else {
      this.formationsAnalysisService
        .getPlayerFaceoffSpoluhraci(
          type,
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          data.player,
          this.filter_situationType,
          this.filter_situationTime,
          stick,
          data.spot,
          data.matches
        )
        .subscribe(
          (loaded_data) => {
            this.buly_spoluhraci_data = loaded_data;

            this.formationsAnalysisService
              .getPlayerFaceoffProtihraci(
                type,
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                data.player,
                this.filter_situationType,
                this.filter_situationTime,
                stick,
                data.spot,
                data.matches
              )
              .subscribe(
                (loaded_data) => {
                  this.buly_protihraci_data = loaded_data;
                  this.faceoff_data_loaded = true;
                  this.faceoff_data_loading = false;
                  this.scrollToBottom();
                },
                (err) => {}
              );
          },
          (err) => {}
        );
    }
  }

  loadAllFaceoffData(data: any) {
    this.faceoff_data_loaded = false;
    this.faceoff_data_loading = true;

    this.formationsAnalysisService
      .getIndividualStatsTeammates(
        this.filter_seasonPart,
        this.filter_team,
        this.filter_lastGames,
        this.filter_countOfPlayer,
        this.filter_matchState,
        this.filter_homeAway,
        this.filter_opponents,
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_minTOI,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings_buly,
        data.matches
      )
      .subscribe(
        (loaded_data) => {
          const spol_data = [];
          // console.log("lol " + JSON.stringify(loaded_data));
          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              fo: item['stats']['fo'],
              fow: item['stats']['fow'],
              fow_percent: item['stats']['fow_percent'],
            });
          });
          this.buly_spoluhraci_data = spol_data;

          if (data.spot === 'total') {
            // tady mozna bude treba nacitat jen individual hrace?
            this.protihraci_buly_selected_player = data.player;

            this.formationsAnalysisService
              .getFaceoffOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                data.player,
                '',
                '',
                '',
                '',
                '',
                'on',
                'off',
                'off',
                'off',
                'off',
                'off',
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_buly,
                data.matches
              )
              .subscribe(
                (loaded_data) => {
                  this.buly_protihraci_data = loaded_data;

                  this.faceoff_data_loaded = true;
                  this.faceoff_data_loading = false;
                  this.scrollToBottom();
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                  // this.defaultService.logout();
                }
              );
          } else {
            if (this.shots_team === false) {
              this.formationsAnalysisService
                .getFaceoffOpponents(
                  this.filter_seasonPart,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_countOfPlayer,
                  this.filter_matchState,
                  this.filter_homeAway,
                  this.filter_opponents,
                  this.filter_dateFrom,
                  this.filter_dateTo,
                  this.filter_minutes_from,
                  this.filter_minutes_to,
                  this.filter_minTOI,
                  this.filter_playerId_select1,
                  this.filter_playerId_select2,
                  this.filter_playerId_select3,
                  this.filter_playerId_select4,
                  this.filter_playerId_select5,
                  this.filter_playerId_select6,
                  this.filter_selected_players1,
                  this.filter_selected_players2,
                  this.filter_selected_players3,
                  this.filter_selected_players4,
                  this.filter_selected_players5,
                  this.filter_selected_players6,
                  this.filter_situationType,
                  this.filter_situationTime,
                  this.table_settings_buly,
                  data.matches
                )
                .subscribe(
                  (loaded_data) => {
                    this.buly_protihraci_data = loaded_data;

                    this.faceoff_data_loaded = true;
                    this.faceoff_data_loading = false;
                    this.scrollToBottom();
                  },
                  (err) => {
                    alert(
                      'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                    );
                    // this.defaultService.logout();
                  }
                );
            } else {
              this.formationsAnalysisService
                .getFaceoffOpponents(
                  this.filter_seasonPart,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_countOfPlayer,
                  this.filter_matchState,
                  this.filter_homeAway,
                  this.filter_opponents,
                  this.filter_dateFrom,
                  this.filter_dateTo,
                  this.filter_minutes_from,
                  this.filter_minutes_to,
                  this.filter_minTOI,
                  this.filter_playerId_select1,
                  this.filter_playerId_select2,
                  this.filter_playerId_select3,
                  this.filter_playerId_select4,
                  this.filter_playerId_select5,
                  this.filter_playerId_select6,
                  this.filter_selected_players1,
                  this.filter_selected_players2,
                  this.filter_selected_players3,
                  this.filter_selected_players4,
                  this.filter_selected_players5,
                  this.filter_selected_players6,
                  this.filter_situationType,
                  this.filter_situationTime,
                  this.table_settings_buly,
                  data.matches
                )
                .subscribe(
                  (loaded_data) => {
                    this.buly_protihraci_data = loaded_data;
                    this.faceoff_data_loaded = true;
                    this.faceoff_data_loading = false;
                  },
                  (err) => {
                    alert(
                      'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                    );
                    // this.defaultService.logout();
                  }
                );
            }
          }
        },
        (err) => {
          alert(
            'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
          );
          // this.defaultService.logout();
        }
      );
  }

  loadAllFaceoffDataByPos(data: any) {
    this.faceoff_data_loaded = false;
    this.faceoff_data_loading = true;

    if (data.spot === 'total') {
      this.formationsAnalysisService
        .getIndividualStatsTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_buly,
          data.matches
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];
            // console.log("lol " + JSON.stringify(loaded_data));
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                fo: item['stats']['fo'],
                fow: item['stats']['fow'],
                fow_percent: item['stats']['fow_percent'],
              });
            });
            this.buly_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getFaceoffOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_buly,
                data.matches
              )
              .subscribe(
                (loaded_data) => {
                  this.buly_protihraci_data = loaded_data;
                  this.faceoff_data_loaded = true;
                  this.faceoff_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                  // this.defaultService.logout();
                }
              );
          },
          (err) => {}
        );
    } else {
      let stick;
      if (data.stick === 'ALL') {
        stick = undefined;
      } else if (data.stick === 'against_L') {
        stick = 'left';
      } else if (data.stick === 'against_R') {
        stick = 'right';
      }

      let type = 'spot';
      if (
        data.spot === 'neutral' ||
        data.spot === 'defense' ||
        data.spot === 'offense'
      ) {
        type = 'zone';
        if (data.spot === 'neutral') {
          data.spot = 'N';
        }
        if (data.spot === 'defense') {
          data.spot = 'D';
        }
        if (data.spot === 'offense') {
          data.spot = 'O';
        }
      }
      this.formationsAnalysisService
        .getTeamFaceoffSpoluhraci(
          type,
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          stick,
          data.spot,
          data.matches
        )
        .subscribe(
          (loaded_data) => {
            this.buly_spoluhraci_data = loaded_data;

            this.formationsAnalysisService
              .getTeamFaceoffProtihraci(
                type,
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                stick,
                data.spot,
                data.matches
              )
              .subscribe(
                (loaded_data) => {
                  this.buly_protihraci_data = loaded_data;
                  this.faceoff_data_loaded = true;
                  this.faceoff_data_loading = false;
                },
                (err) => {}
              );
          },
          (err) => {}
        );
    }
  }

  scrollToBottom(): void {
    try {
      // this.full_content_scroll.nativeElement.scrollTop = this.full_content_scroll.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getPlayerColour(playerUUID: string) {
    let value = '';
    this.showDots.forEach((item, index) => {
      const index_ = index + 1;
      if (item['playerUUID'] === playerUUID) {
        value = 'tag-' + index_;
      }
    });
    return value;
  }

  openVideoPlayer(data: any) {
    this.videos_data = data;
    this.show_video_player = true;
  }

  closeVideo() {
    this.show_video_player = false;
  }

  // vstupy
  loadAllVstupyData(data: any) {
    // alert("all data");

    let count_of_players = 0;
    this.showDots.forEach((item) => {
      if (item.enabled === true && item.playerUUID !== '') {
        count_of_players = count_of_players + 1;
      }
    });

    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    this.table_settings_vstupy_spoluhraci = [
      { type: 'en', name: 'EN', colour: 'green' },
      { type: 'en60', name: 'EN/60', colour: 'green' },
      { type: 'enw', name: 'EN.W', colour: ' ' },
      { type: 'enw60', name: 'EN.W/60', colour: 'green' },
      { type: 'enwen', name: 'EN.W/EN', colour: 'green' },
      { type: 'enscf', name: 'EN→sCF', colour: 'green' },
      { type: 'enscfen', name: 'EN→sCF/EN', colour: 'green' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'en', name: 'EN', colour: 'green' },
      { type: 'en60', name: 'EN/60', colour: 'green' },
      { type: 'enw', name: 'EN.W', colour: ' ' },
      { type: 'enw60', name: 'EN.W/60', colour: 'green' },
      { type: 'enwen', name: 'EN.W/EN', colour: 'green' },
      { type: 'enscf', name: 'EN→sCF', colour: 'green' },
      { type: 'enscfen', name: 'EN→sCF/EN', colour: 'green' },
    ];

    if (count_of_players === 0) {
      this.formationsAnalysisService
        .getTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci
        )
        .subscribe((loaded_data) => {
          const spol_data = [];

          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              toi: item['stats']['toi'],
              en: item['stats']['en'],
              en60: item['stats']['en60'],
              enw: item['stats']['enw'],
              enw60: item['stats']['enw60'],
              enwen: item['stats']['enwen'],
              enscf: item['stats']['enscf'],
              enscfen: item['stats']['enscfen'],
            });
          });

          this.vstupy_spoluhraci_data = spol_data;

          this.formationsAnalysisService
            .getOpponents(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings_vstupy_protihraci,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                const prot_data = [];

                loaded_data.forEach((item) => {
                  prot_data.push({
                    playerUuid: item['player'],
                    toi: item['stats']['toi'],
                    en: item['stats']['en'],
                    en60: item['stats']['en60'],
                    enw: item['stats']['enw'],
                    enw60: item['stats']['enw60'],
                    enwen: item['stats']['enwen'],
                    enscf: item['stats']['enscf'],
                    enscfen: item['stats']['enscfen'],
                  });
                });

                this.vstupy_protihraci_data = prot_data;

                this.vstupy_data_loaded = true;
                this.vstupy_data_loading = false;
              },
              (err) => {
                alert(
                  'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                );
                // this.defaultService.logout();
              }
            );
        });
    } else if (count_of_players === 1) {
      this.formationsAnalysisService
        .getIndividualStatsTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          undefined
        )
        .subscribe(
          (loaded_data) => {
            // this.vstupy_spoluhraci_data = loaded_data;
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['stats']['toi'],
                en: item['stats']['en'],
                en60: item['stats']['en60'],
                enw: item['stats']['enw'],
                enw60: item['stats']['enw60'],
                enwen: item['stats']['enwen'],
                enscf: item['stats']['enscf'],
                enscfen: item['stats']['enscfen'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                undefined
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];

                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['stats']['toi'],
                      en: item['stats']['en'],
                      en60: item['stats']['en60'],
                      enw: item['stats']['enw'],
                      enw60: item['stats']['enw60'],
                      enwen: item['stats']['enwen'],
                      enscf: item['stats']['enscf'],
                      enscfen: item['stats']['enscfen'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
          }
        );
    } else if (count_of_players > 1) {
      this.formationsAnalysisService
        .getTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci
        )
        .subscribe((loaded_data) => {
          const spol_data = [];
          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              toi: item['stats']['toi'],
              en: item['stats']['en'],
              en60: item['stats']['en60'],
              enw: item['stats']['enw'],
              enw60: item['stats']['enw60'],
              enwen: item['stats']['enwen'],
              enscf: item['stats']['enscf'],
              enscfen: item['stats']['enscfen'],
            });
          });

          this.vstupy_spoluhraci_data = spol_data;

          this.formationsAnalysisService
            .getOpponents(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings_vstupy_protihraci,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                const prot_data = [];

                loaded_data.forEach((item) => {
                  prot_data.push({
                    playerUuid: item['player'],
                    toi: item['stats']['toi'],
                    en: item['stats']['en'],
                    en60: item['stats']['en60'],
                    enw: item['stats']['enw'],
                    enw60: item['stats']['enw60'],
                    enwen: item['stats']['enwen'],
                    enscf: item['stats']['enscf'],
                    enscfen: item['stats']['enscfen'],
                  });
                });

                this.vstupy_protihraci_data = prot_data;

                this.vstupy_data_loaded = true;
                this.vstupy_data_loading = false;
              },
              (err) => {
                alert(
                  'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                );
                // this.defaultService.logout();
              }
            );
        });
    }
  }

  loadAllVstupyDataProti(data: any) {
    // alert("all data");

    let count_of_players = 0;
    this.showDots.forEach((item) => {
      if (item.enabled === true && item.playerUUID !== '') {
        count_of_players = count_of_players + 1;
      }
    });

    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    this.table_settings_vstupy_spoluhraci = [
      { type: 'ena', name: 'ENA', colour: 'green' },
      { type: 'ena60', name: 'ENA/60', colour: 'green' },
      { type: 'enaw', name: 'ENA.W', colour: 'green' },
      { type: 'enaw60', name: 'ENA.W/60', colour: 'green' },
      { type: 'enasca', name: 'ENA→sCA', colour: 'red' },
      { type: 'enascaena', name: 'ENA→sCA/ENA', colour: 'red' },
      { type: 'endn', name: 'EN-DN', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'ena', name: 'ENA', colour: 'green' },
      { type: 'ena60', name: 'ENA/60', colour: 'green' },
      { type: 'enaw', name: 'ENA.W', colour: 'green' },
      { type: 'enaw60', name: 'ENA.W/60', colour: 'green' },
      { type: 'enasca', name: 'ENA→sCA', colour: 'red' },
      { type: 'enascaena', name: 'ENA→sCA/ENA', colour: 'red' },
      { type: 'endn', name: 'EN-DN', colour: 'red' },
    ];

    if (count_of_players === 0) {
      this.formationsAnalysisService
        .getTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci
        )
        .subscribe((loaded_data) => {
          const spol_data = [];
          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              toi: item['stats']['toi'],
              ena: item['stats']['ena'],
              ena60: item['stats']['ena60'],
              enaw: item['stats']['enaw'],
              enaw60: item['stats']['ena60'],
              enasca: item['stats']['enasca'],
              enascaena: item['stats']['enascaena'],
              endn: item['stats']['endn'],
            });
          });

          this.vstupy_spoluhraci_data = spol_data;

          this.formationsAnalysisService
            .getOpponents(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings_vstupy_protihraci,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                const prot_data = [];

                loaded_data.forEach((item) => {
                  prot_data.push({
                    playerUuid: item['player'],
                    toi: item['stats']['toi'],
                    ena: item['stats']['ena'],
                    ena60: item['stats']['ena60'],
                    enaw: item['stats']['enaw'],
                    enaw60: item['stats']['ena60'],
                    enasca: item['stats']['enasca'],
                    enascaena: item['stats']['enascaena'],
                    endn: item['stats']['endn'],
                  });
                });

                this.vstupy_protihraci_data = prot_data;

                this.vstupy_data_loaded = true;
                this.vstupy_data_loading = false;
              },
              (err) => {
                alert(
                  'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                );
                // this.defaultService.logout();
              }
            );
        });
    } else if (count_of_players === 1) {
      this.formationsAnalysisService
        .getIndividualStatsTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          undefined
        )
        .subscribe(
          (loaded_data) => {
            // this.vstupy_spoluhraci_data = loaded_data;
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['stats']['toi'],
                ena: item['stats']['ena'],
                ena60: item['stats']['ena60'],
                enaw: item['stats']['enaw'],
                enaw60: item['stats']['ena60'],
                enasca: item['stats']['enasca'],
                enascaena: item['stats']['enascaena'],
                endn: item['stats']['endn'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                undefined
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];

                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['stats']['toi'],
                      ena: item['stats']['ena'],
                      ena60: item['stats']['ena60'],
                      enaw: item['stats']['enaw'],
                      enaw60: item['stats']['ena60'],
                      enasca: item['stats']['enasca'],
                      enascaena: item['stats']['enascaena'],
                      endn: item['stats']['endn'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
          }
        );
    } else if (count_of_players > 1) {
      this.formationsAnalysisService
        .getTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci
        )
        .subscribe((loaded_data) => {
          const spol_data = [];
          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              toi: item['stats']['toi'],
              ena: item['stats']['ena'],
              ena60: item['stats']['ena60'],
              enaw: item['stats']['enaw'],
              enaw60: item['stats']['ena60'],
              enasca: item['stats']['enasca'],
              enascaena: item['stats']['enascaena'],
              endn: item['stats']['endn'],
            });
          });

          this.vstupy_spoluhraci_data = spol_data;

          this.formationsAnalysisService
            .getOpponents(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings_vstupy_protihraci,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                const prot_data = [];

                loaded_data.forEach((item) => {
                  prot_data.push({
                    playerUuid: item['player'],
                    toi: item['stats']['toi'],
                    ena: item['stats']['ena'],
                    ena60: item['stats']['ena60'],
                    enaw: item['stats']['enaw'],
                    enaw60: item['stats']['ena60'],
                    enasca: item['stats']['enasca'],
                    enascaena: item['stats']['enascaena'],
                    endn: item['stats']['endn'],
                  });
                });

                this.vstupy_protihraci_data = prot_data;

                this.vstupy_data_loaded = true;
                this.vstupy_data_loading = false;
              },
              (err) => {
                alert(
                  'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                );
                // this.defaultService.logout();
              }
            );
        });
    }
  }

  loadVstupyProPlayer(data: any) {
    // alert("loadVstupyProPlayer " + data.player + " " + data.spot + " " + data.matches);
    alert('player');
    this.table_settings_vstupy_spoluhraci = [
      { type: 'en', name: 'EN', colour: 'green' },
      { type: 'en60', name: 'EN/60', colour: 'green' },
      { type: 'enw', name: 'EN.W', colour: ' ' },
      { type: 'enw60', name: 'EN.W/60', colour: 'green' },
      { type: 'enwen', name: 'EN.W/EN', colour: 'green' },
      { type: 'enscf', name: 'EN→sCF', colour: 'green' },
      { type: 'enscfen', name: 'EN→sCF/EN', colour: 'green' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'en', name: 'EN', colour: 'green' },
      { type: 'en60', name: 'EN/60', colour: 'green' },
      { type: 'enw', name: 'EN.W', colour: ' ' },
      { type: 'enw60', name: 'EN.W/60', colour: 'green' },
      { type: 'enwen', name: 'EN.W/EN', colour: 'green' },
      { type: 'enscf', name: 'EN→sCF', colour: 'green' },
      { type: 'enscfen', name: 'EN→sCF/EN', colour: 'green' },
    ];

    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    let count_of_players = 0;

    const formation_list = [];
    this.showDots.forEach((player) => {
      if (player.enabled === true && player.playerUUID !== '') {
        count_of_players = count_of_players + 1;
        formation_list.push({
          player: player.playerUUID,
          on: true,
        });
      }
    });

    if (count_of_players === 1) {
      if (data.spot === 'total') {
        this.formationsAnalysisService
          .getIndividualStatsTeammates(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci,
            data.matches
          )
          .subscribe(
            (loaded_data) => {
              // this.vstupy_spoluhraci_data = loaded_data;
              const spol_data = [];
              loaded_data.forEach((item) => {
                spol_data.push({
                  playerUuid: item['player'],
                  toi: item['stats']['toi'],
                  en: item['stats']['en'],
                  en60: item['stats']['en60'],
                  enw: item['stats']['enw'],
                  enw60: item['stats']['enw60'],
                  enwen: item['stats']['enwen'],
                  enscf: item['stats']['enscf'],
                  enscfen: item['stats']['enscfen'],
                });
              });

              this.vstupy_spoluhraci_data = spol_data;

              this.formationsAnalysisService
                .getOpponents(
                  this.filter_seasonPart,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_countOfPlayer,
                  this.filter_matchState,
                  this.filter_homeAway,
                  this.filter_opponents,
                  this.filter_dateFrom,
                  this.filter_dateTo,
                  this.filter_minutes_from,
                  this.filter_minutes_to,
                  this.filter_minTOI,
                  this.filter_playerId_select1,
                  this.filter_playerId_select2,
                  this.filter_playerId_select3,
                  this.filter_playerId_select4,
                  this.filter_playerId_select5,
                  this.filter_playerId_select6,
                  this.filter_selected_players1,
                  this.filter_selected_players2,
                  this.filter_selected_players3,
                  this.filter_selected_players4,
                  this.filter_selected_players5,
                  this.filter_selected_players6,
                  this.filter_situationType,
                  this.filter_situationTime,
                  this.table_settings_vstupy_protihraci,
                  undefined
                )
                .subscribe(
                  (loaded_data) => {
                    const prot_data = [];

                    loaded_data.forEach((item) => {
                      prot_data.push({
                        playerUuid: item['player'],
                        toi: item['stats']['toi'],
                        en: item['stats']['en'],
                        en60: item['stats']['en60'],
                        enw: item['stats']['enw'],
                        enw60: item['stats']['enw60'],
                        enwen: item['stats']['enwen'],
                        enscf: item['stats']['enscf'],
                        enscfen: item['stats']['enscfen'],
                      });
                    });

                    this.vstupy_protihraci_data = prot_data;

                    this.vstupy_data_loaded = true;
                    this.vstupy_data_loading = false;
                  },
                  (err) => {
                    alert(
                      'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                    );
                  }
                );
            },
            (err) => {
              alert(
                'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
              );
            }
          );
      } else {
        this.formationsAnalysisService
          .getZoneEntryTeammate(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci,
            data.matches,
            data.spot
          )
          .subscribe(
            (loaded_data) => {
              const spol_data = [];

              loaded_data.forEach((item) => {
                spol_data.push({
                  playerUuid: item['player'],
                  toi: item['metrics']['toi'],
                  en: item['metrics']['en'],
                  en60: item['metrics']['en60'],
                  enw: item['metrics']['enw'],
                  enw60: item['metrics']['enw60'],
                  enwen: item['metrics']['enwen'],
                  enscf: item['metrics']['enscf'],
                  enscfen: item['metrics']['enscfen'],
                });
              });

              this.vstupy_spoluhraci_data = spol_data;

              this.formationsAnalysisService
                .getZoneEntryOpponents(
                  this.filter_seasonPart,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_countOfPlayer,
                  this.filter_matchState,
                  this.filter_homeAway,
                  this.filter_opponents,
                  this.filter_dateFrom,
                  this.filter_dateTo,
                  this.filter_minutes_from,
                  this.filter_minutes_to,
                  this.filter_minTOI,
                  this.filter_situationType,
                  this.filter_situationTime,
                  this.table_settings_vstupy_protihraci,
                  data.matches,
                  data.spot
                )
                .subscribe(
                  (loaded_data) => {
                    const prot_data = [];
                    // console.log(JSON.stringify(loaded_data));
                    loaded_data.forEach((item) => {
                      prot_data.push({
                        playerUuid: item['player'],
                        toi: item['metrics']['toi'],
                        en: item['metrics']['en'],
                        en60: item['metrics']['en60'],
                        enw: item['metrics']['enw'],
                        enw60: item['metrics']['enw60'],
                        enwen: item['metrics']['enwen'],
                        enscf: item['metrics']['enscf'],
                        enscfen: item['metrics']['enscfen'],
                      });
                    });

                    this.vstupy_protihraci_data = prot_data;

                    this.vstupy_data_loaded = true;
                    this.vstupy_data_loading = false;
                  },
                  (err) => {
                    alert(
                      'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                    );
                  }
                );
            },
            (err) => {
              alert(
                'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
              );
              // this.defaultService.logout();
            }
          );
      }
    } else if (count_of_players > 1) {
      // alert("je vybraná formace");
      this.formationsAnalysisService
        .getZoneEntryTeammateFormation(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot,
          formation_list
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                en: item['metrics']['en'],
                en60: item['metrics']['en60'],
                enw: item['metrics']['enw'],
                enw60: item['metrics']['enw60'],
                enwen: item['metrics']['enwen'],
                enscf: item['metrics']['enscf'],
                enscfen: item['metrics']['enscfen'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getZoneEntryOpponentsFormation(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                data.matches,
                data.spot,
                formation_list
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      en: item['metrics']['en'],
                      en60: item['metrics']['en60'],
                      enw: item['metrics']['enw'],
                      enw60: item['metrics']['enw60'],
                      enwen: item['metrics']['enwen'],
                      enscf: item['metrics']['enscf'],
                      enscfen: item['metrics']['enscfen'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    } else {
      alert('Neočekávaná situace.');
    }
  }

  loadVstupyProTeam(data: any) {
    // alert("loadVstupyProTeam " + data.spot);
    // alert("tohle se musi vyresit");
    this.table_settings_vstupy_spoluhraci = [
      { type: 'en', name: 'EN', colour: 'green' },
      { type: 'en60', name: 'EN/60', colour: 'green' },
      { type: 'enw', name: 'EN.W', colour: ' ' },
      { type: 'enw60', name: 'EN.W/60', colour: 'green' },
      { type: 'enwen', name: 'EN.W/EN', colour: 'green' },
      { type: 'enscf', name: 'EN→sCF', colour: 'green' },
      { type: 'enscfen', name: 'EN→sCF/EN', colour: 'green' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'en', name: 'EN', colour: 'green' },
      { type: 'en60', name: 'EN/60', colour: 'green' },
      { type: 'enw', name: 'EN.W', colour: ' ' },
      { type: 'enw60', name: 'EN.W/60', colour: 'green' },
      { type: 'enwen', name: 'EN.W/EN', colour: 'green' },
      { type: 'enscf', name: 'EN→sCF', colour: 'green' },
      { type: 'enscfen', name: 'EN→sCF/EN', colour: 'green' },
    ];

    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    if (data.spot === 'total') {
      this.formationsAnalysisService
        .getZoneEntryTeammate(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot
        )
        .subscribe(
          (loaded_data) => {
            // this.vstupy_spoluhraci_data = loaded_data;
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                en: item['metrics']['en'],
                en60: item['metrics']['en60'],
                enw: item['metrics']['enw'],
                enw60: item['metrics']['enw60'],
                enwen: item['metrics']['enwen'],
                enscf: item['metrics']['enscf'],
                enscfen: item['metrics']['enscfen'],
              });
            });
            // console.log(JSON.stringify(spol_data));

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getZoneEntryOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                data.matches,
                data.spot
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      en: item['metrics']['en'],
                      en60: item['metrics']['en60'],
                      enw: item['metrics']['enw'],
                      enw60: item['metrics']['enw60'],
                      enwen: item['metrics']['enwen'],
                      enscf: item['metrics']['enscf'],
                      enscfen: item['metrics']['enscfen'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                  // this.defaultService.logout();
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
          }
        );
    } else {
      this.formationsAnalysisService
        .getZoneEntryTeammate(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];
            // console.log(JSON.stringify(loaded_data));

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                en: item['metrics']['en'],
                en60: item['metrics']['en60'],
                enw: item['metrics']['enw'],
                enw60: item['metrics']['enw60'],
                enwen: item['metrics']['enwen'],
                enscf: item['metrics']['enscf'],
                enscfen: item['metrics']['enscfen'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.vstupy_data_loaded = true;
            this.vstupy_data_loading = false;

            this.formationsAnalysisService
              .getZoneEntryOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                data.matches,
                data.spot
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      en: item['metrics']['en'],
                      en60: item['metrics']['en60'],
                      enw: item['metrics']['enw'],
                      enw60: item['metrics']['enw60'],
                      enwen: item['metrics']['enwen'],
                      enscf: item['metrics']['enscf'],
                      enscfen: item['metrics']['enscfen'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    }
  }

  loadVstupyProtiPlayer(data: any) {
    // alert("tohle se musi vyresit");
    alert('');
    this.table_settings_vstupy_spoluhraci = [
      { type: 'ena', name: 'ENA', colour: 'green' },
      { type: 'ena60', name: 'ENA/60', colour: 'green' },
      { type: 'enaw', name: 'ENA.W', colour: 'green' },
      { type: 'enaw60', name: 'ENA.W/60', colour: 'green' },
      { type: 'enasca', name: 'ENA→sCA', colour: 'red' },
      { type: 'enascaena', name: 'ENA→sCA/ENA', colour: 'red' },
      { type: 'endn', name: 'EN-DN', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'ena', name: 'ENA', colour: 'green' },
      { type: 'ena60', name: 'ENA/60', colour: 'green' },
      { type: 'enaw', name: 'ENA.W', colour: 'green' },
      { type: 'enaw60', name: 'ENA.W/60', colour: 'green' },
      { type: 'enasca', name: 'ENA→sCA', colour: 'red' },
      { type: 'enascaena', name: 'ENA→sCA/ENA', colour: 'red' },
      { type: 'endn', name: 'EN-DN', colour: 'red' },
    ];

    const formation_list = [];
    this.showDots.forEach((player) => {
      if (player.enabled === true && player.playerUUID !== '') {
        formation_list.push({
          player: player.playerUUID,
          on: true,
        });
      }
    });

    // alert("loadVstupyProtiPlayer " + data.player + " " + data.spot);
    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    if (data.spot === 'total') {
      this.formationsAnalysisService
        .getZoneEntryTeammateFormation(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          'total',
          formation_list
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];
            // console.log(JSON.stringify(loaded_data));

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                ena: item['metrics']['ena'],
                ena60: item['metrics']['ena60'],
                enaw: item['metrics']['enaw'],
                enaw60: item['metrics']['ena60'],
                enasca: item['metrics']['enasca'],
                enascaena: item['metrics']['enascaena'],
                endn: item['metrics']['endn'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.vstupy_data_loaded = true;
            this.vstupy_data_loading = false;

            this.formationsAnalysisService
              .getZoneEntryOpponentsFormation(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_spoluhraci,
                data.matches,
                'total',
                formation_list
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      ena: item['metrics']['ena'],
                      ena60: item['metrics']['ena60'],
                      enaw: item['metrics']['enaw'],
                      enaw60: item['metrics']['ena60'],
                      enasca: item['metrics']['enasca'],
                      enascaena: item['metrics']['enascaena'],
                      endn: item['metrics']['endn'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    } else {
      this.formationsAnalysisService
        .getZoneEntryTeammateFormation(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot,
          formation_list
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];
            // console.log(JSON.stringify(loaded_data));

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                ena: item['metrics']['ena'],
                ena60: item['metrics']['ena60'],
                enaw: item['metrics']['enaw'],
                enaw60: item['metrics']['ena60'],
                enasca: item['metrics']['enasca'],
                enascaena: item['metrics']['enascaena'],
                endn: item['metrics']['endn'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.vstupy_data_loaded = true;
            this.vstupy_data_loading = false;

            this.formationsAnalysisService
              .getZoneEntryOpponentsFormation(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_spoluhraci,
                data.matches,
                data.spot,
                formation_list
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      ena: item['metrics']['ena'],
                      ena60: item['metrics']['ena60'],
                      enaw: item['metrics']['enaw'],
                      enaw60: item['metrics']['ena60'],
                      enasca: item['metrics']['enasca'],
                      enascaena: item['metrics']['enascaena'],
                      endn: item['metrics']['endn'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    }
  }

  loadVstupyProtiTeam(data: any) {
    this.table_settings_vstupy_spoluhraci = [
      { type: 'ena', name: 'ENA', colour: 'green' },
      { type: 'ena60', name: 'ENA/60', colour: 'green' },
      { type: 'enaw', name: 'ENA.W', colour: 'green' },
      { type: 'enaw60', name: 'ENA.W/60', colour: 'green' },
      { type: 'enasca', name: 'ENA→sCA', colour: 'red' },
      { type: 'enascaena', name: 'ENA→sCA/ENA', colour: 'red' },
      { type: 'endn', name: 'EN-DN', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'ena', name: 'ENA', colour: 'green' },
      { type: 'ena60', name: 'ENA/60', colour: 'green' },
      { type: 'enaw', name: 'ENA.W', colour: 'green' },
      { type: 'enaw60', name: 'ENA.W/60', colour: 'green' },
      { type: 'enasca', name: 'ENA→sCA', colour: 'red' },
      { type: 'enascaena', name: 'ENA→sCA/ENA', colour: 'red' },
      { type: 'endn', name: 'EN-DN', colour: 'red' },
    ];

    let count_of_players = 0;
    this.showDots.forEach((item) => {
      if (item.enabled === true && item.playerUUID !== '') {
        count_of_players = count_of_players + 1;
      }
    });

    const formation_list = [];
    this.showDots.forEach((player) => {
      if (player.enabled === true && player.playerUUID !== '') {
        count_of_players = count_of_players + 1;
        formation_list.push({
          player: player.playerUUID,
          on: true,
        });
      }
    });

    // alert("loadVstupyProtiTeam " + data.spot);
    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    if (data.spot === 'total') {
      if (count_of_players === 0) {
        this.formationsAnalysisService
          .getTeammates(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_playerId_select1,
            this.filter_playerId_select2,
            this.filter_playerId_select3,
            this.filter_playerId_select4,
            this.filter_playerId_select5,
            this.filter_playerId_select6,
            this.filter_selected_players1,
            this.filter_selected_players2,
            this.filter_selected_players3,
            this.filter_selected_players4,
            this.filter_selected_players5,
            this.filter_selected_players6,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci
          )
          .subscribe((loaded_data) => {
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['stats']['toi'],
                ena: item['stats']['ena'],
                ena60: item['stats']['ena60'],
                enaw: item['stats']['enaw'],
                enaw60: item['stats']['ena60'],
                enasca: item['stats']['enasca'],
                enascaena: item['stats']['enascaena'],
                endn: item['stats']['endn'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                undefined
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];

                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['stats']['toi'],
                      ena: item['stats']['ena'],
                      ena60: item['stats']['ena60'],
                      enaw: item['stats']['enaw'],
                      enaw60: item['stats']['ena60'],
                      enasca: item['stats']['enasca'],
                      enascaena: item['stats']['enascaena'],
                      endn: item['stats']['endn'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                  // this.defaultService.logout();
                }
              );
          });
      } else if (count_of_players === 1) {
        this.formationsAnalysisService
          .getIndividualStatsTeammates(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci,
            undefined
          )
          .subscribe(
            (loaded_data) => {
              // this.vstupy_spoluhraci_data = loaded_data;
              const spol_data = [];
              loaded_data.forEach((item) => {
                spol_data.push({
                  playerUuid: item['player'],
                  toi: item['stats']['toi'],
                  ena: item['stats']['ena'],
                  ena60: item['stats']['ena60'],
                  enaw: item['stats']['enaw'],
                  enaw60: item['stats']['ena60'],
                  enasca: item['stats']['enasca'],
                  enascaena: item['stats']['enascaena'],
                  endn: item['stats']['endn'],
                });
              });

              this.vstupy_spoluhraci_data = spol_data;

              this.formationsAnalysisService
                .getOpponents(
                  this.filter_seasonPart,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_countOfPlayer,
                  this.filter_matchState,
                  this.filter_homeAway,
                  this.filter_opponents,
                  this.filter_dateFrom,
                  this.filter_dateTo,
                  this.filter_minutes_from,
                  this.filter_minutes_to,
                  this.filter_minTOI,
                  this.filter_playerId_select1,
                  this.filter_playerId_select2,
                  this.filter_playerId_select3,
                  this.filter_playerId_select4,
                  this.filter_playerId_select5,
                  this.filter_playerId_select6,
                  this.filter_selected_players1,
                  this.filter_selected_players2,
                  this.filter_selected_players3,
                  this.filter_selected_players4,
                  this.filter_selected_players5,
                  this.filter_selected_players6,
                  this.filter_situationType,
                  this.filter_situationTime,
                  this.table_settings_vstupy_protihraci,
                  undefined
                )
                .subscribe(
                  (loaded_data) => {
                    const prot_data = [];

                    loaded_data.forEach((item) => {
                      prot_data.push({
                        playerUuid: item['player'],
                        toi: item['stats']['toi'],
                        ena: item['stats']['ena'],
                        ena60: item['stats']['ena60'],
                        enaw: item['stats']['enaw'],
                        enaw60: item['stats']['ena60'],
                        enasca: item['stats']['enasca'],
                        enascaena: item['stats']['enascaena'],
                        endn: item['stats']['endn'],
                      });
                    });

                    this.vstupy_protihraci_data = prot_data;

                    this.vstupy_data_loaded = true;
                    this.vstupy_data_loading = false;
                  },
                  (err) => {
                    alert(
                      'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                    );
                  }
                );
            },
            (err) => {
              alert(
                'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
              );
            }
          );
      } else if (count_of_players > 1) {
        this.formationsAnalysisService
          .getTeammates(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_playerId_select1,
            this.filter_playerId_select2,
            this.filter_playerId_select3,
            this.filter_playerId_select4,
            this.filter_playerId_select5,
            this.filter_playerId_select6,
            this.filter_selected_players1,
            this.filter_selected_players2,
            this.filter_selected_players3,
            this.filter_selected_players4,
            this.filter_selected_players5,
            this.filter_selected_players6,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci
          )
          .subscribe((loaded_data) => {
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['stats']['toi'],
                ena: item['stats']['ena'],
                ena60: item['stats']['ena60'],
                enaw: item['stats']['enaw'],
                enaw60: item['stats']['ena60'],
                enasca: item['stats']['enasca'],
                enascaena: item['stats']['enascaena'],
                endn: item['stats']['endn'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                undefined
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];

                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['stats']['toi'],
                      ena: item['stats']['ena'],
                      ena60: item['stats']['ena60'],
                      enaw: item['stats']['enaw'],
                      enaw60: item['stats']['ena60'],
                      enasca: item['stats']['enasca'],
                      enascaena: item['stats']['enascaena'],
                      endn: item['stats']['endn'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                  // this.defaultService.logout();
                }
              );
          });
      }
    } else {
      this.formationsAnalysisService
        .getZoneEntryTeammateFormation(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot,
          formation_list
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                ena: item['metrics']['ena'],
                ena60: item['metrics']['ena60'],
                enaw: item['metrics']['enaw'],
                enaw60: item['metrics']['ena60'],
                enasca: item['metrics']['enasca'],
                enascaena: item['metrics']['enascaena'],
                endn: item['metrics']['endn'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getZoneEntryOpponentsFormation(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                data.matches,
                data.spot,
                formation_list
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      ena: item['metrics']['ena'],
                      ena60: item['metrics']['ena60'],
                      enaw: item['metrics']['enaw'],
                      enaw60: item['metrics']['ena60'],
                      enasca: item['metrics']['enasca'],
                      enascaena: item['metrics']['enascaena'],
                      endn: item['metrics']['endn'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    }
  }

  // vystupy
  loadAllVystupyData(data: any) {
    let count_of_players = 0;
    this.showDots.forEach((item) => {
      if (item.enabled === true && item.playerUUID !== '') {
        count_of_players = count_of_players + 1;
      }
    });

    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    this.table_settings_vstupy_spoluhraci = [
      { type: 'ex', name: 'EX', colour: 'red' },
      { type: 'ex60', name: 'EX/60', colour: 'red' },
      { type: 'exw', name: 'EX.W', colour: 'red' },
      { type: 'exw60', name: 'EX.W/60', colour: 'red' },
      { type: 'exwex', name: 'EX.W/EX', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'ex', name: 'EX', colour: 'red' },
      { type: 'ex60', name: 'EX/60', colour: 'red' },
      { type: 'exw', name: 'EX.W', colour: 'red' },
      { type: 'exw60', name: 'EX.W/60', colour: 'red' },
      { type: 'exwex', name: 'EX.W/EX', colour: 'red' },
    ];

    if (count_of_players === 0) {
      this.formationsAnalysisService
        .getTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci
        )
        .subscribe((loaded_data) => {
          const spol_data = [];

          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              toi: item['stats']['toi'],
              ex: item['stats']['ex'],
              ex60: item['stats']['ex60'],
              exw: item['stats']['exw'],
              exw60: item['stats']['exw60'],
              exwex: item['stats']['exwex'],
            });
          });

          this.vstupy_spoluhraci_data = spol_data;

          this.formationsAnalysisService
            .getOpponents(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings_vstupy_protihraci,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                const prot_data = [];

                loaded_data.forEach((item) => {
                  prot_data.push({
                    playerUuid: item['player'],
                    toi: item['stats']['toi'],
                    ex: item['stats']['ex'],
                    ex60: item['stats']['ex60'],
                    exw: item['stats']['exw'],
                    exw60: item['stats']['exw60'],
                    exwex: item['stats']['exwex'],
                  });
                });

                this.vstupy_protihraci_data = prot_data;

                this.vstupy_data_loaded = true;
                this.vstupy_data_loading = false;
              },
              (err) => {
                alert(
                  'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                );
                // this.defaultService.logout();
              }
            );
        });
    } else if (count_of_players === 1) {
      this.formationsAnalysisService
        .getIndividualStatsTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          undefined
        )
        .subscribe(
          (loaded_data) => {
            // this.vstupy_spoluhraci_data = loaded_data;
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['stats']['toi'],
                ex: item['stats']['ex'],
                ex60: item['stats']['ex60'],
                exw: item['stats']['exw'],
                exw60: item['stats']['exw60'],
                exwex: item['stats']['exwex'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                undefined
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];

                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['stats']['toi'],
                      ex: item['stats']['ex'],
                      ex60: item['stats']['ex60'],
                      exw: item['stats']['exw'],
                      exw60: item['stats']['exw60'],
                      exwex: item['stats']['exwex'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
          }
        );
    } else if (count_of_players > 1) {
      this.formationsAnalysisService
        .getTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci
        )
        .subscribe((loaded_data) => {
          const spol_data = [];
          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              toi: item['stats']['toi'],
              ex: item['stats']['ex'],
              ex60: item['stats']['ex60'],
              exw: item['stats']['exw'],
              exw60: item['stats']['exw60'],
              exwex: item['stats']['exwex'],
            });
          });

          this.vstupy_spoluhraci_data = spol_data;

          this.formationsAnalysisService
            .getOpponents(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings_vstupy_protihraci,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                const prot_data = [];

                loaded_data.forEach((item) => {
                  prot_data.push({
                    playerUuid: item['player'],
                    toi: item['stats']['toi'],
                    ex: item['stats']['ex'],
                    ex60: item['stats']['ex60'],
                    exw: item['stats']['exw'],
                    exw60: item['stats']['exw60'],
                    exwex: item['stats']['exwex'],
                  });
                });

                this.vstupy_protihraci_data = prot_data;

                this.vstupy_data_loaded = true;
                this.vstupy_data_loading = false;
              },
              (err) => {
                alert(
                  'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                );
                // this.defaultService.logout();
              }
            );
        });
    }
  }

  loadAllVystupyDataProti(data: any) {
    // alert("all data");

    let count_of_players = 0;
    this.showDots.forEach((item) => {
      if (item.enabled === true && item.playerUUID !== '') {
        count_of_players = count_of_players + 1;
      }
    });

    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    this.table_settings_vstupy_spoluhraci = [
      { type: 'exa', name: 'EXA', colour: 'red' },
      { type: 'exa60', name: 'EXA/60', colour: 'red' },
      { type: 'exaw', name: 'EXA.W', colour: 'red' },
      { type: 'exaw60', name: 'EXA.W/60', colour: 'red' },
      { type: 'exawexa', name: 'EXA.W/EXA', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'exa', name: 'EXA', colour: 'red' },
      { type: 'exa60', name: 'EXA/60', colour: 'red' },
      { type: 'exaw', name: 'EXA.W', colour: 'red' },
      { type: 'exaw60', name: 'EXA.W/60', colour: 'red' },
      { type: 'exawexa', name: 'EXA.W/EXA', colour: 'red' },
    ];

    if (count_of_players === 0) {
      this.formationsAnalysisService
        .getTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci
        )
        .subscribe((loaded_data) => {
          const spol_data = [];
          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              toi: item['stats']['toi'],
              exa: item['stats']['exa'],
              exa60: item['stats']['exa60'],
              exaw: item['stats']['exaw'],
              exaw60: item['stats']['exa60'],
              exawexa: item['stats']['exawexa'],
            });
          });

          this.vstupy_spoluhraci_data = spol_data;

          this.formationsAnalysisService
            .getOpponents(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings_vstupy_protihraci,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                const prot_data = [];

                loaded_data.forEach((item) => {
                  prot_data.push({
                    playerUuid: item['player'],
                    toi: item['stats']['toi'],
                    exa: item['stats']['exa'],
                    exa60: item['stats']['exa60'],
                    exaw: item['stats']['exaw'],
                    exaw60: item['stats']['exa60'],
                    exawexa: item['stats']['exawexa'],
                  });
                });

                this.vstupy_protihraci_data = prot_data;

                this.vstupy_data_loaded = true;
                this.vstupy_data_loading = false;
              },
              (err) => {
                alert(
                  'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                );
                // this.defaultService.logout();
              }
            );
        });
    } else if (count_of_players === 1) {
      this.formationsAnalysisService
        .getIndividualStatsTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          undefined
        )
        .subscribe(
          (loaded_data) => {
            // this.vstupy_spoluhraci_data = loaded_data;
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['stats']['toi'],
                exa: item['stats']['exa'],
                exa60: item['stats']['exa60'],
                exaw: item['stats']['exaw'],
                exaw60: item['stats']['exa60'],
                exawexa: item['stats']['exawexa'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                undefined
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];

                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['stats']['toi'],
                      exa: item['stats']['exa'],
                      exa60: item['stats']['exa60'],
                      exaw: item['stats']['exaw'],
                      exaw60: item['stats']['exa60'],
                      exawexa: item['stats']['exawexa'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
          }
        );
    } else if (count_of_players > 1) {
      this.formationsAnalysisService
        .getTeammates(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_playerId_select1,
          this.filter_playerId_select2,
          this.filter_playerId_select3,
          this.filter_playerId_select4,
          this.filter_playerId_select5,
          this.filter_playerId_select6,
          this.filter_selected_players1,
          this.filter_selected_players2,
          this.filter_selected_players3,
          this.filter_selected_players4,
          this.filter_selected_players5,
          this.filter_selected_players6,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci
        )
        .subscribe((loaded_data) => {
          const spol_data = [];
          loaded_data.forEach((item) => {
            spol_data.push({
              playerUuid: item['player'],
              toi: item['stats']['toi'],
              exa: item['stats']['exa'],
              exa60: item['stats']['exa60'],
              exaw: item['stats']['exaw'],
              exaw60: item['stats']['exa60'],
              exawexa: item['stats']['exawexa'],
            });
          });

          this.vstupy_spoluhraci_data = spol_data;

          this.formationsAnalysisService
            .getOpponents(
              this.filter_seasonPart,
              this.filter_team,
              this.filter_lastGames,
              this.filter_countOfPlayer,
              this.filter_matchState,
              this.filter_homeAway,
              this.filter_opponents,
              this.filter_dateFrom,
              this.filter_dateTo,
              this.filter_minutes_from,
              this.filter_minutes_to,
              this.filter_minTOI,
              this.filter_playerId_select1,
              this.filter_playerId_select2,
              this.filter_playerId_select3,
              this.filter_playerId_select4,
              this.filter_playerId_select5,
              this.filter_playerId_select6,
              this.filter_selected_players1,
              this.filter_selected_players2,
              this.filter_selected_players3,
              this.filter_selected_players4,
              this.filter_selected_players5,
              this.filter_selected_players6,
              this.filter_situationType,
              this.filter_situationTime,
              this.table_settings_vstupy_protihraci,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                const prot_data = [];

                loaded_data.forEach((item) => {
                  prot_data.push({
                    playerUuid: item['player'],
                    toi: item['stats']['toi'],
                    exa: item['stats']['exa'],
                    exa60: item['stats']['exa60'],
                    exaw: item['stats']['exaw'],
                    exaw60: item['stats']['exa60'],
                    exawexa: item['stats']['exawexa'],
                  });
                });

                this.vstupy_protihraci_data = prot_data;

                this.vstupy_data_loaded = true;
                this.vstupy_data_loading = false;
              },
              (err) => {
                alert(
                  'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                );
                // this.defaultService.logout();
              }
            );
        });
    }
  }

  loadVystupyProPlayer(data: any) {
    // alert("loadVstupyProPlayer " + data.player + " " + data.spot + " " + data.matches);

    this.table_settings_vstupy_spoluhraci = [
      { type: 'ex', name: 'EX', colour: 'red' },
      { type: 'ex60', name: 'EX/60', colour: 'red' },
      { type: 'exw', name: 'EX.W', colour: 'red' },
      { type: 'exw60', name: 'EX.W/60', colour: 'red' },
      { type: 'exwex', name: 'EX.W/EX', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'ex', name: 'EX', colour: 'red' },
      { type: 'ex60', name: 'EX/60', colour: 'red' },
      { type: 'exw', name: 'EX.W', colour: 'red' },
      { type: 'exw60', name: 'EX.W/60', colour: 'red' },
      { type: 'exwex', name: 'EX.W/EX', colour: 'red' },
    ];

    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    let count_of_players = 0;

    const formation_list = [];
    this.showDots.forEach((player) => {
      if (player.enabled === true && player.playerUUID !== '') {
        count_of_players = count_of_players + 1;
        formation_list.push({
          player: player.playerUUID,
          on: true,
        });
      }
    });

    if (count_of_players === 1) {
      if (data.spot === 'total') {
        this.formationsAnalysisService
          .getIndividualStatsTeammates(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci,
            data.matches
          )
          .subscribe(
            (loaded_data) => {
              // this.vstupy_spoluhraci_data = loaded_data;
              const spol_data = [];
              loaded_data.forEach((item) => {
                spol_data.push({
                  playerUuid: item['player'],
                  toi: item['stats']['toi'],
                  ex: item['stats']['ex'],
                  ex60: item['stats']['ex60'],
                  exw: item['stats']['exw'],
                  exw60: item['stats']['exw60'],
                  exwex: item['stats']['exwex'],
                });
              });

              this.vstupy_spoluhraci_data = spol_data;

              this.formationsAnalysisService
                .getOpponents(
                  this.filter_seasonPart,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_countOfPlayer,
                  this.filter_matchState,
                  this.filter_homeAway,
                  this.filter_opponents,
                  this.filter_dateFrom,
                  this.filter_dateTo,
                  this.filter_minutes_from,
                  this.filter_minutes_to,
                  this.filter_minTOI,
                  this.filter_playerId_select1,
                  this.filter_playerId_select2,
                  this.filter_playerId_select3,
                  this.filter_playerId_select4,
                  this.filter_playerId_select5,
                  this.filter_playerId_select6,
                  this.filter_selected_players1,
                  this.filter_selected_players2,
                  this.filter_selected_players3,
                  this.filter_selected_players4,
                  this.filter_selected_players5,
                  this.filter_selected_players6,
                  this.filter_situationType,
                  this.filter_situationTime,
                  this.table_settings_vstupy_protihraci,
                  undefined
                )
                .subscribe(
                  (loaded_data) => {
                    const prot_data = [];

                    loaded_data.forEach((item) => {
                      prot_data.push({
                        playerUuid: item['player'],
                        toi: item['stats']['toi'],
                        ex: item['stats']['ex'],
                        ex60: item['stats']['ex60'],
                        exw: item['stats']['exw'],
                        exw60: item['stats']['exw60'],
                        exwex: item['stats']['exwex'],
                      });
                    });

                    this.vstupy_protihraci_data = prot_data;

                    this.vstupy_data_loaded = true;
                    this.vstupy_data_loading = false;
                  },
                  (err) => {
                    alert(
                      'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                    );
                  }
                );
            },
            (err) => {
              alert(
                'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
              );
            }
          );
      } else {
        this.formationsAnalysisService
          .getZoneExitsTeammate(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci,
            data.matches,
            data.spot
          )
          .subscribe(
            (loaded_data) => {
              const spol_data = [];

              loaded_data.forEach((item) => {
                spol_data.push({
                  playerUuid: item['player'],
                  toi: item['metrics']['toi'],
                  ex: item['metrics']['ex'],
                  ex60: item['metrics']['ex60'],
                  exw: item['metrics']['exw'],
                  exw60: item['metrics']['exw60'],
                  exwex: item['metrics']['exwex'],
                });
              });

              this.vstupy_spoluhraci_data = spol_data;

              this.formationsAnalysisService
                .getZoneExitsOpponents(
                  this.filter_seasonPart,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_countOfPlayer,
                  this.filter_matchState,
                  this.filter_homeAway,
                  this.filter_opponents,
                  this.filter_dateFrom,
                  this.filter_dateTo,
                  this.filter_minutes_from,
                  this.filter_minutes_to,
                  this.filter_minTOI,
                  this.filter_situationType,
                  this.filter_situationTime,
                  this.table_settings_vstupy_protihraci,
                  data.matches,
                  data.spot
                )
                .subscribe(
                  (loaded_data) => {
                    const prot_data = [];
                    // console.log(JSON.stringify(loaded_data));
                    loaded_data.forEach((item) => {
                      prot_data.push({
                        playerUuid: item['player'],
                        toi: item['metrics']['toi'],
                        ex: item['metrics']['ex'],
                        ex60: item['metrics']['ex60'],
                        exw: item['metrics']['exw'],
                        exw60: item['metrics']['exw60'],
                        exwex: item['metrics']['exwex'],
                      });
                    });

                    this.vstupy_protihraci_data = prot_data;

                    this.vstupy_data_loaded = true;
                    this.vstupy_data_loading = false;
                  },
                  (err) => {
                    alert(
                      'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                    );
                  }
                );
            },
            (err) => {
              alert(
                'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
              );
              // this.defaultService.logout();
            }
          );
      }
    } else if (count_of_players > 1) {
      // alert("je vybraná formace");
      this.formationsAnalysisService
        .getZoneExitsTeammateFormation(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot,
          formation_list
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                ex: item['metrics']['ex'],
                ex60: item['metrics']['ex60'],
                exw: item['metrics']['exw'],
                exw60: item['metrics']['exw60'],
                exwex: item['metrics']['exwex'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getZoneExitsOpponentsFormation(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                data.matches,
                data.spot,
                formation_list
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      ex: item['metrics']['ex'],
                      ex60: item['metrics']['ex60'],
                      exw: item['metrics']['exw'],
                      exw60: item['metrics']['exw60'],
                      exwex: item['metrics']['exwex'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    } else {
      alert('Neočekávaná situace.');
    }
  }

  loadVystupyProTeam(data: any) {
    // alert("loadVstupyProTeam " + data.spot);
    // alert("tohle se musi vyresit");
    this.table_settings_vstupy_spoluhraci = [
      { type: 'ex', name: 'EX', colour: 'red' },
      { type: 'ex60', name: 'EX/60', colour: 'red' },
      { type: 'exw', name: 'EX.W', colour: 'red' },
      { type: 'exw60', name: 'EX.W/60', colour: 'red' },
      { type: 'exwex', name: 'EX.W/EX', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'ex', name: 'EX', colour: 'red' },
      { type: 'ex60', name: 'EX/60', colour: 'red' },
      { type: 'exw', name: 'EX.W', colour: 'red' },
      { type: 'exw60', name: 'EX.W/60', colour: 'red' },
      { type: 'exwex', name: 'EX.W/EX', colour: 'red' },
    ];

    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    if (data.spot === 'total') {
      this.formationsAnalysisService
        .getZoneExitsTeammate(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot
        )
        .subscribe(
          (loaded_data) => {
            // this.vstupy_spoluhraci_data = loaded_data;
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                ex: item['metrics']['ex'],
                ex60: item['metrics']['ex60'],
                exw: item['metrics']['exw'],
                exw60: item['metrics']['exw60'],
                exwex: item['metrics']['exwex'],
              });
            });
            // console.log(JSON.stringify(spol_data));

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getZoneExitsOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                data.matches,
                data.spot
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      ex: item['metrics']['ex'],
                      ex60: item['metrics']['ex60'],
                      exw: item['metrics']['exw'],
                      exw60: item['metrics']['exw60'],
                      exwex: item['metrics']['exwex'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                  // this.defaultService.logout();
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
          }
        );
    } else {
      this.formationsAnalysisService
        .getZoneExitsTeammate(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];
            // console.log(JSON.stringify(loaded_data));

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                ex: item['metrics']['ex'],
                ex60: item['metrics']['ex60'],
                exw: item['metrics']['exw'],
                exw60: item['metrics']['exw60'],
                exwex: item['metrics']['exwex'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.vstupy_data_loaded = true;
            this.vstupy_data_loading = false;

            this.formationsAnalysisService
              .getZoneExitsOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                data.matches,
                data.spot
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      ex: item['metrics']['ex'],
                      ex60: item['metrics']['ex60'],
                      exw: item['metrics']['exw'],
                      exw60: item['metrics']['exw60'],
                      exwex: item['metrics']['exwex'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    }
  }

  loadVystupyProtiPlayer(data: any) {
    // alert("tohle se musi vyresit");

    this.table_settings_vstupy_spoluhraci = [
      { type: 'exa', name: 'EXA', colour: 'red' },
      { type: 'exa60', name: 'EXA/60', colour: 'red' },
      { type: 'exaw', name: 'EXA.W', colour: 'red' },
      { type: 'exaw60', name: 'EXA.W/60', colour: 'red' },
      { type: 'exawexa', name: 'EXA.W/EXA', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'exa', name: 'EXA', colour: 'red' },
      { type: 'exa60', name: 'EXA/60', colour: 'red' },
      { type: 'exaw', name: 'EXA.W', colour: 'red' },
      { type: 'exaw60', name: 'EXA.W/60', colour: 'red' },
      { type: 'exawexa', name: 'EXA.W/EXA', colour: 'red' },
    ];

    const formation_list = [];
    this.showDots.forEach((player) => {
      if (player.enabled === true && player.playerUUID !== '') {
        formation_list.push({
          player: player.playerUUID,
          on: true,
        });
      }
    });

    // alert("loadVstupyProtiPlayer " + data.player + " " + data.spot);
    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    if (data.spot === 'total') {
      this.formationsAnalysisService
        .getZoneExitsTeammateFormation(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          'total',
          formation_list
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];
            // console.log(JSON.stringify(loaded_data));

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                exa: item['metrics']['exa'],
                exa60: item['metrics']['exa60'],
                exaw: item['metrics']['exaw'],
                exaw60: item['metrics']['exaw60'],
                exawexa: item['metrics']['exawexa'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.vstupy_data_loaded = true;
            this.vstupy_data_loading = false;

            this.formationsAnalysisService
              .getZoneExitsOpponentsFormation(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_spoluhraci,
                data.matches,
                'total',
                formation_list
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      exa: item['metrics']['exa'],
                      exa60: item['metrics']['exa60'],
                      exaw: item['metrics']['exaw'],
                      exaw60: item['metrics']['exaw60'],
                      exawexa: item['metrics']['exawexa'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    } else {
      this.formationsAnalysisService
        .getZoneExitsTeammateFormation(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot,
          formation_list
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];
            // console.log(JSON.stringify(loaded_data));

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                exa: item['metrics']['exa'],
                exa60: item['metrics']['exa60'],
                exaw: item['metrics']['exaw'],
                exaw60: item['metrics']['exaw60'],
                exawexa: item['metrics']['exawexa'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.vstupy_data_loaded = true;
            this.vstupy_data_loading = false;

            this.formationsAnalysisService
              .getZoneExitsOpponentsFormation(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_spoluhraci,
                data.matches,
                data.spot,
                formation_list
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      exa: item['metrics']['exa'],
                      exa60: item['metrics']['exa60'],
                      exaw: item['metrics']['exaw'],
                      exaw60: item['metrics']['exaw60'],
                      exawexa: item['metrics']['exawexa'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    }
  }

  loadVystupyProtiTeam(data: any) {
    this.table_settings_vstupy_spoluhraci = [
      { type: 'exa', name: 'EXA', colour: 'red' },
      { type: 'exa60', name: 'EXA/60', colour: 'red' },
      { type: 'exaw', name: 'EXA.W', colour: 'red' },
      { type: 'exaw60', name: 'EXA.W/60', colour: 'red' },
      { type: 'exawexa', name: 'EXA.W/EXA', colour: 'red' },
    ];

    this.table_settings_vstupy_protihraci = [
      { type: 'exa', name: 'EXA', colour: 'red' },
      { type: 'exa60', name: 'EXA/60', colour: 'red' },
      { type: 'exaw', name: 'EXA.W', colour: 'red' },
      { type: 'exaw60', name: 'EXA.W/60', colour: 'red' },
      { type: 'exawexa', name: 'EXA.W/EXA', colour: 'red' },
    ];

    let count_of_players = 0;
    this.showDots.forEach((item) => {
      if (item.enabled === true && item.playerUUID !== '') {
        count_of_players = count_of_players + 1;
      }
    });

    const formation_list = [];
    this.showDots.forEach((player) => {
      if (player.enabled === true && player.playerUUID !== '') {
        count_of_players = count_of_players + 1;
        formation_list.push({
          player: player.playerUUID,
          on: true,
        });
      }
    });

    // alert("loadVstupyProtiTeam " + data.spot);
    this.vstupy_data_loaded = false;
    this.vstupy_data_loading = true;

    if (data.spot === 'total') {
      if (count_of_players === 0) {
        this.formationsAnalysisService
          .getTeammates(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_playerId_select1,
            this.filter_playerId_select2,
            this.filter_playerId_select3,
            this.filter_playerId_select4,
            this.filter_playerId_select5,
            this.filter_playerId_select6,
            this.filter_selected_players1,
            this.filter_selected_players2,
            this.filter_selected_players3,
            this.filter_selected_players4,
            this.filter_selected_players5,
            this.filter_selected_players6,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci
          )
          .subscribe((loaded_data) => {
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['stats']['toi'],
                exa: item['stats']['exa'],
                exa60: item['stats']['exa60'],
                exaw: item['stats']['exaw'],
                exaw60: item['stats']['exa60'],
                exawexa: item['stats']['exawexa'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                undefined
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];

                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['stats']['toi'],
                      exa: item['stats']['exa'],
                      exa60: item['stats']['exa60'],
                      exaw: item['stats']['exaw'],
                      exaw60: item['stats']['exa60'],
                      exawexa: item['stats']['exawexa'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                  // this.defaultService.logout();
                }
              );
          });
      } else if (count_of_players === 1) {
        this.formationsAnalysisService
          .getIndividualStatsTeammates(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci,
            undefined
          )
          .subscribe(
            (loaded_data) => {
              // this.vstupy_spoluhraci_data = loaded_data;
              const spol_data = [];
              loaded_data.forEach((item) => {
                spol_data.push({
                  playerUuid: item['player'],
                  toi: item['stats']['toi'],
                  exa: item['stats']['exa'],
                  exa60: item['stats']['exa60'],
                  exaw: item['stats']['exaw'],
                  exaw60: item['stats']['exa60'],
                  exawexa: item['stats']['exawexa'],
                });
              });

              this.vstupy_spoluhraci_data = spol_data;

              this.formationsAnalysisService
                .getOpponents(
                  this.filter_seasonPart,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_countOfPlayer,
                  this.filter_matchState,
                  this.filter_homeAway,
                  this.filter_opponents,
                  this.filter_dateFrom,
                  this.filter_dateTo,
                  this.filter_minutes_from,
                  this.filter_minutes_to,
                  this.filter_minTOI,
                  this.filter_playerId_select1,
                  this.filter_playerId_select2,
                  this.filter_playerId_select3,
                  this.filter_playerId_select4,
                  this.filter_playerId_select5,
                  this.filter_playerId_select6,
                  this.filter_selected_players1,
                  this.filter_selected_players2,
                  this.filter_selected_players3,
                  this.filter_selected_players4,
                  this.filter_selected_players5,
                  this.filter_selected_players6,
                  this.filter_situationType,
                  this.filter_situationTime,
                  this.table_settings_vstupy_protihraci,
                  undefined
                )
                .subscribe(
                  (loaded_data) => {
                    const prot_data = [];

                    loaded_data.forEach((item) => {
                      prot_data.push({
                        playerUuid: item['player'],
                        toi: item['stats']['toi'],
                        exa: item['stats']['exa'],
                        exa60: item['stats']['exa60'],
                        exaw: item['stats']['exaw'],
                        exaw60: item['stats']['exa60'],
                        exawexa: item['stats']['exawexa'],
                      });
                    });

                    this.vstupy_protihraci_data = prot_data;

                    this.vstupy_data_loaded = true;
                    this.vstupy_data_loading = false;
                  },
                  (err) => {
                    alert(
                      'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                    );
                  }
                );
            },
            (err) => {
              alert(
                'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
              );
            }
          );
      } else if (count_of_players > 1) {
        this.formationsAnalysisService
          .getTeammates(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_lastGames,
            this.filter_countOfPlayer,
            this.filter_matchState,
            this.filter_homeAway,
            this.filter_opponents,
            this.filter_dateFrom,
            this.filter_dateTo,
            this.filter_minutes_from,
            this.filter_minutes_to,
            this.filter_minTOI,
            this.filter_playerId_select1,
            this.filter_playerId_select2,
            this.filter_playerId_select3,
            this.filter_playerId_select4,
            this.filter_playerId_select5,
            this.filter_playerId_select6,
            this.filter_selected_players1,
            this.filter_selected_players2,
            this.filter_selected_players3,
            this.filter_selected_players4,
            this.filter_selected_players5,
            this.filter_selected_players6,
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings_vstupy_spoluhraci
          )
          .subscribe((loaded_data) => {
            const spol_data = [];
            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['stats']['toi'],
                exa: item['stats']['exa'],
                exa60: item['stats']['exa60'],
                exaw: item['stats']['exaw'],
                exaw60: item['stats']['exa60'],
                exawexa: item['stats']['exawexa'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getOpponents(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_playerId_select1,
                this.filter_playerId_select2,
                this.filter_playerId_select3,
                this.filter_playerId_select4,
                this.filter_playerId_select5,
                this.filter_playerId_select6,
                this.filter_selected_players1,
                this.filter_selected_players2,
                this.filter_selected_players3,
                this.filter_selected_players4,
                this.filter_selected_players5,
                this.filter_selected_players6,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                undefined
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];

                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['stats']['toi'],
                      exa: item['stats']['exa'],
                      exa60: item['stats']['exa60'],
                      exaw: item['stats']['exaw'],
                      exaw60: item['stats']['exa60'],
                      exawexa: item['stats']['exawexa'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                  // this.defaultService.logout();
                }
              );
          });
      }
    } else {
      this.formationsAnalysisService
        .getZoneExitsTeammateFormation(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_minTOI,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_vstupy_spoluhraci,
          data.matches,
          data.spot,
          formation_list
        )
        .subscribe(
          (loaded_data) => {
            const spol_data = [];

            loaded_data.forEach((item) => {
              spol_data.push({
                playerUuid: item['player'],
                toi: item['metrics']['toi'],
                exa: item['metrics']['exa'],
                exa60: item['metrics']['exa60'],
                exaw: item['metrics']['exaw'],
                exaw60: item['metrics']['exa60'],
                exawexa: item['metrics']['exawexa'],
              });
            });

            this.vstupy_spoluhraci_data = spol_data;

            this.formationsAnalysisService
              .getZoneExitsOpponentsFormation(
                this.filter_seasonPart,
                this.filter_team,
                this.filter_lastGames,
                this.filter_countOfPlayer,
                this.filter_matchState,
                this.filter_homeAway,
                this.filter_opponents,
                this.filter_dateFrom,
                this.filter_dateTo,
                this.filter_minutes_from,
                this.filter_minutes_to,
                this.filter_minTOI,
                this.filter_situationType,
                this.filter_situationTime,
                this.table_settings_vstupy_protihraci,
                data.matches,
                data.spot,
                formation_list
              )
              .subscribe(
                (loaded_data) => {
                  const prot_data = [];
                  // console.log(JSON.stringify(loaded_data));
                  loaded_data.forEach((item) => {
                    prot_data.push({
                      playerUuid: item['player'],
                      toi: item['metrics']['toi'],
                      exa: item['metrics']['exa'],
                      exa60: item['metrics']['exa60'],
                      exaw: item['metrics']['exaw'],
                      exaw60: item['metrics']['exa60'],
                      exawexa: item['metrics']['exawexa'],
                    });
                  });

                  this.vstupy_protihraci_data = prot_data;

                  this.vstupy_data_loaded = true;
                  this.vstupy_data_loading = false;
                },
                (err) => {
                  alert(
                    'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
                  );
                }
              );
          },
          (err) => {
            alert(
              'Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.'
            );
            // this.defaultService.logout();
          }
        );
    }
  }

  exportShotmap() {
    /* this.exporting_png = true; */
    this.closeVideo();
    html2canvas(document.querySelector('.download')).then((canvas) => {
      // this.exportpng.nativeElement.appendChild(canvas);
      canvas.toBlob((blob) => {
        saveAs(blob, 'export.png');
      });
      /* this.exporting_png = false; */
    });
  }

  // TRACKING
  trackOpenPage() {
    const logged_user = JSON.parse(localStorage.getItem('logged_user'));
    this.defaultService
      .addEvent(
        logged_user[0].id,
        logged_user[0].user,
        'Byla otevřena obrazovka analyzér.',
        2
      )
      .subscribe((loaded_data) => {});
  }

  checkLanguage() {
    const lang = localStorage.getItem('language');
    return(lang === 'cz');
  }
}
