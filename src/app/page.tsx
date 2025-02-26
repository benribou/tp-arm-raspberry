"use client";

import { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";

export default function HomePage() {
  const [sensorData, setSensorData] = useState<{ temperature: number; humidity: number } | null>(null);
  const [targetTemperature, setTargetTemperature] = useState(25);
  const [validatedTarget, setValidatedTarget] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const prevSensorDataRef = useRef(sensorData);
  const lastFetchTimeRef = useRef<number | null>(null);

  useEffect(() => {
    async function fetchSensorData() {
      try {
        const res = await fetch("/api/sensor");
        const newData = await res.json();

        // Mettre à jour uniquement si les données ont changé
        if (
          newData.temperature !== prevSensorDataRef.current?.temperature ||
          newData.humidity !== prevSensorDataRef.current?.humidity
        ) {
          setSensorData(newData);

          // Calculer la latence
          const currentTime = performance.now();
          if (lastFetchTimeRef.current !== null) {
            const calculatedLatency = currentTime - lastFetchTimeRef.current;
            setLatency(calculatedLatency);
          }
          lastFetchTimeRef.current = currentTime;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du capteur :", error);
      }
    }

    fetchSensorData();

    const interval = setInterval(fetchSensorData, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sensorData) {
      prevSensorDataRef.current = sensorData;
    }
  }, [sensorData]);

  // 2) Récupération de la température cible sauvegardée
  useEffect(() => {
    async function fetchSavedTarget() {
      try {
        const res = await fetch("/api/temperature");
        if (!res.ok) {
          throw new Error("Impossible de récupérer la température cible");
        }
        const data = await res.json();
        if (data.targetTemperature !== undefined) {
          setValidatedTarget(data.targetTemperature);
          setTargetTemperature(data.targetTemperature); // Aligne le slider sur la valeur sauvegardée
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la température cible :", error);
      }
    }
    fetchSavedTarget();
  }, []);

  // Gestion du slider
  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetTemperature(Number(event.target.value));
  };

  // 3) Envoi de la température cible vers /api/temperature (POST)
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
        setValidatedTarget(targetTemperature);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la température cible", error);
    } finally {
      setIsSending(false);
    }
  };

  // 4) Détermine si la température mesurée est >= la cible validée
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
              className={`flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center ${targetReached ? "border-4 border-red-500" : ""
                }`}
            >
              <span className="text-6xl mb-4">🌡️</span>
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">Température</h2>
              <p className="text-4xl font-bold text-gray-900">
                {sensorData && (
                  <CountUp
                    key={sensorData.temperature}
                    start={prevSensorDataRef.current?.temperature || sensorData.temperature}
                    end={sensorData.temperature}
                    duration={0.5}
                    decimals={1}
                    suffix="°C"
                  />
                )}
              </p>
              {validatedTarget !== null && (
                <p className="mt-2 text-sm text-gray-500">(Cible : {validatedTarget}°C)</p>
              )}
              {targetReached && (
                <p className="mt-2 text-sm text-red-500 font-semibold">
                  La température cible a été atteinte !
                </p>
              )}
              {latency !== null && (
                <p className="mt-2 text-sm text-gray-500">Latence : {latency.toFixed(2)} ms</p>
              )}
            </div>

            {/* Card Humidité */}
            <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
              <span className="text-6xl mb-4">💧</span>
              <h2 className="text-2xl font-semibold mb-2 text-gray-700">Humidité</h2>
              <p className="text-4xl font-bold text-gray-900">
                {sensorData && (
                  <CountUp
                    key={sensorData.humidity}
                    start={prevSensorDataRef.current?.humidity || sensorData.humidity}
                    end={sensorData.humidity}
                    duration={0.5}
                    decimals={1}
                    suffix="%"
                  />
                )}
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
            <p className="text-xl font-bold text-gray-900 mb-4">{targetTemperature}°C</p>
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