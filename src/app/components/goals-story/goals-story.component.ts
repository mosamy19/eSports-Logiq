import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  Input,
  ComponentFactoryResolver,
} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexMarkers,
  ApexXAxis,
  ApexAnnotations,
  ApexLegend,
  ApexGrid,
  ApexYAxis,
} from 'ng-apexcharts';
import { exit } from 'process';
import { cloneDeep, toInteger } from 'lodash';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  markers: ApexMarkers;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  annotations: ApexAnnotations;
  legend: ApexLegend;
  grid: ApexGrid;
}

@Component({
  selector: 'app-goals-story',
  templateUrl: './goals-story.component.html',
  styleUrls: ['./goals-story.component.scss'],
})
export class GoalsStoryComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input() data: any = [];
  @Input() home_team: any = [];
  @Input() away_team: any = [];
  @Input() games_list: any = Array();
  @Input() teams_list: any = Array();
  basic_data: any = [];
  matchTime = 3600;

  loading = true;
  error = false;

  loaded = false;

  first_home_xg = 0;
  first_away_xg = 0;

  second_home_xg = 0;
  second_away_xg = 0;

  third_home_xg = 0;
  third_away_xg = 0;

  forth_home_xg = 0;
  forth_away_xg = 0;

  fifth_home_xg: number = 0;
  fifth_away_xg: number = 0;

  MAX_TIME = 12;

  constructor(private ngZone: NgZone) {
    this.chartOptions = {
      series: [
        {
          name: 'stepline-series',
          data: [],
        },
        {
          name: 'stepline-series2',
          data: [],
        },
      ],
      xaxis: {
        type: 'numeric',
        min: 0,
        max: 3600,
        tickAmount:  this.MAX_TIME > 12 ? this.MAX_TIME : 12 ,
        labels: {
          show: true,
          style: {
            fontWeight: 600,
          },
          formatter: (val: string) => this.formatSeconds(Number(val)),
        },
        axisBorder: {
          show: true,
          color: '#323241',
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#323241',
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        min: 0,

        labels: {
          style: {
            fontWeight: 600,
          },
          formatter: (val: number) => val.toFixed(2),
        },
        tooltip: {
          enabled: false,
        },
      },
      grid: {
        show: true,

        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      chart: {
        type: 'line',
        height: 480,
        width: 1320,

        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        selection: {
          enabled: false,
        },
      },
      stroke: {
        curve: 'stepline',
        colors: ['#8B32FC', '#f46601'],
        width: 3,
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: undefined,
      },
      markers: {
        size: 6,
        colors: ['#8B32FC', '#f46601'],
        strokeColors: ['#8B32FC', '#f46601'],
      },
      legend: {
        show: false,
      },
      annotations: {
        xaxis: [
          {
            x: 1200,
            strokeDashArray: 0,
            borderColor: '#323241',
            label: {
              borderColor: 'transparent',
              style: {
                color: '#323241',
                background: 'transparent',
                fontSize: '12px',
                fontWeight: 600,
              },
              offsetY: -12,
              orientation: 'horizontal',
              // text: "1st period end",
            },
          },
          {
            x: 2400,
            strokeDashArray: 0,
            borderColor: '#323241',
            label: {
              borderColor: 'transparent',
              style: {
                color: '#323241',
                background: 'transparent',
                fontSize: '12px',
                fontWeight: 600,
              },
              offsetY: -12,
              orientation: 'horizontal',
              // text: "2nd period end",
            },
          },
          {
            x: 4800,
            strokeDashArray: 0,
            borderColor: "#323241",
            label: {
              borderColor: "transparent",
              style: {
                color: "#323241",
                background: "transparent",
                fontSize: "12px",
                fontWeight: 600,
              },
              offsetY: -12,
              orientation: "horizontal",
            },
          },
          {
            x: 6000,
            strokeDashArray: 0,
            borderColor: "#323241",
            label: {
              borderColor: "transparent",
              style: {
                color: "#323241",
                background: "transparent",
                fontSize: "12px",
                fontWeight: 600,
              },
              offsetY: -12,
              orientation: "horizontal",
            },
          },
        ],
        points: [],
      },
    };
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.data[this.home_team].forEach((element) => {
      element.xG = parseFloat(element.xG);
    });
    this.data[this.away_team].forEach((element) => {
      element.xG = parseFloat(element.xG);
    });
    this.basic_data = cloneDeep(this.data);
    console.log('data', this.data);
    this.updateGraph(this.data);
    this.loading = false;
    this.error = false;

    this.getXg(this.home_team, 1, true);
    this.getXg(this.away_team, 1, false);
    this.getXg(this.home_team, 2, true);
    this.getXg(this.away_team, 2, false);
    this.getXg(this.home_team, 3, true);
    this.getXg(this.away_team, 3, false);
    this.getXg(this.home_team, 4, true);
    this.getXg(this.away_team, 4, false);
    this.getXg(this.home_team, 5, true);
    this.getXg(this.away_team, 5, false);
  }

  getXg(team: string, part: number, home) {
    let value = 0;
    this.basic_data[team].forEach((item) => {
      if (part === 1 && item.time <= 1200) {
        /* value = value + parseFloat(item.xG)  */
        value = value + item.xG;
      } else if (part === 2 && item.time > 1200 && item.time <= 2400) {
        // value = value + parseFloat(item.xG)
        value = value + item.xG;
      } else if (part === 3 && item.time > 2400 && item.time <= 3600) {
        // value = value + parseFloat(item.xG)
        value = value + item.xG;
      } else if (part === 4 && item.time > 3600 && item.time <= 4800) {
        value = value + item.xG;
      } else if (part === 5 && item.time > 4800) {
        value = value + item.xG;
      }
    });

    if (home && part == 1) {
      this.first_home_xg = value;
    } else if (!home && part == 1) {
      this.first_away_xg = value;
    } else if (home && part == 2) {
      this.second_home_xg = value;
    } else if (!home && part == 2) {
      this.second_away_xg = value;
    } else if (home && part == 3) {
      this.third_home_xg = value;
    } else if (!home && part == 3) {
      this.third_away_xg = value;
    } else if (home && part == 4) {
      this.forth_home_xg = value;
    } else if (!home && part == 4) {
      this.forth_away_xg = value;
    } else if (home && part == 5) {
      this.fifth_home_xg = value;
    } else if (!home && part == 5) {
      this.fifth_away_xg = value;
    }
  }

  getAllXg(team: string, part: number) {
    let value = 0;

    console.log('value_start', value);
    this.basic_data[team].forEach((item) => {
      if (part === 1 && item.time <= 1200) {
        /* value = value + parseFloat(item.xG)  */
        value = value + item.xG;
      } else if (part === 2 && item.time > 1200 && item.time <= 2400) {
        // value = value + parseFloat(item.xG)
        value = value + item.xG;
      } else if (part === 3 && item.time > 2400 && item.time <= 3600) {
        // value = value + parseFloat(item.xG)
        value = value + item.xG;
      }
    });
    console.log('value_end', value);
    return value.toFixed(2);
  }

  updateGraph(data: any) {
    const homeData = [];
    const awayData = [];

    const goals = [];
    const timeDataAll = [];

    let test = 0;

    data[this.home_team].forEach((element) => {
      const number = cloneDeep(element.xG);
      test = test + number;
      element.xG = test;
    });

    let test2 = 0;
    data[this.away_team].forEach((element) => {
      const number = cloneDeep(element.xG);
      test2 = test2 + number;
      element.xG = test2;
    });

    data[this.home_team].forEach((item) => {
      homeData.push({ x: item.time, y: item.xG });
      timeDataAll.push(item.time);
    });

    data[this.away_team].forEach((item) => {
      awayData.push({ x: item.time, y: item.xG });
      timeDataAll.push(item.time);
    });

    data[this.home_team].forEach((item) => {
      if (item.type === 'G') {
        goals.push({
          x: item.time,
          y: item.xG,
          marker: {
            size: 0,
          },
          image: {
            path: 'assets/logos/' + this.home_team + '.png',
            width: 36,
            height: 36,
            offsetX: 0,
            offsetY: 18,
          },
        });
      }
    });

    console.log('Goals', goals);

    data[this.away_team].forEach((item) => {
      if (item.type === 'G') {
        goals.push({
          x: item.time,
          y: item.xG,
          marker: {
            size: 0,
          },
          image: {
            path: 'assets/logos/' + this.away_team + '.png',
            width: 36,
            height: 36,
            offsetX: 0,
            offsetY: 18,
          },
        });
      }
    });

    this.chartOptions.series = [
      {
        name: 'xG',
        data: homeData,
        color: '#8B32FC',
      },
      {
        name: 'xG',
        data: awayData,
        color: '#f46601',
      },
    ];
    try {
      this.ngZone.run(() => {
        // this.chartOptions.annotations = anota;

        this.chartOptions.yaxis.max = this.findMax();

        this.chart.updateOptions(this.chartOptions);

        const maxTime = Math.max.apply(null, timeDataAll);
        if (maxTime > 3600) {
          // delka osy Y
          this.chartOptions.xaxis.max = (((maxTime / 300) - ((maxTime % 300) / 300)) + 1) * 300;
          this.MAX_TIME = ((maxTime / 300) - ((maxTime % 300) / 300)) + 1;
          this.chartOptions.xaxis.tickAmount = this.MAX_TIME;

          this.chartOptions.annotations.xaxis.push({
            x: 3600,
            strokeDashArray: 0,
            borderColor: '#323241',
            label: {
              borderColor: 'transparent',
              style: {
                color: '#323241',
                background: 'transparent',
                fontSize: '12px',
                fontWeight: 600,
              },
              offsetY: -12,
              orientation: 'horizontal',
              text: '',
            },
          });
          this.chart.updateOptions(this.chartOptions);
        }
        this.loaded = true;
      });
      setTimeout(() => {
        const anota: any = [];
        goals.forEach((item) => {
          this.chart.addPointAnnotation(item);
          // anota.push(item);
        });
      }, 400);
    } catch {
      setTimeout(() => {
        this.updateGraph(this.basic_data);
      }, 200);
      exit;
    }
  }

  formatSeconds = (s2: number) => {
    // return s2;
    let s = s2;
    if (s === 0) {
      return '00:00';
    } else {
      return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }
  }

  stringy(data: any) {
    return JSON.stringify(data);
  }

  findMax() {
    const values: any[number] = [];
    this.data[this.home_team].forEach((item) => {
      values.push(item.xG);
    });
    this.data[this.away_team].forEach((item) => {
      values.push(item.xG);
    });
    return Math.ceil(Math.max.apply(null, values));
  }

  // method for getting css classes for graph title e.g. 1.Tretina (not dynamic due to following code structure)
  getCssClassNames(): string {
    if (this.MAX_TIME >= 20) {
      return 'prolong-play-20-more';
    } else if (this.MAX_TIME >= 16) {
      return 'prolong-play-16-more';
    } else if (this.MAX_TIME >= 15) {
      return 'prolong-play-15-more';
    } else if (this.MAX_TIME >= 14) {
      return 'prolong-play-14-more';
    } else if (this.MAX_TIME >= 13) {
      return 'prolong-play-13-more';
    } else {
      return 'thirds';
    }
  }

  // method for getting css classes for graph tabs e.g. 1.09 xG (not dynamic due to following code structure)
  getCssForTab1(): string {
    if (this.MAX_TIME <= 12 ) {
      return 'tab1-no-prolong';
    } else if (this.MAX_TIME <= 13) {
      return 'tab1-prolong-13';
    } else if (this.MAX_TIME <= 14) {
      return 'tab1-prolong-14';
    } else if (this.MAX_TIME <= 15) {
      return 'tab1-prolong-15';
    } else if (this.MAX_TIME <= 16) {
      return 'tab1-prolong-16';
    } else {
      return 'tab1-prolong-21';
    }
  }

  getCssForTab2(): string {
    if (this.MAX_TIME <= 12 ) {
      return 'tab2-no-prolong';
    } else if (this.MAX_TIME <= 13) {
      return 'tab2-prolong-13';
    } else if (this.MAX_TIME <= 14) {
      return 'tab2-prolong-14';
    } else if (this.MAX_TIME <= 15) {
      return 'tab2-prolong-15';
    } else if (this.MAX_TIME <= 16) {
      return 'tab2-prolong-16';
    } else {
      return 'tab2-prolong-21';
    }
  }

  getCssForTab3(): string {
    if (this.MAX_TIME <= 12 ) {
      return 'tab3-no-prolong';
    } else if (this.MAX_TIME <= 13) {
      return 'tab3-prolong-13';
    } else if (this.MAX_TIME <= 14) {
      return 'tab3-prolong-14';
    } else if (this.MAX_TIME <= 15) {
      return 'tab3-prolong-15';
    } else if (this.MAX_TIME <= 16) {
      return 'tab3-prolong-16';
    } else {
      return 'tab3-prolong-21';
    }
  }

  getCssForProlong(): string {
    if (this.MAX_TIME <= 12 ) {
      return '';
    } else if (this.MAX_TIME <= 13) {
      return 'tab4-prolong-13';
    } else if (this.MAX_TIME <= 14) {
      return 'tab4-prolong-14';
    } else if (this.MAX_TIME <= 15) {
      return 'tab4-prolong-15';
    } else if (this.MAX_TIME <= 16) {
      return 'tab4-prolong-16';
    } else {
      return 'tab4-prolong-21';
    }
  }

  getCssForProlong21(): string {
    if (this.MAX_TIME <= 12 ) {
      return '';
    } else if (this.MAX_TIME <= 13) {
      return '';
    } else if (this.MAX_TIME <= 14) {
      return '';
    } else if (this.MAX_TIME <= 15) {
      return '';
    } else if (this.MAX_TIME <= 16) {
      return '';
    } else {
      return 'tab5-prolong-21';
    }
  }

  getTeamShortcut(uuid: string): string {
    let shortcut = '';
      this.teams_list.forEach((item, index) => {
        if (item['uuid'] === uuid) {
          shortcut = item['shortcut'];
        }
      });
    return shortcut;
  }

  // method for getting css classes for graph shortcut above tabs e.g. SPA LIB (not dynamic due to following code structure)
  getCssHomeTeamShortcut1(): string {
    if (this.MAX_TIME <= 12) {
      return 'shortcut, shortcut-left-no-prolong-1';
    } else if (this.MAX_TIME <= 13) {
      return 'shortcut, shortcut-left-prolong-1-13';
    } else if (this.MAX_TIME <= 14) {
      return 'shortcut, shortcut-left-prolong-1-14';
    } else if (this.MAX_TIME <= 15) {
      return 'shortcut, shortcut-left-prolong-1-15';
    } else if (this.MAX_TIME <= 16) {
      return 'shortcut, shortcut-left-prolong-1-16';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-left-prolong-1-21';
    } else {
      return 'shortcut';
    }
  }

  getCssAwayTeamShortcut1(): string {
    if (this.MAX_TIME <= 12 ) {
      return 'shortcut, shortcut-right-no-prolong-1';
    } else if (this.MAX_TIME <= 13) {
      return 'shortcut, shortcut-right-prolong-1-13';
    } else if (this.MAX_TIME <= 14) {
      return 'shortcut, shortcut-right-prolong-1-14';
    } else if (this.MAX_TIME <= 15) {
      return 'shortcut, shortcut-right-prolong-1-15';
    } else if (this.MAX_TIME <= 16) {
      return 'shortcut, shortcut-right-prolong-1-16';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-right-prolong-1-21';
    } else {
      return 'shortcut';
    }
  }

  getCssHomeTeamShortcut2(): string {
    if (this.MAX_TIME <= 12 ) {
      return 'shortcut, shortcut-left-no-prolong-2';
    } else if (this.MAX_TIME <= 13) {
      return 'shortcut, shortcut-left-prolong-2-13';
    } else if (this.MAX_TIME <= 14) {
      return 'shortcut, shortcut-left-prolong-2-14';
    } else if (this.MAX_TIME <= 15) {
      return 'shortcut, shortcut-left-prolong-2-15';
    } else if (this.MAX_TIME <= 16) {
      return 'shortcut, shortcut-left-prolong-2-16';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-left-prolong-2-21';
    } else {
      return 'shortcut';
    }
  }

  getCssAwayTeamShortcut2(): string {
    if (this.MAX_TIME <= 12 ) {
      return 'shortcut, shortcut-right-no-prolong-2';
    } else if (this.MAX_TIME <= 13) {
      return 'shortcut, shortcut-right-prolong-2-13';
    } else if (this.MAX_TIME <= 14) {
      return 'shortcut, shortcut-right-prolong-2-14';
    } else if (this.MAX_TIME <= 15) {
      return 'shortcut, shortcut-right-prolong-2-15';
    } else if (this.MAX_TIME <= 16) {
      return 'shortcut, shortcut-right-prolong-2-16';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-right-prolong-2-21';
    } else {
      return 'shortcut';
    }
  }

  getCssHomeTeamShortcut3(): string {
    if (this.MAX_TIME <= 12 ) {
      return 'shortcut, shortcut-left-no-prolong-3';
    } else if (this.MAX_TIME <= 13) {
      return 'shortcut, shortcut-left-prolong-3-13';
    } else if (this.MAX_TIME <= 14) {
      return 'shortcut, shortcut-left-prolong-3-14';
    } else if (this.MAX_TIME <= 15) {
      return 'shortcut, shortcut-left-prolong-3-15';
    } else if (this.MAX_TIME <= 16) {
      return 'shortcut, shortcut-left-prolong-3-16';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-left-prolong-3-21';
    } else {
      return 'shortcut';
    }
  }

  getCssAwayTeamShortcut3(): string {
    if (this.MAX_TIME <= 12 ) {
      return 'shortcut, shortcut-right-no-prolong-3';
    } else if (this.MAX_TIME <= 13) {
      return 'shortcut, shortcut-right-prolong-3-13';
    } else if (this.MAX_TIME <= 14) {
      return 'shortcut, shortcut-right-prolong-3-14';
    } else if (this.MAX_TIME <= 15) {
      return 'shortcut, shortcut-right-prolong-3-15';
    } else if (this.MAX_TIME <= 16) {
      return 'shortcut, shortcut-right-prolong-3-16';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-right-prolong-3-21';
    } else {
      return 'shortcut';
    }
  }

  getCssHomeTeamShortcutProlong(): string {
    if (this.MAX_TIME <= 12 ) {
      return '';
    } else if (this.MAX_TIME <= 13) {
      return 'shortcut, shortcut-left-prolong-4-13';
    } else if (this.MAX_TIME <= 14) {
      return 'shortcut, shortcut-left-prolong-4-14';
    } else if (this.MAX_TIME <= 15) {
      return 'shortcut, shortcut-left-prolong-4-15';
    } else if (this.MAX_TIME <= 16) {
      return 'shortcut, shortcut-left-prolong-4-16';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-left-prolong-4-21';
    } else {
      return 'shortcut';
    }
  }

  getCssAwayTeamShortcutProlong(): string {
    if (this.MAX_TIME <= 12) {
      return '';
    } else if (this.MAX_TIME <= 13) {
      return 'shortcut, shortcut-right-prolong-4-13';
    } else if (this.MAX_TIME <= 14) {
      return 'shortcut, shortcut-right-prolong-4-14';
    } else if (this.MAX_TIME <= 15) {
      return 'shortcut, shortcut-right-prolong-4-15';
    } else if (this.MAX_TIME <= 16) {
      return 'shortcut, shortcut-right-prolong-4-16';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-right-prolong-4-21';
    } else {
      return 'shortcut';
    }
  }

  getCssHomeTeamShortcutProlong2(): string {
    if (this.MAX_TIME <= 12 ) {
      return '';
    } else if (this.MAX_TIME <= 13) {
      return '';
    } else if (this.MAX_TIME <= 14) {
      return '';
    } else if (this.MAX_TIME <= 15) {
      return '';
    } else if (this.MAX_TIME <= 16) {
      return '';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-left-prolong-5-21';
    } else {
      return 'shortcut';
    }
  }

  getCssAwayTeamShortcutProlong2(): string {
    if (this.MAX_TIME <= 12) {
      return '';
    } else if (this.MAX_TIME <= 13) {
      return '';
    } else if (this.MAX_TIME <= 14) {
      return '';
    } else if (this.MAX_TIME <= 15) {
      return '';
    } else if (this.MAX_TIME <= 16) {
      return '';
    } else if (this.MAX_TIME <= 21) {
      return 'shortcut, shortcut-right-prolong-5-21';
    } else {
      return 'shortcut';
    }
  }
}
