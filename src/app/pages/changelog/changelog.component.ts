import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';

@Component({
  selector: 'changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.scss'],
  providers: [DefaultService]
})
export class ChangelogComponent implements OnInit {

  constructor(private defaultService: DefaultService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.checkLoggedTime();
  }

  checkLoggedTime() {
    let dt1 = new Date(localStorage.getItem('logged_date'));
    let dt2 = new Date();
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);

    if (Math.abs(Math.round(diff)) > 6) {
      alert("Platnost relace přihlášení vypršela. Přihlaste se znovu.");
      this.defaultService.logout();
    }
  }

}
