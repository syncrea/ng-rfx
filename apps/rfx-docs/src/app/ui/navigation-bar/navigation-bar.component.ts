import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'rfx-docs-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent {
  @Input() isSmallScreen = false;
  @Input() version = '';
}
