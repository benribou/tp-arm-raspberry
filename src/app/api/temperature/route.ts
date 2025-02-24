// src/app/api/temperature/route.ts
import { NextResponse } from 'next/server';
import { readSettings, writeSettings } from '@/lib/storage';

export async function GET() {
  try {
    // Lit la température cible stockée dans le fichier JSON
    const settings = readSettings();
    return NextResponse.json({ success: true, ...settings });
  } catch (error) {
    console.error("Erreur dans le handler GET de /api/temperature :", error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const { targetTemperature } = await request.json();

    // Lit la config existante, la met à jour, puis l'écrit
    const currentSettings = readSettings();
    currentSettings.targetTemperature = targetTemperature;
    writeSettings(currentSettings);

    console.log("Température cible reçue :", targetTemperature);

    return NextResponse.json({ success: true, targetTemperature });
  } catch (error) {
    console.error("Erreur dans le handler POST de /api/temperature :", error);
    return NextResponse.error();
  }
}
