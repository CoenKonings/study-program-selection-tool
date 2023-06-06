import { useState, useEffect } from 'react'

/**
 * The component that provides an interface for the PAW-PAW decision support
 * system.
*/
function PawPaw({ reset }) {
  // All criteria, to be fetched from the API.
  let [criteria, setCriteria] = useState([]);
  // Criteria selected to be used in comparisons.
  let [selectedCriteria, setSelectedCriteria] = useState([]);
  // The indices of the criteria that are currently being compared.
  let [currentComparison, setCurrentComparison] = useState(null);
  // The matrix resulting from the comparisons.
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
        const matrix = new Array(size).fill().map(() => new Array(size).fill(0));
        // Put 1s on the diagonals.
        for (let i = 0; i < matrix.length; i++) {
          matrix[i][i] = 1;
        }

        setComparisons(matrix);
      }
    }, [selectedCriteria]);

    // If comparisons change, set currentComparison to the next comparison.
    useEffect(() => {
      if (currentComparison === null) {
        setCurrentComparison([0, 1]);
        return;
      }

      // Shallow copy of currentComparison.
      let nextComparison = [...currentComparison];

      if (nextComparison[1] < comparisons.length - 1) {
        nextComparison[1]++;
      } else if (nextComparison[0] < comparisons.length - 1) {
        nextComparison[0]++;
        nextComparison[1] = nextComparison[0] + 1;
      } else {
        currentComparison = null;
      }
    }, [comparisons]);

  // Display criteria selector if no criteria were selected, otherwise display
  // the comparisons to be made by the user.
  return (
    <>
      <h2>PAW-PAW</h2>
      {selectedCriteria.length === 0 ? <CriteriaSelector
        criteria={criteria}
        setSelectedCriteria={setSelectedCriteria}
      /> : <Comparison
        criteria={selectedCriteria}
        currentComparison={currentComparison}
        comparisons={comparisons}
        setComparisons={setComparisons}
      />}
      <button onClick={reset} className='back-button'>Terug naar hoofdmenu</button>
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
function Comparison({ criteria, currentComparison, comparisons, setComparisons }) {
  let [mostImportant, setMostImportant] = useState(null);
  const criterium1 = criteria[currentComparison[0]];
  const criterium2 = criteria[currentComparison[1]];
  let relativeImportanceSelector = [];
  for (let i = 1; i < 9; i++) {
    relativeImportanceSelector.push(<label key={"relative-importance-" + i}>
      {i}
      <input
        type="radio"
        name="relative-importance"
        id={"relative-importance-" + i}
        value={i}
      />
    </label>);
  }

  const handleClick = (answer) => {
    const newComparisons = comparisons;

    if (answer === -1) {
      comparisons[currentComparison[1]][currentComparison[0]] = 1;
      setComparisons(newComparisons);
    } else if (answer = 0) {
      setMostImportant(0);
    } else {
      setMostImportant(1);
    }
  }

  const handleChange = (event) => {
    console.log(event);
  }

  return (
    <>
      <h2>Selecteer welk onderwerp je belangrijker vindt:</h2>
      <p>
        {criterium1.description} of {criterium2.description}
      </p>
      <div>
        <button onClick={() => handleClick(0)}>{criterium1.description}</button>
        <button onClick={() => handleClick(-1)}>Even belangrijk</button>
        <button onClick={() => handleClick(1)}>{criterium2.description}</button>
      </div>
      {mostImportant && <>
        <h2>Hoe veel belangrijker is dit criterium?</h2>
        <p>1 (iets belangrijker) - 8 (veel belangrijker)</p>
        <form
          method="post"
          onChange={handleChange}
          className="importance-form"
        >
          {relativeImportanceSelector}
        </form>
      </>}
    </>
  )
}

export default PawPaw;
