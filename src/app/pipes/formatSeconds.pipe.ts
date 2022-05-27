import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'format_sesonds' })
export class FormatSecondsPipe implements PipeTransform {
    transform(seconds: number): any {

        if (seconds == 0) {
            return "00:00"
        } else {
            return this.fmtMSS(seconds);
        }


    }

    fmtMSS(s) {   // accepts seconds as Number or String. Returns m:ss
        return (s -         // take value s and subtract (will try to convert String to Number)
            (s %= 60) // the new value of s, now holding the remainder of s divided by 60 
            // (will also try to convert String to Number)
        ) / 60 + (    // and divide the resulting Number by 60 
                // (can never result in a fractional value = no need for rounding)
                // to which we concatenate a String (converts the Number to String)
                // who's reference is chosen by the conditional operator:
                9 < s       // if    seconds is larger than 9
                    ? ':'       // then  we don't need to prepend a zero
                    : ':0'      // else  we do need to prepend a zero
            ) + s;       // and we add Number s to the string (converting it to String as well)
    }

}