// src/app/api/temperature/route.ts
import { NextResponse } from 'next/server';
import { sendTargetTemperature } from '@/lib/serialPort';

export async function POST(request: Request) {
  try {
    const { targetTemperature } = await request.json();

    // Envoie la température cible au STM32 pour qu'il la sauvegarde en ROM.
    sendTargetTemperature(targetTemperature);
    console.log("Température cible envoyée au STM32 :", targetTemperature);

    return NextResponse.json({ success: true, targetTemperature });
  } catch (error) {
    console.error("Erreur dans le handler POST de /api/temperature :", error);
    return NextResponse.error();
  }
}