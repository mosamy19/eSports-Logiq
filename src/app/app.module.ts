import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";

import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { WOWYComponent } from "./pages/wowy/wowy.component";
import { FormationsOverviewComponent } from "./pages/formations-overview/formations-overview.component";
import { FormationsAnalysisComponent } from "./pages/formations-analysis/formations-analysis.component";
import { GamesComponent } from "./pages/games/games.component";
import { IndividualStatsComponent } from "./pages/individual-stats/individual-stats.component";
import { GamelogComponent } from "./pages/gamelog/gamelog.component";
import { TeamsComponent } from "./pages/teams/teams.component";
import { TrackingComponent } from "./pages/tracking/tracking.component";
import { TrendComponent } from "./pages/trend/trend.component";
import { DownloadsComponent } from "./pages/downloads/downloads.component";

import { NavComponent } from "./components/nav/nav.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { LoadingVideoComponent } from "./components/loading-video/loading-video.component";

import { SelectDataComponent } from "./components/select-data/select-data.component";
import { NoDataComponent } from "./components/no-data/no-data.component";
import { NoDataDarkComponent } from "./components/no-data-dark/no-data-dark.component";
import { VideoComponent } from "./components/video-modal/video-modal.component";

import { PiechartComponent } from "./pages/games/components/piechart.component";
import { ZonyBrankyComponent } from "./components/zony-branky/zony-branky.component";
import { ShotmapSmallComponent } from "./components/shotmap-small/shotmap-small.component";

import { NguiAutoCompleteModule } from "@ngui/auto-complete";
import { NgDatepickerModule } from "ng2-datepicker";

import { DataTableModule } from "angular2-datatable";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { GetColourPipe } from "./pipes/getColour.pipe";
import { FormatSecondsPipe } from "./pipes/formatSeconds.pipe";
import { FormatDatePipe } from "./pipes/formatDate.pipe";
import { CheckNullPipe } from "./pipes/checkNull.pipe";
import { FormatTimePipe } from "./pipes/formatTime.pipe";
import { CheckAttributeValuePipe } from "./pipes/checkAttributeType.pipe";
import { TranslatePipe } from "./pipes/translate.pipe";
import { FormatSeconds2Pipe } from "./pipes/formatSeconds2.pipe";

import { AuthGuard } from "./_guards/auth.guard";

import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";

import { CanvasComponent } from "./components/canvas/canvas.component";

import { TooltipModule } from "ng2-tooltip-directive";
import { GoalkeepersComponent } from "./pages/goalkeepers/goalkeepers.component";
import { ShotMapComponent } from "./components/shotmap/shotmap.component";
import { ShotMapGoalkeeperComponent } from "./components/shotmap_goalkeeper/shotmap_goalkeeper.component";
import { AssistMapComponent } from "./components/assistmap/assistmap.component";
import { BulyMapComponent } from "./components/bulymap/bulymap.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ChangelogComponent } from "./pages/changelog/changelog.component";
import { HelpComponent } from "./pages/help/help.component";
import { ContactComponent } from "./pages/contact/contact.component";
import {RaidsComponent} from "./components/raids/raids.component"

import { HeatMapComponent } from "./components/heatmap/heatmap.component";
import { VstupyComponent } from "./components/vstupy/vstupy.component";
import { VideoBoxComponent } from "./components/video/video.component";
import { VystupyComponent } from "./components/vystupy/vystupy.component";

import { DragScrollModule } from "ngx-drag-scroll";
import { ChartsModule } from "ng2-charts";
import { NgApexchartsModule } from 'ng-apexcharts';

import { Ng5SliderModule } from "ng5-slider";

import { MatchDatePipe } from "./pipes/matchDate.pipe";
import { MatchDate2Pipe } from "./pipes/matchDate2.pipe";

import { FormsModule } from "@angular/forms";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";

import { ToastrModule } from "ngx-toastr";
import { VideoRaidsComponent } from './components/video-raids/video-raids.component';
import { PlayerCardComponent } from './components/player-card/player-card.component';
import { HeatmapSimpleComponent } from './components/heatmap-simple/heatmap-simple.component';
import { GoalsStoryComponent } from './components/goals-story/goals-story.component';
import { ShotFlowComponent } from './components/shot-flow/shot-flow.component';
import { ItemsToStringPipe } from './pipes/itemsToString.pipe';
import { FilterPipe } from "./pipes/filter.pipe";


/* import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
 */
const appRoutes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: "wowy", component: WOWYComponent, canActivate: [AuthGuard] },
  {
    path: "formations-overview",
    component: FormationsOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "formations-overview/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime/:selected_attributes/:page",
    component: FormationsOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "formations-analysis",
    component: FormationsAnalysisComponent,
    canActivate: [AuthGuard],
  },
  {
    path:
      "formations-analysis/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime",
    component: FormationsAnalysisComponent,
    canActivate: [AuthGuard],
  },
  {
    path:
      "formations-analysis/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime/:selected_attributes",
    component: FormationsAnalysisComponent,
    canActivate: [AuthGuard],
  },
  {
    path:
      "formations-analysis/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime/:selected_match/:selected_attributes",
    component: FormationsAnalysisComponent,
    canActivate: [AuthGuard],
  },

  { path: "games", component: GamesComponent, canActivate: [AuthGuard] },
  {
    path:"games/:filter_season/:filter_seasonPart/:filter_team/:game/:filter_enemy_team/:selected_attributes/:page",
    component: GamesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "individual-stats",
    component: IndividualStatsComponent,
    canActivate: [AuthGuard],
  },
  {
    path:"individual-stats/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_situationType/:filter_situationTime/:selected_attributes/:page",
    component: IndividualStatsComponent,
    canActivate: [AuthGuard],
  },
  { path: "gamelog", component: GamelogComponent, canActivate: [AuthGuard] },
  {
    path:
      "gamelog/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime",
    component: GamelogComponent,
    canActivate: [AuthGuard],
  },
  {
    path:
      "gamelog/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime/:selected_attributes",
    component: GamelogComponent,
    canActivate: [AuthGuard],
  },

  //{ path: 'trend', component: TrendComponent, canActivate: [AuthGuard] },
  {
    path:
      "trend/:trend_type/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime",
    component: TrendComponent,
    canActivate: [AuthGuard],
  },
  {
    path:
      "trend/:trend_type/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime/:selected_attributes",
    component: TrendComponent,
    canActivate: [AuthGuard],
  },

 /*  {
    path:
      "gamelog_goalkeepers/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime",
    component: GamelogComponent,
    canActivate: [AuthGuard],
  },
  {
    path:
      "gamelog_goalkeepers/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_playerId_select2/:filter_playerId_select3/:filter_playerId_select4/:filter_playerId_select5/:filter_playerId_select6/:filter_situationType/:filter_situationTime/:selected_attributes",
    component: GamelogComponent,
    canActivate: [AuthGuard],
  }, */

  { path: "teams", 
    component: TeamsComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path:"teams/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_situationType/:filter_situationTime/:selected_attributes/:page",
    component: TeamsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "goalkeepers",
    component: GoalkeepersComponent,
    canActivate: [AuthGuard],
  },
  {
    path:"goalkeepers/:filter_season/:filter_seasonPart/:filter_team/:filter_countOfPlayer/:filter_minTOI/:filter_lastGames/:filter_dateFrom/:filter_dateTo/:filter_homeAway/:filter_matchState/:filter_minutes_from/:filter_minutes_to/:filter_opponents/:filter_playerId_select1/:filter_situationType/:filter_situationTime/:selected_attributes/:page",
    component: GoalkeepersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "raids",
    component: RaidsComponent,
    canActivate: [AuthGuard],
  },
  { path: "tracking", component: TrackingComponent, canActivate: [AuthGuard] },
  {
    path: "downloads",
    component: DownloadsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "changelog",
    component: ChangelogComponent,
    canActivate: [AuthGuard],
  },
  { path: "help", component: HelpComponent, canActivate: [AuthGuard] },
  { path: "contact", component: ContactComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoadingComponent,
    LoadingVideoComponent,
    SelectDataComponent,
    NoDataComponent,
    NoDataDarkComponent,
    LoginComponent,
    DashboardComponent,
    FormationsOverviewComponent,
    FormationsAnalysisComponent,
    WOWYComponent,
    GamesComponent,
    IndividualStatsComponent,
    GamelogComponent,
    TeamsComponent,
    GetColourPipe,
    FormatSecondsPipe,
    FormatDatePipe,
    CheckNullPipe,
    FilterPipe,
    RaidsComponent,
    PiechartComponent,
    VideoComponent,
    CanvasComponent,
    FormatTimePipe,
    CheckAttributeValuePipe,
    GoalkeepersComponent,
    ZonyBrankyComponent,
    ShotMapComponent,
    AssistMapComponent,
    TranslatePipe,
    HeatMapComponent,
    FormatSeconds2Pipe,
    TrackingComponent,
    BulyMapComponent,
    TrendComponent,
    ShotMapGoalkeeperComponent,
    VstupyComponent,
    VideoBoxComponent,
    DownloadsComponent,
    MatchDatePipe,
    MatchDate2Pipe,
    VystupyComponent,
    FooterComponent,
    ChangelogComponent,
    HelpComponent,
    ContactComponent,
    ShotmapSmallComponent,
    VideoRaidsComponent,
    PlayerCardComponent,
    HeatmapSimpleComponent,
    GoalsStoryComponent,
    ShotFlowComponent,
    ItemsToStringPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    HttpModule,
    NguiAutoCompleteModule,
    NgDatepickerModule,
    DataTableModule,
    BrowserAnimationsModule,
    AngularMultiSelectModule,
    ChartsModule,
    TooltipModule,
    DragScrollModule,
    Ng5SliderModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
    ToastrModule.forRoot(),
    NgApexchartsModule,
  ],

  

  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
