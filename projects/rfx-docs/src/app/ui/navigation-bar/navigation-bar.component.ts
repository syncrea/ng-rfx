import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'rfx-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent {
  @Input() isSmallScreen: boolean;
  @Input() version: string;
}
