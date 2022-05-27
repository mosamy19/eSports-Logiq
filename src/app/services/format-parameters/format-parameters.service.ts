import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class FormatParametersService {
  types: any = {
    "f":{"name":"Typy akce", "name_en":"Action types", "t_name": "Forček", "t_name_en":"Forcheck"},
    "r":{"name":"Typy akce", "name_en":"Action types", "t_name": "Rychlý útok", "t_name_en":"Rush"},
    "l":{"name":"Typy akce", "name_en":"Action types", "t_name": "Dlouhý útok", "t_name_en":"Cycle"},
    "o":{"name":"Typy akce", "name_en":"Action types", "t_name": "Přečíslení", "t_name_en":"Odd-man rush"},
    "a":{"name":"Typy akce", "name_en":"Action types", "t_name": "Po vhazování", "t_name_en":"From faceoff"},
    "1t":{"name":"Typy střel", "name_en":"Shot types", "t_name": "Z první", "t_name_en":"One-timer"},
    "reb":{"name":"Typy střel", "name_en":"Shot types", "t_name": "Dorážky", "t_name_en":"Rebounds"},
    "hd":{"name":"Nebezpečnost střel", "name_en":"Shots danger", "t_name": "Vysoká", "t_name_en":"Hight"},
    "md":{"name":"Nebezpečnost střel", "name_en":"Shots danger", "t_name": "Střední", "t_name_en":"Medium"},
    "ld":{"name":"Nebezpečnost střel", "name_en":"Shots danger", "t_name": "Nízká", "t_name_en":"Low"},
    "s":{"name":"Lokace střel", "name_en":"Shot locations", "t_name": "Slot", "t_name_en":"Slot"},
    "ss":{"name":"Lokace střel", "name_en":"Shot locations", "t_name": "Vnitřní slot", "t_name_en":"Inner slot"},
    "int":{"name":"Typ zisku puku", "name_en":"Puck gain type", "t_name": "Zachycením/blokem", "t_name_en":"Capture/block"},
    "c":{"name":"Typ vstupu/výstupu", "name_en":"Entry/exit type", "t_name": "Zavezením/prihrávkou", "t_name_en":"Carry-in/out"},
    "b":{"name":"Typ zisku puku", "name_en":"Puck gain type", "t_name": "V souboji", "t_name_en":"In fight"},
    "p":{"name":"Typ vstupu/výstupu", "name_en":"Entry/exit type", "t_name": "Přihrávkou", "t_name_en":"Pass"},
    "stp":{"name":"Typ vstupu", "name_en":"Entry type", "t_name": "Přihrávkou za červenou čárou", "t_name_en":"Pass behind the red line"},
    "le":{"name":"Lokace vstupu/výstupu", "name_en":"Enter/Exit location", "t_name": "Vlevo", "t_name_en":"Left"},
    "mi":{"name":"Lokace vstupu/výstupu", "name_en":"Enter/Exit location", "t_name": "Uprostřed", "t_name_en":"Middle"},
    "ri":{"name":"Lokace vstupu/výstupu", "name_en":"Enter/Exit location", "t_name": "Vpravo", "t_name_en":"Right"},
    "ur":{"name":"Lokace branky", "name_en":"Net location", "t_name": "ur", "t_name_en":"ur"},
    "ul":{"name":"Lokace branky", "name_en":"Net location", "t_name": "ul", "t_name_en":"ul"},
    "br":{"name":"Lokace branky", "name_en":"Net location", "t_name": "br", "t_name_en":"br"},
    "bl":{"name":"Lokace branky", "name_en":"Net location", "t_name": "bl", "t_name_en":"bl"},
    "ce":{"name":"Lokace branky", "name_en":"Net location", "t_name": "ce", "t_name_en":"ce"},
    "fh":{"name":"Lokace branky", "name_en":"Net location", "t_name": "fh", "t_name_en":"fh"},
  }

  types_names: any = [
    "f","r","l","o","a","1t","reb","hd","md","ld","s","ss","int","c","b","p","stp","le","mi",
    "ri","ur","ul","br","bl","ce","fh",
  ]

  constructor() { }

  formatParameters(data:any,page:string){
    
    if(typeof data[0] !== "object"){
      let loaded_attributes = JSON.parse(localStorage.getItem('loaded_attributes'));
      loaded_attributes = loaded_attributes[page][0];

      let all_attributes = [];
      for (let key in loaded_attributes["individual"][0]) {
        loaded_attributes["individual"][0][key][0]["types"].forEach(element => {
            element.attributes.forEach(element2 => {
              all_attributes.push(element2)
            });
        });
      }
      try{
        for (let key in loaded_attributes["onIce"][0]) {
          loaded_attributes["onIce"][0][key][0]["types"].forEach(element => {
              element.attributes.forEach(element2 => {
                all_attributes.push(element2)
              });
          });
        }
      }catch{
        
      }
      
      let formated_data = [];
      /* console.log("_ _ _ _ _ _ _ _ _ _ _ _ _"); */
      data.forEach((item, index) => {
        console.log(" _ _ _ _ _ _ _ _ _ _ _ _ _ _ _");
        let isGood = false;
        let isSS = false;
        let isComplex = false;
        let complex = "";
       
        console.log("Element", item)
        let splitted = item.split(".");
        
        try{
          all_attributes.forEach(attribute => {
            if(attribute.type == splitted[splitted.length - 1]){
              isGood = true;
            }else if(attribute.type == splitted[splitted.length - 1].substring(2)){
              isSS = true;
            }

            /* if(attribute.type == item){
              console.log("Original", item)
              splitted = [];
              origin = item;

            } */

          })
        }catch{

        }

        if(!isGood){
          if(splitted[splitted.length -1].charAt(1) === "s" && isSS){
            splitted[splitted.length -1] = splitted[splitted.length -1].substring(2)
            splitted.unshift("ss");
          }else if(splitted[splitted.length -1].charAt(0) === "s"){
            
            splitted[splitted.length -1] = splitted[splitted.length -1].substring(1)
            splitted.unshift("s");
          } 
        }
        let origin = splitted[splitted.length -1].toLowerCase();
        let type = item.toLowerCase();

        console.log("splited", splitted)
        let parameters = [];
        if(splitted.length > 1){
          try{
            for(let i = 0; i < splitted.length - 1; i++ ){
              if(splitted[i] != ""){
                parameters.push(this.getParameterType(splitted[i]))
              }
            }
          }catch{
            console.log("ITEM", item)
            isComplex = true;
            complex = item;
            origin = item;
          }
          
        }
        
        all_attributes.forEach(element1 => {
          
          if(origin === element1.type){
            console.log("element1", element1)
            console.log("founded origin", origin)
            let attName ="";
            splitted.forEach((split, index) => {
              if(index < splitted.length - 1){
                if(split != "s" && split != "ss"){
                  attName = attName + split + ".";
                }else{
                  attName = attName + split;
                }
                
              }
            });
            
            //console.log("attName", attName)
            let founded = cloneDeep(element1);
            founded["parameters"] = parameters;
            founded["type"] = type;
            founded["origin"] = origin;
            if(attName == "s" || attName == "ss"){
              attName = attName + element1.name;
            }else {
              isComplex ? (attName = element1.name) : (attName = attName.toUpperCase() + element1.name);
            }

            founded["name"] = attName
            console.log("Name", founded.name)
            //founded["name"] = name.toUpperCase();
            //console.log("founded",founded)
            formated_data.push(founded);
          }
        });
        //console.log("Index",index)
        
        console.log("Origin", origin)
        console.log("all_attributes",all_attributes)
        /* console.log("name", name)
        console.log("type", type)
        console.log("parameters", parameters) */
        console.log("______________________________");
      })
      formated_data = this.chceckDuplicates(formated_data);
      console.log("formated_data",formated_data);
      
      return formated_data;
    }else{
      return data;
    }
  }

  private getParameterType(data:string):string{
    let type = data.toLowerCase();
    let selected = this.types[type]
    return selected.name + ": " + selected.t_name
  }

  private chceckDuplicates(data:any){
    /* console.log("data",data) */
    let filterValues = data.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.place === thing.place && t.name === thing.name
      ))
    )
    /* console.log("filterValues",filterValues) */
    return filterValues;
  }
}
