import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [DefaultService]
})
export class ContactComponent implements OnInit {

  email: string = "";
  text: string = "";

  loading: boolean = false;

  sent: boolean = false;

  constructor(private defaultService: DefaultService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.checkLoggedTime();
  }

  sendEmail() {
    this.loading = true;

    let body = {
      email: this.email,
      text: this.text
    };

    if (this.ValidateEmail(this.email)) {
      this.defaultService.sendEmail(body).subscribe(loaded_data => {

        this.loading = false;
        this.email = "";
        this.text = "";
        this.sent = true;

      },
        err => {
          alert("Chyba.");
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    alert("Zadaný email je neplatný.")
    return (false)
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
