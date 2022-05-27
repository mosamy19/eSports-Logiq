import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'get_colour' })
export class GetColourPipe implements PipeTransform {
    transform(value: number, enabled: boolean): any {
        var number;
        var full_value = "";
        var return_value = "";

        if (value != undefined) {
            if (value < 0) {
                number = "red";
                full_value = value.toString();
            } else if (value > 0) {
                number = "green";
                full_value = "+" + value.toString();
            } else {
                number = "normal";
                full_value = value.toString();
            }

            if (enabled == false) {
                full_value = value.toString();
            }

            let rounded_value = parseFloat(full_value).toFixed(2);

            if (enabled == true) {
                if (value > 0) {
                    rounded_value = "+" + rounded_value;
                }
            }
            number = "";

            return_value = `<span class='colour-number-${enabled} colour-number-${number}'>${rounded_value}</span>`;
        } else {
            return_value = `<span></span>`;
        }




        return return_value;


    }
}