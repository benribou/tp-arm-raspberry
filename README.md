# Thermostat Dashboard

Une application complète permettant de visualiser en temps réel les mesures d'un capteur (température et humidité) et de contrôler la température cible d'un thermostat piloté par un microcontrôleur STM32. Le STM32 reçoit la température cible via une communication UART, la sauvegarde en mémoire non volatile (ROM) et renvoie périodiquement les mesures, ainsi que la valeur cible. De plus, il contrôle une LED pour indiquer physiquement si la température mesurée atteint ou dépasse la cible.

---

## Fonctionnalités

- **Affichage en temps réel**  
  Affiche la température et l'humidité mesurées par le STM32 dans un dashboard Next.js, avec une animation "count up" pour un effet visuel dynamique.

- **Contrôle de la température cible**  
  Permet de définir la température cible via un curseur indépendant. La valeur est envoyée au STM32 qui la sauvegarde en ROM et la renvoie dans ses mesures.

- **Indication visuelle**  
  Le STM32 active une LED lorsque la température mesurée atteint ou dépasse la température cible, offrant un retour physique complémentaire.

- **Mesure de latence**  
  Le dashboard affiche également la latence (en ms) entre les mises à jour des données, permettant de vérifier la réactivité du système.

---

## Structure du projet

- **Frontend (Next.js)**  
  - `src/app/`: Contient les pages et les routes API.
    - `src/app/api/sensor/route.ts` : Renvoie les mesures (température, humidité, température cible) reçues du STM32.
    - `src/app/api/temperature/route.ts` : Permet d'envoyer la nouvelle température cible au STM32 via un POST.
    - `src/app/page.tsx` (ou `HomePage`) : Dashboard interactif affichant les mesures et contrôlant le curseur de température.

- **Backend / Communication série**  
  - `src/lib/serialPort.ts` : Gère la communication UART avec le STM32.
    - `getLastReading()` : Récupère les dernières mesures envoyées par le STM32.
    - `sendTargetTemperature()` : Envoie la température cible au STM32.

- **Firmware STM32 (C)**  
  Le firmware du STM32 :
  - Lit les données du capteur DHT11.
  - Reçoit la température cible via UART et la sauvegarde en ROM (ou EEPROM emulée).
  - Renvoie périodiquement un JSON contenant :
    ```json
    {
      "temperature": <valeur_mesurée>,
      "humidity": <valeur_mesurée>,
      "targetTemperature": <valeur_cible>
    }
    ```
  - Allume ou éteint une LED selon que la température mesurée dépasse ou non la cible.

---

## Prérequis

- **Node.js** et **npm** installés sur ta machine.
- Un microcontrôleur STM32 correctement configuré et connecté via UART.
- Next.js (version 13+ avec App Router) pour le frontend.

---

## Installation et lancement du projet

### Clone et installation des dépendances

```bash
git clone https://github.com/benribou/tp-arm-raspberry.git
cd thermostat-dashboard
npm install
npm run build
npm start
