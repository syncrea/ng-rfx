# ng-rfx - Angular Reactive Forms Extension

**A simple toolkit for Angular Reactive Forms, to build scalable, type-safe and dynamic forms.**

THIS LIBRARY IS IN RELEASE CANDIDATE MODE AND THE CODE AS WELL AS THE DOCUMENTATION
IS NOT YET CONSIDERED STABLE!

Project Documentation Website: [https://syncrea.github.io/ng-rfx/]

## Reduce the complexity of your form implementations

Have you ever implemented large and dynamic forms using the standard Angular Reactive Forms module? 
If you have, you probably know the pain of implementing forms in your application. This library aims 
to solve this by providing the necessary toolkit to build scalable forms.

## Key features of ng-rfx

- Design your forms using simple TypeScript interfaces!
- Type-safety from design to implementation
- Create forms declaratively using form definitions
- Centralized form registry with typed keys to maintain type-safety
- Redux / ngrx friendly by using serializable keys
- Binding directive to obtain typed form controls and state directly in your view!

## Installation

```npm install --save ng-rfx```

## Usage

### Form Model and Typed Form Controls

One of the core features of ng-rfx is to provide simple type-safety for your forms. You can
leverage the utilities of ng-rfx without importing any NgModule in your application. Just 
use ng-rfx typed form controls over the standard form controls of Angular. Start by defining
your forms using a simple interface.

```typescript
interface SimpleForm {
  firstName: string;
  lastName: string;
}
```

Now you can use the typed form controls of ng-rfx and get rid of the no. 1 pain while
implementing forms. Missing type information in forms can ruin the day (and your whole project!).

```typescript
import {TypedFormGroup, TypedFormControl} from 'ng-rfx';

const control = new TypedFormGroup<SimpleForm>({
  firstName: new TypedFormControl<string>('First name'),
  lastName: new TypedFormControl<string>('Last name')
});
```

Typed form controls are inheriting from their counterpart in the standard Angular forms module.
We know three types of form controls:

|ng-rfx control       | inherits from | Type-safe API
|:--------------------|:--------------|---
| TypedFormControl<T> | FormControl   | `constructor(formState?: T, validatorOrOpts?: ..., asyncValidator?: ...)`
|                     |               | `get typedValue(): T`
|                     |               | `patchValue(value: T, options?: {...}`
|                     |               | `setValue(value: T, options?: {...}`
|                     |               | `reset(formState?: T, options?: {...}`
|                     |               | `get typedValueChanges(): Observable<T>`
| TypedFormGroup<F>   | FormGroup     | `constructor(controls?: {[K in keyof F]: TypedFormGroupChildInternal<F, K>}, validatorOrOpts?: ..., asyncValidator?: ...)`
|                     |               | `get typedValue(): F`
|                     |               | `typedGet<K extends keyof F>(key: K): TypedFormGroupChildInternal<F, K>`
|                     |               | `patchValue(value: Partial<F>, options?: {...})`
|                     |               | `setValue(value: F, options?: {...}`
|                     |               | `reset(formState?: F, options?: {...}`
|                     |               | `get typedValueChanges(): Observable<F>`
| TypedFormArray<T>   | FormArray     | `constructor(controls?: T extends PrimitiveType ? TypedFormControl<T>[] : TypedFormGroup<T>[], validatorOrOpts?: ..., asyncValidator?: ...)`
|                     |               | `get typedValue(): T[]`
|                     |               | `typedAt(index: number): T`
|                     |               | `patchValue(value: T[], options?: {...})`
|                     |               | `setValue(value: T[], options?: {...}`
|                     |               | `reset(formState?: T[], options?: {...}`
|                     |               | `get typedValueChanges(): Observable<T[]>`

You can use the new typed methods to handle your forms in a type-safe way:

```typescript
control.setValue({
  firstName: 'Updated first',
  lastName: 'Updated last'
});
```

Inside of your view, you can access the typed children of your form group to
create form control bindings:

```html
<input [formControl]="control.typedGet('firstName')"  type="text">
```

... documentation to be continued
