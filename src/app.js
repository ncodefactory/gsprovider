import { gsstatus } from './gsprovider';

(async () => {
  try {
    const statusReder = gsstatus('192.168.1.147', 9000);
    const status = await statusReder(1);
    console.log(status); // eslint-disable-line no-console
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
  }
})();
