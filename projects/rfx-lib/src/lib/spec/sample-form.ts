import { FormDefinitionGroup } from '../model';
import { toNumber, toString } from 'ng-rfx';

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

export interface MappingTestForm {
  name: string;
  middleName: string | null;
  age: number;
  hasFamily: boolean;
  colors: string[];
  numbers: number[];
  accepted: boolean[];
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

export const testFormDefinitionWithMapper: FormDefinitionGroup<MappingTestForm> = {
  type: 'Group',
  fields: {
    name: {
      type: 'Field',
      initialValue: 'First name',
      options: {
        mapper: 'string'
      }
    },
    middleName: {
      type: 'Field',
      initialValue: null,
      options: {
        mapper: 'string'
      }
    },
    age: {
      type: 'Field',
      initialValue: 33,
      options: {
        mapper: 'number'
      }
    },
    hasFamily: {
      type: 'Field',
      initialValue: false,
      options: {
        mapper: 'boolean'
      }
    },
    colors: {
      type: 'PrimitiveArray',
      initialValue: ['Red', 'Green', 'Blue'],
      options: {
        mapper: 'string[]'
      }
    },
    numbers: {
      type: 'PrimitiveArray',
      initialValue: [1, 2, 3],
      options: {
        mapper: 'number[]'
      }
    },
    accepted: {
      type: 'PrimitiveArray',
      initialValue: [false, false, false, false],
      options: {
        mapper: 'boolean[]'
      }
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
      options: {
        mapper: (val: TestForm['address']) => ({
          ...val,
          street: toString(val.street.toUpperCase()),
          no: toNumber(val.no)
        })
      },
      fields: {
        street: {
          type: 'Field',
          initialValue: 'Teststreet',
          options: {
            mapper: 'string'
          }
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
