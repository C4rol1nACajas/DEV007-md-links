import fs from 'fs'; //Permite leer los archivos 
import path from 'path'; // Para manipular rutas de archivos 
import axios from 'axios'; // Para hacer solicitudes HTTP

//_____________________1.-RUTA EXISTE__________________________
export const pathExists = (ruta) => { 
    return fs.existsSync(ruta)

}

//_____________________2.-CONVERTIR EN ABSOLUTA______________________
export const ConvertAbsolute = (ruta) => {
    return path.resolve(ruta)
}

//_____________________3.-VERIFICAR SI ES UN ARCHIVO_____________________
export const verificarArchivo = (ruta) => {
    const esArchivoMd = validarMd(ruta);
    if (!esArchivoMd) {
        return false; // No es un archivo .md válido
    }
    const leerRuta = fs.statSync(ruta)
    return leerRuta.isFile()
}

//_____________________4.-VERIFICAR SI ES UN DIRECTORIO___________________
export const verificarDirectorio = (ruta) => {
    const leerRuta = fs.statSync(ruta)
    return leerRuta.isDirectory()
}

//____________________5.-VALIDAR SI ES UN ARCHIVO MD___________________________
export const validarMd = (ruta) => {
    const esArchivoMd = (path.extname(ruta) === ".md") ? true : false
    return esArchivoMd
}

//_____________________6.-LEER ARCHIVO Y EXTRAER LINKS_________________________
export const leerArchivo = (ruta) => {
    const lecturaArchivo = fs.readFileSync(ruta, "utf-8") 
    const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;  //Expresión regular para buscar enlaces
    const links =  []
    let match;
 
    while ((match = linkRegex.exec(lecturaArchivo)) !== null) {

    const text = match[1]
    const url  = match[2]
    links.push ({text, url, file:ruta})
    }
    return links;
}
//---------------------------------------------------
export const mdLinks = (path, options) => {
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
               resolve(links);
             //console.log(links)
          }
  
        } 
      }
    });
  };
  

//_________________________7.- OBTENER CODIGO HTTP Y STATUS (VALIDATE)_________________________________
//_________________________Declaramos la función validarLinks que toma un parámetro llamado "link"______________________
export const validarLinks = (links) => {
    return axios.get(links.url).then((response) => {
        if(response.status >= 200 && response.status < 400 ){
            links.status = response.status, links.ok = "ok" 
            return links;
        } else {
            links.status = response.status, links.ok = "fail"
            return links;
        }
    })  .catch(error => {  
        links.status = "error", links.ok = "fail"
        return links;
      });
       
}

//______________________________8.-STATS (Estadisiticas de los link encontrados)_______________________________________________
export const linkStats = (links) =>  {
    const uniqueLinksSet = new Set(links.map((link) => link.href));
    const totalLinks = links.length;
    const uniqueLinks = uniqueLinksSet.size;
    const brokenLinks = links.filter((link) => link.status >= 400).length;
    return {
        totalLinks,
        uniqueLinks,
        brokenLinks,
        uniqueLinksArray: Array.from(uniqueLinksSet),
    };
};


/*const readme = "./Prueba.md";  //Es la ruta relativa
const rutaNoExiste = "./NOEXISTE.md";  
const rutaAbsoluta = "C:/Users/carol/OneDrive/Escritorio/Mis proyectos de laboratoria/DEV007-md-links/README.md"

mdLinks(readme)
  .then((resolve) => {  //Ver las respuestas positivas con el flujo de la función en la terminal 
    console.log(resolve);
  })
  .catch(error => {  //Me ayuda ver los errores en la terminal 
    console.log(error);
  });


*/
