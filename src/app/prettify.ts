import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'prettify'})
export class PrettifyPipe implements PipeTransform {
  transform(strValue: string): number {
    const value = parseFloat(strValue);
    if (value < 0) {
        return Math.round(value * 10000) / 10000;
    }else {
        return Math.round(value * 100) / 100;
    }
  }
}