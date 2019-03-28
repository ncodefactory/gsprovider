import tcpclient from "@ncodefactory/tcpipcli";

const millisecond = 1.1574074074074073e-8;

const readInt8 = data => {
  const result = data.buffer.readUInt8(data.index);
  data.index += 1; // eslint-disable-line no-param-reassign
  return result;
};

const readInt16 = data => {
  const result = data.buffer.readUInt16LE(data.index);
  data.index += 2; // eslint-disable-line no-param-reassign
  return result;
};

const readInt32 = data => {
  const result = data.buffer.readUInt32LE(data.index);
  data.index += 4; // eslint-disable-line no-param-reassign
  return result;
};

const readDouble = data => {
  const result = data.buffer.readDoubleLE(data.index);
  data.index += 12; // eslint-disable-line no-param-reassign
  return result;
};

const readFloat = data => {
  const result = data.buffer.readFloatLE(data.index);
  data.index += 4; // eslint-disable-line no-param-reassign
  return result;
};

const readDate = data => {
  const result = data.buffer.readDoubleLE(data.index);
  data.index += 8; // eslint-disable-line no-param-reassign
  const milliseconds = result / millisecond;
  const date = new Date(1899, 12, 30, 0, 0, 0);
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};

const readct = data => {
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
    readInt32(data)
  ];
  result.t_andon = readInt32(data);
  result.t_andont = readInt32(data);
  result.c_andon = readInt16(data);
  result.c_andont = readInt16(data);

  return result;
};

const readev = data => {
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

const readEventListItem = data => {
  const result = {};
  result.typ = readInt32(data);
  result.v = readInt32(data);
  result.czas = readDate(data);

  return result;
};

const writeByte = (data, value) => {
  data.buffer[data.index] = value; // eslint-disable-line no-param-reassign
  data.index += 1; // eslint-disable-line no-param-reassign
  return data.buffer;
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

const writeFloat = (data, value) => {
  const result = data.buffer.writeFloatLE(value, data.index);
  data.index += 4; // eslint-disable-line no-param-reassign
  return result;
};

const writeBool = (data, value) => {
  const result = data.buffer.writeInt32LE(value === true ? 1 : 0, data.index);
  data.index += 4; // eslint-disable-line no-param-reassign
  return result;
};

const writeString = (buffer, value, length) => {
  if(value==null){
    return;
  }

  buffer.writeInt8(value.length);
  writeByte(data, value.length || 0);
  if (value == null) {
    data.index += length;
    return data.buffer;
  }

  const result = data.buffer.write(value);
  data.index += length; // eslint-disable-line no-param-reassign
  return result;
};

const stateToJSON = buffer => {
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
    readEventListItem(data)
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
  host,
  port,
  timeout,
  sv,
  autoryzacja,
  command,
  asService,
  index
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const request = Buffer.alloc(16);
      const data = { index: 0, buffer: request };
      writeInt32(data, autoryzacja);
      writeInt16(data, sv);
      writeInt16(data, command);
      writeBool(data, asService);
      writeInt16(data, index);
      const response = await tcpclient(host, port, timeout)(request);
      resolve(stateToJSON(response));
    } catch (error) {
      reject(error);
    }
  });

const gsstate = (host, port, timeout = 3000) => sv =>
  gsReadState({
    host,
    port,
    timeout,
    sv,
    autoryzacja: 5678,
    command: 1,
    asService: false,
    index: 0
  });

const cmdOkToJSON = buffer => {
  const result = {};
  const data = { buffer, index: 0 };
  result.code = readInt32(data);
  result.dt = readDate(data);
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
  sr
}) =>
  new Promise(async (resolve, reject) => {
    try {
      const request = Buffer.alloc(1020);
      request.writeInt8(command, 0);
      request.writeInt32LE(commandKey, 4);
      request.writeUInt16LE(sv, 8);
      request.writeInt32LE(test, 12);
      request.writeInt8(nrstatus, 16);
      request.writeInt32LE(id_zlecenia, 20);
      request.writeInt32LE(id_operatora, 24);
      if(operator_txt!=null){
        request.writeInt8(operator_txt.length, 28);
        request.write(operator_txt, 29);
      }

      if(produkt!=null){
        request.writeInt8(produkt.length, 109);
        request.write(operator_txt, 110);
      }

      if(zlecenie!=null){
        request.writeInt8(zlecenie.length, 210);
        request.write(zlecenie, 211);
      }

      if(opis!=null){
        request.writeInt8(opis.length, 311);
        request.write(opis, 312);
      }

      if(tools!=null){
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
      if(inspekcja_txt!=null){
        request.writeInt8(inspekcja_txt.length, 668);
        request.write(inspekcja_txt, 669);
      }

      request.writeInt32LE(id_pbw, 820);
      request.writeInt32LE(id_opp, 824);
      request.writeInt32LE(id_rezerwa, 828);
      request.writeInt32LE(id_pur, 832);
      if(pur_txt!=null){
        request.writeInt8(pur_txt.length, 836);
        request.write(pur_txt, 837);
      }

      if(sr!=null){
        request.writeInt8(sr.length, 917);
        request.write(sr, 918);
      }

      const data = { index: 0, buffer: request };
      writeByte(data, command);
      data.index += 3;
      writeInt32(data, commandKey);
      writeInt16(data, sv);
      data.index += 2;
      writeInt32(data, test);
      writeByte(data, nrstatus);
      data.index += 3;
      writeInt32(data, id_zlecenia);
      writeInt32(data, id_operatora);
      writeString(data, operator_txt, 80);
      writeString(data, produkt, 100);
      writeString(data, zlecenie, 100);
      writeString(data, opis, 200);
      writeString(data, tools, 100);
      data.index += 4;
      writeInt32(data, toll_id);
      writeFloat(data, gniazdo);
      writeFloat(data, pakiet);
      writeInt32(data, zamowienie);
      writeInt32(data, optcc);
      writeFloat(data, nocc);
      writeInt32(data, optw);
      writeInt32(data, optgniazd);
      writeFloat(data, optgramatura);
      writeFloat(data, gramatura2);
      writeInt32(data, optcP);
      writeInt32(data, optcU);
      writeInt32(data, inspekcja);
      writeString(data, inspekcja_txt, 150);
      writeInt32(data, id_pbw);
      writeInt32(data, id_opp);
      writeInt32(data, id_rezerwa);
      writeInt32(data, id_pur);
      writeString(data, pur_txt, 80);
      writeString(data, sr, 100);
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
  sr
}) =>
  gsWriteCommand({
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
    sr
  }); /* eslint-enable camelcase */

export { gsstate, gscmd };
