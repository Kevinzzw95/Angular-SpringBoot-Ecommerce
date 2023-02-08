import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  constructor() { }

  getCreditCardMonth(startMonth: number): Observable<number[]> {
    let data = [];
    for(let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    // wrap as an observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    // wrap as an observable
    return of(data);
  }
}
