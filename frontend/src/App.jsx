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
  const reset = () => setSystem(null);

  useEffect(() => {
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
