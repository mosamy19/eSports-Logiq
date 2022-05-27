import { Component, OnInit } from '@angular/core';

import { Location } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';

import { DefaultService } from '../../services/default/default.service';



@Component({
  selector: 'tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  providers: [DefaultService]
})
export class TrackingComponent implements OnInit {

  tab: string = "prehled";

  logins_list: any = [];
  users_list: any = [];

  filter_user: string = "";

  loading: boolean = false;
  data_loaded: boolean = false;

  show_password_change_modal: boolean = false;
  password_change_user_id: number;
  password_change_new_password: string = "";
  password_change_new_password2: string = "";

  logs_list: any = [];
  filter_user_log: string = "";

  filter_type: string = "ALL";

  data_pages_percentil: any = [];
  data_pages_percentil_total_count: number = 0;

  filter_dateFrom: string = "";
  filter_dateTo: string = "";

  show_add_user_modal: boolean = false;

  new_user_email: string = "";
  new_user_password: string = "";

  //{"hraci":1,"spoluhraci":1,"formace":1,"analyzer":1,"brankari":1,"zapasy":1,"tymy":2,"gamelog":0}]
  constructor(private defaultService: DefaultService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.defaultService.getPagesPercent().subscribe(loaded_data => {
      this.data_pages_percentil = loaded_data[0];

      this.data_pages_percentil_total_count = this.data_pages_percentil["hraci"] + this.data_pages_percentil["formace"] + this.data_pages_percentil["spoluhraci"] + this.data_pages_percentil["analyzer"] + this.data_pages_percentil["brankari"] + this.data_pages_percentil["zapasy"] + this.data_pages_percentil["tymy"] + this.data_pages_percentil["gamelog"] + this.data_pages_percentil["trend"];
    });


    this.loadUsers();
  }

  showTab(tab: string) {
    this.tab = tab;
  }


  loadUsers() {
    this.loading = true;
    this.logins_list = [];
    this.defaultService.getUsers().subscribe(loaded_data => {
      this.users_list = loaded_data;
      this.loading = false;
    });
  }

  loadLogins() {
    this.data_loaded = false;
    this.loading = true;
    this.logins_list = [];
    this.defaultService.getLogins(this.filter_user).subscribe(loaded_data => {
      this.logins_list = loaded_data;
      this.loading = false;
      this.data_loaded = true;
    });
  }

  formatDate(date: string) {
    let date2 = new Date(date);
    var day = date2.getDate();
    var monthIndex = date2.getMonth() + 1;
    var year = date2.getFullYear();

    var hour = date2.getHours();
    var minute = date2.getMinutes();
    var minute_format = "";
    if (minute.toString().length == 1) {
      minute_format = '0' + minute;
    } else {
      minute_format = String(minute);
    }

    if (date == "") {
      return "";
    } else {
      return day + '.' + monthIndex + '.' + year + '   ' + hour + ':' + minute_format;
    }

  }


  toggleActiveUser(user_id: number, state: number) {
    this.defaultService.toggleActiveUser(user_id, state).subscribe(loaded_data => {
      this.loadUsers();
    });
  }

  toggleAdminUser(user_id: number, state: number) {
    this.defaultService.toggleAdminUser(user_id, state).subscribe(loaded_data => {
      this.loadUsers();
    });
  }


  toggleTestUser(user_id: number, state: number) {
    this.defaultService.toggleTestUser(user_id, state).subscribe(loaded_data => {
      this.loadUsers();
    });
  }

  openPasswordChangeModal(user_id: number) {
    this.password_change_user_id = user_id;
    this.show_password_change_modal = true;
  }

  closePasswordChangeModal() {
    this.show_password_change_modal = false;
  }

  passwordInput(event) {
    //alert(JSON.stringify(event));
  }

  changePassword() {
    if (this.password_change_new_password.length < 6) {
      alert("Heslo musí mít minimálně 6 znaků.")
    } else {
      if (this.password_change_new_password != this.password_change_new_password2) {
        alert("Zadaná hesla nejsou stejná");
      } else {
        this.defaultService.editUserPassword(this.password_change_user_id, this.password_change_new_password).subscribe(loaded_data => {
          alert("Heslo bylo změněno");
          this.closePasswordChangeModal();
        }, err => {
          alert("Při vytváření uživatele došlo k chybě.");
        });
      }
    }
  }

  loadLogs() {
    this.data_loaded = false;
    this.loading = true;
    this.logins_list = [];
    this.defaultService.getLogs(this.filter_user_log).subscribe(loaded_data => {
      this.logs_list = loaded_data;
      this.loading = false;
      this.data_loaded = true;
    });
  }

  getIpInfo(ip: string) {

  }

  downloadCSV(table:number) {
    let data = [];
    let head = ["Email"];

    data.push(head);
    console.log("Users list", this.users_list)

    this.users_list.forEach(user => {
      let data_row = [];
      data_row.push(user.user)
      data.push(data_row)
    });

    

    //data = JSON.parse(JSON.stringify(data));

    //console.log("Final data", data);
    
    this.defaultService.downloadXLS(data).subscribe(loaded_data => {
      window.location.assign(loaded_data["url"]);
    });
    //new Angular5Csv(withStrings, 'individual-stats', csv_options);
  }

  roundNumber(value: number) {
    return Math.round(value * 10) / 10;
  }


  addUserModal() {
    this.show_add_user_modal = true;
  }

  closeAddUserModal() {
    this.show_add_user_modal = false;
  }

  newUserEmailChange(event) {
    this.new_user_email = event;
  }

  newUserPasswordChange(event) {
    this.new_user_password = event;
  }

  addUser() {
    if (this.new_user_email == "" || this.new_user_password == "") {
      alert("E-mail ani heslo nesmí být prázdné.");
    } else {
      if (this.new_user_email.includes(" ") || this.new_user_password.includes(" ")) {
        alert("Heslo ani e-mail nesmí obsahovat mezeru.");
      } else {
        this.defaultService.addUser(this.new_user_email, this.new_user_password).subscribe(loaded_data => {
          alert("Uživatel byl přidán");
          this.show_add_user_modal = false;
          location.reload();
        });
      }
    }
  }



  dateChange(event: any) {
    this.defaultService.getPagesPercentWithDate(this.filter_dateFrom, this.filter_dateTo).subscribe(loaded_data => {
      this.data_pages_percentil = loaded_data[0];
      this.data_pages_percentil_total_count = this.data_pages_percentil["hraci"] + this.data_pages_percentil["formace"] + this.data_pages_percentil["spoluhraci"] + this.data_pages_percentil["analyzer"] + this.data_pages_percentil["brankari"] + this.data_pages_percentil["zapasy"] + this.data_pages_percentil["tymy"] + this.data_pages_percentil["gamelog"] + this.data_pages_percentil["trend"];
    });
  }
}


