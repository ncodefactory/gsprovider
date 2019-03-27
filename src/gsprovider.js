import tcpclient from './tcpclient';

const millisecond = 1.1574074074074073e-8;

const readInt8 = (data) => {
  const result = data.buffer.readUInt8(data.index);
  data.index += 1; // eslint-disable-line no-param-reassign
  return result;
};

const readInt16 = (data) => {
  const result = data.buffer.readUInt16LE(data.index);
  data.index += 2; // eslint-disable-line no-param-reassign
  return result;
};

const readInt32 = (data) => {
  const result = data.buffer.readUInt32LE(data.index);
  data.index += 4; // eslint-disable-line no-param-reassign
  return result;
};

const readDouble = (data) => {
  const result = data.buffer.readDoubleLE(data.index);
  data.index += 12; // eslint-disable-line no-param-reassign
  return result;
};

const readFloat = (data) => {
  const result = data.buffer.readFloatLE(data.index);
  data.index += 4; // eslint-disable-line no-param-reassign
  return result;
};

const readDate = (data) => {
  const result = data.buffer.readDoubleLE(data.index);
  data.index += 8; // eslint-disable-line no-param-reassign
  const milliseconds = result / millisecond;
  const date = new Date(1899, 12, 30, 0, 0, 0);
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};

const readct = (data) => {
  const result = {};
  result.cykle = readInt32(data);
  result.cykleG = readDouble(data);
  result.time = readInt32(data);
  result.t_mp = readInt32(data);
  result.t_awarii = readInt32(data);
  result.t_przezbrajania = readInt32(data);
  result.t_ustawiania = readInt32(data);
  result.t_postojP = readInt32(data);
  result.t_postojNP = readInt32(data);
  result.t_none = readInt32(data);
  result.c_awarii = readInt16(data);
  result.c_przezbrajania = readInt16(data);
  result.c_ustawiania = readInt16(data);
  result.c_postojP = readInt16(data);
  result.c_postojNP = readInt16(data);
  result.c_none = readInt16(data);
  result.kwh = readDouble(data);
  result.braki = readFloat(data);
  result.gramatura = readDouble(data);
  result.gramatura2 = readFloat(data);
  result.kwh_pp = readFloat(data);
  result.kwh_pnp = readFloat(data);
  result.kwh_pust = readFloat(data);
  result.kwh_awarie = readFloat(data);
  result.RSTime = [
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
    readInt32(data),
  ];
  result.t_andon = readInt32(data);
  result.t_andont = readInt32(data);
  result.c_andon = readInt16(data);
  result.c_andont = readInt16(data);

  return result;
};

const readev = (data) => {
  const result = {};
  result.tev = readDate(data);
  result.tevoff = readDate(data);
  result.tevstatus = readDate(data);
  result.tevseria = readDate(data);
  result.tevoperator = readDate(data);
  result.tevandon = readDate(data);
  result.tevalert = readDate(data);
  result.tev_rezerwa = readDate(data);

  return result;
};

const readEventListItem = (data) => {
  const result = {};
  result.typ = readInt32(data);
  result.v = readInt32(data);
  result.czas = readDate(data);

  return result;
};

const writeInt16 = (data, value) => {
  const result = data.buffer.writeUInt16LE(value, data.index);
  data.index += 2; // eslint-disable-line no-param-reassign
  return result;
};

const writeInt32 = (data, value) => {
  const result = data.buffer.writeInt32LE(value, data.index);
  data.index += 4; // eslint-disable-line no-param-reassign
  return result;
};

const writeBool = (data, value) => {
  const result = data.buffer.writeInt32LE(value === true ? 1 : 0, data.index);
  data.index += 4; // eslint-disable-line no-param-reassign
  return result;
};

const statusToJSON = (buffer) => {
  const result = {};
  const data = { buffer, index: 0 };
  result.command = readInt16(data);
  result.sv = readInt16(data);
  result.stacja = readInt16(data);
  result.index = readInt16(data);
  result.start_stacji = readDate(data);
  result.aktualizacja_wykresow = readDate(data);
  result.noSys = readInt16(data);
  result.ErrorCode = readInt16(data);
  result.id_zlecemia = readInt32(data);
  result.id_operatora = readInt32(data);
  result.id_ur = readInt32(data);
  result.NrStatus = readInt8(data);
  result.NrStatusRS = readInt8(data);
  result.bityb = readInt8(data);
  result.bityb2 = readInt8(data);
  data.index += 4;
  result.ct = [readct(data), readct(data), readct(data), readct(data)];
  result.ev = readev(data);
  result.EventList = [
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
    readEventListItem(data),
  ];
  result.CzasCyklu = readInt32(data);
  result.CzasCykl2 = readInt32(data);
  result.Wydajnosc = readInt32(data);
  result.Sek0undOdOstatniegoCyklu = readInt32(data);
  result.cmms = readInt32(data);
  result.cmms2 = readInt32(data);
  result.andon = readInt8(data);

  return result;
};

const gsreadstate = ({
  host, port, timeout, sv, autoryzacja, command, asService, index,
}) => new Promise(async (resolve, reject) => {
  try {
    const request = Buffer.allocUnsafe(16);
    const data = { index: 0, buffer: request };
    writeInt32(data, autoryzacja);
    writeInt16(data, sv);
    writeInt16(data, command);
    writeBool(data, asService);
    writeInt16(data, index);
    const response = await tcpclient(host, port, timeout)(request);
    resolve(statusToJSON(response));
  } catch (error) {
    reject(error);
  }
});

const gsstate = (host, port, timeout = 3000) => sv => gsreadstate({
  host,
  port,
  timeout,
  sv,
  autoryzacja: 5678,
  command: 1,
  asService: false,
  index: 0,
});

export { gsstate }; // eslint-disable-line import/prefer-default-export
