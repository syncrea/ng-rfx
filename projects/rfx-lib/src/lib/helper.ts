import {FormRegistryKey, PrimitiveType} from './model';
import {TypedFormRegistryKey} from './model';

export function deepGet<T, K1 extends keyof T>(object: T, path: [K1], throwOnMiss?: boolean): T[K1];
export function deepGet<T, K1 extends keyof T, K2 extends keyof T[K1]>(object: T, path: [K1, K2], throwOnMiss?: boolean): T[K1][K2];
export function deepGet<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(object: T, path: [K1, K2, K3], throwOnMiss?: boolean): T[K1][K2][K3];
export function deepGet<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(object: T, path: [K1, K2, K3, K4], throwOnMiss?: boolean): T[K1][K2][K3][K4];
export function deepGet<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4]>(object: T, path: [K1, K2, K3, K4, K5], throwOnMiss?: boolean): T[K1][K2][K3][K4][K5];
export function deepGet<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5]>(object: T, path: [K1, K2, K3, K4, K5, K6], throwOnMiss?: boolean): T[K1][K2][K3][K4][K5][K6];
export function deepGet<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5], K7 extends keyof T[K1][K2][K3][K4][K5][K6]>(object: T, path: [K1, K2, K3, K4, K5, K6, K7], throwOnMiss?: boolean): T[K1][K2][K3][K4][K5][K6][K7];
export function deepGet<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5], K7 extends keyof T[K1][K2][K3][K4][K5][K6], K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]>(object: T, path: [K1, K2, K3, K4, K5, K6, K7, K8], throwOnMiss?: boolean): T[K1][K2][K3][K4][K5][K6][K7][K8];
export function deepGet<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3], K5 extends keyof T[K1][K2][K3][K4], K6 extends keyof T[K1][K2][K3][K4][K5], K7 extends keyof T[K1][K2][K3][K4][K5][K6], K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7], K9 extends keyof T[K1][K2][K3][K4][K5][K6][K7][K8]>(object: T, path: [K1, K2, K3, K4, K5, K6, K7, K8, K9], throwOnMiss?: boolean): T[K1][K2][K3][K4][K5][K6][K7][K8][K9];
export function deepGet(object: any, path: string[], throwOnMiss?: boolean): any;
export function deepGet(object: any, path: string[], throwOnMiss = false): any {
  return path
    .reduce((partialState, pathSegment) => {
      if (throwOnMiss && typeof partialState[pathSegment] !== 'object') {
        throw new Error(
          `Path '${path}' could not be resolved in object ${object}. Segment '${pathSegment}' was not referring to type object.`
        );
      }
      return partialState[pathSegment] || {};
    }, object);
}

export function deepEquals(x: any, y: any) {
  if (x === y) {
    return true; // if both x and y are null or undefined and exactly the same
  } else if (!(x instanceof Object) || !(y instanceof Object)) {
    return false; // if they are not strictly equal, they both need to be Objects
  } else if (x.constructor !== y.constructor) {
    // they must have the exact same prototype chain, the closest we can do is
    // test their constructor.
    return false;
  } else {
    for (const p in x) {
      if (!x.hasOwnProperty(p)) {
        continue; // other properties were tested using x.constructor === y.constructor
      }
      if (!y.hasOwnProperty(p)) {
        return false; // allows to compare x[ p ] and y[ p ] when set to undefined
      }
      if (x[p] === y[p]) {
        continue; // if they have the same strict value or identity then they are equal
      }
      if (typeof (x[p]) !== 'object') {
        return false; // Numbers, Strings, Functions, Booleans must be strictly equal
      }
      if (!deepEquals(x[p], y[p])) {
        return false;
      }
    }
    for (const p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  }
}

export function isPrimitiveType(value: any): value is PrimitiveType {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null;
}

export function isPrimitiveListType(list: any): list is PrimitiveType[] {
  return Array.isArray(list) && isPrimitiveType(list[0]);
}

export function uuid(placeholder?: number): string {
  // @ts-ignore
  // tslint:disable-next-line
  return placeholder ? (placeholder ^ Math.random() * 16 >> placeholder / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

export function normalizeKey(key: FormRegistryKey<any>): TypedFormRegistryKey<any> {
  if (typeof key === 'string') {
    return {id: key};
  } else {
    return key;
  }
}

export function raiseError(message: string): never {
  throw new Error(message);
}
