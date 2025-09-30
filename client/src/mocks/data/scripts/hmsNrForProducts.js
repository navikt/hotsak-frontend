import productsData from '../products.json' with { type: 'json' }

/* Liten util for å hente alle hmsnummer som brukes i mockdata for grunndata. Denne kan kjøres for å få ut listen med hmsnummer som igjen kan brukes 
som variabler til graphQL spørringen til grunndata. Nyttig når vi endrer på integrasjonen og trenger ny respons med andre felter */
const hmsnrs = productsData.data.products.map((product) => product.hmsArtNr)
console.log(JSON.stringify(hmsnrs))
