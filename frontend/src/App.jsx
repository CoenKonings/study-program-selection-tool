import { useState } from 'react'
import './App.css'

/**
 * Main App component which functions as the root of the component tree.
 */
function App() {
  return (
    <>
      <div>
        <h1>Study Program Selection Support</h1>
        <SystemSelector />
      </div>
    </>
  )
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
  const reset = () => setSystem(null);

  if (system === 0) {
    return <DecisionTree
      reset={reset}
    />
  } else if (system === 1) {
    return <PawPaw
      reset={reset}
    />
  } else if (system === 2) {
    return <ConversationalSystem
     reset={reset}
    />
  }

  return (
    <>
      <button onClick={() => setSystem(0)}>Decision Tree</button>
      <button onClick={() => setSystem(1)}>PAW-PAW</button>
      <button onClick={() => setSystem(2)}>Conversational System</button>
    </>
  )
}

/**
 * The component that provides an interface for the PAW-PAW decision support
 * system.
*/
function PawPaw({ reset }) {
  return (
    <>
      <h2>PAW-PAW</h2>
      <button onClick={reset}>Back to menu</button>
    </>
  )
}

/**
 * The component that provides an interface for the Decision Tree decision
 * support system.
 */
function DecisionTree({ reset }) {
  return (
    <>
      <h2>Decision Tree</h2>
      <button onClick={reset}>Back to menu</button>
    </>
  )
}

/**
 * The component that provides an interface for the conversational decision
 * support system.
 */
function ConversationalSystem({ reset }) {
  return (
    <>
      <h2>Conversational System</h2>
      <button onClick={reset}>Back to menu</button>
    </>
  )
}

export default App
