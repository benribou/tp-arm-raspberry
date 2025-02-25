// src/lib/serialPort.ts
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

interface SensorData {
  temperature: number;
  humidity: number;
}

// Stocke la dernière lecture du STM32
let lastReading: SensorData = {
  temperature: 0,
  humidity: 0,
};

// Ouvrir le port série (chemin et baudRate à adapter selon ton Raspberry Pi / STM32)
const port = new SerialPort({
  path: '/dev/ttyACM0',
  baudRate: 115200,
});

// Parser pour découper chaque ligne
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (line: string) => {
  try {
    // On suppose que le STM32 envoie un JSON du style : {"temperature":25,"humidity":60}
    const data = JSON.parse(line.trim());
    // Mise à jour de la dernière lecture
    lastReading = {
      temperature: data.temperature,
      humidity: data.humidity,
    };
    console.log('Nouvelle lecture depuis STM32 :', lastReading);
  } catch (error) {
    console.error('Erreur de parsing des données reçues :', error);
  }
});

port.on('open', () => {
  console.log('Port série ouvert avec succès');
});

port.on('error', (err) => {
  console.error('Erreur sur le port série :', err);
});

/**
 * Fonction pour récupérer la dernière lecture stockée
 */
export function getLastReading(): SensorData {
  return lastReading;
}
