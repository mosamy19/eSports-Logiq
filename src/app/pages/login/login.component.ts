import { Component, OnInit, isDevMode } from "@angular/core";
import { Router } from "@angular/router";
import { DefaultService } from "../../services/default/default.service";
import { Md5 } from "ts-md5/dist/md5";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [DefaultService],
  host: {
    "(document:keypress)": "handleKeyboardEvent($event)",
  },
})
export class LoginComponent implements OnInit {
  client_id: string;
  client_secret: string;

  user_email: string;
  user_password: string;

  error: boolean = false;

  user_exists: boolean = false;

  user_location: string = "CZ";

  language: string = "cz";

  prostredi: string = "";

  boolProd: boolean = true;

  public innerWidth: any;
  public innerHeight: any;

  constructor(private router: Router, private defaultService: DefaultService) {
    if (isDevMode()) {
      this.prostredi = "(TEST)";
    } else {
      this.prostredi = "";
    }

    if (isDevMode()) {
      this.boolProd = true;
    } else {
      this.boolProd = false;
    }

    const test = JSON.parse(localStorage.getItem("help"));
    localStorage.clear();

    /* this.defaultService.getHelp().subscribe(loaded_data => {
      localStorage.setItem('help', JSON.stringify(loaded_data));
    }); */

    if (test == null) {
      this.defaultService.getHelp().subscribe((loaded_data) => {
        localStorage.setItem("help", JSON.stringify(loaded_data));
      });
    } else {
      localStorage.setItem("help", JSON.stringify(test));
    }
    //localStorage.setItem('help', test);

    if (this.defaultService.token != null) {
      this.router.navigate(["/dashboard"]);
    }
  }

  ngOnInit() {
    localStorage.setItem("language", "cz");
    this.user_location = "CZ";

    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.defaultService.getUserLocation().subscribe((loaded_data) => {
      this.user_location = loaded_data["countryCode"];
      console.log("Country " + this.user_location);
    });
  }

  auth() {
    let resolution = screen.width + "x" + screen.height;

    this.defaultService
      .loginUser(this.user_email, this.user_password, resolution)
      .subscribe((loaded_data) => {
        if (loaded_data.length == 0) {
          this.error = true;
        } else {
          if (this.boolProd && loaded_data[0]["enabled_test"] == "0") {
            alert("Pro přihlášení nemáte patřičná oprávnění.");
          } else {
            localStorage.setItem("logged_user", JSON.stringify(loaded_data));
            if (loaded_data.length > 0) {
              this.client_id = "john";
              this.client_secret = "doe";
              this.error = false;
              this.defaultService
                .getToken({
                  grant_type: "client_credentials",
                  client_id: this.client_id,
                  client_secret: this.client_secret,
                })
                .subscribe(
                  (token_data) => {
                    localStorage.setItem(
                      "currentUser",
                      JSON.stringify(token_data)
                    );
                    localStorage.setItem("logged_date", String(new Date()));
                    localStorage.setItem(
                      "session",
                      JSON.stringify({
                        grant_type: "client_credentials",
                        client_id: this.client_id,
                        client_secret: this.client_secret,
                      })
                    );
                    this.router.navigate(["/dashboard"]);
                  },
                  (err) => {
                    this.error = true;
                  }
                );
              this.defaultService
                .getTokenTest({
                  grant_type: "client_credentials",
                  client_id: this.client_id,
                  client_secret: this.client_secret,
                })
                .subscribe(
                  (token_data) => {
                    localStorage.setItem(
                      "currentUser_test",
                      JSON.stringify(token_data)
                    );
                    localStorage.setItem(
                      "logged_date_test",
                      String(new Date())
                    );
                    localStorage.setItem(
                      "session_test",
                      JSON.stringify({
                        grant_type: "client_credentials",
                        client_id: this.client_id,
                        client_secret: this.client_secret,
                      })
                    );
                    this.router.navigate(["/dashboard"]);
                  },
                  (err) => {
                    this.error = true;
                  }
                );
            } else {
              this.error = true;
            }
          }
        }
      });

    /*
    this.users.forEach((item, index) => {
      if (item["user"] == this.user_email && item["pass"] == Md5.hashStr(this.user_password) && item["active"] == true) {
        this.user_exists = true;
        localStorage.setItem('logged_user', JSON.stringify(loaded_data));
      }
    });
    */
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      this.auth();
    }
  }

  changeLanguage() {
    localStorage.setItem("language", this.language);
  }
}
