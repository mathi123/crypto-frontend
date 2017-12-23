import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'trimZeros'})
export class TrimZerosPipe implements PipeTransform {
  transform(strValue: string): string {
    const dec = strValue.indexOf('.');
    if (dec > 0) {
      const firstPart = strValue.substr(0, dec);
      const lastPart = this.trimZeros(strValue.substr(dec + 1));
      if (lastPart === null || lastPart === undefined) {
        return firstPart;
      }
      return `${firstPart}.${lastPart}`;
    }else {
      return strValue;
    }
  }
  trimZeros(value: string): string {
    while (value.endsWith('0')) {
      value = value.substr(0, value.length - 1);
    }
    return value;
  }
}
