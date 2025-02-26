// src/app/api/sensor/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getLastReading, sendLEDCommand } from '@/lib/serialPort';

export async function GET() {
  try {
    const data = getLastReading();
    console.log("sensor data ->", data);
    
    // Si la température mesurée est supérieure ou égale à la cible, allume la LED ; sinon, éteins-la.
    if (data.temperature >= data.targetTemperature) {
      console.log("Envoie état TRUE au STM32 pour allumer la LED")
      sendLEDCommand(true);
    } else {
      console.log("Envoie état FALSE au STM32 pour éteindre la LED")
      sendLEDCommand(false);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur dans GET /api/sensor:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}
