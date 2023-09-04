import { pathExists, ConvertAbsolute, verificarArchivo, verificarDirectorio, validarMd, leerArchivo, validarLinks, linkStats } from "./Functions.js";

export const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    const existeRuta = pathExists(path);

    if (existeRuta) {
      const rutaAbsoluta = ConvertAbsolute(path);
      const archivos = verificarArchivo(rutaAbsoluta);
      const archivosMd = validarMd(archivos);

      leerArchivo(archivosMd)
        .then((data) => {
          // Realizar operaciones con los enlaces aquí
         
          const linksValidados = validarLinks(data, options);  // Por ejemplo, puedes llamar a una función para validar los enlaces
          const linkStatsResult = linkStats(linksValidados);   //Ejemplo de cálculo de estadísticas de enlaces
          
          // Resuelve la promesa con los enlaces validados
          resolve(linkStatsResult);
        })
        .catch((error) => {
          // Maneja cualquier error que ocurra durante la lectura del archivo
          reject(error);
        });
    } else {
      // Si la ruta no existe, rechaza la promesa con un mensaje de error
      reject("La ruta no existe");
    }
  });
};






















/*export const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
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
            console.log(links)
          //resolve(links);
           //console.log(links)
        }

      } 
    }
  });
};

const readme = "./Prueba.md";  //Es la ruta relativa
const rutaNoExiste = "./NOEXISTE.md";  
const rutaAbsoluta = "C:/Users/carol/OneDrive/Escritorio/Mis proyectos de laboratoria/DEV007-md-links/README.md"

mdLinks(readme)
  .then((resolve) => {  //Ver las respuestas positivas con el flujo de la función en la terminal 
    console.log(resolve);
  })
  .catch(error => {  //Me ayuda ver los errores en la terminal 
    console.log(error);
  });

//console.log ("Hola mundo")
//module.exports = mdLinks;
*/
