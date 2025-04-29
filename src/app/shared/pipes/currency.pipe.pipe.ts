import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPipe'
})
export class CurrencyPipePipe implements PipeTransform {
  transform(value: number, currency: string = 'HUF'): string {
    if (typeof value !== 'number') {
      return '';
    }
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currency: currency,
    }).format(value);
  }

}
