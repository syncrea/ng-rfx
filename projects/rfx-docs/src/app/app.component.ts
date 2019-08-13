import {Component} from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {GlobalState} from './app.state';

@Component({
  selector: 'rfx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSmallScreen: Observable<boolean>;
  version: Observable<string>;

  constructor(breakpointObserver: BreakpointObserver, store: Store<GlobalState>) {
    this.isSmallScreen = breakpointObserver.observe('(max-width: 600px)').pipe(map(bp => bp.matches));
    this.version = store.pipe(map(state => state.app.version));
  }
}
