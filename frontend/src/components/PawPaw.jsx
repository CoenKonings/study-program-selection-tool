import { useState, useEffect } from 'react'

/**
 * The component that provides an interface for the PAW-PAW decision support
 * system.
*/
function PawPaw({ reset }) {
  let [criteria, setCriteria] = useState([]);
  let [selectedCriteria, setSelectedCriteria] = useState([]);
  let [currentComparison, setCurrentComparison] = useState(0);
  let [comparisons, setComparisons] = useState(null);

  // Function to get all criteria from the back-end. TODO: URL in env.
  const fetchCriteria = () => fetch("http://localhost:8000/criteria/")
    .then(response => {
      return response.json();
    })
    .then(data => {
      setCriteria(data);
    });

    // Fetch criteria when the component loads.
    useEffect(() => {
      fetchCriteria();
    }, []);

    // Initialize comparison matrix when selectedCriteria is updated.
    useEffect(() => {
      const size = selectedCriteria.length;

      if (size !== 0) {
        // Create 2D array with "size" rows and "size" columns filled with 0s.
        setComparisons(new Array(size).fill().map(() => new Array(size).fill(0)));
      }
    }, [selectedCriteria]);

    useEffect(() => {
      console.log(comparisons);
    }, [comparisons]);

  // Display criteria selector if no criteria were selected, otherwise display
  // the comparisons to be made by the user.
  return (
    <>
      <h2>PAW-PAW</h2>
      {selectedCriteria.length === 0 ? <CriteriaSelector
        criteria={criteria}
        setSelectedCriteria={setSelectedCriteria}
      /> : <Comparison />}
      <button onClick={reset}>Terug naar hoofdmenu</button>
    </>
  );
}

/**
 * A component that allows the user to select which criteria to use PAW-PAW.
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

  // Called when a checkbox for a criterium is checked or unchecked.
  const handleCheck = (event, criterium) => {
    if (event.target.checked) {
      // Add criterium to checkedCriteria.
      setCheckedCriteria([...checkedCriteria, criterium]);
    } else {
      // Remove criterium from checkedCriteria.
      setCheckedCriteria(checkedCriteria.filter(c => c !== criterium));
    }
  }

  // Called when the criteria selection form is submitted.
  const handleSubmit = (event) => {
    event.preventDefault();
    setSelectedCriteria(checkedCriteria);
  }

  return (
    <>
      <h2>Selecteer de criteria die je wil meenemen in je keuze.</h2>
      <p>Aantal vragen dat je moet beantwoorden: {nQuestions}</p>
      <p>Aantal criteria: {checkedCriteria.length}</p>
      <form method="post" onSubmit={handleSubmit} className="criteria-form">
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
        <button type="submit" disabled={checkedCriteria.length <= 1}>Verder</button>
      </form>
    </>
  );
}

/**
 * A component that allows the user to perform a pair-wise comparison of
 * criteria.
 */
function Comparison() {
  return (
    <>
      <p>test</p>
    </>
  )
}

export default PawPaw;
