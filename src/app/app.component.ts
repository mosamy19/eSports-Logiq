import { Component, isDevMode } from '@angular/core';

import {
  Router,
  // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  loading = true;

  page: string = "";

  prostredi: string = "";

  constructor(private router: Router) {
    if (isDevMode()) {
      this.prostredi = "test-class";
    } else {
      this.prostredi = "test-class";
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
      });
    }



  }





}
