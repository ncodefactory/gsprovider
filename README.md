# gsprovider #

Golem stations communication provider

## installation: ##

### npm: ###
```
npm install @ncodefactory/gsprovider --save
```

### yarn: ###
```
yarn add @ncodefactory/gsprovider
```

## usage: ##

### gsstatus

```js
import { gsstatus } from '@ncodefactory/gsprovider';

const statusReader = gsstatus('golem_station_host', golem_station_pot, connection_milliseconds_timeout);
const statusReader = gsstatus('golem_station_host', golem_station_pot); // timeout is default 3000 milliseconds
const status = await statusreader(gole_station_sv_no);

```
