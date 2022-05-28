import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  isDevMode,
  NgZone,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  Output,
  EventEmitter,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChartOptions } from 'chart.js';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { Color, Label } from 'ng2-charts';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { DefaultService } from '../../services/default/default.service';
import { FormatParametersService } from '../../services/format-parameters/format-parameters.service';
import { GamelogService } from '../../services/gamelog/gamelog.service';
// import * as _ from "lodash";
import { IndividualStatsService } from '../../services/individual-stats/individual-stats.service';
import { TrendService } from '../../services/trend/trend.service';
import { GamesService } from '../../services/games/games.service';
import { NavComponent } from '../../components/nav/nav.component';
import { ZonyBrankyComponent } from '../../components/zony-branky/zony-branky.component';
import { cloneDeep } from 'lodash';
import { timeout } from 'rxjs-compat/operator/timeout';

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
  selector: 'goalkeepers',
  templateUrl: './goalkeepers.component.html',
  styleUrls: ['./goalkeepers.component.scss'],
  providers: [
    IndividualStatsService,
    DefaultService,
    TranslatePipe,
    GamelogService,
    TrendService,
    GamesService,
  ],
})
export class GoalkeepersComponent implements OnInit {
  @ViewChild('help') private help: NavComponent;
  @ViewChild('scroll') private scrollContainer: ElementRef;
  @ViewChildren('gatezone') gatezone: QueryList<ZonyBrankyComponent>;

  canscrollprev = false;
  canscrollnext = true;
  games_scroll = 0;
  // filters
  filter_season: any = [];
  filter_seasonPart = '';
  filter_team = 'ALL';
  filter_countOfPlayer = '5:5';
  filter_minTOI: number;
  filter_lastGames: number;
  filter_dateFrom: string;
  filter_dateTo: string;
  readonly HOME_AWAY = ['home', 'away'];
  filter_homeAway = '';
  filter_matchState = '';
  filter_minutes_from: number;
  filter_minutes_to: number;
  filter_opponent = '';
  filter_opponents: any = [];
  filter_born_from: number;
  filter_born_to: number;
  filter_posts = 'ALL';
  filter_situationType = '';
  filter_situationTime: number;
  filter_graph_attribute = 'ga60';
  filter_vyber_dat_dle = true;

  filterby = 'toi';
  filterby2 = 'toi';

  defined_datasest: any = [];

  selected_daterange: any;

  shoda_sortby = 'toi';
  shodaSort_value = 'desc';

  toi: any = [];
  gameslist: any = [];

  trend_limits: any[] = [
    { date_from: '', date_to: '', match_from: null, match_to: null },
  ];
  trend_date_from: any = [
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
    '',
    '',
    '',
    '',
    '',
    '',
  ];
  trend_date_to: any = [
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
    '',
    '',
    '',
    '',
    '',
    '',
  ];

  trend_match_from: any = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  trend_match_to: any = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  selected_attributes_string: any;

  more_filters = false;

  tab = '';
  prew_tab = '';
  tab_small_viz = 'gatezones';

  team_list_filter: any = [];

  teams_list: any[];
  matches_list: any = [];

  table_settings_selected: any = [];

  dataLoaded: boolean;
  loading: boolean;

  filter_dataSet = 'ALL';

  seasons_select_list = [];
  dropdownSettings = {};
  seasons_list: any[];

  page = 'goalkeepers';

  competitions_list: any = [];

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

  public lineChartLabels: Label[] = [];
  public lineChartData: Array<any> = [];
  public lineChartColors: Color[] = [];
  public lineChartOptions: ChartOptions = {};

  @ViewChild('lol') private lol: ElementRef;
  @ViewChild('chart') private chart: ElementRef;

  showTrend = false;
  show_canvas_tooltip = false;
  canvas_tooltip_left = 0;
  canvas_tooltip_top = 0;
  tooltip_value = '';
  tooltip_date = '';
  tooltip_match = '';
  dropdownSettings2 = {};

  filter_metricFilter = '';
  filter_metricFilter_value: number;

  toggle_table_settings = false;

  team_or_all_players = false;

  table_settings: any[] = [
    {
      name: 'GA/60',
      type: 'ga60',
      colour: 'white',
      eng: 'Goals Against per 60',
      desc: 'Obdržené góly za 60 minut',
      data: '60',
      onIce: false,
      origin: 'ga60',
      types: [],
    },
    {
      name: 'xGA/60',
      type: 'xga60',
      colour: 'white',
      eng: 'Expected Goals Against per 60',
      desc: 'Očekávané obdržené góly za 60 minut',
      data: '60',
      onIce: false,
      origin: 'xga60',
      types: [],
    },
    {
      name: 'Sv%',
      type: 'sv_percent',
      colour: 'white',
      eng: 'Save Percentage',
      desc: 'Úspěšnost zákroků',
      data: 'percent',
      onIce: false,
      origin: 'sv_percent',
      types: [],
    },
    {
      name: 'SOGA/60',
      type: 'soga60',
      colour: 'white',
      eng: 'Shots On Goal Against per 60',
      desc: 'Střely na branku za 60 minut',
      data: '60',
      onIce: false,
      origin: 'soga60',
      types: [],
    },
    {
      name: 'GSAA',
      type: 'gsaa',
      colour: 'white',
      eng: 'Goals Saved Above Average',
      desc: 'Počet gólů, kterým brankář zabránil v porovnání s průměrem ligy',
      data: 'count',
      onIce: false,
      origin: 'gsaa',
      types: [],
    },
    {
      name: 'GA - xGA',
      type: 'gaxga',
      colour: 'white',
      eng: 'Goals Against vs. Expected Goals Against',
      desc: 'Rozdíl obdržených gólů a obdržených očekávaných gólů',
      data: 'count',
      onIce: false,
      origin: 'gaxga',
      types: [],
    },
    {
      name: 'sSv%',
      type: 'ssv_percent',
      colour: 'white',
      eng: '% of Slot Shots On Goal Saved',
      desc: 'Úspěšnost zákroků ze střel ze slotu',
      data: 'percent',
      onIce: false,
      origin: 'ssv_percent',
      types: [],
    },
    {
      name: '1T.Sv%',
      type: '1t.sv_percent',
      colour: 'white',
      eng: '% of One-Timers Saved',
      desc: 'Úspěšnost zákroků ze střel z první',
      data: 'percent',
      onIce: false,
      origin: '1t.sv_percent',
      types: [],
    },
  ];
  table_settings_gamelog: any[] = [
    {
      name: 'GA',
      type: 'ga',
      colour: 'white',
      eng: 'Goals Against',
      desc: 'Obdržené góly',
      data: 'count',
      onIce: false,
      origin: 'ga',
      types: [],
    },
    {
      name: 'xGA',
      type: 'xga',
      colour: 'white',
      eng: 'Expected Goals Against',
      desc: 'Očekávané obdržené góly',
      data: 'count',
      onIce: false,
      origin: 'xga',
      types: [],
    },
    {
      name: 'Sv%',
      type: 'sv_percent',
      colour: 'white',
      eng: 'Save Percentage',
      desc: 'Úspěšnost zákroků',
      data: 'percent',
      onIce: false,
      origin: 'sv_percent',
      types: [],
    },
    {
      name: 'SOGA',
      type: 'soga',
      colour: 'white',
      eng: 'Shots On Goal Against',
      desc: 'Střely na branku',
      data: 'count',
      onIce: false,
      origin: 'soga',
      types: [],
    },
    {
      name: 'GSAA',
      type: 'gsaa',
      colour: 'white',
      eng: 'Goals Saved Above Average',
      desc: 'Počet gólů, kterým brankář zabránil v porovnání s průměrem ligy',
      data: 'count',
      onIce: false,
      origin: 'gsaa',
      types: [],
    },
    {
      name: 'sSv%',
      type: 'ssv_percent',
      colour: 'white',
      eng: '% of Slot Shots On Goal Saved',
      desc: 'Úspěšnost zákroků ze střel ze slotu',
      data: 'percent',
      onIce: false,
      origin: 'ssv_percent',
      types: [],
    },
    {
      name: '1T.Sv%',
      type: '1t.sv_percent',
      colour: 'white',
      eng: '% of One-Timers Saved',
      desc: 'Úspěšnost zákroků ze střel z první',
      data: 'percent',
      onIce: false,
      origin: '1t.sv_percent',
      types: [],
    },
  ];

  table_settings_gamelog_default: any[] = [];
  table_settings_default: any[] = [];

  data: any = [];
  data_gamelog: any = [];
  data_csv: any = [];
  dataSets: any = [];

  average_compare = 'competition';
  averages_data: any = [];

  selected_teams: any = [];

  average_compare_zony = 'competition';
  show_skala_zony = false;
  averages_loaded = false;

  show_skala = false;

  shades: any = {
    0: '#d3382e',
    10: '#ea524e',
    20: '#f0979a',
    30: '#f6cdd2',
    40: '#fbebed',
    50: '#e4f2fd',
    60: '#bbdefa',
    70: '#91cbf9',
    80: '#3196f0',
    90: '#1363c5',
  };

  show_gatezones = true;

  data_relativeToCompetition: any = [];
  data_relativeToTeam: any = [];

  list_order = 0;
  skala_loading = false;

  skala_loading_zony = true;

  canvas_type = 'goalkeepers';

  boolProd = true;

  count_of_zony_branky: any[] = ['row'];

  data_averages: any = [];

  filter_team2 = 'ALL';
  players_list: any = [];
  filter_goalkeeper = '';

  loading_shotmap = false;
  loaded_shotmap = false;

  shotmap_invert = true;

  shots: any = [];

  show_video_player = false;

  videos_data: any = [];
  showDots: any = [];

  constructor(
    private gamesService: GamesService,
    private cd: ChangeDetectorRef,
    private formatParametersService: FormatParametersService,
    private translate: TranslatePipe,
    private trendService: TrendService,
    private gamelogService: GamelogService,
    private individualStatsService: IndividualStatsService,
    private defaultService: DefaultService,
    private zone: NgZone,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }

    this.dropdownSettings = {
      singleSelection: false,
      text: 'Vybrat sezonu',
      selectAllText: 'Vybrat vše',
      unSelectAllText: 'Odebrat vše',
      enableSearchFilter: false,
      classes: 'multiselect',
    };

    const loaded_datasest = JSON.parse(localStorage.getItem('defined_sets'));
    loaded_datasest['goalkeepers'].forEach((element, index) => {
      const sets = {
        name: Object.keys(element)[0],
        data: [],
        id: index,
      };
      for (const key in element) {
        element[key].forEach((element2) => {
          sets.data.push(element2.type);
        });
      }
      this.defined_datasest.push(sets);
    });

    this.table_settings_gamelog_default = cloneDeep(
      this.table_settings_gamelog
    );
    this.table_settings_default = cloneDeep(this.table_settings);

    this.dataLoaded = false;
    this.loading = false;

    if (localStorage.language === 'cz') {
      this.dropdownSettings = {
        singleSelection: false,
        text: 'Vybrat sezonu',
        selectAllText: 'Vybrat vše',
        unSelectAllText: 'Odebrat vše',
        enableSearchFilter: false,
        classes: 'multiselect',
      };

      this.dropdownSettings2 = {
        singleSelection: false,
        text: 'Všechny týmy',
        selectAllText: 'Vybrat vše',
        unSelectAllText: 'Odebrat vše',
        enableSearchFilter: false,
        classes: 'multiselect',
      };
    } else if (localStorage.language === 'en') {
      this.dropdownSettings = {
        singleSelection: false,
        text: 'Select season',
        selectAllText: 'Select all',
        unSelectAllText: 'Remove all',
        enableSearchFilter: false,
        classes: 'multiselect',
      };

      this.dropdownSettings2 = {
        singleSelection: false,
        text: 'All teams',
        selectAllText: 'Select all',
        unSelectAllText: 'Remove all',
        enableSearchFilter: false,
        classes: 'multiselect',
      };
    }
  }

  ngOnInit() {
    this.defaultService
      .getAttributesUserList(
        JSON.parse(localStorage.getItem('logged_user'))[0]['id']
      )
      .subscribe(
        (loaded_data) => {
          this.dataSets = loaded_data;
          this.defined_datasest.forEach((element) => {
            this.dataSets.push(element);
          });
        },
        (err) => {}
      );

    this.getCompetitions();
    this.checkExistParameter();
    this.trackOpenPage();
    this.active_skala_zony();
  }

  fastTest(name: string, tested: any) {
    console.log(name, tested);
    return tested.name;
  }

  getPlayerList() {
    this.players_list = [];
    this.filter_goalkeeper = '';

    const uuids = this.filter_seasonPart.split(',');
    uuids.forEach((item) => {
      const competition_details = JSON.parse(
        localStorage.getItem('competition_details')
      );
      competition_details.forEach((loaded_data) => {
        if (typeof loaded_data[item] != 'undefined') {
          loaded_data[item]['teams'].forEach((team) => {
            if (team['uuid'] == this.filter_team) {
              team['players'].forEach((player) => {
                const index: any = this.players_list.findIndex(
                  (x) => x.uuid == player['uuid']
                );
                if (index === -1) {
                  player['short_name'] =
                    player['surname'] + ' ' + player['name'][0] + '.';
                  if (player.position == 'GK') {
                    this.players_list.push(player);
                  }
                } else { console.log('object already exists'); }
              });
            }
          });
        }
      });
    });

    this.team_list_filter = [];
    if (this.filter_team == 'ALL') {
      this.team_list_filter = this.teams_list;
    } else {
      this.teams_list.forEach((team) => {
        if (team.uuid != this.filter_team) {
          this.team_list_filter.push(team);
        }
      });
    }

    this.hideGateZones();
    /* console.log("filter_team",this.filter_team);
    console.log("team_list",this.teams_list);
    console.log("team_list_filtered",this.team_list_filter);
    console.log("selected_teams", this.selected_teams);
    console.log("filter_opp",this.filter_opponents);
    console.log("players_list",this.players_list); */
  }

  hideGateZones() {
    if (this.tab == 'gatezones') {
      this.show_gatezones = false;
    }
  }

  onChangedAttributesRekordy(new_attributes: any) {
    const clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item['type'] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_gamelog = clean_attributes;
    this.loadData(this.tab);
  }

  getAttributeName(type: string) {
    let name = 'no-name';
    const attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

    if (type != null || type != undefined) {
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

    if (type != null || type != undefined) {
      for (const item in attributes['goalkeepers'][0]['individual'][0]) {
        // console.log(JSON.stringify());
        /* attributes["individual"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            name = item["name"];
          }
        }); */
        attributes['goalkeepers'][0]['individual'][0][item][0]['types'].forEach(
          (type) => {
            type['attributes'].forEach((attribute) => {
              if (attribute['type'] == type) {
                name = item['name'];
              }
            });
          }
        );
      }

      /* for (let item in attributes["goalkeepers"][0]["onIce"][0]) {

        attributes["goalkeepers"][0]["onIce"][0][item][0]["types"].forEach(type => {
          type["attributes"].forEach(attribute=> {
            if (attribute["type"] == type) {
              name = item["name"];
            }
          });
        });
      } */

      /*
      for (let item in attributes["teamsData"][0]) {
        //console.log(JSON.stringify());
        attributes["teamsData"][0][item][0]["attributes"].forEach((item, index) => {
          if (item["type"] == type) {
            name = item["name"];
          }
        });
      }
      */

      for (const item in attributes['goalkeepersData'][0]) {
        attributes['goalkeepersData'][0][item][0]['attributes'].forEach(
          (item, index) => {
            if (item['type'] == type) {
              name = item['name'];
            }
          }
        );
      }
    }
    return name;
  }

  selectTeams() {
    this.filter_opponents = [];

    this.selected_teams.forEach((item) => {
      this.filter_opponents.push(item.uuid);
    });

  }

  zonesToShow(n: number): any[] {
    return Array(n);
  }

  showMoreZones() {}

  selectGoalkeeper() {
    this.loadGoalkeepershots();
  }

  scroll_next() {
    this.games_scroll = this.games_scroll + 130;
    this.scrollContainer.nativeElement.scrollLeft = this.games_scroll;

    if (this.games_scroll > 0) {
      this.canscrollprev = true;
    }
  }

  scroll_prev() {
    if (this.canscrollprev) {
      this.games_scroll = this.games_scroll - 130;
      this.scrollContainer.nativeElement.scrollLeft = this.games_scroll;

      if (this.games_scroll == 0) {
        this.canscrollprev = false;
      }
    }
  }

  filterVyberDatDle(actual_value: boolean) {
    // this.data_gamelog = [];
    this.trend_limits = [];
    this.trend_limits = [
      { date_from: '', date_to: '', match_from: null, match_to: null },
    ];

    this.trend_date_from = [
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
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    this.trend_date_to = [
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
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    this.trend_match_from = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    this.trend_match_to = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    this.filter_vyber_dat_dle = actual_value;
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

  getSeasonParts() {
    this.filter_seasonPart = '';
    this.filter_team = 'ALL';
    this.teams_list = [];

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

    if (this.filter_season != undefined) {
      this.filter_season.forEach((item, index) => {
        this.seasons_list.forEach((item2, index) => {
          if (item['id'] == item2['name']) {
            item2['competitions'].forEach((item3, index) => {
              item3['season'] = item2['name'];

              if (item3['part'] == 'base') {
                base.push(item3['uuid']);
              } else if (item3['part'] == 'playoff') {
                playoff.push(item3['uuid']);
              } else if (item3['part'] == 'playout') {
                playout.push(item3['uuid']);
              } else if (item3['part'] == 'relegation') {
                relegation.push(item3['uuid']);
              } else if (item3['part'] == 'preliminary') {
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
    this.filter_team = 'ALL';
    this.teams_list = [];

    const uuids = this.filter_seasonPart.split(',');

    uuids.forEach((item) => {
      const competition_details = JSON.parse(
        localStorage.getItem('competition_details')
      );

      competition_details.forEach((item2) => {
        if (typeof item2[item] != 'undefined') {
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
              (x) => x.uuid == team['uuid']
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

  addOpponent(opponent_id: string) {
    if (this.filter_opponents.includes(opponent_id)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent == opponent_id) {
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
    this.dataLoaded = false;
    this.loading = false;

    this.tab = '';

    if (this.filter_opponents.includes(this.filter_team)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent == this.filter_team) {
          delete this.filter_opponents[index];
        }
      });
    }
  }

  checkNonselectedOpponent() {
    this.filter_opponents = this.removeShitNulls(this.filter_opponents);
    if (this.filter_opponents.length == 0) {
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

  changedOrder(event) {
    this.filterby = event;
    console.log('Event', event);
  }

  changedOrder2(event) {
    this.shoda_sortby = event;
    this.filterby2 = event;
    console.log('Filter by:', event);
    console.log('Shoda sort', this.shoda_sortby);
  }

  shodaSort(event) {
    this.shodaSort_value = event;
    console.log('shodaSort_value', this.shodaSort_value);
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

  showMoreFilters() {
    if (this.more_filters == true) {
      this.more_filters = false;
    } else {
      this.more_filters = true;
    }
  }

  showTab(tab: string) {
    this.tab = tab;
    this.prew_tab = tab;
    this.loadData(tab);
  }

  toggleTableSettings(page: string) {
    this.tab = this.prew_tab;

    if (page == 'gamelog') {
      this.table_settings_selected = this.table_settings_gamelog;
    } else {
      this.table_settings_selected = this.table_settings;
    }

    if (this.toggle_table_settings == true) {
      this.toggle_table_settings = false;
    } else {
      this.toggle_table_settings = true;

      /* setTimeout(() =>{
        this.cd.detectChanges()
      }, 400); */
    }

    // this.cd.detectChanges()
    console.log('toggle_table_settings', this.toggle_table_settings);
  }

  loadData(page: string) {
    this.shoda_sortby = 'toi';
    this.show_gatezones = true;
    this.checkLoggedTime();
    this.toi = [];
    this.canvas_type = 'goalkeepers';
    this.loading = true;
    this.dataLoaded = false;
    this.tab = page;
    this.prew_tab = this.tab;

    // this.average_compare = "";
    this.show_skala = false;

    this.data = [];
    this.data_gamelog = [];

    this.loaded_shotmap = false;
    this.loading_shotmap = false;

    if (this.tab == 'tabs') {
      this.loadTabulky();
    } else if (this.tab == 'gamelog') {
      this.loadGamelog();
    } else if (this.tab == 'trend') {
      this.loadTrend();
    } else if (this.tab == 'gatezones') {
      console.log('Tab', this.tab);
      this.loadZonyBranky();
    } else if (this.tab == 'shotmap') {
      this.loadGoalkeepershots();
    } else if (this.tab == 'shootouts') {
      this.loadShootouts();
    }

    this.filter_team2 = this.filter_team;
    // this.getPlayerList();
    this.cd.detectChanges();
  }

  loadTabulky() {
    this.individualStatsService
      .getIndividualStatsGoalkeepers(
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
        this.table_settings,
        this.filter_metricFilter,
        this.filter_metricFilter_value
      )
      .subscribe(
        (loaded_data) => {
          // this.data = loaded_data;
          console.log('loaded_data');
          console.log(loaded_data);
          if (this.filter_team == 'ALL') {
            this.team_or_all_players = true;
            let count = 0;

            loaded_data.forEach((item, index) => {
              item['players'].forEach((item2, index2) => {
                this.data.push({ uuid: item2['player'] });
                this.data[count]['toi'] = item2['stats']['toi'];
                this.data[count]['gp'] = item2['stats']['gp'];
                this.table_settings.forEach((item3, index3) => {
                  this.data[count][item3['type']] =
                    item2['stats'][item3['type']];
                });
                this.data[count]['team'] = item['team'];
                count = count + 1;
              });
            });
          } else {
            this.team_or_all_players = false;
            let count = 0;
            loaded_data.forEach((item, index) => {
              this.data.push({ uuid: item['player'] });
              this.data[count]['toi'] = item['stats']['toi'];
              this.data[count]['gp'] = item['stats']['gp'];

              this.table_settings.forEach((item2, index2) => {
                this.data[count][item2['type']] = item['stats'][item2['type']];
              });

              this.data[count]['team'] = this.filter_team;

              count = count + 1;
            });
            this.data_csv = this.data;
          }
          this.loading = false;
          this.dataLoaded = true;
          this.loadAverages();
        },
        (err) => {
          // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          // this.defaultService.logout();
          // window.location.reload();
        }
      );
  }

  loadGamelog() {
    this.shoda_sortby = 'rank';
    if (this.filter_goalkeeper != '') {
      this.gamelogService
        .getGamelogGoalkeeper(
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
          this.filter_goalkeeper,
          '',
          '',
          '',
          '',
          '',
          'on',
          '',
          '',
          '',
          '',
          '',
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings
        )
        .subscribe(
          (loaded_data) => {
            if (this.tab == 'gamelog') {
              this.canvas_type = 'gamelog';
              this.data_gamelog = loaded_data;
              this.data_gamelog.forEach((item, index) => {
                this.data_gamelog[index]['uuid'] = item['uuid'];

                this.data_gamelog[index]['homeTeamUuid'] =
                  item['info']['homeTeamUuid'];
                this.data_gamelog[index]['awayTeamUuid'] =
                  item['info']['awayTeamUuid'];
                this.data_gamelog[index]['date'] = item['info']['date'];
                this.data_gamelog[index]['home_score'] =
                  item['info']['score']['home'];
                this.data_gamelog[index]['away_score'] =
                  item['info']['score']['away'];
                this.data_gamelog[index]['state_score'] =
                  item['info']['score']['state'];

                this.table_settings_gamelog.forEach((item2, index2) => {
                  this.data_gamelog[index][item2['type']] =
                    item['stats'][item2['type']];
                });

                this.data_gamelog[index]['toi'] = item['stats']['toi'];
                // this.cd.detectChanges();
                this.loading = false;
              });
            } else if (this.tab == 'shotmap') {
              loaded_data.forEach((element) => {
                this.toi.push({ match: element.uuid, toi: element.stats.toi });
              });
              this.loading_shotmap = false;
              this.loaded_shotmap = true;
            }

            console.log('data', this.data);
            console.log('toi', this.toi);
            this.loading = false;
            this.dataLoaded = true;
          },
          (err) => {
            // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
            // this.defaultService.logout();
            // window.location.reload();
          }
        );
    } else {
      alert('Je nutné vybrat hráče');
      this.loading = false;
      this.dataLoaded = false;
      this.data = [];
    }
  }

  loadZonyBranky() {
    this.loading = false;
    this.dataLoaded = true;
    /* this.show_gatezones = false;
    setTimeout(() => {
      this.show_gatezones = true;
    }, 200); */
    this.show_gatezones = true;
    this.gatezone.forEach((zone) => {
      zone.reloadData();
    });
  }

  loadTrend() {
    this.checkLoggedTime();

    if (this.filter_goalkeeper != '') {
      this.trendService
        .getTrendGoalkeeper(
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
          this.filter_goalkeeper,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings
        )
        .subscribe(
          (loaded_data) => {
            this.data = loaded_data;
            console.log('data Trend', this.data);
            this.renderGraph();
            // this.loadTrendDataLine();
          },
          (err) => {}
        );
    } else {
      alert('Je nutné vybrat hráče');
      this.loading = false;
      this.dataLoaded = false;
      this.data = [];
    }
  }

  toggleDataSets() {
    let dataset = [
      { type: 'ga60', name: 'GA/60', colour: 'white' },
      { type: 'soga60', name: 'SOGA/60', colour: 'white' },
      { type: 'sv_percent', name: 'Sv%', colour: 'white' },
      { type: '1tsv_percent', name: '1T.Sv%', colour: 'white' },
      { type: 'rsv_percent', name: 'R.Sv%', colour: 'white' },
      { type: 'gsaa', name: 'GSAA', colour: 'white' },
      { type: 'sga60', name: 'sGA/60', colour: 'purple' },
      { type: 'ssoga60', name: 'sSOGA/60', colour: 'purple' },
      { type: 'ssv_percent', name: 'sSv%', colour: 'purple' },
      { type: '1tssv_percent', name: '1T.sSv%', colour: 'purple' },
      { type: 'crsassv_percent', name: 'cr.SA.sSv%', colour: 'purple' },
      { type: 'sgsaa', name: 'sGSAA', colour: 'purple' },
    ];

    if (this.filter_dataSet == 'ALL') {
      if (this.tab == 'gamelog') {
        dataset = this.table_settings_gamelog_default;
      } else if (this.tab == 'tabs') {
        dataset = this.table_settings_default;
      }
    } else {
      this.dataSets.forEach((item) => {
        if (Number(item.id) === Number(this.filter_dataSet)) {
          dataset = item.data;
        }
      });
    }

    dataset = this.formatParametersService.formatParameters(
      dataset,
      'goalkeepers'
    );
    this.onChangedAttributes(dataset);
  }

  renderGraph() {
    let months = [];
    this.data.forEach((item) => {
      this.matches_list.push(item['match']);

      const year = new Date(item['date']).getFullYear();
      const month = new Date(item['date']).getMonth() + 1;
      let month_final = '';
      if (month < 10) {
        month_final = '0' + month;
      } else {
        month_final = String(month);
      }

      months.push(year + '-' + month_final + '-01');
    });
    months = months.filter(function (item, pos) {
      return months.indexOf(item) == pos;
    });

    const min_date = months[0];
    let max_date = months.slice(-1).pop();
    max_date = new Date(max_date);
    max_date.setMonth(max_date.getMonth() + 1);
    max_date =
      max_date.getUTCFullYear() +
      '-' +
      ('00' + (max_date.getUTCMonth() + 1)).slice(-2) +
      '-' +
      ('00' + max_date.getUTCDate()).slice(-2);
    this.lineChartLabels = [];
    months.forEach((item) => {
      this.lineChartLabels.push(new Date(item).toLocaleString());
    });

    // data
    const data_raw = [];
    const data = [];
    // console.log(JSON.stringify(this.data_graph));

    this.data.forEach((item) => {
      let attribute_value = 0;

      if (item['stats'] == null) {
        attribute_value = undefined;
      } else {
        attribute_value = item['stats'][this.filter_graph_attribute];
      }

      console.log('attribute_value', attribute_value);

      data.push({
        t: new Date(item['date']),
        y: attribute_value,
      });

      if (item['stats'] == null) {
        // data_raw.push(undefined);
      } else {
        data_raw.push(item['stats'][this.filter_graph_attribute]);
      }
    });

    const y_data_min = 0;

    const largest = Math.max.apply(Math, data_raw);
    const y_data_max = Math.ceil(largest);

    const y_ticks = {
      beginAtZero: true,
      min: y_data_min,
      max: y_data_max,
    };
    console.log('data');
    this.lineChartData = [
      {
        label: this.filter_graph_attribute,
        data: data,
      },
    ];
    this.lineChartColors = [
      {
        backgroundColor: 'transparent',
        borderColor: '#1d5cff',
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#151d22',
        pointHoverBackgroundColor: '#151d22',
        pointHoverBorderColor: '#151d22',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverBorderWidth: 3,
        pointHoverRadius: 5,
      },
    ];
    this.lineChartOptions = {
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              callback: function (value) {
                return (
                  new Date(value).getMonth() +
                  1 +
                  '/' +
                  new Date(value).getFullYear()
                );
              },
            },
            type: 'time',
            distribution: 'linear',
            time: {
              unit: 'month',
              min: min_date,
              max: max_date,
              displayFormats: {
                day: 'YYYY-MM-DD',
              },
            },
          },
        ],
        yAxes: [
          {
            display: true,
            ticks: y_ticks,
            gridLines: {
              display: true,
              zeroLineColor: '#151d22',
            },
          },
        ],
      },
      tooltips: {
        enabled: false,
        custom: (tooltipModel) => {
          const tooltipEl = this.lol;

          if (!tooltipEl) {
            this.show_canvas_tooltip = true;
            if (tooltipModel.dataPoints !== undefined) {
              const date = tooltipModel.dataPoints[0].xLabel;
              const value = tooltipModel.dataPoints[0].yLabel;
              this.tooltip_value = value;
              this.tooltip_date = date;

              let sql_date;
              sql_date = new Date(date);
              sql_date =
                sql_date.getUTCFullYear() +
                '-' +
                ('00' + (sql_date.getUTCMonth() + 1)).slice(-2) +
                '-' +
                ('00' + sql_date.getUTCDate()).slice(-2);

              // console.log(JSON.stringify(this.data_graph));
              this.data.forEach((item) => {
                if (item['date'] == sql_date) {
                  this.tooltip_match =
                    this.getTeamName(item['homeTeam']) +
                    ' - ' +
                    this.getTeamName(item['awayTeam']) +
                    ' ' +
                    item['score']['home'] +
                    ':' +
                    item['score']['away'] +
                    '' +
                    this.getGameState(item['score']['state']);
                }
              });
            }
          }

          if (tooltipModel.opacity === 0) {
            this.show_canvas_tooltip = false;
          }

          if (tooltipModel.body) {
            // alert(JSON.stringify(tooltipModel.body));
          }

          const position = this.chart.nativeElement.getBoundingClientRect();
          this.canvas_tooltip_left =
            position.left + window.pageXOffset + tooltipModel.caretX;
          this.canvas_tooltip_top =
            position.top + window.pageYOffset + tooltipModel.caretY;
        },
      },
    };
    this.loading = false;
    this.dataLoaded = true;
    this.showTrend = true;
  }

  loadAverages() {
    this.averages_loaded = false;
    this.individualStatsService
      .getIndividualStatsGoalkeepersAverages(
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
        this.table_settings
      )
      .subscribe(
        (loaded_data) => {
          this.data_averages = loaded_data;
          this.averages_loaded = true;
        },
        (err) => {
          // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          // this.defaultService.logout();
          // window.location.reload();
        }
      );
  }

  loadSkala() {
    this.skala_loading = true;

    this.data_relativeToCompetition = [];
    this.data_relativeToTeam = [];

    this.individualStatsService
      .getGoalkeepersStatsRelativeTo(
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
        'competition',
        this.table_settings
      )
      .subscribe(
        (loaded_data) => {
          this.data_relativeToCompetition = loaded_data;

          if (this.team_or_all_players == true) {
            const temporary_data_relativeToCompetition = [];
            this.data_relativeToCompetition.forEach((item, index) => {
              item['players'].forEach((item2) => {
                const player_row = item2;
                item2['team'] = item['team'];
                temporary_data_relativeToCompetition.push(item2);
              });
            });

            // console.log(JSON.stringify(temporary_data_relativeToTeam));

            this.data_relativeToCompetition =
              temporary_data_relativeToCompetition;

            this.data.forEach( x=> {
              let selectedPlayer = temporary_data_relativeToCompetition.filter(
                y=> (y.player==x.uuid)
                );
              x["summaryPercentile"] = selectedPlayer[0].stats["summaryPercentile"]
            });  

            this.skala_loading = false;
          } else {
            const temporary_data_relativeToCompetition = [];
            this.data_relativeToCompetition.forEach((item, index) => {
              const player_row = item;
              item['team'] = this.filter_team;
              temporary_data_relativeToCompetition.push(item);
            });

            this.data.forEach( x=> {
              let selectedPlayer = temporary_data_relativeToCompetition.filter(
                y=> (y.player==x.uuid)
                );
              x["summaryPercentile"] = selectedPlayer[0].stats["summaryPercentile"]
            });  

            this.skala_loading = false;
          }
        },
        (err) => {
          // alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          // this.defaultService.logout();
          // window.location.reload();
        }
      );

    // this.sendEvent(this.filter_team);
  }

  getTeamName(uuid: string) {
    let shortcut = '';
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] == uuid) {
        shortcut = item['shortcut'];
      }
    });

    return shortcut;
  }

  getGameState(state: string) {
    let game_state = '';

    if (state == 'normal') {
      game_state = '';
    } else if (state == 'overtime') {
      game_state = 'p';
    } else if (state == 'shooting') {
      game_state = 'sn';
    }
    return game_state;
  }

  getTableToggleAttributes(attribute: string) {
    let style = '';

    this.table_settings.forEach((item, index) => {
      if (item['type'] == attribute) {
        if (item['enabled'] == false) {
          style = 'hidden';
        } else {
          style = '';
        }
      }
    });

    return style;
  }

  getSkalaNumber(player_uuid: string, attribute: string, team: string) {
    this.average_compare = 'competition';
    let data = [];
    let cell_value = '';

    if (this.average_compare == 'team') {
      data = this.data_relativeToTeam;
    } else if (this.average_compare == 'competition') {
      data = this.data_relativeToCompetition;
    }

    if (this.show_skala) {
      data.forEach((item) => {
        if (item['player'] == player_uuid && item['team'] == team) {
          cell_value = String(item['stats'][attribute]);
        }
      });

      return cell_value;
    }
  }

  dateRangeChange($event): void {
    if ($event.startDate == null || $event.startDate == undefined) {
      this.filter_dateFrom = undefined;
    } else {
      const filter_dateFrom = $event.startDate.toDate();
      this.filter_dateFrom = filter_dateFrom
        .toISOString()
        .slice(0, 10)
        .replace('T', ' ');
    }

    if ($event.endDate == null || $event.endDate == undefined) {
      this.filter_dateTo = undefined;
    } else {
      const filter_dateTo = $event.endDate.toDate();
      this.filter_dateTo = filter_dateTo
        .toISOString()
        .slice(0, 10)
        .replace('T', ' ');
    }
  }

  // data pro levou stranu zapasu checkboxes
  loadGoalkeepershots() {
    this.toi = [];
    // this.more_filters = false;
    this.loading_shotmap = true;
    this.loaded_shotmap = false;
    console.log('filter_team2', this.filter_team2);
    if (this.filter_goalkeeper == '') {
      this.filter_goalkeeper = this.players_list[0].uuid;
    }
    this.individualStatsService
      .getGoalkeepersShots(
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
        this.filter_goalkeeper
      )
    .subscribe(
      (loaded_data) => {
        console.log('loaded_data goalkeepers Shots', loaded_data);
        this.shots = loaded_data;
        if (this.HOME_AWAY.includes(this.filter_homeAway)) {
          this.shots = this.shots.filter((game) => this.filter_homeAway === this.HOME_AWAY[0] ? game.homeTeam === this.filter_team :
            game.awayTeam === this.filter_team);
          console.log('goalkeepers data po filtraci home/away', this.shots);
        }

        if (this.tab === 'shotmap') {
          this.loadGamelog();
        } else {
          this.loading_shotmap = false;
          this.loaded_shotmap = true;
        }
      },
      (err) => {
      }
    );
  }

  loadShootouts() {
    this.loading_shotmap = true;
    this.loaded_shotmap = false;
    console.log('filter_team2', this.filter_team2);

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
          if (this.filter_opponents.length == 0) {
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
          } else if (this.filter_opponents.includes(item.awayTeamUuid)) {
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

        this.individualStatsService
          .shootouts(
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
            this.filter_goalkeeper
          )
          .subscribe(
            (loaded_data) => {
              console.log('loaded_data !!!!!!', loaded_data);
              this.shots = loaded_data;

              this.loading_shotmap = false;
              this.loaded_shotmap = true;
              this.loading = false;
            },
            (err) => {}
          );
      });
  }

  getPlayerPost(uuid: string) {
    if (uuid != undefined) {
      if (localStorage.getItem(uuid) != null) {
        return JSON.parse(localStorage.getItem(uuid))['position'];
      } else {
        return 'no-post';
      }
    } else {
      return 'no-post';
    }
  }

  getPlayerName(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return '' + uuid;
    } else {
      const surname = JSON.parse(localStorage.getItem(uuid))['surname'];
      const name = JSON.parse(localStorage.getItem(uuid))['name'];

      if (surname == 'Klima') {
        let name2 = '';
        console.log(name);
        if (name == 'Kelly Philip') {
          name2 = 'Kl.';
        }
        if (name == 'Kevin') {
          name2 = 'Kv.';
        }

        return surname + ' ' + name2;
      } else {
        return surname + ' ' + name[0] + '.';
      }
    }
  }

  averageCompare(compare_what: string) {
    if (this.average_compare == compare_what) {
      this.average_compare = '';
    } else {
      this.average_compare = compare_what;
    }
  }

  averageCompare_zony(compare_what: string) {
    if (this.average_compare_zony == compare_what) {
      this.average_compare_zony = '';
    } else {
      this.average_compare_zony = compare_what;
    }
  }

  active_skala() {
    if (this.show_skala == true) {
      this.show_skala = false;
    } else {
      if (this.average_compare != '') {
        this.show_skala = true;
        this.loadSkala();
      } else {
        alert('Je nutné vybrat typ porovnání.');
      }
    }
  }

  active_skala_zony() {
    if (this.show_skala_zony == true) {
      this.show_skala_zony = false;
    } else {
      if (this.average_compare_zony != '') {
        this.show_skala_zony = true;
      } else {
        alert('Je nutné vybrat typ porovnání.');
      }
    }
  }

  getMinMax(cmp, arr, attr) {
    let val = arr[0][attr];
    for (let i = 1; i < arr.length; i++) {
      val = cmp(val, arr[i][attr]);
    }
    return val;
  }

  getSkalaColour(player_uuid: string, attribute: string, team: string) {
    this.average_compare = 'competition';
    let data = [];
    let cell_value = '';

    if (this.average_compare == 'team') {
      data = this.data_relativeToTeam;
    } else if (this.average_compare == 'competition') {
      data = this.data_relativeToCompetition;
    }
    if (this.show_skala) {
      data.forEach((item) => {
        if (item['player'] == player_uuid && item['team'] == team) {
          const value = item['stats'][attribute];
          if (value >= 0 && value <= 10) {
            cell_value = 'cell-0';
          } else if (value > 10 && value <= 20) {
            cell_value = 'cell-1';
          } else if (value > 20 && value <= 30) {
            cell_value = 'cell-2';
          } else if (value > 30 && value <= 40) {
            cell_value = 'cell-3';
          } else if (value > 40 && value <= 50) {
            cell_value = 'cell-4';
          } else if (value > 50 && value <= 60) {
            cell_value = 'cell-5';
          } else if (value > 60 && value <= 70) {
            cell_value = 'cell-6';
          } else if (value > 70 && value <= 80) {
            cell_value = 'cell-7';
          } else if (value > 80 && value <= 90) {
            cell_value = 'cell-8';
          } else if (value > 90 && value <= 100) {
            cell_value = 'cell-9';
          }
        }
      });

      return cell_value;
    }
  }

  getSkalaColour2(value: number) {
    let cell_value;

    if (value >= 0 && value <= 10) {
      cell_value = 'cell-0';
    } else if (value > 10 && value <= 20) {
      cell_value = 'cell-1';
    } else if (value > 20 && value <= 30) {
      cell_value = 'cell-2';
    } else if (value > 30 && value <= 40) {
      cell_value = 'cell-3';
    } else if (value > 40 && value <= 50) {
      cell_value = 'cell-4';
    } else if (value > 50 && value <= 60) {
      cell_value = 'cell-5';
    } else if (value > 60 && value <= 70) {
      cell_value = 'cell-6';
    } else if (value > 70 && value <= 80) {
      cell_value = 'cell-7';
    } else if (value > 80 && value <= 90) {
      cell_value = 'cell-8';
    } else if (value > 90 && value <= 100) {
      cell_value = 'cell-9';
    }

    return cell_value;
  }

  getPCT(player: string, team: string) {
    let data = [];
    let value = 0;
    let count = 0;

    if (this.average_compare == 'team') {
      data = this.data_relativeToTeam;
    } else if (this.average_compare == 'competition') {
      data = this.data_relativeToCompetition;
    }

    data.forEach((item) => {
      if (item['player'] == player && item['team'] == team) {
        this.table_settings.forEach((element) => {
          value = value + item['stats'][element.type];
          count++;
        });
      }
    });

    return Number(value / count).toFixed(0);
  }

  tab_small_vizClick(value: string) {
    this.tab_small_viz = value;
  }

  getPlayerTeamShort(uuid: string) {
    if (uuid != null || uuid != undefined) {
      if (localStorage.getItem(uuid) != undefined) {
        uuid = JSON.parse(localStorage.getItem(uuid))['team'];
        // console.log(JSON.stringify(uuid));
        // console.log(JSON.stringify(this.teams_list));
        let team = '';
        let keepGoing = true;
        this.teams_list.forEach((item, index) => {
          if (keepGoing) {
            if (item['team'] == uuid) {
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
    } else {
      return '';
    }
  }

  getTeamLogo(uuid: string) {
    let shortcut = '';
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] == uuid) {
        shortcut = item['shortcut'];
      }
    });

    return this.getPlayerTeamLogo(shortcut);
  }

  getTeamUUID(uuid: string) {
    if (uuid != null || uuid != undefined) {
      if (localStorage.getItem(uuid) != undefined) {
        uuid = JSON.parse(localStorage.getItem(uuid))['team'];
        let team = '';
        let keepGoing = true;
        this.teams_list.forEach((item, index) => {
          if (keepGoing) {
            if (item['team'] == uuid) {
              keepGoing = false;
              team = item['uuid'];
            } else {
              team = '';
            }
          }
        });

        return team;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  getPlayerTeamLogo(team_hash: string) {
    let team_shortcut = '';
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] == team_hash) {
        team_shortcut = item['shortcut'];
      }
    });

    if (team_shortcut == 'MHK') {
      return '../assets/logos/29579d3e-1502-4ec0-80e3-f5ead6d22fb0.png';
    } else if (team_shortcut == 'OLO') {
      return '../assets/logos/71760283-d630-4c7f-b52f-e0b193a622cd.png';
    } else if (team_shortcut == 'TRI') {
      return '../assets/logos/55d9085b-58b5-4c52-bc73-42fdc106c944.png';
    } else if (team_shortcut == 'CHM') {
      return '../assets/logos/1460b1ac-a5a9-4819-997e-afa26b512299.png';
    } else if (team_shortcut == 'LIT') {
      return '../assets/logos/3c08ada2-3fd6-49b7-974d-2db9c92676ac.png';
    } else if (team_shortcut == 'LIB') {
      return '../assets/logos/3c85029c-140f-4971-96d2-76a95f429c2b.png';
    } else if (team_shortcut == 'PLZ') {
      return '../assets/logos/524e1ff0-e670-42d9-93aa-8ba35bb94942.png';
    } else if (team_shortcut == 'PCE') {
      return '../assets/logos/f9b85077-6ea5-4769-9bba-27d5da8e97bd.png';
    } else if (team_shortcut == 'ZLN') {
      return '../assets/logos/eec5f929-a5bb-4bf4-8e69-34d0a274c661.png';
    } else if (team_shortcut == 'VIT') {
      return '../assets/logos/99f32b0e-ddcc-4330-8ef5-66c8bbdd22ba.png';
    } else if (team_shortcut == 'SPA') {
      return '../assets/logos/9af95c87-b24b-411b-a615-c1d86861fca5.png';
    } else if (team_shortcut == 'KOM') {
      return '../assets/logos/69802e5a-b9de-4bc0-8001-f5e11d0f2048.png';
    } else if (team_shortcut == 'MBL') {
      return '../assets/logos/b4a4a812-fd88-47e4-a626-be3300b390cc.png';
    } else if (team_shortcut == 'JIH') {
      return '../assets/logos/e3bf29fb-e963-4922-9064-1b6101047a9e.png';
    } else if (team_shortcut == 'KVA') {
      return '../assets/logos/302630a7-3aff-4303-9539-951bdd605ab9.png';
    } else if (team_shortcut == 'KLA') {
      return '../assets/logos/42bafa4d-5e60-4f00-81c5-4f44ffa55927.png';
    } else if (team_shortcut == 'CEB') {
      return '../assets/logos/732e68fc-13c7-45a8-bb51-5eeab8b10283.png';
    }
  }

  onChangedAttributes(new_attributes: any) {
    const clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item['type'] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_gamelog = clean_attributes;
    this.table_settings = clean_attributes;
    this.loadData(this.tab);
  }

  getAttributeColour(colour: string) {
    return colour;
  }

  /* getAttributeColour(type: string) {

    let colour = "no-colour";
    let attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

    if (type != null || type != undefined) {
      if (type.startsWith("r_")) {
        type = type.substring(2);
      } else if (type.startsWith("o_")) {
        type = type.substring(2);
      } else if (type.startsWith("f_")) {
        type = type.substring(2);
      } else if (type.startsWith("up_")) {
        type = type.substring(3);
      } else if (type.startsWith("np_")) {
        type = type.substring(3);
      }
    }

    if (type != null || type != undefined) {

      for (let item in attributes["individual"][0]) {
        attributes["individual"][0][item][0]["types"].forEach(type => {
          type["attributes"].forEach(attribute=> {
            if (attribute["type"] == type) {
              colour = item["colour"];
            }
          });
        });
      }

      for (let item in attributes["onIce"][0]) {

        attributes["onIce"][0][item][0]["types"].forEach(type => {
          type["attributes"].forEach(attribute=> {
            if (attribute["type"] == type) {
              colour = item["colour"];
            }
          });
        });
      }


    }
    return colour;

  } */

  setMinAttribute(attribute) {
    this.filter_metricFilter = attribute;
  }
  setMinAttributeValue(attribute_value) {
    this.filter_metricFilter_value = attribute_value;
  }

  getAttributeText(type: string, show_what: number) {
    let title = '';
    let desc = '';

    if (type != null) {
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
    for (const item in attributes['goalkeepers'][0]['individual'][0]) {
      attributes['goalkeepers'][0]['individual'][0][item][0]['types'].forEach(
        (type2) => {
          type2['attributes'].forEach((attribute) => {
            if (attribute['type'] == type) {
              title = attribute['eng'];
              desc = attribute['desc'];
            }
          });
        }
      );
    }

    /*  for (let item in attributes["goalkeepers"][0]["onIce"][0]) {
      attributes["goalkeepers"][0]["onIce"][0][item][0]["types"].forEach(type2 => {
        type2["attributes"].forEach(attribute=> {
          if (attribute["type"] == type) {
            title = attribute["eng"];
            desc = attribute["desc"];
          }
        });
      });
    } */ /*
    console.log("Tilte",title),
    console.log("Desc", desc) */
    if (title == '') { title = 'error'; }
    if (show_what == 1) {
      return title;
    } else if (show_what == 2) {
      return desc;
    } else {
      return 'error';
    }
  }

  downloadCSV() {
    let data = [];
    const th = ['Hokej.cz ID', 'Tym', 'Pozice', 'Jmeno hrace', 'TOI', 'GP'];

    this.table_settings.forEach((item, index) => {
      if (item['type'] != null) {
        th.push(item['name']);
      }
    });

    data.push(th);

    const row = [];

    this.data.forEach((item, index) => {
      const obj = item;
      const newObj = {
        hokejcz_id: String('__' + this.getPlayerHokejCZid(item['uuid'])),
        tym: this.getPlayerTeamShort(item.uuid),
        post: this.getPlayerPostName(item.uuid),
        ...obj,
      };

      row.push(newObj);
    });

    row.forEach((item, index) => {
      // console.log(JSON.stringify(item));
      item['team'] = undefined;
      if (this.filter_posts == 'ALL') {
        data.push(item);
      } else if (this.filter_posts == 'DE') {
        if (this.getPlayerPost(item['uuid']) == 'DE') {
          data.push(item);
        }
      } else if (this.filter_posts == 'FO') {
        if (this.getPlayerPost(item['uuid']) == 'FO') {
          data.push(item);
        }
      }
    });

    data = JSON.parse(JSON.stringify(data));
    console.log('Data', data);
    console.log('Data_gamelog', this.data_gamelog);

    data.forEach((item, index) => {
      data[index]['uuid'] = accents.remove(this.getPlayerName(item['uuid']));
      data[index]['gp'] = item['gp'];
      data[index]['toi'] = this.formatSecondsDecimal(item['toi']);
      data[index]['oztoi'] = this.formatSecondsDecimal(item['oztoi']);
      data[index]['dztoi'] = this.formatSecondsDecimal(item['dztoi']);
      data[index]['dzposstoi'] = this.formatSecondsDecimal(item['dzposstoi']);
      data[index]['oppdzptoi'] = this.formatSecondsDecimal(item['oppdzptoi']);

      data[index]['ozposstoi'] = this.formatSecondsDecimal(item['ozposstoi']);
      data[index]['posstoi'] = this.formatSecondsDecimal(item['posstoi']);
    });

    const json = JSON.stringify(data);
    const withStrings = JSON.parse(json, (key, val) =>
      typeof val !== 'object' && val !== null ? String(val) : val
    );

    const final_data = JSON.parse(JSON.stringify(withStrings));
    // console.log(JSON.stringify(final_data));
    // new Angular5Csv(withStrings, 'goalkeepers', csv_options);
    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data['url']);
    });
  }

  formatDate(value: string): any {
    const date = new Date(value);
    return (
      Number(date.getDate()) +
      '.' +
      Number(date.getMonth() + 1) +
      '.' +
      Number(date.getFullYear())
    );
  }

  downloadCSVGamelog() {
    let data = [];
    const th = ['Zapas', 'TOI'];

    const th_types = ['zapas', 'toi'];

    this.table_settings_gamelog.forEach((item, index) => {
      if (item['type'] != null) {
        th.push(item['name']);
        th_types.push(item['type']);
      }
    });

    data.push(th);

    const row = [];

    this.data_gamelog.forEach((item, index) => {
      // console.log(JSON.stringify(item));

      const home_team = this.getTeamName(item['info']['homeTeamUuid']);
      const away_team = this.getTeamName(item['info']['awayTeamUuid']);
      const date = this.formatDate(item['info']['date']);
      const score =
        item['info']['score']['home'] +
        ':' +
        item['info']['score']['away'] +
        '' +
        this.getGameState(item['info']['score']['state']);

      item['stats']['zapas'] =
        home_team + ' - ' + away_team + '  ' + date + '  ' + score;
      row.push(item['stats']);
    });

    row.forEach((item, index) => {
      const selected_data = [];
      th_types.forEach((item2, index2) => {
        if (item2 == 'toi') {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == 'oztoi') {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == 'ozposstoi') {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == 'posstoi') {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == 'dztoi') {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == 'dzposstoi') {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == 'oppdzptoi') {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == 'zapas') {
          selected_data.push(String(item[item2]));
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      data.push(selected_data);
    });

    data = JSON.parse(JSON.stringify(data));

    data.forEach((item, index) => {
      data[index]['toi'] = this.formatSeconds(item['toi']);
    });

    const json = JSON.stringify(data);
    const withStrings = JSON.parse(json, (key, val) =>
      typeof val !== 'object' && val !== null ? String(val) : val
    );

    const final_data = JSON.parse(JSON.stringify(withStrings));

    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data['url']);
    });
    // new Angular5Csv(withStrings, 'individual-stats', csv_options);
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

  getPlayerPostName(uuid: string) {
    return 'B';
  }

  getTeamNameShort(uuid: string) {
    let team_name = '';
    this.teams_list.forEach((item, index) => {
      if (item['uuid'] == uuid) {
        team_name = item['name'];
      }
    });

    return team_name;
  }

  getPlayerHokejCZid(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return '' + uuid;
    } else {
      let hokejczId = JSON.parse(localStorage.getItem(uuid))['hokejczId'];
      if (hokejczId == null) {
        hokejczId = '?';
      }
      return hokejczId;
    }
  }

  setDefaultOrderRow() {
    this.list_order = 0;
  }
  addOrderRow() {
    this.list_order = this.list_order + 1;
  }

  invertChanged(invert: boolean) {
    this.shotmap_invert = invert;
  }

  sendEvent = (team: string) => {
    (<any>window).ga('send', 'event', {
      eventCategory: 'Analyzovaný tým',
      eventLabel: 'Analyzovaný tým',
      eventAction: this.getTeamNameShort(team),
      eventValue: 1,
    });
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

  addRowZonyBranky() {
    this.count_of_zony_branky.push('row');
  }

  openVideoPlayer(data: any) {
    this.videos_data = data;
    this.show_video_player = true;
  }

  closeVideo() {
    this.show_video_player = false;
  }

  // TRACKING
  trackOpenPage() {
    const logged_user = JSON.parse(localStorage.getItem('logged_user'));
    this.defaultService
      .addEvent(
        logged_user[0].id,
        logged_user[0].user,
        'Byla otevřena obrazovka brankáři.',
        6
      )
      .subscribe((loaded_data) => {});
  }

  slovakTradition() {
    if (this.filter_goalkeeper == '9cdc4388-cf33-41a7-8d88-fedf7ae606fc') {
      console.log(
        '%c Beware of revenge from the forest! https://www.instagram.com/koniferum/',
        'color:red'
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

  reload(event: string) {
    this.filter_goalkeeper = event;
    // this.loadGoalkeepershots()
    this.loadGoalkeepershots();
  }

  goalkeepersLink(
    filter_playerId_select1: string,
    player_team: string,
    page: string
  ) {
    // SEASON
    const seasons = [];
    let filter_season = '';
    this.filter_season.forEach((item, index) => {
      seasons.push(item['id']);
    });

    filter_season = seasons.toString();
    if (filter_season == '') {
      filter_season = 'null';
    }

    // SEASON PART
    const filter_seasonPart = this.filter_seasonPart;

    // FILTER TEAM
    let filter_team = this.filter_team;
    if (filter_team == 'ALL') {
      filter_team = player_team;
    }

    // FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    // FILTER filter_minTOI
    const filter_minTOI = this.filter_minTOI;

    // FILTER filter_lastGames
    const filter_lastGames = this.filter_lastGames;

    // FILTER filter_lastGames
    const filter_dateFrom = this.filter_dateFrom;

    // FILTER filter_lastGames
    const filter_dateTo = this.filter_dateTo;

    // FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == '') {
      filter_homeAway = undefined;
    }

    // FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == '') {
      filter_matchState = undefined;
    }

    // FILTER filter_minutes_from
    const filter_minutes_from = this.filter_minutes_from;

    // FILTER filter_minutes_from
    const filter_minutes_to = this.filter_minutes_to;

    // FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) {
      filter_opponents = undefined;
    }

    // FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == '') {
      filter_situationType = undefined;
    }

    // FILTER filter_situationTime
    const filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == '') {
      filter_countOfPlayer = 'ALL';
    }

    const attributes_list = [];
    this.table_settings.forEach((item) => {
      if (item['type'] != null) {
        attributes_list.push(item['type']);
      }
    });

    const attributes_list_string = attributes_list.toString();

    return (
      'goalkeepers/' +
      filter_season +
      '/' +
      filter_seasonPart +
      '/' +
      filter_team +
      '/' +
      filter_countOfPlayer +
      '/' +
      filter_minTOI +
      '/' +
      filter_lastGames +
      '/' +
      filter_dateFrom +
      '/' +
      filter_dateTo +
      '/' +
      filter_homeAway +
      '/' +
      filter_matchState +
      '/' +
      filter_minutes_from +
      '/' +
      filter_minutes_to +
      '/' +
      filter_opponents +
      '/' +
      filter_playerId_select1 +
      '/' +
      filter_situationType +
      '/' +
      filter_situationTime +
      '/' +
      attributes_list_string +
      '/' +
      page
    );
  }

  checkExistParameter() {
    let parameters_exists_reload_data = false;

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['filter_season'] != undefined) {
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

      if (params['filter_seasonPart'] != undefined) {
        this.getSeasonParts();
        this.filter_seasonPart = params['filter_seasonPart'];

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_team'] != undefined) {
        this.filter_team = params['filter_team'];
        this.getPlayerList();

        //
        parameters_exists_reload_data = true;
      }

      if (params['filter_countOfPlayer'] != undefined) {
        this.filter_countOfPlayer = params['filter_countOfPlayer'];

        if (this.filter_countOfPlayer == '5:5-FO') {
          this.filter_countOfPlayer = '5:5';
        }

        if (this.filter_countOfPlayer == '5:5-DE') {
          this.filter_countOfPlayer = '5:5';
        }

        if (this.filter_countOfPlayer == 'ALL') {
          this.filter_countOfPlayer = '';
        }

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_minTOI'] != undefined &&
        params['filter_minTOI'] != 'undefined'
      ) {
        this.filter_minTOI = parseInt(params['filter_minTOI']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_lastGames'] != undefined &&
        params['filter_lastGames'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_lastGames = parseInt(params['filter_lastGames']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_dateFrom'] != undefined &&
        params['filter_dateFrom'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_dateFrom = params['filter_dateFrom'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_dateTo'] != undefined &&
        params['filter_dateTo'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_dateTo = params['filter_dateTo'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_homeAway'] != undefined &&
        params['filter_homeAway'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_homeAway = params['filter_homeAway'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_matchState'] != undefined &&
        params['filter_matchState'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_matchState = params['filter_matchState'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_minutes_from'] != undefined &&
        params['filter_minutes_from'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_minutes_from = parseInt(params['filter_minutes_from']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_minutes_to'] != undefined &&
        params['filter_minutes_to'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_minutes_to = parseInt(params['filter_minutes_to']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_opponents'] != undefined &&
        params['filter_opponents'] != 'undefined'
      ) {
        // this.more_filters = true;

        this.filter_opponents = params['filter_opponents'].split(',');

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_playerId_select1'] != undefined &&
        params['filter_playerId_select1'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_goalkeeper = params['filter_playerId_select1'];
        //
        parameters_exists_reload_data = true;
        // this.active_player1 = true;
      }

      if (
        params['filter_situationType'] != undefined &&
        params['filter_situationType'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_situationType = params['filter_situationType'];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['filter_situationTime'] != undefined &&
        params['filter_situationTime'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.filter_situationTime = parseInt(params['filter_situationTime']);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params['selected_attributes'] != undefined &&
        params['selected_attributes'] != 'undefined'
      ) {
        // this.more_filters = true;
        this.selected_attributes_string = params['selected_attributes'];
        // alert(JSON.stringify(this.table_settings) + "   " + this.selected_attributes_string);

        const parameter_attributes = this.selected_attributes_string.split(',');

        // console.log('parameter_attributes',parameter_attributes);

        const loaded_attributes = [];
        const attributes = JSON.parse(localStorage.getItem('loaded_attributes'));

        console.log('attributes', parameter_attributes);

        for (const item in attributes['goalkeepers'][0]['individual'][0]) {
          attributes['goalkeepers'][0]['individual'][0][item][0][
            'types'
          ].forEach((item, index) => {
            item['attributes'].forEach((item2) => {
              item2['onIce'] = false;
              loaded_attributes.push(item2);
            });
          });
        }

        if (params.page == 'gamelog') {
          this.table_settings_gamelog = [];
          parameter_attributes.forEach((item) => {
            loaded_attributes.forEach((element) => {
              if (element['type'] == item) {
                this.table_settings_gamelog.push({
                  type: element['type'],
                  name: element['name'],
                  colour: element['colour'],
                  eng: element['eng'],
                  desc: element['desc'],
                  data: element['data'],
                  onIce: element['onIce'],
                  origin: element['type'],
                  types: [],
                });
              }
            });
          });
        } else {
          this.table_settings = [];
          parameter_attributes.forEach((item) => {
            loaded_attributes.forEach((element) => {
              if (element['type'] == item) {
                this.table_settings.push({
                  type: element['type'],
                  name: element['name'],
                  colour: element['colour'],
                  eng: element['eng'],
                  desc: element['desc'],
                  data: element['data'],
                  onIce: element['onIce'],
                  origin: element['type'],
                  types: [],
                });
              }
            });
          });
        }

        //
        parameters_exists_reload_data = true;
      }

      if (parameters_exists_reload_data == true) {
        /* this.loadData(this.tab_small_viz); */
        if (params.page == 'gamelog') {
          this.showTab('gamelog');
        } else if (params.page == 'trend') {
          this.showTab('trend');
        } else if (params.page == 'shotmap') {
          this.showTab('shotmap');
        } else if (params.page == 'shootouts') {
          this.showTab('shootouts');
        }
      }
    });
  }

  checkLanguage() {
    const lang = localStorage.getItem('language');
    return lang == 'cz';
  }

  openHelp(event) {
    if (this.tab != 'canvas') {
      this.prew_tab = this.tab;
    }
    this.tab = 'canvas';

    this.help.openHelp();
  }
}
