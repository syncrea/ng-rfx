import {Component, Injectable, Input} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {TypedFormControl, TypedFormGroup} from '../forms/typed-form-control';
import {FormDefinition, FormDefinitionGroup, FormRegistryKey} from '../model';
import {FormRegistry} from '../forms/form-registry.service';
import {createForm} from '../forms/form-creation';
import {createAction, createReducer, on, props, select, Store, StoreModule} from '@ngrx/store';
import {map, take, tap} from 'rxjs/operators';
import {EffectsModule, Actions, createEffect, ofType} from '@ngrx/effects';
import {uuid, raiseError} from '../helper';
import {By} from '@angular/platform-browser';
import {ReactiveFormsExtensionModule} from '../rfx-lib.module';
import Spy = jasmine.Spy;

describe('Form integration', () => {
  describe('typed personForm controls', () => {
    describe('component with personForm bindings', () => {
      interface SimpleForm {
        firstName: string;
        lastName: string;
      }

      @Component({
        selector: 'rfx-test',
        template: `
          <div>
            <input type="text" class="first-name" [formControl]="form.typedGet('firstName')">
            <input type="text" class="last-name" [formControl]="form.typedGet('lastName')">
          </div>
        `
      })
      class TestComponent {
        @Input() form!: TypedFormGroup<SimpleForm>;
      }

      let fixture: ComponentFixture<TestComponent>;
      let component: TestComponent;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            FormsModule,
            ReactiveFormsModule
          ],
          declarations: [
            TestComponent
          ]
        });

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
      });

      it('should reflect typed personForm into component and bind correctly using [formControl]', function () {
        const formGroup = new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl('Initial first name'),
          lastName: new TypedFormControl('Initial last name')
        });

        component.form = formGroup;
        fixture.detectChanges();

        const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name');
        const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name');
        expect(firstNameInput.value).toBe('Initial first name');
        expect(lastNameInput.value).toBe('Initial last name');
      });

      it('should allow value changes on bound personForm controls to be updated into personForm control personEditFormState', function () {
        const formGroup = new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl('Initial first name'),
          lastName: new TypedFormControl('Initial last name')
        });

        component.form = formGroup;
        fixture.detectChanges();

        const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name');
        const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name');

        firstNameInput.value = 'Updated First';
        firstNameInput.dispatchEvent(new Event('input'));
        lastNameInput.value = 'Updated Last';
        lastNameInput.dispatchEvent(new Event('input'));

        expect(formGroup.typedGet('firstName').typedValue).toBe('Updated First');
        expect(formGroup.typedGet('lastName').typedValue).toBe('Updated Last');
      });
    });
  });

  describe('personForm registry service', () => {
    describe('container and pure components observing personForm with personForm bindings', () => {
      interface SimpleForm {
        firstName: string;
        lastName: string;
      }

      @Component({
        selector: 'rfx-test',
        template: `
          <div>
            <input type="text" class="first-name" [formControl]="form.typedGet('firstName')">
            <div class="first-name-errors" *ngIf="form.typedGet('firstName').touched && form.typedGet('firstName').errors">
              {{form.typedGet('firstName').errors | json}}
            </div>
            <input type="text" class="last-name" [formControl]="form.typedGet('lastName')">
          </div>
        `
      })
      class TestComponent {
        @Input() form!: TypedFormGroup<SimpleForm>;
      }

      @Component({
        selector: 'rfx-test-container',
        template: `
          <rfx-test [form]="form"></rfx-test>
        `
      })
      class TestContainerComponent {
        form!: TypedFormGroup<SimpleForm>;
      }

      let fixture: ComponentFixture<TestContainerComponent>;
      let formRegistryService: FormRegistry;
      let component: TestContainerComponent;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            FormsModule,
            ReactiveFormsModule
          ],
          declarations: [
            TestComponent,
            TestContainerComponent
          ]
        });

        fixture = TestBed.createComponent(TestContainerComponent);
        formRegistryService = TestBed.inject(FormRegistry);
        component = fixture.componentInstance;
      });

      it('should reflect initial values into input fields', () => {
        const simpleFormDefinition: FormDefinition<SimpleForm> = {
          type: 'Group',
          fields: {
            firstName: 'Initial first name',
            lastName: 'Initial last name'
          }
        };

        const form = createForm(simpleFormDefinition);
        const formKey = formRegistryService.registerForm(form);
        component.form = formRegistryService.getForm(formKey) || raiseError(`Form observable needs to be set!`);

        fixture.detectChanges();

        const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name');
        const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name');

        expect(firstNameInput.value).toBe('Initial first name');
        expect(lastNameInput.value).toBe('Initial last name');
      });

      it('should display failing validators when correct conditions are met', () => {
        const simpleFormDefinition: FormDefinitionGroup<SimpleForm> = {
          type: 'Group',
          fields: {
            firstName: {
              type: 'Field',
              initialValue: 'Initial first name',
              options: {
                validators: [Validators.required]
              }
            },
            lastName: 'Initial last name'
          }
        };

        const form = createForm(simpleFormDefinition);
        const formKey = formRegistryService.registerForm(form);
        component.form = formRegistryService.getForm(formKey) || raiseError(`Form observable needs to be set!`);

        form.patchValue({
          firstName: ''
        });
        form.typedGet('firstName').markAsTouched();
        fixture.detectChanges();

        const errorsElement: HTMLDivElement = fixture.nativeElement.querySelector('.first-name-errors')
          || raiseError(`Test DOM Element not found!`);

        expect(form.typedGet('firstName').typedValue).toBe('');
        expect(form.typedGet('lastName').typedValue).toBe('Initial last name');
        expect(JSON.parse(errorsElement.textContent || '{}')).toEqual({required: true});
      });
    });
  });

  describe('observe form pipe in view', () => {
    interface PersonForm {
      firstName: string;
      lastName: string;
    }

    @Component({
      selector: 'rfx-test-person-form',
      template: `
        <div *ngIf="formKey | observeForm as control">
          <div class="person-name">{{control.typedValue.firstName}} {{control.typedValue.lastName}}</div>
          <input type="text" class="first-name" [formControl]="control.typedControls.firstName">
          <div class="first-name-errors"
               *ngIf="control.typedControls.firstName.touched && control.typedControls.firstName.errors">
            {{control.typedControls.firstName.errors | json}}
          </div>
          <input type="text" class="last-name" [formControl]="control.typedControls.lastName">
          <div class="last-name-errors"
               *ngIf="control.typedControls.lastName.touched && control.typedControls.lastName.errors">
            {{control.typedControls.lastName.errors | json}}
          </div>
        </div>
      `
    })
    class TestPersonFormComponent {
      @Input() formKey!: FormRegistryKey<PersonForm>;
    }

    @Component({
      selector: 'rfx-test-container',
      template: `
        <rfx-test-person-form [formKey]="formKey"></rfx-test-person-form>
      `
    })
    class TestContainerComponent {
      formDefinition: FormDefinition<PersonForm> = {
        type: 'Group',
        fields: {
          firstName: 'Initial first name',
          lastName: 'Initial last name'
        }
      };
      formKey: FormRegistryKey<PersonForm>;

      constructor(private formRegistry: FormRegistry) {
        this.formKey = this.formRegistry.createAndRegisterForm(this.formDefinition);
      }
    }

    let fixture: ComponentFixture<TestContainerComponent>;
    let component: TestContainerComponent;
    let formRegistryService: FormRegistry;
    let formRegistryCreateAndRegisterSpy: jest.SpyInstance;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          ReactiveFormsExtensionModule
        ],
        providers: [
          FormRegistry
        ],
        declarations: [
          TestPersonFormComponent,
          TestContainerComponent
        ]
      });

      formRegistryService = TestBed.inject(FormRegistry);
      formRegistryCreateAndRegisterSpy = jest.spyOn(formRegistryService, 'createAndRegisterForm');
      fixture = TestBed.createComponent(TestContainerComponent);
      component = fixture.componentInstance;
    });

    it('should initialize form in registry', () => {
      fixture.detectChanges();

      // The call from the container to register form only with definition and store the returned key
      expect(formRegistryCreateAndRegisterSpy).toHaveBeenCalledTimes(1);
      expect(formRegistryCreateAndRegisterSpy.mock.calls[0][0]).toEqual(component.formDefinition);
    });

    it('should not re-create form when already present in registry', () => {
      formRegistryService.createAndRegisterForm(component.formDefinition, {
        key: component.formKey
      });
      fixture.detectChanges();

      expect(formRegistryCreateAndRegisterSpy).toHaveBeenCalledTimes(2);
      // Second call should just return same key as component
      expect(formRegistryCreateAndRegisterSpy.mock.results[0].value).toEqual(component.formKey);
      expect(formRegistryCreateAndRegisterSpy.mock.results[formRegistryCreateAndRegisterSpy.mock.results.length - 1].value).toEqual(component.formKey);
    });

    it('should render initial state in view correctly', () => {
      fixture.detectChanges();

      const personName: HTMLDivElement = fixture.nativeElement.querySelector('.person-name')
        || raiseError(`Test DOM Element not found!`);

      expect((personName.textContent || '').trim()).toBe('Initial first name Initial last name');
    });

    it('should detect change automatically after state update', () => {
      fixture.autoDetectChanges();

      const personName: HTMLDivElement = fixture.nativeElement.querySelector('.person-name') || raiseError(`Test DOM Element not found!`);
      const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name') || raiseError(`Test DOM Element not found!`);
      const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name') || raiseError(`Test DOM Element not found!`);
      firstNameInput.value = 'Changed first name';
      lastNameInput.value = 'Changed last name';
      firstNameInput.dispatchEvent(new Event('input'));
      lastNameInput.dispatchEvent(new Event('input'));

      expect((personName.textContent || '').trim()).toBe('Changed first name Changed last name');
    });
  });

  describe('ngrx integration tests', () => {
    describe('with observeForm pipe and form key in ngrx store', () => {
      interface PersonForm {
        firstName: string;
        lastName: string;
      }

      const personFormDefinition: FormDefinitionGroup<PersonForm> = {
        type: 'Group',
        fields: {
          firstName: 'Initial first name',
          lastName: 'Initial last name'
        }
      };

      interface Person {
        id: string;
        firstName: string;
        lastName: string;
        formKey: FormRegistryKey<PersonForm>;
      }

      interface PersonState {
        persons: { [personId: string]: Person };
      }

      interface GlobalState {
        personState: PersonState;
      }

      const defaultFormState: PersonState = {
        persons: {}
      };

      const createPersonAction = createAction(
        'CreatePersonAction',
        props<{
          readonly firstName: string;
          readonly lastName: string;
        }>()
      );

      const updatePersonAction = createAction(
        'UpdatePersonAction',
        props<{
          readonly id: string;
          readonly firstName: string;
          readonly lastName: string;
          readonly formKey: FormRegistryKey<PersonForm>;
        }>()
      );

      const deletePersonAction = createAction(
        'DeletePersonAction',
        props<{
          readonly person: Person;
        }>()
      );

      @Injectable()
      class PersonEffects {
        addPerson = createEffect(() => this.actions
          .pipe(
            ofType(createPersonAction),
            map(action => {
              const {firstName, lastName} = action;
              return updatePersonAction({
                id: uuid(),
                firstName,
                lastName,
                formKey: this.formRegistry.createAndRegisterForm(personFormDefinition, {
                  key: uuid(),
                  initialData: {
                    firstName,
                    lastName
                  }
                })
              });
            })
          ));

        deletePerson = createEffect(() => this.actions
          .pipe(
            ofType(deletePersonAction),
            tap(action => this.formRegistry.removeForm(action.person.formKey))
          ), {dispatch: false});

        constructor(private actions: Actions, private formRegistry: FormRegistry) {
        }
      }

      const personReducer = createReducer(defaultFormState,
        on(updatePersonAction, (state, action) => {
          return {
            ...state,
            persons: {
              ...state.persons,
              [action.id]: {
                ...state.persons[action.id],
                id: action.id,
                firstName: action.firstName,
                lastName: action.lastName,
                formKey: action.formKey
              }
            }
          };
        }),
        on(deletePersonAction, (state, action) => {
          const persons = {...state.persons};
          delete persons[action.person.id];
          return {
            ...state,
            persons
          };
        })
      );

      @Component({
        selector: 'rfx-test-person',
        template: `
          <div *ngIf="person.formKey | observeForm as control">
            <div class="person-name">{{person.firstName}} {{person.lastName}}</div>
            <div class="edit-form">
              <input type="text" class="first-name" [formControl]="control.typedControls.firstName">
              <div class="first-name-errors"
                   *ngIf="control.typedControls.firstName.touched && control.typedControls.firstName.errors">
                {{control.typedControls.firstName.errors}}
              </div>
              <input type="text" class="last-name" [formControl]="control.typedControls.lastName">
              <div class="last-name-errors"
                   *ngIf="control.typedControls.lastName.touched && control.typedControls.lastName.errors">
                {{control.typedControls.lastName.errors}}
              </div>
            </div>
          </div>
        `
      })
      class TestPersonComponent {
        @Input() person!: Person;
      }

      @Component({
        selector: 'rfx-test-container',
        template: `
          <rfx-test-person *ngFor="let person of persons | async"
                            [person]="person">
          </rfx-test-person>
        `
      })
      class TestContainerComponent {
        persons: Observable<Person[]>;

        constructor(private store: Store<GlobalState>) {
          this.persons = store.pipe(
            select(state => Object.values(state.personState.persons)),
          );
        }
      }

      let fixture: ComponentFixture<TestContainerComponent>;
      let component: TestContainerComponent;
      let storeService: Store<GlobalState>;
      let formRegistryService: FormRegistry;
      let storeDispatchSpy: jest.SpyInstance;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            FormsModule,
            ReactiveFormsModule,
            StoreModule.forRoot({
              personState: personReducer
            }),
            EffectsModule.forRoot([PersonEffects]),
            ReactiveFormsExtensionModule
          ],
          declarations: [
            TestPersonComponent,
            TestContainerComponent
          ]
        });

        storeService = TestBed.inject(Store);
        formRegistryService = TestBed.inject(FormRegistry);
        storeDispatchSpy = jest.spyOn(storeService, 'dispatch');
        fixture = TestBed.createComponent(TestContainerComponent);
        component = fixture.componentInstance;
      });

      it('should create person with person form correctly', () => {
        storeService.dispatch(createPersonAction({
          firstName: 'First name',
          lastName: 'Last name'
        }));
        fixture.detectChanges();

        const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name') || raiseError(`Test DOM Element not found!`);
        const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name') || raiseError(`Test DOM Element not found!`);
        const personName: HTMLDivElement = fixture.nativeElement.querySelector('.person-name') || raiseError(`Test DOM Element not found!`);

        expect((personName.textContent || '').trim()).toEqual('First name Last name');
        expect(firstNameInput.value).toEqual('First name');
        expect(lastNameInput.value).toEqual('Last name');
      });

      it('should delete person with person form correctly', done => {
        storeService.dispatch(createPersonAction({
          firstName: 'First name',
          lastName: 'Last name'
        }));
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.directive(TestPersonComponent))).toBeDefined();
        let person: Person | undefined;
        component.persons.pipe(take(1)).subscribe(persons => person = persons[0]);

        storeService.dispatch(deletePersonAction({
          person: person!
        }));
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.directive(TestPersonComponent))).toBeNull();
        done();
      });

      it('should react to changes of key', () => {
        fixture.componentInstance.persons = of([{
          id: '1',
          firstName: 'First name',
          lastName: 'Last name',
          formKey: formRegistryService.createAndRegisterForm(personFormDefinition, {
            initialData: {
              firstName: 'First name',
              lastName: 'Last name'
            }
          })
        }]);

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.directive(TestPersonComponent))).toBeDefined();

        fixture.componentInstance.persons = of(<Person[]>[{
          id: '1',
          firstName: 'Changed first name',
          lastName: 'Changed last name',
          formKey: formRegistryService.createAndRegisterForm(personFormDefinition, {
            initialData: {
              firstName: 'Changed first name',
              lastName: 'Changed last name'
            }
          })
        }]);
        fixture.detectChanges();

        const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name') || raiseError(`Test DOM Element not found!`);
        const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name') || raiseError(`Test DOM Element not found!`);
        const personName: HTMLDivElement = fixture.nativeElement.querySelector('.person-name') || raiseError(`Test DOM Element not found!`);

        expect((personName.textContent || '').trim()).toEqual('Changed first name Changed last name');
        expect(firstNameInput.value).toEqual('Changed first name');
        expect(lastNameInput.value).toEqual('Changed last name');
      });
    });

    describe('highly dynamic forms with observeForm pipe and ngrx store', () => {
      type PersonType = 'Regular' | 'Main';

      interface RegularPersonForm {
        readonly firstName: string;
        readonly lastName: string;
      }

      interface MainPersonForm {
        readonly firstName: string;
        readonly lastName: string;
        readonly emailAddress: string;
      }

      type PersonForm = RegularPersonForm | MainPersonForm;

      const regularPersonFormDefinition: FormDefinitionGroup<RegularPersonForm> = {
        type: 'Group',
        fields: {
          firstName: 'Initial first name',
          lastName: 'Initial last name'
        }
      };

      const mainPersonFormDefinition: FormDefinitionGroup<MainPersonForm> = {
        type: 'Group',
        fields: {
          firstName: 'Initial first name',
          lastName: 'Initial last name',
          emailAddress: 'Initial email address'
        }
      };

      interface PersonBase {
        readonly type: PersonType;
        readonly id: string;
        readonly firstName: string;
        readonly lastName: string;
        readonly formKey: FormRegistryKey<PersonForm>;
      }

      interface MainPerson extends PersonBase {
        readonly type: 'Main';
        readonly emailAddress: string;
        readonly formKey: FormRegistryKey<MainPersonForm>;
      }

      interface RegularPerson extends PersonBase {
        readonly type: 'Regular';
        readonly formKey: FormRegistryKey<RegularPersonForm>;
      }

      type Person = RegularPerson | MainPerson;

      interface PersonState {
        persons: { [personId: string]: Person };
      }

      interface GlobalState {
        personState: PersonState;
      }

      const defaultFormState: PersonState = {
        persons: {}
      };

      const createRegularPersonAction = createAction(
        'CreateRegularPersonAction',
        props<{
          readonly firstName: string;
          readonly lastName: string;
        }>()
      );

      const createMainPersonAction = createAction(
        'CreateMainPersonAction',
        props<{
          readonly firstName: string;
          readonly lastName: string;
          readonly emailAddress: string;
        }>()
      );

      const deletePersonAction = createAction(
        'DeletePersonAction',
        props<{
          readonly person: Person;
        }>()
      );

      const updateRegularPersonAction = createAction(
        'UpdateRegularPersonAction',
        props<{
          readonly id: string;
          readonly firstName: string;
          readonly lastName: string;
          readonly formKey: FormRegistryKey<RegularPersonForm>;
        }>()
      );

      const updateMainPersonAction = createAction(
        'UpdateMainPersonAction',
        props<{
          readonly id: string,
          readonly firstName: string,
          readonly lastName: string,
          readonly emailAddress: string,
          readonly formKey: FormRegistryKey<MainPersonForm>;
        }>()
      );

      @Injectable()
      class PersonEffects {
        addPersonRegular = createEffect(() => this.actions
          .pipe(
            ofType(createRegularPersonAction),
            map(action => {
              const {firstName, lastName} = action;
              return updateRegularPersonAction({
                id: uuid(),
                firstName,
                lastName,
                formKey: this.formRegistry.createAndRegisterForm(regularPersonFormDefinition, {
                  key: uuid(),
                  initialData: {
                    firstName,
                    lastName
                  }
                })
              });
            })
          ));

        addMainPerson = createEffect(() => this.actions
          .pipe(
            ofType(createMainPersonAction),
            map(action => {
              const {firstName, lastName, emailAddress} = action;
              return updateMainPersonAction({
                id: uuid(),
                firstName,
                lastName,
                emailAddress,
                formKey: this.formRegistry.createAndRegisterForm(mainPersonFormDefinition, {
                  key: uuid(),
                  initialData: {
                    firstName,
                    lastName,
                    emailAddress
                  }
                })
              });
            })
          ));

        deletePerson = createEffect(() => this.actions
          .pipe(
            ofType(deletePersonAction),
            tap(action => this.formRegistry.removeForm(action.person.formKey))
          ), {
            dispatch: false
          });

        constructor(private actions: Actions, private formRegistry: FormRegistry) {
        }
      }

      const personReducer = createReducer(defaultFormState,
        on(updateRegularPersonAction, (state, action) => {
          return {
            ...state,
            persons: {
              ...state.persons,
              [action.id]: {
                ...state.persons[action.id],
                type: 'Regular',
                id: action.id,
                firstName: action.firstName,
                lastName: action.lastName,
                formKey: action.formKey
              }
            }
          };
        }),
        on(updateMainPersonAction, (state, action) => {
          return {
            ...state,
            persons: {
              ...state.persons,
              [action.id]: {
                ...state.persons[action.id],
                type: 'Main',
                id: action.id,
                firstName: action.firstName,
                lastName: action.lastName,
                emailAddress: action.emailAddress,
                formKey: action.formKey
              }
            }
          };
        }),
        on(deletePersonAction, (state, action) => {
          const persons = {...state.persons};
          delete persons[action.person.id];
          return {
            ...state,
            persons
          };
        })
      );

      @Component({
        selector: 'rfx-test-person',
        template: `
          <div *ngIf="person.formKey | observeForm as control">
            <div class="person-name">{{control.typedValue.firstName}} {{control.typedValue.lastName}}</div>
            <div class="edit-form">
              <input type="text" class="first-name" [formControl]="control.typedControls.firstName">
              <div class="first-name-errors"
                   *ngIf="control.typedControls.firstName.touched && control.typedControls.firstName.errors">
                {{control.typedControls.firstName.errors}}
              </div>
              <input type="text" class="last-name" [formControl]="control.typedControls.lastName">
              <div class="last-name-errors"
                   *ngIf="control.typedControls.lastName.touched && control.typedControls.lastName.errors">
                {{control.typedControls.lastName.errors}}
              </div>
              <ng-container *ngIf="person.type === 'Main'">
                <input type="text" class="email-address" [formControl]="control.typedControls.emailAddress">
                <div class="email-address-errors"
                     *ngIf="control.typedControls.emailAddress.touched && control.typedControls.emailAddress.errors">
                  {{control.typedControls.lastName.errors}}
                </div>
              </ng-container>
            </div>
          </div>
        `
      })
      class TestPersonComponent {
        @Input() person!: Person;
      }

      @Component({
        selector: 'rfx-test-container',
        template: `
          <rfx-test-person *ngFor="let person of persons | async"
                            [person]="person">
          </rfx-test-person>
        `
      })
      class TestContainerComponent {
        persons: Observable<Person[]>;

        constructor(private store: Store<GlobalState>) {
          this.persons = store.pipe(
            select(state => Object.values(state.personState.persons)),
          );
        }
      }

      let fixture: ComponentFixture<TestContainerComponent>;
      let component: TestContainerComponent;
      let storeService: Store<GlobalState>;
      let storeDispatchSpy: jest.SpyInstance;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            FormsModule,
            ReactiveFormsModule,
            StoreModule.forRoot({
              personState: personReducer
            }),
            EffectsModule.forRoot([PersonEffects]),
            ReactiveFormsExtensionModule
          ],
          declarations: [
            TestPersonComponent,
            TestContainerComponent
          ]
        });

        storeService = TestBed.inject(Store);
        storeDispatchSpy = jest.spyOn(storeService, 'dispatch');
        fixture = TestBed.createComponent(TestContainerComponent);
        component = fixture.componentInstance;
      });

      it('should create persons with regular person form and main person form correctly', () => {
        storeService.dispatch(createRegularPersonAction({
          firstName: 'Regular first name',
          lastName: 'Regular last name'
        }));
        storeService.dispatch(createMainPersonAction({
          firstName: 'Main first name',
          lastName: 'Main last name',
          emailAddress: 'first.last@main.com'
        }));
        fixture.detectChanges();

        const firstNameInput: HTMLInputElement[] = fixture.nativeElement.querySelectorAll('.first-name');
        const lastNameInput: HTMLInputElement[] = fixture.nativeElement.querySelectorAll('.last-name');
        const mainEmailInput: HTMLInputElement = fixture.nativeElement.querySelector('.email-address') || raiseError(`Test DOM Element not found!`);
        const personName: HTMLDivElement[] = fixture.nativeElement.querySelectorAll('.person-name');

        expect((personName[0].textContent || '').trim()).toEqual('Regular first name Regular last name');
        expect(firstNameInput[0].value).toEqual('Regular first name');
        expect(lastNameInput[0].value).toEqual('Regular last name');
        expect((personName[1].textContent || '').trim()).toEqual('Main first name Main last name');
        expect(firstNameInput[1].value).toEqual('Main first name');
        expect(lastNameInput[1].value).toEqual('Main last name');
        expect(mainEmailInput.value).toEqual('first.last@main.com');
      });
    });
  });
});
