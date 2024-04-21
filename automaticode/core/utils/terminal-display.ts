import * as figlet from 'figlet';
import * as chalk from 'chalk';
import { LIGHT_HEX, PRIMARY_HEX, SECONDARY_HEX } from './constants';

export function ChalkBoldPrimary(text: string) {
  return chalk.hex(PRIMARY_HEX).bold(text);
}

export function ChalkBoldSecondary(text: string) {
  return chalk.hex(SECONDARY_HEX).bold(text);
}

export function ChalkLight(text: string) {
  return chalk.hex(LIGHT_HEX).bold(text);
}

export function GreetingBanner() {
  console.log(ChalkBoldPrimary(figlet.textSync('Automaticode.io')));
  console.log(
    `${ChalkLight('⚡')} ${ChalkBoldSecondary(
      'Powered by Evo Laboratory - https://evolabs.io',
    )}`,
  );
}
