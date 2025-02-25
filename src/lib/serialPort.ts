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
    // console.log(line)
    const data = JSON.parse(line.trim());
    lastReading = { temperature: data.temperature, humidity: data.humidity };
    console.log('Nouvelle lecture depuis STM32 :', lastReading);
  } catch (error) {
    console.error('Erreur de parsing :', error);
  }
});

export function getLastReading(): SensorData {
  console.log(lastReading)
  return lastReading;
}
