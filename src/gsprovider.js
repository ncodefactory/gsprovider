import tcpclient from '@ncodefactory/tcpipcli';

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

const doubleToDate = (value) => {
  const milliseconds = value / millisecond;
  const date = new Date(1899, 11, 30, 0, 0, 0);
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};

const readDate = (data) => {
  const result = data.buffer.readDoubleLE(data.index);
  data.index += 8; // eslint-disable-line no-param-reassign
  return doubleToDate(result);
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

const stateToJSON = (buffer) => {
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

const gsReadState = ({
  host, port, timeout, sv, autoryzacja, command, asService, index,
}) => new Promise(async (resolve, reject) => {
  try {
    const request = Buffer.alloc(12);
    request.writeInt32LE(autoryzacja, 0);
    request.writeUInt16LE(sv, 4);
    request.writeInt8(command, 6);
    if (asService != null) {
      request.writeInt8(1, 7);
    }

    request.writeUInt16LE(index, 8);

    const response = await tcpclient(host, port, timeout)(request);
    resolve(stateToJSON(response));
  } catch (error) {
    reject(error);
  }
});

const gsstate = (host, port, timeout = 3000) => sv => gsReadState({
  host,
  port,
  timeout,
  sv,
  autoryzacja: 5678,
  command: 1,
  asService: false,
  index: 0,
});

const cmdOkToJSON = (buffer) => {
  const result = {};
  result.code = buffer.readUInt32LE(0);
  const value = buffer.readDoubleLE(8);
  result.dt = doubleToDate(value);
  return result;
};

/* eslint-disable camelcase */
const gsWriteCommand = ({
  host,
  port,
  timeout,
  command,
  commandKey,
  sv,
  test,
  nrstatus,
  id_zlecenia,
  id_operatora,
  operator_txt,
  produkt,
  zlecenie,
  opis,
  tools,
  toll_id,
  gniazdo,
  pakiet,
  zamowienie,
  optcc,
  nocc,
  optw,
  optgniazd,
  optgramatura,
  gramatura2,
  optcP,
  optcU,
  inspekcja,
  inspekcja_txt,
  id_pbw,
  id_opp,
  id_rezerwa,
  id_pur,
  pur_txt,
  sr,
}) => new Promise(async (resolve, reject) => {
  try {
    const request = Buffer.alloc(1020);
    request.writeInt8(command, 0);
    request.writeInt32LE(commandKey, 4);
    request.writeUInt16LE(sv, 8);
    request.writeInt32LE(test, 12);
    request.writeInt8(nrstatus, 16);
    request.writeInt32LE(id_zlecenia, 20);
    request.writeInt32LE(id_operatora, 24);
    if (operator_txt != null) {
      request.writeInt8(operator_txt.length, 28);
      request.write(operator_txt, 29);
    }

    if (produkt != null) {
      request.writeInt8(produkt.length, 109);
      request.write(operator_txt, 110);
    }

    if (zlecenie != null) {
      request.writeInt8(zlecenie.length, 210);
      request.write(zlecenie, 211);
    }

    if (opis != null) {
      request.writeInt8(opis.length, 311);
      request.write(opis, 312);
    }

    if (tools != null) {
      request.writeInt8(tools.length, 512);
      request.write(tools, 513);
    }

    request.writeInt32LE(toll_id, 616);
    request.writeFloatLE(gniazdo, 620);
    request.writeFloatLE(pakiet, 624);
    request.writeInt32LE(zamowienie, 628);
    request.writeInt32LE(optcc, 632);
    request.writeFloatLE(nocc, 636);
    request.writeInt32LE(optw, 640);
    request.writeInt32LE(optgniazd, 644);
    request.writeFloatLE(optgramatura, 648);
    request.writeFloatLE(gramatura2, 652);
    request.writeInt32LE(optcP, 656);
    request.writeInt32LE(optcU, 660);
    request.writeInt32LE(inspekcja, 664);
    if (inspekcja_txt != null) {
      request.writeInt8(inspekcja_txt.length, 668);
      request.write(inspekcja_txt, 669);
    }

    request.writeInt32LE(id_pbw, 820);
    request.writeInt32LE(id_opp, 824);
    request.writeInt32LE(id_rezerwa, 828);
    request.writeInt32LE(id_pur, 832);
    if (pur_txt != null) {
      request.writeInt8(pur_txt.length, 836);
      request.write(pur_txt, 837);
    }

    if (sr != null) {
      request.writeInt8(sr.length, 917);
      request.write(sr, 918);
    }

    const response = await tcpclient(host, port, timeout)(request);
    resolve(cmdOkToJSON(response));
  } catch (error) {
    reject(error);
  }
});

const gscmd = (host, port, timeout = 3000) => ({
  command,
  commandKey,
  sv,
  nrstatus,
  id_zlecenia,
  id_operatora,
  operator_txt,
  produkt,
  zlecenie,
  opis,
  tools,
  tool_id,
  gniazdo,
  pakiet,
  zamowienie,
  optcc,
  nocc,
  optw,
  optgniazd,
  optgramatura,
  gramatura2,
  optcP,
  optcU,
  inspekcja,
  inspekcja_txt,
  id_pbw,
  id_opp,
  id_rezerwa,
  id_pur,
  pur_txt,
  sr,
}) => gsWriteCommand({
  host,
  port,
  timeout,
  command,
  commandKey,
  sv,
  test: 5678,
  nrstatus,
  id_zlecenia,
  id_operatora,
  operator_txt,
  produkt,
  zlecenie,
  opis,
  tools,
  tool_id,
  gniazdo,
  pakiet,
  zamowienie,
  optcc,
  nocc,
  optw,
  optgniazd,
  optgramatura,
  gramatura2,
  optcP,
  optcU,
  inspekcja,
  inspekcja_txt,
  id_pbw,
  id_opp,
  id_rezerwa,
  id_pur,
  pur_txt,
  sr,
}); /* eslint-enable camelcase */

export { gsstate, gscmd, doubleToDate };
