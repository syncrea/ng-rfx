import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {Person} from '../dynamic-form.model';
import {GlobalState} from '../../app.state';
import {CreateMainPersonAction, CreateRegularPersonAction, DeletePersonAction} from '../dynamic-form.state';

@Component({
  selector: 'rfx-dynamic-person-container',
  templateUrl: './dynamic-person-container.component.html',
  styleUrls: ['./dynamic-person-container.component.css']
})
export class DynamicPersonContainerComponent {
  persons: Observable<Person[]>;

  constructor(private store: Store<GlobalState>) {
    this.persons = store.pipe(
      select(state => Object.values(state.personState.persons)),
    );
  }

  createMainPerson() {
    this.store.dispatch(new CreateMainPersonAction('Main first name', 'Main last name', 'main.person@mail.com'));
  }

  createRegularPerson() {
    this.store.dispatch(new CreateRegularPersonAction('Regular first name', 'Regular last name'));
  }

  deletePerson(person: Person) {
    this.store.dispatch(new DeletePersonAction(person));
  }
}
