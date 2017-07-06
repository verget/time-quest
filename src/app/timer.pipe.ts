
import { Pipe, PipeTransform } from '@angular/core';
/*
 * Transform timestamp to string with 00:00:00 format
 * Usage:
 *   value | timer
 * Example:
 *   {{ 65 | timer}}
 *   formats to: 00:01:05
 */
@Pipe({name: 'timer'})
export class TimerPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 0) {
      return "00:00:00";
    }
    let secondsSum = Math.floor(value / 1000);
    let hours = Math.floor(secondsSum / 3600);
    let minutes = Math.floor((secondsSum - (hours * 3600)) / 60);
    let seconds = secondsSum - (hours * 3600) - (minutes * 60);

    let hoursDif = hours.toString();
    let minutesDif = minutes.toString();
    let secondsDif = seconds.toString();

    if (hoursDif.length < 2) {
      hoursDif = '0' + hoursDif;
    }
    if (minutesDif.length < 2) {
      minutesDif = '0' + minutesDif;
    }
    if (secondsDif.length < 2) {
      secondsDif = '0' + secondsDif;
    }

    return hoursDif + ":" + minutesDif + ":" + secondsDif;
  }
}
