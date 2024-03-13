import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default (app) => {
  // Lire tous les fichiers du dossier actuel
  fs.readdirSync(__dirname)
    .filter((file) => {
      // Filtre pour obtenir uniquement les fichiers .js, à l'exception de index.js
      return file.endsWith('.js') && file !== 'index.js';
    })
    .forEach((file) => {
      // Importer chaque fichier de route et l'exécuter avec l'instance app
      import(pathToFileURL(path.join(__dirname, file))).then(route => {
        route.default(app);
      });
    });
};