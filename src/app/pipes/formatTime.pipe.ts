import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'format_time' })

export class FormatTimePipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        //let parts: any = value.split('-');
        let date = new Date(value);

        let hours = Number(date.getHours());
        let minutes = Number(date.getMinutes());
        let seconds = Number(date.getSeconds());

        let seconds_new = "";
        if (seconds < 10) {
            seconds_new = "0" + seconds;
        } else {
            seconds_new = String(seconds);
        }

        let minutes_new = "";
        if (minutes < 10) {
            minutes_new = "0" + minutes;
        } else {
            minutes_new = String(minutes);
        }

        let hours_new = "";
        if (hours < 10) {
            hours_new = "0" + hours;
        } else {
            hours_new = String(hours);
        }

        return hours_new + ":" + minutes_new + ":" + seconds_new;

    }

}
