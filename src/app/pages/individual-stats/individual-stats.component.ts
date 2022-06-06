import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
  isDevMode,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";

import { Location } from "@angular/common";

import { ActivatedRoute, Params } from "@angular/router";

import { DatepickerOptions } from "ng2-datepicker";

//import * as csLocale from 'date-fns/locale/cs';

//import * as _ from "lodash";
import { IndividualStatsService } from "../../services/individual-stats/individual-stats.service";
import { DefaultService } from "../../services/default/default.service";
import { FormatParametersService } from "../../services/format-parameters/format-parameters.service";
import { createTrue } from "typescript";
import { TrendService } from "../../services/trend/trend.service";
import { GamelogService } from "../../services/gamelog/gamelog.service";

import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import { Color, BaseChartDirective, Label } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import { DragScrollComponent } from "ngx-drag-scroll";

declare var require: any;
var accents = require("remove-accents");

import { TranslatePipe } from "../../pipes/translate.pipe";
import { cloneDeep, orderBy } from "lodash";
import { NavComponent } from "../../components/nav/nav.component";

var csv_options = {
  quoteStrings: '"',
  fieldSeparator: ";",
  decimalseparator: ".",
  type: "text/csv;charset=ISO-8859-1;",
};

@Component({
  selector: "individual-stats",
  templateUrl: "./individual-stats.component.html",
  styleUrls: ["./individual-stats.component.scss"],
  providers: [
    IndividualStatsService,
    DefaultService,
    TranslatePipe,
    TrendService,
    GamelogService,
  ],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndividualStatsComponent implements OnInit, AfterViewInit {
  locale = {
    applyLabel: "ok",
    format: "DD.MM.YYYY",
    displayFormat: "DD.MM.YYYY",
    firstDay: 1,
    clearLabel: "",
    daysOfWeek: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
    monthNames: [
      "Leden",
      "Únor",
      "Březen",
      "Duben",
      "Květen",
      "Červen",
      "Červenec",
      "Srpen",
      "Září",
      "Říjen",
      "Listopad",
      "Prosinec",
    ],
  };

  @ViewChild("lol") private lol: ElementRef;
  @ViewChild("chart") private chart: ElementRef;
  @ViewChild("drax-scroll", { read: DragScrollComponent })
  ds: DragScrollComponent;
  @ViewChild("help") private help: NavComponent;
  @ViewChild("scroll") private scrollContainer: ElementRef;

  showTrend: boolean = false;
  showNormalTable: boolean = false;

  //filters
  filter_season: any = [];
  filter_seasonPart: string = "";
  filter_team: string = "ALL";
  filter_team_shoda: string = "";
  filter_countOfPlayer: string = "5:5";
  filter_minTOI: number;
  filter_lastGames: number;
  filter_dateFrom: string;
  filter_dateTo: string;
  filter_homeAway: string = "";
  filter_matchState: string = "";
  filter_minutes_from: number;
  filter_minutes_to: number;
  filter_opponent: string = "";
  filter_opponents: any = [];
  filter_born_from: number;
  filter_born_to: number;
  filter_posts: string = "ALL";
  filter_situationType: string = "";
  filter_situationTime: number;
  selected_daterange: any;
  selected_attributes_string: any;

  filter_shoda_post: string = "ALL";
  filter_shoda_stick: string = "ALL";
  filter_individual_player: string = "";
  filter_individual_player_selected: string = "";

  filter_metricFilter_metric: string = "";
  filter_metricFilter_value: number;

  page: string = "players";

  //filters

  data_gamelog: any = [];

  data_trend: any = [];

  selected_teams: any = [];

  more_filters: boolean = false;

  tab: string = "";
  prew_tab: string = "";

  player_to_compare1: string = "";
  player_to_compare2: string = "";
  player_to_compare3: string = "";
  player_to_compare4: string = "";

  player_to_load1: any = [];
  player_to_load2: any = [];
  player_to_load3: any = [];
  player_to_load4: any = [];

  player_card1: any = [];
  player_card2: any = [];
  player_card3: any = [];
  player_card4: any = [];

  player1_loaded: boolean = true;
  player2_loaded: boolean = true;
  player3_loaded: boolean = true;
  player4_loaded: boolean = true;

  player1_show: boolean = false;
  player2_show: boolean = false;
  player3_show: boolean = false;
  player4_show: boolean = false;

  players_test = ["Ferko", "Janko", "Anicka", "Ferdinant"];

  teams_list: any[];
  players_list: any = [];

  all_players: any = [];

  team_list_filter: any[];

  dataLoaded: boolean;
  loading: boolean;

  poradi_loading: boolean = false;
  poradi_loaded: boolean = false;

  seasons_select_list = [];
  dropdownSettings = {};
  dropdownSettings2 = {};
  seasons_list: any[];

  canscrollprev: boolean = false;
  canscrollnext: boolean = true;
  games_scroll: number = 0;

  competitions_list: any = [];

  trend_date_from: any = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];
  trend_date_to: any = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
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

  toggle_table_settings: boolean = false;

  team_or_all_players: boolean = false;

  value_of_attribute: any = [];

  ligovy_percetnil_active: boolean = false;

  trend_type: string = "";
  data_graph: any = [];

  loaded_rekordy: boolean = false;

  dataSets: any = [];

  /* table_settings: any[] = [
    { "type": "cf60", "name": "CF/60", "colour": "green", "onIce": true, "origin": "cf60", "types":[] },
    { "type": "ca60", "name": "CA/60", "colour": "red", "onIce": true, "origin": "ca60", "types":[] },
    { "type": "cf_percent", "name": "CF%", "colour": "green", "onIce": true, "origin": "cf_percent", "types":[] },
    { "type": "cf_percent_rel", "name": "CF% Rel", "colour": "green", "onIce": true , "origin": "cf_percent_rel", "types":[]},
    { "type": "scf60", "name": "sCF/60", "colour": "green", "onIce": true, "origin": "cf60", "types":[] },
    { "type": "sca60", "name": "sCA/60", "colour": "red", "onIce": true , "origin": "ca60", "types":[]},
    { "type": "scf_percent", "name": "sCF%", "colour": "green", "onIce": true, "origin": "cf_percent", "types":[] },
    { "type": "scf_percent_rel", "name": "sCF% Rel", "colour": "green", "onIce": true, "origin": "cf_percent_rel", "types":[] },
    { "type": "onsh_percent", "name": "ON.Sh%", "colour": "green", "onIce": true, "origin": "onsh_percent", "types":[] },
    { "type": "onsv_percent", "name": "ON.Sv%", "colour": "red", "onIce": true, "origin": "onsv_percent", "types":[] }
  ]; */

  table_settings: any[] = [
    {
      name: "G/60",
      type: "g60",
      colour: "green",
      eng: "Goals Scored per 60",
      desc: "Góly vstřelené hráčem za 60 minut",
      data: "60",
      onIce: false,
      origin: "g60",
      types: [],
    },
    {
      name: "xG/60",
      type: "xg60",
      colour: "green",
      eng: "Expected Goals per 60",
      desc: "Očekávané góly hráče za 60 minut",
      data: "60",
      onIce: false,
      origin: "xg60",
      types: [],
    },
    {
      name: "SA/60",
      type: "sa60",
      colour: "green",
      eng: "Shot Assists per 60",
      desc: "Přihrávky na střely za 60 minut",
      data: "60",
      onIce: false,
      origin: "sa60",
      types: [],
    },
    {
      name: "En/60",
      type: "en60",
      colour: "green",
      eng: "Controlled Zone Entries per 60",
      desc: "Kontrolované vstupy do pásma za 60 minut",
      data: "60",
      onIce: false,
      origin: "en60",
      types: [],
    },
    {
      name: "pW→CF/60",
      type: "pwcf60",
      colour: "green",
      eng: "Pucks Won leading to Shot For per 60",
      desc: "Zisky puku vedoucí ke střele týmu za 60 minut",
      data: "60",
      onIce: true,
      origin: "pwfcf60",
      types: [],
    },
    {
      name: "CF%",
      type: "cf_percent",
      colour: "green",
      eng: "Shots For %",
      desc: "Podíl střel týmu ze součtu střel týmu i soupeře",
      data: "percent",
      onIce: true,
      origin: "cf_percent",
      types: [],
    },
    {
      name: "xGF%",
      type: "xgf_percent",
      colour: "green",
      eng: "Expected Goals For %",
      desc: "Podíl očekávaných gólů týmu ze součtu očekávaných gólů týmu i soupeře",
      data: "percent",
      onIce: true,
      origin: "xgf_percent",
      types: [],
    },
    {
      name: "GF%",
      type: "gf_percent",
      colour: "green",
      eng: "Goals For %",
      desc: "Podíl gólů týmu ze součtu gólů týmu i soupeře",
      data: "percent",
      onIce: true,
      origin: "gf_percent",
      types: [],
    },
    {
      name: "BLK/CA [%]",
      type: "blkca_pct",
      colour: "red",
      eng: "% of Opponent's Shots Blocked of all Shots Against",
      desc: "Podíl bloků střel soupeře ze všech střel soupeře",
      data: "percent",
      onIce: true,
      origin: "blkca_pct",
      types: [],
    },
  ];
  table_settings_shoda: any[] = [
    {
      name: "G/60",
      type: "g60",
      colour: "green",
      eng: "Goals Scored per 60",
      desc: "Góly vstřelené hráčem za 60 minut",
      data: "60",
      onIce: false,
      origin: "g60",
      types: [],
    },
    {
      name: "xG/60",
      type: "xg60",
      colour: "green",
      eng: "Expected Goals per 60",
      desc: "Očekávané góly hráče za 60 minut",
      data: "60",
      onIce: false,
      origin: "xg60",
      types: [],
    },
    {
      name: "SA/60",
      type: "sa60",
      colour: "green",
      eng: "Shot Assists per 60",
      desc: "Přihrávky na střely za 60 minut",
      data: "60",
      onIce: false,
      origin: "sa60",
      types: [],
    },
    {
      name: "En/60",
      type: "en60",
      colour: "green",
      eng: "Controlled Zone Entries per 60",
      desc: "Kontrolované vstupy do pásma za 60 minut",
      data: "60",
      onIce: false,
      origin: "en60",
      types: [],
    },
    {
      name: "Ex/60",
      type: "ex60",
      colour: "green",
      eng: "Controlled Zone Exits per 60",
      desc: "Kontrolované výstupy z pásma za 60 minut",
      data: "60",
      onIce: false,
      origin: "ex60",
      types: [],
    },
    {
      name: "OZ.pW→CF/60",
      type: "oz.pwcf60",
      colour: "green",
      eng: "Offensive Zone Pucks Won leading to Shot For per 60",
      desc: "Zisky puku v útočném pásmu vedoucí ke střele týmu za 60 minut",
      data: "60",
      onIce: false,
      origin: "oz.pwcf60",
      types: [],
    },
    {
      name: "EnD/60",
      type: "end60",
      colour: "red",
      eng: "Controlled Zone Entry Denials per 60",
      desc: "Zamezení kontrolovaných vstupů do pásma hráčem za 60 minut",
      data: "60",
      onIce: false,
      origin: "end60",
      types: [],
    },
    {
      name: "Pen2+-/60",
      type: "pen2_pm60",
      colour: "green",
      eng: "2-Minute Minor Penalties Plus Minus per 60",
      desc: "Rozdíl mezi menšími dvouminutovými tresty hráče a získanými hráčem za 60 minut",
      data: "60",
      onIce: false,
      origin: "pen2_pm60",
      types: [],
    },
  ];
  table_settings_gamelog: any[] = [
    {
      name: "G",
      type: "g",
      colour: "green",
      eng: "Goals Scored",
      desc: "Góly vstřelené hráčem",
      data: "count",
      onIce: false,
      origin: "g",
      types: [],
    },
    {
      name: "xG",
      type: "xg",
      colour: "green",
      eng: "Expected Goals",
      desc: "Očekávané góly hráče",
      data: "count",
      onIce: false,
      origin: "xg",
      types: [],
    },
    {
      name: "SA",
      type: "sa",
      colour: "green",
      eng: "Shot Assists",
      desc: "Přihrávky na střely",
      data: "count",
      onIce: false,
      origin: "sa",
      types: [],
    },
    {
      name: "En",
      type: "en",
      colour: "green",
      eng: "Controlled Zone Entries",
      desc: "Kontrolované vstupy do pásma",
      data: "count",
      onIce: false,
      origin: "en",
      types: [],
    },
    {
      name: "Ex",
      type: "ex",
      colour: "green",
      eng: "Controlled Zone Exits",
      desc: "Kontrolované výstupy z pásma",
      data: "count",
      onIce: false,
      origin: "ex",
      types: [],
    },
    {
      name: "OZ.pW→CF",
      type: "oz.pwcf",
      colour: "green",
      eng: "Offensive Zone Pucks Won leading to Shot For",
      desc: "Zisky puku v útočném pásmu vedoucí ke střele týmu",
      data: "count",
      onIce: false,
      origin: "oz.pwcf",
      types: [],
    },
    {
      name: "BLK/CA [%]",
      type: "blkca_pct",
      colour: "red",
      eng: "% of Opponent's Shots Blocked of all Shots Against",
      desc: "Podíl bloků střel soupeře ze všech střel soupeře",
      data: "percent",
      onIce: false,
      origin: "blkca_pct",
      types: [],
    },
    {
      name: "EnD",
      type: "end",
      colour: "red",
      eng: "Controlled Zone Entry Denials",
      desc: "Zamezení kontrolovaných vstupů do pásma hráčem",
      data: "count",
      onIce: false,
      origin: "end",
      types: [],
    },
    {
      name: "Pen2+-",
      type: "pen2_pm",
      colour: "green",
      eng: "2-Minute Minor Penalties Plus Minus",
      desc: "Rozdíl mezi menšími dvouminutovými tresty hráče a získanými hráčem",
      data: "count",
      onIce: false,
      origin: "pen2_pm",
      types: [],
    },
  ];
  table_settings_gamelog_default: any[] = [];
  table_settings_default: any[] = [];

  defined_datasest: any = [];

  table_settings_selection_by_type: any[] = [];

  data: any = [];
  data_shoda: any = [];
  data_shoda_th: any = [];
  data_csv: any = [];

  trend_table_loading: boolean = false;

  average_compare: string = "";
  averages_data: any = [];

  show_skala: boolean = false;
  filter_dataSet: string = "ALL";
  filter_dataSetShoda: string = "ALL";
  shades: any = {
    0: "#d3382e",
    10: "#ea524e",
    20: "#f0979a",
    30: "#f6cdd2",
    40: "#fbebed",
    50: "#e4f2fd",
    60: "#bbdefa",
    70: "#91cbf9",
    80: "#3196f0",
    90: "#1363c5",
  };

  data_relativeToCompetition: any = [];
  data_relativeToTeam: any = [];

  list_order: number = 0;
  skala_loading: boolean = false;

  loaded_shoda: boolean = false;
  loading_shoda: boolean = false;
  loading_shoda_vzor: boolean = false;

  canvas_type_setting: string = "similarity";
  enabled_types: string = "";

  boolProd: boolean = true;

  filterby: string = "toi";
  filterby2: string = "toi";

  shoda_sortby: string = "toi";
  shodaSort_value: string = "desc";

  filter_vyber_dat_dle: boolean = true;

  trend_limits: any[] = [
    { date_from: "", date_to: "", match_from: null, match_to: null },
  ];

  scroll_shoda_bool_shadow: boolean = false;
  shoda_scroll_box: any;

  data_rekordy: any = [];

  poradi_data_vtymu: any = [];
  poradi_data_liga: any = [];

  matches_list: any = [];
  public lineChartLabels: Label[] = [];
  public lineChartData: Array<any> = [];
  public lineChartColors: Color[] = [];

  public lineChartOptions: ChartOptions = {};
  show_canvas_tooltip: boolean = false;
  canvas_tooltip_left: number = 0;
  canvas_tooltip_top: number = 0;
  public lineChartLegend = true;
  public lineChartType = "line";
  tooltip_value: string = "";
  tooltip_date: string = "";
  tooltip_match: string = "";
  filter_graph_attribute: string = "cf60";

  constructor(
    private cd: ChangeDetectorRef,
    private formatParametersService: FormatParametersService,
    private gamelogService: GamelogService,
    private trendService: TrendService,
    private translate: TranslatePipe,
    private individualStatsService: IndividualStatsService,
    private defaultService: DefaultService,
    private zone: NgZone,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }

    this.dropdownSettings = {
      singleSelection: false,
      text: "Vybrat sezonu",
      selectAllText: "Vybrat vše",
      unSelectAllText: "Odebrat vše",
      enableSearchFilter: false,
      classes: "multiselect",
    };

    this.dropdownSettings2 = {
      singleSelection: false,
      text: "Všechny týmy",
      selectAllText: "Vybrat vše",
      unSelectAllText: "Odebrat vše",
      enableSearchFilter: false,
      classes: "multiselect",
    };

    let loaded_datasest = JSON.parse(localStorage.getItem("defined_sets"));
    loaded_datasest["players"].forEach((element, index) => {
      let sets = {
        name: Object.keys(element)[0],
        data: [],
        id: index,
      };
      for (let key in element) {
        element[key].forEach((element2) => {
          sets.data.push(element2.type);
        });
      }
      this.defined_datasest.push(sets);
    });

    this.dataLoaded = false;
    this.loading = false;

    this.table_settings_gamelog_default = cloneDeep(
      this.table_settings_gamelog
    );
    this.table_settings_default = cloneDeep(this.table_settings);

    //setTimeout(() => {
    //this.loadSampleData();
    //this.tab = "tabs";
    //this.cd.detectChanges();

    /*
      setTimeout(() => {
        this.filter_individual_player = "8944bf61-2fee-4a07-9db0-4b64c0d4a050";
        this.loadDataShoda();
        this.cd.detectChanges();
      }, 1000);
      */
    //}, 1000);

    //TRACKING
    this.trackOpenPage();
  }

  ngOnInit() {
    this.getCompetitions();
  }

  ngAfterViewInit() {
    this.checkExistParameter();
  }

  //filters -start
  getCompetitions() {
    this.seasons_list = JSON.parse(localStorage.getItem("seasons_list"));
    this.seasons_list.forEach((item, index) => {
      let next_season = parseInt(item["name"]) + 1;
      this.seasons_select_list.push({
        id: item["name"],
        itemName: item["name"] + " - " + next_season,
      });
    });
    //this.seasons_select_list.reverse();

    this.filter_season.push(this.seasons_select_list[0]);

    this.getSeasonParts();

    //this.dataLoaded = false;
    this.loading = false;
    this.cd.detectChanges();
  }

  getSeasonParts() {
    console.log("Get season Part");
    this.filter_seasonPart = "";
    this.filter_team = "ALL";
    this.teams_list = [];

    //this.dataLoaded = false;
    this.loading = false;
    //this.tab = "";

    let playoff = [];
    let base = [];
    let playout = [];
    let relegation = [];
    let preliminary = [];

    this.competitions_list = [];

    this.competitions_list = [
      {
        id: 0,
        name: this.translate.transform("zakladni_cast"),
        part: "base",
        uuids: "",
      },
      { id: 1, name: "Play-off", part: "playoff", uuids: "" },
      { id: 2, name: "Play-out", part: "playout", uuids: "" },
      {
        id: 3,
        name: this.translate.transform("baraz"),
        part: "relegation",
        uuids: "",
      },
      {
        id: 4,
        name: this.translate.transform("preliminary"),
        part: "preliminary",
        uuids: "",
      },
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
        {
          id: 0,
          name: this.translate.transform("zakladni_cast"),
          part: "base",
          uuids: this.itemsToStringApi(base),
        },
        {
          id: 1,
          name: "Play-off",
          part: "playoff",
          uuids: this.itemsToStringApi(playoff),
        },
        {
          id: 2,
          name: "Play-out",
          part: "playout",
          uuids: this.itemsToStringApi(playout),
        },
        {
          id: 3,
          name: this.translate.transform("baraz"),
          part: "relegation",
          uuids: this.itemsToStringApi(relegation),
        },
        {
          id: 4,
          name: this.translate.transform("preliminary"),
          part: "preliminary",
          uuids: this.itemsToStringApi(preliminary),
        },
      ];
    }

    this.filter_seasonPart = this.competitions_list[0]["uuids"];
    this.getTeamsData();
  }

  logging(someShit: any) {}

  getTeamsData() {
    this.filter_team = "ALL";
    this.teams_list = [];

    //this.dataLoaded = false;
    this.loading = false;
    //this.tab = "";

    let uuids = this.filter_seasonPart.split(",");

    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(
        localStorage.getItem("competition_details")
      );

      competition_details.forEach((item2, index) => {
        if (typeof item2[item] != "undefined") {
          item2[item]["teams"].forEach((team, index) => {
            //load full players seznam
            team["players"].forEach((player, index) => {
              let key = {
                uuid: player["uuid"],
                name: player["name"],
                surname: player["surname"],
                position: player["position"],
                team: team["uuid"],
                jersey: player["jersey"],
                stick: player["stick"],
                hokejczId: player["hokejczId"],
              };
              localStorage.setItem(player["uuid"], JSON.stringify(key));
            });

            //load team player list
            var index: any = this.teams_list.findIndex(
              (x) => x.uuid == team["uuid"]
            );
            if (index === -1) {
              this.teams_list.push({
                id: team["uuid"],
                itemName: team["name"],
                uuid: team["uuid"],
                name: team["name"],
                shortName: team["shortName"],
                shortcut: team["shortcut"],
                team: team["uuid"],
                players: "",
              });
            } else console.log("object already exists");
          });
        }
      });
    });
    this.vybratTeamCheck();
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
    this.filter_individual_player = "";
    //this.dataLoaded = false;
    this.loading = false;
    //this.tab = "";

    if (this.filter_opponents.includes(this.filter_team)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent == this.filter_team) {
          delete this.filter_opponents[index];
        }
      });
    }

    this.team_list_filter = [];
    if (this.filter_team == "ALL") {
      this.team_list_filter = this.teams_list;
    } else {
      this.teams_list.forEach((team) => {
        if (team.uuid != this.filter_team) {
          this.team_list_filter.push(team);
        }
      });
    }
    this.getPlayerList();
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

  dateRangeChange($event) {
    if ($event.startDate == null || $event.startDate == undefined) {
      this.filter_dateFrom = undefined;
    } else {
      let filter_dateFrom = $event.startDate.toDate();
      this.filter_dateFrom = filter_dateFrom
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");
    }

    if ($event.endDate == null || $event.endDate == undefined) {
      this.filter_dateTo = undefined;
    } else {
      let filter_dateTo = $event.endDate.toDate();
      this.filter_dateTo = filter_dateTo
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");
    }
  }

  changedOrder(event) {
    this.filterby = event;
  }

  changedOrder2(event) {
    this.shoda_sortby = event;
    this.filterby2 = event;
  }

  shodaSort(event) {
    this.shodaSort_value = event;
  }

  public itemsToString(value: Array<any> = []): string {
    console.log("Item to string");
    console.log("Value", value);
    return value
      .map((item: any) => {
        return item.itemName;
      })
      .join(", ");
  }

  public itemsToStringApi(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item;
      })
      .join(",");
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
    this.shoda_sortby = "toi";
    this.filter_individual_player_selected = this.filter_individual_player;
    this.dataSets = [];

    this.defaultService
      .getAttributesUserList(
        JSON.parse(localStorage.getItem("logged_user"))[0]["id"]
      )
      .subscribe(
        (loaded_data) => {
          this.dataSets = cloneDeep(loaded_data);

          this.defined_datasest.forEach((element) => {
            this.dataSets.push(element);
          });
        },
        (err) => {
          alert("ERROR HTDS");
        }
      );

    if (tab == "records") {
      this.loadDataRekordy();
    } else if (tab == "trend") {
      this.loadTrendData();
    } else if (tab == "tabs") {
      this.loadTabulky();
      this.player_card1 = [];
    } else if (tab == "gamelog") {
      if (this.filter_individual_player != "") {
        this.loadGamelog();
      }
    } else if (tab == "similarity") {
      this.dataLoaded = true;
    } else if (tab == "player_comparison") {
      this.more_filters = false;
      this.dataLoaded = true;
      this.getPlayerList();
    } else if (tab == "player_card") {
      this.more_filters = false;
      this.dataLoaded = true;
      this.loadPlayerCard(1);
    }
  }

  showPlayerCard(player: string, player_team: string) {
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;
    if (filter_team == "ALL") {
      filter_team = player_team;
    }

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") {
      filter_homeAway = undefined;
    }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") {
      filter_matchState = undefined;
    }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) {
      filter_opponents = undefined;
    }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") {
      filter_situationType = undefined;
    }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    let attributes_list = [];
    this.table_settings.forEach((item) => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    window.open(
      "individual-stats/" +
        filter_season +
        "/" +
        filter_seasonPart +
        "/" +
        filter_team +
        "/" +
        filter_countOfPlayer +
        "/" +
        filter_minTOI +
        "/" +
        filter_lastGames +
        "/" +
        filter_dateFrom +
        "/" +
        filter_dateTo +
        "/" +
        filter_homeAway +
        "/" +
        filter_matchState +
        "/" +
        filter_minutes_from +
        "/" +
        filter_minutes_to +
        "/" +
        filter_opponents +
        "/" +
        player +
        "/" +
        filter_situationType +
        "/" +
        filter_situationTime +
        "/" +
        attributes_list_string +
        "/" +
        "player_card",
      "_blank"
    );
    /* this.tab = "player_card";
    this.loadPlayerCard(1); */
  }

  getTableToggleAttributes(attribute: string) {
    let style = "";

    this.table_settings.forEach((item, index) => {
      if (item["type"] == attribute) {
        if (item["enabled"] == false) {
          style = "hidden";
        } else {
          style = "";
        }
      }
    });

    return style;
  }

  toggleTableSettings(canvas_type_setting: string, enabled_types: string) {
    this.tab = this.prew_tab;
    this.canvas_type_setting = canvas_type_setting;
    this.enabled_types = enabled_types;

    this.table_settings_selection_by_type = [];
    if (canvas_type_setting == "similarity") {
      this.table_settings_selection_by_type = this.table_settings_shoda;
    } else if (canvas_type_setting == "gamelog") {
      this.table_settings_selection_by_type = this.table_settings_gamelog;
    } else {
      this.table_settings_selection_by_type = this.table_settings;
    }

    if (this.toggle_table_settings == true) {
      this.toggle_table_settings = false;
    } else {
      this.toggle_table_settings = true;

      setTimeout(function () {
        this.cd.detectChanges();
      }, 400);
    }
  }

  loadData(type: string) {
    this.player_card1 = [];
    window.scroll(0, 0);
    this.showTab(type);
  }

  setCompare(player: string, player_uuid: string) {
    let short = this.getPlayerTeamShort(player_uuid);
    this.player_to_compare1 = short + " " + player;
    this.tab = "player_comparison";
    this.loadCompare(1, false);
  }

  loadCompare(playerNumber: number, reload: boolean) {
    let player = "";
    let team = "";
    if (playerNumber === 1) {
      if (this.player_card1 != "" && !reload) {
        this.player_to_load1 = this.getSelectedPlayerByName(
          this.player_to_compare1
        );
        this.player1_show = false;
        this.player1_loaded = false;

        setTimeout(() => {
          this.player1_show = true;
          this.player1_loaded = true;
          this.cd.detectChanges();
        }, 400);
      } else {
        this.player_card1 = [];
        this.player1_show = false;
        this.player1_loaded = false;
        this.player_to_load1 = this.getSelectedPlayerByName(
          this.player_to_compare1
        );
        if (this.player_to_load1 != undefined) {
          this.filter_team = this.player_to_load1.team;

          this.vybratTeamCheck();
          this.filter_individual_player = this.player_to_load1.uuid;
          this.loadComapreData(
            this.player_to_load1.uuid,
            this.player_to_load1.team,
            1
          );
        } else {
          this.player1_loaded = true;
          alert(this.translate.transform("vyberte_hrace_se_seznamu"));
        }
      }
    } else if (playerNumber === 2) {
      this.player_card2 = [];
      this.player2_loaded = false;
      this.player2_show = false;
      this.player_to_load2 = this.getSelectedPlayerByName(
        this.player_to_compare2
      );
      if (this.player_to_load2 != undefined) {
        this.loadComapreData(
          this.player_to_load2.uuid,
          this.player_to_load2.team,
          2
        );
      } else {
        this.player2_loaded = true;
        alert(this.translate.transform("vyberte_hrace_se_seznamu"));
      }
    } else if (playerNumber === 3) {
      this.player_card3 = [];
      this.player3_loaded = false;
      this.player3_show = false;
      this.player_to_load3 = this.getSelectedPlayerByName(
        this.player_to_compare3
      );
      if (this.player_to_load3 != undefined) {
        this.loadComapreData(
          this.player_to_load3.uuid,
          this.player_to_load3.team,
          3
        );
      } else {
        this.player3_loaded = true;
        alert(this.translate.transform("vyberte_hrace_se_seznamu"));
      }
    } else if (playerNumber === 4) {
      this.player_card4 = [];
      this.player4_loaded = false;
      this.player4_show = false;
      this.player_to_load4 = this.getSelectedPlayerByName(
        this.player_to_compare4
      );
      if (this.player_to_load4 != undefined) {
        this.loadComapreData(
          this.player_to_load4.uuid,
          this.player_to_load4.team,
          4
        );
      } else {
        this.player4_loaded = true;
        alert(this.translate.transform("vyberte_hrace_se_seznamu"));
      }
    }
  }

  loadComapreData(player: string, team: string, player_n: number) {
    /* let test_data = {
      "percentile": 48,
      "metrics": {
          "g60": 0.21,
          "xg60": 5.28,
          "pgf_pct": 21.43,
          "sacf_pct": 7.25,
          "xgf_sa60": 2.15,
          "gf60_rel": -0.16,
          "toi": 17558,
          "gp": 21
      },
      "percentiles": {
          "g60": 85,
          "xg60": 62,
          "pgf_pct": 71,
          "sacf_pct": 54,
          "xgf_sa60": 71,
          "gf60_rel": 55,
          "toi": 96,
          "gp": 96
      }
    }  */
    //this.player_card1.group1 = test_data

    this.individualStatsService
      .getPlayerCard(
        this.filter_seasonPart,
        team,
        player,
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
        this.filter_metricFilter_metric,
        this.filter_metricFilter_value
      )
      .subscribe((loaded_data) => {
        if (player_n === 1) {
          this.player_card1 = loaded_data;
          this.player1_loaded = true;
          this.player1_show = true;
        } else if (player_n === 2) {
          this.player_card2 = loaded_data;
          this.player2_loaded = true;
          this.player2_show = true;
        } else if (player_n === 3) {
          this.player_card3 = loaded_data;
          this.player3_loaded = true;
          this.player3_show = true;
        } else if (player_n === 4) {
          this.player_card4 = loaded_data;
          this.player4_loaded = true;
          this.player4_show = true;
        }
        this.cd.detectChanges();
        //return loaded_data
      });
  }

  getSelectedPlayerByName(selectedName: string) {
    return this.all_players.find((player) => player.name === selectedName);
  }

  loadPlayerCard(player: number) {
    //this.player_card1 = [];
    let loaded = [];

    /* let test_data = {
      "percentile": 48,
      "metrics": {
          "g60": 0.21,
          "xg60": 5.28,
          "pgf_pct": 21.43,
          "sacf_pct": 7.25,
          "xgf_sa60": 2.15,
          "gf60_rel": -0.16,
          "toi": 17558,
          "gp": 21
      },
      "percentiles": {
          "g60": 85,
          "xg60": 62,
          "pgf_pct": 71,
          "sacf_pct": 54,
          "xgf_sa60": 71,
          "gf60_rel": 55,
          "toi": 96,
          "gp": 96
      }
  } */

    console.log("player_card", this.player_card1);
    if (this.player_card1 != "") {
      this.loading = false;
    } else {
      if (this.filter_individual_player != "") {
        this.loading = true;
        console.log("filter_ind_player", this.filter_individual_player);
        this.individualStatsService
          .getPlayerCard(
            this.filter_seasonPart,
            this.filter_team,
            this.filter_individual_player,
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
            this.filter_metricFilter_metric,
            this.filter_metricFilter_value
          )
          .subscribe((loaded_data) => {
            loaded = loaded_data;
            console.log("Loaded data", loaded_data);
            this.player_card1 = loaded_data;
            //this.player_card1.group1 = test_data
            this.loading = false;
            this.cd.detectChanges();
          });
      }
    }
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

  getBirth(date: string) {
    let data = date.split("-", 3);
    if (data[2].charAt(0) == "0") {
      data[2] = data[2].substring(1, 2);
    }
    if (data[1].charAt(0) == "0") {
      data[1] = data[1].substring(1, 2);
    }
    return data[2] + "." + data[1] + "." + data[0];
  }

  checkNull(data: any) {
    if (data == null) {
      return this.translate.transform("nedostupne");
    } else {
      return data;
    }
  }

  checkStick(stick: string) {
    if (stick == "left") {
      return this.translate.transform("leva");
    } else if (stick == "right") {
      return this.translate.transform("prava");
    } else if (stick == null) {
      return this.translate.transform("nedostupne");
    }
  }

  loadTabulky() {
    this.ligovy_percetnil_active = false;
    this.showNormalTable = false;

    this.data_shoda = [];
    this.data_shoda_th = [];
    //this.filter_individual_player = "";
    this.filter_team_shoda = "";

    this.checkLoggedTime();

    this.loading = true;
    this.dataLoaded = true;

    this.loaded_shoda = false;
    this.loading_shoda = false;

    this.average_compare = "competition";
    this.show_skala = false;

    this.data = [];

    this.individualStatsService
      .getIndividualStats(
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
        this.filter_metricFilter_metric,
        this.filter_metricFilter_value
      )
      .subscribe(
        (loaded_data) => {
          //this.data = loaded_data;
          if (this.filter_team == "ALL") {
            this.team_or_all_players = true;
            let count = 0;

            /* FOR ALL POSTS */
            if (this.filter_posts == "ALL") {
              loaded_data.forEach((item, index) => {
                item["players"].forEach((item2, index2) => {
                  this.data.push({ uuid: item2["player"] });
                  this.data[count]["toi"] = item2["stats"]["toi"];
                  this.data[count]["gp"] = item2["stats"]["gp"];
                  this.table_settings.forEach((item3, index3) => {
                    this.data[count][item3["type"]] =
                      item2["stats"][item3["type"]];
                  });
                  this.data[count]["team"] = item["team"];
                  count = count + 1;
                });
              });
            }

            /* FOR ATACKERS POSTS ONLY */
            if (this.filter_posts == "FO") {
              loaded_data.forEach((item, index) => {
                item["players"].forEach((item2, index2) => {
                  if (this.getPlayerPost(item2["player"]) == "FO") {
                    this.data.push({ uuid: item2["player"] });
                    this.data[count]["toi"] = item2["stats"]["toi"];
                    this.data[count]["gp"] = item2["stats"]["gp"];
                    this.table_settings.forEach((item3, index3) => {
                      this.data[count][item3["type"]] =
                        item2["stats"][item3["type"]];
                    });
                    this.data[count]["team"] = item["team"];
                    count = count + 1;
                  }
                });
              });
            }

            /* FOR DEFENDERS POSTS */
            if (this.filter_posts == "DE") {
              loaded_data.forEach((item, index) => {
                item["players"].forEach((item2, index2) => {
                  if (this.getPlayerPost(item2["player"]) == "DE") {
                    this.data.push({ uuid: item2["player"] });
                    this.data[count]["toi"] = item2["stats"]["toi"];
                    this.data[count]["gp"] = item2["stats"]["gp"];
                    this.table_settings.forEach((item3, index3) => {
                      this.data[count][item3["type"]] =
                        item2["stats"][item3["type"]];
                    });
                    this.data[count]["team"] = item["team"];
                    count = count + 1;
                  }
                });
              });
            }

            this.loading = false;
            this.dataLoaded = true;

            this.showNormalTable = true;
            this.cd.detectChanges();
            this.changedOrder2("toi");

            /* setTimeout(() => {

          this.showNormalTable = true;
          setTimeout(() => {
            this.cd.detectChanges();
          }, 100);
        }, 100); */
          } else {
            this.team_or_all_players = false;

            let count = 0;

            /* FOR ALL POSTS */
            if (this.filter_posts == "ALL") {
              loaded_data.forEach((item, index) => {
                this.data.push({ uuid: item["player"] });
                this.data[count]["toi"] = item["stats"]["toi"];
                this.data[count]["gp"] = item["stats"]["gp"];
                this.table_settings.forEach((item2, index2) => {
                  this.data[count][item2["type"]] =
                    item["stats"][item2["type"]];
                });
                this.data[count]["team"] = this.filter_team;
                count = count + 1;
              });
            }

            /* FOR ATACKERS POSTS ONLY */
            if (this.filter_posts == "FO") {
              loaded_data.forEach((item, index) => {
                if (this.getPlayerPost(item["player"]) == "FO") {
                  this.data.push({ uuid: item["player"] });
                  this.data[count]["toi"] = item["stats"]["toi"];
                  this.data[count]["gp"] = item["stats"]["gp"];
                  this.table_settings.forEach((item2, index2) => {
                    this.data[count][item2["type"]] =
                      item["stats"][item2["type"]];
                  });
                  this.data[count]["team"] = this.filter_team;
                  count = count + 1;
                }
              });
            }

            /* FOR DEFENDERS POSTS ONLY*/
            if (this.filter_posts == "DE") {
              loaded_data.forEach((item, index) => {
                if (this.getPlayerPost(item["player"]) == "DE") {
                  this.data.push({ uuid: item["player"] });
                  this.data[count]["toi"] = item["stats"]["toi"];
                  this.data[count]["gp"] = item["stats"]["gp"];
                  this.table_settings.forEach((item2, index2) => {
                    this.data[count][item2["type"]] =
                      item["stats"][item2["type"]];
                  });
                  this.data[count]["team"] = this.filter_team;
                  count = count + 1;
                }
              });
            }

            this.data_csv = this.data;

            this.loading = false;
            this.dataLoaded = true;

            setTimeout(() => {
              this.showNormalTable = true;
              setTimeout(() => {
                this.cd.detectChanges();
              }, 100);
            }, 100);
          }
          this.getPlayerList();
        },
        (err) => {
          //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          //this.defaultService.logout();
          //window.location.reload();
        }
      );
  }

  loadDataRekordy() {
    this.loading = true;
    this.dataLoaded = true;

    this.loaded_rekordy = false;

    this.individualStatsService
      .getIndividualStatRecords(
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
        this.table_settings_gamelog,
        this.filter_metricFilter_metric,
        this.filter_metricFilter_value
      )
      .subscribe(
        (loaded_data) => {
          if (this.filter_team == "ALL") {
            this.loading = false;
            this.dataLoaded = true;

            setTimeout(() => {
              this.cd.detectChanges();
            }, 1000);
          } else {
            this.team_or_all_players = false;

            this.loading = false;
            this.dataLoaded = true;

            setTimeout(() => {
              this.cd.detectChanges();
            }, 1000);
          }

          this.data_rekordy = loaded_data;

          setTimeout(() => {
            this.loaded_rekordy = true;
            this.cd.detectChanges();
          }, 1000);
        },
        (err) => {
          //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          //this.defaultService.logout();
          //window.location.reload();
        }
      );
  }

  loadTrendData() {
    this.checkLoggedTime();

    this.loading = true;
    this.dataLoaded = true;
    if (
      this.filter_individual_player != undefined &&
      this.filter_individual_player != ""
    ) {
      this.trendService
        .getTrendIndividual(
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
          this.filter_individual_player,
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
            this.data_graph = loaded_data;
            this.renderGraph();
            //this.loadTrendDataLine();
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.loading = false;
    }
  }

  loadTrendDataLine() {
    this.trend_table_loading = true;
    let periodBy = "";
    if (this.filter_vyber_dat_dle == false) {
      periodBy = "calendar";
    } else {
      periodBy = "matches";
    }
    this.data_trend = [];

    this.trend_limits.forEach((item, index) => {
      let period_date_from = item["date_from"];
      let period_date_to = item["date_to"];
      let period_match_from = item["match_from"];
      let period_match_to = item["match_to"];
      let matches_list_range = this.matches_list.slice(
        period_match_from - 1,
        period_match_to
      );
      this.trendService
        .getIndividualStatsTrend(
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
          undefined,
          undefined,
          periodBy,
          period_date_from,
          period_date_to,
          matches_list_range
        )
        .subscribe(
          (loaded_data) => {
            loaded_data.forEach((stat_row) => {
              if (stat_row["player"] == this.filter_individual_player) {
                let data_edited = stat_row["stats"];
                data_edited["id"] = index;
                this.data_trend.push(data_edited);
              }
            });

            let data_empty = {};
            if (this.data_trend.length == 0) {
              this.table_settings.forEach((item) => {
                data_empty[item["type"]] = 0;
                data_empty["toi"] = 0;
              });
              this.data_trend.push(data_empty);
            }

            this.loading = false;
            this.dataLoaded = true;
            this.trend_table_loading = false;
          },
          (err) => {}
        );
    });
  }

  filterVyberDatDle(actual_value: boolean) {
    this.data_gamelog = [];
    this.trend_limits = [];
    this.trend_limits = [
      { date_from: "", date_to: "", match_from: null, match_to: null },
    ];

    this.trend_date_from = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ];
    this.trend_date_to = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
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

  addNewPeriod() {
    if (this.filter_vyber_dat_dle == false) {
      if (
        this.trend_limits[this.trend_limits.length - 1]["date_from"] == "" &&
        this.trend_limits[this.trend_limits.length - 1]["date_to"] == ""
      ) {
        alert(
          "Další řádek se přidá ve chvíli, kdy budou předchozí filtry vyplněny."
        );
      } else {
        this.trend_limits.push({
          date_from: "",
          date_to: "",
          match_from: null,
          match_to: null,
        });
      }
    } else {
      if (
        this.trend_limits[this.trend_limits.length - 1]["match_from"] == null &&
        this.trend_limits[this.trend_limits.length - 1]["match_to"] == null
      ) {
        alert(
          "Další řádek se přidá ve chvíli, kdy budou předchozí filtry vyplněny."
        );
      } else {
        this.trend_limits.push({
          date_from: "",
          date_to: "",
          match_from: null,
          match_to: null,
        });
      }
    }

    console.log("Trends Limits");
  }

  changeTrendDateFrom(date: string, index: number) {
    this.trend_limits[index]["date_from"] = date;
  }

  changeTrendDateTo(date: string, index: number) {
    this.trend_limits[index]["date_to"] = date;
  }

  changeTrendMatchFrom(match: number, index: number) {
    this.trend_limits[index]["match_from"] = match;
  }

  changeTrendMatchTo(match: number, index: number) {
    this.trend_limits[index]["match_to"] = match;
  }

  renderGraph() {
    let months = [];

    this.data_graph.forEach((item) => {
      this.matches_list.push(item["match"]);

      let year = new Date(item["date"]).getFullYear();
      let month = new Date(item["date"]).getMonth() + 1;
      let month_final = "";
      if (month < 10) {
        month_final = "0" + month;
      } else {
        month_final = String(month);
      }

      months.push(year + "-" + month_final + "-01");
    });
    months = months.filter(function (item, pos) {
      return months.indexOf(item) == pos;
    });

    let min_date = months[0];
    let max_date = months.slice(-1).pop();
    max_date = new Date(max_date);
    max_date.setMonth(max_date.getMonth() + 1);
    max_date =
      max_date.getUTCFullYear() +
      "-" +
      ("00" + (max_date.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("00" + max_date.getUTCDate()).slice(-2);
    this.lineChartLabels = [];
    months.forEach((item) => {
      this.lineChartLabels.push(new Date(item).toLocaleString());
    });

    //data
    let data_raw = [];
    let data = [];
    //console.log(JSON.stringify(this.data_graph));

    this.data_graph.forEach((item) => {
      let attribute_value = 0;

      if (item["stats"] == null) {
        attribute_value = undefined;
      } else {
        attribute_value = item["stats"][this.filter_graph_attribute];
      }

      //console.log(attribute_value);

      data.push({
        t: new Date(item["date"]),
        y: attribute_value,
      });

      if (item["stats"] == null) {
        //data_raw.push(undefined);
      } else {
        data_raw.push(item["stats"][this.filter_graph_attribute]);
      }
    });

    let y_data_min = 0;

    var largest = Math.max.apply(Math, data_raw);
    let y_data_max = Math.ceil(largest);

    let y_ticks = {
      beginAtZero: true,
      min: y_data_min,
      max: y_data_max,
    };

    this.lineChartData = [
      {
        label: this.filter_graph_attribute,
        data: data,
      },
    ];
    this.lineChartColors = [
      {
        backgroundColor: "transparent",
        borderColor: "#1d5cff",
        borderWidth: 3,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#151d22",
        pointHoverBackgroundColor: "#151d22",
        pointHoverBorderColor: "#151d22",
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
                  "/" +
                  new Date(value).getFullYear()
                );
              },
            },
            type: "time",
            distribution: "linear",
            time: {
              unit: "month",
              min: min_date,
              max: max_date,
              displayFormats: {
                day: "YYYY-MM-DD",
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
              zeroLineColor: "#151d22",
            },
          },
        ],
      },
      tooltips: {
        enabled: false,
        custom: (tooltipModel) => {
          var tooltipEl = this.lol;

          if (!tooltipEl) {
            this.show_canvas_tooltip = true;
            if (tooltipModel.dataPoints !== undefined) {
              const date = tooltipModel.dataPoints[0].xLabel;
              const value = tooltipModel.dataPoints[0].yLabel;
              this.tooltip_value = value;
              this.tooltip_date = date;

              var sql_date;
              sql_date = new Date(date);
              sql_date =
                sql_date.getUTCFullYear() +
                "-" +
                ("00" + (sql_date.getUTCMonth() + 1)).slice(-2) +
                "-" +
                ("00" + sql_date.getUTCDate()).slice(-2);

              //console.log(JSON.stringify(this.data_graph));
              this.data_graph.forEach((item) => {
                if (item["date"] == sql_date) {
                  this.tooltip_match =
                    this.getTeamName(item["homeTeam"]) +
                    " - " +
                    this.getTeamName(item["awayTeam"]) +
                    " " +
                    item["score"]["home"] +
                    ":" +
                    item["score"]["away"] +
                    "" +
                    this.getGameState(item["score"]["state"]);
                }
              });
            }
          }

          if (tooltipModel.opacity === 0) {
            this.show_canvas_tooltip = false;
          }

          if (tooltipModel.body) {
            //alert(JSON.stringify(tooltipModel.body));
          }

          var position = this.chart.nativeElement.getBoundingClientRect();
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

  loadGamelog() {
    this.showNormalTable = false;
    this.loading = true;
    this.dataLoaded = true;
    this.shoda_sortby = "rank";
    this.tab = "gamelog";
    this.data_gamelog = [];

    //console.log("table Settings", this.table_settings_gamelog)

    this.gamelogService
      .getGamelog(
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
        this.filter_individual_player,
        "",
        "",
        "",
        "",
        "",
        "on",
        "",
        "",
        "",
        "",
        "",
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings_gamelog
      )
      .subscribe(
        (loaded_data) => {
          this.data_gamelog = loaded_data;
          //console.log("Loaded Data", loaded_data)
          this.data_gamelog.forEach((item, index) => {
            //console.log("index")
            this.data_gamelog[index]["uuid"] = item["uuid"];

            this.data_gamelog[index]["homeTeamUuid"] =
              item["info"]["homeTeamUuid"];
            this.data_gamelog[index]["awayTeamUuid"] =
              item["info"]["awayTeamUuid"];
            this.data_gamelog[index]["date"] = item["info"]["date"];
            this.data_gamelog[index]["home_score"] =
              item["info"]["score"]["home"];
            this.data_gamelog[index]["away_score"] =
              item["info"]["score"]["away"];
            this.data_gamelog[index]["state_score"] =
              item["info"]["score"]["state"];

            this.table_settings_gamelog.forEach((item2, index2) => {
              this.data_gamelog[index][item2["type"]] =
                item["stats"][item2["type"]];
            });

            this.data_gamelog[index]["toi"] = item["stats"]["toi"];
          });

          this.loading = false;
          this.showNormalTable = true;
          this.cd.detectChanges();

          console.log("data_gamelog", this.data_gamelog);

          /* setTimeout(() => {


        setTimeout(() => {
          this.cd.detectChanges();
        }, 100);
      }, 1000); */
        },
        (err) => {
          //window.location.reload();
        }
      );
  }

  getGameState(state: string) {
    let game_state = "";

    if (state == "normal") {
      game_state = "";
    } else if (state == "overtime") {
      game_state = "p";
    } else if (state == "shooting") {
      game_state = "sn";
    }
    return game_state;
  }

  getTeamName(uuid: string) {
    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        shortcut = item["shortcut"];
      }
    });

    return shortcut;
  }

  getTeamName2(uuid: string) {
    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        shortcut = item["name"];
      }
    });

    return shortcut;
  }

  stringy(text: string) {
    return JSON.stringify(text);
  }

  getPlayerList() {
    this.players_list = [];
    this.all_players = [];

    let uuids = this.filter_seasonPart.split(",");

    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(
        localStorage.getItem("competition_details")
      );

      competition_details.forEach((loaded_data, index) => {
        if (typeof loaded_data[item] != "undefined") {
          loaded_data[item]["teams"].forEach((team, index) => {
            let short = this.getTeamNameShortcut(team.uuid);
            team["players"].forEach((player, index) => {
              if (player["position"] != "GK") {
                this.all_players.push({
                  name: short + " " + player["surname"] + " " + player["name"],
                  uuid: player.uuid,
                  team: team.uuid,
                });
              }
            });

            if (team["uuid"] == this.filter_team) {
              team["players"].forEach((player, index) => {
                var index: any = this.players_list.findIndex(
                  (x) => x.uuid == player["uuid"]
                );
                if (index === -1) {
                  player["short_name"] =
                    player["surname"] + " " + player["name"][0] + ".";
                  if (player["position"] != "GK") {
                    this.players_list.push(player);
                  }
                } else console.log("object already exists");
              });
            }
          });
        }
      });
    });

    this.players_list.sort(this.sortBy("surname", false));
    this.all_players.sort(this.sortBy("name", false));

    if (this.filter_team == this.filter_opponent) {
      this.filter_opponent = "";
    }
    this.cd.detectChanges();
  }

  changeShodaFilter() {
    this.loaded_shoda = false;
    this.loading_shoda = false;

    this.data_shoda = [];
    this.data_shoda_th = [];
  }

  getPlayerList2() {
    this.players_list = [];

    let uuids = this.filter_seasonPart.split(",");

    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(
        localStorage.getItem("competition_details")
      );

      competition_details.forEach((loaded_data, index) => {
        if (typeof loaded_data[item] != "undefined") {
          loaded_data[item]["teams"].forEach((team, index) => {
            if (team["uuid"] == this.filter_team_shoda) {
              team["players"].forEach((player, index) => {
                var index: any = this.players_list.findIndex(
                  (x) => x.uuid == player["uuid"]
                );
                if (index === -1) {
                  player["short_name"] =
                    player["surname"] + " " + player["name"][0] + ".";
                  if (player["position"] != "GK") {
                    this.players_list.push(player);
                  }
                } else console.log("object already exists");
              });
            }
          });
        }
      });
    });

    this.players_list.sort(this.sortBy("surname", false));

    this.cd.detectChanges();
  }

  sortBy(key, reverse) {
    var moveSmaller = reverse ? 1 : -1;
    var moveLarger = reverse ? -1 : 1;
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

  loadDataShoda() {
    this.value_of_attribute = [];
    this.table_settings_shoda.forEach((item) => {
      this.value_of_attribute.push({ value: undefined, type: "" });
    });

    this.loaded_shoda = false;
    this.loading_shoda = true;

    this.data_shoda = [];
    this.data_shoda_th = [];

    if (this.filter_team_shoda == "") {
      this.filter_team_shoda = this.filter_team;
    }

    if (
      this.filter_individual_player != "" &&
      this.filter_individual_player != "vzorovy_hrac"
    ) {
      this.individualStatsService
        .getIndividualStats(
          this.filter_seasonPart,
          this.filter_team_shoda,
          this.filter_lastGames,
          this.filter_countOfPlayer,
          this.filter_matchState,
          this.filter_homeAway,
          this.filter_opponents,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_minutes_from,
          this.filter_minutes_to,
          0,
          this.filter_situationType,
          this.filter_situationTime,
          this.table_settings_shoda,
          this.filter_metricFilter_metric,
          this.filter_metricFilter_value
        )
        .subscribe(
          (loaded_data) => {
            //this.data = loaded_data;

            this.data_shoda_th = [];

            let count = 0;
            loaded_data.forEach((item, index) => {
              if (item["player"] == this.filter_individual_player) {
                this.data_shoda_th.push({ uuid: item["player"] });
                this.data_shoda_th[count]["toi"] = item["stats"]["toi"];
                this.data_shoda_th[count]["gp"] = item["stats"]["gp"];
                this.table_settings_shoda.forEach((item2, index2) => {
                  this.data_shoda_th[count][item2["type"]] =
                    item["stats"][item2["type"]];
                });
                this.data_shoda_th[count]["team"] = this.filter_team;

                this.table_settings_shoda.forEach((item2, index2) => {
                  this.data_shoda_th[count][item2["type"] + "_rank"] = 10000;
                });

                this.data_shoda_th[count]["rank"] = 10000;

                count = count + 1;
              }
            });

            this.individualStatsService
              .getIndividualStatsSimilar(
                this.filter_seasonPart,
                this.filter_team_shoda,
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
                this.table_settings_shoda,
                this.filter_individual_player,
                this.filter_shoda_stick,
                this.filter_metricFilter_metric,
                this.filter_metricFilter_value
              )
              .subscribe(
                (loaded_data) => {
                  this.data_shoda = [];

                  //console.log(JSON.stringify(loaded_data));

                  let count = 0;
                  loaded_data["topMatches"].forEach((item) => {
                    this.data_shoda.push({ uuid: item["player"] });

                    //console.log(JSON.stringify(item["stats"]));
                    this.data_shoda[count]["toi"] = item["stats"]["toi"];
                    this.data_shoda[count]["gp"] = item["stats"]["gp"];
                    this.table_settings_shoda.forEach((item2, index2) => {
                      this.data_shoda[count][item2["type"]] =
                        item["stats"][item2["type"]];
                    });

                    this.table_settings_shoda.forEach((item2, index2) => {
                      this.data_shoda[count][item2["type"] + "_rank"] =
                        item["rank"]["metrics"][item2["type"]];
                    });

                    this.data_shoda[count]["rank"] = item["rank"]["total"];

                    this.data_shoda[count]["deviation"] =
                      item["rank"]["deviation"];
                    this.data_shoda[count]["positiveDeviation"] =
                      item["rank"]["positiveDeviation"];
                    this.data_shoda[count]["negativeDeviation"] =
                      item["rank"]["negativeDeviation"];
                    this.data_shoda[count]["averageDeviation"] =
                      item["rank"]["averageDeviation"];
                    this.data_shoda[count]["deviation_percent"] =
                      (item["rank"]["positiveDeviation"] /
                        item["rank"]["deviation"]) *
                      100;

                    this.data_shoda[count]["team"] = item["team"];

                    this.data_shoda[count]["post"] = this.getPlayerPost(
                      item["player"]
                    );

                    count = count + 1;
                  });

                  //console.log(JSON.stringify(this.data_shoda));

                  this.loaded_shoda = true;
                  this.loading_shoda = false;

                  this.cd.detectChanges();
                },
                (err) => {
                  //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                  //this.defaultService.logout();
                  //window.location.reload();
                }
              );
          },
          (err) => {
            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
            //this.defaultService.logout();
            //window.location.reload();
          }
        );
    } else if (this.filter_individual_player == "vzorovy_hrac") {
      this.loaded_shoda = true;
      this.loading_shoda = false;
      this.cd.detectChanges();
    } else {
    }
  }

  loadVzorovyHrac() {
    //alert(JSON.stringify(this.value_of_attribute));

    this.data_shoda = [];

    let problem_reason = "";

    let can_load = true;
    this.loading_shoda_vzor = true;
    this.value_of_attribute.forEach((item) => {
      if (isNaN(item.value)) {
        can_load = false;
        problem_reason = "neni_cislo";
        this.loading_shoda_vzor = false;
      }

      if (item.value == undefined) {
        can_load = false;
        problem_reason = "prazdne";
        this.loading_shoda_vzor = false;
      }
    });

    if (can_load == true) {
      this.individualStatsService
        .getIndividualStatsSimilarByNumbers(
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
          this.table_settings_shoda,
          this.filter_shoda_stick,
          this.value_of_attribute,
          this.filter_metricFilter_metric,
          this.filter_metricFilter_value
        )
        .subscribe(
          (loaded_data) => {
            let count = 0;
            loaded_data["topMatches"].forEach((item) => {
              this.data_shoda.push({ uuid: item["player"] });

              //console.log(JSON.stringify(item));

              this.data_shoda[count]["toi"] = item["stats"]["toi"];
              this.data_shoda[count]["gp"] = item["stats"]["gp"];
              this.table_settings_shoda.forEach((item2, index2) => {
                this.data_shoda[count][item2["type"]] =
                  item["stats"][item2["type"]];
              });

              this.table_settings_shoda.forEach((item2, index2) => {
                this.data_shoda[count][item2["type"] + "_rank"] =
                  item["rank"]["metrics"][item2["type"]];
              });

              this.data_shoda[count]["rank"] = item["rank"]["total"];

              this.data_shoda[count]["deviation"] = item["rank"]["deviation"];
              this.data_shoda[count]["positiveDeviation"] =
                item["rank"]["positiveDeviation"];
              this.data_shoda[count]["negativeDeviation"] =
                item["rank"]["negativeDeviation"];
              this.data_shoda[count]["averageDeviation"] =
                item["rank"]["averageDeviation"];

              this.data_shoda[count]["team"] = item["team"];

              this.data_shoda[count]["post"] = this.getPlayerPost(
                item["player"]
              );

              count = count + 1;
            });
            //console.log(JSON.stringify(this.data_shoda));

            this.loaded_shoda = true;
            this.loading_shoda = false;
            this.loading_shoda_vzor = false;

            this.cd.detectChanges();
          },
          (err) => {
            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
            //this.defaultService.logout();
            //window.location.reload();
          }
        );
    } else {
      if (problem_reason == "prazdne") {
        alert(
          "Je nutné vyplnit všechny hodnoty u všech atributů. Jestli nějaký atribut nechcete použít, odstraňte ho pomocí tlačítka '{{'vybrat_vlastni_data' | translate}}'."
        );
      }

      if (problem_reason == "neni_cislo") {
        alert("Všechny hodnoty musí být číslo.");
      }
    }
  }

  loadSkala() {
    this.skala_loading = true;

    this.data_relativeToCompetition = [];
    this.data_relativeToTeam = [];

    /*  this.individualStatsService.getIndividualStatsRelativeTo(this.filter_seasonPart, this.filter_team, this.filter_lastGames, this.filter_countOfPlayer, this.filter_matchState, this.filter_homeAway, this.filter_opponents, this.filter_dateFrom, this.filter_dateTo, this.filter_minutes_from, this.filter_minutes_to, this.filter_minTOI, this.filter_situationType, this.filter_situationTime, "competition", this.table_settings).subscribe(loaded_data => {
      this.data_relativeToCompetition = loaded_data; */

    this.individualStatsService
      .getIndividualStatsRelativeTo(
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
        "team",
        this.table_settings
      )
      .subscribe(
        (loaded_data) => {
          this.data_relativeToTeam = loaded_data;
          this.data_relativeToCompetition = loaded_data;

          if (this.team_or_all_players == true) {
            let temporary_data_relativeToTeam = [];
            this.data_relativeToTeam.forEach((item, index) => {
              //console.log(JSON.stringify(item));
              item["players"].forEach((item2) => {
                let player_row = item2;
                item2["team"] = item["team"];
                temporary_data_relativeToTeam.push(item2);
              });
            });

            let temporary_data_relativeToCompetition = [];
            this.data_relativeToCompetition.forEach((item, index) => {
              item["players"].forEach((item2) => {
                let player_row = item2;
                item2["team"] = item["team"];
                temporary_data_relativeToCompetition.push(item2);
              });
            });

            this.data_relativeToCompetition =
              temporary_data_relativeToCompetition;
            this.data_relativeToTeam = temporary_data_relativeToTeam;


            this.updatePercentileData ();

            this.skala_loading = false;
            this.show_skala = true;
          } else {
            let temporary_data_relativeToTeam = [];
            this.data_relativeToTeam.forEach((item, index) => {
              let player_row = item;
              item["team"] = this.filter_team;
              temporary_data_relativeToTeam.push(item);
            });

            let temporary_data_relativeToCompetition = [];
            this.data_relativeToCompetition.forEach((item, index) => {
              let player_row = item;
              item["team"] = this.filter_team;
              temporary_data_relativeToCompetition.push(item);
            });

            this.data_relativeToCompetition =
              temporary_data_relativeToCompetition;

            this.updatePercentileData ();
            this.data_relativeToTeam = temporary_data_relativeToTeam;

            //console.log(JSON.stringify(temporary_data_relativeToTeam));
            this.skala_loading = false;
            this.show_skala = true;
            console.log("DATA TEST");
            this.cd.detectChanges();
          }

          this.cd.detectChanges();
        },
        (err) => {
          //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          //this.defaultService.logout();
          //window.location.reload();
        }
      );

    /* }, err => {
      //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
      //this.defaultService.logout();
      //window.location.reload();
    }); */

    //this.sendEvent(this.filter_team);
  }


  updatePercentileData(){
    this.data.forEach( x=> {
      let selectedPlayer = this.data_relativeToCompetition.filter(
        y=> (y.team==x.team  &&  y.player==x.uuid )
        );
      x["summaryPercentile"] = selectedPlayer[0].stats["summaryPercentile"]
    });  

  }

  getPlayerPost(uuid: string) {
    if (uuid != undefined) {
      if (localStorage.getItem(uuid) != null) {
        return JSON.parse(localStorage.getItem(uuid))["position"];
      } else {
        return "no-post";
      }
    } else {
      return "no-post";
    }
  }

  getPlayerStick(uuid: string) {
    if (uuid != undefined) {
      if (localStorage.getItem(uuid) != null) {
        if (JSON.parse(localStorage.getItem(uuid))["stick"] == "left") {
          return "L";
        } else if (JSON.parse(localStorage.getItem(uuid))["stick"] == "right") {
          return "R";
        } else {
          return "?";
        }
      } else {
        return "?";
      }
    } else {
      return "?";
    }
  }

  getPlayerName(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return "" + uuid;
    } else {
      let surname = JSON.parse(localStorage.getItem(uuid))["surname"];
      let name = JSON.parse(localStorage.getItem(uuid))["name"];

      if (surname == "Klima") {
        let name2 = "";
        //console.log(name);
        if (name == "Kelly Philip") {
          name2 = "Kl.";
        }
        if (name == "Kevin") {
          name2 = "Kv.";
        }

        return surname + " " + name2;
      } else {
        return surname + " " + name[0] + ".";
      }
    }
  }
  getPlayerHokejCZid(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return "" + uuid;
    } else {
      let hokejczId = JSON.parse(localStorage.getItem(uuid))["hokejczId"];
      if (hokejczId == null) {
        hokejczId = "?";
      }
      return hokejczId;
    }
  }

  active_skala() {
    this.loadSkala();
  }

  getMinMax(cmp, arr, attr) {
    var val = arr[0][attr];
    for (var i = 1; i < arr.length; i++) {
      val = cmp(val, arr[i][attr]);
    }
    return val;
  }

  getSkalaColour(player_uuid: string, attribute: string, team: string) {
    this.average_compare = "competition";
    var data = [];
    var cell_value = "";

    if (this.average_compare == "team") {
      data = this.data_relativeToTeam;
    } else if (this.average_compare == "competition") {
      data = this.data_relativeToCompetition;
    }

    if (this.show_skala) {
      data.forEach((item) => {
        if (item["player"] == player_uuid && item["team"] == team) {
          let value = item["stats"][attribute];
          if (value >= 0 && value <= 10) {
            cell_value = "cell-0";
          } else if (value > 10 && value <= 20) {
            cell_value = "cell-1";
          } else if (value > 20 && value <= 30) {
            cell_value = "cell-2";
          } else if (value > 30 && value <= 40) {
            cell_value = "cell-3";
          } else if (value > 40 && value <= 50) {
            cell_value = "cell-4";
          } else if (value > 50 && value <= 60) {
            cell_value = "cell-5";
          } else if (value > 60 && value <= 70) {
            cell_value = "cell-6";
          } else if (value > 70 && value <= 80) {
            cell_value = "cell-7";
          } else if (value > 80 && value <= 90) {
            cell_value = "cell-8";
          } else if (value > 90 && value <= 100) {
            cell_value = "cell-9";
          }
        }
      });

      return cell_value;
    }
  }

  getSkalaNumber(player_uuid: string, attribute: string, team: string) {
    this.average_compare = "competition";
    var data = [];
    var cell_value = "";

    if (this.average_compare == "team") {
      data = this.data_relativeToTeam;
    } else if (this.average_compare == "competition") {
      data = this.data_relativeToCompetition;
    }

    if (this.show_skala) {
      data.forEach((item) => {
        if (item["player"] == player_uuid && item["team"] == team) {
          cell_value = String(item["stats"][attribute]);
        }
      });

      return cell_value;
    }
  }

  getPlayerTeamShort(uuid: string) {
    if (uuid != null || uuid != undefined) {
      if (localStorage.getItem(uuid) != undefined) {
        uuid = JSON.parse(localStorage.getItem(uuid))["team"];
        //console.log(JSON.stringify(uuid));
        //console.log(JSON.stringify(this.teams_list));
        let team = "";
        let keepGoing = true;
        this.teams_list.forEach((item, index) => {
          if (keepGoing) {
            if (item["team"] == uuid) {
              //console.log(JSON.stringify(item));
              keepGoing = false;
              team = item["shortcut"];
            } else {
              team = "";
            }
          }
        });

        return team;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  getTeamLogo(uuid: string) {
    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        shortcut = item["shortcut"];
      }
    });

    return this.getPlayerTeamLogo(shortcut);
  }

  getTeamUUID(uuid: string) {
    if (uuid != null || uuid != undefined) {
      if (localStorage.getItem(uuid) != undefined) {
        uuid = JSON.parse(localStorage.getItem(uuid))["team"];
        let team = "";
        let keepGoing = true;
        this.teams_list.forEach((item, index) => {
          if (keepGoing) {
            if (item["team"] == uuid) {
              keepGoing = false;
              team = item["uuid"];
            } else {
              team = "";
            }
          }
        });

        return team;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  getTeamShort(team_uuid: string) {
    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == team_uuid) {
        shortcut = item["shortcut"];
      }
    });
    return shortcut;
  }

  getPlayerTeamLogo(team_hash: string) {
    let team_shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == team_hash) {
        team_shortcut = item["shortcut"];
      }
    });
    if (team_shortcut == "MHK") {
      return "../assets/logos/29579d3e-1502-4ec0-80e3-f5ead6d22fb0.png";
    } else if (team_shortcut == "OLO") {
      return "../assets/logos/71760283-d630-4c7f-b52f-e0b193a622cd.png";
    } else if (team_shortcut == "TRI") {
      return "../assets/logos/55d9085b-58b5-4c52-bc73-42fdc106c944.png";
    } else if (team_shortcut == "CHM") {
      return "../assets/logos/1460b1ac-a5a9-4819-997e-afa26b512299.png";
    } else if (team_shortcut == "LIT") {
      return "../assets/logos/3c08ada2-3fd6-49b7-974d-2db9c92676ac.png";
    } else if (team_shortcut == "LIB") {
      return "../assets/logos/3c85029c-140f-4971-96d2-76a95f429c2b.png";
    } else if (team_shortcut == "PLZ") {
      return "../assets/logos/524e1ff0-e670-42d9-93aa-8ba35bb94942.png";
    } else if (team_shortcut == "PCE") {
      return "../assets/logos/f9b85077-6ea5-4769-9bba-27d5da8e97bd.png";
    } else if (team_shortcut == "ZLN") {
      return "../assets/logos/eec5f929-a5bb-4bf4-8e69-34d0a274c661.png";
    } else if (team_shortcut == "VIT") {
      return "../assets/logos/99f32b0e-ddcc-4330-8ef5-66c8bbdd22ba.png";
    } else if (team_shortcut == "SPA") {
      return "../assets/logos/9af95c87-b24b-411b-a615-c1d86861fca5.png";
    } else if (team_shortcut == "KOM") {
      return "../assets/logos/69802e5a-b9de-4bc0-8001-f5e11d0f2048.png";
    } else if (team_shortcut == "MBL") {
      return "../assets/logos/b4a4a812-fd88-47e4-a626-be3300b390cc.png";
    } else if (team_shortcut == "JIH") {
      return "../assets/logos/e3bf29fb-e963-4922-9064-1b6101047a9e.png";
    } else if (team_shortcut == "KVA") {
      return "../assets/logos/302630a7-3aff-4303-9539-951bdd605ab9.png";
    } else if (team_shortcut == "KLA") {
      return "../assets/logos/42bafa4d-5e60-4f00-81c5-4f44ffa55927.png";
    } else if (team_shortcut == "CEB") {
      return "../assets/logos/732e68fc-13c7-45a8-bb51-5eeab8b10283.png";
    }
  }
  /* formationOverviewLink(playerName,teamName) {

    const tab = "kombinave_hracu";
    const filter_season = this.filter_season;
    const filter_seasonPart = this.filter_seasonPart;
    const filter_countOfPlayer = this.filter_countOfPlayer;
    const filter_minTOI = this.filter_minTOI;
    const filter_homeAway = this.filter_homeAway;
    const filter_lastGames = this.filter_lastGames;
    const selected_daterange = this.selected_daterange;
    const filter_matchState = this.filter_matchState;
    const filter_minutes_from = this.filter_minutes_from;
    const filter_minutes_to = this.filter_minutes_to;

    return "formations-overview/" +
    playerName + "/" +
    teamName +
    tab + "/" +
    filter_season + "/" +
    filter_seasonPart + "/" +
    filter_countOfPlayer + "/" +
    filter_minTOI + "/" +
    filter_homeAway + "/" +
    filter_lastGames + "/" +
    selected_daterange + "/" +
    filter_matchState + "/" +
    filter_minutes_from + "/" +
    filter_minutes_to;
  } */

  formationOverviewLink(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    player_team: string,
    page: string
  ) {
    //SEASON
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;
    if (filter_team == "ALL") {
      filter_team = player_team;
    }

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") {
      filter_homeAway = undefined;
    }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") {
      filter_matchState = undefined;
    }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) {
      filter_opponents = undefined;
    }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") {
      filter_situationType = undefined;
    }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    let attributes_list = [];
    this.table_settings.forEach((item) => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    return (
      "formations-overview/" +
      filter_season +
      "/" +
      filter_seasonPart +
      "/" +
      filter_team +
      "/" +
      filter_countOfPlayer +
      "/" +
      filter_minTOI +
      "/" +
      filter_lastGames +
      "/" +
      filter_dateFrom +
      "/" +
      filter_dateTo +
      "/" +
      filter_homeAway +
      "/" +
      filter_matchState +
      "/" +
      filter_minutes_from +
      "/" +
      filter_minutes_to +
      "/" +
      filter_opponents +
      "/" +
      filter_playerId_select1 +
      "/" +
      filter_playerId_select2 +
      "/" +
      filter_playerId_select3 +
      "/" +
      filter_playerId_select4 +
      "/" +
      filter_playerId_select5 +
      "/" +
      filter_playerId_select6 +
      "/" +
      filter_situationType +
      "/" +
      filter_situationTime +
      "/" +
      attributes_list_string +
      "/" +
      page
    );
  }

  formationAnalysisLink(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    player_team: string
  ) {
    //SEASON
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;
    if (filter_team == "ALL") {
      filter_team = player_team;
    }

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") {
      filter_homeAway = undefined;
    }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") {
      filter_matchState = undefined;
    }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) {
      filter_opponents = undefined;
    }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") {
      filter_situationType = undefined;
    }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    let attributes_list = [];
    this.table_settings.forEach((item) => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    return (
      "formations-analysis/" +
      filter_season +
      "/" +
      filter_seasonPart +
      "/" +
      filter_team +
      "/" +
      filter_countOfPlayer +
      "/" +
      filter_minTOI +
      "/" +
      filter_lastGames +
      "/" +
      filter_dateFrom +
      "/" +
      filter_dateTo +
      "/" +
      filter_homeAway +
      "/" +
      filter_matchState +
      "/" +
      filter_minutes_from +
      "/" +
      filter_minutes_to +
      "/" +
      filter_opponents +
      "/" +
      filter_playerId_select1 +
      "/" +
      filter_playerId_select2 +
      "/" +
      filter_playerId_select3 +
      "/" +
      filter_playerId_select4 +
      "/" +
      filter_playerId_select5 +
      "/" +
      filter_playerId_select6 +
      "/" +
      filter_situationType +
      "/" +
      filter_situationTime +
      "/" +
      attributes_list_string
    );
  }

  gamelogLink(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string
  ) {
    //SEASON
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") {
      filter_homeAway = undefined;
    }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") {
      filter_matchState = undefined;
    }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) {
      filter_opponents = undefined;
    }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") {
      filter_situationType = undefined;
    }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    if (filter_team == "ALL") {
      filter_team = this.getTeamUUID(filter_playerId_select1);
    }

    let attributes_list = [];
    this.table_settings.forEach((item) => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    return (
      "gamelog/" +
      filter_season +
      "/" +
      filter_seasonPart +
      "/" +
      filter_team +
      "/" +
      filter_countOfPlayer +
      "/" +
      filter_minTOI +
      "/" +
      filter_lastGames +
      "/" +
      filter_dateFrom +
      "/" +
      filter_dateTo +
      "/" +
      filter_homeAway +
      "/" +
      filter_matchState +
      "/" +
      filter_minutes_from +
      "/" +
      filter_minutes_to +
      "/" +
      filter_opponents +
      "/" +
      filter_playerId_select1 +
      "/" +
      filter_playerId_select2 +
      "/" +
      filter_playerId_select3 +
      "/" +
      filter_playerId_select4 +
      "/" +
      filter_playerId_select5 +
      "/" +
      filter_playerId_select6 +
      "/" +
      filter_situationType +
      "/" +
      filter_situationTime +
      "/" +
      attributes_list_string
    );
  }

  trendLink(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    trend_type: string
  ) {
    //Typy individual, formation, team

    //SEASON
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") {
      filter_homeAway = undefined;
    }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") {
      filter_matchState = undefined;
    }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) {
      filter_opponents = undefined;
    }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") {
      filter_situationType = undefined;
    }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    if (filter_team == "ALL") {
      filter_team = this.getTeamUUID(filter_playerId_select1);
    }

    let attributes_list = [];
    this.table_settings.forEach((item) => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    return (
      "trend/" +
      trend_type +
      "/" +
      filter_season +
      "/" +
      filter_seasonPart +
      "/" +
      filter_team +
      "/" +
      filter_countOfPlayer +
      "/" +
      filter_minTOI +
      "/" +
      filter_lastGames +
      "/" +
      filter_dateFrom +
      "/" +
      filter_dateTo +
      "/" +
      filter_homeAway +
      "/" +
      filter_matchState +
      "/" +
      filter_minutes_from +
      "/" +
      filter_minutes_to +
      "/" +
      filter_opponents +
      "/" +
      filter_playerId_select1 +
      "/" +
      filter_playerId_select2 +
      "/" +
      filter_playerId_select3 +
      "/" +
      filter_playerId_select4 +
      "/" +
      filter_playerId_select5 +
      "/" +
      filter_playerId_select6 +
      "/" +
      filter_situationType +
      "/" +
      filter_situationTime +
      "/" +
      attributes_list_string
    );
  }

  toggleDataSets() {
    let dataset = [
      { type: "cf60", name: "CF/60", colour: "green" },
      { type: "ca60", name: "CA/60", colour: "red" },
      { type: "cf_percent", name: "CF%", colour: "green" },
      { type: "cf_percent_rel", name: "CF% Rel", colour: "green" },
      { type: "scf60", name: "sCF/60", colour: "green" },
      { type: "sca60", name: "sCA/60", colour: "red" },
      { type: "scf_percent", name: "sCF%", colour: "green" },
      { type: "scf_percent_rel", name: "sCF% Rel", colour: "green" },
    ];

    /* this.formatParametersService.formatParameters(this.dataSets,'players') */
    if (this.filter_dataSet == "ALL") {
      if (this.tab == "gamelog") {
        dataset = this.table_settings_gamelog_default;
      } else if (this.tab == "tabs") {
        dataset = this.table_settings_default;
      }
    } else {
      this.dataSets.forEach((item) => {
        if (Number(item.id) === Number(this.filter_dataSet)) {
          dataset = item.data;
        }
      });
    }

    dataset = this.formatParametersService.formatParameters(dataset, "players");
    console.log("dataSet", dataset);
    this.onChangedAttributes(dataset);
  }

  toggleDataSetsShoda() {
    let dataset = [
      { type: "g60", name: "G/60", colour: "green" },
      { type: "a60", name: "A/60", colour: "green" },
      { type: "p60", name: "P/60", colour: "green" },
      { type: "sog60", name: "SOG/60", colour: "green" },
      { type: "ssa60", name: "sSA/60", colour: "green" },
      { type: "sc60", name: "sC/60", colour: "green" },
      { type: "scf_percent", name: "sCF%", colour: "green" },
      { type: "gf_percent", name: "GF%", colour: "red" },
    ];
    this.dataSets.forEach((item) => {
      if (Number(item.id) === Number(this.filter_dataSetShoda)) {
        dataset = item.data;
      }
    });
    dataset = this.formatParametersService.formatParameters(dataset, "players");

    this.onChangedAttributesShoda(dataset);
  }

  setMinAttribute(attribute) {
    this.filter_metricFilter_metric = attribute;
  }
  setMinAttributeValue(attribute_value) {
    this.filter_metricFilter_value = attribute_value;
  }

  onChangedAttributes(new_attributes: any) {
    let clean_attributes: any = [];
    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
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

  getAttributeText(type: string, show_what: number) {
    let title = "";
    let desc = "";
    let name = "";
    let attributes = JSON.parse(localStorage.getItem("loaded_attributes"));
    for (let item in attributes["players"][0]["individual"][0]) {
      attributes["players"][0]["individual"][0][item][0]["types"].forEach(
        (type2) => {
          type2["attributes"].forEach((attribute) => {
            if (attribute["type"] == type) {
              title = attribute["eng"];
              desc = attribute["desc"];
              name = attribute["name"];
            }
          });
        }
      );
    }

    for (let item in attributes["players"][0]["onIce"][0]) {
      attributes["players"][0]["onIce"][0][item][0]["types"].forEach(
        (type2) => {
          type2["attributes"].forEach((attribute) => {
            if (attribute["type"] == type) {
              title = attribute["eng"];
              desc = attribute["desc"];
              name = attribute["name"];
            }
          });
        }
      );
    }

    if (type == "toi") {
      name = "TOI";
    }

    if (show_what == 1) {
      return title;
    } else if (show_what == 2) {
      return desc;
    } else if (show_what == 3) {
      return name;
    } else {
      return "";
    }
  }

  downloadCSV() {
    let data = [];
    let th = ["Hokej.cz ID", "Tym", "Pozice", "Jmeno hrace", "TOI", "GP"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
      }
    });

    data.push(th);

    let row = [];
    //console.log("Data", this.data);
    this.data.forEach((item, index) => {
      let obj = item;
      let newObj = {
        hokejcz_id: String("__" + this.getPlayerHokejCZid(item["uuid"])),
        tym: this.getTeamShort(item.team),
        post: this.getPlayerPostName(item.uuid),
        ...obj,
      };

      row.push(newObj);
    });

    row.forEach((item, index) => {
      //alert(JSON.stringify(item));

      if (this.filter_posts == "ALL") {
        data.push(item);
      } else if (this.filter_posts == "DE") {
        if (this.getPlayerPost(item["uuid"]) == "DE") {
          data.push(item);
        }
      } else if (this.filter_posts == "FO") {
        if (this.getPlayerPost(item["uuid"]) == "FO") {
          data.push(item);
        }
      }
    });

    data = JSON.parse(JSON.stringify(data));

    let player_UUID = "";

    data.forEach((item, index) => {
      let uuid = item["uuid"];

      data[index]["uuid"] = accents.remove(this.getPlayerName(item["uuid"]));
      data[index]["gp"] = item["gp"];
      data[index]["toi"] = this.formatSecondsDecimal(item["toi"]);
      data[index]["oztoi"] = this.formatSecondsDecimal(item["oztoi"]);
      data[index]["dzposstoi"] = this.formatSecondsDecimal(item["dzposstoi"]);
      data[index]["oppdzptoi"] = this.formatSecondsDecimal(item["oppdzptoi"]);

      data[index]["ozposstoi"] = this.formatSecondsDecimal(item["ozposstoi"]);
      data[index]["posstoi"] = this.formatSecondsDecimal(item["posstoi"]);

      data[index]["dztoi"] = this.formatSecondsDecimal(item["dztoi"]);
    });

    let json = JSON.stringify(data);
    let withStrings = JSON.parse(json, (key, val) =>
      typeof val !== "object" && val !== null ? String(val) : val
    );

    let final_data = JSON.parse(JSON.stringify(withStrings));

    final_data.forEach((element, index) => {
      final_data[index]["team"] = undefined;
    });

    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
    //new Angular5Csv(withStrings, 'individual-stats', csv_options);
  }

  formatSecondsDecimal(seconds: number) {
    return seconds / 60;
  }

  formatSeconds(seconds: number) {
    var date = new Date(seconds * 1000);
    var hh: any = date.getUTCHours();
    var mm: any = date.getUTCMinutes();
    var ss: any = date.getSeconds();
    let mh = mm + 60 * hh;

    if (mh < 10) {
      mh = "0" + mh;
    }
    if (ss < 10) {
      ss = "0" + ss;
    }

    return mh + ":" + ss;
  }

  getTeamNameShort(uuid: string) {
    let team_name = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        team_name = item["name"];
      }
    });

    return team_name;
  }

  getTeamNameShortcut(uuid: string) {
    let team_name = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        team_name = item["shortcut"];
      }
    });

    return team_name;
  }

  setDefaultOrderRow() {
    this.list_order = 0;
  }

  addOrderRow() {
    this.list_order = this.list_order + 1;
  }

  sendEvent = (team: string) => {
    (<any>window).ga("send", "event", {
      eventCategory: "Analyzovaný tým",
      eventLabel: "Analyzovaný tým",
      eventAction: this.getTeamNameShort(team),
      eventValue: 1,
    });
  };

  checkLoggedTime() {
    let dt1 = new Date(localStorage.getItem("logged_date"));
    let dt2 = new Date();
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;

    if (Math.abs(Math.round(diff)) > 6) {
      alert("Platnost relace přihlášení vypršela. Přihlaste se znovu.");
      this.defaultService.logout();
    }
  }

  getSkalaColourShoda(value: number) {
    //console.log(value);
    if (value >= 0 && value < 10) {
      return "cell-0";
    } else if (value >= 10 && value < 20) {
      return "cell-1";
    } else if (value >= 20 && value < 30) {
      return "cell-2";
    } else if (value >= 30 && value < 40) {
      return "cell-3";
    } else if (value >= 40 && value < 50) {
      return "cell-4";
    } else if (value >= 50 && value < 60) {
      return "cell-5";
    } else if (value >= 60 && value < 70) {
      return "cell-6";
    } else if (value >= 70 && value < 80) {
      return "cell-7";
    } else if (value >= 80 && value < 90) {
      return "cell-8";
    } else if (value >= 90 && value <= 100) {
      return "cell-9";
    } else {
      return "cell-0";
    }
  }

  onChangedAttributesShoda(new_attributes: any) {
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_shoda = clean_attributes;
    if (this.filter_team_shoda == "" || this.filter_individual_player == "") {
    } else {
      this.loadDataShoda();
    }
  }

  onChangedAttributesRekordy(new_attributes: any) {
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_gamelog = clean_attributes;
    this.loadData(this.tab);
  }

  getPlayerPostName(uuid: string) {
    if (uuid != undefined) {
      if (localStorage.getItem(uuid) != null) {
        if (JSON.parse(localStorage.getItem(uuid))["position"] == "DE") {
          return "O";
        } else if (JSON.parse(localStorage.getItem(uuid))["position"] == "FO") {
          return "Ú";
        } else {
          return "";
        }
      } else {
        return "no-post";
      }
    } else {
      return "";
    }
  }

  setOwnAttribute(i: number, type: string) {
    this.value_of_attribute[i]["type"] = type;
  }

  getShodaProgressPercent(item: any) {
    let styles = {};
    let count = 0;
    if (item.deviation != 0) {
      count = (item.positiveDeviation / item.deviation) * 100;
    }

    styles["width"] = Math.round(count) + "%";
    return styles;
  }

  getShodaProgressPercentValue(item: any) {
    let count = 0;
    if (item.deviation != 0) {
      count = Math.round((item.positiveDeviation / item.deviation) * 100);
    }
    return count + "%";
  }

  getShodaProgressPercentValueNumber(item: any) {
    let count = 0;
    if (item.deviation != 0) {
      count = Math.round((item.positiveDeviation / item.deviation) * 100);
    }
    return count;
  }

  positiveOrNegative(value, type) {
    if (this.data_shoda_th.length > 0) {
      if (value > this.data_shoda_th[0][type]) {
        return "green";
      } else if (value < this.data_shoda_th[0][type]) {
        return "red";
      } else {
        return "normal";
      }
    } else {
      return "normal";
    }
  }

  roundTwoDecimals(value: number) {
    if (value != undefined && value != null) {
      return value.toFixed(2);
    } else {
      return 0;
    }
  }

  getPCT(player: string, team: string) {
    let data = [];
    let value = 0;
    let count = 0;

    if (this.average_compare == "team") {
      data = this.data_relativeToTeam;
    } else if (this.average_compare == "competition") {
      data = this.data_relativeToCompetition;
    }

    data.forEach((item) => {
      if (item["player"] == player && item["team"] == team) {
        this.table_settings.forEach((element) => {
          value = value + item["stats"][element.type];
          count++;
        });
      }
    });

    return Number(value / count).toFixed(0);
  }

  downloadCSVShoda() {
    let data = [];
    let th = ["Tym", "Pozice", "Jmeno hrace", "TOI", "GP"];

    this.table_settings_shoda.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th.push("similarity");
      }
    });
    th.push("Celkem");
    th.push("Pozitivni odchylka");
    data.push(th);

    let player_rows = [];
    this.data_shoda.forEach((item) => {
      //console.log(JSON.stringify(item));
      let player_data = {};

      player_data["player_uuid"] = accents.remove(
        this.getPlayerName(item["uuid"])
      );
      player_data["toi"] = this.formatSecondsDecimal(item["toi"]);
      player_data["oztoi"] = this.formatSecondsDecimal(item["oztoi"]);
      player_data["dzposstoi"] = this.formatSecondsDecimal(item["dzposstoi"]);
      player_data["oppdzptoi"] = this.formatSecondsDecimal(item["oppdzptoi"]);

      player_data["ozposstoi"] = this.formatSecondsDecimal(item["ozposstoi"]);
      player_data["posstoi"] = this.formatSecondsDecimal(item["posstoi"]);

      player_data["dztoi"] = this.formatSecondsDecimal(item["dztoi"]);

      player_data["gp"] = item["gp"];

      this.table_settings_shoda.forEach((attribute, index) => {
        if (attribute["type"] != null) {
          player_data[attribute["type"]] = String(item[attribute["type"]]);
          player_data[attribute["type"] + "_rank"] = String(
            item[attribute["type"] + "_rank"]
          );
        }
      });

      player_data["rank"] = String(item["rank"]);
      player_data["similarity"] = String(
        this.getShodaProgressPercentValueNumber(item)
      );

      player_data["uuid"] = item["uuid"];

      let obj = player_data;
      let newObj = {
        tym: this.getPlayerTeamShort(item.uuid),
        post: this.getPlayerPostName(item.uuid),
        ...obj,
      };

      player_rows.push(newObj);
    });

    player_rows.forEach((item) => {
      if (this.filter_shoda_post == "ALL") {
        item["uuid"] = undefined;
        data.push(item);
      } else if (this.filter_shoda_post == "DE") {
        if (this.getPlayerPost(item["uuid"]) == "DE") {
          item["uuid"] = undefined;
          data.push(item);
        }
      } else if (this.filter_shoda_post == "FO") {
        if (this.getPlayerPost(item["uuid"]) == "FO") {
          item["uuid"] = undefined;
          data.push(item);
        }
      }
    });

    this.defaultService.downloadXLS(data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
  }

  downloadCSVGamelog() {
    let data = [];
    let th = ["Zapas", "TOI"];

    let th_types = ["zapas", "toi"];

    this.table_settings_gamelog.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data.push(th);

    let row = [];

    this.data_gamelog.forEach((item, index) => {
      //console.log(JSON.stringify(item));

      let home_team = this.getTeamName(item["info"]["homeTeamUuid"]);
      let away_team = this.getTeamName(item["info"]["awayTeamUuid"]);
      let date = this.formatDate(item["info"]["date"]);
      let score =
        item["info"]["score"]["home"] +
        ":" +
        item["info"]["score"]["away"] +
        "" +
        this.getGameState(item["info"]["score"]["state"]);

      item["stats"]["zapas"] =
        home_team + " - " + away_team + "  " + date + "  " + score;
      row.push(item["stats"]);
    });

    row.forEach((item, index) => {
      let selected_data = [];
      th_types.forEach((item2, index2) => {
        if (item2 == "toi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "oztoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "ozposstoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "posstoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "dztoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "dzposstoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "oppdzptoi") {
          selected_data.push(String(this.formatSeconds(item[item2])));
        } else if (item2 == "zapas") {
          selected_data.push(String(item[item2]));
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      data.push(selected_data);
    });

    data = JSON.parse(JSON.stringify(data));

    data.forEach((item, index) => {
      data[index]["toi"] = this.formatSeconds(item["toi"]);
    });

    let json = JSON.stringify(data);
    let withStrings = JSON.parse(json, (key, val) =>
      typeof val !== "object" && val !== null ? String(val) : val
    );

    let final_data = JSON.parse(JSON.stringify(withStrings));

    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
    //new Angular5Csv(withStrings, 'individual-stats', csv_options);
  }

  poradiHraceChangeLiga(actual_value: boolean) {
    //alert("poradiHraceChangeLiga");
    /*
    this.poradi_loaded = false;
    this.poradi_loading = false;


    if (this.poradi_hrace_liga == true) {
      this.poradi_hrace_liga = false;
    } else {
      if (this.poradi_hrace_vtymu == true) {
        this.poradi_hrace_vtymu = false;
      }
      this.poradi_hrace_liga = true;
      this.loadPoradiData("liga");
    }
    */
  }

  poradiHraceChangeVtymu(actual_value: boolean) {
    //alert("poradiHraceChangeVtymu");
    /*
    this.poradi_loaded = false;
    this.poradi_loading = false;

    if (this.poradi_hrace_vtymu == true) {
      this.poradi_hrace_vtymu = false;
    } else {
      if (this.poradi_hrace_liga == true) {
        this.poradi_hrace_liga = false;
      }
      this.poradi_hrace_vtymu = true;

      this.loadPoradiData("vtymu");
    }
    */
  }

  loadPoradiData(type: string) {
    this.poradi_loading = true;
    this.poradi_loaded = false;

    let filter_team_by_checkbox = "";
    //if (type == "vtymu") {
    filter_team_by_checkbox = this.filter_team;
    this.individualStatsService
      .getIndividualStatsRank(
        this.filter_seasonPart,
        filter_team_by_checkbox,
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
        this.filter_metricFilter_metric,
        this.filter_metricFilter_value,
        this.filter_posts
      )
      .subscribe(
        (loaded_data) => {
          this.poradi_loaded = true;
          this.poradi_loading = false;
          this.poradi_data_vtymu = loaded_data;
          //this.poradi_data_liga = loaded_data;
          this.cd.detectChanges();
        },
        (err) => {}
      );

    //}
    //else if (type == "liga") {
    filter_team_by_checkbox = "ALL";
    this.individualStatsService
      .getIndividualStatsRank(
        this.filter_seasonPart,
        filter_team_by_checkbox,
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
        this.filter_metricFilter_metric,
        this.filter_metricFilter_value,
        this.filter_posts
      )
      .subscribe(
        (loaded_data) => {
          this.poradi_loaded = true;
          this.poradi_loading = false;

          this.poradi_data_liga = loaded_data;
          this.cd.detectChanges();
        },
        (err) => {}
      );
    //}
  }

  toggleLigovyPercentil() {
    this.poradi_loaded = false;
    this.show_skala = false;

    if (this.ligovy_percetnil_active) {
      this.ligovy_percetnil_active = false;
    } else {
      this.ligovy_percetnil_active = true;

      this.active_skala();
      this.loadPoradiData("vtymu");
      /* this.loadPoradiData('liga'); */
    }
  }

  changeFilterPost() {
    this.poradi_loading = false;
    this.poradi_loaded = false;
    this.ligovy_percetnil_active = false;
    this.cd.detectChanges();
    this.loadTabulky();
  }

  getCountOfPlayersLeague(post: string) {
    let count = 0;
    if (this.poradi_data_liga != "") {
      if (post == "ALL") {
        this.poradi_data_liga[this.table_settings[0]["type"]].forEach(
          (item, index) => {
            count = count + 1;
          }
        );
      } else if (post == "DE") {
        this.poradi_data_liga[this.table_settings[0]["type"]].forEach(
          (item, index) => {
            if (item.position == "DE") {
              count = count + 1;
            }
          }
        );
      } else if (post == "FO") {
        this.poradi_data_liga[this.table_settings[0]["type"]].forEach(
          (item, index) => {
            if (item.position == "FO") {
              count = count + 1;
            }
          }
        );
      }
    }

    return count;
  }

  getCountOfPlayersTeam(post: string, team: string) {
    let count = 0;
    if (post == "ALL") {
      this.poradi_data_vtymu[this.table_settings[0]["type"]].forEach(
        (item, index) => {
          if (item.team == team) {
            count = count + 1;
          }
        }
      );
    } else if (post == "DE") {
      this.poradi_data_vtymu[this.table_settings[0]["type"]].forEach(
        (item, index) => {
          if (item.position == "DE") {
            if (item.team == team) {
              count = count + 1;
            }
          }
        }
      );
    } else if (post == "FO") {
      this.poradi_data_vtymu[this.table_settings[0]["type"]].forEach(
        (item, index) => {
          if (item.position == "FO") {
            if (item.team == team) {
              count = count + 1;
            }
          }
        }
      );
    }

    return count;
  }

  getPoradiVtymu(
    player_uuid: string,
    team: any,
    attribute: string,
    type: string
  ) {
    let value = "";
    let items = [];

    if (this.poradi_data_vtymu[attribute] != undefined) {
      this.poradi_data_vtymu[attribute].forEach((item, index) => {
        if (item.team == team) {
          items.push(item);
        }
      });

      items.forEach((item, index) => {
        if (item["player"] == player_uuid) {
          value = index + 1 + ".";
        }
      });
    }

    return value;
  }

  getPoradiLiga(
    player_uuid: string,
    team: any,
    attribute: string,
    type: string
  ) {
    let value = "";

    if (this.poradi_data_liga[attribute] != undefined) {
      this.poradi_data_liga[attribute].forEach((item, index) => {
        if (item["player"] == player_uuid) {
          value = index + 1 + ".";
        }
      });
    }

    return value;
  }

  formatDate(value: string): any {
    let date = new Date(value);
    return (
      Number(date.getDate()) +
      "." +
      Number(date.getMonth() + 1) +
      "." +
      Number(date.getFullYear())
    );
  }

  openGamelog(uuid: string, team: string) {
    this.filter_team = team;
    this.vybratTeamCheck();
    this.filter_individual_player = uuid;
    this.filter_individual_player_selected = uuid;

    this.showTab("gamelog");
  }

  openTrend(uuid: string, team: string) {
    this.filter_team = team;
    this.vybratTeamCheck();
    this.filter_individual_player = uuid;
    this.filter_individual_player_selected = uuid;

    this.showTab("trend");
  }

  getAttributeName(type: string) {
    let name = "no-name";
    let attributes = JSON.parse(localStorage.getItem("loaded_attributes"));

    if (type != null || type != undefined) {
      if (type.startsWith("r_")) {
        type = type.substring(2);
      } else if (type.startsWith("o_")) {
        type = type.substring(2);
      } else if (type.startsWith("up_")) {
        type = type.substring(3);
      } else if (type.startsWith("np_")) {
        type = type.substring(3);
      }
    }

    if (type != null || type != undefined) {
      for (let item in attributes["players"][0]["individual"][0]) {
        //console.log(JSON.stringify());
        attributes["players"][0]["individual"][0][item][0][
          "attributes"
        ].forEach((item, index) => {
          if (item["type"] == type) {
            name = item["name"];
          }
        });
      }

      for (let item in attributes["players"][0]["onIce"][0]) {
        //console.log(JSON.stringify());
        attributes["players"][0]["onIce"][0][item][0]["attributes"].forEach(
          (item, index) => {
            if (item["type"] == type) {
              name = item["name"];
            }
          }
        );
      }

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

      for (let item in attributes["goalkeepersData"][0]) {
        //console.log(JSON.stringify());
        attributes["goalkeepersData"][0][item][0]["attributes"].forEach(
          (item, index) => {
            if (item["type"] == type) {
              name = item["name"];
            }
          }
        );
      }
    }
    return name;
  }

  //TRACKING
  trackOpenPage() {
    let logged_user = JSON.parse(localStorage.getItem("logged_user"));
    this.defaultService
      .addEvent(
        logged_user[0].id,
        logged_user[0].user,
        "Byla otevřena obrazovka hráči.",
        7
      )
      .subscribe((loaded_data) => {});
  }

  checkExistParameter() {
    let parameters_exists_reload_data = false;
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params["filter_season"] != undefined) {
        this.filter_season = [];

        let filter_season = params["filter_season"];
        let filter_season_list = filter_season.split(",");

        filter_season_list.forEach((item, index) => {
          let next_season = parseInt(item) + 1;
          this.filter_season.push({
            id: item,
            itemName: item + " - " + next_season,
          });
        });

        this.filter_seasonPart = "";

        //
        parameters_exists_reload_data = true;
      }

      if (params["filter_seasonPart"] != undefined) {
        this.getSeasonParts();
        this.filter_seasonPart = params["filter_seasonPart"];

        //
        parameters_exists_reload_data = true;
      }

      if (params["filter_team"] != undefined) {
        this.filter_team = params["filter_team"];
        this.getPlayerList();

        //
        parameters_exists_reload_data = true;
      }

      if (params["filter_countOfPlayer"] != undefined) {
        this.filter_countOfPlayer = params["filter_countOfPlayer"];

        if (this.filter_countOfPlayer == "5:5-FO") {
          this.filter_countOfPlayer = "5:5";
        }

        if (this.filter_countOfPlayer == "5:5-DE") {
          this.filter_countOfPlayer = "5:5";
        }

        if (this.filter_countOfPlayer == "ALL") {
          this.filter_countOfPlayer = "";
        }

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_minTOI"] != undefined &&
        params["filter_minTOI"] != "undefined"
      ) {
        this.filter_minTOI = parseInt(params["filter_minTOI"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_lastGames"] != undefined &&
        params["filter_lastGames"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_lastGames = parseInt(params["filter_lastGames"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_dateFrom"] != undefined &&
        params["filter_dateFrom"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_dateFrom = params["filter_dateFrom"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_dateTo"] != undefined &&
        params["filter_dateTo"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_dateTo = params["filter_dateTo"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_homeAway"] != undefined &&
        params["filter_homeAway"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_homeAway = params["filter_homeAway"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_matchState"] != undefined &&
        params["filter_matchState"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_matchState = params["filter_matchState"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_minutes_from"] != undefined &&
        params["filter_minutes_from"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_minutes_from = parseInt(params["filter_minutes_from"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_minutes_to"] != undefined &&
        params["filter_minutes_to"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_minutes_to = parseInt(params["filter_minutes_to"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_opponents"] != undefined &&
        params["filter_opponents"] != "undefined"
      ) {
        //this.more_filters = true;

        this.filter_opponents = params["filter_opponents"].split(",");

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_playerId_select1"] != undefined &&
        params["filter_playerId_select1"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_individual_player = params["filter_playerId_select1"];
        //
        parameters_exists_reload_data = true;
        //this.active_player1 = true;
      }

      if (
        params["filter_situationType"] != undefined &&
        params["filter_situationType"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_situationType = params["filter_situationType"];

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["filter_situationTime"] != undefined &&
        params["filter_situationTime"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_situationTime = parseInt(params["filter_situationTime"]);

        //
        parameters_exists_reload_data = true;
      }

      if (
        params["selected_attributes"] != undefined &&
        params["selected_attributes"] != "undefined"
      ) {
        this.selected_attributes_string = params["selected_attributes"];

        let parameter_attributes = this.selected_attributes_string.split(",");

        let loaded_attributes = [];
        let attributes = JSON.parse(localStorage.getItem("loaded_attributes"));

        for (let item in attributes["players"][0]["individual"][0]) {
          attributes["players"][0]["individual"][0][item][0]["types"].forEach(
            (item, index) => {
              item["attributes"].forEach((item2) => {
                item2["onIce"] = false;
                loaded_attributes.push(item2);
              });
            }
          );
        }

        for (let item in attributes["players"][0]["onIce"][0]) {
          attributes["players"][0]["onIce"][0][item][0]["types"].forEach(
            (item, index) => {
              item["attributes"].forEach((item2) => {
                item2["onIce"] = true;
                loaded_attributes.push(item2);
              });
            }
          );
        }

        if (params.page == "gamelog") {
          this.table_settings_gamelog = [];
          parameter_attributes.forEach((item) => {
            loaded_attributes.forEach((element) => {
              if (element["type"] == item) {
                this.table_settings_gamelog.push({
                  type: element["type"],
                  name: element["name"],
                  colour: element["colour"],
                  eng: element["eng"],
                  desc: element["desc"],
                  data: element["data"],
                  onIce: element["onIce"],
                  origin: element["type"],
                  types: [],
                });
              }
            });
          });
        } else {
          this.table_settings = [];
          parameter_attributes.forEach((item) => {
            loaded_attributes.forEach((element) => {
              if (element["type"] == item) {
                this.table_settings.push({
                  type: element["type"],
                  name: element["name"],
                  colour: element["colour"],
                  eng: element["eng"],
                  desc: element["desc"],
                  data: element["data"],
                  onIce: element["onIce"],
                  origin: element["type"],
                  types: [],
                });
              }
            });
          });
        }

        parameters_exists_reload_data = true;
      }

      if (parameters_exists_reload_data == true) {
        /* this.loadData(this.tab_small_viz); */

        this.tab = params.page;
        if (params.page == "gamelog") {
          this.loadData("gamelog");
        } else if (params.page == "trend") {
          this.showTab("trend");
        } else if (params.page == "player_card") {
          this.showTab("player_card");
        }
      }
    });
  }

  individualLink(
    filter_playerId_select1: string,
    player_team: string,
    page: string
  ) {
    //SEASON
    let seasons = [];
    let filter_season = "";
    this.filter_season.forEach((item, index) => {
      seasons.push(item["id"]);
    });

    filter_season = seasons.toString();
    if (filter_season == "") {
      filter_season = "null";
    }

    //SEASON PART
    let filter_seasonPart = this.filter_seasonPart;

    //FILTER TEAM
    let filter_team = this.filter_team;
    if (filter_team == "ALL") {
      filter_team = player_team;
    }

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = this.filter_minTOI;

    //FILTER filter_lastGames
    let filter_lastGames = this.filter_lastGames;

    //FILTER filter_lastGames
    let filter_dateFrom = this.filter_dateFrom;

    //FILTER filter_lastGames
    let filter_dateTo = this.filter_dateTo;

    //FILTER filter_homeAway
    let filter_homeAway = this.filter_homeAway;
    if (filter_homeAway == "") {
      filter_homeAway = undefined;
    }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") {
      filter_matchState = undefined;
    }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) {
      filter_opponents = undefined;
    }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") {
      filter_situationType = undefined;
    }

    //FILTER filter_situationTime
    let filter_situationTime = this.filter_situationTime;

    if (filter_countOfPlayer == "") {
      filter_countOfPlayer = "ALL";
    }

    let attributes_list = [];
    this.table_settings.forEach((item) => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    return (
      "individual-stats/" +
      filter_season +
      "/" +
      filter_seasonPart +
      "/" +
      filter_team +
      "/" +
      filter_countOfPlayer +
      "/" +
      filter_minTOI +
      "/" +
      filter_lastGames +
      "/" +
      filter_dateFrom +
      "/" +
      filter_dateTo +
      "/" +
      filter_homeAway +
      "/" +
      filter_matchState +
      "/" +
      filter_minutes_from +
      "/" +
      filter_minutes_to +
      "/" +
      filter_opponents +
      "/" +
      filter_playerId_select1 +
      "/" +
      filter_situationType +
      "/" +
      filter_situationTime +
      "/" +
      attributes_list_string +
      "/" +
      page
    );
  }

  moveLeft() {
    this.ds.moveLeft();
    console.log("Click Left");
  }

  moveRight() {
    this.ds.moveRight();
  }

  checkLanguage() {
    var lang = localStorage.getItem("language");
    return lang == "cz";
  }

  openHelp(event) {
    if (this.tab != "canvas") {
      this.prew_tab = this.tab;
    }
    this.tab = "canvas";

    this.help.openHelp();
  }
}
