"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [sensorData, setSensorData] = useState<{
    temperature: number;
    humidity: number;
  } | null>({ temperature: 25, humidity: 60 });
  const [targetTemperature, setTargetTemperature] = useState(25);
  const [validatedTarget, setValidatedTarget] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function fetchSensorData() {
      try {
        const res = await fetch("/api/sensor");
        const data = await res.json();
        setSensorData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }

    fetchSensorData();
    // Optionnel : polling régulier
    // const interval = setInterval(fetchSensorData, 5000);
    // return () => clearInterval(interval);
  }, []);

  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetTemperature(Number(event.target.value));
  };

  const handleSubmit = async () => {
    setIsSending(true);
    try {
      const res = await fetch("/api/temperature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTemperature }),
      });
      if (!res.ok) {
        console.error("Erreur lors de l'envoi de la température cible");
      } else {
        // Met à jour la température cible validée
        setValidatedTarget(targetTemperature);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la température cible", error);
    } finally {
      setIsSending(false);
    }
  };

  // Affiche une alerte si la température mesurée est supérieure ou égale à la cible validée
  const targetReached =
    sensorData && validatedTarget !== null && sensorData.temperature >= validatedTarget;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl mb-14 text-gray-800 text-center uppercase font-semibold">
          Thermostat Dashboard
        </h1>

        {/* Section d'affichage des cards avec données */}
        {sensorData ? (
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
            {/* Card Température */}
            <div
              className={`flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center ${
                targetReached ? "border-4 border-red-500" : ""
              }`}
            >
              <span className="text-6xl mb-4">🌡️</span>
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">
                Température
              </h2>
              <p className="text-4xl font-bold text-gray-900">
                {sensorData.temperature}°C
              </p>
              {validatedTarget !== null && (
                <p className="mt-2 text-sm text-gray-500">
                  (Cible : {validatedTarget}°C)
                </p>
              )}
              {targetReached && (
                <p className="mt-2 text-sm text-red-500 font-semibold">
                  La température cible a été atteinte !
                </p>
              )}
            </div>

            {/* Card Humidité */}
            <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
              <span className="text-6xl mb-4">💧</span>
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">
                Humidité
              </h2>
              <p className="text-4xl font-bold text-gray-900">
                {sensorData.humidity}%
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Chargement des données...</p>
        )}

        {/* Section de réglage de la température cible */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
            Réglage de la température cible
          </h2>
          <div className="flex flex-col items-center">
            <input
              type="range"
              min="-20"
              max="60"
              value={targetTemperature}
              onChange={handleTemperatureChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
            />
            <p className="text-xl font-bold text-gray-900 mb-4">
              {targetTemperature}°C
            </p>
            <button
              onClick={handleSubmit}
              disabled={isSending}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isSending ? "Envoi..." : "Valider"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
