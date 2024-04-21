// * GDK Application Shell Default File
import { customAlphabet } from 'nanoid';

export function EnumToArray(enumObject: object): string[] {
  if (typeof enumObject !== 'object') {
    console.error(
      `[ HELPER ][ EnumsToList ] Input is not an valid Enum Object.`,
    );
    return [];
  }
  const result = Object.keys(enumObject).map((property: string) => {
    return enumObject[property];
  });
  return result;
}

export function ExtractObjectId(target: any) {
  if (typeof target === 'string') {
    return target;
  } else if (typeof target === 'object' && target._id) {
    return target._id;
  } else {
    throw new Error(
      `[ HELPER ] [ ExtractObjectId ] Cannot ExtractObjectId from target ( ${typeof target})`,
    );
  }
}

export function RandomCode(strRange: string, count: number) {
  const code = customAlphabet(strRange, count);
  return code();
}

export function RandomNumber(count = 6) {
  return RandomCode('12345678910', count);
}

export function PromisedTimeout(second: number) {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
}

export function MatchPropertiesFromObj(oriObj: object, properties: string[]) {
  return properties.reduce((result, prop) => {
    if (oriObj[`${prop}`]) {
      result[`${prop}`] = oriObj[`${prop}`];
    }
    return result;
  }, {});
}

export function CheckTwoArrayHasCommon(fstArr: any[], sndArr: any[]): boolean {
  return fstArr.some((item) => sndArr.includes(item));
}

export function ParseAnyToBoolean(input: any): boolean {
  const inputText = `${input}`.toUpperCase();
  const TRUE_VARIANTS = ['TRUE', 'T'];
  const FALSE_VARIANTS = ['FALSE', 'F'];
  if (TRUE_VARIANTS.includes(inputText)) {
    return true;
  } else if (FALSE_VARIANTS.includes(inputText)) {
    return false;
  } else {
    return false;
  }
}

export function ParseQueryStrToTypedList<T>(input: any): T[] {
  if (typeof input === 'string') {
    return input.split(',') as T[];
  } else {
    return [];
  }
}
