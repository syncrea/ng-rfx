import {Component, Injectable, Input} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {merge, Observable, of} from 'rxjs';
import {TypedFormControl, TypedFormGroup} from '../forms/typed-form-control';
import {FormData, FormDefinition, FormDefinitionGroup, FormRegistryKey, FormStateGroup, FormStateControlBase} from '../model';
import {FormRegistry} from '../forms/form-registry.service';
import {createForm} from '../forms/form-creation';
import {Action, select, Store, StoreModule} from '@ngrx/store';
import {filter, map, take, tap, skipWhile} from 'rxjs/operators';
import {getFormState} from '../forms/form-state';
import {Actions, Effect, EffectsModule} from '@ngrx/effects';
import {uuid, raiseError} from '../helper';
import {By} from '@angular/platform-browser';
import {ReactiveFormsExtensionModule} from '../reactive-forms-extension.module';
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
        @Input() form: TypedFormGroup<SimpleForm>;
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
            <div class="first-name-errors" *ngIf="state.fields.firstName.touched && state.fields.firstName.errors">
              {{state.fields.firstName.errors}}
            </div>
            <input type="text" class="last-name" [formControl]="form.typedGet('lastName')">
          </div>
        `
      })
      class TestComponent {
        @Input() form: TypedFormGroup<SimpleForm>;
        @Input() state: FormStateGroup<SimpleForm>;
      }

      @Component({
        selector: 'rfx-test-container',
        template: `
          <rfx-test [form]="(form | async).control"
                     [state]="(form | async).state">
          </rfx-test>
        `
      })
      class TestContainerComponent {
        form: Observable<FormData<SimpleForm>>;
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
        formRegistryService = TestBed.get(FormRegistry);
        component = fixture.componentInstance;
      });

      it('should reflect initial values into input fields', () => {
        const simpleFormDefinition: FormDefinitionGroup<SimpleForm> = {
          type: 'Group',
          fields: {
            firstName: 'Initial first name',
            lastName: 'Initial last name'
          }
        };

        const form = createForm(simpleFormDefinition);
        const formKey = formRegistryService.registerForm(form);
        component.form = formRegistryService.observeForm(formKey) || raiseError(`Form observable needs to be set!`);

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
        component.form = formRegistryService.observeForm(formKey) || raiseError(`Form observable needs to be set!`);

        form.patchValue({
          firstName: ''
        });
        form.typedGet('firstName').markAsTouched();
        fixture.detectChanges();

        const errorsElement: HTMLDivElement = fixture.nativeElement.querySelector('.first-name-errors')
          || raiseError(`Test DOM Element not found!`);

        expect(form.typedGet('firstName').typedValue).toBe('');
        expect(form.typedGet('lastName').typedValue).toBe('Initial last name');
        expect((errorsElement.textContent || '').trim()).toBe('required');
      });
    });
  });

  describe('form binding directive', () => {
    interface PersonForm {
      firstName: string;
      lastName: string;
    }

    @Component({
      selector: 'rfx-test-person-form',
      template: `
        <div
          *rfxFormBinding="formKey; let control = formControl; let state = formState">
          <div class="person-name">{{state.value.firstName}} {{state.value.lastName}}</div>
          <input type="text" class="first-name" [formControl]="control.typedGet('firstName')">
          <div class="first-name-errors"
               *ngIf="state.fields.firstName.touched && state.fields.firstName.errors">
            {{state.fields.firstName.errors}}
          </div>
          <input type="text" class="last-name" [formControl]="control.typedGet('lastName')">
          <div class="last-name-errors"
               *ngIf="state.fields.lastName.touched && state.fields.lastName.errors">
            {{state.fields.lastName.errors}}
          </div>
        </div>
      `
    })
    class TestPersonFormComponent {
      @Input() formKey: FormRegistryKey<PersonForm>;
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
    let formRegistryCreateAndRegisterSpy: Spy;

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

      formRegistryService = TestBed.get(FormRegistry);
      formRegistryCreateAndRegisterSpy = spyOn(formRegistryService, 'createAndRegisterForm').and.callThrough();
      fixture = TestBed.createComponent(TestContainerComponent);
      component = fixture.componentInstance;
    });

    it('should initialize form in registry', () => {
      fixture.detectChanges();

      // The call from the container to register form only with definition and store the returned key
      expect(formRegistryCreateAndRegisterSpy).toHaveBeenCalledTimes(1);
      expect(formRegistryCreateAndRegisterSpy.calls.argsFor(0)).toEqual([
        component.formDefinition
      ]);
    });

    it('should not re-create form when already present in registry', () => {
      formRegistryService.createAndRegisterForm(component.formDefinition, {
        key: component.formKey
      });
      fixture.detectChanges();

      expect(formRegistryCreateAndRegisterSpy).toHaveBeenCalledTimes(2);
      // Second call should just return same key as component
      expect(formRegistryCreateAndRegisterSpy.calls.first().returnValue).toEqual(component.formKey);
      expect(formRegistryCreateAndRegisterSpy.calls.mostRecent().returnValue).toEqual(component.formKey);
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
    describe('container and pure components observing personForm with personForm bindings', () => {
      interface SimpleForm {
        firstName: string;
        lastName: string;
      }

      const simpleFormDefinition: FormDefinitionGroup<SimpleForm> = {
        type: 'Group',
        fields: {
          firstName: 'Initial first name',
          lastName: 'Initial last name'
        }
      };

      interface TestState {
        form: FormStateGroup<SimpleForm> | null;
      }

      interface GlobalState {
        test: TestState;
      }

      const initialFormStateProperties: FormStateControlBase = {
        dirty: false,
        disabled: false,
        enabled: true,
        invalid: false,
        pristine: true,
        touched: false,
        untouched: true,
        valid: true,
        pending: false,
        errors: null
      };

      const defaultFormState: TestState = {
        form: {
          value: {
            firstName: 'Initial personEditFormState first name',
            lastName: 'Initial personEditFormState last name'
          },
          ...initialFormStateProperties,
          fields: {
            firstName: {
              value: 'Initial personEditFormState first name',
              ...initialFormStateProperties
            },
            lastName: {
              value: 'Initial personEditFormState last name',
              ...initialFormStateProperties
            }
          }
        }
      };

      class UpdateTestFormAction implements Action {
        readonly type = 'UpdateTestFormAction';

        constructor(public readonly formState: FormStateGroup<SimpleForm>) {
        }
      }

      function testReducer(state: TestState = defaultFormState, action: UpdateTestFormAction): TestState {
        switch (action.type) {
          case 'UpdateTestFormAction': {
            return {
              form: action.formState
            };
          }
          default:
            return state;
        }
      }

      @Component({
        selector: 'rfx-test',
        template: `
          <div>
            <input type="text" class="first-name" [formControl]="form.typedGet('firstName')">
            <div class="first-name-errors" *ngIf="state.fields?.firstName.touched && state.fields?.firstName.errors">
              {{state.fields.firstName.errors}}
            </div>
            <input type="text" class="last-name" [formControl]="form.typedGet('lastName')">
            <div class="last-name-errors" *ngIf="state.fields?.lastName.touched && state.fields?.lastName.errors">
              {{state.fields.lastName.errors}}
            </div>
          </div>
        `
      })
      class TestComponent {
        @Input() form: TypedFormGroup<SimpleForm>;
        @Input() state: FormStateGroup<SimpleForm>;
      }

      @Component({
        selector: 'rfx-test-container',
        template: `
          <rfx-test *ngIf="formState | async"
                     [form]="formControl"
                     [state]="formState | async">
          </rfx-test>
        `
      })
      class TestContainerComponent {
        formControl: TypedFormGroup<SimpleForm>;
        formState: Observable<FormStateGroup<SimpleForm> | null>;

        constructor(private store: Store<GlobalState>) {
          this.formControl = createForm(simpleFormDefinition);

          // Select personEditFormState from store
          this.formState = this.store.pipe(
            select(state => state.test.form)
          );

          // Observe personForm control and dispatch action to change store personEditFormState on changes
          merge(
            this.formControl.valueChanges,
            this.formControl.statusChanges
          ).subscribe(() => this.store.dispatch(new UpdateTestFormAction(getFormState(this.formControl))));

          // Initialize from group control with initial data from personEditFormState
          this.formState.pipe(
            take(1)
          ).subscribe(formState => {
            if (formState) {
              this.formControl.setValue(formState.value);
            }
          });
        }
      }

      let fixture: ComponentFixture<TestContainerComponent>;
      let component: TestContainerComponent;
      let storeService: Store<GlobalState>;
      let storeDispatchSpy: Spy;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            FormsModule,
            ReactiveFormsModule,
            StoreModule.forRoot({
              test: testReducer
            })
          ],
          declarations: [
            TestComponent,
            TestContainerComponent
          ]
        });

        storeService = TestBed.get(Store);
        storeDispatchSpy = spyOn(storeService, 'dispatch').and.callThrough();
        fixture = TestBed.createComponent(TestContainerComponent);
        component = fixture.componentInstance;
      });

      it('should dispatch actions to store for initialization', () => {
        // Value change and status both dispatch an action
        expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
        const action: UpdateTestFormAction = storeDispatchSpy.calls.mostRecent().args[0];
        expect(action.formState.value).toEqual({
          firstName: 'Initial personEditFormState first name',
          lastName: 'Initial personEditFormState last name'
        });
      });

      it('should dispatch actions when personForm is being updated programmatically', () => {
        component.formControl.setValue({
          firstName: 'Updated first name',
          lastName: 'Updated last name'
        });

        // Value change and status both dispatch an action as well as the update 2 actions so total of 4
        expect(storeDispatchSpy).toHaveBeenCalledTimes(4);
        const action: UpdateTestFormAction = storeDispatchSpy.calls.mostRecent().args[0];
        expect(action.formState.value).toEqual({
          firstName: 'Updated first name',
          lastName: 'Updated last name'
        });
      });

      it('should dispatch actions when personForm is being updated in view', () => {
        fixture.detectChanges();
        const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name') || raiseError(`Test DOM Element not found!`);
        const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name') || raiseError(`Test DOM Element not found!`);

        firstNameInput.value = 'Updated first name view';
        firstNameInput.dispatchEvent(new Event('input'));
        lastNameInput.value = 'Updated last name view';
        lastNameInput.dispatchEvent(new Event('input'));

        // 2 initial + 2 first name change + 2 last name change (always separate value + status changes) + 2 dirty
        expect(storeDispatchSpy).toHaveBeenCalledTimes(8);
        const action: UpdateTestFormAction = storeDispatchSpy.calls.mostRecent().args[0];
        expect(action.formState.value).toEqual({
          firstName: 'Updated first name view',
          lastName: 'Updated last name view'
        });
      });
    });

    describe('with personForm registry and personForm key references', () => {
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

      class CreatePersonAction implements Action {
        readonly type = 'CreatePersonAction';

        constructor(public readonly firstName: string,
                    public readonly lastName: string) {
        }
      }

      class DeletePersonAction implements Action {
        readonly type = 'DeletePersonAction';

        constructor(public readonly person: Person) {
        }
      }

      class UpdatePersonAction implements Action {
        readonly type = 'UpdatePersonAction';

        constructor(public readonly id: string,
                    public readonly firstName: string,
                    public readonly lastName: string,
                    public readonly formKey: FormRegistryKey<PersonForm>) {
        }
      }

      type PersonActions = UpdatePersonAction | DeletePersonAction | CreatePersonAction;

      @Injectable()
      class PersonEffects {
        @Effect() addPerson: Observable<UpdatePersonAction> = this.actions
          .pipe(
            filter(action => action instanceof CreatePersonAction),
            map((action: CreatePersonAction) => {
              const {firstName, lastName} = action;
              return <UpdatePersonAction>{
                type: 'UpdatePersonAction',
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
              };
            })
          );

        @Effect({dispatch: false}) deletePerson = this.actions
          .pipe(
            filter(action => action instanceof DeletePersonAction),
            tap((action: DeletePersonAction) => this.formRegistry.removeForm(action.person.formKey))
          );

        constructor(private actions: Actions, private formRegistry: FormRegistry) {
        }
      }

      function personReducer(state: PersonState = defaultFormState, action: PersonActions): PersonState {
        switch (action.type) {
          case 'UpdatePersonAction': {
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
          }
          case 'DeletePersonAction': {
            const persons = {...state.persons};
            delete persons[action.person.id];
            return {
              ...state,
              persons
            };
          }
          default:
            return state;
        }
      }

      @Component({
        selector: 'rfx-test-person',
        template: `
          <div>
            <div class="person-name">{{person.firstName}} {{person.lastName}}</div>
            <div class="edit-form">
              <input type="text" class="first-name" [formControl]="formData.control.typedGet('firstName')">
              <div class="first-name-errors"
                   *ngIf="formData.state.fields.firstName.touched && formData.state.fields.firstName.errors">
                {{formData.state.fields.firstName.errors}}
              </div>
              <input type="text" class="last-name" [formControl]="formData.control.typedGet('lastName')">
              <div class="last-name-errors"
                   *ngIf="formData.state.fields.lastName.touched && formData.state.fields.lastName.errors">
                {{formData.state.fields.lastName.errors}}
              </div>
            </div>
          </div>
        `
      })
      class TestPersonComponent {
        @Input() person: Person;
        @Input() formData: FormData<PersonForm>;
      }

      @Component({
        selector: 'rfx-test-container',
        template: `
          <rfx-test-person *ngFor="let person of persons | async"
                            [person]="person"
                            [formData]="formRegister.observeForm(person.formKey) | async">
          </rfx-test-person>
        `
      })
      class TestContainerComponent {
        persons: Observable<Person[]>;

        constructor(private store: Store<GlobalState>, private formRegister: FormRegistry) {
          this.persons = store.pipe(
            select(state => Object.values(state.personState.persons)),
          );
        }
      }

      let fixture: ComponentFixture<TestContainerComponent>;
      let component: TestContainerComponent;
      let storeService: Store<GlobalState>;
      let storeDispatchSpy: Spy;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
            FormsModule,
            ReactiveFormsModule,
            StoreModule.forRoot({
              personState: personReducer
            }),
            EffectsModule.forRoot([PersonEffects])
          ],
          providers: [
            FormRegistry
          ],
          declarations: [
            TestPersonComponent,
            TestContainerComponent
          ]
        });

        storeService = TestBed.get(Store);
        storeDispatchSpy = spyOn(storeService, 'dispatch').and.callThrough();
        fixture = TestBed.createComponent(TestContainerComponent);
        component = fixture.componentInstance;
      });

      it('should create person with person form correctly', () => {
        storeService.dispatch(new CreatePersonAction('First name', 'Last name'));
        fixture.detectChanges();

        const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name') || raiseError(`Test DOM Element not found!`);
        const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name') || raiseError(`Test DOM Element not found!`);
        const personName: HTMLDivElement = fixture.nativeElement.querySelector('.person-name') || raiseError(`Test DOM Element not found!`);

        expect((personName.textContent || '').trim()).toEqual('First name Last name');
        expect(firstNameInput.value).toEqual('First name');
        expect(lastNameInput.value).toEqual('Last name');
      });

      it('should delete person with person form correctly', async(() => {
        storeService.dispatch(new CreatePersonAction('First name', 'Last name'));
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.directive(TestPersonComponent))).toBeDefined();

        component.persons.pipe(take(1)).subscribe(persons => {
          storeService.dispatch(new DeletePersonAction(persons[0]));
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.directive(TestPersonComponent))).toBeNull();
        });
      }));
    });

    describe('with form binding directive and form key in ngrx store', () => {
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

      class CreatePersonAction implements Action {
        readonly type = 'CreatePersonAction';

        constructor(public readonly firstName: string,
                    public readonly lastName: string) {
        }
      }

      class DeletePersonAction implements Action {
        readonly type = 'DeletePersonAction';

        constructor(public readonly person: Person) {
        }
      }

      class UpdatePersonAction implements Action {
        readonly type = 'UpdatePersonAction';

        constructor(public readonly id: string,
                    public readonly firstName: string,
                    public readonly lastName: string,
                    public readonly formKey: FormRegistryKey<PersonForm>) {
        }
      }

      type PersonActions = UpdatePersonAction | DeletePersonAction | CreatePersonAction;

      @Injectable()
      class PersonEffects {
        @Effect() addPerson: Observable<UpdatePersonAction> = this.actions
          .pipe(
            filter(action => action instanceof CreatePersonAction),
            map((action: CreatePersonAction) => {
              const {firstName, lastName} = action;
              return <UpdatePersonAction>{
                type: 'UpdatePersonAction',
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
              };
            })
          );

        @Effect({dispatch: false}) deletePerson = this.actions
          .pipe(
            filter(action => action instanceof DeletePersonAction),
            tap((action: DeletePersonAction) => this.formRegistry.removeForm(action.person.formKey))
          );

        constructor(private actions: Actions, private formRegistry: FormRegistry) {
        }
      }

      function personReducer(state: PersonState = defaultFormState, action: PersonActions): PersonState {
        switch (action.type) {
          case 'UpdatePersonAction': {
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
          }
          case 'DeletePersonAction': {
            const persons = {...state.persons};
            delete persons[action.person.id];
            return {
              ...state,
              persons
            };
          }
          default:
            return state;
        }
      }

      @Component({
        selector: 'rfx-test-person',
        template: `
          <div *rfxFormBinding="person.formKey; let control = formControl; let state = formState">
            <div class="person-name">{{person.firstName}} {{person.lastName}}</div>
            <div class="edit-form">
              <input type="text" class="first-name" [formControl]="control.typedGet('firstName')">
              <div class="first-name-errors"
                   *ngIf="state.fields.firstName.touched && state.fields.firstName.errors">
                {{state.fields.firstName.errors}}
              </div>
              <input type="text" class="last-name" [formControl]="control.typedGet('lastName')">
              <div class="last-name-errors"
                   *ngIf="state.fields.lastName.touched && state.fields.lastName.errors">
                {{state.fields.lastName.errors}}
              </div>
            </div>
          </div>
        `
      })
      class TestPersonComponent {
        @Input() person: Person;
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
      let storeDispatchSpy: Spy;

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

        storeService = TestBed.get(Store);
        formRegistryService = TestBed.get(FormRegistry);
        storeDispatchSpy = spyOn(storeService, 'dispatch').and.callThrough();
        fixture = TestBed.createComponent(TestContainerComponent);
        component = fixture.componentInstance;
      });

      it('should create person with person form correctly', () => {
        storeService.dispatch(new CreatePersonAction('First name', 'Last name'));
        fixture.detectChanges();

        const firstNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.first-name') || raiseError(`Test DOM Element not found!`);
        const lastNameInput: HTMLInputElement = fixture.nativeElement.querySelector('.last-name') || raiseError(`Test DOM Element not found!`);
        const personName: HTMLDivElement = fixture.nativeElement.querySelector('.person-name') || raiseError(`Test DOM Element not found!`);

        expect((personName.textContent || '').trim()).toEqual('First name Last name');
        expect(firstNameInput.value).toEqual('First name');
        expect(lastNameInput.value).toEqual('Last name');
      });

      it('should delete person with person form correctly', async(() => {
        storeService.dispatch(new CreatePersonAction('First name', 'Last name'));
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.directive(TestPersonComponent))).toBeDefined();

        component.persons.pipe(take(1)).subscribe(persons => {
          storeService.dispatch(new DeletePersonAction(persons[0]));
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.directive(TestPersonComponent))).toBeNull();
        });
      }));

      it('should react to changes of key', async(() => {
        fixture.componentInstance.persons = of(<Person[]>[{
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
      }));
    });

    describe('highly dynamic forms with binding directive and ngrx store', () => {
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

      class CreateRegularPersonAction implements Action {
        readonly type = 'CreateRegularPersonAction';

        constructor(public readonly firstName: string,
                    public readonly lastName: string) {
        }
      }

      class CreateMainPersonAction implements Action {
        readonly type = 'CreateMainPersonAction';

        constructor(public readonly firstName: string,
                    public readonly lastName: string,
                    public readonly emailAddress: string) {
        }
      }

      class DeletePersonAction implements Action {
        readonly type = 'DeletePersonAction';

        constructor(public readonly person: Person) {
        }
      }

      class UpdateRegularPersonAction implements Action {
        readonly type = 'UpdateRegularPersonAction';

        constructor(public readonly id: string,
                    public readonly firstName: string,
                    public readonly lastName: string,
                    public readonly formKey: FormRegistryKey<RegularPersonForm>) {
        }
      }

      class UpdateMainPersonAction implements Action {
        readonly type = 'UpdateMainPersonAction';

        constructor(public readonly id: string,
                    public readonly firstName: string,
                    public readonly lastName: string,
                    public readonly emailAddress: string,
                    public readonly formKey: FormRegistryKey<MainPersonForm>) {
        }
      }

      type PersonActions = UpdateRegularPersonAction | UpdateMainPersonAction | DeletePersonAction | CreateRegularPersonAction | CreateMainPersonAction;

      @Injectable()
      class PersonEffects {
        @Effect() addPersonRegular: Observable<PersonActions> = this.actions
          .pipe(
            filter(action => action instanceof CreateRegularPersonAction),
            map((action: CreateRegularPersonAction) => {
              const {firstName, lastName} = action;
              return <UpdateRegularPersonAction>{
                type: 'UpdateRegularPersonAction',
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
              };
            })
          );

        @Effect() addMainPerson: Observable<PersonActions> = this.actions
          .pipe(
            filter(action => action instanceof CreateMainPersonAction),
            map((action: CreateMainPersonAction) => {
              const {firstName, lastName, emailAddress} = action;
              return <UpdateMainPersonAction>{
                type: 'UpdateMainPersonAction',
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
              };
            })
          );

        @Effect({dispatch: false}) deletePerson = this.actions
          .pipe(
            filter(action => action instanceof DeletePersonAction),
            tap((action: DeletePersonAction) => this.formRegistry.removeForm(action.person.formKey))
          );

        constructor(private actions: Actions, private formRegistry: FormRegistry) {
        }
      }

      function personReducer(state: PersonState = defaultFormState, action: PersonActions): PersonState {
        switch (action.type) {
          case 'UpdateRegularPersonAction': {
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
          }
          case 'UpdateMainPersonAction': {
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
          }
          case 'DeletePersonAction': {
            const persons = {...state.persons};
            delete persons[action.person.id];
            return {
              ...state,
              persons
            };
          }
          default:
            return state;
        }
      }

      @Component({
        selector: 'rfx-test-person',
        template: `
          <div *rfxFormBinding="person.formKey; let control = formControl; let state = formState">
            <div class="person-name">{{person.firstName}} {{person.lastName}}</div>
            <div class="edit-form">
              <input type="text" class="first-name" [formControl]="control.typedGet('firstName')">
              <div class="first-name-errors"
                   *ngIf="state.fields.firstName.touched && state.fields.firstName.errors">
                {{state.fields.firstName.errors}}
              </div>
              <input type="text" class="last-name" [formControl]="control.typedGet('lastName')">
              <div class="last-name-errors"
                   *ngIf="state.fields.lastName.touched && state.fields.lastName.errors">
                {{state.fields.lastName.errors}}
              </div>
              <ng-container *ngIf="person.type === 'Main'">
                <input type="text" class="email-address" [formControl]="control.typedGet('emailAddress')">
                <div class="email-address-errors"
                     *ngIf="state.fields.emailAddress.touched && state.fields.emailAddress.errors">
                  {{state.fields.lastName.errors}}
                </div>
              </ng-container>
            </div>
          </div>
        `
      })
      class TestPersonComponent {
        @Input() person: Person;
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
      let storeDispatchSpy: Spy;

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

        storeService = TestBed.get(Store);
        storeDispatchSpy = spyOn(storeService, 'dispatch').and.callThrough();
        fixture = TestBed.createComponent(TestContainerComponent);
        component = fixture.componentInstance;
      });

      it('should create persons with regular person form and main person form correctly', async(() => {
        storeService.dispatch(new CreateRegularPersonAction('Regular first name', 'Regular last name'));
        storeService.dispatch(new CreateMainPersonAction('Main first name', 'Main last name', 'first.last@main.com'));
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
      }));
    });
  });
});
