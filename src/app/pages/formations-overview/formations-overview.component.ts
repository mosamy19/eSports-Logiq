import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
  isDevMode,
  ChangeDetectorRef,
} from "@angular/core";

import { Location } from "@angular/common";

import { Router, ActivatedRoute, Params } from "@angular/router";

import { DatepickerOptions } from "ng2-datepicker";
import * as csLocale from "date-fns/locale/cs";

//import * as _ from "lodash";
import { IndividualStatsService } from "../../services/individual-stats/individual-stats.service";
import { FormationsOverviewService } from "../../services/formations-overview/formations-overview.service";
import { DefaultService } from "../../services/default/default.service";
import { WOWYService } from "../../services/wowy/wowy.service";
import { FormatParametersService } from "../../services/format-parameters/format-parameters.service";
import { FormationsAnalysisService } from "../../services/formations-analysis/formations-analysis.service";
import { GamesService } from "../../services/games/games.service";
import { TrendService } from "../../services/trend/trend.service";

import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
declare var require: any;
var accents = require("remove-accents");

import { TranslatePipe } from "../../pipes/translate.pipe";
import { clone, cloneDeep, eq, NotVoid } from "lodash";
import { GamelogService } from "../../services/gamelog/gamelog.service";

import { Color, BaseChartDirective, Label } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import { NavComponent } from "../../components/nav/nav.component";

var csv_options = {
  quoteStrings: '"',
  fieldSeparator: ";",
  decimalseparator: ".",
  type: "text/csv;charset=ISO-8859-1;",
};

@Component({
  selector: "formations-overview",
  templateUrl: "./formations-overview.component.html",
  styleUrls: ["./formations-overview.component.scss"],
  providers: [
    IndividualStatsService,
    FormationsOverviewService,
    WOWYService,
    DefaultService,
    TranslatePipe,
    FormationsAnalysisService,
    GamesService,
    GamelogService,
    TrendService,
  ],
})
export class FormationsOverviewComponent implements OnInit {
  @ViewChild("help") private help: NavComponent;
  @ViewChild("scroll") private scrollContainer: ElementRef;

  /* pridane z formations-overview */
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

  data: any = [];
  data_unformatted: any = [];
  table_players: any = [];
  dataSets: any = [];
  /* Pridane */
  data_dvojice: any = [];
  poradi_loaded: boolean = false;

  tab: string;
  prew_tab: string = "";

  more_filters: boolean;

  players_list: any;
  date_from: any;
  date_to: any;
  selected_daterange: any;

  dataLoaded: boolean;
  loading: boolean;

  filterby: string = "toi";
  filterby2: string = "toi";

  shoda_sortby: string = "toi";
  shodaSort_value: string = "desc";

  filter_vyber_dat_dle: boolean = true;
  trend_type: string = "";
  data_graph: any = [];
  matches_list: any = [];
  filter_graph_attribute: string = "cf60";
  show_canvas_tooltip: boolean = false;
  tooltip_value: string = "";
  tooltip_date: string = "";
  tooltip_match: string = "";
  canvas_tooltip_left: number = 0;
  canvas_tooltip_top: number = 0;
  public lineChartOptions: ChartOptions = {};
  public lineChartColors: Color[] = [];
  public lineChartData: Array<any> = [];
  public lineChartLabels: Label[] = [];
  @ViewChild("lol") private lol: ElementRef;
  @ViewChild("chart") private chart: ElementRef;
  trend_table_loading: boolean = false;
  data_table: any = [];
  trend_limits: any[] = [
    { date_from: "", date_to: "", match_from: null, match_to: null },
  ];
  period_match_from: number;
  period_match_to: number;

  /* pre kombinace v*/
  active_player1: boolean = true;
  active_player2: boolean = true;
  active_player3: boolean = true;
  active_player4: boolean = true;
  active_player5: boolean = true;
  active_player6: boolean = true;

  selected_attributes_string: any;
  tab_small_viz: string;

  filter_dataSet: string = "ALL";

  filter_playerId_select1: string = "";
  filter_playerId_select2: string = "";
  filter_playerId_select3: string = "";
  filter_playerId_select4: string = "";
  filter_playerId_select5: string = "";
  filter_playerId_select6: string = "";

  filter_selected_players1: string = "off";
  filter_selected_players2: string = "off";
  filter_selected_players3: string = "off";
  filter_selected_players4: string = "off";
  filter_selected_players5: string = "off";
  filter_selected_players6: string = "off";

  gamelog_select: any = [];

  selected_players_list: any = [];
  spoluhraci_data: any = [];
  protihraci_data: any = [];
  /* pre kombinace ^ */

  /* pridane */
  loading_dvojice: boolean;
  ligovy_percetnil_active: boolean = false;
  poradi_loading: boolean = false;
  poradi_data_vtymu: any = [];
  poradi_data_liga: any = [];
  filter_metricFilter_metric: string = "";
  filter_metricFilter_value: number;
  hold_player: any;
  show_chosen_one: boolean = false;
  chosen_one: string;
  filter_compare_with: string = "spoluhraci";

  /* pridane */

  teams_list: any[];
  seasons_list: any[];
  graph_averages: any;
  competitions_list: any[];
  selected_teams: any = []; /* pridal */

  selected_player: any = [];

  team_list_filter: any = [];

  no_data: boolean = false;
  tois: any = [];
  max_toi: any;
  min_toi: any;

  filter_player_loaded: string = "";

  //filters
  filter_season: any = [];
  filter_seasonPart: string = "";
  filter_team: string = "";
  filter_player: string = "";

  filter_countOfPlayer: string = "5:5";
  filter_selectFormationKind: string = "5:5";

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
  filter_hraci_spolu: boolean = true;
  filter_hraci_zvlast: boolean = true;
  filter_spoluhraci_zvlast: boolean = true;
  filter_dvojice_post: string = "ALL";
  filter_posts: string = "ALL";
  filter_s_bez: boolean = false;

  filter_situationType: string = "";
  filter_situationTime: number;

  page: string = "players";

  //filters end

  selectedPlayer: string = "";

  list_order: number = 0;

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
      onIce: false,
      origin: "pwcf60",
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
      origin: "blkca_percent",
      types: [],
    },
  ];

  table_settings_default: any[] = [];

  seasons_select_list = [];
  toggle_table_settings: boolean = false;
  selectedItems = [];
  dropdownSettings = {};
  dropdownSettings2 = {};

  defined_datasest: any = [];

  average_compare: string = "";
  averages_data: any = [];

  show_skala: boolean = false;

  data_csv: any = [];

  data_relativeToTeam: any = [];

  skala_loading: boolean = false;

  boolProd: boolean = true;

  canscrollprev: boolean = false;
  canscrollnext: boolean = true;
  games_scroll: number = 0;

  constructor(
    private gamesService: GamesService,
    private formatParametersService: FormatParametersService,
    private trendService: TrendService,
    private gamelogService: GamelogService,
    private formationsAnalysisService: FormationsAnalysisService,
    private cd: ChangeDetectorRef,
    private translate: TranslatePipe,
    private individualStatsService: IndividualStatsService,
    private wowyService: WOWYService,
    private formationsOverviewService: FormationsOverviewService,
    private defaultService: DefaultService,
    private zone: NgZone,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.tab = "";
    this.more_filters = false;

    this.selectedItems = [];

    if (localStorage.language === "cz") {
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
    } else if (localStorage.language === "en") {
      this.dropdownSettings = {
        singleSelection: false,
        text: "Select season",
        selectAllText: "Select all",
        unSelectAllText: "Remove all",
        enableSearchFilter: false,
        classes: "multiselect",
      };

      this.dropdownSettings2 = {
        singleSelection: false,
        text: "All teams",
        selectAllText: "Select all",
        unSelectAllText: "Remove all",
        enableSearchFilter: false,
        classes: "multiselect",
      };
    }

    this.table_settings_default = cloneDeep(this.table_settings);

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

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }
  }

  ngOnInit() {
    this.defaultService
      .getAttributesUserList(
        JSON.parse(localStorage.getItem("logged_user"))[0]["id"]
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
    this.getPlayerList();
  }

  testIndex() {}

  selectTeams() {
    this.filter_opponents = [];

    this.selected_teams.forEach((item) => {
      this.filter_opponents.push(item.uuid);
    });
  }

  loadNewData(clear: boolean): void {
    /* alert('showTab') */
    /* console.log('showTab tab')
    console.log(this.tab); */
    console.log("clear", clear);
    if (clear == true) {
      this.filter_selected_players1 = "off";
      this.filter_selected_players2 = "off";
      this.filter_selected_players3 = "off";
      this.filter_selected_players4 = "off";
      this.filter_selected_players5 = "off";
      this.filter_selected_players6 = "off";

      this.active_player1 = false;
      this.active_player2 = false;
      this.active_player3 = false;
      this.active_player4 = false;
      this.active_player5 = false;
      this.active_player6 = false;

      this.filter_playerId_select1 = "";
      this.filter_playerId_select2 = "";
      this.filter_playerId_select3 = "";
      this.filter_playerId_select4 = "";
      this.filter_playerId_select5 = "";
      this.filter_playerId_select6 = "";
    }

    if (this.tab == "pairs") {
      this.loadDvojice();
    }
    if (this.tab == "lines") {
      this.loadFormace();
    }
    if (this.tab == "combos") {
      this.loadKombinace();
    }
    if (this.tab == "gamelog") {
      this.openGamelog(
        this.filter_player,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
    if (this.tab == "trend") {
      this.openTrend(
        this.filter_player,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
  }

  showMoreFilters(): void {
    if (this.more_filters == true) {
      this.more_filters = false;
    } else {
      this.more_filters = true;
    }
  }

  toggleLigovyPercentil(): void {
    this.poradi_loaded = false;
    this.show_skala = false;

    if (this.ligovy_percetnil_active) {
      this.ligovy_percetnil_active = false;
    } else {
      this.ligovy_percetnil_active = true;

      this.active_skala();

      /* this.loadPoradiData('vtymu');
      this.loadPoradiData('liga'); */
    }
  }

  setMinAttribute(attribute) {
    this.filter_metricFilter_metric = attribute;
  }
  setMinAttributeValue(attribute_value) {
    this.filter_metricFilter_value = attribute_value;
  }

  getSkalaNumber(
    formationPlayers: any,
    attribute: string,
    mPlayer: boolean,
    line: number
  ) {
    var data = [];
    var cell_value = "";

    if (this.tab == "pairs") {
      if (mPlayer) {
        data = this.data_relativeToTeam.wowy.selected_player[0];
      } else {
        line = line - 1;
        this.data_relativeToTeam.wowy.stats.forEach((element) => {
          if (element.uuid == formationPlayers) {
            data = element.stats[line];
          }
        });
      }
    } else if (this.tab == "lines") {
      if (mPlayer) {
        data = this.data_relativeToTeam.wowy[0];
      } else {
        formationPlayers.forEach((element) => {
          this.data_relativeToTeam.forEach((element2, index) => {
            if (
              this.checkFormationPlayers(formationPlayers, element2.players)
            ) {
              data = element2.stats;
            }
          });
        });
      }
    }

    if (this.show_skala) {
      cell_value = data[attribute];
      return cell_value;
    }
  }

  getCountOfPlayersTeam(post: string, team: string): number {
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
  ): string {
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
    console.log("Value 1", value);
    return value;
  }

  getCountOfPlayersLeague(post: string): number {
    let count = 0;
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

    return count;
  }

  getPoradiLiga(
    player_uuid: string,
    team: any,
    attribute: string,
    type: string
  ): string {
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

  loadPoradiData(type: string): void {
    this.poradi_loading = true;
    this.poradi_loaded = false;

    let filter_team_by_checkbox = "";
    if (type == "vtymu") {
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
            /* console.log("data1 " + JSON.stringify(loaded_data)); */

            this.poradi_data_vtymu = loaded_data;
            console.log("Poradi v teamu", this.poradi_data_vtymu);
            this.cd.detectChanges();
          },
          (err) => {}
        );
    } else if (type == "liga") {
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

            console.log("Poradi v lige", this.poradi_data_liga);
          },
          (err) => {}
        );
    }
  }
  createArray() {
    var arr = [];
    for (var i = 0; i < arguments.length; ++i) arr[i] = arguments[i];
    console.log(arr);
    return arr;
  }
  openKombinace(players: any, team: string) {
    if (Array.isArray(players)) {
      if (players[0] != undefined) this.filter_playerId_select1 = players[0];
      if (players[1] != undefined) this.filter_playerId_select2 = players[1];
      if (players[2] != undefined) this.filter_playerId_select3 = players[2];
      if (players[3] != undefined) this.filter_playerId_select4 = players[3];
      if (players[4] != undefined) this.filter_playerId_select5 = players[4];
    } else {
      this.filter_playerId_select1 = players;
      this.selected_player = players;
    }

    this.loadKombinace();
  }

  setPlayersVariations(variation: string): void {
    if (variation === "hraci_spolu") {
      this.filter_hraci_spolu = !this.filter_hraci_spolu;
    }

    if (variation === "hraci_zvlast") {
      this.filter_hraci_zvlast = !this.filter_hraci_zvlast;
    }

    if (variation === "spoluhrac_zvlast") {
      this.filter_spoluhraci_zvlast = !this.filter_spoluhraci_zvlast;
    }
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

    if (this.filter_dataSet == "ALL") {
      dataset = this.table_settings_default;
    } else {
      this.dataSets.forEach((item) => {
        if (Number(item.id) === Number(this.filter_dataSet)) {
          dataset = item.data;
        }
      });
    }

    dataset = this.formatParametersService.formatParameters(dataset, "players");
    this.onChangedAttributes(dataset);
  }

  addOpponent(opponent_id: string): void {
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

  checkSelectedOpponent(opponent_id: string): any {
    return this.filter_opponents.includes(opponent_id);
  }

  setOpponentsAll(): void {
    this.filter_opponents = [];
    this.filter_opponents.slice();
  }

  vybratTeamCheck(): void {
    if (this.filter_opponents.includes(this.filter_team)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent == this.filter_team) {
          delete this.filter_opponents[index];
        }
      });
    }
  }

  scroll_next() {
    this.games_scroll = this.games_scroll + 320;
    this.scrollContainer.nativeElement.scrollLeft = this.games_scroll;

    if (this.games_scroll > 0) {
      this.canscrollprev = true;
    }
  }

  scroll_prev() {
    if (this.canscrollprev) {
      this.games_scroll = this.games_scroll - 320;
      this.scrollContainer.nativeElement.scrollLeft = this.games_scroll;

      if (this.games_scroll == 0) {
        this.canscrollprev = false;
      }
    }
  }

  checkNonselectedOpponent(): boolean {
    this.filter_opponents = this.removeShitNulls(this.filter_opponents);
    if (this.filter_opponents.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  removeShitNulls(array): any {
    return array.filter(function (e) {
      return e;
    });
  }

  toggleCompare(compare_with: string): void {
    this.filter_compare_with = compare_with;
  }

  toggleActivePlayer(toActive: number): void {
    if (toActive == 1 && this.filter_playerId_select1 != "") {
      this.active_player1 = !this.active_player1;
    }
    if (toActive == 2 && this.filter_playerId_select2 != "") {
      this.active_player2 = !this.active_player2;
    }
    if (toActive == 3 && this.filter_playerId_select3 != "") {
      this.active_player3 = !this.active_player3;
    }
    if (toActive == 4 && this.filter_playerId_select4 != "") {
      this.active_player4 = !this.active_player4;
    }
    if (toActive == 5 && this.filter_playerId_select5 != "") {
      this.active_player5 = !this.active_player5;
    }
    this.loadNewData(false);
  }
  clearPlayer(toClear: number) {
    if (toClear == 1) {
      this.filter_playerId_select1 = "";
      this.filter_player = "";
    }
    if (toClear == 2) {
      this.filter_playerId_select2 = "";
    }
    if (toClear == 3) {
      this.filter_playerId_select3 = "";
    }
    if (toClear == 4) {
      this.filter_playerId_select4 = "";
    }
    if (toClear == 5) {
      this.filter_playerId_select5 = "";
    }

    this.loadNewData(false);
  }

  changeFilterPost(): void {
    this.loadNewData(false);
  }

  openGamelog(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string
  ) {
    this.gamelog_select = [];

    if (this.tab != "combos") {
      if (this.filter_selectFormationKind != "5:5") {
        this.filter_countOfPlayer = this.filter_selectFormationKind;
      }
      if (
        filter_playerId_select1 != undefined &&
        filter_playerId_select1 != ""
      ) {
        this.filter_playerId_select1 = filter_playerId_select1;
        this.gamelog_select.push(filter_playerId_select1);
        this.filter_selected_players1 = "on";
      } else {
        this.filter_selected_players1 = "off";
      }
      if (
        filter_playerId_select2 != undefined &&
        filter_playerId_select2 != ""
      ) {
        this.filter_playerId_select2 = filter_playerId_select2;
        this.gamelog_select.push(filter_playerId_select2);
        this.filter_selected_players2 = "on";
      } else {
        this.filter_selected_players2 = "off";
      }
      if (
        filter_playerId_select3 != undefined &&
        filter_playerId_select3 != ""
      ) {
        this.filter_playerId_select3 = filter_playerId_select3;
        this.gamelog_select.push(filter_playerId_select3);
        this.filter_selected_players3 = "on";
      } else {
        this.filter_selected_players3 = "off";
      }
      if (
        filter_playerId_select4 != undefined &&
        filter_playerId_select4 != ""
      ) {
        this.filter_playerId_select4 = filter_playerId_select4;
        this.gamelog_select.push(filter_playerId_select4);
        this.filter_selected_players4 = "on";
      } else {
        this.filter_selected_players4 = "off";
      }
      if (
        filter_playerId_select5 != undefined &&
        filter_playerId_select5 != ""
      ) {
        this.filter_playerId_select5 = filter_playerId_select5;
        this.gamelog_select.push(filter_playerId_select5);
        this.filter_selected_players5 = "on";
      } else {
        this.filter_selected_players5 = "off";
      }
    } else {
      if (
        this.filter_playerId_select1 != "" &&
        this.filter_playerId_select1 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select1);
      }
      if (
        this.filter_playerId_select2 != "" &&
        this.filter_playerId_select2 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select2);
      }
      if (
        this.filter_playerId_select3 != "" &&
        this.filter_playerId_select3 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select3);
      }
      if (
        this.filter_playerId_select4 != "" &&
        this.filter_playerId_select4 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select4);
      }
      if (
        this.filter_playerId_select5 != "" &&
        this.filter_playerId_select5 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select5);
      }
    }

    this.loadGamelog();
  }

  loadDvojice(): void {
    this.loading = true;
    this.filter_playerId_select1 = "";
    this.filter_playerId_select2 = "";
    this.filter_playerId_select3 = "";
    this.filter_playerId_select4 = "";
    this.filter_playerId_select5 = "";

    if (this.filter_team == "ALL") {
      alert("Prosím vyberte tým");
      this.loading = false;
    }
    if (this.filter_player == "") {
      alert("Prosím vyberte hráče");
      this.no_data = true;
      this.loading = false;
    }

    this.checkLoggedTime();
    this.tab = "pairs";
    this.prew_tab = this.tab;

    if (this.filter_player != "") {
      this.data = [];
      this.table_players = [];

      this.poradi_loaded = false;
      this.show_skala = false;
      this.ligovy_percetnil_active = false;

      this.filter_s_bez = false;

      this.selected_player = [];

      this.average_compare = "";
      this.show_skala = false;
      this.skala_loading = false;

      this.average_compare = "team";
      this.wowyService
        .getWowy(
          this.filter_seasonPart,
          this.filter_player,
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
            console.log("Loaded data Wowy", loaded_data);
            this.no_data = false;

            if (
              loaded_data["wowy"]["selected_player"].length == 0 ||
              loaded_data["wowy"]["stats"].length == 0
            ) {
              this.no_data = true;
            }
            this.selected_player = "";
            this.selected_player = loaded_data["wowy"]["selected_player"];
            this.data = loaded_data["wowy"]["stats"];
            this.data.forEach((item, index) => {
              this.data[index]["toi"] = item["stats"][0]["toi"];
              this.data[index]["gp"] = item["stats"][0]["gp"];

              this.table_settings.forEach((item2, index2) => {
                this.data[index][item2["type"]] =
                  item["stats"][0][item2["type"]];
              });
            });

            if (this.filter_posts == "FO") {
              let newData = [];
              this.data.forEach((item, index) => {
                if (this.getPlayerPost(item.uuid) == "FO") {
                  newData.push(item);
                }
              });
              this.data = newData;
            }

            if (this.filter_posts == "DE") {
              let newData = [];
              this.data.forEach((item, index) => {
                if (this.getPlayerPost(item.uuid) == "DE") {
                  newData.push(item);
                }
              });
              this.data = newData;
            }

            this.max_toi = Math.max.apply(Math, this.tois);
            this.min_toi = Math.min.apply(Math, this.tois);

            this.loading = false;
            this.dataLoaded = true;
          },
          (err) => {
            window.location.reload();
          }
        );
    }
  }

  /* loading Formacii */
  loadFormace(): void {
    this.filter_playerId_select1 = "";
    this.filter_playerId_select2 = "";
    this.filter_playerId_select3 = "";
    this.filter_playerId_select4 = "";
    this.filter_playerId_select5 = "";

    this.tab = "lines";
    this.prew_tab = this.tab;
    this.poradi_loaded = false;
    this.show_skala = false;
    this.ligovy_percetnil_active = false;

    this.skala_loading = false;
    this.show_skala = false;

    this.checkLoggedTime();
    this.data = [];
    this.table_players = [];

    this.filter_s_bez = false;

    this.selected_player = [];

    this.average_compare = "";

    this.loading = true;

    if (this.filter_team == "") this.filter_team = "ALL";

    /* if(this.filter_selectFormationKind == ''){
      this.filter_selectFormationKind = '5:5' ;
    } */

    if (this.filter_player == "") {
      this.chosen_one = "";
      /* alert("neni vyplnen hrac"); */
      this.formationsOverviewService
        .getDataWithoutPlayer(
          this.filter_seasonPart,
          this.filter_player,
          this.filter_team,
          this.filter_lastGames,
          this.filter_selectFormationKind,
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
            //console.log("Loaded Data", loaded_data)
            console.log("Loaded data", loaded_data);
            if (this.filter_selectFormationKind === "3:3") {
              let valid_data = [];
              loaded_data.forEach((element) => {
                if (element.players.length === 3) {
                  valid_data.push(element);
                }
              });
              loaded_data = valid_data;
            }

            this.data_csv = loaded_data;

            this.data_unformatted = loaded_data;
            this.selectedPlayer = this.filter_player;

            this.data_unformatted.forEach((item, index) => {
              let attackers = [];
              let defenders = [];
              let all = [];
              item.players.forEach((element) => {
                let post = this.getPlayerPost(element);
                if (post === "FO") {
                  attackers.push(element);
                } else if (post === "DE") {
                  defenders.push(element);
                }
              });
              all = attackers.concat(defenders);

              this.data.push(item["stats"]);
              this.data[index]["players"] = all;
              this.data[index]["attackers"] = attackers;
              this.data[index]["defenders"] = defenders;
              this.data[index]["team"] = item.team;

              this.table_players.push(item["players"]);
            });

            this.no_data = false;
            if (this.data.length == 0 || this.table_players.length == 0) {
              this.no_data = true;
            }

            this.loading = false;
            this.dataLoaded = true;
            //load end
            console.log("data", this.data);
          },
          (err) => {
            alert("load se nepodaril");
            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
            //this.defaultService.logout();
            //window.location.reload();
          }
        );
    } else {
      //alert("je vyplnen hrac");
      this.filter_player_loaded = this.filter_player;
      this.chosen_one = this.filter_player;

      this.formationsOverviewService
        .getDataWithPlayer(
          this.filter_seasonPart,
          this.filter_player,
          this.filter_team,
          this.filter_lastGames,
          this.filter_selectFormationKind,
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
            console.log("loaded data", loaded_data);
            if (this.filter_selectFormationKind === "3:3") {
              let valid_data = [];
              loaded_data.forEach((element) => {
                if (element.players.length === 3) {
                  valid_data.push(element);
                }
              });
              loaded_data = valid_data;
            }

            this.data_csv = loaded_data;

            this.data_unformatted = loaded_data;
            this.selectedPlayer = this.filter_player;

            let swapeIndex = 0;
            console.log("choosen_one", this.chosen_one);
            this.data_unformatted.forEach((item, index) => {
              let attackers = [];
              let defenders = [];
              let all = [];
              item.players.forEach((element) => {
                let post = this.getPlayerPost(element);
                if (post === "FO") {
                  if (this.chosen_one == element) {
                    attackers.unshift(element);
                  } else {
                    attackers.push(element);
                  }
                } else if (post === "DE") {
                  if (this.chosen_one == element) {
                    defenders.unshift(element);
                  } else {
                    defenders.push(element);
                  }
                }
              });

              all = attackers.concat(defenders);

              this.data.push(item["stats"]);

              this.data[index]["players"] = all;
              this.table_players.push(item["players"]);
              this.data[index]["attackers"] = attackers;
              this.data[index]["defenders"] = defenders;
              this.data[index]["team"] = this.filter_team;
            });

            this.no_data = false;
            if (this.data.length == 0 || this.table_players.length == 0) {
              this.no_data = true;
            }

            if (this.filter_player != "") {
              this.wowyService
                .getWowy(
                  this.filter_seasonPart,
                  this.filter_player,
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
                    console.log("loaded_data", loaded_data);
                    this.selected_player =
                      loaded_data["wowy"]["selected_player"];
                    this.dataLoaded = true;
                    this.loading = false;
                  },
                  (err) => {
                    //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
                    //this.defaultService.logout();
                    //window.location.reload();
                  }
                );
            } else {
            }
          },
          (err) => {
            //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
            //this.defaultService.logout();
            //window.location.reload();
          }
        );
    }
  }

  getPlayerColor(player: string): string {
    if (player === this.filter_playerId_select1) {
      return this.filter_selected_players1 == "on"
        ? "confirmedPLayer"
        : "notConfirmedPlayer";
    }
    if (player === this.filter_playerId_select2) {
      return this.filter_selected_players2 == "on"
        ? "confirmedPLayer"
        : "notConfirmedPlayer";
    }
    if (player === this.filter_playerId_select3) {
      return this.filter_selected_players3 == "on"
        ? "confirmedPLayer"
        : "notConfirmedPlayer";
    }
    if (player === this.filter_playerId_select4) {
      return this.filter_selected_players4 == "on"
        ? "confirmedPLayer"
        : "notConfirmedPlayer";
    }
    if (player === this.filter_playerId_select5) {
      return this.filter_selected_players5 == "on"
        ? "confirmedPLayer"
        : "notConfirmedPlayer";
    }
  }

  loadKombinace(): void {
    this.tab = "combos";
    this.prew_tab = this.tab;
    this.poradi_loaded = false;
    this.show_skala = false;
    this.ligovy_percetnil_active = false;

    this.skala_loading = false;
    this.show_skala = false;

    this.checkLoggedTime();
    this.data = [];
    this.table_players = [];
    this.chosen_one = "";

    this.filter_s_bez = false;

    this.selected_player = [];
    this.selected_players_list = [];

    this.average_compare = "";

    this.loading = true;
    this.no_data = true;

    this.filter_selected_players1 = "off";
    this.filter_selected_players2 = "off";
    this.filter_selected_players3 = "off";
    this.filter_selected_players4 = "off";
    this.filter_selected_players5 = "off";
    this.filter_selected_players6 = "off";

    /* this.active_player1 = false;
    this.active_player2 = false;
    this.active_player3 = false;
    this.active_player4 = false;
    this.active_player5 = false;
    this.active_player6 = false; */

    /* kotva */
    /* if(this.filter_player != ''){
      this.selected_players_list.push(this.filter_player);
      this.filter_selected_players6 = 'on';
    } */

    if (this.filter_playerId_select1 != "")
      this.selected_players_list.push(this.filter_playerId_select1);
    if (this.filter_playerId_select2 != "")
      this.selected_players_list.push(this.filter_playerId_select2);
    if (this.filter_playerId_select3 != "")
      this.selected_players_list.push(this.filter_playerId_select3);
    if (this.filter_playerId_select4 != "")
      this.selected_players_list.push(this.filter_playerId_select4);
    if (this.filter_playerId_select5 != "")
      this.selected_players_list.push(this.filter_playerId_select5);

    if (this.active_player1 && this.filter_playerId_select1 != "") {
      this.filter_selected_players1 = "on";
    }
    if (this.active_player2 && this.filter_playerId_select2 != "") {
      this.filter_selected_players2 = "on";
    }
    if (this.active_player3 && this.filter_playerId_select3 != "") {
      this.filter_selected_players3 = "on";
    }
    if (this.active_player4 && this.filter_playerId_select4 != "") {
      this.filter_selected_players4 = "on";
    }
    if (this.active_player5 && this.filter_playerId_select5 != "") {
      this.filter_selected_players5 = "on";
    }

    /*   console.log('filter_selected_players1');
    console.log(this.filter_selected_players1);

    console.log('filter_selected_players2');
    console.log(this.filter_selected_players2);

    console.log('filter_selected_players3');
    console.log(this.filter_selected_players3);

    console.log('filter_selected_players4');
    console.log(this.filter_selected_players4);

    console.log('filter_selected_players5');
    console.log(this.filter_selected_players5);

    console.log('selected_players_list');
    console.log(this.selected_players_list); */

    this.formationsAnalysisService
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
          this.data = [];
          this.data.push(loaded_data);
          console.log("data1", this.data);
        },
        (err) => {
          alert(
            "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
        }
      );

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
        this.table_settings
      )
      .subscribe(
        (loaded_data) => {
          //console.log(JSON.stringify(loaded_data));

          this.spoluhraci_data = [];
          loaded_data.forEach((item, index) => {
            this.spoluhraci_data.push(item["stats"]);
            this.spoluhraci_data[index]["uuid"] = item["player"];
          });

          if (this.filter_posts == "FO") {
            let newData = [];
            this.spoluhraci_data.forEach((item, index) => {
              if (this.getPlayerPost(item.uuid) == "FO") {
                newData.push(item);
              }
            });
            this.spoluhraci_data = newData;
          }

          if (this.filter_posts == "DE") {
            let newData = [];
            this.spoluhraci_data.forEach((item, index) => {
              if (this.getPlayerPost(item.uuid) == "DE") {
                newData.push(item);
              }
            });
            this.spoluhraci_data = newData;
          }

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
              this.table_settings,
              undefined
            )
            .subscribe(
              (loaded_data) => {
                //console.log("jaj" + JSON.stringify(loaded_data));
                this.protihraci_data = [];
                loaded_data.forEach((item, index) => {
                  this.protihraci_data.push(item["stats"]);
                  this.protihraci_data[index]["uuid"] = item["player"];
                  //this.protihraci_data[index]['team'] = "LOL";
                });

                if (this.filter_posts == "FO") {
                  let newData = [];
                  this.protihraci_data.forEach((item, index) => {
                    if (this.getPlayerPost(item.uuid) == "FO") {
                      newData.push(item);
                    }
                  });
                  this.protihraci_data = newData;
                }

                if (this.filter_posts == "DE") {
                  let newData = [];
                  this.protihraci_data.forEach((item, index) => {
                    if (this.getPlayerPost(item.uuid) == "DE") {
                      newData.push(item);
                    }
                  });
                  this.protihraci_data = newData;
                }

                if (this.protihraci_data != "" && this.spoluhraci_data != "") {
                  this.no_data = false;
                }
                this.loading = false;

                //this.gamesService.getGamesListByTeam(this.filter_seasonPart, this.filter_team, this.filter_dateFrom, this.filter_dateTo, this.filter_lastGames, this.filter_situationType, this.filter_situationTime, this.showDots).subscribe(loaded_data => {

                /* this.gamesService.getGamesList(this.filter_seasonPart, this.filter_team, "", this.filter_dateFrom, this.filter_dateTo, this.filter_lastGames, this.filter_situationType, this.filter_situationTime).subscribe(loaded_data => {


              //alert(JSON.stringify(loaded_data));

              let games_list = [];
              loaded_data.forEach((item, index) => {
                  games_list.push({ id: index, match: item['uuid'], homeTeam: item['homeTeamUuid'], awayTeam: item['awayTeamUuid'], score: item["score"], matchDate: item['date'], active: true });
              });

              this.gameslist = games_list;
              this.showTab(tab_old);


          }); */
              },
              (err) => {
                alert(
                  "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
                );
                //this.defaultService.logout();
              }
            );
        },
        (err) => {
          alert(
            "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
          //this.defaultService.logout();
        }
      );
  }

  loadGamelog() {
    this.tab = "gamelog";
    this.prew_tab = this.tab;
    this.data = [];

    this.loading = true;
    this.dataLoaded = true;

    console.log("filter_playerId_select1");
    console.log(this.filter_playerId_select1);
    console.log("filter_playerId_select2");
    console.log(this.filter_playerId_select2);
    console.log("filter_playerId_select3");
    console.log(this.filter_playerId_select3);
    console.log("filter_playerId_select4");
    console.log(this.filter_playerId_select4);
    console.log("filter_playerId_select5");
    console.log(this.filter_playerId_select5);

    console.log("filter_selected_players1");
    console.log(this.filter_selected_players1);
    console.log("filter_selected_players2");
    console.log(this.filter_selected_players2);
    console.log("filter_selected_players3");
    console.log(this.filter_selected_players3);
    console.log("filter_selected_players4");
    console.log(this.filter_selected_players4);
    console.log("filter_selected_players5");
    console.log(this.filter_selected_players5);

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
          this.data = loaded_data;

          /* if (this.filter_playerId_select1 == "" && this.filter_playerId_select2 == "" && this.filter_playerId_select3 == "" && this.filter_playerId_select4 == "" && this.filter_playerId_select5 == "" && this.filter_playerId_select6 == "") {
          this.canvas_type = "teams";
        } */

          this.data.forEach((item, index) => {
            this.data[index]["uuid"] = item["uuid"];

            this.data[index]["homeTeamUuid"] = item["info"]["homeTeamUuid"];
            this.data[index]["awayTeamUuid"] = item["info"]["awayTeamUuid"];
            this.data[index]["date"] = item["info"]["date"];
            this.data[index]["home_score"] = item["info"]["score"]["home"];
            this.data[index]["away_score"] = item["info"]["score"]["away"];
            this.data[index]["state_score"] = item["info"]["score"]["state"];

            this.table_settings.forEach((item2, index2) => {
              this.data[index][item2["type"]] = item["stats"][item2["type"]];
            });

            this.data[index]["toi"] = item["stats"]["toi"];
          });
          console.log("data");
          console.log(this.data);
          //console.log(JSON.stringify(this.data));

          this.loading = false;
          if (this.data != "") {
            this.no_data = false;
          }

          this.filter_playerId_select1 = "";
          this.filter_playerId_select2 = "";
          this.filter_playerId_select3 = "";
          this.filter_playerId_select4 = "";
          this.filter_playerId_select5 = "";
        },
        (err) => {
          alert(
            "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
          );
          //this.defaultService.logout();
        }
      );
  }

  openTrend(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string
  ) {
    this.trend_type = "team";
    this.gamelog_select = [];

    if (this.tab != "combos") {
      if (this.filter_selectFormationKind != "5:5") {
        this.filter_countOfPlayer = this.filter_selectFormationKind;
      }
      if (
        filter_playerId_select1 != undefined &&
        filter_playerId_select1 != ""
      ) {
        this.filter_playerId_select1 = filter_playerId_select1;
        this.gamelog_select.push(filter_playerId_select1);
        this.filter_selected_players1 = "on";
        this.trend_type = "formation";
      } else {
        this.filter_selected_players1 = "off";
      }
      if (
        filter_playerId_select2 != undefined &&
        filter_playerId_select2 != ""
      ) {
        this.filter_playerId_select2 = filter_playerId_select2;
        this.gamelog_select.push(filter_playerId_select2);
        this.filter_selected_players2 = "on";
        this.trend_type = "formation";
      } else {
        this.filter_selected_players2 = "off";
      }
      if (
        filter_playerId_select3 != undefined &&
        filter_playerId_select3 != ""
      ) {
        this.filter_playerId_select3 = filter_playerId_select3;
        this.gamelog_select.push(filter_playerId_select3);
        this.filter_selected_players3 = "on";
        this.trend_type = "formation";
      } else {
        this.filter_selected_players3 = "off";
      }
      if (
        filter_playerId_select4 != undefined &&
        filter_playerId_select4 != ""
      ) {
        this.filter_playerId_select4 = filter_playerId_select4;
        this.gamelog_select.push(filter_playerId_select4);
        this.filter_selected_players4 = "on";
        this.trend_type = "formation";
      } else {
        this.filter_selected_players4 = "off";
      }
      if (
        filter_playerId_select5 != undefined &&
        filter_playerId_select5 != ""
      ) {
        this.filter_playerId_select5 = filter_playerId_select5;
        this.gamelog_select.push(filter_playerId_select5);
        this.filter_selected_players5 = "on";
        this.trend_type = "formation";
      } else {
        this.filter_selected_players5 = "off";
      }
    } else {
      if (
        this.filter_playerId_select1 != "" &&
        this.filter_playerId_select1 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select1);
      }
      if (
        this.filter_playerId_select2 != "" &&
        this.filter_playerId_select2 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select2);
      }
      if (
        this.filter_playerId_select3 != "" &&
        this.filter_playerId_select3 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select3);
      }
      if (
        this.filter_playerId_select4 != "" &&
        this.filter_playerId_select4 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select4);
      }
      if (
        this.filter_playerId_select5 != "" &&
        this.filter_playerId_select5 != undefined
      ) {
        this.gamelog_select.push(this.filter_playerId_select5);
      }
    }

    this.loadTrend();
  }

  loadTrend() {
    console.log("trend_type", this.trend_type);

    this.checkLoggedTime();

    this.loading = true;
    this.no_data = true;

    this.tab = "trend";
    this.prew_tab = this.tab;

    /* console.log('filter_playerId_select1');
    console.log(this.filter_playerId_select1)
    console.log('filter_playerId_select2');
    console.log(this.filter_playerId_select2)
    console.log('filter_playerId_select3');
    console.log(this.filter_playerId_select3)
    console.log('filter_playerId_select4');
    console.log(this.filter_playerId_select4)
    console.log('filter_playerId_select5');
    console.log(this.filter_playerId_select5)

    console.log('filter_selected_players1')
    console.log(this.filter_selected_players1)
    console.log('filter_selected_players2')
    console.log(this.filter_selected_players2)
    console.log('filter_selected_players3')
    console.log(this.filter_selected_players3)
    console.log('filter_selected_players4')
    console.log(this.filter_selected_players4)
    console.log('filter_selected_players5')
    console.log(this.filter_selected_players5) */

    if (this.trend_type == "team") {
      this.trendService
        .getTrendTeam(
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
            this.data_graph = loaded_data;
            console.log("data_graph - team");
            console.log(this.data_graph);
            this.renderGraph();

            if (loaded_data != []) this.no_data = false;
            this.loading = false;
          },
          (err) => {}
        );
    } else if (this.trend_type == "formation") {
      this.trendService
        .getTrendFormation(
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
            this.data_graph = loaded_data;
            //console.log(JSON.stringify(loaded_data));
            console.log("data_graph - formation");
            console.log(this.data_graph);
            this.renderGraph();
            if (loaded_data != []) this.no_data = false;
            this.loading = false;
          },
          (err) => {}
        );
    }

    this.filter_playerId_select1 = "";
    this.filter_playerId_select2 = "";
    this.filter_playerId_select3 = "";
    this.filter_playerId_select4 = "";
    this.filter_playerId_select5 = "";
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

    let a = data_raw.reduce((acc, val) => (acc > val ? acc : val));
    let y_data_max = Math.ceil(a);

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
  }

  filterVyberDatDle(data_dle) {
    this.filter_vyber_dat_dle = data_dle;
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

  /* dateFromChange(date: string) {
    var date_string = new Date(date);
    var dayIndex = date_string.getDate();
    var monthIndex = date_string.getMonth() + 1;
    var year = date_string.getFullYear()
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
 */

  /* dateToChange(date: string) {
    var date_string = new Date(date);
    var dayIndex = date_string.getDate();
    var monthIndex = date_string.getMonth() + 1;
    var year = date_string.getFullYear()
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
  } */

  //filters -start
  getCompetitions(): void {
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
    for (let item in attributes["players"][0]["individual"][0]) {
      attributes["players"][0]["individual"][0][item][0]["types"].forEach(
        (type2) => {
          type2["attributes"].forEach((attribute) => {
            if (attribute["type"] == type) {
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
              name = attribute["name"];
            }
          });
        }
      );
    }

    return name;
  }

  loadTrendDataLine() {
    /* kotva */
    this.trend_table_loading = true;
    let periodBy = "";
    if (this.filter_vyber_dat_dle == false) {
      periodBy = "calendar";
    } else {
      periodBy = "matches";
    }
    /* this.data_table = []; */

    let period_date_from;
    let period_date_to;
    let period_match_from = this.period_match_from;
    let period_match_to = this.period_match_to;
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
          console.log("loaded_data");
          console.log(loaded_data);
          /* loaded_data.forEach(stat_row => {
          //console.log(this.filter_playerId_select1);
          //console.log(JSON.stringify(stat_row));
          if (stat_row["player"] == this.filter_playerId_select1) {
            let data_edited = stat_row["stats"];
            data_edited["id"] = index;
            this.data_table.push(data_edited);
          }
        }); */
          /* console.log('data_table');
        console.log(this.data_table); */

          /* let data_empty = {};
        if (this.data_table.length == 0) {
          this.table_settings.forEach((item) => {
            data_empty[item["type"]] = 0;
            data_empty['toi'] = 0;
          });
          this.data_table.push(data_empty);
        } */

          this.loading = false;
          this.dataLoaded = true;
          this.trend_table_loading = false;
        },
        (err) => {}
      );
  }

  getSeasonParts(): void {
    this.filter_seasonPart = "";
    this.filter_team = "";
    this.filter_player = "";
    this.teams_list = [];
    this.players_list = [];

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

  getTeamsData(): void {
    this.filter_team = "";
    this.teams_list = [];
    this.players_list = [];
    this.filter_player = "";

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
  }

  /* pridane */
  getTeamName(uuid: string): any {
    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        shortcut = item["shortcut"];
      }
    });

    return shortcut;
  }

  /* Pridane */
  getTeamName2(uuid: string): any {
    let shortcut = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        shortcut = item["name"];
      }
    });

    return shortcut;
  }

  /* Pridane */
  loadDataShoda(): void {}

  getPlayerList(): void {
    this.players_list = [];
    this.filter_player = "";

    let uuids = this.filter_seasonPart.split(",");

    uuids.forEach((item, index) => {
      var competition_details = JSON.parse(
        localStorage.getItem("competition_details")
      );

      competition_details.forEach((loaded_data, index) => {
        if (typeof loaded_data[item] != "undefined") {
          loaded_data[item]["teams"].forEach((team, index) => {
            if (team["uuid"] == this.filter_team) {
              team["players"].forEach((player, index) => {
                var index: any = this.players_list.findIndex(
                  (x) => x.uuid == player["uuid"]
                );
                if (index === -1) {
                  player["short_name"] =
                    player["surname"] + " " + player["name"][0] + ".";
                  this.players_list.push(player);
                } else {
                  //console.log("object already exists")
                }
              });
            }
          });
        }
      });
    });

    this.players_list.sort(this.sortBy("surname", false));

    if (this.filter_team == this.filter_opponent) {
      this.filter_opponent = "";
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
    /* console.log("filter_team",this.filter_team);
    console.log("team_list",this.teams_list);
    console.log("team_list_filtered",this.team_list_filter);
    console.log("selected_teams", this.selected_teams) */
  }

  sortBy(key, reverse): any {
    var moveSmaller = reverse ? 1 : -1;
    var moveLarger = reverse ? -1 : 1;

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

  playerChanged(newVal): void {
    this.filter_player = newVal["uuid"];
  }

  playerChangedDetectDeleted(value): void {
    //alert(value);
    if (value == undefined || value == "") {
      this.filter_player = "";
    }
  }

  playerListFormatter = (data: any) => {
    let pos_name = "";
    if (data.position == "DE") {
      pos_name = "O";
    } else if (data.position == "FO") {
      pos_name = "Ú";
    }
    let html =
      "<span class='players-list-post players-list-post-" +
      data.position +
      "'>" +
      pos_name +
      "</span>" +
      data.surname +
      " " +
      data.name[0] +
      ".";
    return html;
  };

  changedOrder(event) {
    this.filterby = event;
  }
  //filters end

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

    let filter_selectFormationKind = this.filter_selectFormationKind;

    return (
      "formations-overview/" +
      filter_season +
      "/" +
      filter_seasonPart +
      "/" +
      filter_team +
      "/" +
      filter_selectFormationKind +
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

  toggleTableAttributes(select: string): any {
    this.table_settings.forEach((item, index) => {
      if (item["type"] == select) {
        if (item["enabled"] == false) {
          this.table_settings[index]["enabled"] = true;
        } else {
          this.table_settings[index]["enabled"] = false;
        }
      }
    });
  }

  getTableToggleAttributes(attribute: string): string {
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

  toggleTableSettings(): void {
    this.tab = this.prew_tab;
    if (this.toggle_table_settings == true) {
      this.toggle_table_settings = false;
    } else {
      this.toggle_table_settings = true;
    }
  }

  getPlayerPost(uuid: string): string {
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

  getPlayerName(uuid: string): string {
    if (localStorage.getItem(uuid) === null) {
      return "" + uuid;
    } else {
      let surname = JSON.parse(localStorage.getItem(uuid))["surname"];
      let name = JSON.parse(localStorage.getItem(uuid))["name"];

      if (surname == "Klima") {
        let name2 = "";
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

  public itemsToString(value: Array<any> = []): string {
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

  uniqEs6 = (arrArg) => {
    return arrArg.filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos;
    });
  };

  writePlayers(players: any[]): string {
    let html = "";

    let selectedPlayer = this.filter_player_loaded;

    let utocnici_selected = "";
    let utocnici_nonselected = "";
    let utocnici_data = "";
    //get utocnici
    players.forEach((item, index) => {
      if (this.getPlayerPost(item) == "FO") {
        if (item == selectedPlayer) {
          utocnici_selected =
            utocnici_selected +
            "<div class='sticker sticker__blue'>" +
            this.getPlayerName(item) +
            "</div>";
        } else {
          utocnici_nonselected =
            utocnici_nonselected +
            "<div class='sticker sticker__grey'>" +
            this.getPlayerName(item) +
            "</div>";
        }
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
      if (this.getPlayerPost(item) == "DE") {
        if (item == selectedPlayer) {
          obranci_selected =
            obranci_selected +
            "<div class='sticker sticker__blue'>" +
            this.getPlayerName(item) +
            "</div>";
        } else {
          obranci_nonselected =
            obranci_nonselected +
            "<div class='sticker sticker__grey'>" +
            this.getPlayerName(item) +
            "</div>";
        }
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

  formationAnalysisLink(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string
  ): string {
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

    let attributes_list = [];
    this.table_settings.forEach((item) => {
      if (item["type"] != null) {
        attributes_list.push(item["type"]);
      }
    });

    let attributes_list_string = attributes_list.toString();

    let filter_selectFormationKind = this.filter_selectFormationKind;

    return (
      "formations-analysis/" +
      filter_season +
      "/" +
      filter_seasonPart +
      "/" +
      filter_team +
      "/" +
      filter_selectFormationKind +
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
  ): string {
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

  /* trendlogLink(filter_playerId_select1: string, filter_playerId_select2: string, filter_playerId_select3: string, filter_playerId_select4: string, filter_playerId_select5: string, filter_playerId_select6: string):string {

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
    if (filter_homeAway == "") { filter_homeAway = undefined; }

    //FILTER filter_matchState
    let filter_matchState = this.filter_matchState;
    if (filter_matchState == "") { filter_matchState = undefined; }

    //FILTER filter_minutes_from
    let filter_minutes_from = this.filter_minutes_from;

    //FILTER filter_minutes_from
    let filter_minutes_to = this.filter_minutes_to;

    //FILTER filter_opponent
    let filter_opponents = this.filter_opponents.toString();
    if (filter_opponents.length == 0) { filter_opponents = undefined; }

    //FILTER filter_situationType
    let filter_situationType = this.filter_situationType;
    if (filter_situationType == "") { filter_situationType = undefined; }

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

    return "trend/formation/" + filter_season + "/" + filter_seasonPart + "/" + filter_team + "/" + filter_countOfPlayer + "/" + filter_minTOI + "/" + filter_lastGames + "/" + filter_dateFrom + "/" + filter_dateTo + "/" + filter_homeAway + "/" + filter_matchState + "/" + filter_minutes_from + "/" + filter_minutes_to + "/" + filter_opponents + "/" + filter_playerId_select1 + "/" + filter_playerId_select2 + "/" + filter_playerId_select3 + "/" + filter_playerId_select4 + "/" + filter_playerId_select5 + "/" + filter_playerId_select6 + "/" + filter_situationType + "/" + filter_situationTime + "/" + attributes_list_string;
  } */

  active_skala(): void {
    this.average_compare = "team";
    if (this.show_skala == true) {
      this.show_skala = false;
    } else {
      if (this.average_compare != "") {
        this.show_skala = true;
        this.loadSkala();
      }
    }
  }

  getMinMax(cmp, arr, attr) {
    var val = arr[0][attr];
    for (var i = 1; i < arr.length; i++) {
      val = cmp(val, arr[i][attr]);
    }
    return val;
  }

  checkFormationPlayers(formation1, formation2) {
    let equal = 0;
    formation1.forEach((element) => {
      formation2.forEach((element2) => {
        if (element == element2) {
          equal = equal + 1;
        }
      });
    });

    return equal == formation1.length;
  }

  getSkalaColour(uuid: any, attribute: string, mPlayer: boolean, line: number) {
    var data = [];
    var cell_value = "";

    //console.log("Test 1", this.data_relativeToTeam)

    if (this.tab == "pairs") {
      if (mPlayer) {
        data = this.data_relativeToTeam.wowy.selected_player[0];
      } else {
        line = line - 1;
        this.data_relativeToTeam.wowy.stats.forEach((element) => {
          if (element.uuid == uuid) {
            data = element.stats[line];
          }
        });
      }
    } else if (this.tab == "lines") {
      if (mPlayer) {
        data = this.data_relativeToTeam.wowy[0];
      } else {
        uuid.forEach((element) => {
          this.data_relativeToTeam.forEach((element2, index) => {
            if (this.checkFormationPlayers(uuid, element2.players)) {
              data = element2.stats;
            }
          });
        });
      }
    }

    if (true) {
      let value = data[attribute];
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

    if (this.show_skala) {
      /* data.forEach((item) => {
        if (JSON.stringify(item['players']) == JSON.stringify(uuid)) {
          let value = item['stats'][attribute];
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
      }); */
      return cell_value;
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

  loadSkala() {
    this.data_relativeToTeam = [];
    this.skala_loading = true;

    if (this.tab == "lines") {
      if (this.filter_player == "") {
        this.formationsOverviewService
          .getDataWithoutPlayerRelativeTo(
            this.filter_seasonPart,
            this.filter_player,
            this.filter_team,
            this.filter_lastGames,
            this.filter_selectFormationKind,
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
            "competition",
            this.table_settings
          )
          .subscribe(
            (loaded_data) => {
              this.data_relativeToTeam = loaded_data;
              console.log("loaded data percentile:", loaded_data);
              this.skala_loading = false;
              console.log("data_relativeToTeam", this.data_relativeToTeam);
            },
            (err) => {
              alert(
                "Při načítání dat došlo k chybě: Ff_lpT. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
              );
              //this.defaultService.logout();
              //window.location.reload();
            }
          );
      } else if (this.filter_player != "") {
        this.formationsOverviewService
          .getDataWithPlayerRelativeTo(
            this.filter_seasonPart,
            this.filter_player,
            this.filter_team,
            this.filter_lastGames,
            this.filter_selectFormationKind,
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
            "competition",
            this.table_settings
          )
          .subscribe(
            (loaded_data) => {
              this.data_relativeToTeam = loaded_data;
              console.log("data_relativeToTeam", this.data_relativeToTeam);

              this.wowyService
                .getWowyPercentil(
                  this.filter_seasonPart,
                  this.filter_player,
                  this.filter_team,
                  this.filter_lastGames,
                  this.filter_selectFormationKind,
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
                    console.log("Data percentil", loaded_data);
                    this.data_relativeToTeam["wowy"] =
                      loaded_data.wowy.selected_player;
                    console.log(
                      "data Rel to team New:",
                      this.data_relativeToTeam
                    );
                    this.skala_loading = false;
                  },
                  (err) => {
                    alert(
                      "Při načítání dat došlo k chybě 'Ff_lpP'. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
                    );
                    //this.defaultService.logout();
                    //window.location.reload();
                  }
                );
            },
            (err) => {
              alert(
                "Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
              );
              //this.defaultService.logout();
              //window.location.reload();
            }
          );
      }
      console.log("Data reloarive to Team", this.data_relativeToTeam);
    } else if (this.tab == "pairs") {
      this.wowyService
        .getWowyPercentil(
          this.filter_seasonPart,
          this.filter_player,
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
            this.data_relativeToTeam = loaded_data;
            console.log("Data percentil", this.data_relativeToTeam);
            this.skala_loading = false;
          },
          (err) => {
            alert(
              "Při načítání dat došlo k chybě 'Fd_lp'. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
            );
            //this.defaultService.logout();
            //window.location.reload();
          }
        );
    }
  }

  onChangedAttributes(new_attributes: any) {
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings = clean_attributes;
    this.loadNewData(false);
  }

  getAttributeColour(colour: string) {
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
      attributes["players"][0]["individual"][0][item][0]["types"].forEach(
        (type2) => {
          type2["attributes"].forEach((attribute) => {
            if (attribute["type"] == type) {
              title = attribute["eng"];
              desc = attribute["desc"];
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
            }
          });
        }
      );
    }

    if (show_what == 1) {
      return title;
    } else if (show_what == 2) {
      return desc;
    } else {
      return "";
    }
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

  downloadCSVGamelog() {
    let data = [];
    let th = ["Zapas", "TOI"];

    let th_types = ["zapas", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data.push(th);

    let row = [];

    this.data.forEach((item, index) => {
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

  downloadCSVProtihraci() {
    console.log("CVS Protihraci");
    let data = [];
    let th = ["Tym", "Pozice", "Jmeno hrace", "GP", "TOI"];
    let th_types = ["team", "post", "uuid", "gp", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data.push(th);

    let row = [];

    this.protihraci_data.forEach((item, index) => {
      if (this.selected_teams == "") {
        row.push(item);
      } else {
        if (
          this.getTeamNameShortcut(this.getPlayerTeam(item["uuid"])) ==
          this.getTeamNameShortcut(this.selected_teams)
        ) {
          row.push(item);
        }
      }
    });

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
          selected_data.push(this.getPlayerPost(item.uuid));
        } else if (item2 == "team") {
          selected_data.push(this.getPlayerTeamShort(item.uuid));
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      if (this.filter_posts == "ALL") {
        data.push(selected_data);
      } else if (this.filter_posts == "DE") {
        if (this.getPlayerPost(item["uuid"]) == "DE") {
          data.push(selected_data);
        }
      } else if (this.filter_posts == "FO") {
        if (this.getPlayerPost(item["uuid"]) == "FO") {
          data.push(selected_data);
        }
      }
    });

    data = JSON.parse(JSON.stringify(data));

    let final_data = JSON.parse(JSON.stringify(data));

    //new Angular5Csv(final_data, 'formations-analysis');
    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
  }

  downloadCSVSpoluhraci() {
    console.log("CVS Spoluhraci");
    let data = [];
    let th = ["Tym", "Pozice", "Jmeno hrace", "GP", "TOI"];
    let th_types = ["team", "post", "uuid", "gp", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data.push(th);

    let row = [];
    this.spoluhraci_data.forEach((item, index) => {
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
          selected_data.push(this.getPlayerPost(item.uuid));
        } else if (item2 == "team") {
          selected_data.push(this.getPlayerTeamShort(item.uuid));
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      if (this.filter_posts == "ALL") {
        data.push(selected_data);
      } else if (this.filter_posts == "DE") {
        if (this.getPlayerPost(item["uuid"]) == "DE") {
          data.push(selected_data);
        }
      } else if (this.filter_posts == "FO") {
        if (this.getPlayerPost(item["uuid"]) == "FO") {
          data.push(selected_data);
        }
      }
    });

    data = JSON.parse(JSON.stringify(data));

    let final_data = JSON.parse(JSON.stringify(data));

    //new Angular5Csv(final_data, 'formations-analysis', csv_options);
    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
  }

  downloadCSVFormace() {
    var data_full = this.data_csv;

    var row = [];

    var players_list = [];
    var players_row = [];

    var final_data = [];

    let th = ["Hraci", "GP", "TOI"];

    let th_types = ["players", "gp", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data_full.forEach((item, index) => {
      row.push(item["stats"]);
    });

    var data_clean = [];

    let data_row = [];

    row.forEach((item2, index2) => {
      let selected_data = [];
      th_types.forEach((item3, index3) => {
        if (item3 == "toi") {
          selected_data.push(this.formatSecondsDecimal(item2["toi"]));
        } else if (item3 == "oztoi") {
          selected_data.push(this.formatSecondsDecimal(item2["oztoi"]));
        } else if (item3 == "ozposstoi") {
          selected_data.push(this.formatSecondsDecimal(item2["ozposstoi"]));
        } else if (item3 == "posstoi") {
          selected_data.push(this.formatSecondsDecimal(item2["posstoi"]));
        } else if (item3 == "dztoi") {
          selected_data.push(this.formatSecondsDecimal(item2["dztoi"]));
        } else if (item3 == "dzposstoi") {
          selected_data.push(this.formatSecondsDecimal(item2["dzposstoi"]));
        } else if (item3 == "oppdzptoi") {
          selected_data.push(this.formatSecondsDecimal(item2["oppdzptoi"]));
        } else if (item3 == "players") {
          players_row = [];
          item2[item3].forEach((item2) => {
            players_row.push(accents.remove(this.getPlayerName(item2)));
          });

          selected_data.push(players_row.join(", "));
        } else {
          selected_data.push(item2[item3]);
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

    let json = JSON.stringify(with_header);
    let withStrings = JSON.parse(json, (key, val) =>
      typeof val !== "object" && val !== null ? String(val) : val
    );

    //new Angular5Csv(withStrings, 'formations-overview', csv_options);
    this.defaultService.downloadXLS(withStrings).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
  }

  downloadCSVWowy() {
    let data = [];
    let th = ["Hraci", "GP", "TOI"];

    let th_types = ["gp", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    //alert(JSON.stringify(th_types));

    let row = [];
    let data_final = [];

    this.data.forEach((item, index) => {
      row.push(item);
    });

    row.forEach((item, index) => {
      let data_row = [];

      item["stats"].forEach((item2, index2) => {
        if (index2 == 0) {
          data_row = [
            accents.remove(
              this.getPlayerName(this.selected_player[0]["uuid"])
            ) +
              " s " +
              accents.remove(this.getPlayerName(item["uuid"])),
          ];
        } else if (index2 == 1) {
          data_row = [
            accents.remove(
              this.getPlayerName(this.selected_player[0]["uuid"])
            ) +
              " bez " +
              accents.remove(this.getPlayerName(item["uuid"])),
          ];
        } else if (index2 == 2) {
          data_row = [
            accents.remove(this.getPlayerName(item["uuid"])) +
              " bez " +
              accents.remove(
                this.getPlayerName(this.selected_player[0]["uuid"])
              ),
          ];
        }
        //alert(JSON.stringify(item2));

        //data_row.push(item2);

        let selected_data = [];
        th_types.forEach((item3, index3) => {
          if (item3 == "toi") {
            selected_data.push(this.formatSecondsDecimal(item2[item3]));
          } else if (item2 == "oztoi") {
            selected_data.push(this.formatSecondsDecimal(item2[item3]));
          } else if (item2 == "dzposstoi") {
            selected_data.push(this.formatSecondsDecimal(item2[item3]));
          } else if (item2 == "oppdzptoi") {
            selected_data.push(this.formatSecondsDecimal(item2[item3]));
          } else if (item2 == "dztoi") {
            selected_data.push(this.formatSecondsDecimal(item2[item3]));
          } else if (item2 == "ozposstoi") {
            selected_data.push(this.formatSecondsDecimal(item2[item3]));
          } else if (item2 == "posstoi") {
            selected_data.push(this.formatSecondsDecimal(item2[item3]));
          } else {
            selected_data.push(String(item2[item3]));
          }
          /* console.log(selected_data); */
        });

        selected_data.forEach((element) => {
          data_row.push(element);
        });

        data_final.push(data_row);
      });
    });

    let with_header = [];
    with_header.push(th);

    data_final.forEach((item, index2) => {
      with_header.push(item);
    });

    //console.log(JSON.stringify(with_header));

    //new Angular5Csv(with_header, 'wowy', csv_options);
    this.defaultService.downloadXLS(with_header).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
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

  formatSecondsDecimal(seconds: number) {
    return seconds / 60;
  }

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  setDefaultOrderRow() {
    this.list_order = 0;
  }
  addOrderRow() {
    this.list_order = this.list_order + 1;
  }

  getPlayerTeamShort(uuid: string) {
    if (uuid != null || uuid != undefined) {
      if (localStorage.getItem(uuid) != undefined) {
        uuid = JSON.parse(localStorage.getItem(uuid))["team"];
        /* console.log(JSON.stringify(this.teams_list)); */
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
        /* console.log('team');
        console.log(team) */
        return team;
      } else {
        return "";
      }
    } else {
      return "";
    }
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

  /* pridane */
  getTeamLogo(uuid: string) {
    //console.log("getTeamLogo")
    let shortcut = "";
    //console.log('logo uuid');
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        shortcut = item["shortcut"];
      }
    });
    //console.log("shortcut",shortcut)
    return this.getPlayerTeamLogo2(shortcut);
  }

  getBackgroundImage(uuid: string) {
    //console.log("uuid",uuid)
    //const img = this.getTeamLogo(uuid)
    //return {'background': 'url(' + img + ') no-repeat','background-position': 'right 1px center','background-size': '30px 30px'}

    return this.getTeamLogo(uuid);
  }

  /* pridane */
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

  getPlayerTeamLogo2(team_shortcut: string) {
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

  getTeamNameShort(uuid: string) {
    let team_name = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        team_name = item["name"];
      }
    });

    return team_name;
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

  getTeamNameShortcut(uuid: string) {
    let team_name = "";
    this.teams_list.forEach((item, index) => {
      if (item["uuid"] == uuid) {
        team_name = item["shortcut"];
      }
    });

    return team_name;
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
        this.filter_playerId_select1 = params["filter_playerId_select1"];
        //
        parameters_exists_reload_data = true;
        this.active_player1 = true;
      }

      if (
        params["filter_playerId_select2"] != undefined &&
        params["filter_playerId_select2"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_playerId_select2 = params["filter_playerId_select2"];

        //
        parameters_exists_reload_data = true;
        this.active_player2 = true;
      }

      if (
        params["filter_playerId_select3"] != undefined &&
        params["filter_playerId_select3"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_playerId_select3 = params["filter_playerId_select3"];

        //
        parameters_exists_reload_data = true;
        this.active_player3 = true;
      }

      if (
        params["filter_playerId_select4"] != undefined &&
        params["filter_playerId_select4"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_playerId_select4 = params["filter_playerId_select4"];

        //
        parameters_exists_reload_data = true;
        this.active_player4 = true;
      }

      if (
        params["filter_playerId_select5"] != undefined &&
        params["filter_playerId_select5"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_playerId_select5 = params["filter_playerId_select5"];

        //
        parameters_exists_reload_data = true;
        this.active_player5 = true;
      }

      if (
        params["filter_playerId_select6"] != undefined &&
        params["filter_playerId_select6"] != "undefined"
      ) {
        //this.more_filters = true;
        this.filter_playerId_select6 = params["filter_playerId_select6"];

        //
        parameters_exists_reload_data = true;
        this.active_player6 = true;
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
        //this.more_filters = true;
        this.selected_attributes_string = params["selected_attributes"];
        //alert(JSON.stringify(this.table_settings) + "   " + this.selected_attributes_string);

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

        //
        parameters_exists_reload_data = true;
      }

      if (parameters_exists_reload_data == true) {
        /* this.loadData(this.tab_small_viz); */
        if (params.page == "kombinace") {
          this.loadKombinace();
        } else if (params.page == "gamelog") {
          this.openGamelog(
            this.filter_playerId_select1,
            this.filter_playerId_select2,
            this.filter_playerId_select3,
            this.filter_playerId_select4,
            this.filter_playerId_select5
          );
        } else if (params.page == "trend") {
          this.openTrend(
            this.filter_playerId_select1,
            this.filter_playerId_select2,
            this.filter_playerId_select3,
            this.filter_playerId_select4,
            this.filter_playerId_select5
          );
        }
      }
    });
  }

  changedOrder2(event) {
    this.shoda_sortby = event;
    this.filterby2 = event;
    console.log("Sort 1");
  }

  shodaSort(event) {
    this.shodaSort_value = event;
    console.log("Sort 2");
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
        "Byla otevřena obrazovka formace.",
        3
      )
      .subscribe((loaded_data) => {});
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
