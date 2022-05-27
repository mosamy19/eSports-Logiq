
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
declare const simpleheat: any;

@Component({
  selector: 'app-heatmap-simple',
  templateUrl: './heatmap-simple.component.html',
  styleUrls: ['./heatmap-simple.component.scss']
})
export class HeatmapSimpleComponent implements OnInit {

  @Input() all_shots: any = [];
  @Input() homeTeam: string = "";
  @Input() awayTeam: string = "";
  shots: any = [];

  loading: boolean = false;
  error: boolean = false;

  heat_home: any;
  heat_away: any;

  home_name: string = "";
  away_name: string = "";

  @ViewChild("heatmap_home") heatmap_home: ElementRef;
  context: CanvasRenderingContext2D;

  show_teams: string = "";
  isMobile: boolean = false;

  team_id: number;

  heat: any;

  constructor() {
    
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.heat_home = simpleheat("heatmap_home");
    this.heat_home.radius(29, 40);
    this.heat_away = simpleheat("heatmap_away");
    this.heat_away.radius(29, 40);
    let shots_home = [];

    this.all_shots.for.forEach((item) => {
      let top = this.calculateVerticalPositionToPercent(
        item["x"]
      );
      let left = this.calculateHorizontalPositionToPercent(
        item["x"],
        item["y"]
      );
      let pos_x = Math.ceil((512 * left) / 100);
      let pos_y = Math.ceil((512 * top) / 100);
      shots_home.push([pos_x, pos_y, 1]);
    });

    this.heat_home.data(shots_home);
    this.heat_home.draw();
    let shots_away = [];

    this.all_shots.against.forEach((item) => {
      let top = this.calculateVerticalPositionToPercent(
        item["x"]
      );
      let left = this.calculateHorizontalPositionToPercent(
        item["x"],
        item["y"]
      );

      let pos_x = Math.ceil((512 * left) / 100);
      let pos_y = Math.ceil((512 * top) / 100);
      shots_away.push([pos_x, pos_y, 1]);
    });

    this.heat_away.data(shots_away);
    this.heat_away.draw();
  }


  calculateHorizontalPositionToPercent(x, y) {
    var position = Math.ceil((y + 100) / 2);
    return (x <= 0) ? position : 100 - position;
  }

  // zrcadlové otočení pro hosty (X hodnoty v kladných číslech)
  calculateVerticalPositionToPercent(x) {
    return (x <= 0) ? Math.ceil(x + 100) : Math.ceil(100 - x);
  }

}
