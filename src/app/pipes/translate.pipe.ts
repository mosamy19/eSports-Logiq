import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "translate" })
export class TranslatePipe implements PipeTransform {
  transform(value: string): string {
    let language = localStorage.getItem("language");
    let translates: {
      key: string;
      cz: string;
      en: string;
    }[] = [
      {
        key: "hraci",
        cz: "Hráči",
        en: "Players",
      },
      {
        key: "prihlasit_se",
        cz: "Přihlásit se",
        en: "Login",
      },
      {
        key: "spoluhraci",
        cz: "Spoluhráči",
        en: "Teammates",
      },
      {
        key: "formace",
        cz: "Formace",
        en: "Formations",
      },
      {
        key: "lines",
        cz: "Formace",
        en: "Lines",
      },
      {
        key: "analyzer",
        cz: "Analyzér",
        en: "Analyzer",
      },
      {
        key: "brankari",
        cz: "Brankáři",
        en: "Goalies",
      },
      {
        key: "brankar",
        cz: "Brankář",
        en: "Goalie",
      },
      {
        key: "zapasy",
        cz: "Zápasy",
        en: "Games",
      },
      {
        key: "tymy",
        cz: "Týmy",
        en: "Teams",
      },
      {
        key: "odhlasit_se",
        cz: "Odhlásit se",
        en: "Log out",
      },
      {
        key: "sezona",
        cz: "Sezóna",
        en: "Season",
      },
      {
        key: "cast_sezony",
        cz: "Část sezóny",
        en: "Game type",
      },
      {
        key: "zakladni_cast",
        cz: "Základní část",
        en: "Regular season",
      },
      {
        key: "zakladni_set",
        cz: "Základní šablona",
        en: "Basic sablone",
      },
      {
        key: "srovnani_se",
        cz: "Srovnání se",
        en: "Comparison with",
      },
      {
        key: "klicka",
        cz: " Klička",
        en: "Trick",
      },
      {
        key: "hraci_v_tabulce",
        cz: "Hráči v tabulce",
        en: "Players in the chart",
      },
      {
        key: "vyberte_tym_soupere",
        cz: "Vyberte tým soupeře",
        en: "Choose enemy team",
      },
      {
        key: "filtrovat_tym_soupere",
        cz: "Filtrovat tým soupeře",
        en: "Filter enemy team",
      },
      {
        key: "vybrat_tym",
        cz: "Vybrat tým",
        en: "Select team",
      },
      {
        key: "pocet_hracu_na_lede",
        cz: "Počet hráčů na ledě",
        en: "On-ice state",
      },
      {
        key: "najezdy",
        cz: "Nájezdy",
        en: "Shootouts",
      },
      {
        key: "najezd",
        cz: "Nájezd",
        en: "Shootout",
      },
      {
        key: "je_nutne_vybrat_team_a_hrace",
        cz: "Je nutné vybrat tým a hráče",
        en: "Please select a team and a player",
      },
      {
        key: "je_nutne_vybrat_team",
        cz: "Je nutné vybrat tým",
        en: "Please select a team",
      },
      {
        key: "minimalni_toi",
        cz: "Minimální TOI",
        en: "Minimum of TOI",
      },
      {
        key: "zadejte_cas",
        cz: "Zadejte čas",
        en: "Insert time",
      },
      {
        key: "zadne_zapasy_k_zobrazeni",
        cz: "Žádné zápasy k zobrazení",
        en: "No games to display",
      },
      {
        key: "nahrat_data",
        cz: "Nahrát data",
        en: "Upload data",
      },
      {
        key: "vice_filtru",
        cz: "Více filtrů",
        en: "More filters",
      },
      {
        key: "mene_filtru",
        cz: "Méně filtrů",
        en: "Less filters",
      },
      {
        key: "poslednich_utkani",
        cz: "posledních utkání",
        en: "Last games played",
      },
      {
        key: "pocet_poslednich_zapasu",
        cz: "Počet posledních zápasů",
        en: "Last games played",
      },
      {
        key: "poslednich_5_zapasu",
        cz: "Posledních 5 zápasů",
        en: "Last 5 games",
      },
      {
        key: "zadejte_pocet",
        cz: "Zadejte počet",
        en: "Insert number of games",
      },
      {
        key: "kalendar_od",
        cz: "Kalendář od",
        en: "Calendar – from",
      },
      {
        key: "kalendar_do",
        cz: "Kalendář do",
        en: "Calendar – to",
      },
      {
        key: "doma_venku",
        cz: "Doma / venku",
        en: "Home / Away",
      },
      {
        key: "doma",
        cz: "Doma",
        en: "Home",
      },
      {
        key: "dvojice",
        cz: "Dvojice",
        en: "Teammates in pairs",
      },
      {
        key: "kombinace_hracu",
        cz: "Kombinace hráčů",
        en: "Player combinations",
      },
      {
        key: "venku",
        cz: "Venku",
        en: "Away",
      },
      {
        key: "stav_utkani",
        cz: "Stav utkání",
        en: "Game state",
      },
      {
        key: "vsechny_stavy",
        cz: "Všechny stavy",
        en: "All states",
      },
      {
        key: "ve_vedeni",
        cz: "Ve vedení",
        en: "Leading",
      },
      {
        key: "pri_prohravani",
        cz: "Při prohrávání",
        en: "Losing",
      },
      {
        key: "vyrovnany",
        cz: "Vyrovnaný",
        en: "Tied",
      },
      {
        key: "time_in_games",
        cz: "Minuty v utkání",
        en: "Game time",
      },
      {
        key: "od",
        cz: "Od",
        en: "From",
      },
      {
        key: "do",
        cz: "Do",
        en: "To",
      },
      {
        key: "vyberte_soupere",
        cz: "Vyberte soupeře",
        en: "Select opponents",
      },
      {
        key: "filtr_po_situaci",
        cz: "Filtr „po situaci“",
        en: "After-event filter",
      },
      {
        key: "cas_po_situaci",
        cz: "Čas „po situaci“",
        en: "Select after-event time (sec.)",
      },
      {
        key: "vyber_atributu",
        cz: "Výběr atributu",
        en: "Select event type",
      },
      {
        key: "vyber_brankare",
        cz: "Výběr brankáře",
        en: "Select a goalie",
      },
      {
        key: "vyberte_brankare",
        cz: "Vyberte brankáře",
        en: "Select a goalie",
      },
      {
        key: "minimalni_hodnota_atributu",
        cz: "Minimální hodnota atributu",
        en: "Minimum of events",
      },
      {
        key: "tabulky",
        cz: "Tabulky",
        en: "Tabs",
      },
      {
        key: "vizualizace",
        cz: "Vizualizace",
        en: "Visualizations",
      },
      {
        key: "filtrovat_pozice",
        cz: "Filtrovat pozice",
        en: "Positions",
      },
      {
        key: "vsechny_pozice",
        cz: "Všechny pozice",
        en: "All",
      },
      {
        key: "jen_utocnici",
        cz: "Jen útočníci",
        en: "Forwards",
      },
      {
        key: "jen_obranci",
        cz: "Jen obránci",
        en: "Defensemen",
      },
      {
        key: "prumerem_tymu",
        cz: "Průměrem týmu",
        en: "Team average",
      },
      {
        key: "prumerem_telh",
        cz: "Průměrem TELH",
        en: "League average",
      },
      {
        key: "zobrazit_skalu",
        cz: "Zobrazit škálu",
        en: "Upload",
      },
      {
        key: "zobrazit_ke_srovnani",
        cz: "Zobrazit ke srovnání",
        en: "Filter by",
      },
      {
        key: "doma_i_venku",
        cz: "Doma i venku",
        en: "Home + away",
      },
      {
        key: "vyberte_tym",
        cz: "Vyberte tým",
        en: "Select team",
      },
      {
        key: "vsechny_tymy",
        cz: "Všechny týmy",
        en: "All teams",
      },
      {
        key: "vsichni",
        cz: "Všichni",
        en: "All",
      },
      {
        key: "hraci_spolu",
        cz: "Hráči spolu",
        en: "With teammate",
      },
      {
        key: "hrac_zvlast",
        cz: "Hráč zvlášť",
        en: "Without teammate",
      },
      {
        key: "spoluhrac_zvlast",
        cz: "Spoluhráč zvlášť",
        en: "Teammate without",
      },
      {
        key: "utocnici",
        cz: "Útočníci",
        en: "Forwards",
      },
      {
        key: "obranci",
        cz: "Obránci",
        en: "Defensemen",
      },
      {
        key: "odecet_s_bez",
        cz: "Odečet S-BEZ",
        en: "Diff with/without",
      },
      {
        key: "vybrat_vlastni_data",
        cz: "Vybrat vlastní data",
        en: "Select data",
      },
      {
        key: "formace_s_hracem",
        cz: "Formace s hráčem",
        en: "Player in lines",
      },
      {
        key: "5_5_vsichni",
        cz: "5/5 – všichni",
        en: "5/5 - all",
      },
      {
        key: "5_5_utoky",
        cz: "5/5 – útoky",
        en: "5/5 - forwards",
      },
      {
        key: "5_5_obrany",
        cz: "5/5 – obrany",
        en: "5/5 - defensemen",
      },
      {
        key: "hraci_ke_srovnani",
        cz: "Hráči ke srovnání",
        en: "Select players",
      },
      {
        key: "vyberte_hrace",
        cz: "Vyberte hráče",
        en: "Select player",
      },
      {
        key: "protihraci",
        cz: "Protihráči",
        en: "Opponents",
      },
      {
        key: "nejcastejsi_spoluhraci",
        cz: "Nejčastejší spoluhráči",
        en: "Teammates",
      },
      {
        key: "vybrat_soupere",
        cz: "Vybrat soupeře",
        en: "Select opponent",
      },
      {
        key: "1_tretina",
        cz: "1. Třetina",
        en: "1. period",
      },
      {
        key: "2_tretina",
        cz: "2. Třetina",
        en: "2. period",
      },
      {
        key: "3_tretina",
        cz: "3. Třetina",
        en: "3. period",
      },
      {
        key: "prodlouzeni",
        cz: "Prodloužení",
        en: "Overtime",
      },
      {
        key: "mapa_strel",
        cz: "Mapa střel",
        en: "Shot map",
      },
      {
        key: "vsechny_zapasy_za_obdobi",
        cz: "Všechny zápasy za období",
        en: "All games",
      },
      {
        key: "vybrane_zapasy_za_obdobi",
        cz: "Vybrané zápasy za období",
        en: "Selected games",
      },
      {
        key: "strely_pro",
        cz: "Střely PRO",
        en: "Shots For",
      },
      {
        key: "strely_proti",
        cz: "Střely PROTI",
        en: "Shots Against",
      },
      {
        key: "invertovat",
        cz: "Invertovat",
        en: "Invert layout",
      },
      {
        key: "kategorie_strel",
        cz: "Kategorie střel",
        en: "Shot category",
      },
      {
        key: "goly",
        cz: "Góly",
        en: "Goals",
      },
      {
        key: "strely_na_branku",
        cz: "Střely na branku",
        en: "Shots on goals",
      },
      {
        key: "strely_na_branku_ze_slotu",
        cz: "Střely na branku ze slotu",
        en: "Slot shots on goals",
      },
      {
        key: "strelecke_pokusy_ze_slotu",
        cz: "Střelecké pokusy ze slotu",
        en: "Slot shot attempts",
      },
      {
        key: "zblokovane_strelecke_pokusy",
        cz: "Zblokované střelecké pokusy",
        en: "Blocked shot attempts",
      },
      {
        key: "nezblokovane_strelecke_pokusy",
        cz: "Nezblokované střelecké pokusy",
        en: "Unblocked shot attempts",
      },
      {
        key: "zblokovane_strelecke_pokuy",
        cz: "Zblokované střelecké pokusy",
        en: "Blocked shots",
      },
      {
        key: "strelecke_pokusy",
        cz: "Střelecké pokusy",
        en: "All shot attempts",
      },
      {
        key: "typy_strel",
        cz: "Typy střel",
        en: "Shot types",
      },
      {
        key: "vsechny_typy",
        cz: "Všechny typy",
        en: "All types",
      },
      {
        key: "dorazka",
        cz: "Dorážka",
        en: "Rebound",
      },
      {
        key: "dorazky",
        cz: "Dorážky",
        en: "Rebounds",
      },
      {
        key: "strely_pred_dorazkou",
        cz: "Střely před dorážkou",
        en: "Rebound-creating shots",
      },
      {
        key: "strely_z_prvni",
        cz: "Střely z první",
        en: "One-timer shots",
      },
      {
        key: "z_prvni",
        cz: "Z první",
        en: "One-timer",
      },
      {
        key: "typ_akce",
        cz: "Typ akce",
        en: "Attack types",
      },
      {
        key: "rychly_utok",
        cz: "Rychlý útok",
        en: "Rush",
      },
      {
        key: "precisleni",
        cz: "Přečíslení",
        en: "Odd-man rush",
      },
      {
        key: "zobrazit_prihravky_hracu",
        cz: "Zobrazit přihrávky hráčů",
        en: "Show shots of the players",
      },
      {
        key: "cas",
        cz: "Čas",
        en: "Time",
      },
      {
        key: "prihravka",
        cz: "Přihrávka",
        en: "Pass by",
      },
      {
        key: "strela",
        cz: "Střela",
        en: "Shot attempt",
      },
      {
        key: "prehrat_video",
        cz: "Přehrát video",
        en: "Play",
      },
      {
        key: "mapa_prihravek",
        cz: "Mapa přihrávek",
        en: "Pass map",
      },
      {
        key: "heatmapa_strel",
        cz: "Heatmapa střel",
        en: "Shots heatmap",
      },
      {
        key: "prihravky_pro",
        cz: "Přihrávky PRO",
        en: "Passes For",
      },
      {
        key: "prihravky_proti",
        cz: "Přihrávky PROTI",
        en: "Passes Against",
      },
      {
        key: "kategorie_prihravek",
        cz: "Kategorie přihrávek",
        en: "Pass category",
      },
      {
        key: "vsechny_kategorie",
        cz: "Všechny kategorie",
        en: "All pass categories",
      },
      {
        key: "vsechny_prihravky_do_slotu",
        cz: "Všechny přihrávky do slotu",
        en: "All slot passes",
      },
      {
        key: "zkompletovane_prihravky_do_slotu",
        cz: "Zkompletované přihrávky do slotu",
        en: "Completed slot passes",
      },
      {
        key: "nezkompletovane_prihravky_do_slotu",
        cz: "Nezkompletované přihrávky do slotu",
        en: "Non-completed slot passes",
      },
      {
        key: "zblokovane_prihravky_do_slotu",
        cz: "Zblokované přihrávky do slotu",
        en: "Blocked slot passes",
      },
      {
        key: "prihravky_na_strely",
        cz: "Přihrávky na střely",
        en: "Shot assists",
      },
      {
        key: "prihravky_zpoza_branky",
        cz: "Přihrávky zpoza branky",
        en: "Behind-the-net passes",
      },
      {
        key: "krizne_prihravky",
        cz: "Křižné přihrávky",
        en: "Cross-ice passes",
      },
      {
        key: "rychly_utok",
        cz: "Rychlý útok",
        en: "Rush",
      },
      {
        key: "precisleni",
        cz: "Přečíslení",
        en: "Odd-man rush",
      },
      {
        key: "prihravky_na_strely",
        cz: "Přihrávky na střely",
        en: "Shot assists",
      },
      {
        key: "prihravky_na_goly",
        cz: "Přihrávky na góly",
        en: "Goal assists",
      },
      {
        key: "prihravky_na_strely_na_branku",
        cz: "Přihrávky na střely na branku",
        en: "Shots on goal assists",
      },
      {
        key: "prihravky_na_strely_na_branku_ze_slotu",
        cz: "Přihrávky na střely na branku ze slotu",
        en: "Slot shots on goal assists",
      },
      {
        key: "prihravky_na_strely_ze_slotu",
        cz: "Přihrávky na střely ze slotu",
        en: "Slot shot attempts assists",
      },

      {
        key: "zakladni_cast",
        cz: "Základní část",
        en: "Regular season",
      },
      {
        key: "baraz",
        cz: "Baráž",
        en: "Relegation",
      },
      {
        key: "preliminary",
        cz: "Předkolo",
        en: "Preliminary round",
      },
      {
        key: "vyhledat_hrace",
        cz: "Vyhledat hráče",
        en: "Search player",
      },
      {
        key: "napiste_jmeno",
        cz: "Napište jméno",
        en: "Insert player´s name",
      },
      {
        key: "vyberte_situace",
        cz: "Vyberte situaci",
        en: "Select event",
      },
      {
        key: "vyhrane_vhazovani_v_obrannem_pasmu",
        cz: "Vyhrané vhazování v obranném pásmu",
        en: "Faceoff won in Defensive Zone",
      },
      {
        key: "vyhrane_vhazovani_v_utocnem_pasmu",
        cz: "Vyhrané vhazování v útočném pásmu",
        en: "Faceoff won in Offensive Zone",
      },
      {
        key: "prohrane_vhazovani_v_obrannem_pasmu",
        cz: "Prohrané vhazování v obranném pásmu",
        en: "Faceoff lost in Defensive Zone",
      },
      {
        key: "prohrane_vhazovani_v_utocnem_pasmu",
        cz: "Prohrané vhazování v útočném pásmu",
        en: "Faceoff lost in Offensive Zone",
      },
      {
        key: "uspesny_vstup_do_pasma",
        cz: "Úspěšný vstup do pásma",
        en: "Successful Controlled Zone Entry",
      },
      {
        key: "neuspesny_vstup_do_pasma",
        cz: "Neúspěšný vstup do pásma",
        en: "Unsuccessful Controlled Zone Entry",
      },
      {
        key: "uspesny_vystup_z_pasma",
        cz: "Úspěšný výstup z pásma",
        en: "Successful Controlled Zone Exit",
      },
      {
        key: "neuspesny_vystup_z_pasma",
        cz: "Neúspěšný výstup z pásma",
        en: "Unsuccessful Controlled Zone Exit",
      },
      {
        key: "vyber_atributu",
        cz: "Výběr atributu",
        en: "Select event",
      },
      {
        key: "vyberte_atribut",
        cz: "Vyberte atribut",
        en: "Select event",
      },
      {
        key: "vhazovani",
        cz: "Vhazování",
        en: "Faceoff",
      },
      {
        key: "kontrolovane_vstupy_do_pasma",
        cz: "Kontrolované vstupy do pásma",
        en: "Controlled Zone Entries",
      },
      {
        key: "kontrolovane",
        cz: "Kontrolované",
        en: "Controlled",
      },
      {
        key: "nahozeni",
        cz: "Nahození",
        en: "Dumpins",
      },
      {
        key: "vyhozeni",
        cz: "Vyhození",
        en: "Dumpouts",
      },
      {
        key: "vysledek_vystupu_z_pasma",
        cz: "Výsledek výstupu z pásma",
        en: "Zone exits result",
      },
      {
        key: "vstup_do_utocneho_pasma",
        cz: "Vstup do útočného pásma",
        en: "Entry to attack zone",
      },
      {
        key: "ztrata_puku_ve_strednim_pasme",
        cz: "Ztráta puku ve strědním pásmu",
        en: "Puck loss in middle zone",
      },
      {
        key: "kontrolovane_vystupy_z_pasma",
        cz: "Kontrolované výstupy z pásma",
        en: "Controlled Zone Exits",
      },
      {
        key: "vybrat_hrace",
        cz: "Vybrat hráče",
        en: "Select player",
      },
      {
        key: "vzorovy_hrac",
        cz: "Vzorový hráč",
        en: "Model player",
      },
      {
        key: "drzeni_hole",
        cz: "Držení hole",
        en: "Shoots",
      },
      {
        key: "leva_i_prava",
        cz: "Levá i pravá",
        en: "Left & right",
      },
      {
        key: "vysoka",
        cz: "Vysoká",
        en: "Hight",
      },
      {
        key: "nizka",
        cz: "Nízka",
        en: "Low",
      },
      {
        key: "stredni",
        cz: "Střední",
        en: "Medium",
      },
      {
        key: "leva",
        cz: "Levá",
        en: "Left",
      },
      {
        key: "prava",
        cz: "Pravá",
        en: "Right",
      },
      {
        key: "shoda",
        cz: "Shoda",
        en: "Similarity",
      },
      {
        key: "shoda_hracu",
        cz: "Shoda hráčů",
        en: "Find similar player",
      },
      {
        key: "celkova_shoda",
        cz: "Celková shoda",
        en: "Overall similarity",
      },
      {
        key: "nejmensi_shoda",
        cz: "Nejmenší shoda",
        en: "Lowest similarity",
      },
      {
        key: "prumer",
        cz: "Průměr",
        en: "Average similarity",
      },
      {
        key: "prumer2",
        cz: "Průměr",
        en: "Average",
      },
      {
        key: "vyberte_situaci",
        cz: "Vyberte situaci",
        en: "Select a situation",
      },
      {
        key: "nejvetsi_shoda",
        cz: "Největší shoda",
        en: "Highest similarity",
      },
      {
        key: "nejprve_vyberte_data_k_porovnani",
        cz: "Nejprve vyberte data k porovnání",
        en: "At first, select data categories",
      },
      {
        key: "s",
        cz: "s",
        en: "with",
      },
      {
        key: "bez",
        cz: "bez",
        en: "without",
      },
      {
        key: "analyzovat_hrace",
        cz: "Analyzovat hráče",
        en: "Analyze player",
      },
      {
        key: "export_dat",
        cz: "Export dat",
        en: "Export",
      },
      {
        key: "vybrat_data",
        cz: "Vybrat data",
        en: "Select data",
      },
      {
        key: "zobrazit_skalu",
        cz: "Zobrazit škálu",
        en: "Upload",
      },
      {
        key: "skryt_skalu",
        cz: "Skrýt škálu",
        en: "Hide scale",
      },
      {
        key: "nejlepsi",
        cz: "Nejlepší",
        en: "Best",
      },
      {
        key: "nejhorsi",
        cz: "Nejhorší",
        en: "Worst",
      },
      {
        key: "nejcastejsi_protihraci",
        cz: "Nejčastější protihráči",
        en: "Opponents",
      },
      {
        key: "nejcastejsi_spoluhraci",
        cz: "Nejčastější spoluhráči",
        en: "Teammates",
      },
      {
        key: "nezblokovane_strely",
        cz: "Nezblokované střely",
        en: "Unblocked shots",
      },
      {
        key: "prihravky_na_strely_z_prvni",
        cz: "Přihrávky na střely z první",
        en: "One-timer shot assists",
      },
      {
        key: "prihravky_na_strelecke_pokusy_ze_slotu",
        cz: "Přihrávky na střelecké pokusy ze slotu",
        en: "Slot shot attempts assists",
      },
      {
        key: "prihravky_na_strelecke_pokusy",
        cz: "Přihrávky na střelecké pokusy",
        en: "Shot attempts assists",
      },
      {
        key: "strela_na_branku",
        cz: "Střela na branku",
        en: "Shot on goal",
      },
      {
        key: "strela_mimo",
        cz: "Střela mimo",
        en: "Missed shots",
      },
      {
        key: "zblokovana_strela",
        cz: "Zblokovaná střela",
        en: "Blocked shot",
      },
      {
        key: "prihravka_na_gol",
        cz: "Přihrávka na gól",
        en: "Goal assists",
      },
      {
        key: "prihravka_na_strelu_na_branku",
        cz: "Přihrávka na střelu na branku",
        en: "Shots on goal assists",
      },
      {
        key: "prihravka_na_strelu_mimo",
        cz: "Přihrávka na střelu mimo",
        en: "Missed shots assists",
      },
      {
        key: "prihravka_na_zblokovanou_strelu",
        cz: "Přihrávka na zblokovanou střelu",
        en: "Blocked shots assists",
      },
      {
        key: "zona_branky",
        cz: "Zóny branky",
        en: "Net zones",
      },
      {
        key: "vybrat_brankare",
        cz: "Vybrat brankáře",
        en: "Select goalie",
      },
      {
        key: "vyberte_brankare",
        cz: "Vyberte brankáře",
        en: "Select goalie",
      },
      {
        key: "cast_utkani",
        cz: "Část utkání",
        en: "Game period",
      },
      {
        key: "cele_utkani",
        cz: "Celé utkání",
        en: "All periods",
      },
      {
        key: "pocet_hracu",
        cz: "Počet hráčů",
        en: "Number of players",
      },
      {
        key: "rovnovazny_stav",
        cz: "Rovnovážný stav",
        en: "Even strength",
      },
      {
        key: "presilovky",
        cz: "Přesilovky",
        en: "Power plays",
      },
      {
        key: "presilovka",
        cz: "Přesilovka",
        en: "Power play",
      },
      {
        key: "oslabeni",
        cz: "Oslabení",
        en: "Penalty killing",
      },
      {
        key: "vsechny_situace",
        cz: "Všechny situace",
        en: "All situations",
      },
      {
        key: "vsichni_hraci",
        cz: "Všichni hráči",
        en: "All players",
      },
      {
        key: "oba_tymy",
        cz: "Oba týmy",
        en: "Both teams",
      },
      {
        key: "more_goalies",
        cz: "Více brankářů ke srovnání",
        en: "More goalies",
      },
      {
        key: "testovaci_verze",
        cz: "TEST",
        en: "TEST",
      },
      {
        key: "uspesnost_na_vhazovani",
        cz: "Úspěšnost na vhazování",
        en: "Faceoff won %",
      },
      {
        key: "filtrovat_tym",
        cz: "Filtrovat tým",
        en: "Filter team",
      },
      {
        key: "rozdil_strel",
        cz: "Rozdíl střel",
        en: "Shooting difference",
      },
      {
        key: "vyberte_cast",
        cz: "Vyberte část",
        en: "Select part",
      },
      {
        key: "zobrazit_strely_hracu",
        cz: "Zobrazit střely hráčů",
        en: "Show shots of players",
      },
      {
        key: "zavrit_video",
        cz: "Zavřít video",
        en: "Close video",
      },
      {
        key: "seradit",
        cz: "Seřadit",
        en: "Order",
      },
      {
        key: "podle_casu",
        cz: "Podle času",
        en: "By time",
      },
      {
        key: "podle_uspesnosti",
        cz: "Podle úspešnosti",
        en: "Successfulness",
      },
      {
        key: "podle_hracu",
        cz: "Podle hráčů",
        en: "By players",
      },
      {
        key: "strely_ze_slotu",
        cz: "Střely ze slotu",
        en: "Slot shots",
      },
      {
        key: "stridani",
        cz: "Střídání",
        en: "Shifts",
      },
      {
        key: "nahrat_shodu",
        cz: "Nahrát shodu",
        en: "Load simmilar",
      },
      {
        key: "celkem",
        cz: "Celkem",
        en: "Total",
      },
      {
        key: "pozitivni_odchylka",
        cz: "Pozitivní odchylka",
        en: "Positive deviations",
      },
      {
        key: "s",
        cz: "s",
        en: "with",
      },
      {
        key: "bez",
        cz: "bez",
        en: "without",
      },
      {
        key: "zapasove_rekordy",
        cz: "Zápasové rekordy",
        en: "Game records",
      },
      {
        key: "vykreslit_vsechny_trajektorie",
        cz: "Vykreslit všechny trajektorie",
        en: "Show all trajectories",
      },
      {
        key: "ano",
        cz: "Ano",
        en: "Yes",
      },
      {
        key: "ne",
        cz: "Ne",
        en: "No",
      },
      {
        key: "zobrazit_poradi_hrace",
        cz: "Zobrazit pořadí hráče",
        en: "Show player ranking",
      },
      {
        key: "v_lize",
        cz: "V lize",
        en: "In league",
      },
      {
        key: "v_tymu",
        cz: "V týmu",
        en: "In team",
      },
      {
        key: "utocniku",
        cz: "útočníků",
        en: "forwards",
      },
      {
        key: "hracu",
        cz: "hráčů",
        en: "players",
      },
      {
        key: "obrancu",
        cz: "obránců",
        en: "defenders",
      },
      {
        key: "mapa_vhazovani",
        cz: "Mapa vhazování",
        en: "Face-off map",
      },
      {
        key: "pomer",
        cz: "Poměr",
        en: "Ratio",
      },
      {
        key: "procenta",
        cz: "Procenta",
        en: "Percent",
      },
      {
        key: "typ_vhazovani",
        cz: "Typ vhazování",
        en: "Face-off type",
      },
      {
        key: "vsechna_vhazovani",
        cz: "Všechna vhazování",
        en: "All faceoffs",
      },
      {
        key: "leva_vhazovani",
        cz: "Vhazování na levé straně",
        en: "Left side faceoffs",
      },
      {
        key: "prava_vhazovani",
        cz: "Vhazování na pravé straně",
        en: "Right side faceoffs",
      },
      {
        key: "vyhrana_vhazovani",
        cz: "Vyhraná vhazování",
        en: "Won faceoffs",
      },
      {
        key: "prohrana_vhazovani",
        cz: "Prohraná vhazování",
        en: "Lost faceoffs",
      },
      {
        key: "vyber_dat_dle",
        cz: "Výběr dat dle",
        en: "Select data by",
      },
      {
        key: "zapasu",
        cz: "Zápasů",
        en: "Games",
      },
      {
        /* ku kontrole */ key: "vyberte_druh_formace",
        cz: "Vyberte druh formace",
        en: "Choose formation type",
      },
      {
        /* ku kontrole */ key: "dvojice_widget_text",
        cz: "Udáva rozdíl mezi počtem šancí, které soupeři vyprodukovali průměrně za 60 minut, ve kterích byl hráč",
        en: "It shows the difference between the number of chances, that opponents produced on average in 60 minutes, in which was player",
      },
      {
        /* ku kontrole */ key: "formace_widget_text",
        cz: "Rozdíl mezi počtem střel a gólů vyprodukovaných pro tým či proti týmu, když byl hráč na ledě, a když hráč na",
        en: "The difference between the number of shots and goals produced for or against a team, when a player was on the ice and when a player was",
      },
      {
        /* ku kontrole */ key: "kombinace_widget_text",
        cz: "Udáva rozdíl mezi percentuálním podílem střeleckých pokusú pro tým ze všech střeleckých pokusů hráče",
        en: "Indicates the difference between the percentage of shooting attempts for the team from all the player's shooting attempts",
      },
      {
        key: "kalendare",
        cz: "Kalendáře",
        en: "Calendar",
      },
      {
        key: "pridat_dalsi_obdobi",
        cz: "Přidat další období",
        en: "Add another period",
      },
      {
        key: "invertovat_vizualizaci",
        cz: "Invertovat vizualizaci",
        en: "Invert visualization",
      },
      {
        key: "porovnat_s",
        cz: "Porovnat s",
        en: "Compare with",
      },
      {
        key: "porovnat_s_prumerem",
        cz: "Porovnat s průměrem TELH",
        en: "Compare with the League average",
      },
      {
        key: "produkce_strel",
        cz: "Produkce střel",
        en: "Shots production",
      },
      {
        key: "promenovani_sanci",
        cz: "Proměňování šancí",
        en: "Use of opportunities",
      },
      {
        key: "2_sance",
        cz: "2. šance",
        en: "2nd chance",
      },
      {
        key: "zapojeni_hrace",
        cz: "Zapojení hráče",
        en: "Player involvement",
      },
      {
        key: "strely_tymu_s_hracem_na_lede",
        cz: "Střely týmu s hráčem na ledě",
        en: "Team shots with player on ice",
      },
      {
        key: "strely_hrace",
        cz: "Střely hráče",
        en: "Player shots",
      },
      {
        key: "strelecke_pokusy",
        cz: "Střelecké pokusy",
        en: "Shot attempts",
      },
      {
        key: "nahravam_data",
        cz: "Nahrávám data",
        en: "Loading data",
      },
      {
        key: "nahrat_heatmapu",
        cz: "Nahrát heatmapu",
        en: "Load heatmap",
      },
      {
        key: "forecheck",
        cz: "Forecheck",
        en: "Forecheck",
      },
      {
        key: "mapa_vstupu_do_pasma",
        cz: "Mapa vstupů do pásma",
        en: "Entry map",
      },
      {
        key: "vstupy_pro",
        cz: "Vstupy pro",
        en: "Entries for",
      },
      {
        key: "vstupy_proti",
        cz: "Vstupy proti",
        en: "Entries against",
      },
      {
        key: "vstupy_hrace",
        cz: "Vstupy hráče",
        en: "Individual entries",
      },
      {
        key: "vstupy_tymu_s_hracem_na_lede",
        cz: "Vstupy týmu s hráčem na ledě",
        en: "On-ice entries",
      },
      {
        key: "vstupy_dle_uspesnosti",
        cz: "Vstupy dle úspěšnosti",
        en: "Entries by success",
      },
      {
        key: "vsechny_vstupy",
        cz: "Všechny vstupy",
        en: "All entries",
      },
      {
        key: "uspesne_vstupy",
        cz: "Úspěšné vstupy",
        en: "Success entries",
      },
      {
        key: "uspesne",
        cz: "Úspěšné",
        en: "Successful",
      },
      {
        key: "neuspesne",
        cz: "Neúspěšné",
        en: "Failed",
      },
      {
        key: "neuspesne_vstupy",
        cz: "Neúspěšné vstupy",
        en: "No-Success entries",
      },
      {
        key: "vysledek_vstupu",
        cz: "Výsledek vstupu",
        en: "Result of entry",
      },
      {
        key: "vysledek_zakonceni",
        cz: "Výsledek zakončení",
        en: "Result of ending",
      },
      {
        key: "strana_zakonceni",
        cz: "Strana zakončení",
        en: "Side of ending",
      },
      {
        key: "typ_zakonceni",
        cz: "Typ zakončení",
        en: "Type of ending",
      },
      {
        key: "vysledek_nahozeni",
        cz: "Výsledek nahození",
        en: "Result of dumpins",
      },
      {
        key: "vysledek_vyhozeni",
        cz: "Výsledek vyhození",
        en: "Result of dumpins",
      },
      {
        key: "souboj_o_puk",
        cz: "Souboj o puk",
        en: "Fight for puck",
      },
      {
        key: "zisk_puku",
        cz: "Zisk puku",
        en: "Puck gain",
      },
      {
        key: "ztrata_puku",
        cz: "Ztráta puku",
        en: "Puck loss",
      },
      {
        key: "zakoncene_streleckym_pokusem_ze_slotu",
        cz: "Zakončené střeleckým pokusem ze slotu",
        en: "Ended with a shooting attempt from the slot",
      },
      {
        key: "strelecky_tlak",
        cz: "Střelecký tlak",
        en: "Shot pressure",
      },
      {
        key: "R",
        cz: "P",
        en: "R",
      },
      {
        key: "forechecking",
        cz: "Forechecking",
        en: "Forechecking",
      },
      {
        key: "zavrit",
        cz: "Zavřít",
        en: "Close",
      },
      {
        key: "vstupy_zakoncene_strelou_na_branku",
        cz: "Vstupy zakončené střelou na branku",
        en: "Entries ended with a shot at the goal",
      },
      {
        key: "zakoncene_golem",
        cz: "Zakončené gólem",
        en: "Entries ended with a goal",
      },
      {
        key: "vyberte",
        cz: "Vyberte",
        en: "Select",
      },
      {
        key: "vstupy_soupere_s_hracem_na_lede",
        cz: "Vstupy soupeře s hráčem na ledě",
        en: "Vstupy soupeře s hráčem na ledě",
      },
      {
        key: "hracem_zamezene_vstupy",
        cz: "Hráčem zamezené vstupy",
        en: "Hráčem zamezené vstupy",
      },
      {
        key: "vstupy_dle_uspesnosti_soupere",
        cz: "Vstupy dle úspěšnosti soupeře",
        en: "Vstupy dle úspěšnosti soupeře",
      },
      {
        key: "vsechny_vstupy_soupere",
        cz: "Všechny vstupy soupeře",
        en: "Všechny vstupy soupeře",
      },
      {
        key: "uspesne_vstupy_soupere",
        cz: "Úspěšné vstupy soupeře",
        en: "Úspěšné vstupy soupeře",
      },
      {
        key: "neuspesne_vstupy_soupere",
        cz: "Neúspěšné vstupy soupeře",
        en: "Neúspěšné vstupy soupeře",
      },
      {
        key: "vse_bez_rozdilu_vysledku",
        cz: "Vše bez rozdílu výsledku",
        en: "All",
      },
      {
        key: "sprava_stahovani",
        cz: "Správa stahování",
        en: "Downloads",
      },
      {
        key: "stahnout",
        cz: "Stáhnout",
        en: "Download",
      },
      {
        key: "stahnout_vse",
        cz: "Stáhnout vše",
        en: "Download all",
      },
      {
        key: "stahnout_video",
        cz: "Stáhnout video",
        en: "Download video",
      },
      {
        key: "video_se_spracovava",
        cz: "Video se zpracovává",
        en: "Video downloading",
      },
      {
        key: "zapas",
        cz: "Zápas",
        en: "Match",
      },
      {
        key: "hrac",
        cz: "Hráč",
        en: "Player",
      },
      {
        key: "stav",
        cz: "Stav",
        en: "State",
      },
      {
        key: "centrum_videa",
        cz: "Centrum videa",
        en: "Video center",
      },
      {
        key: "oznacit_videa",
        cz: "Označit videa",
        en: "Select",
      },
      {
        key: "vse",
        cz: "Vše",
        en: "All",
      },
      {
        key: "orez_pred",
        cz: "Ořez před",
        en: "Cut before",
      },
      {
        key: "orez_po",
        cz: "Ořez po",
        en: "Cut after",
      },
      {
        key: "zony_branky",
        cz: "Zóny branky",
        en: "Zones",
      },
      {
        key: "typ_media",
        cz: "Kategorie",
        en: "Category",
      },
      {
        key: "buly_media_type",
        cz: "VHAZOVÁNÍ",
        en: "FACEOFF",
      },
      {
        key: "shootout_media_type",
        cz: "NÁJEZD",
        en: "SHOOTOUT",
      },
      {
        key: "assists_media_type",
        cz: "ASISTENCE",
        en: "ASSIST",
      },
      {
        key: "shots_media_type",
        cz: "STŘELA",
        en: "SHOT",
      },
      {
        key: "vstup_media_type",
        cz: "VSTUP",
        en: "ENTRY",
      },
      {
        key: "goalkeeper_shots_media_type",
        cz: "STŘELA NA BRANKÁŘE",
        en: "SHOT ON GOALIE",
      },
      {
        key: "shift_media_type",
        cz: "STŘÍDÁNÍ",
        en: "SHIFT",
      },
      {
        key: "penalty_media_type",
        cz: "VYLOUČENÍ",
        en: "PENALTY",
      },
      {
        key: "obranne_pasmo",
        cz: "Obranné pásmo",
        en: "Defensive zone",
      },
      {
        key: "utocne_pasmo",
        cz: "Útočné pásmo",
        en: "Offensive zone",
      },
      {
        key: "stredni_pasmo",
        cz: "Střední pásmo",
        en: "Neutral zone",
      },
      {
        key: "vhazovani_celkem",
        cz: "Vhazování celkem",
        en: "All zones",
      },
      {
        key: "proti_vsem",
        cz: "Proti všem",
        en: "All",
      },
      {
        key: "proti_levakum",
        cz: "Proti levákům",
        en: "Left stick",
      },
      {
        key: "proti_pravakum",
        cz: "Proti pravákům",
        en: "Right stick",
      },
      {
        key: "videa_ze_vsech_zapasu",
        cz: "Videa ze všech zápasů",
        en: "Play selected videos",
      },
      {
        key: "videa_z_vybranych_zapasu",
        cz: "Videa z vybraných zápasů",
        en: "Videos from selected matches",
      },
      {
        key: "vstupy_se_zakoncenim_i_bez_zakonceni",
        cz: "Vstupy se zakončením i bez zakončení",
        en: "Entries with and without shots",
      },
      {
        key: "zakoncene_streleckym_pokusem",
        cz: "Zakončené střeleckým pokusem",
        en: "Entries ended by shooting attempt",
      },
      {
        key: "mapa_vystupu_z_pasma",
        cz: "Mapa výstupů z pásma",
        en: "Leave",
      },
      {
        key: "vystupy_pro",
        cz: "Výstupy pro",
        en: "Exits for",
      },
      {
        key: "vystupy_proti",
        cz: "Výstupy proti",
        en: "Exits against",
      },
      {
        key: "vystupy_dle_tlaku",
        cz: "Výstupy dle tlaku",
        en: "Exists pressure",
      },
      {
        key: "vystupy_dle_uspesnosti",
        cz: "Výstupy dle úspěšnosti",
        en: "Exists by success",
      },
      {
        key: "vsechny_vystupy",
        cz: "Všechny výstupy",
        en: "All exists",
      },
      {
        key: "uspesne_vystupy",
        cz: "Úspěsné výstupy",
        en: "Successfull exists",
      },
      {
        key: "neuspesne_vystupy",
        cz: "Neúspěšné výstupy",
        en: "Unsuccessfull exists",
      },

      {
        key: "vsechny_vystupy_soupere",
        cz: "Všechny výstupy soupeře",
        en: "All exists",
      },
      {
        key: "uspesne_vystupy_soupere",
        cz: "Úspěšné výstupy soupeře",
        en: "Successfull exists",
      },
      {
        key: "neuspesne_vystupy_soupere",
        cz: "Neúspěšné výstupy soupeře",
        en: "Unsuccessfull exists",
      },
      {
        key: "bez_brankare",
        cz: "Bez brankáře",
        en: "Without goalie",
      },
      {
        key: "tym",
        cz: "Tým",
        en: "Team",
      },
      {
        key: "kategorie_strely",
        cz: "Kategorie střely",
        en: "Shot category",
      },
      {
        key: "kategorie_vstupu",
        cz: "Kategorie vstupu",
        en: "Entry category",
      },
      {
        key: "kategorie_vystupu",
        cz: "Kategorie výstupů",
        en: "Entry category",
      },
      {
        key: "ucet",
        cz: "Účet",
        en: "Account",
      },
      {
        key: "vybrat_z_kaledare",
        cz: "Vybrat z kaledáře",
        en: " Choose from the calendar",
      },
      {
        key: "vybrat_vsechny_zapasy",
        cz: "Vybrat všechny zápasy",
        en: "Select all games",
      },
      {
        key: "prehrat_vybrane_zapasy",
        cz: "Přehrát vybrané zápasy",
        en: "Play selected matches",
      },
      {
        key: "porovnavani_hracu",
        cz: "Porovnávání hráčů",
        en: "Comparing players",
      },
      {
        key: "gamelog",
        cz: "Gamelog",
        en: "Gamelog",
      },
      {
        key: "trend",
        cz: "Trend",
        en: "Trend",
      },
      {
        key: "kalendar",
        cz: "Kalendář",
        en: "Calendar",
      },
      {
        key: "datove_sety",
        cz: "Datové šablony",
        en: "Data templates",
      },
      {
        key: "ve_slotu",
        cz: "Ve slotu",
        en: "Slot",
      },
      {
        key: "ligovy_percentil",
        cz: "Ligový percentil",
        en: "League percentil",
      },
      {
        key: "kombinace",
        cz: "Kombinace",
        en: "Combination",
      },
      {
        key: "datum",
        cz: "Datum",
        en: "Date",
      },
      {
        key: "datum_od_do",
        cz: "Datum od - do",
        en: "Date from - to",
      },
      {
        key: "skore",
        cz: "Skóre",
        en: "Score",
      },
      {
        key: "ukazatel",
        cz: "Ukazatel",
        en: "Attribute",
      },
      {
        key: "poradi_v_tymu",
        cz: "Pořadí v týmu",
        en: "Team ranking",
      },
      {
        key: "poradi_v_telh",
        cz: "Pořadí v TELH",
        en: "Ranking in TELH",
      },
      {
        key: "sprava_videa",
        cz: "Správa videa",
        en: "Video",
      },
      {
        key: "videomapy",
        cz: "Videomapy",
        en: "Videomaps",
      },
      {
        key: "strely",
        cz: "Střely",
        en: "Shots",
      },
      {
        key: "heatmapa",
        cz: "Heatmapa",
        en: "Heatmap",
      },
      {
        key: "prihravky",
        cz: "Přihrávky",
        en: "Passes",
      },
      {
        key: "vhazovani",
        cz: "Vhazování",
        en: "Faceoffs",
      },
      {
        key: "vstupy_do_pasma",
        cz: "Vstupy do pásma",
        en: "Zone entries",
      },
      {
        key: "vystupy_z_pasma",
        cz: "Výstupy z pásma",
        en: "Zone exits",
      },
      {
        key: "na_branku",
        cz: "Na branku",
        en: "On net",
      },
      {
        key: "vsechny",
        cz: "Všechny",
        en: "All",
      },
      {
        key: "vsichni",
        cz: "Všichni",
        en: "All",
      },
      {
        key: "ulozit_mapu",
        cz: "Uložit mapu",
        en: "Save map",
      },
      {
        key: "vysoka",
        cz: "Vysoká",
        en: "High",
      },
      {
        key: "stredni",
        cz: "Střední",
        en: "Medium",
      },
      {
        key: "nizka",
        cz: "Nízká",
        en: "Low",
      },
      {
        key: "souper",
        cz: "Soupeř",
        en: "Opponent",
      },
      {
        key: "kdo_strilel",
        cz: "Kdo střílel",
        en: "Who shoots",
      },
      {
        key: "nacitani_soupere",
        cz: "Načítání soupeře",
        en: "Loading opponents data",
      },
      {
        key: "kdo_prihraval",
        cz: "Kdo přihrával",
        en: "Who passes to shot",
      },
      {
        key: "kdo_proti_komu",
        cz: "Kdo proti komu",
        en: "Head-to-head",
      },
      {
        key: "vsechny_zapasy",
        cz: "Všechny zápasy",
        en: "All games",
      },
      {
        key: "vsechny_pokusy",
        cz: "Všechny pokusy",
        en: "All attempts",
      },
      {
        key: "odebrat_vsechny_zapasy",
        cz: "Odebrat všechny zápasy",
        en: "Deselect all games",
      },
      {
        key: "porovnat",
        cz: "Porovnat",
        en: "Compare",
      },
      {
        key: "nebezpecnost_strel",
        cz: "Nebezpečnost střel",
        en: "Shot danger",
      },
      {
        key: "vysoka",
        cz: "Vysoká",
        en: "High",
      },
      {
        key: "stredni",
        cz: "Střední",
        en: "Medium",
      },
      {
        key: "nizka",
        cz: "Nízká",
        en: "Low",
      },
      {
        key: "nebezpecnost_vstupu",
        cz: "Nebezpečnost vstupu",
        en: "Entry danger",
      },
      {
        key: "nebezpecnost_vystupu",
        cz: "Nebezpečnost výstupu",
        en: "Exit danger",
      },
      {
        key: "nebezpecnost_vyhozeni",
        cz: "Nebezpečnost vyhození",
        en: "Dumpout danger",
      },
      {
        key: "trajektorie",
        cz: "Trajektorie",
        en: "Trajectories",
      },
      {
        key: "kategorie_strel_z_prihravek",
        cz: "Kategorie střel z přihrávek",
        en: "Passes resulting in",
      },
      {
        key: "lokace_nasledne_strely",
        cz: "Lokace následné střely",
        en: "Shot location",
      },
      {
        key: "lokace_strel",
        cz: "Lokace střel",
        en: "Shot location",
      },
      {
        key: "ze_slotu",
        cz: "Ze slotu",
        en: "Slot",
      },
      {
        key: "na_strelu_z_prvni",
        cz: "Na střelu z první",
        en: "One-timer",
      },
      {
        key: "zpoza_branky",
        cz: "Zpoza branky",
        en: "Behind the net",
      },
      {
        key: "krizne",
        cz: "Křižné",
        en: "Cross-ice",
      },
      {
        key: "forcek",
        cz: "Forček",
        en: "Forecheck",
      },
      {
        key: "dlouhy_utok",
        cz: "Dlouhý útok",
        en: "Cycle",
      },
      {
        key: "po_vhazovani",
        cz: "Po vhazování",
        en: "From faceoff",
      },
      {
        key: "typy_prihravek",
        cz: "Typy přihrávek",
        en: "Pass types",
      },
      {
        key: "typy_akce",
        cz: "Typy akce",
        en: "Attack type",
      },
      {
        key: "vysledek_vhazovani",
        cz: "Výsledek vhazování",
        en: "Faceoff result",
      },

      {
        key: "vsechna",
        cz: "Všechna",
        en: "All",
      },
      {
        key: "vyhrana",
        cz: "Vyhraná",
        en: "Won",
      },
      {
        key: "prohrana",
        cz: "Prohraná",
        en: "Lost",
      },
      {
        key: "pravaci",
        cz: "Praváci",
        en: "Right-shot",
      },
      {
        key: "levaci",
        cz: "Leváci",
        en: "Left-shot",
      },
      {
        key: "drzeni_hole_soupere",
        cz: "Držení hole soupeře",
        en: "Opponent's stick",
      },
      {
        key: "zakonceni_po_vhazovani",
        cz: "Zakončení po vhazování",
        en: "Faceoffs folowed by",
      },
      {
        key: "zakonceni",
        cz: "Zakončení",
        en: "Entries followed by",
      },
      {
        key: "vyber_protihrace",
        cz: "Vyber protihráče",
        en: "Select opponent",
      },
      {
        key: "kdo_vstupoval",
        cz: "Kdo vstupoval do pásma",
        en: "Who enters to offensive zone",
      },
      {
        key: "strela_ze_slotu",
        cz: "Střela ze slotu",
        en: "Shot from slot",
      },
      {
        key: "gol",
        cz: "Gól",
        en: "Goal",
      },
      {
        key: "lokace_vhazovani",
        cz: "Lokace vhazování",
        en: "Lokace vhazování",
      },
      {
        key: "v_obrannem_pasmu",
        cz: "V obranném pásmu",
        en: "V obranném pásmu",
      },
      {
        key: "v_utocnem_pasmu",
        cz: "V útočném pásmu",
        en: "V útočném pásmu",
      },
      {
        key: "vhazovani_hrace",
        cz: "Vhazování hráče",
        en: "Vhazování hráče",
      },
      {
        key: "no_data_faceoffs",
        cz: "K vybranému hráči nejsou dostupná žádná data o vhazováních.",
        en: "K vybranému hráči nejsou dostupná žádná data o vhazováních.",
      },
      {
        key: "pocet",
        cz: "Počet",
        en: "Count",
      },
      {
        key: "vlevo",
        cz: "Vlevo",
        en: "Left",
      },
      {
        key: "stredem",
        cz: "Středem",
        en: "Center",
      },
      {
        key: "vpravo",
        cz: "Vpravo",
        en: "Right",
      },
      {
        key: "individualni_data",
        cz: "Individuální data",
        en: "Individual data",
      },
      {
        key: "individualni_data_desc",
        cz: "Udávají hodnoty dosažené samotným hráčem či formací hráčů.",
        en: "Stats values achieved by a selected player or players",
      },
      {
        key: "onice_data_desc",
        cz: "Udávají hodnoty dosažené týmem s daným hráčem či formací hráčů na ledě.",
        en: "Stats values achieved by a team with a selected player(s) being on ice",
      },
      {
        key: "zavrit",
        cz: "Zavřít",
        en: "Close",
      },
      {
        key: "tymova_data",
        cz: "Týmová data",
        en: "Team data",
      },
      {
        key: "tymova_data_desc",
        cz: "Udávají hodnoty dosažené týmem",
        en: "Stats achieved by a team",
      },
      {
        key: "brankari_desc",
        cz: "Udávají hodnoty dosažené brankáři",
        en: "Stats achieved by goalies",
      },
      {
        key: "vybrat_prednadstavene",
        cz: "Vybrat přednastavené",
        en: "Select custom data sets",
      },
      {
        key: "napoveda",
        cz: "Nápověda",
        en: "Help",
      },
      {
        key: "zavrit_napovedu",
        cz: "Zavřít nápovědu",
        en: "Close help",
      },
      {
        key: "vybrane_tipy",
        cz: "Vybrané tipy",
        en: "Best tips",
      },
      {
        key: "ofenzivni_data",
        cz: "Ofenzivní data",
        en: "Offensive data",
      },
      {
        key: "defenzivni_data",
        cz: "Defenzivní data",
        en: "Defensive data",
      },
      {
        key: "strely_celkem",
        cz: "Střely celkem",
        en: "All shots",
      },
      {
        key: "vybrana_data",
        cz: "Vybraná data",
        en: "Selected data",
      },
      {
        key: "typy_dat",
        cz: "Typy dat",
        en: "Data types",
      },
      {
        key: "parametry_udalosti",
        cz: "Parametry události",
        en: "Event parameters",
      },
      {
        key: "data_hrace",
        cz: "Data hráče",
        en: "Player data",
      },
      {
        key: "vyberte_typ_dat",
        cz: "Vyberte typ dat",
        en: "Select data type please",
      },
      {
        key: "data_tymu_s_hracem",
        cz: "Data týmu s hráčem na ledě",
        en: "Player on-ice data",
      },
      {
        key: "relativni_ke_zbytku_tymu",
        cz: "Relativní ke zbytku týmu",
        en: "Relative to team",
      },
      {
        key: "prednadstavene_datove_sety",
        cz: "PŘEDNASTAVENÉ DATOVÉ ŠABLONY",
        en: "DATA TEMPLATES",
      },
      {
        key: "vybrat_datovy_set",
        cz: "Vybrat datovou šablonu",
        en: "Select data template",
      },
      {
        key: "smazat_vyber",
        cz: "Smazat výběr",
        en: "Delete selected",
      },
      {
        key: "minimalni_hodnota",
        cz: "Minimální hodnota",
        en: "Minimal value",
      },
      {
        key: "zadejte_minimalni_pocet",
        cz: "Zadejte minimální počet",
        en: "Enter minimal value",
      },
      {
        key: "ulozit_datovy_set",
        cz: "Uložit datovou šablónu",
        en: "Save data-template",
      },
      {
        key: "vybrat_metriku",
        cz: "Vybrat metriku",
        en: "Metric select",
      },
      {
        key: "ligove_poradi",
        cz: "Ligové pořadí",
        en: "League standings",
      },
      {
        key: "data_tymu",
        cz: "Data týmu",
        en: "Teams data",
      },
      {
        key: "data_brankaru",
        cz: "Data brankářu",
        en: "Golies data",
      },
      {
        key: "pocty",
        cz: "Počty",
        en: "Counts",
      },
      {
        key: "casovo_prepocitane_hodnoty",
        cz: "Časově přepočtené hodnoty",
        en: "Time-recalculated values",
      },
      {
        key: "podilove_a_odvozene_hodnoty",
        cz: "Podílové a odvozené hodnoty",
        en: "Equity and derived values",
      },
      {
        key: "zisk_utociciho_tymu",
        cz: "Zisk útočícího týmu",
        en: "Puck gain of the attacking team",
      },
      {
        key: "zisk_braniciho_tymu",
        cz: "Zisk bránícího týmu",
        en: "Puck gain of the defending team",
      },
      {
        key: "celkove_hodnoty_za_tym",
        cz: "Celkové hodnoty za tým",
        en: "Total values per team",
      },
      {
        key: "kdo_vystupoval",
        cz: "Kdo vystupoval z obranného pásma",
        en: "Who exits from defending zone",
      },
      {
        key: "karta_hrace",
        cz: "Karta hráče",
        en: "Player card",
      },
      {
        key: "narozen",
        cz: "Narozen",
        en: "Born",
      },
      {
        key: "vek",
        cz: "Věk",
        en: "Age",
      },
      {
        key: "vyska",
        cz: "Výška",
        en: "Hight",
      },
      {
        key: "vaha",
        cz: "Váha",
        en: "Weight",
      },
      {
        key: "hul",
        cz: "Hůl",
        en: "Stick",
      },
      {
        key: "let",
        cz: "let",
        en: "years",
      },
      {
        key: "porovnat_s_dalsim_hracem",
        cz: "Porovnat s dalším hráčem",
        en: "Compare with other player",
      },
      {
        key: "utok",
        cz: "Útok",
        en: "Attack",
      },
      {
        key: "asistence",
        cz: "Asistence",
        en: "Assists",
      },
      {
        key: "body",
        cz: "Body",
        en: "Points",
      },
      {
        key: "ocekavane_goly",
        cz: "Očekávané góly",
        en: "Expected goals",
      },
      {
        key: "goly_za_60_minut",
        cz: "Góly za 60 minut",
        en: "Goals for 60 minits",
      },
      {
        key: "prechod_z_obranneho_do_utocneho_pasma",
        cz: "Přechody z obranného do útočného pásma",
        en: "Transitions from defensive to offensive zone",
      },
      {
        key: "obrana",
        cz: "Obrana",
        en: "Defend",
      },
      {
        key: "tranzice",
        cz: "Tranzice",
        en: "Tranzition",
      },
      {
        key: "presilove_hry",
        cz: "Přesilové hry",
        en: "Power plays",
      },
      {
        key: "porovnani",
        cz: "Porovnání hráčů",
        en: "Players compare",
      },
      {
        key: "vybrat",
        cz: "Vybrat",
        en: "Select",
      },
      {
        key: "vybrat_hrace_k_porovnani",
        cz: "Vybrat hráče k porovnání",
        en: "Select player to select",
      },
      {
        key: "nedostupne",
        cz: "Nedostupné",
        en: "Not available",
      },
      {
        key: "produktivita",
        cz: "Produktivita",
        en: "Productivity",
      },
      {
        key: "prihravky_na_strelu",
        cz: "Přihrávky na střelu",
        en: "Shot assists",
      },
      {
        key: "ocekavane_goly_z_prihravek",
        cz: "Očekávané góly z přihrávek",
        en: "Expected goals from assists",
      },
      {
        key: "vliv_na_vstrelene_goly_tymu",
        cz: "Vliv na vstřelené góly týmu",
        en: "Influence on scored team goals",
      },
      {
        key: "vliv_na_ocekavane_goly_tymu",
        cz: "Vliv na očekávané góly týmu",
        en: "Influence on expected team goals",
      },
      {
        key: "bloky_strely_soupere",
        cz: "Bloky / střely soupeře",
        en: "Enemy blocks / shots",
      },
      {
        key: "bloky_strely_soupere",
        cz: "Bloky / střely soupeře",
        en: "Enemy blocks / shots",
      },
      {
        key: "zamezeni_vstupu_do_pasma",
        cz: "Zamezení vstupů do pásma",
        en: "Avoided entry into the zone",
      },
      {
        key: "uspesnost_zamezeni_vstupu",
        cz: "Úspěšnost zamezení vstupů",
        en: "Succes of avoided entry into the zone",
      },
      {
        key: "ztraty_puku_v_obrannem_pasmu",
        cz: "Ztráty puku v obranném pásmu",
        en: "Puck loss in defend zone",
      },
      {
        key: "vliv_na_uspesnost_souboju_po_nahozeni",
        cz: "Vliv na úspěšnost soubojů po nahození",
        en: "Influence on the success of fights after dumpins",
      },
      {
        key: "vliv_na_obdrzene_goly_tymu",
        cz: "Vliv na obdržené góly týmu",
        en: "Influence on recived goals of team",
      },
      {
        key: "vliv_na_ocekavane_goly_soupere",
        cz: "Vliv na očekávané góly soupeře",
        en: "Influence on expected goals of enemy",
      },
      {
        key: "uspesnost_kontrolovanych_vstupu",
        cz: "Úspěšnost kontrolovaných vstupů",
        en: "Success of controlled entries",
      },
      {
        key: "preference_kontrolovanych_vstupu",
        cz: "Preference kontrolovaných vstupů",
        en: "Preference of controlled entries",
      },
      {
        key: "nahozeni_se_soubojem",
        cz: "Nahození se soubojem",
        en: "Dumpins with fight",
      },
      {
        key: "vystupy_z_pasma_prihravkou",
        cz: "Výstupy z pásma přihrávkou",
        en: "Dumpouts by assists",
      },
      {
        key: "nedostatecny_pocet_minut",
        cz: "Nedostatečný počet minut",
        en: "Insufficient minutes",
      },
      {
        key: "vyberte_hrace_se_seznamu",
        cz: "Vyberte hráče ze seznamu",
        en: "Select a player from the list",
      },
      {
        key: "graficky_prehled",
        cz: "Grafický přehled",
        en: "Graphic overview",
      },
      {
        key: "ocekavanost_vyhry",
        cz: "Očekávanost výhry",
        en: "Win expections",
      },
      {
        key: "nebezpecnost",
        cz: "nebezpečnost",
        en: "danger",
      },
      {
        key: "rozumim",
        cz: "Rozumím",
        en: "I understand",
      },
      {
        key: "priste_jiz_nezobrazovat",
        cz: "Příště již nezobrazovat",
        en: "Don't show again",
      },
      {
        key: "vyvoj_zapasu_text",
        cz: "Vývoj zápasu: očekávané góly",
        en: " Match development: expected goals",
      },
      {
        key: "strelecka_prevaha",
        cz: "Střelecká převaha 5 na 5",
        en: "Shootings superiority 5 vs 5",
      },
      {
        key: "prehrat_goly",
        cz: "Přehrát góly",
        en: "Play goals",
      },
      {
        key: "prehrat_vsechny_goly",
        cz: "Přehrát všechny góly",
        en: "Play all goals",
      },
      {
        key: "zapasovy_report",
        cz: "Zápasový report",
        en: "Games report",
      },
      {
        key: "top_5_hracu",
        cz: "Top 5 hráčů",
        en: "Top 5 players",
      },
      {
        key: "v_zapase",
        cz: "V zápase",
        en: "In match",
      },
      {
        key: "statistiky_ve_hre",
        cz: "Statistiky ve hře 5 na 5",
        en: "Statistics in game 5 on 5",
      },
      {
        key: "statistiky_v_presilovych_hrach",
        cz: "Statistiky v přesilových hrách",
        en: "Statistics in power-game",
      },
      {
        key: "strelecka_aktivita",
        cz: "Střelecká aktivita 5 na 5",
        en: "Shot activity",
      },
      {
        key: "v_sezone",
        cz: "V sezóně",
        en: "In season",
      },
      {
        key: "zobrazit_vsechny_hrace",
        cz: "Zobrazit všechny hráče",
        en: "Show all players",
      },
      {
        key: "exportovat_data",
        cz: "Exportovat data",
        en: "Export data",
      },
      {
        key: "vytisknout",
        cz: "Vytisknout",
        en: "Print",
      },
      {
        key: "smazat_vsechny_sablony",
        cz: "Smazat všechny šablony",
        en: "Delete all datasets",
      },
      {
        key: "download_selected_videos",
        cz: "Stáhnout vybraná videa",
        en: "Download selected videos",
      },
      {
        key: "alternation",
        cz: "Střídání",
        en: "Alternation",
      },
      {
        key: "play_selected_section",
        cz: "Přehrát zvolený úsek",
        en: "Play the selected section",
      },
      {
        key: "players_note",
        cz: "Poznámka pro hráče",
        en: "Note for players",
      },
      {
        key: "cut_before",
        cz: "Ořez před",
        en: "Cut before",
      },
      {
        key: "game_time",
        cz: "Herní čas",
        en: "Game time",
      },
      {
        key: "players_note_panel_header",
        cz: "Poznámka videokouče",
        en: "Video disc note",
      },
      {
        key: "clip_name",
        cz: "Název klipu",
        en: "Clip Name",
      },
      {
        key: "event_evaluation",
        cz: "Hodnocení akce",
        en: "Event evaluation",
      },
      {
        key: "game_note_situation",
        cz: "POZNÁMKA K HERNÍ SITUACI",
        en: "NOTE ON GAME SITUATION",
      },
    ];

    let return_translate = "";
    translates.forEach((item) => {
      if (item["key"] == value) {
        return_translate = item[language];
      }
    });

    return return_translate;
  }
}
