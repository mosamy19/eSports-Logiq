import { Component, OnInit, isDevMode, Input, OnChanges} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DefaultService } from '../../services/default/default.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { url } from 'inspector';

@Component({
    selector: 'nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    providers: [DefaultService, TranslatePipe, Input]

})
export class NavComponent implements OnInit, OnChanges {
    @Input() tab = "";

    route: string;

    prostredi: string = "";
    isDev: boolean = true;

    help: any = [];
    help_all: any = [];
    help_page: string = "";
    language: string = "cz";

    logged_user: any[];
    confirmed = false;

    user_admin: number = 0;

    show_news: boolean = true;

    show_help: boolean = false;

    show_password_change_modal: boolean = false;
    password_change_user_id: number;
    password_change_new_password: string = "";
    password_change_new_password2: string = "";


    constructor(private translate: TranslatePipe, private defaultService: DefaultService, private router: Router, private activatedRoute: ActivatedRoute) {
        if (isDevMode()) {
            this.prostredi = this.translate.transform("testovaci_verze");
            this.isDev = true;
        } else {
            this.prostredi = "";
            this.isDev = false;
        }

        this.route = this.router.url;
    }

    ngOnInit() {
        this.logged_user = JSON.parse(localStorage.getItem('logged_user'));
        this.user_admin = Number(this.logged_user[0]['admin']);
        
        
        this.setHelp()
    }

    ngOnChanges(){
       /*  this.help[this.tab]['tips'].forEach(element => {
            element['show'] = false;
        }); */
        this.show_news = true;
        this.confirmed = false;
        console.log("show_help", this.show_help)
        this.setHelp();
    }

    openHelp(){
        this.show_help = true;
    }

    logout() {
        this.trackLogout();
        this.defaultService.logout();
    }

    setHelp(){
        this.help_all = JSON.parse(localStorage.getItem('help'));
        this.language = localStorage.getItem('language');
        let route = this.route.substring(1).split("/")
        this.help_page = route[0]

        console.log("Help Page", this.help_page)
        this.help = this.help_all[this.language][this.help_page]
        console.log("help",this.help);
    }

    //TRACKING
    trackLogout() {
        let logged_user = JSON.parse(localStorage.getItem('logged_user'));
        this.defaultService.addEvent(logged_user[0].id, logged_user[0].user, "Uživatel se odhlásil.", 1).subscribe(loaded_data => {
        });
    }

    relogin() {
        let login_data = JSON.parse(localStorage.getItem("session"));
        let client_id_data = login_data["client_id"];
        let client_secret_data = login_data["client_secret"];

        this.defaultService.getToken({ grant_type: "client_credentials", client_id: client_id_data, client_secret: client_secret_data }).subscribe(token_data => {
            localStorage.removeItem('currentUser');
            localStorage.setItem('currentUser', JSON.stringify(token_data));
        });
    }


    checkLogin() {
        this.defaultService.isUserLogged().subscribe(loaded_data => {
            console.log("Uživatel je přihlášen.");
        },
            err => {
                console.log("Uživatel už není přihlášen...");
                this.relogin();
            }
        );
    }
    closeNews(tab:any){
        this.show_news = false;
        let all_help = JSON.parse(localStorage.getItem("help"))
        all_help[this.language][this.help_page][tab]['news']['show'] = false;
        if(this.confirmed){
            localStorage.setItem('help', JSON.stringify(all_help));
        }
    }

    urlContains(url: string) {
        return this.route.includes(url);
    }


    openPasswordChangeModal() {
        this.password_change_user_id = this.logged_user[0]['id'];
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
                    alert("Heslo bylo změněno. Proběhne odlášení. Prosím přihlašte se znovu.");
                    this.logout();
                    this.closePasswordChangeModal();
                });
            }
        }
    }

    getMain(header: boolean){
        if(header){
            return this.help[this.tab]['main']['header'];
        }else{
            return this.help[this.tab]['main']['text'];
        }
    }

    getTips(data: any, header: boolean){
        if(header){
            return data.header
        }else{
            return data.text
        }
    }

    getFunctions(data: any, header: boolean){
        if(header){
            return data.header
        }else{
            return data.text
        }
    }
}