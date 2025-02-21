import { NextResponse } from 'next/server';

export async function GET() {
  // Données fictives simulant la réponse du STM32
  const data = {
    temperature: 25,
    humidity: 60,
  };

  // const data = getLastReading();

  // On renvoie la réponse au format JSON
  return NextResponse.json(data);
}