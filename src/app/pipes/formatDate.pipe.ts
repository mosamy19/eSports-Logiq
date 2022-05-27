import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'format_date' })

export class FormatDatePipe implements PipeTransform {
    transform(value: string, args: string[]): any {
        //let parts: any = value.split('-');
        let date = new Date(value);

        return Number(date.getDate()) + "." + Number(date.getMonth() + 1) + "." + Number(date.getFullYear());

    }

}
