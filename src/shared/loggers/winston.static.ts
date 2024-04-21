// * GDK Application Shell Default File
// * Define your severity levels.
export const WINSTON_LEVELS: { [key: string]: number } = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

export const WINSTON_COLORS: { [key: string]: string } = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'white',
  silly: 'white',
};

export const LOGGER_TIMESTAMP_FORMAT = 'MM/DD/YYYY, h:mm:ss A';
