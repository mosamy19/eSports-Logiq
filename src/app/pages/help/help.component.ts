import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  providers: [DefaultService]
})
export class HelpComponent implements OnInit {

  napoveda: number;

  constructor(private defaultService: DefaultService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.open(1);

    this.checkLoggedTime();
  }

  open(item: number) {
    this.napoveda = item;
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
