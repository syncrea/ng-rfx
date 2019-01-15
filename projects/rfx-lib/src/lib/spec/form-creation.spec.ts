import {FormDefinitionGroup} from '../model';
import {createForm, pushFormGroupArrayItem} from '../forms/form-creation';

export interface TestForm {
  name: string;
  age: number;
  colors: string[];
  children: {name: string, age: number}[];
  address: {
    street: string;
    no: number;
  };
}

const testFormDefinitionLong: FormDefinitionGroup<TestForm> = {
  type: 'Group',
  fields: {
    name: {
      type: 'Field',
      initialValue: 'Gion'
    },
    age: {
      type: 'Field',
      initialValue: 33
    },
    colors: {
      type: 'PrimitiveArray',
      initialValue: ['Red', 'Green', 'Blue']
    },
    children: {
      type: 'GroupArray',
      fields: {
        name: {
          type: 'Field',
          initialValue: 'Zoé'
        },
        age: {
          type: 'Field',
          initialValue: 0
        }
      },
      initialItems: 1
    },
    address: {
      type: 'Group',
      fields: {
        street: {
          type: 'Field',
          initialValue: 'Teststreet'
        },
        no: {
          type: 'Field',
          initialValue: 1
        }
      }
    }
  }
};

const testFormDefinitionShort: FormDefinitionGroup<TestForm> = {
  type: 'Group',
  fields: {
    name: 'Gion',
    age: 33,
    colors: ['Red', 'Green', 'Blue'],
    children: {
      type: 'GroupArray',
      fields: {
        name: 'Zoé',
        age: 0
      },
      initialItems: 1
    },
    address: {
      type: 'Group',
      fields: {
        street: 'Teststreet',
        no: 1
      }
    }
  }
};

describe('Form creation', () => {
  describe('createForm', () => {
    it('should create personForm control for primitive type', () => {
      const control = createForm<string>('Hello');
      expect(control.typedValue).toBe('Hello');
    });
  });

  describe('createForm', () => {
    it('should create personForm from longhand definition', () => {
      const form = createForm(testFormDefinitionLong);
      expect(form.typedValue).toEqual({
        name: 'Gion',
        age: 33,
        colors: ['Red', 'Green', 'Blue'],
        address: {
          street: 'Teststreet',
          no: 1
        },
        children: [{
          name: 'Zoé',
          age: 0
        }]
      });
    });

    it('should create personForm from shorthand definition', () => {
      const form = createForm(testFormDefinitionShort);
      expect(form.typedValue).toEqual({
        name: 'Gion',
        age: 33,
        colors: ['Red', 'Green', 'Blue'],
        address: {
          street: 'Teststreet',
          no: 1
        },
        children: [{
          name: 'Zoé',
          age: 0
        }]
      });
    });
  });

  describe('pushFormGroupArrayItem', () => {
    it('should add new personForm item as per definition', () => {
      const form = createForm(testFormDefinitionShort);
      pushFormGroupArrayItem(testFormDefinitionShort.fields.children, form.typedGet('children'), {
        name: 'New Child',
        age: 0
      });

      expect(form.typedValue).toEqual({
        name: 'Gion',
        age: 33,
        colors: ['Red', 'Green', 'Blue'],
        address: {
          street: 'Teststreet',
          no: 1
        },
        children: [{
          name: 'Zoé',
          age: 0
        }, {
          name: 'New Child',
          age: 0
        }]
      });
    });
  });
});
