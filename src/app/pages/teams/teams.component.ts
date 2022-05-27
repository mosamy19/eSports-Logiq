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
import { ChartOptions } from "chart.js";
import { FormationsAnalysisService } from "../../services/formations-analysis/formations-analysis.service";
import { DefaultService } from "../../services/default/default.service";
import { FormatParametersService } from "../../services/format-parameters/format-parameters.service";
import { createTrue } from "typescript";
import { GamelogService } from "../../services/gamelog/gamelog.service";
import { TrendService } from "../../services/trend/trend.service";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import { Color, Label } from "ng2-charts";
declare var require: any;
var accents = require("remove-accents");

var csv_options = {
  quoteStrings: '"',
  fieldSeparator: ";",
  decimalseparator: ".",
  type: "text/csv;charset=ISO-8859-1;",
};

import { TranslatePipe } from "../../pipes/translate.pipe";
import { load } from "@angular/core/src/render3";
import { NavComponent } from "../../components/nav/nav.component";

@Component({
  selector: "teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.scss"],
  providers: [
    FormationsAnalysisService,
    DefaultService,
    TranslatePipe,
    GamelogService,
    TrendService,
  ],
})
export class TeamsComponent implements OnInit {
  @ViewChild("lol") private lol: ElementRef;
  @ViewChild("chart") private chart: ElementRef;
  @ViewChild("help") private help: NavComponent;
  @ViewChild("scroll") private scrollContainer: ElementRef;

  public lineChartLabels: Label[] = [];
  public lineChartData: Array<any> = [];
  public lineChartColors: Color[] = [];
  public lineChartOptions: ChartOptions = {};

  showTrend: boolean = false;
  show_canvas_tooltip: boolean = false;
  canvas_tooltip_left: number = 0;
  canvas_tooltip_top: number = 0;
  tooltip_value: string = "";
  tooltip_date: string = "";
  tooltip_match: string = "";
  filter_vyber_dat_dle: boolean = true;

  selected_daterange: any;

  canscrollprev: boolean = false;
  canscrollnext: boolean = true;
  games_scroll: number = 0;

  trend_limits: any[] = [
    { date_from: "", date_to: "", match_from: null, match_to: null },
  ];
  trend_date_from: any = new Array(66).fill("");
  trend_date_to: any = new Array(66).fill("");
  trend_match_from: any = new Array(57).fill(null);
  trend_match_to: any = new Array(57).fill(null);

  filter_graph_attribute: string = "cf60";
  //filters
  filter_season: any = [];
  filter_seasonPart: string = "";
  filter_team: string = "ALL";
  filter_team_load: string = "ALL";
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

  defined_datasest: any = [];

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

  selected_teams: any = [];
  dropdownSettings2 = {};

  skala_loading: boolean = false;

  filterby: string = "toi";
  //filters

  selected_table_settings: any = [];

  page = "teams";

  matches_list: any = [];

  more_filters: boolean = false;

  data_poradie: any = [];

  tab: string = "";
  prew_tab: string = "";

  team_list_filter: any = [];

  teams_list: any[];

  ligovy_poradi_active = false;

  dataLoaded: boolean;
  loading: boolean;

  seasons_select_list = [];
  dropdownSettings = {};
  seasons_list: any[];

  competitions_list: any = [];
  selected_attributes_string: any;

  shoda_sortby: string = "toi";
  shodaSort_value: string = "desc";
  filterby2: string = "toi";

  data_averages: any = [];

  toggle_table_settings: boolean = false;
  team_or_all_players: boolean = false;

  table_settings: any[] = [
    {
      name: "xGF/60",
      type: "xgf60",
      colour: "green",
      eng: "Expected Goals For per 60",
      desc: "Očekávané góly týmu za 60 minut",
      data: "60",
      onIce: false,
      origin: "xgf60",
      types: [],
    },
    {
      name: "xGA/60",
      type: "xga60",
      colour: "red",
      eng: "Expected Goals Against per 60",
      desc: "Očekávané góly soupeře za 60 minut",
      data: "60",
      onIce: false,
      origin: "xga60",
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
      name: "GF/60",
      type: "gf60",
      colour: "green",
      eng: "Goals For per 60",
      desc: "Góly týmu za 60 minut",
      data: "60",
      onIce: false,
      origin: "gf60",
      types: [],
    },
    {
      name: "GA/60",
      type: "ga60",
      colour: "red",
      eng: "Goals Against per 60",
      desc: "Góly soupeře za 60 minut",
      data: "60",
      onIce: false,
      origin: "ga60",
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
      name: "EnF/60",
      type: "enf60",
      colour: "green",
      eng: "Controlled Zone Entries For per 60",
      desc: "Kontrolované vstupy týmu do pásma za 60 minut",
      data: "60",
      onIce: false,
      origin: "enf60",
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
  ];
  table_settings_gamelog: any[] = [
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

  data: any = [];
  data_csv: any = [];
  dataSets: any = [];

  filter_dataSet: string = "ALL";

  average_compare: string = "";
  averages_data: any = [];

  show_skala: boolean = false;

  averages_loaded: boolean = false;

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

  canvas_type: string = "teams";

  boolProd: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private translate: TranslatePipe,
    private formatParametersService: FormatParametersService,
    private trendService: TrendService,
    private gamelogService: GamelogService,
    private formationsAnalysisService: FormationsAnalysisService,
    private defaultService: DefaultService,
    private zone: NgZone,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      text: "Vybrat sezonu",
      selectAllText: "Vybrat vše",
      unSelectAllText: "Odebrat vše",
      enableSearchFilter: false,
      classes: "multiselect",
    };

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

    this.dataLoaded = false;
    this.loading = false;

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }

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
    this.getEnemyList();
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
  }

  getEnemyList() {
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
    console.log("selected_teams", this.selected_teams);
    console.log("filter_opp",this.filter_opponents);
    console.log("players_list",this.players_list); */
  }

  getSeasonParts() {
    this.filter_seasonPart = "";
    this.filter_team = "ALL";
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

  selectTeams() {
    this.filter_opponents = [];

    this.selected_teams.forEach((item) => {
      this.filter_opponents.push(item.uuid);
    });
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
      for (let item in attributes["teams"][0]["individual"][0]) {
        //console.log(JSON.stringify());
        attributes["teams"][0]["individual"][0][item][0]["types"].forEach(
          (type) => {
            type["attributes"].forEach((attribute) => {
              if (attribute["type"] == type) {
                name = item["name"];
              }
            });
          }
        );
      }

      /* for (let item in attributes["teams"][0]["onIce"][0]) {
        //console.log(JSON.stringify());
        attributes["teams"][0]["onIce"][0][item][0]["types"].forEach(type => {
          type["attributes"].forEach(attribute=> {
            if (attribute["type"] == type) {
              name = item["name"];
            }
          });
        });
      } */
    }
    return name;
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

  toggleLigovePoradie() {
    if (this.ligovy_poradi_active) {
      this.ligovy_poradi_active = false;
    } else {
      this.ligovy_poradi_active = true;
      this.loadPoradi();
    }
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

  loadPoradi() {
    this.data_poradie = [];
    this.skala_loading = true;
    this.show_skala = false;

    if (this.filter_team == "ALL") {
      this.teams_list.forEach((item, index) => {
        this.formationsAnalysisService
          .getTeamsPercentil(
            this.filter_seasonPart,
            item["uuid"],
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
              let data_edited = loaded_data;
              data_edited["uuid"] = item["uuid"];
              this.data_poradie.push(data_edited);

              if (index + 1 == this.teams_list.length) {
                this.skala_loading = false;
                this.show_skala = true;
              }
            },
            (err) => {
              alert(
                "Při načítání dat došlo k chybě: 'Tt_lp'. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
              );
            }
          );
      });
      this.cd.detectChanges();
    } else {
      [this.filter_team].forEach((item, index) => {
        this.formationsAnalysisService
          .getTeamsPercentil(
            this.filter_seasonPart,
            item,
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
              let data_edited = loaded_data;
              data_edited["uuid"] = item;
              this.data_poradie.push(data_edited);

              this.skala_loading = false;
              this.show_skala = true;
              this.cd.detectChanges();
            },
            (err) => {
              alert(
                "Při načítání dat došlo k chybě: 'Tt_lp'. Kontaktujte nás prosím na e-mailu podpora@esports.cz."
              );
            }
          );
      });
    }
    this.cd.detectChanges();
  }

  filterVyberDatDle(actual_value: boolean) {
    //this.data_gamelog = [];
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
    dataset = this.formatParametersService.formatParameters(dataset, "teams");
    this.onChangedAttributes(dataset);
  }

  getTeamsData() {
    this.filter_team = 'ALL';
    this.teams_list = [];

    /* this.loading = false;
    this.dataLoaded = false; */

    let uuids = this.filter_seasonPart.split(",");
    console.log("UUIDS", uuids);

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

  changedOrder(event) {
    this.filterby = event;
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
    this.loadData(this.tab);
  }

  toggleTableSettings(type: string) {
    this.tab = this.prew_tab;
    if (type == "gamelog") {
      this.selected_table_settings = this.table_settings_gamelog;
    } else {
      this.selected_table_settings = this.table_settings;
    }

    if (this.toggle_table_settings == true) {
      this.toggle_table_settings = false;
    } else {
      this.toggle_table_settings = true;
    }
  }

  loadData(page: string) {
    this.tab = page;
    this.prew_tab = page;
    this.shoda_sortby = "toi";

    this.checkLoggedTime();

    this.loading = true;
    this.dataLoaded = false;

    if (this.tab == "tabs") {
      this.loadTable();
    } else if (this.tab == "gamelog") {
      if (this.filter_team == "ALL") {
        alert("Prosím vyberte tým");
        this.loading = false;
      } else if (this.filter_team != "ALL") {
        this.loadGamelog();
      }
    } else if (this.tab == "trend") {
      if (this.filter_team == "ALL") {
        alert("Prosím vyberte tým");
        this.loading = false;
      } else if (this.filter_team != "ALL") {
        this.loadTrend();
      }
    }

    this.average_compare = "";
    this.show_skala = false;
    this.ligovy_poradi_active = false;

    this.data = [];
  }

  loadTable() {
    if (this.filter_team == "ALL") {
      this.teams_list.forEach((item, index) => {
        this.filter_team_load = item["uuid"];
        this.formationsAnalysisService
          .getFormation(
            this.filter_seasonPart,
            this.filter_team_load,
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
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings
          )
          .subscribe(
            (loaded_data) => {
              let data_edited = loaded_data;
              data_edited["uuid"] = item["uuid"];
              this.data.push(data_edited);
              //console.log(JSON.stringify(loaded_data));
              if (index == this.teams_list.length - 1) {
                this.loadAverages();
              }
              if (this.data.length == this.teams_list.length) {
                this.loading = false;
                this.dataLoaded = true;
              }
            },
            (err) => {
              //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
              //this.defaultService.logout();
              window.location.reload();
              this.loading = false;
              this.dataLoaded = true;
            }
          );
      });
    } else {
      [this.filter_team].forEach((item, index) => {
        this.filter_team_load = item;
        this.formationsAnalysisService
          .getFormation(
            this.filter_seasonPart,
            item,
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
            this.filter_situationType,
            this.filter_situationTime,
            this.table_settings
          )
          .subscribe(
            (loaded_data) => {
              let data_edited = loaded_data;
              data_edited["uuid"] = item;
              this.data.push(data_edited);
              //console.log(JSON.stringify(loaded_data));

              this.loadAverages();
              this.loading = false;
              this.dataLoaded = true;
            },
            (err) => {
              //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
              //this.defaultService.logout();
              window.location.reload();
              this.loading = false;
              this.dataLoaded = true;
            }
          );
      });
    }
  }

  loadAverages() {
    this.loading = false;
    this.dataLoaded = false;
    this.averages_loaded = false;

    this.defaultService
      .getAverages(
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
        this.table_settings
      )
      .subscribe(
        (loaded_data) => {
          this.data_averages = loaded_data;

          this.averages_loaded = true;

          console.log("loaded_averages", loaded_data);
        },
        (err) => {
          //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          //this.defaultService.logout();
          window.location.reload();
        }
      );
  }

  loadGamelog() {
    this.shoda_sortby = "rank";
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
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings_gamelog
      )
      .subscribe(
        (loaded_data) => {
          console.log("loaded_data", loaded_data);
          this.data = loaded_data;
          this.data.forEach((item, index) => {
            this.data[index]["uuid"] = item["uuid"];

            this.data[index]["homeTeamUuid"] = item["info"]["homeTeamUuid"];
            this.data[index]["awayTeamUuid"] = item["info"]["awayTeamUuid"];
            this.data[index]["date"] = item["info"]["date"];
            this.data[index]["home_score"] = item["info"]["score"]["home"];
            this.data[index]["away_score"] = item["info"]["score"]["away"];
            this.data[index]["state_score"] = item["info"]["score"]["state"];

            this.table_settings_gamelog.forEach((item2, index2) => {
              this.data[index][item2["type"]] = item["stats"][item2["type"]];
            });

            this.data[index]["toi"] = item["stats"]["toi"];
            this.loading = false;
            this.dataLoaded = true;
          });
        },
        (err) => {
          //alert("Při načítání dat došlo k chybě. Kontaktujte nás prosím na e-mailu podpora@esports.cz.");
          //this.defaultService.logout();
          window.location.reload();
          this.loading = false;
          this.dataLoaded = true;
        }
      );
  }

  loadTrend() {
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
        this.filter_situationType,
        this.filter_situationTime,
        this.table_settings
      )
      .subscribe((loaded_data) => {
        this.data = loaded_data;
        console.log("data", this.data);
        this.renderGraph();
      });
  }

  renderGraph() {
    let months = [];
    this.data.forEach((item) => {
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

    this.data.forEach((item) => {
      let attribute_value = 0;

      if (item["stats"] == null) {
        attribute_value = undefined;
      } else {
        attribute_value = item["stats"][this.filter_graph_attribute];
      }

      console.log("attribute_value", attribute_value);

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
    console.log("data");
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
              this.data.forEach((item) => {
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

  getPlayerName(uuid: string) {
    if (localStorage.getItem(uuid) === null) {
      return "" + uuid;
    } else {
      let surname = JSON.parse(localStorage.getItem(uuid))["surname"];
      let name = JSON.parse(localStorage.getItem(uuid))["name"];

      if (surname == "Klima") {
        let name2 = "";
        console.log(name);
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

  averageCompare(compare_what: string) {
    if (this.average_compare == compare_what) {
      this.average_compare = "";
    } else {
      this.average_compare = compare_what;
    }
  }

  active_skala() {
    if (this.show_skala == true) {
      this.show_skala = false;
    } else {
      if (this.average_compare != "") {
        this.show_skala = true;
      } else {
        alert("Je nutné vybrat typ porovnání.");
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

  getSkalaColour(team: string, attribute: string) {
    let value = 0;

    this.data_poradie.forEach((item) => {
      /* console.log("item",item);
      console.log("team", team); */
      if (item["uuid"] == team) {
        value = item[attribute];
        return;
      }
    });

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

  getSkalaNumber(team: string, attribute: string) {
    let value = 0;

    this.data_poradie.forEach((item) => {
      if (item["uuid"] == team) {
        value = item[attribute];
        return;
      }
    });
    return value;
  }

  getPlayerTeamShort(uuid: string) {
    uuid = JSON.parse(localStorage.getItem(uuid))["team"];
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

    return team;
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

  formationAnalysisLink(
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
      filter_situationTime
    );
  }

  gamelogLink(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_team_gamelog: string
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
    let filter_team = filter_team_gamelog;

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

  gamelogTrend(
    filter_playerId_select1: string,
    filter_playerId_select2: string,
    filter_playerId_select3: string,
    filter_playerId_select4: string,
    filter_playerId_select5: string,
    filter_playerId_select6: string,
    filter_team_gamelog: string
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
    let filter_team = filter_team_gamelog;

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

  onChangedAttributes(new_attributes: any) {
    let clean_attributes: any = [];

    new_attributes.forEach((item, index) => {
      if (item["type"] != null) {
        clean_attributes.push(item);
      }
    });

    this.table_settings_gamelog = clean_attributes;
    this.table_settings = clean_attributes;
    console.log("table setting", this.table_settings);
    this.loadData(this.tab);
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

    let attributes = JSON.parse(localStorage.getItem("loaded_attributes"));
    for (let item in attributes["teams"][0]["individual"][0]) {
      attributes["teams"][0]["individual"][0][item][0]["types"].forEach(
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

    //console.log("Title",title)
    if (show_what == 1) {
      return title;
    } else if (show_what == 2) {
      return desc;
    } else {
      return "";
    }
  }

  formatSecondsDecimal(seconds: number) {
    return seconds / 60;
  }

  changedOrder2(event) {
    this.shoda_sortby = event;
    this.filterby2 = event;
    console.log("Filter by:", event);
  }

  shodaSort(event) {
    this.shodaSort_value = event;
  }

  downloadCSV() {
    let data = [];
    let th = ["Jmeno hrace", "GP", "TOI"];
    let th_types = ["uuid", "gp", "toi"];

    this.table_settings.forEach((item, index) => {
      if (item["type"] != null) {
        th.push(item["name"]);
        th_types.push(item["type"]);
      }
    });

    data.push(th);

    let row = [];

    this.data.forEach((item, index) => {
      row.push(item);
    });

    row.forEach((item, index) => {
      let selected_data = [];
      th_types.forEach((item2, index2) => {
        if (item2 == "toi") {
          selected_data.push(String(this.formatSecondsDecimal(item[item2])));
        } else if (item2 == "oztoi") {
          selected_data.push(String(this.formatSecondsDecimal(item[item2])));
        } else if (item2 == "dzposstoi") {
          selected_data.push(String(this.formatSecondsDecimal(item[item2])));
        } else if (item2 == "oppdzptoi") {
          selected_data.push(String(this.formatSecondsDecimal(item[item2])));
        } else if (item2 == "ozposstoi") {
          selected_data.push(String(this.formatSecondsDecimal(item[item2])));
        } else if (item2 == "posstoi") {
          selected_data.push(String(this.formatSecondsDecimal(item[item2])));
        } else if (item2 == "dztoi") {
          selected_data.push(String(this.formatSecondsDecimal(item[item2])));
        } else if (item2 == "uuid") {
          selected_data.push(
            accents.remove(this.getTeamNameShort(item[item2]))
          );
        } else {
          selected_data.push(String(item[item2]));
        }
      });

      data.push(selected_data);
    });

    data = JSON.parse(JSON.stringify(data));

    let final_data = JSON.parse(JSON.stringify(data));

    //new Angular5Csv(final_data, 'teams', csv_options);
    this.defaultService.downloadXLS(final_data).subscribe((loaded_data) => {
      window.location.assign(loaded_data["url"]);
    });
  }

  formatSeconds(s) {
    // accepts seconds as Number or String. Returns m:ss
    return (
      (s - // take value s and subtract (will try to convert String to Number)
        (s %= 60)) / // the new value of s, now holding the remainder of s divided by 60
        // (will also try to convert String to Number)
        60 + // and divide the resulting Number by 60
      // (can never result in a fractional value = no need for rounding)
      // to which we concatenate a String (converts the Number to String)
      // who's reference is chosen by the conditional operator:
      (9 < s // if    seconds is larger than 9
        ? ":" // then  we don't need to prepend a zero
        : ":0") + // else  we do need to prepend a zero
      s
    ); // and we add Number s to the string (converting it to String as well)
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

  vybratTeamCheck() {
    if (this.filter_opponents.includes(this.filter_team)) {
      this.filter_opponents.forEach((opponent, index) => {
        if (opponent == this.filter_team) {
          delete this.filter_opponents[index];
        }
      });
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

  setDefaultOrderRow() {
    this.list_order = 0;
  }
  addOrderRow() {
    this.list_order = this.list_order + 1;
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

        for (let item in attributes["teams"][0]["individual"][0]) {
          attributes["teams"][0]["individual"][0][item][0]["types"].forEach(
            (item, index) => {
              item["attributes"].forEach((item2) => {
                item2["onIce"] = false;
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

        //
        parameters_exists_reload_data = true;
      }

      if (parameters_exists_reload_data == true) {
        /* this.loadData(this.tab_small_viz); */
        if (params.page == "gamelog") {
          this.showTab("gamelog");
        } else if (params.page == "trend") {
          this.showTab("trend");
        }
      }
    });
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

  //TRACKING
  trackOpenPage() {
    let logged_user = JSON.parse(localStorage.getItem("logged_user"));
    this.defaultService
      .addEvent(
        logged_user[0].id,
        logged_user[0].user,
        "Byla otevřena obrazovka týmy.",
        8
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
