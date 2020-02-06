import { FormDefinitionGroup } from '../model';

export interface TestForm {
  name: string;
  middleName: string | null;
  age: number;
  colors: string[];
  children: { name: string, age: number }[];
  address: {
    street: string;
    no: number;
  };
  favoriteNumber: number | null;
}

export const testFormDefinitionLong: FormDefinitionGroup<TestForm> = {
  type: 'Group',
  fields: {
    name: {
      type: 'Field',
      initialValue: 'First name'
    },
    middleName: {
      type: 'Field',
      initialValue: null
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
      group: {
        type: 'Group',
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
    },
    favoriteNumber: {
      type: 'Field',
      initialValue: null
    }
  }
};

export const testFormDefinitionShort: FormDefinitionGroup<TestForm> = {
  type: 'Group',
  fields: {
    name: 'First name',
    middleName: null,
    age: 33,
    colors: ['Red', 'Green', 'Blue'],
    children: {
      type: 'GroupArray',
      group: {
        type: 'Group',
        fields: {
          name: 'Zoé',
          age: 0
        }
      },
      initialItems: 1
    },
    address: {
      type: 'Group',
      fields: {
        street: 'Teststreet',
        no: 1
      }
    },
    favoriteNumber: null
  }
};
