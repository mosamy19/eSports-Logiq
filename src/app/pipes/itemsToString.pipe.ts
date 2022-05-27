import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'items_to_string'
})
export class ItemsToStringPipe implements PipeTransform {
  
  transform(value: Array<any> = []): string {
    console.log("Items to string Pipe")
    return value
      .map((item: any) => {
        return item.itemName;
      }).join(', ');
  }

}
