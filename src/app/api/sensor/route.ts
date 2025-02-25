// src/app/api/sensor/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getLastReading } from '@/lib/serialPort';

export async function GET() {
  try {
    // On récupère les vraies données lues par le port série
    const data = getLastReading();
    // On renvoie la réponse au format JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur dans GET /api/sensor:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}
