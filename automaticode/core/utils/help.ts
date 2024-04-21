export function EnumToArray(enumObject: any): string[] {
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

export function FstLetterUppercase(filename: string): string {
  if (typeof filename !== 'string') {
    console.error('[ HELPER ][ FstLetterUppercase ] Input is not a string');
    return filename;
  }
  return filename.charAt(0).toUpperCase() + filename.slice(1);
}

export function FstLetterLowerCase(filename: string): string {
  if (typeof filename !== 'string') {
    console.error('[ HELPER ][ FstLetterLowerCase ] Input is not a string');
    return filename;
  }
  return filename.charAt(0).toLowerCase() + filename.slice(1);
}

export function KebabToPascalCase(input: string): string {
  if (typeof input !== 'string') {
    console.error(`[ HELPER ][ KebabToPascalCase ] Input is not a string.`);
    return input;
  }
  const result = input
    .split('-')
    .map((word) => FstLetterUppercase(word.toLowerCase()))
    .reduce((result, currWord) => {
      return (result += currWord);
    }, '');
  return result;
}

export function KebabToCamelCase(input: string): string {
  if (typeof input !== 'string') {
    console.error(`[ HELPER ][ KebabToCamelCase ] Input is not a string.`);
    return input;
  }
  return FstLetterLowerCase(KebabToPascalCase(input));
}

export function KebabToConstantCase(input: string): string {
  if (typeof input !== 'string') {
    console.error(`[ HELPER ][ KebabToConstantCase ] Input is not a string.`);
    return input;
  }
  return input.replace('-', '_').toUpperCase();
}
