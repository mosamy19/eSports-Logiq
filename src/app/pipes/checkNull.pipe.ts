import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '../pipes/translate.pipe';

@Pipe({ name: 'check_null'})



export class CheckNullPipe implements PipeTransform {
    transform(value: any): any {
        //let parts: any = value.split('-');
        if(value == null){
            return 0;
          }else{
            return value;
          }

    }

}