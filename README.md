# Frontend for saksbehandling på Hjelpemiddelområdet 

Koden er delt i to separate moduler med hver sin package.json 
En for nodeJS backenden (server) og en for frontend (client)

For å installere pakker til server kjør 
### `npm install <pakkenavn> --prefix server` 

eller CD inn i server mapa og kjør npm install på vanlig måte derfra. 

Samme gjelder for client, bare bruk prefix client i stedet. 

For lokal kjøring er backend mocket ut med Mock Service Worker. Mockene ligger i _mocks_ mappen. 

Kjør opp appen ved å kjøre følgende kommando fra toppnivå. 
### `npm run dev` 

Alternativ CD inn i client og kjørt npm start


Ved push til main kjøres det deploy til dev-gcp 
Appen er tilgjenglig på https://hm-saksbehandling.dev.intern.nav.no/

Backend i dev-gcp er foreløpig mocked ut ved at kall gjøres til endepunkter i hm-mocks. For oppdatering av testdata, må hm-mocks oppdateres og redeployes. 


