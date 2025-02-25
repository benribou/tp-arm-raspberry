// src/lib/serialPort.ts
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

interface SensorData {
  temperature: number;
  humidity: number;
}

let lastReading: SensorData = { temperature: 0, humidity: 0 };

const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (line: string) => {
  try {
    console.log(line)
    const data = JSON.parse(line.trim());
    lastReading = { temperature: data.temperature, humidity: data.humidity };
    console.log('Nouvelle lecture depuis STM32 :', lastReading);
  } catch (error) {
    console.error('Erreur de parsing :', error);
  }
});

export function getLastReading(): SensorData {
  console.log("lastReading -> ", lastReading);
  return lastReading;
}

// Nouvelle fonction pour envoyer la température cible au STM32
export function sendTargetTemperature(target: number): void {
  // Formater le message en JSON
  const payload = JSON.stringify({ targetTemperature: target });
  // Ajouter un retour à la ligne pour que le STM32 puisse délimiter la trame
  const message = payload + "\n";
  port.write(message, (err) => {
    if (err) {
      return console.error("Erreur lors de l'envoi au STM32 :", err.message);
    }
    console.log("Message envoyé au STM32 :", payload);
  });
}
