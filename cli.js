#!/usr/bin/env node
import { mdLinks } from './index.js'; // Ajusta la ruta de importación según sea necesario


const document = process.argv[2];

const isOptionValidate = process.argv.includes('--validate');
const isOptionStats = process.argv.includes('--stats');

const options = {
    validate: isOptionValidate,
    stats: isOptionStats,
}

mdLinks(document, options)
.then((links)=>{
 console.log(links)
})

.catch((err)=>{
console.log(err, 22)
})






