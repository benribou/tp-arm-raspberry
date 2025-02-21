import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { targetTemperature } = await request.json();

    // Ici, vous ajouterez la logique pour communiquer avec le STM32.
    // Par exemple, en envoyant cette température cible via le port série.
    console.log("Température cible reçue :", targetTemperature);

    // Pour l'instant, on retourne simplement une réponse de succès.
    return NextResponse.json({ success: true, targetTemperature });
  } catch (error) {
    console.error("Erreur dans le handler POST de /api/temperature :", error);
    return NextResponse.error();
  }
}