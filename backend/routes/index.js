const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  // Lire tous les fichiers du dossier actuel
  fs.readdirSync(__dirname)
    .filter((file) => {
      // Filtre pour obtenir uniquement les fichiers .js, à l'exception de index.js
      return file.endsWith('.js') && file !== 'index.js';
    })
    .forEach((file) => {
      // Importer chaque fichier de route et l'exécuter avec l'instance app
      const route = require(path.join(__dirname, file));
      route(app);
    });
};