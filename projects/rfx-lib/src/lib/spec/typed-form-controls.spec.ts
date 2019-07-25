import {TypedFormArray, TypedFormControl, TypedFormGroup} from '../forms/typed-form-control';
import createSpy = jasmine.createSpy;
import { raiseError } from '../helper';

describe('Typed personForm controls', () => {
  describe('typed personForm control', () => {
    it('should initialize with correct value and return', () => {
      const control = new TypedFormControl<string>('Test');
      expect(control.typedValue).toBe('Test');
    });

    it('should update correctly by using setValue', () => {
      const control = new TypedFormControl<string>('Test');
      control.setValue('Updated');
      expect(control.typedValue).toBe('Updated');
    });

    it('should update correctly by using patchValue', () => {
      const control = new TypedFormControl<string>('Test');
      control.patchValue('Patched');
      expect(control.typedValue).toBe('Patched');
    });

    it('should reset correctly by using reset', () => {
      const control = new TypedFormControl<string>('Test');
      control.reset('Reset');
      expect(control.typedValue).toBe('Reset');
    });
  });

  describe('typed personForm group', () => {
    interface SimpleForm {
      readonly firstName: string;
      readonly lastName: string;
    }

    interface NestedFormAddress {
      readonly street: string;
      readonly no: number;
    }

    interface NestedForm {
      readonly address: NestedFormAddress;
    }

    interface ArrayForm {
      readonly addresses: NestedFormAddress[];
    }

    it('should initialize with correct value and return', () => {
      const control = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl('Firstname'),
        lastName: new TypedFormControl('Lastname')
      });
      expect(control.typedValue).toEqual({
        firstName: 'Firstname',
        lastName: 'Lastname'
      });
    });

    it('should update correctly by using setValue', () => {
      const control = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl('Firstname'),
        lastName: new TypedFormControl('Lastname')
      });
      control.setValue({
        firstName: 'Updated Firstname',
        lastName: 'Updated Lastname'
      });
      expect(control.typedValue).toEqual({
        firstName: 'Updated Firstname',
        lastName: 'Updated Lastname'
      });
    });

    it('should update correctly by using patchValue', () => {
      const control = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl('Firstname'),
        lastName: new TypedFormControl('Lastname')
      });
      control.patchValue({
        firstName: 'Patched Firstname',
        lastName: 'Patched Lastname'
      });
      expect(control.typedValue).toEqual({
        firstName: 'Patched Firstname',
        lastName: 'Patched Lastname'
      });
    });

    it('should partially update correctly by using patchValue', () => {
      const control = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl('Firstname'),
        lastName: new TypedFormControl('Lastname')
      });
      control.patchValue({
        firstName: 'Patched Firstname'
      });
      expect(control.typedValue).toEqual({
        firstName: 'Patched Firstname',
        lastName: 'Lastname'
      });
    });

    it('should reset correctly by using reset', () => {
      const control = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl('Firstname'),
        lastName: new TypedFormControl('Lastname')
      });
      control.reset({
        firstName: 'Reset Firstname',
        lastName: 'Reset Lastname'
      });
      expect(control.typedValue).toEqual({
        firstName: 'Reset Firstname',
        lastName: 'Reset Lastname'
      });
    });

    it('should return correct primitive field using typed get', () => {
      const control = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl('Firstname'),
        lastName: new TypedFormControl('Lastname')
      });
      expect(control.typedGet('firstName').typedValue).toBe('Firstname');
    });

    it('should return correct group field using typed get', () => {
      const control = new TypedFormGroup<NestedForm>({
        address: new TypedFormGroup<NestedFormAddress>({
          street: new TypedFormControl('Teststreet'),
          no: new TypedFormControl(1)
        })
      });
      expect(control.typedGet('address').typedGet('street').typedValue).toBe('Teststreet');
    });

    it('should return correct array field using typed get', () => {
      const control = new TypedFormGroup<ArrayForm>({
        addresses: new TypedFormArray<NestedFormAddress>([
          new TypedFormGroup<NestedFormAddress>({
            street: new TypedFormControl('Teststreet'),
            no: new TypedFormControl(1)
          }),
          new TypedFormGroup<NestedFormAddress>({
            street: new TypedFormControl('Teststreet'),
            no: new TypedFormControl(2)
          })
        ])
      });
      expect(control.typedGet('addresses').typedValue).toEqual([{
        street: 'Teststreet',
        no: 1
      }, {
        street: 'Teststreet',
        no: 2
      }]);
    });
  });

  describe('typed primitive personForm array', () => {
    it('should initialize with correct value and return', () => {
      const control = new TypedFormArray<string>([
        new TypedFormControl('Test 1'),
        new TypedFormControl('Test 2'),
        new TypedFormControl('Test 3')
      ]);
      expect(control.typedValue).toEqual(['Test 1', 'Test 2', 'Test 3']);
    });

    it('should update correctly by using setValue', () => {
      const control = new TypedFormArray<string>([
        new TypedFormControl('Test 1'),
        new TypedFormControl('Test 2'),
        new TypedFormControl('Test 3')
      ]);
      control.setValue(['Updated 1', 'Updated 2', 'Updated 3']);
      expect(control.typedValue).toEqual(['Updated 1', 'Updated 2', 'Updated 3']);
    });

    it('should update correctly by using patchValue', () => {
      const control = new TypedFormArray<string>([
        new TypedFormControl('Test 1'),
        new TypedFormControl('Test 2'),
        new TypedFormControl('Test 3')
      ]);
      control.patchValue(['Updated 1', 'Updated 2']);
      expect(control.typedValue).toEqual(['Updated 1', 'Updated 2', 'Test 3']);
    });

    it('should reset correctly by using reset', () => {
      const control = new TypedFormArray<string>([
        new TypedFormControl('Test 1'),
        new TypedFormControl('Test 2'),
        new TypedFormControl('Test 3')
      ]);
      control.reset(['Reset 1', 'Reset 2', 'Reset 3']);
      expect(control.typedValue).toEqual(['Reset 1', 'Reset 2', 'Reset 3']);
    });
  });

  describe('typed complex personForm array', () => {
    interface SimpleForm {
      readonly firstName: string;
      readonly lastName: string;
    }

    it('should initialize with correct value and return', () => {
      const control = new TypedFormArray<SimpleForm>([
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl('Firstname 1'),
          lastName: new TypedFormControl('Lastname 1')
        }),
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl('Firstname 2'),
          lastName: new TypedFormControl('Lastname 2')
        })
      ]);
      expect(control.typedValue).toEqual([{
        firstName: 'Firstname 1',
        lastName: 'Lastname 1'
      }, {
        firstName: 'Firstname 2',
        lastName: 'Lastname 2'
      }]);
    });

    it('should update correctly by using setValue', () => {
      const control = new TypedFormArray<SimpleForm>([
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl('Firstname 1'),
          lastName: new TypedFormControl('Lastname 1')
        }),
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl('Firstname 2'),
          lastName: new TypedFormControl('Lastname 2')
        })
      ]);
      control.setValue([{
        firstName: 'Updated Firstname 1',
        lastName: 'Updated Lastname 1'
      }, {
        firstName: 'Updated Firstname 2',
        lastName: 'Updated Lastname 2'
      }]);
      expect(control.typedValue).toEqual([{
        firstName: 'Updated Firstname 1',
        lastName: 'Updated Lastname 1'
      }, {
        firstName: 'Updated Firstname 2',
        lastName: 'Updated Lastname 2'
      }]);
    });

    it('should return correct typed array element', () => {
      const control = new TypedFormArray<SimpleForm>([
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl('Firstname 1'),
          lastName: new TypedFormControl('Lastname 1')
        }),
        new TypedFormGroup<SimpleForm>({
          firstName: new TypedFormControl('Firstname 2'),
          lastName: new TypedFormControl('Lastname 2')
        })
      ]);
      expect((control.typedAt(1) || raiseError('Element at index 1 could not be obtained.')).typedGet('firstName').typedValue).toBe('Firstname 2');
    });
  });

  describe('complex mixed personForm controls', () => {
    interface Address {
      street: string;
      no: number;
    }
    interface Child {
      name: string;
      age: number;
    }
    interface ComplexForm {
      name: string;
      age: number;
      colors: string[];
      children: Child[];
      address: Address;
    }

    it('should initialize correctly', () => {
      const control = new TypedFormGroup<ComplexForm>({
        name: new TypedFormControl('Name'),
        age: new TypedFormControl(30),
        colors: new TypedFormArray([
          new TypedFormControl('Red'),
          new TypedFormControl('Green'),
          new TypedFormControl('Blue')
        ]),
        address: new TypedFormGroup<Address>({
          street: new TypedFormControl('Teststreet'),
          no: new TypedFormControl(1)
        }),
        children: new TypedFormArray([
          new TypedFormGroup<Child>({
            name: new TypedFormControl('Child 1'),
            age: new TypedFormControl(0)
          })
        ])
      });
      expect(control.typedValue).toEqual({
        name: 'Name',
        age: 30,
        colors: ['Red', 'Green', 'Blue'],
        address: {
          street: 'Teststreet',
          no: 1
        },
        children: [{
          name: 'Child 1',
          age: 0
        }]
      });
    });

    it('should update correctly', () => {
      const control = new TypedFormGroup<ComplexForm>({
        name: new TypedFormControl('Name'),
        age: new TypedFormControl(30),
        colors: new TypedFormArray([
          new TypedFormControl('Red'),
          new TypedFormControl('Green'),
          new TypedFormControl('Blue')
        ]),
        address: new TypedFormGroup<Address>({
          street: new TypedFormControl('Teststreet'),
          no: new TypedFormControl(1)
        }),
        children: new TypedFormArray([
          new TypedFormGroup<Child>({
            name: new TypedFormControl('Child 1'),
            age: new TypedFormControl(0)
          })
        ])
      });
      control.setValue({
        name: 'Updated Name',
        age: 33,
        colors: ['Yellow', 'Magenta', 'Cyan'],
        address: {
          street: 'Newstreet',
          no: 2
        },
        children: [{
          name: 'Child 2',
          age: 12
        }]
      });

      expect(control.typedValue).toEqual({
        name: 'Updated Name',
        age: 33,
        colors: ['Yellow', 'Magenta', 'Cyan'],
        address: {
          street: 'Newstreet',
          no: 2
        },
        children: [{
          name: 'Child 2',
          age: 12
        }]
      });
    });
  });

  describe('typedValueChanges', () => {
    interface SimpleForm {
      readonly firstName: string;
      readonly lastName: string;
    }

    it('should emit changes on form control', () => {
      const control = new TypedFormControl<string>('Default value');
      const subscribeSpy = createSpy();
      control.typedValueChanges.subscribe(subscribeSpy);
      control.setValue('Changed value');
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
      expect(subscribeSpy).toHaveBeenCalledWith('Changed value');
    });

    it('should emit changes on form group', () => {
      const control = new TypedFormGroup<SimpleForm>({
        firstName: new TypedFormControl('Initial first name'),
        lastName: new TypedFormControl('Initial last name')
      });
      const subscribeSpy = createSpy();
      control.typedValueChanges.subscribe(subscribeSpy);
      control.patchValue({
        firstName: 'Changed first name'
      });
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
      expect(subscribeSpy).toHaveBeenCalledWith({
        firstName: 'Changed first name',
        lastName: 'Initial last name'
      });
    });

    it('should emit changes on native form array', () => {
      const control = new TypedFormArray<SimpleForm>([
        new TypedFormGroup({
          firstName: new TypedFormControl('Initial first name 1'),
          lastName: new TypedFormControl('Initial last name 1')
        }),
        new TypedFormGroup({
          firstName: new TypedFormControl('Initial first name 2'),
          lastName: new TypedFormControl('Initial last name 2')
        })
      ]);
      const subscribeSpy = createSpy();
      control.typedValueChanges.subscribe(subscribeSpy);
      (control.typedAt(1) || raiseError('Element at index 1 could not be obtained.')).patchValue({firstName: 'Changed first name 2'});
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
      expect(subscribeSpy).toHaveBeenCalledWith([{
        firstName: 'Initial first name 1',
        lastName: 'Initial last name 1'
      }, {
        firstName: 'Changed first name 2',
        lastName: 'Initial last name 2'
      }]);
    });

    it('should emit changes on form group array', () => {
      const control = new TypedFormArray<string>([
        new TypedFormControl('Apples'),
        new TypedFormControl('Bananas'),
        new TypedFormControl('Strawberries')
      ]);
      const subscribeSpy = createSpy();
      control.typedValueChanges.subscribe(subscribeSpy);
      (control.typedAt(2) || raiseError('Element at index 2 could not be obtained.')).setValue('Raspberries');
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
      expect(subscribeSpy).toHaveBeenCalledWith([
        'Apples',
        'Bananas',
        'Raspberries'
      ]);
    });
  });
});
