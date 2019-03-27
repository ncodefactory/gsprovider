import { gsstate } from './gsprovider';

(async () => {
  try {
    const stateReder = gsstate('192.168.2.88', 9000);
    const state = await stateReder(1);
    console.log(state); // eslint-disable-line no-console
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
  }
})();
