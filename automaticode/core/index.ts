import StartInquirer from './command-interfaces/start';
import { GreetingBanner } from './utils/terminal-display';

async function main() {
  GreetingBanner();
  await StartInquirer();
}

main();
