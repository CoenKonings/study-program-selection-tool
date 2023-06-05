import { useState, useEffect } from 'react'
import './App.css'

/**
 * Main App component which functions as the root of the component tree.
 */
function App() {
  return (
    <>
      <div>
        <SystemSelector />
      </div>
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
  const reset = () => setSystem(null);

  if (system === 0) {
    return <DecisionTree
      reset={reset}
    />;
  } else if (system === 1) {
    return <PawPaw
      reset={reset}
    />;
  } else if (system === 2) {
    return <ConversationalSystem
      reset={reset}
    />;
  }

  return (
    <>
      <h1>Selecteer een systeem</h1>
      <button onClick={() => setSystem(0)}>Decision Tree</button>
      <button onClick={() => setSystem(1)}>PAW-PAW</button>
      <button onClick={() => setSystem(2)}>Conversational System</button>
    </>
  );
}

/**
 * The component that provides an interface for the PAW-PAW decision support
 * system.
*/
function PawPaw({ reset }) {
  let [criteria, setCriteria] = useState([]);
  let [selectedCriteria, setSelectedCriteria] = useState([]);

  const fetchCriteria = () => fetch("http://localhost:8000/criteria/")
    .then(response => {
      return response.json();
    })
    .then(data => {
      setCriteria(data);
    });

    useEffect(() => {
      fetchCriteria();
    }, []);

  return (
    <>
      <h2>PAW-PAW</h2>
      <CriteriaSelector
        criteria={criteria}
        setSelectedCriteria={setSelectedCriteria}
      />
      <button onClick={reset}>Back to menu</button>
    </>
  );
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
  );
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
  );
}

/**
 * A component that allows the user to select which criteria to use in PAW-PAW.
 */
function CriteriaSelector({ criteria, setSelectedCriteria }) {
  let [nQuestions, setNQuestions] = useState(0);
  let [checkedCriteria, setCheckedCriteria] = useState([]);

  // Recalculate the number of questions every time "checkedCriteria" is
  // updated.
  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < checkedCriteria.length; i++) {
      sum += i;
    }

    setNQuestions(sum);
  }, [checkedCriteria]);

  const handleCheck = (event, criterium) => {
    if (event.target.checked) {
      setCheckedCriteria([...checkedCriteria, criterium]);
    } else {
      setCheckedCriteria(checkedCriteria.filter(c => c !== criterium));
    }
  }

  // TODO: submit form -> set state in PawPaw component.
  return (
    <>
      <h2>Selecteer de criteria die je wil gebruiken.</h2>
      <p>Aantal vragen dat je gesteld gaat worden: {nQuestions}</p>
      <p>Aantal criteria: {checkedCriteria.length}</p>
      <form className="criteria-form">
        {criteria.map(criterium => (
          <label key={criterium.id}>
            <input
              type="checkbox"
              name={"criterium-" + criterium.id}
              id={"criterium-" + criterium.id + "-select"}
              onChange={(e) => handleCheck(e, criterium)}
            />
            {criterium.description}
          </label>
        ))}
      </form>
    </>
  );
}

export default App;
