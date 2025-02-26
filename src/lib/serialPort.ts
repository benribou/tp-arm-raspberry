// src/lib/serialPort.ts
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

interface SensorData {
  temperature: number;
  humidity: number;
  targetTemperature: number;
}

let lastReading: SensorData = { temperature: 0, humidity: 0, targetTemperature: 0 };

const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', (line: string) => {
  try {
    console.log("line -> ", line)
    const data = JSON.parse(line.trim());
    lastReading = { temperature: data.temperature, humidity: data.humidity, targetTemperature: data.targetTemperature };
    console.log('Nouvelle lecture depuis STM32 :', lastReading);
  } catch (error) {
    console.error('Erreur de parsing :', error);
  }
});

export function getLastReading(): SensorData {
  return lastReading;
}

export function sendTargetTemperature(target: number): void {
  const payload = JSON.stringify({ targetTemperature: target });
  const message = payload + "\n";
  port.write(message, (err) => {
    if (err) {
      return console.error("Erreur lors de l'envoi au STM32 :", err.message);
    }
    console.log("Message envoyé au STM32 :", payload);
  });
}