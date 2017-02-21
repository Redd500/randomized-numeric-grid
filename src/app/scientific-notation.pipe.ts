import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'scientificNotation'})
export class ScientificNotationPipe implements PipeTransform {
  transform(value: number, format: string): string {
    let limit = parseInt(format.substring(0, format.indexOf('.')));
    let decimals = parseInt(format.substring(format.indexOf('.') + 1));

    if (value >= Math.pow(10, limit)) {
        let val = value;
        let e = 0;
        while (val > 10) {
            val /= 10;
            e++;
        }
        val *= Math.pow(10, decimals);
        val = Math.floor(val);
        val /= Math.pow(10, decimals);


        return val + ' e+' + e;
    }
    return value.toString();
  }
}