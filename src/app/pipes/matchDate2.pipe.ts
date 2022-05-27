import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'match_date2' })

export class MatchDate2Pipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        //let parts: any = value.split('-');
        let date = new Date(value);

        return Number(date.getDate()) + "." + Number(date.getMonth() + 1) + "."+" "+date.getFullYear();

    }

}
