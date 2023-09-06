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
jest.mock('axios');

describe('validarLinks', () => {
  it('debería validar correctamente los enlaces', async () => {
    // Datos de prueba
    const links = [
      { url: 'https://example.com' },
      { url: 'https://example.org' },
    ];

    // Configurar respuestas simuladas para axios.get
    axios.get.mockResolvedValue({ status: 200 }); // Simular un enlace válido

    const resultado = await validarLinks(links);

    // Verificar que los enlaces estén validados correctamente
    expect(resultado).toEqual([
      { url: 'https://example.com', status: 200, ok: 'ok' },
      { url: 'https://example.org', status: 200, ok: 'ok' },
    ]);
  });

  it('debería manejar errores correctamente', async () => {
    // Datos de prueba con un enlace que generará un error
    const links = [
      { url: 'https://example.com' },
      { url: 'https://invalid-url' }, // Enlace inválido
    ];

    // Configurar respuestas simuladas para axios.get
    axios.get.mockRejectedValue(new Error('Network error')); // Simular un error de red

    const resultado = await validarLinks(links);

    // Verificar que los enlaces estén manejando los errores correctamente
    expect(resultado).toEqual([
      { url: 'https://example.com', status: 'error', ok: 'fail' },
      { url: 'https://invalid-url', status: 'error', ok: 'fail' },
    ]);
  });
});

const mockLinks = [
  { url: 'https://example.com' },
  { url: 'https://example.org' },
  { url: 'https://example.net' },
  // Agrega más objetos de enlace según sea necesario
];

describe('linkStats', () => {
  it('debería devolver estadísticas de enlaces correctas', () => {
    // Datos de prueba simulados (mockLinks)
    const mockLinks = [
      { href: 'https://example.com', status: 200 },
      { href: 'https://example.org', status: 404 },
      { href: 'https://example.com', status: 200 }, // Enlace duplicado
    ];

    const result = linkStats(mockLinks);

    // Verificar las estadísticas esperadas
    expect(result.totalLinks).toBe(3);
    expect(result.uniqueLinks).toBe(2); // Dos enlaces únicos
    expect(result.brokenLinks).toBe(1); // Un enlace roto
    expect(result.uniqueLinksArray).toEqual(['https://example.com', 'https://example.org']);
  });

  it('debería manejar correctamente una lista vacía de enlaces', () => {
    // Lista de enlaces vacía
    const result = linkStats([]);

    // Verificar que todas las estadísticas sean cero en una lista vacía
    expect(result.totalLinks).toBe(0);
    expect(result.uniqueLinks).toBe(0);
    expect(result.brokenLinks).toBe(0);
    expect(result.uniqueLinksArray).toEqual([]);
  });
});