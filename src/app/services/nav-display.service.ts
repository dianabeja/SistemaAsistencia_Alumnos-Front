import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavDisplayService {
  private showNav = new BehaviorSubject<boolean>(true);
  public showNav$ = this.showNav.asObservable();

  constructor() {}

  setShowNav(value: boolean) {
    this.showNav.next(value);
  }
}
