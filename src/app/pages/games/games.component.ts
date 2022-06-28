import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  isDevMode,
  ChangeDetectorRef,
} from "@angular/core";
import { Location } from "@angular/common";
import { cloneDeep } from "lodash";

import { Router, ActivatedRoute, Params } from "@angular/router";

import { GamesService } from "../../services/games/games.service";
import { DefaultService } from "../../services/default/default.service";
import { FormatParametersService } from "../../services/format-parameters/format-parameters.service";
import { IndividualStatsService } from "../../services/individual-stats/individual-stats.service";

import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
declare var require: any;
var accents = require("remove-accents");

import { TranslatePipe } from "../../pipes/translate.pipe";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { loadavg } from "os";
import { load } from "@angular/core/src/render3";
import { localeData } from "moment";
import { report } from "process";
import { NavComponent } from "../../components/nav/nav.component";

var csv_options = {
  quoteStrings: '"',
  fieldSeparator: ";",
  decimalseparator: ".",
  type: "text/csv;charset=ISO-8859-1;",
};

@Component({
  selector: "games",
  templateUrl: "./games.component.html",
  styleUrls: ["./games.component.scss"],
  providers: [
    GamesService,
    DefaultService,
    IndividualStatsService,
    TranslatePipe,
  ],
})
export class GamesComponent implements OnInit {
  @ViewChild("gamesscroll") private gamesScrollContainer: ElementRef;
  @ViewChild("help") private help: NavComponent;
  @ViewChild("scroll") private scrollContainer: ElementRef;

  seasons_select_list = [];

  tab: string = "";
  prew_tab: string = "";
  more_filters: boolean = false;
  tab_small_tabulky: string = "teams";
  tab_small_vizualizace: string = "h2h";

  dataLoaded: boolean;
  loading: boolean;
  data_loading: boolean = false;
  loading_video: boolean = false;

  show_home_map: boolean = true;

  loading_games_list: boolean = false;
  no_data: boolean = false;
  gamesDataLoaded: boolean = false;
  seasons_list: any[];

  competitions_list: any = [];
  teams_list: any[];

  selected_game: string = "";

  graphic_overview_data: any;

  //filters
  filter_season: any = [];
  filter_seasonPart: string = "";
  filter_team: string = "";
  filter_team2: string = "";
  filter_lastGames: number;
  filter_dateFrom: string;
  filter_dateTo: string;
  filter_matchState: string = "";
  filter_minutes_from: number;
  filter_minutes_to: number;
  filter_seconds_from: number;
  filter_seconds_to: number;
  filter_match: string = "";
  filter_posts: string = "ALL";
  filter_homeAway: string = "";
  filter_countOfPlayer: string = "5:5";
  filter_countOfPlayer_H2H: string = "5:5";
  filter_countOfPlayer_formace: string = "5:5";
  filter_matchPart: string = "ALL";
  filter_situationType: string = "";
  filter_situationTime: number;
  //filters

  filterby: string = "toi";
  filterby2: string = "toi";

  shoda_sortby: string = "rank";
  shodaSort_value: string = "desc";

  filter_table_teams: string = "";

  selectedItems = [];
  dropdownSettings = {};

  canscrollprev: boolean = false;
  canscrollnext: boolean = true;
  games_scroll: number = 0;

  canscrollprev2: boolean = false;
  canscrollnext2: boolean = true;
  games_scroll2: number = 0;

  /* filterby1: string = "g60";
  filterby2: string = "toi";
  filterby3: string = "toi"; */
  filter_shootCategory: string = "CFaCA";

  show_skala: boolean = false;

  toggle_table_settings: boolean = false;

  table_settings: any[] = [
    {
      type: "cf60",
      name: "CF/60",
      colour: "green",
      eng: "Shots For per 60",
      desc: "Střely týmu za 60 minut",
      data: "60",
      onIce: true,
      origin: "cf60",
      types: [],
    },
    {
      type: "ca60",
      name: "CA/60",
      colour: "red",
      eng: "Shots Against per 60",
      desc: "Střely soupeře za 60 minut",
      data: "60",
      onIce: true,
      origin: "",
      types: [],
    },
    {
      type: "cf_percent",
      name: "CF%",
      colour: "green",
      eng: "Shots For %",
      desc: "Podíl střel týmu ze součtu střel týmu i soupeře",
      data: "percent",
      onIce: true,
      origin: "ca60",
      types: [],
    },
    {
      type: "cf_percent_rel",
      name: "CF% Rel",
      colour: "green",
      eng: "",
      desc: "",
      data: "percent",
      onIce: true,
      origin: "cf_percent_rel",
      types: [],
    },
    {
      type: "scf60",
      name: "sCF/60",
      colour: "green",
      eng: "Relative Shots For %",
      desc: "Rozdíl mezi podílem střel týmu ze střel týmu i soupeře s hráčem na ledě a bez hráče na ledě",
      data: "60",
      onIce: true,
      origin: "scf60",
      types: [],
    },
  ];

  table_settings_gamelog_hraci: any[] = [
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

  table_settings_goalkeepers: any[] = [
    {
      name: "GA",
      type: "ga",
      colour: "white",
      eng: "Goals Against",
      desc: "Obdržené góly",
      data: "count",
      onIce: false,
      origin: "ga",
      types: [],
    },
    {
      name: "xGA",
      type: "xga",
      colour: "white",
      eng: "Expected Goals Against",
      desc: "Očekávané obdržené góly",
      data: "count",
      onIce: false,
      origin: "xga",
      types: [],
    },
    {
      name: "Sv%",
      type: "sv_percent",
      colour: "white",
      eng: "Save Percentage",
      desc: "Úspěšnost zákroků",
      data: "percent",
      onIce: false,
      origin: "sv_percent",
      types: [],
    },
    {
      name: "SOGA",
      type: "soga",
      colour: "white",
      eng: "Shots On Goal Against",
      desc: "Střely na branku",
      data: "count",
      onIce: false,
      origin: "soga",
      types: [],
    },
    {
      name: "GSAA",
      type: "gsaa",
      colour: "white",
      eng: "Goals Saved Above Average",
      desc: "Počet gólů, kterým brankář zabránil v porovnání s průměrem ligy",
      data: "count",
      onIce: false,
      origin: "gsaa",
      types: [],
    },
    {
      name: "sSv%",
      type: "ssv_percent",
      colour: "white",
      eng: "% of Slot Shots On Goal Saved",
      desc: "Úspěšnost zákroků ze střel ze slotu",
      data: "percent",
      onIce: false,
      origin: "ssv_percent",
      types: [],
    },
    {
      name: "1T.Sv%",
      type: "1t.sv_percent",
      colour: "white",
      eng: "% of One-Timers Saved",
      desc: "Úspěšnost zákroků ze střel z první",
      data: "percent",
      onIce: false,
      origin: "1t.sv_percent",
      types: [],
    },
  ];

  table_settings_teams: any[] = [
    {
      name: "xGF",
      type: "xgf",
      colour: "green",
      eng: "Expected Goals For",
      desc: "Očekávané góly týmu",
      data: "count",
      onIce: false,
      origin: "xgf",
      types: [],
    },
    {
      name: "xGA",
      type: "xga",
      colour: "red",
      eng: "Expected Goals Against",
      desc: "Očekávané góly soupeře",
      data: "count",
      onIce: false,
      origin: "xga",
      types: [],
    },
    {
      name: "xGF%",
      type: "xgf_percent",
      colour: "green",
      eng: "Expected Goals For %",
      desc: "Podíl očekávaných gólů týmu ze součtu očekávaných gólů týmu i soupeře",
      data: "percent",
      onIce: false,
      origin: "xgf_percent",
      types: [],
    },
    {
      name: "GF",
      type: "gf",
      colour: "green",
      eng: "Goals For",
      desc: "Góly týmu",
      data: "count",
      onIce: false,
      origin: "gf",
      types: [],
    },
    {
      name: "GA",
      type: "ga",
      colour: "red",
      eng: "Goals Against",
      desc: "Góly soupeře",
      data: "count",
      onIce: false,
      origin: "ga",
      types: [],
    },
    {
      name: "GF%",
      type: "gf_percent",
      colour: "green",
      eng: "Goals For %",
      desc: "Podíl gólů týmu ze součtu gólů týmu i soupeře",
      data: "percent",
      onIce: false,
      origin: "gf_percent",
      types: [],
    },
    {
      name: "EnF",
      type: "enf",
      colour: "green",
      eng: "Controlled Zone Entries For",
      desc: "Kontrolované vstupy týmu do pásma",
      data: "count",
      onIce: false,
      origin: "enf",
      types: [],
    },
    {
      name: "OZ.pWF→CF",
      type: "oz.pwfcf",
      colour: "green",
      eng: "Offensive Zone Pucks Won For leading to Shot For",
      desc: "Zisky puku týmu v útočném pásmu vedoucí ke střele týmu",
      data: "count",
      onIce: false,
      origin: "oz.pwfcf",
      types: [],
    },
    {
      name: "Pen2+-",
      type: "pen2_pm",
      colour: "green",
      eng: "2-Minute Minor Penalties Plus Minus",
      desc: "Rozdíl mezi menšími dvouminutovými tresty týmu a získanými týmem",
      data: "count",
      onIce: false,
      origin: "pen2_pm",
      types: [],
    },
  ];

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

  table_settings_selection_by_type: any[] = [];

  selected_attributes_string: any;

  videos_data: any = [];
  players_list: any = [];

  teams_data: any = [];
  teams_data_table: any = [];

  players_data: any = [];
  goalkeepers_data: any = [];

  chartOptions = {
    responsive: false,
    legend: false,
    labels: false,
    tooltips: {
      enabled: false,
    },
    scales: {
      xAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              if (
                value == 0 ||
                value == 20 ||
                value == 40 ||
                value == 60 ||
                value == 80
              ) {
                return value;
              }
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            max: 10,
            min: -10,
          },
        },
      ],
    },
  };

  chartData = [
    {
      data: [],
      label: "Rozdil",
      borderWidth: 2,
    },
    {
      data: [],
      label: "Team1",
      borderWidth: 1,
    },
    {
      data: [],
      label: "Team2",
      borderWidth: 1,
    },
  ];

  chartLabels = [];

  myColors = [
    {
      backgroundColor: "transparent",
      borderColor: "#ffab00",
      pointBackgroundColor: "transparent",
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: "transparent",
      pointHoverBorderColor: "transparent",
    },
    {
      backgroundColor: "rgba(41, 98, 255, 0.8)",
      borderColor: "#00bfa5",
      pointBackgroundColor: "transparent",
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: "transparent",
      pointHoverBorderColor: "transparent",
    },
    {
      backgroundColor: "rgba(255, 23, 68, 0.8)",
      borderColor: "#ff1744",
      pointBackgroundColor: "transparent",
      pointBorderColor: "transparent",
      pointHoverBackgroundColor: "transparent",
      pointHoverBorderColor: "transparent",
    },
  ];

  graph_goals: any = [];

  games_list = [];

  h2h_data: any = [];
  h2h_data_players: any = [];
  h2h_data_opponents: any = [];
  h2h_tois: any = [];
  h2h_toi_max: number = 0;
  h2h_toi_min: number = 0;

  h2h_home_def_count: number = 0;
  h2h_away_def_count: number = 0;

  game_date: string;
  game_home: string;
  game_away: string;

  home_team_players = [];
  away_team_players = [];

  dataSets: any = [];

  score: any = [];

  formations_data_unformatted: any = [];
  formations_data: any = [];
  table_players_formations: any = [];

  flow_data: any = [];
  filter_dataSet: string = "ALL";
  filter_dataSetGoalies: string = "ALL";

  flow_number_of_shots: any = [];
  flow_number_of_shots_max: number = 0;

  game_time: number = 0;
  game_time_overtime: number = 0;

  defined_datasest: any = [];

  flow_penalties: any = [];

  show_video_modal: boolean = false;

  homeTeamUuid: string = "";
  awayTeamUuid: string = "";

  video_data: any = [];

  data_report: any = [];

  filter_countOfPlayer_SHOTFLOW: string = "";
  filter_shootCategory_SHOTFLOW: string = "shots";

  video_player_selected: string = "";

  h2h_home_team: string = "";
  h2h_away_team: string = "";

  list_order: number = 0;

  selected_daterange: any;

  enabled_types: string = "";
  //for changed attributes

  fisrtBlockGameState: string = "5:5";
  firstBlockGamePart: number = null;
  secondBlockGameState: string = "PP";
  secondBlockGamePart: number = null;

  for_changed_attributes_uuid: string = "";
  for_changed_attributes_date: string = "";
  for_changed_attributes_filter_countOfPlayer: string = "";
  for_changed_attributes_backto: string = "";

  video_title: any = [];
  game_result: string = "";

  boolProd: boolean = true;

  page: string = "players";

  canvas_type_setting: string = "goalkeepers";

  video_player_type: string = "";

  selected_game_score: any = [];

  dataSets_default: any = [];

  game_score: any = [];
  home_goals: any = [];
  away_goals: any = [];

  loading_default = false;
  loading_block_1 = false;
  loading_block_2 = false;

  data_loaded_default = false;
  data_loaded_block_1 = false;
  data_loaded_block_2 = false;

  block1_data: any = [];
  block2_data: any = [];

  report_normal = [
    /* {
      type: "gf",
      name: "GF",
      percent: null,
      percent_name: "",
      p_name: "G",
      p_type: "g",
      text: "Góly"
    }, 
    {
      type: "xgf",
      name: "xGF%",
      percent: "xgf_percent",
      percent_name: "xGF%",
      p_name: "xG",
      p_type: "xg",
      text: "Očekávané góly"
    },  */
  ];

  report_powerplay = [
    /* {
      type: "toi",
      name: "TOI",
      percent: null,
      percent_name: "",
      p_name: "TOI",
      p_type: "toi",
      text: "Čas na ledě"
    }, 
    {
      type: "hd.cf",
      name: "HD.CF",
      percent: "hd.cf_pct",
      percent_name: "HD.CF [%]%",
      p_name: "HD.C",
      p_type: "hd.c",
      text: "Střely s vysokou nebezpečností"
    },  */
  ];

  constructor(
    private cd: ChangeDetectorRef,
    private formatParametersService: FormatParametersService,
    private translate: TranslatePipe,
    private gamesService: GamesService,
    private individualStatsService: IndividualStatsService,
    private defaultService: DefaultService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.chartLabels = [];

    this.tab = "";
    this.more_filters = false;

    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      text: "Vybrat sezonu",
      selectAllText: "Vybrat vše",
      unSelectAllText: "Odebrat vše",
      enableSearchFilter: false,
      classes: "multiselect",
    };

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }

    this.dataLoaded = false;
    this.loading = false;
  }

  ngOnInit() {
    this.defaultService
      .getAttributesUserList(
        JSON.parse(localStorage.getItem("logged_user"))[0]["id"]
      )
      .subscribe(
        (loaded_data) => {
          this.dataSets = loaded_data;
          this.dataSets_default = cloneDeep(loaded_data);
        },
        (err) => {}
      );
    this.getCompetitions();
    this.loadLastMatches();
    this.trackOpenPage();
    this.checkExistParameter();

    this.defaultService.getReportNormal().subscribe((loaded_data) => {
      this.report_normal = loaded_data.report_evenstrength;
      this.report_powerplay = loaded_data.report_powerplay;
      console.log("report normal", this.report_normal);

      this.cd.detectChanges();
    });
  }

  /* NEW - start */

  loadLastMatches() {
    this.gamesDataLoaded = false;
    this.loading_games_list = true;
    this.gamesService
      .getAllGamesList(
        this.filter_seasonPart,
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_lastGames,
        this.filter_situationType,
        this.filter_situationTime
      )
      .subscribe((loaded_data) => {
        this.games_list = loaded_data;
        this.gamesDataLoaded = true;
        this.loading_games_list = false;
      });
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
      { type: "onsh_percent", name: "ON.Sh%", colour: "green" },
      { type: "onsv_percent", name: "ON.Sv%", colour: "red" },
    ];
    this.dataSets.forEach((item) => {
      if (Number(item.id) === Number(this.filter_dataSet)) {
        dataset = item.data;
      }
    });
    dataset = this.formatParametersService.formatParameters(dataset, "players");
    this.onChangedAttributes(dataset);
  }

  toggleDataSetsTeams() {
    let dataset = [
      { type: "cf60", name: "CF/60", colour: "green" },
      { type: "ca60", name: "CA/60", colour: "red" },
      { type: "cf_percent", name: "CF%", colour: "green" },
      { type: "cf_percent_rel", name: "CF% Rel", colour: "green" },
      { type: "scf60", name: "sCF/60", colour: "green" },
      { type: "sca60", name: "sCA/60", colour: "red" },
      { type: "scf_percent", name: "sCF%", colour: "green" },
      { type: "scf_percent_rel", name: "sCF% Rel", colour: "green" },
      { type: "onsh_percent", name: "ON.Sh%", colour: "green" },
      { type: "onsv_percent", name: "ON.Sv%", colour: "red" },
    ];
    this.dataSets.forEach((item) => {
      if (Number(item.id) === Number(this.filter_dataSet)) {
        dataset = item.data;
      }
    });
    dataset = this.formatParametersService.formatParameters(dataset, "teams");
    this.onChangedAttributes(dataset);
  }

  toggleDataSetsGoalies() {
    let dataset = [
      { type: "ga60", name: "GA/60", colour: "white" },
      { type: "soga60", name: "SOGA/60", colour: "white" },
      { type: "sv_percent", name: "Sv%", colour: "white" },
      { type: "1tsv_percent", name: "1T.Sv%", colour: "white" },
      { type: "rsv_percent", name: "R.Sv%", colour: "white" },
      { type: "gsaa", name: "GSAA", colour: "white" },
      { type: "sga60", name: "sGA/60", colour: "purple" },
      { type: "ssoga60", name: "sSOGA/60", colour: "purple" },
      { type: "ssv_percent", name: "sSv%", colour: "purple" },
      { type: "1tssv_percent", name: "1T.sSv%", colour: "purple" },
      { type: "crsassv_percent", name: "cr.SA.sSv%", colour: "purple" },
      { type: "sgsaa", name: "sGSAA", colour: "purple" },
    ];
    console.log("tabs", this.tab);
    this.dataSets.forEach((item) => {
      if (Number(item.id) === Number(this.filter_dataSetGoalies)) {
        dataset = item.data;
      }
    });
    dataset = this.formatParametersService.formatParameters(
      dataset,
      "goalkeepers"
    );
    this.onChangedAttributesGoalkeepers(dataset);
  }

  /* NEW - end */

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
  }

  getSeasonParts() {
    this.filter_seasonPart = "";
    this.filter_team = "";
    this.filter_team2 = "";
    this.teams_list = [];

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
      {
        id: 1,
        name: "Play-off",
        part: "playoff",
        uuids: "",
      },
      {
        id: 2,
        name: "Play-out",
        part: "playout",
        uuids: "",
      },
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
      console.log("Filer Season", this.filter_season);
      console.log("seasons_list", this.seasons_list);
      this.filter_season.forEach((item, index) => {
        this.seasons_list.forEach((item2, index) => {
          if (item["id"] == item2["name"]) {
            item2["competitions"].forEach((item3, index) => {
              console.log("Item 3", item3);
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

  dateRangeChange($event): void {
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
    let filter_team = player_team;

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = undefined;

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
    let filter_opponents = this.filter_team2;
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

    if (this.tab == "game_overview") {
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
      this.selected_game +
      "/" +
      attributes_list_string
    );
  }

  teamsLink(player_team: string, page: string) {
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
    let filter_team = player_team;
    /* if (filter_team == "ALL") { filter_team = player_team; } */

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = undefined;

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
    let filter_opponents = this.filter_team2;
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
      "teams/" +
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
      filter_situationType +
      "/" +
      filter_situationTime +
      "/" +
      attributes_list_string +
      "/" +
      page
    );
  }

  getSkalaColour(value: number) {
    if (value == 15) {
      return "cell-0";
    } else if (value == 14) {
      return "cell-1";
    } else if (value == 13) {
      return "cell-2";
    } else if (value == 12 || value == 11) {
      return "cell-3";
    } else if (value == 10 || value == 9) {
      return "cell-4";
    } else if (value == 6 || value == 7 || value == 8) {
      return "cell-5";
    } else if (value == 4 || value == 5) {
      return "cell-6";
    } else if (value == 3) {
      return "cell-7";
    } else if (value == 2) {
      return "cell-8";
    } else if (value == 1) {
      return "cell-9";
    }
  }

  downloadCSV(table: number) {
    let data = [];

    let head = [
      "",
      this.getTeamName2(this.homeTeamUuid),
      this.getTeamName2(this.homeTeamUuid),
      this.getTeamName2(this.awayTeamUuid),
      this.getTeamName2(this.awayTeamUuid),
      this.getTeamName2(this.homeTeamUuid),
      this.getTeamName2(this.homeTeamUuid),
      this.getTeamName2(this.awayTeamUuid),
      this.getTeamName2(this.awayTeamUuid),
    ];
    let th = [
      "Atribut",
      "Počet",
      "%",
      "Počet",
      "%",
      "Průměr",
      "V lize",
      "Průměr",
      "V lize",
    ];

    /* this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
      }
    }); */

    data.push(head);
    data.push(th);

    if (table == 1) {
      let row_data = this.data_report.block1;
      console.log("row DATA", row_data);
      this.report_normal.forEach((element) => {
        let data_row = [];
        data_row.push(element.name);
        data_row.push(row_data.match[this.homeTeamUuid].metrics[element.type]);
        console.log("ATT", element.name);
        console.log(
          "ATT VAL",
          row_data.match[this.homeTeamUuid].metrics[element.type]
        );
        data_row.push(
          row_data.match[this.homeTeamUuid].metrics[element.percent]
        );
        data_row.push(row_data.match[this.awayTeamUuid].metrics[element.type]);
        data_row.push(
          row_data.match[this.awayTeamUuid].metrics[element.percent]
        );
        data_row.push(
          row_data.competition[this.homeTeamUuid].averages[element.type]
        );
        data_row.push(
          row_data.competition[this.homeTeamUuid].index[element.type]
        );
        data_row.push(
          row_data.competition[this.awayTeamUuid].averages[element.type]
        );
        data_row.push(
          row_data.competition[this.awayTeamUuid].index[element.type]
        );
        data.push(data_row);
        console.log("Data row", data_row);
      });

      this.report_normal;
    } else if (table == 2) {
      let row_data = this.data_report.block2;
      console.log("row DATA", row_data);
      this.report_powerplay.forEach((element) => {
        let data_row = [];
        data_row.push(element.name);
        data_row
          .push(row_data.match[this.homeTeamUuid].metrics[element.type])
          .toString();
        data_row.push(
          row_data.match[this.homeTeamUuid].metrics[element.percent]
        );
        data_row.push(row_data.match[this.awayTeamUuid].metrics[element.type]);
        data_row.push(
          row_data.match[this.awayTeamUuid].metrics[element.percent]
        );
        data_row.push(
          row_data.competition[this.homeTeamUuid].averages[element.type]
        );
        data_row.push(
          row_data.competition[this.homeTeamUuid].index[element.type]
        );
        data_row.push(
          row_data.competition[this.awayTeamUuid].averages[element.type]
        );
        data_row.push(
          row_data.competition[this.awayTeamUuid].index[element.type]
        );
        data.push(data_row);
        console.log("Data row", data_row);
      });
    }

    //data = JSON.parse(JSON.stringify(data));

    console.log("Final data", data);

    this.defaultService.downloadXLS(data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
    //new Angular5Csv(withStrings, 'individual-stats', csv_options);
  }

  getTeamsData() {
    this.filter_team = "";
    this.filter_team2 = "";
    this.teams_list = [];
    console.log("competitions_list", this.competitions_list);
    let uuids = this.filter_seasonPart.split(",");
    console.log("filter_seasonPart", this.filter_seasonPart);
    console.log("uuids", uuids);

    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(
        localStorage.getItem("competition_details")
      );
      console.log("competition_details", competition_details);
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
                uuid: team["uuid"],
                name: team["name"],
                itemName: team["name"],
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
  }

  dateFromChange(date: string) {
    var date_string = new Date(date);
    var dayIndex = date_string.getDate();
    var monthIndex = date_string.getMonth() + 1;
    var year = date_string.getFullYear();
    var month = "";
    var day = "";
    if (monthIndex < 10) {
      month = "0" + monthIndex;
    } else {
      month = monthIndex.toString();
    }
    if (dayIndex < 10) {
      day = "0" + dayIndex;
    } else {
      day = dayIndex.toString();
    }

    this.filter_dateFrom = year + "-" + month + "-" + day;
  }

  dateToChange(date: string) {
    var date_string = new Date(date);
    var dayIndex = date_string.getDate();
    var monthIndex = date_string.getMonth() + 1;
    var year = date_string.getFullYear();
    var month = "";
    var day = "";
    if (monthIndex < 10) {
      month = "0" + monthIndex;
    } else {
      month = monthIndex.toString();
    }
    if (dayIndex < 10) {
      day = "0" + dayIndex;
    } else {
      day = dayIndex.toString();
    }
    this.filter_dateTo = year + "-" + month + "-" + day;
  }

  getGamesData(team_number: number) {
    if (team_number == 1) {
      if (this.filter_team == this.filter_team2) {
        alert("Nelze vybrat dva stejné týmy.");
        setTimeout(() => {
          this.filter_team = "";
        }, 100);
      }
    } else if (team_number == 2) {
      if (this.filter_team == this.filter_team2) {
        alert("Nelze vybrat dva stejné týmy.");
        setTimeout(() => {
          this.filter_team2 = "";
        }, 100);
      }
    }
  }

  public itemsToString(value: Array<any> = []): string {
    return value
      .map((item: any) => {
        return item.itemName;
      })
      .join(", ");
  }

  public itemsToStringApi(value: Array<any> = []): string {
    console.log("Value", value);
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

  showTab2(tab: string) {
    this.tab = tab;
    this.prew_tab = tab;
    this.loadData();
  }

  showTab(tab: string) {
    this.tab = tab;
    this.prew_tab = tab;
    this.no_data = false;

    if (tab == "h2h") {
      this.dataLoaded = true;
      this.loading = true;
      //load teams data
      this.gamesService
        .getH2H(
          this.filter_seasonPart,
          this.selected_game,
          this.filter_team,
          this.filter_matchState,
          this.filter_minutes_from,
          this.filter_minutes_to,
          this.filter_countOfPlayer_H2H,
          this.filter_situationType,
          this.filter_situationTime
        )
        .subscribe((loaded_data) => {
          this.h2h_data = loaded_data;

          //console.log(JSON.stringify(loaded_data));

          this.h2h_data_players = [];
          this.h2h_data_opponents = [];

          //Home players
          this.h2h_data["players"]["backwards"].forEach((item, index) => {
            this.h2h_data_players.push(item);
          });

          this.h2h_home_def_count =
            this.h2h_data["players"]["backwards"].length;

          this.h2h_data["players"]["forwards"].forEach((item, index) => {
            this.h2h_data_players.push(item);
          });

          this.h2h_home_team = this.filter_team;

          //oponnetns
          this.h2h_data["opponents"]["backwards"].forEach((item, index) => {
            this.h2h_data_opponents.push(item);
          });

          this.h2h_away_def_count =
            this.h2h_data["opponents"]["backwards"].length;

          this.h2h_data["opponents"]["forwards"].forEach((item, index) => {
            this.h2h_data_opponents.push(item);
          });
          console.log("data opponents", this.h2h_data_opponents);
          if (
            this.h2h_data_opponents.length == 0 &&
            this.h2h_data_players.length == 0
          ) {
            this.no_data = true;
          }
          if (this.filter_team == this.homeTeamUuid) {
            this.h2h_away_team = this.awayTeamUuid;
          } else {
            this.h2h_away_team = this.homeTeamUuid;
          }

          //max min toi
          this.h2h_data["headToHead"].forEach((item, index) => {
            item["opponents"].forEach((item2, index) => {
              this.h2h_tois.push(item2["metrics"]["toi"]);
            });
          });
          this.h2h_toi_max = Math.max.apply(Math, this.h2h_tois);
          this.h2h_toi_min = Math.min.apply(Math, this.h2h_tois);

          this.loading = false;
          this.dataLoaded = true;
        });
    }
  }

  smallTabTabulky_toggle(type: string) {
    this.tab_small_tabulky = type;
    this.tab = type;
    this.prew_tab = type;

    if (type == "teams") {
      this.loadTeamsData();
    } else if (type == "players") {
      this.loadPlayersData();
    } else if (type == "lines") {
      this.loadFormationsData();
    } else if (type == "goalies") {
      this.loadGoalkeepersData();
    }
  }

  smallTabVizualizace_toggle(type: string) {
    this.tab_small_vizualizace = type;

    if (type == "shotflow") {
      this.loadshotflow();
    }
  }

  scroll_next() {
    this.games_scroll = this.games_scroll + 320;
    this.gamesScrollContainer.nativeElement.scrollLeft = this.games_scroll;

    if (this.games_scroll > 0) {
      this.canscrollprev = true;
    }
  }

  scroll_prev() {
    if (this.canscrollprev) {
      this.games_scroll = this.games_scroll - 320;
      this.gamesScrollContainer.nativeElement.scrollLeft = this.games_scroll;

      if (this.games_scroll == 0) {
        this.canscrollprev = false;
      }
    }
  }

  closeVideo() {
    this.show_video_modal = false;
  }

  loadData() {
    this.checkLoggedTime();

    this.loading_games_list = true;

    this.dataLoaded = false;
    this.loading = true;

    this.selected_game = "";
    if (this.filter_team != "") {
      this.gamesService
        .getGamesList(
          this.filter_seasonPart,
          this.filter_team,
          this.filter_team2,
          this.filter_dateFrom,
          this.filter_dateTo,
          this.filter_lastGames,
          this.filter_situationType,
          this.filter_situationTime
        )
        .subscribe((loaded_data) => {
          //console.log(JSON.stringify(loaded_data));
          alert("Done");
          this.games_list = loaded_data;
          this.gamesDataLoaded = true;
          this.loading_games_list = false;
          this.loading = false;
        });
    } else {
      this.loadLastMatches();
    }
  }

  loadPage(tab: string) {
    this.dataLoaded = true;
    this.loading = true;
    this.tab = tab;
    this.prew_tab = tab;
    this.tab_small_tabulky = tab;

    this.filterby = "";
    this.filterby2 = "";
    console.log("tab", tab);

    if (this.tab == "teams") {
      this.loadTeamsData();
    } else if (this.tab == "players") {
      this.loadPlayersData();
    } else if (this.tab == "lines") {
      this.loadFormationsData();
    } else if (this.tab == "goalies") {
      this.loadGoalkeepersData();
    } else if (this.tab == "game_overview") {
      this.loadGraphicOverview();
    } else if (this.tab == "game_report") {
      this.loadReport();
    } else if (this.tab == "h2h") {
    }
  }

  exportTable(type: number) {
    /* this.exporting_png = true; */
    this.closeVideo();
    if (type == 1) {
      html2canvas(document.querySelector(".block-1")).then((canvas) => {
        //this.exportpng.nativeElement.appendChild(canvas);
        canvas.toBlob((blob) => {
          saveAs(blob, "export.png");
        });
        /* this.exporting_png = false; */
      });
    } else if (type == 2) {
      html2canvas(document.querySelector(".block-2")).then((canvas) => {
        //this.exportpng.nativeElement.appendChild(canvas);
        canvas.toBlob((blob) => {
          saveAs(blob, "export.png");
        });
        /* this.exporting_png = false; */
      });
    }
  }

  loadReport() {
    this.loading = false;
    this.loading_default = true;
    this.data_loaded_default = false;
    this.home_goals = [];
    this.away_goals = [];
    this.game_score = [];
    this.getPlayers();

    this.report_normal.forEach((element) => {
      element["open"] = false;
    });

    this.gamesService
      .getReport(this.filter_seasonPart, this.selected_game, this.filter_team)
      .subscribe((loaded_data) => {
        console.log("Summary:", loaded_data);
        this.data_report = loaded_data;

        let score_home = 0;
        let score_away = 0;
        this.data_report.goals.forEach((goal, index) => {
          if (this.away_team_players.includes(goal.shooterUuid)) {
            this.away_goals.push(goal);

            this.game_score.push({
              scoreHome: score_home,
              scoreAway: score_away + 1,
            });
            score_away++;
          }
          if (this.home_team_players.includes(goal.shooterUuid)) {
            this.home_goals.push(goal);

            this.game_score.push({
              scoreHome: score_home + 1,
              scoreAway: score_away,
            });
            score_home++;
          }
        });

        this.loading_default = false;
        this.dataLoaded = true;

        this.cd.detectChanges();
      });
    this.loadBlock1();
    this.loadBlock2();

    this.loadTeamsData();
  }

  loadBlock1() {
    this.loading_block_1 = true;
    this.data_loaded_block_1 = false;

    this.gamesService
      .getBlock1(
        this.filter_seasonPart,
        this.selected_game,
        this.filter_team,
        this.fisrtBlockGameState,
        this.firstBlockGamePart
      )
      .subscribe((loaded_data) => {
        this.block1_data = loaded_data;
        console.log("block1_data", this.block1_data);
        this.loading_block_1 = false;
        this.data_loaded_block_1 = true;
        this.cd.detectChanges();
      });
  }

  loadBlock2() {
    this.loading_block_2 = true;
    this.data_loaded_block_2 = false;

    this.gamesService
      .getBlock2(
        this.filter_seasonPart,
        this.selected_game,
        this.filter_team,
        this.secondBlockGameState,
        this.secondBlockGamePart
      )
      .subscribe((loaded_data) => {
        this.block2_data = loaded_data;
        this.loading_block_2 = false;
        this.data_loaded_block_2 = true;
        this.cd.detectChanges();
      });
  }

  getBest5(players: any, metric: string) {
    function compare(a, b) {
      if (a.stats[metric] > b.stats[metric]) {
        return -1;
      }
      if (a.stats[metric] < b.stats[metric]) {
        return 1;
      }
      return 0;
    }

    let sorted = players.sort(compare).slice(0, 5);
    console.log("sorted", sorted);
    return sorted;
  }

  checkNumber(data: number) {
    return Number.isInteger(data);
  }

  playGoals(team: string) {
    let data = false;
    this.videos_data = [];
    if (team === "home") {
      try {
        this.home_goals.forEach((goal) => {
          this.videos_data.push({
            index: 0,
            player: goal.shooterUuid,
            videoId: goal.shot.videoId,
            time: goal.shot.time,
            videoTime: goal.shot.videoTime,
            color: 0,
            homeTeam: this.homeTeamUuid,
            awayTeam: this.awayTeamUuid,
            score: this.selected_game_score,
            matchDate: this.for_changed_attributes_date,
            buly_won: "",
            download_type: "shot",
            gameState: goal.shot.gameState,
            after: "+5",
            before: "-5",
          });
        });
        data = true;
      } catch {
        alert("Video zatím není dostupné");
      }
    } else if (team === "away") {
      try {
        this.away_goals.forEach((goal) => {
          this.videos_data.push({
            index: 0,
            player: goal.shooterUuid,
            videoId: goal.shot.videoId,
            time: goal.shot.time,
            videoTime: goal.shot.videoTime,
            color: 0,
            homeTeam: this.homeTeamUuid,
            awayTeam: this.awayTeamUuid,
            score: this.selected_game_score,
            matchDate: this.for_changed_attributes_date,
            buly_won: "",
            download_type: "shot",
            gameState: goal.shot.gameState,
            after: "+5",
            before: "-5",
          });
        });
        data = true;
      } catch {
        alert("Video zatím není dostupné");
      }
    } else if (team === "ALL") {
      try {
        this.away_goals.forEach((goal) => {
          this.videos_data.push({
            index: 0,
            player: goal.shooterUuid,
            videoId: goal.shot.videoId,
            time: goal.shot.time,
            videoTime: goal.shot.videoTime,
            color: 0,
            homeTeam: this.homeTeamUuid,
            awayTeam: this.awayTeamUuid,
            score: this.selected_game_score,
            matchDate: this.for_changed_attributes_date,
            buly_won: "",
            download_type: "shot",
            gameState: goal.shot.gameState,
            after: "+5",
            before: "-5",
          });
        });

        this.home_goals.forEach((goal) => {
          this.videos_data.push({
            index: 0,
            player: goal.shooterUuid,
            videoId: goal.shot.videoId,
            time: goal.shot.time,
            videoTime: goal.shot.videoTime,
            color: 0,
            homeTeam: this.homeTeamUuid,
            awayTeam: this.awayTeamUuid,
            score: this.selected_game_score,
            matchDate: this.for_changed_attributes_date,
            buly_won: "",
            download_type: "shot",
            gameState: goal.shot.gameState,
            after: "+5",
            before: "-5",
          });
        });
        data = true;
      } catch {
        alert("Video zatím není dostupné");
      }
    }

    if (data) {
      this.show_video_modal = true;
      this.loading_video = false;
    }
  }

  playGoal(goal: any) {
    this.videos_data = [];
    if (goal.shot != undefined || goal.shot != null || goal.shot != "") {
      this.videos_data.push({
        index: 0,
        player: goal.shooterUuid,
        videoId: goal.shot.videoId,
        time: goal.shot.time,
        videoTime: goal.shot.videoTime,
        color: 0,
        homeTeam: this.homeTeamUuid,
        awayTeam: this.awayTeamUuid,
        score: this.selected_game_score,
        matchDate: this.for_changed_attributes_date,
        buly_won: "",
        download_type: "shot",
        gameState: goal.shot.gameState,
        after: "+5",
        before: "-5",
      });

      console.log("VIDEODATA", this.video_data);
      this.show_video_modal = true;
      this.loading_video = false;
    } else {
      alert("Toto video není možne přehrát");
    }
  }

  chceckGoalSide(player: string, side: string) {
    if (side === "home") {
      return this.home_team_players.includes(player);
    } else if (side === "away") {
      return this.away_team_players.includes(player);
    }
  }

  getPlayers() {
    this.home_team_players = [];
    this.away_team_players = [];
    let uuids = this.filter_seasonPart.split(",");

    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(
        localStorage.getItem("competition_details")
      );
      competition_details.forEach((item2, index) => {
        if (typeof item2[item] != "undefined") {
          item2[item]["teams"].forEach((team, index) => {
            if (team.uuid === this.homeTeamUuid) {
              console.log("team", team);
              team["players"].forEach((player) => {
                this.home_team_players.push(player.uuid);
              });
            }
            if (team.uuid === this.awayTeamUuid) {
              team["players"].forEach((player) => {
                this.away_team_players.push(player.uuid);
              });
            }
          });
        }
      });
    });
  }

  chceckGameState(data: any) {
    try {
      let formated = data.gameState.split(":");
      if (formated[0] == "penaltyShot") {
        return "TS";
      } else {
        return formated[0] + "/" + formated[1];
      }
    } catch {
      console.log("no_data");
      return "";
    }
  }

  checkGameScore(data: any) {
    try {
      return data.score.home + ":" + data.score.away;
    } catch {
      return "0:0";
    }
  }

  getExpcectedGoals(team) {
    let data = this.graphic_overview_data["shotsInfo"][team];
    let value = data.ld.xg + data.hd.xg + data.md.xg;
    return value.toFixed(2);
  }

  loadGraphicOverview() {
    this.loading = true;
    this.gamesService
      .getGraphicOverview(
        this.filter_seasonPart,
        this.selected_game,
        this.filter_team
      )
      .subscribe((loaded_data) => {
        this.graphic_overview_data = loaded_data;
        let home_best = [];
        let away_best = [];
        let max = 0;
        for (let i = 0; i < 5; i++) {
          home_best.push(
            this.graphic_overview_data["players"][this.homeTeamUuid][i]
          );
          away_best.push(
            this.graphic_overview_data["players"][this.awayTeamUuid][i]
          );
        }
        if (home_best[0].xg > away_best[0].xg) {
          max = home_best[0].xg;
        } else {
          max = away_best[0].xg;
        }

        this.graphic_overview_data["topPlayers"] = {};
        this.graphic_overview_data["expected"] = {};
        this.graphic_overview_data["expected_goals"] = {};
        this.graphic_overview_data["expected"][this.homeTeamUuid] =
          this.getExpcectedGoals(this.homeTeamUuid);
        this.graphic_overview_data["expected"][this.awayTeamUuid] =
          this.getExpcectedGoals(this.awayTeamUuid);
        this.graphic_overview_data["topPlayers"]["max"] = max;
        this.graphic_overview_data["topPlayers"][this.homeTeamUuid] = home_best;
        this.graphic_overview_data["topPlayers"][this.awayTeamUuid] = away_best;
        console.log("Graphic_data", this.graphic_overview_data);
        this.loading = false;
      });
  }

  getCircle(home: string, enemy: string) {
    let data = this.graphic_overview_data["expected"];
    if (data[home] > data[enemy]) {
      return 100;
    } else {
      return (data[home] / data[enemy]) * 100;
    }
  }
  getCircleShots(home: string, enemy: string) {
    let data = this.graphic_overview_data["shotsInfo"];
    if (data[home]["c"] > data[enemy]["c"]) {
      return 100;
    } else {
      return (data[home]["c"] / data[enemy]["c"]) * 100;
    }
  }

  getScore(data: any) {
    let score = 0;
    score = data["0"] + data["1"] + data["2"];

    return score;
  }

  getPercentile(value) {
    return value;
  }

  selectGame(
    uuid: string,
    date: string,
    filter_countOfPlayer,
    backto: string,
    data: any
  ) {
    console.log("Game", data);
    this.checkLoggedTime();
    this.tab_small_tabulky = this.tab;
    this.video_title = [];
    this.for_changed_attributes_uuid = uuid;
    this.for_changed_attributes_date = date;
    this.for_changed_attributes_filter_countOfPlayer = filter_countOfPlayer;
    this.for_changed_attributes_backto = backto;

    if (data != null) {
      this.score = {
        home: data.score.home,
        away: data.score.away,
        state: data.score.state,
      };
    }

    this.games_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        this.homeTeamUuid = this.games_list[index]["homeTeamUuid"];
        this.awayTeamUuid = this.games_list[index]["awayTeamUuid"];

        this.game_result =
          this.games_list[index]["score"]["home"] +
          ":" +
          this.games_list[index]["score"]["away"] +
          this.getGameState(this.games_list[index]["score"]["state"]);

        this.selected_game_score = this.games_list[index]["score"];
      }
    });

    /* if(this.filter_team == ""){
      this.filter_team = this.homeTeamUuid;
    } */
    this.filter_team = this.homeTeamUuid;

    this.video_title.push({
      home_team: this.getTeamName(this.homeTeamUuid),
      away_team: this.getTeamName(this.awayTeamUuid),
      game_date: this.for_changed_attributes_date,
      game_score: this.game_result,
    });

    this.filter_countOfPlayer = filter_countOfPlayer;

    this.game_date = date;
    this.game_home = this.homeTeamUuid;
    this.game_away = this.awayTeamUuid;

    this.flow_penalties = [];

    //this.tab = backto;
    this.selected_game = uuid;

    this.dataLoaded = false;
    this.loading = true;

    if (this.tab_small_tabulky == "teams") {
      this.loadTeamsData();
    } else if (this.tab_small_tabulky == "players") {
      this.loadPlayersData();
    } else if (this.tab_small_tabulky == "lines") {
      this.loadFormationsData();
    } else if (this.tab_small_tabulky == "goalies") {
      this.loadGoalkeepersData();
    } else if (this.tab_small_tabulky == "game_overview") {
      this.loadGraphicOverview();
    } else if (this.tab_small_tabulky == "game_report") {
      this.loadReport();
    } else if (this.tab_small_tabulky == "h2h") {
      this.showTab("h2h");
    }
  }

  getBackgroundImage(uuid: string) {
    const img = this.getPlayerTeamLogo(this.getPlayerTeamShort(uuid));
    return {
      background: "url(" + img + ") no-repeat",
      "background-position": "right 1px center",
      "background-size": "30px 30px",
    };
  }

  loadTeamsData() {
    this.dataLoaded = false;
    this.loading = true;

    this.gamesService
      .getTeamsData(
        this.filter_seasonPart,
        this.selected_game,
        this.filter_team,
        this.filter_matchState,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_countOfPlayer,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings_teams
      )
      .subscribe((loaded_data) => {
        //console.log("loaded data",loaded_data)
        this.teams_data = [];
        this.teams_data_table = [];
        loaded_data.forEach((item, index) => {
          this.teams_data.push(item["stats"]);
          this.teams_data[index]["team"] = item["team"];
        });

        loaded_data.forEach((item, index) => {
          this.teams_data_table.push(item["stats"]);
          this.teams_data_table[index]["team"] = item["team"];
        });

        this.defined_datasest = [];
        let loaded_datasest = JSON.parse(localStorage.getItem("defined_sets"));
        loaded_datasest["teams"].forEach((element, index) => {
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
        this.dataSets = cloneDeep(this.dataSets_default);
        this.defined_datasest.forEach((element) => {
          this.dataSets.push(element);
        });

        this.loading = false;
        this.dataLoaded = true;
      });
  }

  loadPlayersData() {
    this.dataLoaded = false;
    this.loading = true;
    //load players data
    console.log(
      "table_settings_gamelog_hraci",
      this.table_settings_gamelog_hraci
    );
    this.gamesService
      .getPlayersData(
        this.filter_seasonPart,
        this.selected_game,
        this.filter_team,
        this.filter_matchState,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_countOfPlayer,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings_gamelog_hraci
      )
      .subscribe((loaded_data) => {
        //console.log(JSON.stringify(loaded_data));
        console.log("load_dataľ", loaded_data);
        this.players_data = [];
        loaded_data.forEach((item, index) => {
          this.players_data.push(item["stats"]);
          this.players_data[index]["uuid"] = item["uuid"];
        });

        this.defined_datasest = [];
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
        this.dataSets = cloneDeep(this.dataSets_default);
        this.defined_datasest.forEach((element) => {
          this.dataSets.push(element);
        });

        this.loading = false;
        this.dataLoaded = true;
        this.cd.detectChanges();
      });
  }

  loadFormationsData() {
    this.dataLoaded = false;
    this.loading = true;

    this.gamesService
      .getFormationsData(
        this.filter_seasonPart,
        this.selected_game,
        this.filter_team,
        this.filter_matchState,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_countOfPlayer_formace,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings_gamelog_hraci
      )
      .subscribe((loaded_data) => {
        this.formations_data_unformatted = [];
        this.formations_data = [];
        this.table_players_formations = [];
        let home_team = [];
        let away_team = [];
        let all_team = [];

        this.formations_data_unformatted = loaded_data;
        this.formations_data_unformatted.forEach((item, index) => {
          this.formations_data.push(item["stats"]);
          this.formations_data[index]["players"] = item["players"];

          if (this.getPlayerTeamUUID(item.players[0]) == this.filter_team) {
            home_team.push(item["stats"]);
            /* home_team[index]["players"] = item["players"]; */
          } else {
            away_team.push(item["stats"]);
            /* away_team[index]["players"] = item["players"]; */
          }
          this.table_players_formations.push(item["players"]);
        });
        all_team = home_team.concat(away_team);

        this.formations_data = [];
        this.formations_data = all_team;

        this.defined_datasest = [];
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
        this.dataSets = cloneDeep(this.dataSets_default);
        this.defined_datasest.forEach((element) => {
          this.dataSets.push(element);
        });

        /* console.log("all_team",all_team);
      console.log("formations_data",this.formations_data);
      console.log("table_players_formations",this.formations_data_unformatted); */
        this.loading = false;
        this.dataLoaded = true;
        this.cd.detectChanges();
      });
  }

  loadGoalkeepersData() {
    this.dataLoaded = false;
    this.loading = true;

    this.gamesService
      .getGoalkeepersData(
        this.filter_seasonPart,
        this.selected_game,
        this.filter_team,
        this.filter_matchState,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_countOfPlayer,
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings_goalkeepers
      )
      .subscribe((loaded_data) => {
        //console.log("golaman:" + JSON.stringify(loaded_data))
        this.goalkeepers_data = [];
        loaded_data.forEach((item, index) => {
          this.goalkeepers_data.push(item["stats"]);
          this.goalkeepers_data[index]["uuid"] = item["uuid"];
        });

        this.defined_datasest = [];
        let loaded_datasest = JSON.parse(localStorage.getItem("defined_sets"));
        loaded_datasest["goalkeepers"].forEach((element, index) => {
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
        this.dataSets = cloneDeep(this.dataSets_default);
        this.defined_datasest.forEach((element) => {
          this.dataSets.push(element);
        });

        this.loading = false;
        this.dataLoaded = true;
        this.cd.detectChanges();
      });
  }

  getFlowGoalLeft(left: number) {
    return Math.round(left / this.game_time) + "px";
  }

  getFlowGoalBottom(bottom: number) {
    return 50 + "px";
  }

  scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
    return (
      ((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) +
      minAllowed
    );
  }

  /* changedOrder(event, type) {
    console.log("event",event);
    if (type == 1) {
      this.filterby1 = event;
    } else if (type == 2) {
      this.filterby2 = event;
    } else if (type == 3) {
      this.filterby3 = event;
    }
  } */

  /* toggleTableAttributes(select: string) {
    this.table_settings.forEach((item, index) => {
      if (item['type'] == select) {
        if (item['enabled'] == false) {
          this.table_settings[index]['enabled'] = true;
        } else {
          this.table_settings[index]['enabled'] = false;
        }
      }
    });
  } */

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

  getRandomSize() {
    let max = 30;
    let min = 15;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomPercent() {
    return Math.floor(Math.random() * 100) + 1;
  }

  getPercent(player: string, opponent: string) {
    let cf = 0;
    let ca = 0;

    let sf = 0;
    let sa = 0;

    let sogf = 0;
    let soga = 0;

    let value = 0;

    if (this.filter_shootCategory == "SCFaSCA") {
      this.h2h_data["headToHead"].forEach((item, index) => {
        if (item["uuid"] == player) {
          item["opponents"].forEach((item2, index) => {
            if (item2["uuid"] == opponent) {
              sf = item2["metrics"]["scf"];
              sa = item2["metrics"]["sca"];
              value = (100 / (sf + sa)) * sa;
            }
          });
        }
      });
    } else if (this.filter_shootCategory == "CFaCA") {
      this.h2h_data["headToHead"].forEach((item, index) => {
        if (item["uuid"] == player) {
          item["opponents"].forEach((item2, index) => {
            if (item2["uuid"] == opponent) {
              cf = item2["metrics"]["cf"];
              ca = item2["metrics"]["ca"];
              value = (100 / (cf + ca)) * ca;
            }
          });
        }
      });
    } else if (this.filter_shootCategory == "SOGFaSOGA") {
      this.h2h_data["headToHead"].forEach((item, index) => {
        if (item["uuid"] == player) {
          item["opponents"].forEach((item2, index) => {
            if (item2["uuid"] == opponent) {
              sogf = item2["metrics"]["sogf"];
              soga = item2["metrics"]["soga"];
              value = (100 / (sogf + soga)) * soga;
            }
          });
        }
      });
    } else if (this.filter_shootCategory == "XGFaXGA") {
      this.h2h_data["headToHead"].forEach((item, index) => {
        if (item["uuid"] == player) {
          item["opponents"].forEach((item2, index) => {
            if (item2["uuid"] == opponent) {
              sogf = item2["metrics"]["xgf"];
              soga = item2["metrics"]["xga"];
              value = (100 / (sogf + soga)) * soga;
            }
          });
        }
      });
    }

    //console.log(this.filter_shootCategory);

    return value;
  }

  getPercent2(player: string, opponent: string) {
    let cf = 0;
    let ca = 0;

    let sf = 0;
    let sa = 0;

    let sogf = 0;
    let soga = 0;

    let value = 0;

    let data = [];

    if (this.filter_shootCategory == "SCFaSCA") {
      this.h2h_data["headToHead"].forEach((item, index) => {
        if (item["uuid"] == player) {
          item["opponents"].forEach((item2, index) => {
            if (item2["uuid"] == opponent) {
              data[0] = item2["metrics"]["scf"];
              data[1] = item2["metrics"]["sca"];
            }
          });
        }
      });
    } else if (this.filter_shootCategory == "CFaCA") {
      this.h2h_data["headToHead"].forEach((item, index) => {
        if (item["uuid"] == player) {
          item["opponents"].forEach((item2, index) => {
            if (item2["uuid"] == opponent) {
              data[0] = item2["metrics"]["cf"];
              data[1] = item2["metrics"]["ca"];
            }
          });
        }
      });
    } else if (this.filter_shootCategory == "SOGFaSOGA") {
      this.h2h_data["headToHead"].forEach((item, index) => {
        if (item["uuid"] == player) {
          item["opponents"].forEach((item2, index) => {
            if (item2["uuid"] == opponent) {
              data[0] = item2["metrics"]["sogf"];
              data[1] = item2["metrics"]["soga"];
            }
          });
        }
      });
    } else if (this.filter_shootCategory == "XGFaXGA") {
      this.h2h_data["headToHead"].forEach((item, index) => {
        if (item["uuid"] == player) {
          item["opponents"].forEach((item2, index) => {
            if (item2["uuid"] == opponent) {
              data[0] = item2["metrics"]["xgf"];
              data[1] = item2["metrics"]["xga"];
            }
          });
        }
      });
    }

    //console.log(this.filter_shootCategory);

    return data;
  }

  getSize(player: string, opponent: string) {
    let size = 0;
    //console.log(JSON.stringify(this.h2h_data["headToHead"]));

    this.h2h_data["headToHead"].forEach((item, index) => {
      if (item["uuid"] == player) {
        item["opponents"].forEach((item2, index) => {
          if (item2["uuid"] == opponent) {
            size = item2["metrics"]["toi"];
          }
        });
      }
    });

    size = Math.round(
      this.scaleBetween(size, 10, 30, this.h2h_toi_min, this.h2h_toi_max)
    );
    return size;
  }

  getH2HValues(player: string, opponent: string, value: string) {
    let return_value = "";

    this.h2h_data["headToHead"].forEach((item, index) => {
      if (item["uuid"] == player) {
        item["opponents"].forEach((item2, index) => {
          if (item2["uuid"] == opponent) {
            return_value = item2["metrics"][value];
          }
        });
      }
    });

    return return_value;
  }

  changeGraphDimensions() {
    this.chartOptions = {
      responsive: false,
      legend: false,
      labels: false,
      tooltips: {
        enabled: false,
      },
      scales: {
        xAxes: [
          {
            display: true,
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                if (
                  value == 0 ||
                  value == 20 ||
                  value == 40 ||
                  value == 60 ||
                  value == 80
                ) {
                  return value;
                }
              },
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              max: 10,
              min: -10,
            },
          },
        ],
      },
    };
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
    let name = "";
    //alert(uuid + "   " + JSON.stringify(this.teams_list));
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        name = item["name"];
      }
    });

    return name;
  }

  getPlayerTeamUUID(uuid: string) {
    let data = JSON.parse(localStorage.getItem(uuid));

    if (data != null) {
      if (uuid != undefined || uuid != "" || uuid != null) {
        return JSON.parse(localStorage.getItem(uuid)).team;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  checkPlayersFilters(uuid: string) {
    let result = true;
    if (this.filter_table_teams === "") {
      result = true;
    } else {
      if (this.getPlayerTeamUUID(uuid) === this.filter_table_teams) {
        result = true;
      } else {
        result = false;
      }
    }

    return result;
  }

  getPlayerPost(uuid: string) {
    if (uuid != undefined) {
      if (localStorage.getItem(uuid) != null) {
        if (JSON.parse(localStorage.getItem(uuid))["position"] == "FO") {
          return "Ú";
        } else if (JSON.parse(localStorage.getItem(uuid))["position"] == "DE") {
          return "O";
        }
      } else {
        return "no-post";
      }
    } else {
      return "no-post";
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
  getPlayerFirstName(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return "";
    } else {
      let name = JSON.parse(localStorage.getItem(uuid))["name"];

      return name;
    }
  }
  getPlayerSureName(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return "";
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

        return surname;
      } else {
        return surname;
      }
    }
  }

  getPlayerPost2(uuid: string) {
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

  getAssists(players: any[]) {
    let players_text = "";
    let players_text_full = "";

    if (players != null && players != undefined) {
      players_text = "";

      players.forEach((item, index) => {
        players_text = this.getPlayerName(item) + ", ";
      });

      players_text_full = "(" + players_text.slice(0, -2) + ")";
    } else {
      players_text_full = "";
    }

    if (players_text_full.length > 2) {
      return players_text_full;
    } else {
      return "";
    }
  }

  countObranciAway(i: number) {
    if (i == this.h2h_away_def_count - 1) {
      return true;
    } else {
      return false;
    }
  }

  countObranciHome(i: number) {
    if (i == this.h2h_home_def_count - 1) {
      return true;
    } else {
      return false;
    }
  }

  writePlayers(players: any[]) {
    let html = "";

    let utocnici_selected = "";
    let utocnici_nonselected = "";
    let utocnici_data = "";
    //get utocnici
    players.forEach((item, index) => {
      if (this.getPlayerPost2(item) == "FO") {
        utocnici_nonselected =
          utocnici_nonselected +
          "<div class='sticker sticker__grey sticker-margin'>" +
          this.getPlayerName(item) +
          "</div>";
      }

      if (players.length > 4) {
        utocnici_data =
          "<div class'utocnici'>" +
          utocnici_selected +
          "" +
          utocnici_nonselected +
          "</div>";
      } else {
        utocnici_data = utocnici_selected + "" + utocnici_nonselected;
      }
    });

    //get obranci
    let obranci_selected = "";
    let obranci_nonselected = "";
    let obranci_data = "";
    //get obranci
    players.forEach((item, index) => {
      if (this.getPlayerPost2(item) == "DE") {
        obranci_nonselected =
          obranci_nonselected +
          "<div class='sticker sticker__grey sticker-margin'>" +
          this.getPlayerName(item) +
          "</div>";
      }

      if (players.length > 4) {
        obranci_data =
          "<div class'obranci'>" +
          obranci_selected +
          "" +
          obranci_nonselected +
          "</div>";
      } else {
        obranci_data = obranci_selected + "" + obranci_nonselected;
      }
    });

    return utocnici_data + "" + obranci_data;
  }

  timeFromChange(event: number) {
    this.filter_minutes_from = event * 60;
  }

  timeToChange(event: number) {
    this.filter_minutes_to = event * 60;
  }

  periodChanged(period: string) {
    if (period == "1PERIOD") {
      this.filter_minutes_from = 0;
      this.filter_minutes_to = 20;
      this.selectGame(
        this.selected_game,
        this.game_date,
        this.filter_countOfPlayer,
        "tabulky",
        null
      );
    } else if (period == "2PERIOD") {
      this.filter_minutes_from = 20;
      this.filter_minutes_to = 40;
      this.selectGame(
        this.selected_game,
        this.game_date,
        this.filter_countOfPlayer,
        "tabulky",
        null
      );
    } else if (period == "3PERIOD") {
      this.filter_minutes_from = 40;
      this.filter_minutes_to = 60;
      this.selectGame(
        this.selected_game,
        this.game_date,
        this.filter_countOfPlayer,
        "tabulky",
        null
      );
    } else if (period == "OVERTIME") {
      this.filter_minutes_from = 61;
      this.filter_minutes_to = undefined;
      this.selectGame(
        this.selected_game,
        this.game_date,
        this.filter_countOfPlayer,
        "tabulky",
        null
      );
    } else if (period == "ALL") {
      this.filter_minutes_from = undefined;
      this.filter_minutes_to = undefined;
      this.selectGame(
        this.selected_game,
        this.game_date,
        this.filter_countOfPlayer,
        "tabulky",
        null
      );
    }
  }

  randomPercent() {
    return (Math.floor(Math.random() * 100) + 1).toString();
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

  getPowerplayStart(minute: number) {
    return Math.round((minute / 60) * 12.25) + "px";
  }

  getPowerplayLength(length: number) {
    let minute_x = (100 / this.game_time) * (length / 60);
    return minute_x + "%";
  }

  getPowerplayColour(player_uuid: string) {
    if (this.getPlayerTeamUUID(player_uuid) == this.homeTeamUuid) {
      return this.myColors[2]["backgroundColor"];
    } else {
      return this.myColors[1]["backgroundColor"];
    }
  }

  /* formationAnalysisLink(filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string) {

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
    let filter_team = this.getPlayerTeamUUID(filter_playerId_select1);

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = undefined;

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
    let filter_opponents = undefined;


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
    this.table_settings.forEach(item => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();


    return "formations-analysis/" + filter_season + "/" + filter_seasonPart + "/" + filter_team + "/" + filter_countOfPlayer + "/" + filter_minTOI + "/" + filter_lastGames + "/" + filter_dateFrom + "/" + filter_dateTo + "/" + filter_homeAway + "/" + filter_matchState + "/" + filter_minutes_from + "/" + filter_minutes_to + "/" + filter_opponents + "/" + filter_playerId_select1 + "/" + filter_playerId_select2 + "/" + filter_playerId_select3 + "/" + filter_playerId_select4 + "/" + filter_playerId_select5 + "/" + filter_playerId_select6 + "/" + filter_situationType + "/" + filter_situationTime + "/" + attributes_list;
  } */

  overviewLink(
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
    let filter_minTOI = undefined;

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
    let filter_opponents = this.filter_team2;
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

  trendLink(
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
    let filter_team = this.getPlayerTeamUUID(filter_playerId_select1);

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = undefined;

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
    let filter_opponents = undefined;

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
      "trend/individual/" +
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

  gamelogLinkTeam(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    team_uuid: string
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
    let filter_team = team_uuid;

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = undefined;

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
    let filter_opponents = undefined;

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

  trendLinkTeam(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    team_uuid: string
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
    let filter_team = team_uuid;

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = undefined;

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
    let filter_opponents = undefined;

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
      "trend/team/" +
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
    let filter_team = player_team;
    /* if (filter_team == "ALL") { filter_team = player_team; } */

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = undefined;

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
    let filter_opponents = this.filter_team2;
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

  goalkeepersLink(
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
    let filter_team = player_team;
    //if (filter_team == "ALL") { filter_team = player_team; }

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

    //FILTER filter_minTOI
    let filter_minTOI = undefined;

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
    let filter_opponents = this.filter_team2;
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
    this.table_settings_goalkeepers.forEach((item) => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    return (
      "goalkeepers/" +
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

  toggleVideoModal() {
    if (this.show_video_modal == false) {
      this.show_video_modal = true;
    } else {
      this.show_video_modal = false;
    }
  }

  detectHomeAwayTeam(team_uuid: string) {
    if (team_uuid == this.homeTeamUuid) {
      return "home-colour";
    }
    if (team_uuid == this.awayTeamUuid) {
      return "away-colour";
    }
  }

  getPiechartData(type: string, showPercent: boolean) {
    if (this.dataLoaded == true) {
      let percent = 0;
      let percent_raw = 0;

      let data: any = [];

      let data_souper: any = [];

      this.teams_data.forEach((item, index) => {
        if (item["team"] == this.homeTeamUuid) {
          data.push(item);
        } else {
          data_souper.push(item);
        }
      });

      if (type == "strelecke_pokusy") {
        percent_raw = 175 / (100 / data[0]["cf_percent"]);
        percent = data[0]["cf_percent"];
        //CF%
      } else if (type == "strely_na_branku") {
        let percent_count =
          (100 / (data[0]["sogf"] + data_souper[0]["sogf"])) * data[0]["sogf"];
        percent_raw = 175 / (100 / percent_count);
        percent = percent_count;
        //SF%
      } else if (type == "sance") {
        percent_raw = 175 / (100 / data[0]["scf_percent"]);
        percent = data[0]["scf_percent"];
        //SCF%
      } else if (type == "drzeni_puku") {
        percent_raw = 0;
      } else if (type == "uspesnost_buly") {
        percent_raw = 175 / (100 / data[0]["fow_percent"]);
        percent = data[0]["fow_percent"];
        //FOW%
      }

      percent_raw = Math.trunc(percent_raw);
      percent = Math.trunc(percent);

      if (percent_raw == 175) {
        percent_raw = 176;
      }
      let value = percent_raw + " 175";

      if (showPercent == true) {
        return percent;
      } else {
        return value;
      }
    }
  }

  getVideoDataPlayer(player_uuid: string) {
    this.show_video_modal = false;
    this.video_player_selected = player_uuid;
    this.loading_video = true;
    this.videos_data = [];

    this.defaultService
      .getVideo(this.filter_seasonPart, this.selected_game, player_uuid)
      .subscribe((loaded_data) => {
        this.video_data = loaded_data;
        this.videos_data = [];

        let videoPlayer = loaded_data["videoPlayer"]["videoId"];
        loaded_data["shifts"].forEach((item, index) => {

          let eventData=[];
          eventData = eventData.concat( item.chances);
          eventData = eventData.concat( item.dumpIns);
          eventData = eventData.concat( item.puckWins);
          eventData = eventData.concat( item.goals);
          eventData = eventData.concat( item.shots);
          eventData = eventData.concat( item.shotsOnGoal);


          this.videos_data.push({
            index: index,
            player: player_uuid,
            color: 0,
            videoId: videoPlayer,
            time: item["start"],
            videoTime: item["videoTime"],
            videoEndTime: item["videoEndTime"],
            homeTeam: this.homeTeamUuid,
            awayTeam: this.awayTeamUuid,
            matchDate: this.for_changed_attributes_date,
            score: this.selected_game_score,
            download_type: "shift",
            buly_won: "",
            gameState: "",
            start: item["start"],
            end: item["end"],
            events: eventData,
            isDetailViewOpen : false
          });
        });

        this.loading_video = false;
        this.show_video_modal = true;
      });
  }

  getVideoDataGoalie(player_uuid: string) {
    this.show_video_modal = false;
    this.video_player_selected = player_uuid;
    this.loading_video = true;
    this.videos_data = [];

    this.individualStatsService
      .getGoalkeepersShots(
        this.filter_seasonPart,
        this.getPlayerTeamUUID(player_uuid),
        this.filter_lastGames,
        this.filter_countOfPlayer,
        this.filter_matchState,
        this.filter_homeAway,
        [],
        this.filter_dateFrom,
        this.filter_dateTo,
        this.filter_minutes_from,
        this.filter_minutes_to,
        undefined,
        this.filter_situationType,
        this.filter_situationTime,
        player_uuid
      )
      .subscribe(
        (loaded_data) => {
          //console.log(JSON.stringify(loaded_data));
          loaded_data.forEach((item) => {
            if (item.match == this.for_changed_attributes_uuid) {
              this.videos_data.push(item);
            }
          });

          this.loading_video = false;
          this.show_video_modal = true;
        },
        (err) => {}
      );

    /*
    this.defaultService.getVideo(this.filter_seasonPart, this.selected_game, player_uuid).subscribe(loaded_data => {
      this.video_data = loaded_data;
      this.videos_data = [];

      let videoPlayer = loaded_data["videoPlayer"]["videoId"];

      console.log(JSON.stringify(loaded_data));

      loaded_data["shifts"].forEach((item, index) => {
        this.videos_data.push({
          index: index,
          player: player_uuid,
          color: 0,
          videoId: videoPlayer,
          time: item["start"],
          videoTime: item["videoTime"],
          homeTeam: this.homeTeamUuid,
          awayTeam: this.awayTeamUuid,
          matchDate: this.for_changed_attributes_date,
          score: this.selected_game_score,
          download_type: "shift",
          buly_won: "",
          gameState: ""
        });
      });


    });
    */
  }

  getVideoDataTeam(team_uuid: string) {
    this.video_player_type = "team";
    this.video_player_selected = team_uuid;
    this.show_video_modal = false;
    this.loading_video = true;
    this.videos_data = [];

    this.defaultService
      .getVideoTeam(this.filter_seasonPart, this.selected_game, team_uuid)
      .subscribe((loaded_data) => {
        this.video_data = loaded_data;
        this.videos_data = [];

        let videoPlayer = loaded_data["videoPlayer"]["videoId"];

        loaded_data["players"].forEach((player) => {
          if (this.getPlayerTeamUUID(player.player) == team_uuid) {
            player["penalties"].forEach((item, index) => {
              this.videos_data.push({
                index: index,
                player: player.player,
                color: 0,
                videoId: videoPlayer,
                time: item["time"],
                videoTime: item["videoTime"],
                homeTeam: this.homeTeamUuid,
                awayTeam: this.awayTeamUuid,
                matchDate: this.for_changed_attributes_date,
                score: this.selected_game_score,
                download_type: "penalty",
                buly_won: "",
                gameState: item["gameState"],
              });
            });
          }
        });

        console.log("videodata", this.video_data);
        this.loading_video = false;
        this.show_video_modal = true;
      });
  }

  toggleTableSettings(canvas_type_setting: string, enabled_types: string) {
    this.tab = this.prew_tab;
    this.canvas_type_setting = canvas_type_setting;
    this.enabled_types = enabled_types;
    this.page = "";

    this.table_settings_selection_by_type = [];
    if (this.tab == "goalies") {
      this.table_settings_selection_by_type = this.table_settings_goalkeepers;
      this.page = "goalkeepers";
    } else if (canvas_type_setting == "players") {
      this.table_settings_selection_by_type = this.table_settings_gamelog_hraci;
      this.page = "players";
    } else if (canvas_type_setting == "teams") {
      this.table_settings_selection_by_type = this.table_settings_teams;
      this.page = "teams";
    } else if (canvas_type_setting == "lines") {
      this.table_settings_selection_by_type = this.table_settings_gamelog_hraci;
      this.page = "players";
    }

    if (this.toggle_table_settings == true) {
      this.toggle_table_settings = false;
    } else {
      this.toggle_table_settings = true;

      setTimeout(function () {
        this.cd.detectChanges();
      }, 400);
    }

    console.log("Table settings", this.table_settings);
    console.log(
      "Table settings Selection",
      this.table_settings_selection_by_type
    );
    console.log("canvas type settings", canvas_type_setting);
  }

  getPlayerTeam(uuid: string) {
    if (uuid != undefined) {
      if (localStorage.getItem(uuid) != null) {
        return JSON.parse(localStorage.getItem(uuid))["team"];
      } else {
        return "no-team";
      }
    } else {
      return "no-team";
    }
  }

  onChangedAttributes(new_attributes: any) {
    this.tab = this.prew_tab;
    console.log("New attributes", new_attributes);
    let clean_attributes: any = [];
    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings = clean_attributes;
    this.selectGame(
      this.for_changed_attributes_uuid,
      this.for_changed_attributes_date,
      this.for_changed_attributes_filter_countOfPlayer,
      this.for_changed_attributes_backto,
      null
    );
  }

  onChangedAttributesGoalkeepers(new_attributes: any) {
    this.tab = this.prew_tab;
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_goalkeepers = clean_attributes;
    this.selectGame(
      this.for_changed_attributes_uuid,
      this.for_changed_attributes_date,
      this.for_changed_attributes_filter_countOfPlayer,
      this.for_changed_attributes_backto,
      null
    );
  }

  onChangedAttributesPlayers(new_attributes: any) {
    this.tab = this.prew_tab;
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_gamelog_hraci = clean_attributes;
    this.selectGame(
      this.for_changed_attributes_uuid,
      this.for_changed_attributes_date,
      this.for_changed_attributes_filter_countOfPlayer,
      this.for_changed_attributes_backto,
      null
    );
  }

  onChangedAttributesTeams(new_attributes: any) {
    this.tab = this.prew_tab;
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_teams = clean_attributes;
    this.selectGame(
      this.for_changed_attributes_uuid,
      this.for_changed_attributes_date,
      this.for_changed_attributes_filter_countOfPlayer,
      this.for_changed_attributes_backto,
      null
    );
  }

  onChangedAttributesFormations(new_attributes: any) {
    this.tab = this.prew_tab;
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_gamelog_hraci = clean_attributes;
    this.selectGame(
      this.for_changed_attributes_uuid,
      this.for_changed_attributes_date,
      this.for_changed_attributes_filter_countOfPlayer,
      this.for_changed_attributes_backto,
      null
    );
  }

  getAttributeColour(colour: string) {
    /* let colour = "no-colour";
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
        //console.log(JSON.stringify());
        attributes["individual"][0][item][0]["types"].forEach(type => {
          type["attributes"].forEach(attribute=> {
            if (attribute["type"] == type) {
              colour = item["colour"];
            }
          });
        });
      }

      for (let item in attributes["onIce"][0]) {
        //console.log(JSON.stringify());
        attributes["onIce"][0][item][0]["types"].forEach(type => {
          type["attributes"].forEach(attribute=> {
            if (attribute["type"] == type) {
              colour = item["colour"];
            }
          });
        });
      }

      

      

    } */
    return colour;
  }

  getAttributeText(type: string, show_what: number) {
    let title = "";
    let desc = "";

    if (type != null) {
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

    let attributes = JSON.parse(localStorage.getItem("loaded_attributes"));

    for (let item in attributes["players"][0]["individual"][0]) {
      //console.log(JSON.stringify());
      attributes["players"][0]["individual"][0][item][0]["types"].forEach(
        (type) => {
          type["attributes"].forEach((attribute) => {
            if (attribute["type"] == type) {
              title = item["eng"];
              desc = item["desc"];
            }
          });
        }
      );
    }

    for (let item in attributes["players"][0]["onIce"][0]) {
      //console.log(JSON.stringify());
      attributes["players"][0]["onIce"][0][item][0]["types"].forEach((type) => {
        type["attributes"].forEach((attribute) => {
          if (attribute["type"] == type) {
            title = item["eng"];
            desc = item["desc"];
          }
        });
      });
    }

    if (show_what == 1) {
      return title;
    } else if (show_what == 2) {
      return desc;
    } else {
      return "";
    }
  }

  loadshotflow() {
    this.loading = true;
    this.dataLoaded = true;

    this.chartData[0]["data"] = [];
    this.chartData[1]["data"] = [];
    this.chartData[2]["data"] = [];

    this.flow_penalties = [];
    this.flow_data = [];
    this.graph_goals = [];
    this.flow_number_of_shots = [];
    this.game_time = 0;
    this.chartLabels = [];

    Array.from(Array(81)).forEach((x, i) => {
      this.chartLabels.push(Number(i));
    });

    //flow
    this.gamesService
      .getFlow(
        this.filter_seasonPart,
        this.selected_game,
        this.filter_team,
        this.filter_matchState,
        this.filter_minutes_from,
        this.filter_minutes_to,
        this.filter_situationType,
        this.filter_situationTime,
        this.filter_countOfPlayer_SHOTFLOW
      )
      .subscribe((loaded_data) => {
        this.flow_penalties = loaded_data["penalties"];
        console.log("penalties " + JSON.stringify(this.flow_penalties));

        //console.log(JSON.stringify(loaded_data["timeLine"]));

        this.flow_data = [];
        this.flow_data = loaded_data;

        this.game_time = loaded_data["timeLine"].length;
        this.game_time_overtime = this.chartLabels.length - 1 - this.game_time;

        loaded_data["timeLine"].forEach((item, i) => {
          this.chartData[1]["data"].push(
            item["team"][this.filter_shootCategory_SHOTFLOW] * 1
          );
          this.chartData[2]["data"].push(
            item["opponent"][this.filter_shootCategory_SHOTFLOW] * -1
          );
        });

        loaded_data["goals"].forEach((item, index) => {
          this.addGoalToGraph(item["time"], item["shooter"], item["assists"]);
        });

        this.chartData[1]["data"].forEach((item, index) => {
          let count =
            this.chartData[1]["data"][index] -
            this.chartData[2]["data"][index] * -1;
          this.chartData[0]["data"].push(count);
        });

        /*
      this.graph_goals = [];
      loaded_data["goals"].forEach((item, index) => {




        this.chartLabels = [];
        for (var i = 1; i < this.game_time + 1; i++) {
          this.chartLabels.push(Number(i));
        }



        this.flow_number_of_shots_max = Math.max.apply(Math, this.flow_number_of_shots) + 2;
        this.changeGraphDimensions();








        let minute = Math.floor(item["time"] / this.game_time);

        if (this.getPlayerTeamUUID(item["shooter"]) == selected_team) {

          let shit = minute;
          if (minute > 0 && minute < 21) {
            this.addGoalToGraph(shit, this.chartData[1]['data'][shit], "home", item["shooter"], item["assists"], 0);
          } else if (minute > 20 && minute < 40) {
            this.addGoalToGraph(shit, this.chartData[1]['data'][shit], "home", item["shooter"], item["assists"], -10);
          } else if (minute > 39 && minute < 80) {
            this.addGoalToGraph(shit, this.chartData[1]['data'][shit], "home", item["shooter"], item["assists"], -15);
          }



        } else if (this.getPlayerTeamUUID(item["shooter"]) == selected_team2) {
          let shit = minute;
          if (minute > 0 && minute < 21) {
            this.addGoalToGraph(shit, this.chartData[2]['data'][shit], "away", item["shooter"], item["assists"], 0);
          } else if (minute > 20 && minute < 40) {
            this.addGoalToGraph(shit, this.chartData[2]['data'][shit], "away", item["shooter"], item["assists"], -10);
          } else if (minute > 39 && minute < 80) {
            this.addGoalToGraph(shit, this.chartData[2]['data'][shit], "away", item["shooter"], item["assists"], -15);
          }

        } else if (item["shooter"] != selected_team && item["shooter"] != selected_team2) {
          //alert(item["shooter"]);
        }

      });

      */

        this.changeGraphDimensions();
        this.loading = false;
        this.dataLoaded = true;
      });
  }

  addGoalToGraph(minute: number, shooter: string, assists: any[]) {
    let shot_y = 0;
    let x_value = this.Remap(minute, 0, 4800, 0, 100);
    let selected_team = this.game_home;
    let minute_round = Math.round(minute / 60);

    let home_away = "";
    let numberofshots = 0;

    if (this.getPlayerTeamUUID(shooter) == selected_team) {
      home_away = "home";
      numberofshots = this.chartData[1]["data"][minute_round];
    } else {
      home_away = "away";
      numberofshots = this.chartData[2]["data"][minute_round];
    }
    if (numberofshots < 0) {
      numberofshots = numberofshots * -1;
    }

    let y_value = this.Remap(numberofshots, 0, 10, 0, 230);
    if (home_away == "away") {
      y_value = y_value * -1;
    }

    this.graph_goals.push({
      x: `calc(${x_value}% + -5px)`,
      y: `calc(${y_value}px)`,
      shooter: shooter,
      assists: assists,
      time: minute / 60,
      shots: numberofshots,
      logo: this.getPlayerTeamLogo(this.getPlayerTeamShort(shooter)),
    });
  }

  getShotflowHiddenPart(width: number) {
    let value = this.Remap(width, 0, 20, 0, 250);
    return value + "px";
  }

  Remap(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) / (in_max - in_min)) * (out_max - out_min) + out_min;
  }

  getPlayerTeamLogo(team_shortcut: string) {
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
  getPlayerTeamShort(uuid: string) {
    /* uuid = JSON.parse(localStorage.getItem(uuid))["team"];
    console.log("UUID TEAM TEST", uuid)
    //alert(JSON.stringify(uuid));
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

    return team; */

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

  getPlayerTeamUuid(uuid: string) {
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

  downloadCSVPlayers() {
    let data = [];
    let th = ["Hokej.cz ID", "Tym", "Pozice", "Jmeno hrace", "TOI"];
    let th_types = ["hokejcz_id", "team", "post", "uuid", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data.push(th);

    let row = [];

    this.players_data.forEach((item, index) => {
      row.push(item);
    });

    //console.log(JSON.stringify(row));

    row.forEach((item, index) => {
      let selected_data = [];
      th_types.forEach((item2, index2) => {
        if (item2 == "toi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "oztoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "ozposstoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "posstoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "dztoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "dzposstoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "oppdzptoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "uuid") {
          selected_data.push(accents.remove(this.getPlayerName(item[item2])));
        } else if (item2 == "post") {
          selected_data.push(this.getPlayerPostName(item.uuid));
        } else if (item2 == "team") {
          selected_data.push(this.getPlayerTeamShort(item.uuid));
        } else if (item2 == "hokejcz_id") {
          selected_data.push(
            String("__" + this.getPlayerHokejCZid(item["uuid"]))
          );
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      data.push(selected_data);
    });

    data = JSON.parse(JSON.stringify(data));

    let final_data = JSON.parse(JSON.stringify(data));

    //new Angular5Csv(final_data, 'games', csv_options);
    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
  }

  downloadCSVGoalkeepers() {
    let data = [];
    let th = ["Hokej.cz ID", "Tym", "Pozice", "Jmeno hrace", "TOI"];
    let th_types = ["hokejcz_id", "team", "post", "uuid", "toi"];

    this.table_settings_goalkeepers.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data.push(th);

    let row = [];

    this.goalkeepers_data.forEach((item, index) => {
      row.push(item);
    });

    //console.log(JSON.stringify(row));

    row.forEach((item, index) => {
      let selected_data = [];
      th_types.forEach((item2, index2) => {
        if (item2 == "toi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "oztoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "dztoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "dzposstoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "oppdzptoi") {
          selected_data.push(this.formatSecondsDecimal(item[item2]));
        } else if (item2 == "uuid") {
          selected_data.push(accents.remove(this.getPlayerName(item[item2])));
        } else if (item2 == "post") {
          selected_data.push("B");
        } else if (item2 == "team") {
          selected_data.push(this.getPlayerTeamShort(item.uuid));
        } else if (item2 == "hokejcz_id") {
          selected_data.push(
            String("__" + this.getPlayerHokejCZid(item["uuid"]))
          );
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      data.push(selected_data);
    });

    data = JSON.parse(JSON.stringify(data));

    let final_data = JSON.parse(JSON.stringify(data));

    //new Angular5Csv(final_data, 'games', csv_options);
    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
  }

  downloadCSVFormations() {
    var data_full = this.formations_data;

    var row = [];

    var players_list = [];
    var players_row = [];

    var final_data = [];

    let th = ["Hrace", "TOI"];

    let th_types = ["players", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data_full.forEach((item, index) => {
      row.push(item);
    });

    //console.log(JSON.stringify(row));

    var data_clean = [];

    let data_row = [];

    row.forEach((item2, index2) => {
      let selected_data = [];
      th_types.forEach((item3, index3) => {
        if (item3 == "toi") {
          selected_data.push(String(this.formatSecondsDecimal(item2["toi"])));
        } else if (item2 == "oztoi") {
          selected_data.push(String(this.formatSecondsDecimal(item2["oztoi"])));
        } else if (item2 == "dztoi") {
          selected_data.push(String(this.formatSecondsDecimal(item2["dztoi"])));
        } else if (item2 == "dzposstoi") {
          selected_data.push(
            String(this.formatSecondsDecimal(item2["dzposstoi"]))
          );
        } else if (item2 == "oppdzptoi") {
          selected_data.push(
            String(this.formatSecondsDecimal(item2["oppdzptoi"]))
          );
        } else if (item3 == "players") {
          players_row = [];
          item2[item3].forEach((item2) => {
            players_row.push(accents.remove(this.getPlayerName(item2)));
          });

          selected_data.push(players_row.join(", "));
        } else {
          selected_data.push(String(item2[item3]));
        }
      });

      data_row.push(selected_data);

      data_clean.push(data_row);
    });

    final_data = data_clean;

    let with_header = [];
    with_header.push(th);

    final_data[0].forEach((item, index2) => {
      with_header.push(item);
    });

    //new Angular5Csv(with_header, 'games', csv_options);
    this.defaultService.downloadXLS(with_header).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
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

  formatSecondsDecimal(seconds: number) {
    return seconds / 60;
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

  setDefaultOrderRow() {
    this.list_order = 0;
  }

  addOrderRow() {
    this.list_order = this.list_order + 1;
  }

  //detekce existence videa. Je az od sezony 2017>
  checkVideoExists() {
    let exists = true;
    this.filter_season.forEach((item) => {
      if (item["id"] == "2017" && this.filter_season.length == 1) {
        exists = false;
      }
    });
    return exists;
  }

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

  //TRACKING
  trackOpenPage() {
    let logged_user = JSON.parse(localStorage.getItem("logged_user"));
    this.defaultService
      .addEvent(
        logged_user[0].id,
        logged_user[0].user,
        "Byla otevřena obrazovka zápasy.",
        5
      )
      .subscribe((loaded_data) => {});
  }

  checkLanguage() {
    var lang = localStorage.getItem("language");
    return lang == "cz";
  }

  checkExistParameter() {
    let parameters_exists_reload_data = false;
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log("Params", params);
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
        //this.getPlayerList();

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

      /* if (
        params["filter_minTOI"] != undefined &&
        params["filter_minTOI"] != "undefined"
      ) {
        this.filter_minTOI = parseInt(params["filter_minTOI"]);

        //
        parameters_exists_reload_data = true;
      } */

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

        this.filter_team2 = params["filter_opponents"].split(",");

        //
        parameters_exists_reload_data = true;
      }

      /* if (
        params["filter_playerId_select1"] != undefined &&
        params["filter_playerId_select1"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_individual_player = params["filter_playerId_select1"];
        //
        parameters_exists_reload_data = true;
        //this.active_player1 = true;
      } */

      this.selected_game = params.game;

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
        /* for (let item in attributes["players"][0]["onIce"][0]) {
          attributes["players"][0]["onIce"][0][item][0]["types"].forEach(
            (item, index) => {
              item["attributes"].forEach(item2 => {
                item2["onIce"] = true;
                loaded_attributes.push(item2);
              });
            }
          );
        } */

        /* if(params.page == "gamelog"){
          this.table_settings_gamelog = [];
          parameter_attributes.forEach((item) => {
            loaded_attributes.forEach((element) => {
              if (element["type"] == item) {
                console.log("true")
                this.table_settings_gamelog.push({
                  type: element["type"],
                  name: element["name"],
                  colour: element["colour"],
                  eng: element["eng"],
                  desc: element["desc"],
                  data: element["data"],
                  onIce: element["onIce"],
                  origin: element["type"],
                  types: []
                });
              };
            });
          });
        }else{ */

        console.log("Parameter atributes", parameter_attributes);
        this.table_settings_gamelog_hraci = [];
        this.table_settings_gamelog_hraci =
          this.formatParametersService.formatParameters(
            parameter_attributes,
            "players"
          );
        /* parameter_attributes.forEach((item) => {
            loaded_attributes.forEach((element) => {
              if (element["type"] == item) {
                this.table_settings_gamelog_hraci.push({
                  type: element["type"],
                  name: element["name"],
                  colour: element["colour"],
                  eng: element["eng"],
                  desc: element["desc"],
                  data: element["data"],
                  onIce: element["onIce"],
                  origin: element["type"],
                  types: []
                });
              };
            });
          }); */
        //}
        this.table_settings_gamelog_hraci = this.chceckDuplicates(
          this.table_settings_gamelog_hraci
        );
        console.log("Loaded attributes Link", loaded_attributes);
        console.log("Table settings Link", this.table_settings_gamelog_hraci);

        parameters_exists_reload_data = true;
      }

      if (parameters_exists_reload_data == true) {
        /* this.loadData(this.tab_small_viz); */

        this.tab = params.page;
        this.prew_tab = this.tab;
        if (params.page == "players") {
          this.loadPage("players");
        }
        /*  if(params.page == "gamelog"){
          this.loadData("gamelog");
        }else if(params.page == "trend"){
          this.showTab("trend");
        } */
      }
    });
  }

  morePlayersLink(filter_team, attribute) {
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
    /* let filter_team = this.filter_team;
    if (filter_team == "ALL") { filter_team = player_team; } */

    //FILTER filter_countOfPlayer
    let filter_countOfPlayer = this.filter_countOfPlayer;

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

    //FILTER filter_opponent
    let filter_opponents = this.filter_team2.toString();
    if (filter_opponents.length == 0) {
      filter_opponents = undefined;
    }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") {
      filter_situationType = undefined;
    }

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
      "games/" +
      filter_season +
      "/" +
      filter_seasonPart +
      "/" +
      filter_team +
      "/" +
      this.selected_game +
      "/" +
      filter_opponents +
      "/" +
      attribute +
      "/players"
    );
  }

  private chceckDuplicates(data: any) {
    /* console.log("data",data) */
    let filterValues = data.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => t.place === thing.place && t.name === thing.name)
    );
    /* console.log("filterValues",filterValues) */
    return filterValues;
  }

  openHelp(event) {
    if (this.tab != "canvas") {
      this.prew_tab = this.tab;
    }
    this.tab = "canvas";
    console.log("prewTab", this.prew_tab);

    this.help.openHelp();
  }

  scroll_next2() {
    this.games_scroll2 = this.games_scroll2 + 320;
    this.scrollContainer.nativeElement.scrollLeft = this.games_scroll2;

    if (this.games_scroll2 > 0) {
      this.canscrollprev2 = true;
    }
  }

  scroll_prev2() {
    if (this.canscrollprev) {
      this.games_scroll2 = this.games_scroll2 - 320;
      this.scrollContainer.nativeElement.scrollLeft = this.games_scroll2;

      if (this.games_scroll2 == 0) {
        this.canscrollprev2 = false;
      }
    }
  }
}
