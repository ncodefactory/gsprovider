import iconv from 'iconv-lite';
import tcpclient from '@ncodefactory/tcpipcli';

const millisecond = 1.1574074074074073e-8;

const doubleToDate = (value) => {
  const milliseconds = value / millisecond;
  const date = new Date(1899, 11, 30, 0, 0, 0);
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};

const readct = (buffer, offset) => {
  const result = {};
  result.cykle = buffer.readUInt32LE(offset);
  result.cykleG = buffer.readDoubleLE(offset + 8);
  result.time = buffer.readUInt32LE(offset + 16);
  result.t_mp = buffer.readUInt32LE(offset + 20);
  result.t_awarii = buffer.readUInt32LE(offset + 24);
  result.t_przezbrajania = buffer.readUInt32LE(offset + 28);
  result.t_ustawiania = buffer.readUInt32LE(offset + 32);
  result.t_postojP = buffer.readUInt32LE(offset + 36);
  result.t_postojNP = buffer.readUInt32LE(offset + 40);
  result.t_none = buffer.readUInt32LE(offset + 44);
  result.c_awarii = buffer.readUInt16LE(offset + 48);
  result.c_przezbrajania = buffer.readUInt16LE(offset + 50);
  result.c_ustawiania = buffer.readUInt16LE(offset + 52);
  result.c_postojP = buffer.readUInt16LE(offset + 54);
  result.c_postojNP = buffer.readUInt16LE(offset + 56);
  result.c_none = buffer.readUInt16LE(offset + 58);
  result.kwh = buffer.readDoubleLE(offset + 64);
  result.braki = buffer.readFloatLE(offset + 72);
  result.gramatura = buffer.readDoubleLE(offset + 80);
  result.gramatura2 = buffer.readFloatLE(offset + 88);
  result.kwh_pp = buffer.readFloatLE(offset + 92);
  result.kwh_pnp = buffer.readFloatLE(offset + 96);
  result.kwh_pust = buffer.readFloatLE(offset + 100);
  result.kwh_awarie = buffer.readFloatLE(offset + 104);
  result.RSTime = [
    buffer.readUInt32LE(offset + 108),
    buffer.readUInt32LE(offset + 112),
    buffer.readUInt32LE(offset + 116),
    buffer.readUInt32LE(offset + 120),
    buffer.readUInt32LE(offset + 124),
    buffer.readUInt32LE(offset + 128),
    buffer.readUInt32LE(offset + 132),
    buffer.readUInt32LE(offset + 136),
    buffer.readUInt32LE(offset + 140),
    buffer.readUInt32LE(offset + 144),
    buffer.readUInt32LE(offset + 148),
    buffer.readUInt32LE(offset + 150),
    buffer.readUInt32LE(offset + 154),
    buffer.readUInt32LE(offset + 158),
    buffer.readUInt32LE(offset + 162),
    buffer.readUInt32LE(offset + 166),
    buffer.readUInt32LE(offset + 170),
    buffer.readUInt32LE(offset + 174),
    buffer.readUInt32LE(offset + 178),
    buffer.readUInt32LE(offset + 180),
  ];
  result.t_andon = buffer.readUInt32LE(offset + 188);
  result.t_andont = buffer.readUInt32LE(offset + 192);
  result.c_andon = buffer.readUInt32LE(offset + 196);
  result.c_andont = buffer.readUInt32LE(offset + 198);

  return result;
};

const readev = (buffer, offset) => {
  const result = {};
  let value = buffer.readDoubleLE(offset);
  result.tev = doubleToDate(value);
  value = buffer.readDoubleLE(offset + 8);
  result.tevoff = doubleToDate(value);
  value = buffer.readDoubleLE(offset + 16);
  result.tevstatus = doubleToDate(value);
  value = buffer.readDoubleLE(offset + 24);
  result.tevseria = doubleToDate(value);
  value = buffer.readDoubleLE(offset + 32);
  result.tevoperator = doubleToDate(value);
  value = buffer.readDoubleLE(offset + 40);
  result.tevandon = doubleToDate(value);
  value = buffer.readDoubleLE(offset + 48);
  result.tevalert = doubleToDate(value);
  value = buffer.readDoubleLE(offset + 56);
  result.tev_rezerwa = doubleToDate(value);
  return result;
};

const readEventListItem = (buffer, offset) => {
  const result = {};
  result.typ = buffer.readUInt8(offset);
  result.v = buffer.readUInt32LE(offset + 4);
  const value = buffer.readDoubleLE(offset + 8);
  result.czas = doubleToDate(value);

  return result;
};

const stateToJSON = (buffer) => {
  const result = {};
  result.command = buffer.readInt8(0);
  result.sv = buffer.readUInt16LE(2);
  result.stacja = buffer.readInt8(4);
  result.index = buffer.readUInt16LE(6);
  let value = buffer.readDoubleLE(8);
  result.start_stacji = doubleToDate(value);
  value = buffer.readDoubleLE(16);
  result.aktualizacja_wykresow = doubleToDate(value);
  result.noSys = buffer.readInt8(24);
  result.ErrorCode = buffer.readInt8(25);
  result.id_zlecenia = buffer.readUInt32LE(28);
  result.id_operatora = buffer.readUInt32LE(32);
  result.id_ur = buffer.readUInt32LE(36);
  result.NrStatus = buffer.readInt8(40);
  result.NrStatusRS = buffer.readInt8(41);
  result.bityb = buffer.readInt8(42);
  result.bityb2 = buffer.readInt8(43);

  result.ct = [readct(buffer, 48), readct(buffer, 248), readct(buffer, 448), readct(buffer, 648)];
  result.ev = readev(buffer, 848);
  result.EventList = [
    readEventListItem(buffer, 912),
    readEventListItem(buffer, 928),
    readEventListItem(buffer, 944),
    readEventListItem(buffer, 960),
    readEventListItem(buffer, 976),
    readEventListItem(buffer, 992),
    readEventListItem(buffer, 1008),
    readEventListItem(buffer, 1024),
    readEventListItem(buffer, 1040),
    readEventListItem(buffer, 1056),
    readEventListItem(buffer, 1072),
    readEventListItem(buffer, 1088),
    readEventListItem(buffer, 1104),
    readEventListItem(buffer, 1120),
    readEventListItem(buffer, 1136),
    readEventListItem(buffer, 1152),
    readEventListItem(buffer, 1168),
    readEventListItem(buffer, 1184),
    readEventListItem(buffer, 1200),
    readEventListItem(buffer, 1216),
  ];
  result.CzasCyklu = buffer.readUInt32LE(1232);
  result.CzasCykl2 = buffer.readUInt32LE(1236);
  result.Wydajnosc = buffer.readUInt32LE(1240);
  result.Sek0undOdOstatniegoCyklu = buffer.readUInt32LE(1244);
  result.cmms = buffer.readUInt32LE(1248);
  result.cmms2 = buffer.readUInt32LE(1252);
  result.andon = buffer.readUInt8(1256);

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

const writeString = (buffer, offset, text) => {
  if (text != null) {
    const buf = iconv.encode(text, 'win1250');
    buffer.writeInt8(buf.length, offset);
    for (let i = 1; i <= buf.length; i += 1) {
      buffer[offset + i] = buf[i - 1]; // eslint-disable-line no-param-reassign
    }
  }
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
    writeString(request, 28, operator_txt);
    writeString(request, 109, produkt);
    writeString(request, 210, zlecenie);
    writeString(request, 311, opis);
    writeString(request, 512, tools);
    request.writeInt32LE(toll_id, 616);
    request.writeFloatLE(gniazdo || 0, 620);
    request.writeFloatLE(pakiet || 0, 624);
    request.writeInt32LE(zamowienie, 628);
    request.writeInt32LE(optcc, 632);
    request.writeFloatLE(nocc || 0, 636);
    request.writeInt32LE(optw, 640);
    request.writeInt32LE(optgniazd, 644);
    request.writeFloatLE(optgramatura || 0, 648);
    request.writeFloatLE(gramatura2 || 0, 652);
    request.writeInt32LE(optcP, 656);
    request.writeInt32LE(optcU, 660);
    request.writeInt32LE(inspekcja, 664);
    writeString(request, 668, inspekcja_txt);
    request.writeInt32LE(id_pbw, 820);
    request.writeInt32LE(id_opp, 824);
    request.writeInt32LE(id_rezerwa, 828);
    request.writeInt32LE(id_pur, 832);
    writeString(request, 836, pur_txt);
    writeString(request, 917, sr);

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

export { gsstate, gscmd };
