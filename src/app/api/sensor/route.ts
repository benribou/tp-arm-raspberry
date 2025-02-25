// src/app/api/sensor/route.ts
import { NextResponse } from 'next/server';
import { getLastReading } from '@/lib/serialPort';

export async function GET() {
  // On récupère les vraies données lues par le port série
  const data = getLastReading();

  // On renvoie la réponse au format JSON
  return NextResponse.json(data);
}
