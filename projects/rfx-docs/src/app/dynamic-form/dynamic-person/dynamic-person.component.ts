import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from '../dynamic-form.model';

@Component({
  selector: 'rfx-dynamic-person',
  templateUrl: './dynamic-person.component.html',
  styleUrls: ['./dynamic-person.component.css']
})
export class DynamicPersonComponent {
  @Input() person: Person;
  @Output() outDeletePerson = new EventEmitter<void>();
}
