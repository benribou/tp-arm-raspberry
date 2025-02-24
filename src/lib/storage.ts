// src/lib/storage.ts
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'settings.json');

function ensureDataFolderExists() {
  if (!fs.existsSync(dataDir)) {
    console.log(`Création du dossier : ${dataDir}`);
    fs.mkdirSync(dataDir);
  } else {
    console.log(`Dossier déjà existant : ${dataDir}`);
  }
}

export function readSettings(): { targetTemperature: number } {
  ensureDataFolderExists();

  if (!fs.existsSync(dataFilePath)) {
    console.log(`Fichier non trouvé, retour de la valeur par défaut`);
    return { targetTemperature: 25 };
  }

  const raw = fs.readFileSync(dataFilePath, 'utf-8');
  console.log(`Lecture du fichier settings.json : ${raw}`);
  return JSON.parse(raw);
}

export function writeSettings(settings: { targetTemperature: number }) {
  ensureDataFolderExists();
  fs.writeFileSync(dataFilePath, JSON.stringify(settings, null, 2), 'utf-8');
  console.log(`Écriture dans le fichier settings.json : ${JSON.stringify(settings)}`);
}