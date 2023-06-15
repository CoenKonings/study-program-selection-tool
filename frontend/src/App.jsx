/**
 * Author:      Coen Konings
 * Date:        June 5, 2023
 *
 * Edited:      June 12, 2023
 * By:          Coen Konings
 */

import { useEffect, useState } from 'react';
import './App.css';
import PawPaw from './components/PawPaw.jsx';
import DecisionTree from './components/DecisionTree.jsx';
import ConversationalSystem from './components/ConversationalSystem.jsx';

/**
 * Main App component which functions as the root of the component tree.
 */
function App() {
  return (
    <>
        <SystemSelector />
    </>
  );
}

/**
 * This component allows the user to select one of the decision support
 * systems.
 */
function SystemSelector() {
  // System 0 is Decision Tree, system 1 is PAW-PAW, system 2 is the
  // conversational system. Any other value displays the SystemSelector
  // component.
  let [system, setSystem] = useState(null);
  let [display, setDisplay] = useState(null);
  let [time, setTime] = useState(0);
  let [isRunning, setIsRunning] = useState(false);

  // Return the user to the menu by setting the selected system to null.
  // Stop the timer if it was started. Send the recorded time to the back-end.
  const reset = () => {
    fetch(`${import.meta.env.VITE_API_URL}timer/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "system": system,
        "time": time
      })
    });

    setSystem(null);
    setIsRunning(false);
    setTime(0);
  }


  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 0.1), 100)
    }
    return () => clearInterval(intervalId);

  }, [isRunning, time])

  useEffect(() => {
    if (system !== null) {
      setIsRunning(true);
    }

    if (system === 0) {
      setDisplay(<DecisionTree />);
    } else if (system === 1) {
      setDisplay(<PawPaw />);
    } else if (system === 2) {
      setDisplay(<ConversationalSystem />);
    } else {
      setDisplay([
        <h1 key="select-title">Selecteer een systeem</h1>,
        <button key="dt-btn" onClick={() => setSystem(0)}>
          Decision Tree
        </button>,
        <button key="pawpaw-btn" onClick={() => setSystem(1)}>
          PAW-PAW
        </button>,
        <button key="conv-btn" onClick={() => setSystem(2)}>
          Conversational System
        </button>
      ]);
    }
  }, [system]);

  return (
    <>
      {display}
      {
        system !== null &&
        <div className='back-button'>
          <button onClick={reset}>Terug naar hoofdmenu</button>
        </div>
      }
    </>
  );
}

export default App;
