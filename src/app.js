import { gsstate, gscmd } from './gsprovider';

(async () => {
  try {
    const stateReader = gsstate('192.168.2.88', 9000);
    const state = await stateReader(1);
    console.log(state); // eslint-disable-line no-console
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
  }
  try {
    const cmdWriter = gscmd('192.168.2.88', 9001);
    const command = {
      command: 1,
      sv: 3,
      nrstatus: 0,
      id_zlecenia: 0,
      id_operatora: 1,
      operator_txt: 'bsolarski',
    };
    const cmdOk = await cmdWriter(command);
    console.log(cmdOk); // eslint-disable-line no-console
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
  }
})();
