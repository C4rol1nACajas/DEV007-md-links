import axios from "axios";
import {
  pathExists,
  ConvertAbsolute,
  verificarArchivo,
  verificarDirectorio,
  validarMd,
  leerArchivo,
  validarLinks,
  linkStats,
} from "../Functions.js";



// ____________________TEST PARA VERIFICAR SI LA RUTA EXISTE____________________________________________
describe('pathExists', () => {

  it('Deberia ser una función', () => {
    expect(typeof pathExists).toBe("function");
  });

  it('Debería devolver verdadero si la ruta existe', () => {
    expect(pathExists('./README.md')).toEqual(true);
  });
});

// _____________________TEST CONVERTIR LA RUTA A ABSOLUTA___________________________________________________
describe('ConvertAbsolute', () => {

  it('Deberia ser una función', () => {
    expect(typeof ConvertAbsolute).toBe('function');
  });

  it('Deberia devolver verdadero si la ruta es absoluta', () => {
    const rutaConvertida = "C:\\Users\\carol\\OneDrive\\Escritorio\\Mis proyectos de laboratoria\\DEV007-md-links\\README.md"
    expect(ConvertAbsolute("./README.md")).toEqual(rutaConvertida);
  });
});

// _____________________TEST PARA VALIDAR SI ES UN ARCHIVO MD___________________________________________________
describe('validarMd', () => {

  it('Deberia ser una función', () => {
    expect(typeof validarMd).toBe('function');
  });

  it('Deberia retornar verdadero si un archivo .md', () => {
    try {
      validarMd("./README.md");
    } catch (error) {
      expect(error).toBe("No es un archivo .md");
    }
  })
  
  it('Deberia retornar falso si no archivo .md', () => {
    try {
      validarMd("./NOEXISTE.txt");
    } catch (error) {
      expect(error).toBe("No es un archivo .md");
    }
  })
});

//_____________________TEST PARA LEER ARCHIVO.md___________________________________________________
describe('leerArchivo', () => {

  it('Deberia leer el archivo.md', () => {
    const rutaRelativa = "C:\\Users\\carol\\OneDrive\\Escritorio\\Mis proyectos de laboratoria\\DEV007-md-links\\Prueba.md"
    const respuesta =  leerArchivo(rutaRelativa);
    const resultado = [
      {
        text: 'Arreglos',
        url: 'https://curriculum.laboratoria.la/es/topics/javascript/04-arrays',
        file: 'C:\\Users\\carol\\OneDrive\\Escritorio\\Mis proyectos de laboratoria\\DEV007-md-links\\Prueba.md'
      },
      {
        text: 'Array - MDN',
        url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Arrayy/',
        file: 'C:\\Users\\carol\\OneDrive\\Escritorio\\Mis proyectos de laboratoria\\DEV007-md-links\\Prueba.md'
      },
      {
        text: 'Array.prototype.sort() - MDN',
        url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort',
        file: 'C:\\Users\\carol\\OneDrive\\Escritorio\\Mis proyectos de laboratoria\\DEV007-md-links\\Prueba.md'
      },
      {
        text: 'Array.prototype.forEach() - MDN',
        url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/RReference/Global_Objects/Array/forEach',
        file: 'C:\\Users\\carol\\OneDrive\\Escritorio\\Mis proyectos de laboratoria\\DEV007-md-links\\Prueba.md'
      },
      {
        text: 'Array.prototype.map() - MDN',
        url: 'https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
        file: 'C:\\Users\\carol\\OneDrive\\Escritorio\\Mis proyectos de laboratoria\\DEV007-md-links\\Prueba.md'
      }
   ];
    expect(respuesta).toEqual(resultado);
  });

});

//_____________________TEST PARA VERIFICAR SI ES UN ARCHIVO___________________________________________________
describe("verificarArchivo" , () => {
  it('debería devolver true cuando se le proporciona la ruta absoluta de un archivo .md existente', () => {
    const rutaArchivoMd = 'README.md';
    const resultado = verificarArchivo(rutaArchivoMd);
    expect(resultado).toBe(true);
  });

  it('debería devolver false cuando se le proporciona la ruta absoluta de un archivo que no es .md', () => {
    const rutaArchivo = "Prueba.txt";
    const resultado = verificarArchivo(rutaArchivo);
    expect(resultado).toBe(false);
  });

});

//_____________________VERIFICAR DIRECTORIO___________________________________________________
describe("verificarDirectorio", () => {
  it('debería devolver true para un directorio existente', () => {
    const directoryExist = "Prueba_md";
    expect(verificarDirectorio(directoryExist)).toBe(true);
  });

  it('Valida si la ruta no es un directorio', () => {
    const directoryNotExist = "README.md";
    expect(verificarDirectorio(directoryNotExist)).toBe(false);
  });
  
})

//-----------------------------------------------------------------------------------
jest.mock('axios'); // Mockear axios para simular las respuestas

describe('validarLinks', () => {
    it('debería retornar estado "ok" para un enlace válido', async () => {
        const mockResponse = { status: 200 };
        axios.get.mockResolvedValue(mockResponse);

        const links = { url: 'https://www.ejemplo.com' };
        const result = await validarLinks(links);

        expect(result.status).toBe(200);
        expect(result.ok).toBe('ok');
    });

    it('debería retornar estado "fail" para un enlace con respuesta no exitosa', async () => {
        const mockResponse = { status: 404 };
        axios.get.mockResolvedValue(mockResponse);

        const links = { url: 'https://www.ejemplo.com' };
        const result = await validarLinks(links);

        expect(result.status).toBe(404);
        expect(result.ok).toBe('fail');
    });

    it('debería retornar estado "error" para un enlace inválido', async () => {
        axios.get.mockRejectedValue(new Error('Error en la solicitud'));

        const links = { url: 'https://www.enlace-invalido.com' };
        const result = await validarLinks(links);

        expect(result.status).toBe('error');
        expect(result.ok).toBe('fail');
    });
});

const mockLinks = [
    { href: 'https://www.google.com', status: 200 },
    { href: 'https://example.com/page2', status: 404 },
    { href: 'https://example.com/page3', status: 200 },

];

describe('linkStats', () => {
    it('debería devolver estadisticas de enlaces correctas', () => {
      const result = linkStats (mockLinks);

        expect(result.totalLinks).toBe(3);
        expect(result.uniqueLinks).toBe(3);
        expect(result.brokenLinks).toBe(1);
        expect(result.uniqueLinksArray).toEqual([
            'https://www.google.com',
            'https://example.com/page2',
            'https://example.com/page3',
        ]);

    });

});




