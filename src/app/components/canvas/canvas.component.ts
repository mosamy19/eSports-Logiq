import { Component, OnInit, EventEmitter, Output, Input, isDevMode, ChangeDetectorRef, ChangeDetectionStrategy, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormatParametersService } from '../../services/format-parameters/format-parameters.service';
import { cloneDeep } from "lodash"
import { type } from 'os';

import { DefaultService } from '../../services/default/default.service';



@Component({
    selector: 'settings-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,


})
export class CanvasComponent implements OnInit {
    @Output() toggleTableSettings_ = new EventEmitter<string>();
    @Output() openHelp = new EventEmitter<any>()

    tab: string = "individualni-data";

    checkbox_pocet: boolean = true;
    checkbox_60: boolean = true;
    checkbox_percent: boolean = true;

    count_of_selected: number = 0;
    count_of_selected_max: number = 16;

    dataSets: any = [];

    //FILTERS
    filter_produktivita: number = 0;
    filter_vsechny_strely_corsi: number = 0;
    filter_nezblokovane_strely_fenwick: number = 0;
    filter_strely_na_branku: number = 0;
    filter_vsechny_strely_ze_slotu_sance: number = 0;
    filter_vsechny_strely_na_branku_ze_slotu: number = 0;
    filter_starty_v_pasmech: number = 0;
    filter_vhazovani: number = 0;
    filter_vsechny_strely_corsi_onice: number = 0;
    filter_nezblokovane_strely_fenwick_onice: number = 0;
    filter_strely_na_branku_onice: number = 0;
    filter_vsechny_strely_ze_slotu_sance_onice: number = 0;
    filter_vsechny_strely_na_branku_ze_slotu_onice: number = 0;
    filter_goly: number = 0;
    filter_goly_ze_slotu: number = 0;
    filter_prihravkydoslotu: number = 0;
    filter_kontrolovane_vystupy_z_pasma: number = 0;
    filter_kontrolovane_vstupy_do_pasma: number = 0;
    filter_prihravkynastrely: number = 0;
    filter_typ_strely: number = 0;
    filter_ziskane_pocetni_vyhody: number = 0;
    filter_prihravkydoslotu_onice: number = 0;
    filter_prihravkynastrely_onice: number = 0;
    filter_prihravkynastrelyzeslotu_onice: number = 0;
    filter_drzenipuku_onice: number = 0;
    filter_kontrolovanevstupydopasma_onice: number = 0;
    filter_kontrolovanevystupyzpasma_onice: number = 0;

    types: any = [];
    types_onIce: any = [];
    selected_data: any = [];
    selected_data_onice:any = [];
    selected_data_onice_rel:any = [];

    selected_action_type: any = [];
    selected_shot_type: any = [];
    selected_shot_danger: any = [];
    selected_shot_location: any = [];
    selected_net_location: string = "";
    selected_attributes: any = [];
    selected_attribute: string;
    selected_attribute_name: string = "";
    selected_types: any = [];
    selected_puck_gain: any = [];
    selected_enter_exit_type: any = [];
    selected_enter_exit_location: any = [];

    min_value: number;

    show_minimal_filter = false;

    predefined_sets = [];

    filter_select: any = {};

    action_type: any = [
        { "id": 0, "name": "Všechny", "type": "", "prefix": "", "prefix_type": "" },
        { "id": 1, "name": "Forček", "type": "F", "prefix": "F_", "prefix_type": "f" },
        { "id": 2, "name": "Rychlý útok", "type": "R", "prefix": "R_", "prefix_type": "r" },
        { "id": 3, "name": "Přečíslení", "type": "O", "prefix": "O_", "prefix_type": "o" },
        { "id": 4, "name": "Dlouhý útok", "type": "L", "prefix": "L_", "prefix_type": "l" },
    ];

    vystupy_z_pasma_types: any = [
        { "id": 0, "name": "Typ akce - vše", "type": "", "prefix": "", "prefix_type": "" },
        { "id": 1, "name": "Pod tlakem", "type": "UP", "prefix": "UP_", "prefix_type": "up" },
        { "id": 2, "name": "Bez tlaku", "type": "NP", "prefix": "NP_", "prefix_type": "np" },
    ];

    action_types_test: any = [
        { "id": 0, "name": "Typ akce - vše", "type": "", "prefix": "", "prefix_type": "" },
        { "id": 1, "name": "Rychlý útok", "type": "R", "prefix": "R_", "prefix_type": "r" },
        { "id": 2, "name": "Přečíslení", "type": "O", "prefix": "O_", "prefix_type": "o" },
    ];

    vystupy_z_pasma_types_test: any = [
        { "id": 0, "name": "Typ akce - vše", "type": "", "prefix": "", "prefix_type": "" },
        { "id": 1, "name": "Pod tlakem", "type": "UP", "prefix": "UP_", "prefix_type": "up" },
        { "id": 2, "name": "Bez tlaku", "type": "NP", "prefix": "NP_", "prefix_type": "np" },
    ];

    parameters: any = [
        {
            "type": "action_type",
            "name": "Typy akce",
            "name_en": "Action types",
            "types":[
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Forček", "name_en": "Forcheck", "type": "F.", "prefix": "F.", "prefix_type": "f." },
                { "id": 2, "name": "Rychlý útok", "name_en": "Rush", "type": "R.", "prefix": "R.", "prefix_type": "r." },
                { "id": 3, "name": "Dlouhý útok", "name_en": "Cycle", "type": "L.", "prefix": "L.", "prefix_type": "l." },
                { "id": 4, "name": "Přečíslení", "name_en": "Odd-man rush", "type": "O.", "prefix": "O.", "prefix_type": "o." },
                { "id": 5, "name": "Po vhazování", "name_en": "From faceoff", "type": "A.", "prefix": "A.", "prefix_type": "a." }
            ]
        },
        {
            "type": "shot_type",
            "name": "Typy střel",
            "name_en": "Shot types",
            "types": [
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Z první", "name_en": "One-timer", "type": "1T.", "prefix": "1T.", "prefix_type": "1t." },
                { "id": 2, "name": "Dorážky", "name_en": "Rebounds", "type": "REB.", "prefix": "REB.", "prefix_type": "reb." }

            ]
        },
        {
            "type": "shot_danger",
            "name": "Nebezpečnost střel",
            "name_en": "Shots danger",
            "types": [
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Vysoká", "name_en": "Hight", "type": "HD.", "prefix": "HD_", "prefix_type": "hd." },
                { "id": 2, "name": "Střední", "name_en": "Medium", "type": "MD.", "prefix": "MD_", "prefix_type": "md." },
                { "id": 3, "name": "Nízká", "name_en": "Low", "type": "LD.", "prefix": "LD_", "prefix_type": "ld." }
            ]
        },
        {
            "type": "shot_location",
            "name": "Lokace střel",
            "name_en": "Shot locations",
            "types": [
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Slot", "name_en": "Slot", "type": "s", "prefix": "s_", "prefix_type": "s" },
                { "id": 2, "name": "Vnitřní slot", "name_en": "Inner slot", "type": "ss", "prefix": "ss_", "prefix_type": "ss" }
            ]
        },
        {
            "type": "puck_gain_type",
            "name": "Typ zisku puku",
            "name_en": "Puck gain type",
            "types": [
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Zachycením/blokem", "name_en": "Capture/block", "type": "INT.", "prefix": "int_", "prefix_type": "int." },
                { "id": 2, "name": "V souboji", "name_en": "In fight", "type": "B.", "prefix": "b.", "prefix_type": "b." }
            ]
        },
        {
            "type": "entry_type",
            "name": "Typ vstupu",
            "name_en": "Entry type",
            "types": [
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Zavezením", "name_en": "Carry-in", "type": "C.", "prefix": "c.", "prefix_type": "c." },
                { "id": 2, "name": "Přihrávkou", "name_en": "Pass", "type": "P.", "prefix": "p.", "prefix_type": "p." }
            ]
        },
        {
            "type": "exit_type",
            "name": "Typ výstupu",
            "name_en": "Exit type",
            "types": [
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Vyvezením", "name_en": "Carry-out", "type": "C.", "prefix": "c.", "prefix_type": "c." },
                { "id": 2, "name": "Přihrávkou", "name_en": "Pass", "type": "P.", "prefix": "p.", "prefix_type": "p." },
                { "id": 3, "name": "Přihrávkou za červenou čárou", "name_en": "Pass behind the red line", "type": "stP.", "prefix": "stp.", "prefix_type": "stp." }
            ]
        },
        {
            "type": "enter_exit_location",
            "name": "Lokace vstupu/výstupu",
            "name_en": "Enter/Exit location",
            "types": [
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Vlevo", "name_en": "Left", "type": "Le.", "prefix": "le.", "prefix_type": "le." },
                { "id": 2, "name": "Uprostřed", "name_en": "Middle", "type": "Mi.", "prefix": "mi.", "prefix_type": "mi." },
                { "id": 3, "name": "Vpravo", "name_en": "Right", "type": "Ri.", "prefix": "ri.", "prefix_type": "ri." }

            ]
        },
    ]

    allowed_parameters:any = []

    show_net: boolean = false;

    boolProd: boolean = true;

    loaded_attributes: any = [];
    individual_attributes: any = [];
    onice_attributes: any = [];
    teams_attributes: any = [];
    goalkeepers_attributes: any = [];

    save_select_visible: boolean = false;
    metric_select_visible: boolean = false;

    @Input() table_settings_data: any;
    @Input() canvas_type_setting: string = "normal";
    @Input() enable_min_value: boolean = false;
    @Input() page: string;

    @Input() enabled_types: string = "";
    enabled_types_list: any[] = [];

    @Output() apply_selected_attributes: EventEmitter<string> = new EventEmitter<string>();
    @Output() apply_selected_attributes_goalkeepers: EventEmitter<string> = new EventEmitter<string>();
    @Output() apply_selected_attributes_shoda: EventEmitter<string> = new EventEmitter<string>();
    @Output() apply_selected_attributes_rekordy: EventEmitter<string> = new EventEmitter<string>();
    @Output() set_min_attribute_value: EventEmitter<number> = new EventEmitter<number>();
    @Output() set_min_attribute: EventEmitter<string> = new EventEmitter<string>();


    selected_name: string = "";
    saved: any = [];

    user_id: number = 0;

    existSaved_bool: boolean = false;

    language: string = 'cz'


    constructor(private cd: ChangeDetectorRef,private formatParametersService: FormatParametersService, private defaultService: DefaultService) {

        this.user_id = JSON.parse(localStorage.getItem('logged_user'))[0]["id"];
        this.language = localStorage.getItem("language");
        //console.log("Language",this.language);

        this.selected_action_type = { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" };
        this.selected_shot_type = { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" };
        this.selected_shot_danger = { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" };
        this.selected_shot_location = { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" };
        this.selected_puck_gain = { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" };
        this.selected_enter_exit_type = { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" };
        this.selected_enter_exit_location = { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" };

        if(this.language == "en"){
            this.action_type = [
                { "id": 0, "name": "All attack types", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Rush", "type": "R", "prefix": "R_", "prefix_type": "r_" },
                { "id": 2, "name": "Odd-man rush", "type": "O", "prefix": "O_", "prefix_type": "o_" },
                { "id": 3, "name": "Forecheck", "type": "F", "prefix": "F_", "prefix_type": "f_" },
            ];
        
            this.vystupy_z_pasma_types = [
                { "id": 0, "name": "All exit types", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Under pressure", "type": "UP", "prefix": "UP_", "prefix_type": "up_" },
                { "id": 2, "name": "No pressure", "type": "NP", "prefix": "NP_", "prefix_type": "np_" },
            ];
        
            this.action_types_test = [
                { "id": 0, "name": " All attack types ", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Rush", "type": "R", "prefix": "R_", "prefix_type": "r_" },
                { "id": 2, "name": "Odd-man rush", "type": "O", "prefix": "O_", "prefix_type": "o_" },
            ];
        
            this.vystupy_z_pasma_types_test = [
                { "id": 0, "name": "All exit types", "type": "", "prefix": "", "prefix_type": "" },
                { "id": 1, "name": "Under pressure", "type": "UP", "prefix": "UP_", "prefix_type": "up_" },
                { "id": 2, "name": "No pressure", "type": "NP", "prefix": "NP_", "prefix_type": "np_" },
            ];
        }

        this.recount_empty_selects();

        if (isDevMode()) {
            this.boolProd = true;
        } else {
            this.boolProd = false;
        }

        this.loaded_attributes = JSON.parse(localStorage.getItem('loaded_attributes'));
        //console.log("Loaded Attributes:", this.loaded_attributes);

        
        
        //let dataValues_individual = [];
        
        this.individual_attributes.forEach(element => {
           // element.name = element.name_en
        });

        //let dataValues_onice = [];
        
        this.onice_attributes.forEach(element => {
            //element.name = element.name_en
        });

        let dataValues_attribute = [];
        /* for (let key3 in this.loaded_attributes["teamsData"][0]) {
            this.teams_attributes.push(this.loaded_attributes["teamsData"][0][key3][0]);
            this.filter_select[this.loaded_attributes["teamsData"][0][key3][0]['type']] = 0;
        }
        this.teams_attributes.forEach(element => {
            element.name = element.name_en
        });

        for (let key3 in this.loaded_attributes["goalkeepersData"][0]) {
            this.goalkeepers_attributes.push(this.loaded_attributes["goalkeepersData"][0][key3][0]);
            this.filter_select[this.loaded_attributes["goalkeepersData"][0][key3][0]['type']] = 0;
        }
        this.goalkeepers_attributes.forEach(element => {
            element.name = element.name_en
        }); */

        /* this.loaded_attributes["individual"][0]['puckWonOrLostToShot'][0]['type'] = 1
        this.filter_select[this.loaded_attributes["individual"][0]['puckWonOrLostToShot'][0]['type']] = 1

        this.loaded_attributes["teamsData"][0]['puckWonOrLostToShot'][0]['type'] = 1
        this.filter_select[this.loaded_attributes["teamsData"][0]['puckWonOrLostToShot'][0]['type']] = 1 */

    }

    ngOnInit() {
        //console.log("table_settings_data",this.table_settings_data)
        console.log("Page:", this.page)
        if(this.page == "teams"){
            for (let key in this.loaded_attributes["teams"][0]["individual"][0]) {
                this.types.push(this.loaded_attributes["teams"][0]["individual"][0][key][0]);
                this.individual_attributes.push(this.loaded_attributes["teams"][0]["individual"][0][key][0]);
                this.filter_select[this.loaded_attributes["teams"][0]["individual"][0][key][0]['type']] = 0;
            }
            /* for (let key2 in this.loaded_attributes["teams"][0]["onIce"][0]) {
                this.onice_attributes.push(this.loaded_attributes["teams"][0]["onIce"][0][key2][0]);
                this.filter_select[this.loaded_attributes["teams"][0]["onIce"][0][key2][0]['type']] = 0;
            } */
            this.onice_attributes = [];
        }else if(this.page == "players"){
            for (let key in this.loaded_attributes["players"][0]["individual"][0]) {
                this.types.push(this.loaded_attributes["players"][0]["individual"][0][key][0]);
                this.individual_attributes.push(this.loaded_attributes["players"][0]["individual"][0][key][0]);
                this.filter_select[this.loaded_attributes["players"][0]["individual"][0][key][0]['type']] = 0;
            }
            for (let key2 in this.loaded_attributes["players"][0]["onIce"][0]) {
                this.onice_attributes.push(this.loaded_attributes["players"][0]["onIce"][0][key2][0]);
                this.filter_select[this.loaded_attributes["players"][0]["onIce"][0][key2][0]['type']] = 0;
                this.types_onIce.push(this.loaded_attributes["players"][0]["onIce"][0][key2][0]);
            }
        }else if(this.page == "goalkeepers"){
            for (let key in this.loaded_attributes["goalkeepers"][0]["individual"][0]) {
                this.types.push(this.loaded_attributes["goalkeepers"][0]["individual"][0][key][0]);
                this.individual_attributes.push(this.loaded_attributes["goalkeepers"][0]["individual"][0][key][0]);
                this.filter_select[this.loaded_attributes["goalkeepers"][0]["individual"][0][key][0]['type']] = 0;
            }
            this.onice_attributes = [];
        }

        console.log("types_old",this.types)
        this.types_onIce.forEach(onIce => {
            let push = true;
            this.types.forEach(individual => {
                if(onIce.name == individual.name){
                    push = false;
                }
            });
            if(push){
                this.types.push(onIce);
            }
        });
        console.log("types_new",this.types)
        console.log("types_onIce",this.types_onIce)
        console.log("onIce attributes", this.onice_attributes)
        console.log("attributes", this.individual_attributes)
        console.log("types", this.types[0])
        console.log("__________________________")
        //console.log("page",this.page)

        if (this.canvas_type_setting == "shoda") {
            this.count_of_selected_max = 16;
        }

        this.selected_attributes = this.table_settings_data;
        

        this.defaultService.getAttributesUserList(this.user_id).subscribe(loaded_data => {
            console.clear()
            this.saved = loaded_data;
            console.log("Saved", this.saved)
            let loaded_datasest = JSON.parse(localStorage.getItem("defined_sets"));
            /* loaded_datasest['players'].forEach((element,index) => {
                let sets = {
                    "name": Object.keys(element)[0],
                    "data": [],
                    "id": index
                }
                for (let key in element){
                    element[key].forEach(element2 => {
                    sets.data.push(element2.type);
                    });
                }
                this.saved.push(sets)
            });
            loaded_datasest['goalkeepers'].forEach((element,index) => {
                let sets = {
                    "name": Object.keys(element)[0],
                    "data": [],
                    "id": index
                }
                for (let key in element){
                    element[key].forEach(element2 => {
                    sets.data.push(element2.type);
                    });
                }
                this.saved.push(sets)
            }); */
            loaded_datasest[this.page].forEach((element,index) => {
                let sets = {
                    "name": Object.keys(element)[0],
                    "data": [],
                    "id": index
                }
                for (let key in element){
                    element[key].forEach(element2 => {
                    sets.data.push(element2.type);
                    });
                }
                this.predefined_sets.push(sets)
            });
            console.log("TAB", this.tab)
            this.predefined_sets = this.formatParametersService.formatParameters(this.predefined_sets,this.tab)
            this.saved = this.formatParametersService.formatParameters(this.saved,this.tab)

            this.existSaved();
            this.cd.detectChanges();
            
        },
            err => {
            }
        );

        this.loadEnabledAttributesTypes();

        this.onTypeSelect(this.types[0]);

        this.cd.detectChanges();
    }

    isEnabled(attribute){
        
        if(this.selected_types.length == 0){
            return attribute.default_data;
        }else{
            let enabled = true;
            this.selected_types.forEach(element => {
                if(attribute[element] == false){
                    enabled = false;
                }
            });
            return enabled;
        }
    }

    openHelpPage(){
        this.openHelp.emit()
    }

    setMetricValue(attribute:any){
        this.selected_attribute = attribute.type;
        this.selected_attribute_name = attribute.name;
        this.metric_select_visible = false;
        //console.log("selected attribute", this.selected_attribute)
    }

    showParameter(data_type:any){
        /* console.log("selected_data",this.selected_data);
        console.log("data_type",data_type); */
    }

    selectGoalZone( location: string){
        if(this.selected_net_location == location){
            this.selected_net_location = "";
        }else{
            
            this.selected_net_location = location;
            this.selected_types.push(this.selected_net_location)
        }
    }

    selectTypes(type:any, type2:any){
        //console.log("select LEnght", this.selected_types.length)
        
        if(this.selected_types.length >= 2 || this.selected_types.length == 2){
            if(this.selected_types[0] == "action_type" && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_action_type = 
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" }
                this.selected_types.splice(0,1)

            }else if(this.selected_types[0] == "shot_type" && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_shot_type = 
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" }
                this.selected_types.splice(0,1)

            }else if(this.selected_types[0] == "shot_danger" && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_shot_danger = 
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" }
                this.selected_types.splice(0,1)

            }else if(this.selected_types[0] == "puck_gain_type" && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_puck_gain = 
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" }
                this.selected_types.splice(0,1)

            }else if(this.selected_types[0] == "entry_type" && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_enter_exit_type = 
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" }
                this.selected_types.splice(0,1)

            }else if(this.selected_types[0] == "exit_type" && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_enter_exit_type = 
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" }
                this.selected_types.splice(0,1)

            }else if(this.selected_types[0] == "enter_exit_location" && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_enter_exit_location = 
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" }
                this.selected_types.splice(0,1)
            }else if(this.selected_types[0] == "shot_location" && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_shot_location = 
                { "id": 0, "name": "Všechny", "name_en": "All", "type": "", "prefix": "", "prefix_type": "" }
                this.selected_types.splice(0,1)
            }else if(this.selected_types[0] == "br." && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_net_location = "";
                this.selected_types.splice(0,1)
            }else if(this.selected_types[0] == "ce." && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_net_location = "";
                this.selected_types.splice(0,1)
            }else if(this.selected_types[0] == "ur." && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_net_location = "";
                this.selected_types.splice(0,1)
            }else if(this.selected_types[0] == "fh." && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_net_location = "";
                this.selected_types.splice(0,1)
            }else if(this.selected_types[0] == "ul." && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_net_location = "";
                this.selected_types.splice(0,1)
            }else if(this.selected_types[0] == "bl." && this.selected_types[0] != type.type && this.selected_types[1] != type.type){
                this.selected_net_location = "";
                this.selected_types.splice(0,1)
            }
        }

        if(type.type == "action_type"){
            this.selected_action_type = type2;
            if(this.selected_types[0] != "action_type" && this.selected_types[1] != "action_type"){
                this.selected_types.push("action_type")
            }

        }else if(type.type == "shot_type"){
            this.selected_shot_type = type2;
            if(this.selected_types[0] != "shot_type" && this.selected_types[1] != "shot_type"){
                this.selected_types.push("shot_type")
            }

        }else if(type.type == "shot_danger"){
            this.selected_shot_danger = type2;
            if(this.selected_types[0] != "shot_danger" && this.selected_types[1] != "shot_danger"){
                this.selected_types.push("shot_danger")
            }
                        
        }else if(type.type == "puck_gain_type"){
            this.selected_puck_gain = type2;
            if(this.selected_types[0] != "puck_gain_type" && this.selected_types[1] != "puck_gain_type"){
                this.selected_types.push("puck_gain_type")
            }

        }else if(type.type == "entry_type"){
            this.selected_enter_exit_type = type2;
            if(this.selected_types[0] != "entry_type" && this.selected_types[1] != "entry_type"){
                this.selected_types.push("entry_type")
            }

        }else if(type.type == "exit_type"){
            this.selected_enter_exit_type = type2;
            if(this.selected_types[0] != "exit_type" && this.selected_types[1] != "exit_type"){
                this.selected_types.push("exit_type")
            }

        }else if(type.type == "enter_exit_location"){
            this.selected_enter_exit_location = type2;
            if(this.selected_types[0] != "enter_exit_location" && this.selected_types[1] != "enter_exit_location"){
                this.selected_types.push("enter_exit_location")
            }

        }else if(type.type == "shot_location"){
            this.selected_shot_location = type2;
            if(this.selected_types[0] != "shot_location" && this.selected_types[1] != "shot_location"){
                this.selected_types.push("shot_location")
            }

        }else if(type.type == "br."){
            this.selected_shot_location = type2;
            if(this.selected_types[0] != "br." && this.selected_types[1] != "br."){
                this.selected_types.push("br.")
            }

        }else if(type.type == "ce."){
            this.selected_shot_location = type2;
            if(this.selected_types[0] != "ce." && this.selected_types[1] != "ce."){
                this.selected_types.push("ce.")
            }

        }else if(type.type == "ur."){
            this.selected_shot_location = type2;
            if(this.selected_types[0] != "ur." && this.selected_types[1] != "ur."){
                this.selected_types.push("ur.")
            }

        }else if(type.type == "fh."){
            this.selected_shot_location = type2;
            if(this.selected_types[0] != "fh." && this.selected_types[1] != "fh."){
                this.selected_types.push("fh.")
            }

        }else if(type.type == "ul."){
            this.selected_shot_location = type2;
            if(this.selected_types[0] != "ul." && this.selected_types[1] != "ul."){
                this.selected_types.push("ul.")
            }

        }else if(type.type == "bl."){
            this.selected_shot_location = type2;
            if(this.selected_types[0] != "bl." && this.selected_types[1] != "bl."){
                this.selected_types.push("bl.")
            }

        }

        if(type2.name == "Všechny"){
            this.selected_types.forEach((element,index) => {
                if(element == type.type){
                    this.selected_types.splice(index,1)
                }
            });
        }
        //console.log("select LEnght2", this.selected_types.length)
        //console.log("Selected Types", this.selected_types)

    }

    clearSelected(){
        this.selected_attributes = [];
    }

    removeSelected(index){
        this.selected_attributes.splice(index,1);
    }

    getAttributeName(attribute_raw: string){
        let attribute = cloneDeep(attribute_raw);
        let atr = 
            this.selected_action_type.type + 
            this.selected_net_location.toUpperCase() + 
            this.selected_shot_type.type +
            this.selected_shot_danger.type +
            this.selected_puck_gain.type + 
            this.selected_enter_exit_type.type + 
            this.selected_enter_exit_location.type + 
            this.selected_shot_location.type + 
            attribute

        return atr
    }

    checkActive(type:any, type2:any){
        
        if(type.type == "action_type"){
            return this.selected_action_type.name == type2.name ? true : false;
            
        }else if(type.type == "shot_type"){
            return this.selected_shot_type.name == type2.name ? true : false;

        }else if(type.type == "shot_danger"){
            return this.selected_shot_danger.name == type2.name ? true : false;

        }else if(type.type == "puck_gain_type"){
            return this.selected_puck_gain.name == type2.name ? true : false;
 
        }else if(type.type == "entry_type"){
            return this.selected_enter_exit_type.name == type2.name ? true : false;
 
        }else if(type.type == "exit_type"){
            return this.selected_enter_exit_type.name == type2.name ? true : false;
 
        }else if(type.type == "enter_exit_location"){
            return this.selected_enter_exit_location.name == type2.name ? true : false;
 
        }else if(type.type == "shot_location"){
            return this.selected_shot_location.name == type2.name ? true : false;
 
        }
    }

    getColor(attribute_raw: any){
        let attribute = cloneDeep(attribute_raw);
        let isIn = false;
        let color = "";

        attribute.type = 
            this.selected_action_type.prefix_type.toLowerCase() + 
            this.selected_net_location + 
            this.selected_shot_type.prefix_type.toLowerCase() +
            this.selected_shot_danger.prefix_type.toLowerCase() +
            this.selected_puck_gain.prefix_type.toLowerCase() + 
            this.selected_enter_exit_type.prefix_type.toLowerCase() +
            this.selected_enter_exit_location.prefix_type.toLowerCase() + 
            this.selected_shot_location.prefix_type.toLowerCase() + 
            attribute.type

        this.selected_attributes.forEach(element => {
            if(element.type == attribute.type){
                isIn = true;
                if(attribute.colour == "red"){
                    color = "active-red";
                }else if(attribute.colour == "green"){
                    color = "active-green";
                }else if(attribute.colour == "white"){
                    color = "active-white";
                }
            }
        });


        if(!isIn){
            return attribute.colour;
        }else{
            return color
        }
        
    }

    getSelectedColor(attribute: any){
        let color = "";

        if(attribute.colour == "red"){
            color = "active-red";
        }else if(attribute.colour == "green"){
            color = "active-green";
        }

        return color;
    }

    onSelectAttribute(attribute_raw:any,type: string){
        let attribute = cloneDeep(attribute_raw);
        console.log("Attribute raw", attribute_raw);
        console.log("Type", type);
        attribute.origin = attribute.type;

        attribute.name = 
            this.selected_action_type.type + 
            this.selected_net_location.toUpperCase() + 
            this.selected_shot_type.type +
            this.selected_shot_danger.type +
            this.selected_puck_gain.type + 
            this.selected_enter_exit_type.type +
            this.selected_enter_exit_location.type + 
            this.selected_shot_location.type + 
            attribute.name

        attribute.type = 
            this.selected_action_type.prefix_type.toLowerCase() + 
            this.selected_net_location + 
            this.selected_shot_type.prefix_type.toLowerCase() +
            this.selected_shot_danger.prefix_type.toLowerCase() +
            this.selected_puck_gain.prefix_type.toLowerCase() + 
            this.selected_enter_exit_type.prefix_type.toLowerCase() +
            this.selected_enter_exit_location.prefix_type.toLowerCase() +  
            this.selected_shot_location.prefix_type.toLowerCase() +
            attribute.type

        attribute.parameters = [];

        if(this.selected_action_type.type != ""){
            if(this.language == "en"){
                attribute.parameters.push("Action type: " + this.selected_action_type.name_en);
            }else if (this.language == "cz"){
                attribute.parameters.push("Typ akce: " + this.selected_action_type.name);
            }
        }
        if(this.selected_shot_type.type != ""){
            if(this.language == "en"){
                attribute.parameters.push("Shot type: " + this.selected_shot_type.name_en);
            }else if(this.language == "cz"){
                attribute.parameters.push("Typ střel: " + this.selected_shot_type.name);
            }
        }
        if(this.selected_shot_danger.type != ""){
            if(this.language == "en"){
                attribute.parameters.push("Shot danger: " + this.selected_shot_danger.name_en);
            }else if(this.language == "cz"){
                attribute.parameters.push("Nebezpečnost střel: " + this.selected_shot_danger.name);
            }
        }
        if(this.selected_shot_location.type != ""){
            if(this.language == "en"){
                attribute.parameters.push("Shot location: " + this.selected_shot_location.name_en);
            }else if(this.language == "cz"){
                attribute.parameters.push("Lokace střel: " + this.selected_shot_location.name);
            }
        }
        if(this.selected_puck_gain.type != ""){
            if(this.language == "en"){
                attribute.parameters.push("Puck gain type: " + this.selected_puck_gain.name_en);
            }else if(this.language == "cz"){
                attribute.parameters.push("Typ zisku puku: " + this.selected_puck_gain.name);
            }
        }
        if(this.selected_enter_exit_type.type != ""){
            if(this.language == "en"){
                attribute.parameters.push("Enter/exit type: " + this.selected_enter_exit_type.name_en);
            }else if(this.language == "cz"){
                attribute.parameters.push("Typ vstupu/výstupu: " + this.selected_enter_exit_type.name);
            }
        }
        if(this.selected_enter_exit_location.type != ""){
            if(this.language == "en"){
                attribute.parameters.push("Enter/exit location: " + this.selected_enter_exit_location.name_en);
            }else if(this.language == "cz"){
                attribute.parameters.push("Lokace vstupu/výstupu: " + this.selected_enter_exit_location.name);
            }
        }
        if(this.selected_net_location != ""){
            if(this.language == "en"){
                attribute.parameters.push("Net location: " + this.selected_net_location);
            }else if(this.language == "cz"){
                attribute.parameters.push("lokace branky: " + this.selected_net_location);
            }
        }

        

        if(type == "individual"){
            attribute["onIce"] = false;
        }else if(type == "on-ice"){
            attribute["onIce"] = true;
        }

        if(this.selected_attributes.length == 0){
            this.selected_attributes.push(attribute);
        }else{
            let isIn = false
            this.selected_attributes.forEach((element,index )=> {
                if(element.type == attribute.type){
                    this.selected_attributes.splice(index,1)
                    isIn = true;
                }
            });
            if(!isIn){

                this.selected_attributes.push(attribute)
            }
        }
    }

    onTypeSelect(data:any){
        console.log("data",data)
        this.allowed_parameters = [];
        this.selected_data = [];
        this.selected_data_onice =[];
        //this.selected_data = data;
        let all_data = data;

        this.selected_types = [];
        this.selected_net_location = "";
        this.allowTypes(data);

        this.individual_attributes.forEach(element => {
            if(element.name == all_data.name){
                this.selected_data = element;
            }
        });

        if(this.selected_data.length != 0){
            this.selected_data.types.forEach(type => {
                let filtered_data = [];
                type.attributes.forEach(attribute => {
                    if(attribute.type.substr(attribute.type.length - 2) == "60"){
                        filtered_data.push(attribute)
                    }
                });
                type["time"] = filtered_data
            });
            this.selected_data.types.forEach(type => {
                let filtered_data = [];
                type.attributes.forEach(attribute => {
                    if(attribute.type.substr(attribute.type.length - 7) == "percent" || attribute.type.substr(attribute.type.length - 3) == "pct"){
                        filtered_data.push(attribute)
                    }
                });
                type["percent"] = filtered_data
            });
        }

        //console.log("selected data 2",this.selected_data)

        this.onice_attributes.forEach(element => {
            if(element.name == all_data.name){
                this.selected_data_onice = element
            }
        });

        
        if(this.selected_data_onice.length != 0){
            this.selected_data_onice.types.forEach(element => {
                let filter_data = []
                let filter_data_rel = []
                element.attributes.forEach(element2 => {
                    if(element2.type.substr(element2.type.length - 3) == "rel"){
                        filter_data_rel.push(element2)
                    }
                });
                element["rel"] = filter_data_rel;
            });
            this.selected_data_onice.types.forEach(element => {
                let filter_data = []
                let filter_data_rel = []
                element.attributes.forEach(element2 => {
                    if(element2.type.substr(element2.type.length - 2) == "60"){
                        filter_data_rel.push(element2)
                    }
                });
                element["time"] = filter_data_rel;
            });
            this.selected_data_onice.types.forEach(element => {
                let filter_data = []
                let filter_data_rel = []
                element.attributes.forEach(element2 => {
                    if(element2.type.substr(element2.type.length - 7) == "percent" || element2.type.substr(element2.type.length - 3) == "pct"){
                        filter_data_rel.push(element2)
                    }
                });
                element["percent"] = filter_data_rel;
            });
        }
        //console.log("selected data onIce",this.selected_data_onice)

    }

    filterData(data:any){
        return (
                data.type.substr(data.type.length - 3) != "rel" &&
                data.type.substr(data.type.length - 2) != "60" && 
                data.type.substr(data.type.length - 7) != "percent" &&
                data.type.substr(data.type.length - 3) != "pct"
                )
    }

    allowTypes(data:any){
        this.allowed_parameters = [];
        this.show_net = false;
        console.log("data allowTypes",data)
        //console.log("TABS",this.tab)
        if(this.page == "players"){
            if(data.name == "Střely a góly"){
                this.allowed_parameters.push(this.parameters[0]);
                this.allowed_parameters.push(this.parameters[1]);
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
                this.show_net = true;
    
            }else if(data.name == "Produktivita"){
                this.allowed_parameters = [];
    
            }else if(data.name == "Přihrávky na střely"){
                this.allowed_parameters.push(this.parameters[0]);
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
    
            }else if(data.name == "Vhazování a starty v pásmech"){
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
    
            }else if(data.name == "Zisky a ztráty puku"){
                this.allowed_parameters.push(this.parameters[0]);
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
                this.allowed_parameters.push(this.parameters[4]);
    
            }else if(data.name == "Držení puku"){
                this.allowed_parameters = [];
                this.show_net = false;
    
            }else if(data.name == "Vstupy do pásma"){
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
                this.allowed_parameters.push(this.parameters[5]);
                //this.allowed_parameters.push(this.parameters[6]);
                this.allowed_parameters.push(this.parameters[7]);
    
            }else if(data.name == "Výstupy z pásma"){
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
                //this.allowed_parameters.push(this.parameters[5]);
                this.allowed_parameters.push(this.parameters[6]);
                this.allowed_parameters.push(this.parameters[7]);
    
            }else if(data.name == "Samostatné nájezdy"){
                this.allowed_parameters = [];
    
            }else if(data.name == "Kvalita spoluhráčů a protihráčů"){
                this.allowed_parameters = [];
    
            }else if(data.name == "Tresty a získané přesilovky"){
                this.allowed_parameters = [];
            }

        }else if(this.page == "teams"){

            if(data.name == "Střely a góly"){
                this.allowed_parameters.push(this.parameters[0]);
                this.allowed_parameters.push(this.parameters[1]);
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
                this.show_net = true;
    
            }else if(data.name == "Produktivita"){
                this.allowed_parameters = [];
    
            }else if(data.name == "Přihrávky na střely"){
                this.allowed_parameters.push(this.parameters[0]);
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
    
            }else if(data.name == "Vhazování"){
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
    
            }else if(data.name == "Zisky a ztráty puku"){
                this.allowed_parameters.push(this.parameters[0]);
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
                this.allowed_parameters.push(this.parameters[4]);
    
            }else if(data.name == "Držení puku"){
                this.allowed_parameters = [];
    
            }else if(data.name == "Vstupy do pásma"){
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
                this.allowed_parameters.push(this.parameters[5]);
                //this.allowed_parameters.push(this.parameters[6]);
                this.allowed_parameters.push(this.parameters[7]);
    
            }else if(data.name == "Výstupy z pásma"){
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
                //this.allowed_parameters.push(this.parameters[5]);
                this.allowed_parameters.push(this.parameters[6]);
                this.allowed_parameters.push(this.parameters[7]);
    
            }else if(data.name == "Samostatné nájezdy"){
                this.allowed_parameters = [];
    
            }else if(data.name == "Kvalita spoluhráčů a protihráčů"){
                this.allowed_parameters = [];
    
            }else if(data.name == "Tresty a získané přesilovky"){
                this.allowed_parameters = [];
            }
        }else if(this.page == "goalkeepers"){
            if(data.name == "Střely a góly"){
                this.allowed_parameters.push(this.parameters[0]);
                this.allowed_parameters.push(this.parameters[2]);
                this.show_net = false;
    
            }else if(data.name == "Zóny branky"){
                this.allowed_parameters.push(this.parameters[0]);
                this.allowed_parameters.push(this.parameters[1]);
                this.allowed_parameters.push(this.parameters[2]);
                this.allowed_parameters.push(this.parameters[3]);
    
            }else if(data.name == "Střeli ze slotu"){
                this.allowed_parameters.push(this.parameters[2]);
    
            }else if(data.name == "Střeli z přihrávky"){
                this.allowed_parameters.push(this.parameters[2]);
    
            }
        }
        console.log("Allowed parameters",this.allowed_parameters)
    }


    loadEnabledAttributesTypes() {
        this.enabled_types_list = this.enabled_types.split(",");

        if (this.enabled_types != "") {
            this.checkbox_pocet = true;
            this.checkbox_60 = false;
            this.checkbox_percent = false;
        }
    }

    checkName(attribute_name:string,type:number){
        let prefix = attribute_name.substring(0,2).toLowerCase()
        if((prefix == "oz" || prefix == "dz") && type == 1){
            return false
        }else {
            return true;
        }
    }


    toggleTableSettings() {
        this.toggleTableSettings_.emit('toggleTableSettings_');
    }
    

    changeTab(name: string) {
        this.tab = name;
    }

    getActualTab() {
        return this.tab;
    }

    toggle_checkbox_pocet() {
        if (this.checkbox_pocet == true) {
            this.checkbox_pocet = false;
        } else {
            this.checkbox_pocet = true;
        }
    }
    toggle_checkbox_60() {
        if (this.checkbox_60 == true) {
            this.checkbox_60 = false;
        } else {
            this.checkbox_60 = true;
        }
    }
    toggle_checkbox_percent() {
        if (this.checkbox_percent == true) {
            this.checkbox_percent = false;
        } else {
            this.checkbox_percent = true;
        }
    }

    selectAttribute(type: string, name: string, colour: string) {
 
        //alert(type + " " + name + " " + colour);

        this.countSelectedAttributes();


        let was_null = false;

        if (!this.isAttributeSelected(type)) {


            if (this.countSelectedAttributes() < this.count_of_selected_max) {


                this.selected_attributes.forEach((item, index) => {
                    if (was_null == false) {
                        if (item['type'] == null) {
                            this.selected_attributes[index] = { 'type': type, 'name': name, 'colour': colour };
                            was_null = true;
                        }
                    }

                });



                if (was_null == false) {
                    this.selected_attributes.push({ 'type': type, 'name': name, 'colour': colour });
                }



            } else {
                alert("Maximálně je možné navolit " + this.count_of_selected_max + " atributů.");
            }



        } else {
            this.removeAttribute(type);
        }
        this.recount_empty_selects();
        this.save_select_visible = false;
        this.metric_select_visible = false;
        this.selected_name = "";
    }



    removeAttribute(type: string) {
        this.selected_attributes.forEach((item, index) => {
            if (item["type"] == type) {
                //alert(index);
                this.selected_attributes[index] = { 'type': null, 'name': null, 'colour': null };
                //this.selected_attributes.splice();
                //this.selected_attributes = this.selected_attributes.filter((x) => { return x !== null });
                //alert(JSON.stringify(this.selected_attributes));
            }
        });
        this.recount_empty_selects();
    }

    createArray(n: number): any[] {
        return Array(n);
    }

    isAttributeSelected(type: string) {
        let return_value = false;
        this.selected_attributes.forEach((item, index) => {
            if (item["type"] == type) {
                return_value = true;
            }
        });
        return return_value;
    }

    recount_empty_selects() {
        this.count_of_selected = this.count_of_selected_max - this.selected_attributes.length;
    }

    writeShit() {
        return JSON.stringify(this.selected_attributes);
    }

    applySelectedAttributes() {
        this.toggleTableSettings();
        this.set_min_attribute.emit(this.selected_attribute);
        this.set_min_attribute_value.emit(this.min_value);
        if (this.canvas_type_setting == "goalkeepers") {
            this.apply_selected_attributes_goalkeepers.emit(this.selected_attributes);
        } else if (this.canvas_type_setting == "similarity") {
            this.apply_selected_attributes_shoda.emit(this.selected_attributes);
        } else if (this.canvas_type_setting == "gamelog") {
            this.apply_selected_attributes_rekordy.emit(this.selected_attributes);
        } else {
            this.apply_selected_attributes.emit(this.selected_attributes);
        }

        //console.log("Selected attributes To Load", this.selected_attributes)
    }

    deleteAllAttributes() {
        this.selected_attributes = [
        ];
        Array.from(Array(this.count_of_selected_max)).forEach((x, i) => {
            this.selected_attributes.push({ "type": null, "name": null, "colour": null });
        });

        this.recount_empty_selects();
        this.save_select_visible = false;
        this.metric_select_visible = false;
        this.selected_name = "";
    }


    countSelectedAttributes() {
        let count = 0;
        this.selected_attributes.forEach((item, index) => {
            if (item["type"] != null) {
                count = count + 1;
            }
        });
        return count;
    }

    checkEnabledKind(checkbox_pocet: boolean, checkbox_60: boolean, checkbox_percent: boolean, type) {

        if (type == "count") {
            if (checkbox_pocet == true) {
                return true;
            } else {
                return false;
            }
        } else if (type == "60") {
            if (checkbox_60 == true) {
                return true;
            } else {
                return false;
            }
        } else if (type == "percent") {
            if (checkbox_percent == true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    toggleSaveDropdown(to_drop:string) {
        if(to_drop == "data_set"){
            if (this.save_select_visible == false) {
                this.save_select_visible = true;
            } else {
                this.save_select_visible = false;
            }
        }else if(to_drop == "metric"){
            if (this.metric_select_visible == false) {
                this.metric_select_visible = true;
            } else {
                this.metric_select_visible = false;
            }
        }
    }

    

    selectSaved(id: number) {
        //this.deleteAllAttributes();
        console.log("ID", id)
        this.selected_attributes = [];
        console.log("saved ", this.saved)
        this.saved.forEach((item, index) => {
            if (item['id'] == id) {
                
                item.data.forEach(element => {
                        console.log("Element", element)
                        this.selected_attributes.push(element)
                });

                
                /* item["data"].forEach(item2 => {
                    //this.selected_attributes.push(item2);
                    this.selectAttribute(item2["type"], item2["name"], item2["colour"]);
                });
                //console.log(JSON.stringify(this.selected_attributes));
                this.selected_name = item["name"]; */
            }
        });
        this.predefined_sets.forEach((item, index) => {
            if (item['id'] == id) {
                
                item.data.forEach(element => {
                        console.log("Element", element)
                        this.selected_attributes.push(element)
                });
            }
        });
        console.log("SELECTED", this.selected_attributes )
        console.log("TAB", this.page)
        this.selected_attributes = this.formatParametersService.formatParameters(this.selected_attributes,this.page)

        //this.selected_attributes = this.selected_attributes.slice();
        this.save_select_visible = false;
        //console.log("Selected attr", this.selected_attributes)
        //this.recount_empty_selects();
    }

    deleteSaved(id: number) {

        if (confirm("Opravdu chcete smazat tento záznam?")) {

            this.saved.forEach((item, index) => {
                if (item['id'] == id) {
                    delete this.saved[index];

                    this.saved = this.saved.filter((x) => { return x !== null });

                    this.selected_name = "";
                    this.save_select_visible = false;
                }
            });

            this.defaultService.setAttributesUserList(this.user_id, JSON.stringify(this.saved)).subscribe(loaded_data => {
            },
                err => {
                }
            );

        }
    }

    deleteAllSaved(){
        if(confirm("Opravdu chcete smazat všechny záznamy?")){
            if(confirm("Smazané záznamy budou odstraňeni natrvalo, jste si opravdu jistý?")){
                this.saved = [];
                this.defaultService.setAttributesUserList(this.user_id, JSON.stringify(this.saved)).subscribe(loaded_data => {
                },
                    err => {
                    }
                );
            }
        }
    }

    savePresset() {
        let prompt_data = prompt("Pojmenujte si skupinu vybraných dat: ");
        console.log("selected_attributes", this.selected_attributes)
        let test = [];
        this.selected_attributes.forEach(element => {
            test.push(element.type);
        });
        console.log("prompt data", prompt_data)

        console.log("Saved", this.saved);

        if (prompt_data == "" || prompt_data == null) {
            alert("Je nutné skupinu vybraných dat pojmenovat.");
        } else if(prompt_data != null && prompt_data != ""){
            /* this.saved.push({
                id: Math.floor(Date.now() / 1000), "name": prompt_data, data: this.selected_attributes
            }); */
            this.saved.push({
                id: Math.floor(Date.now() / 1000), "name": prompt_data, data: test
            });
            

            this.defaultService.setAttributesUserList(this.user_id, JSON.stringify(this.saved)).subscribe(loaded_data => {
            },
                err => {
                }
            );

        }
    }

    existSaved() {
        if (this.saved.length > 0) {
            this.existSaved_bool = true;
        } else {
            this.existSaved_bool = false;
        }
    }
}
