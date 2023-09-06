import { pathExists, ConvertAbsolute, verificarArchivo, verificarDirectorio, validarMd, leerArchivo, validarLinks, linkStats } from "./Functions.js";

export const mdLinks = (path, options) => {
  return new Promise(async (resolve, reject) => {
    const absolute = ConvertAbsolute(path)
     //Si no existe la ruta se rechaza la promesa
     if (!pathExists(absolute)) {
      reject("La ruta no existe");
     }
   //Identifica si la ruta existe.
   if (pathExists(absolute)) {
      if (verificarArchivo(absolute)) {
        if (validarMd(absolute)){
          const links = leerArchivo(absolute);
          if(!options.validate && !options.stats){
            console.log(links)
          }
          if(options.validate && !options.stats){
            let linksvalidate = await validarLinks(links)
            console.log(linksvalidate)
          }
          if(!options.validate && options.stats){
            let linksconstats = linkStats(links)
            console.log("Total links:", linksconstats.totalLinks)
            console.log("Unique links:", linksconstats.uniqueLinks)
          }
          if(options.validate && options.stats){
            let linksvalidatestats = linkStats(links)
            console.log(linksvalidatestats)
          }
          //resolve(links);
        }
      }
    }
  });
};




















