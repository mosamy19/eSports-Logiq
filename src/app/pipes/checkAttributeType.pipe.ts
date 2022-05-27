import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'checkAttributeValue' })
export class CheckAttributeValuePipe implements PipeTransform {
    transform(value: number, type: string): any {
        if (type != undefined || value != undefined) {
            if (
                type == "toi" || 
                type == "pim" || 
                type == "pimd" || 
                type == "oz.toi" || 
                type == "dz.toi" || 
                type == "oz.ptoi" ||
                type == "dz.ptoi" ||
                type == "oppdz.ptoi" ||
                type == "ozposstoi" || 
                type == "posstoi" || 
                type == "dzposstoi" ||
                type == "dzoppposstoi" || 
                type == "oppdzptoi" || 
                type == "ptoi" || 
                type == "ozptoi") {
                    var date = new Date(value * 1000);
                    var hh: any = date.getUTCHours();
                    var mm: any = date.getUTCMinutes();
                    var ss: any = date.getSeconds();

                    let mh = mm + (60 * hh);

                    if (mh < 10) { mh = "0" + mh; }
                    if (ss < 10) { ss = "0" + ss; }

                    return mh + ":" + ss;
            } else {

                if (type.includes("60") || type.includes("percent")) {
                    if (value == undefined) {
                        return " ";
                    } else {
                        //return value.toFixed(2);
                        return (Math.ceil(value * 10) / 10).toFixed(1)
                    }
                } else {
                    return value;
                }

            }
        } else {
            return " ";
        }


    }
}
