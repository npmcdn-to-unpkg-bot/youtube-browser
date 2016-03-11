import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'mytimestamp'})
export class MyTimestampPipe implements PipeTransform {
  transform(value:string, args:string[]) : any {
    var d = new Date(Date.parse(value))
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }
}