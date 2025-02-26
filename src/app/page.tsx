"use client";

import { useEffect, useState, useRef } from "react";
import CountUp from "react-countup";

export default function HomePage() {
  const [sensorData, setSensorData] = useState<{ 
    temperature: number; 
    humidity: number; 
    targetTemperature: number; 
  } | null>(null);
  const [targetTemperature, setTargetTemperature] = useState(25);
  const [isSending, setIsSending] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const prevSensorDataRef = useRef(sensorData);
  const lastFetchTimeRef = useRef<number | null>(null);

  useEffect(() => {
    async function fetchSensorData() {
      try {
        const res = await fetch("/api/sensor");
        const newData = await res.json();
        // On suppose ici que newData.targetTemperature est déjà un nombre.
        if (
          newData.temperature !== prevSensorDataRef.current?.temperature ||
          newData.humidity !== prevSensorDataRef.current?.humidity ||
          newData.targetTemperature !== prevSensorDataRef.current?.targetTemperature
        ) {
          setSensorData(newData);

          const currentTime = performance.now();
          if (lastFetchTimeRef.current !== null) {
            setLatency(currentTime - lastFetchTimeRef.current);
          }
          lastFetchTimeRef.current = currentTime;
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du capteur :", error);
      }
    }

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sensorData) {
      prevSensorDataRef.current = sensorData;
      // Synchroniser le slider avec la valeur renvoyée par le STM32
      setTargetTemperature(sensorData.targetTemperature);
    }
  }, [sensorData]);

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
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la température cible", error);
    } finally {
      setIsSending(false);
    }
  };

  const targetReached =
    sensorData && sensorData.temperature >= sensorData.targetTemperature;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl text-gray-800 text-center uppercase font-semibold">
          Thermostat Dashboard
        </h1>
        {latency !== null && (
                <p className="mt-4 mb-14 text-sm text-gray-500 text-center">
                  Latence : {latency.toFixed(2)} ms
                </p>
        )}

        {sensorData ? (
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
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
              {sensorData && (
                <p className="mt-2 text-sm text-gray-500">
                  (Cible : {sensorData.targetTemperature}°C)
                </p>
              )}
              {targetReached && (
                <p className="mt-2 text-sm text-red-500 font-semibold">
                  La température cible a été atteinte !
                </p>
              )}
            </div>

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
