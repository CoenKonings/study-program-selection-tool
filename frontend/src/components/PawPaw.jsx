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

  // Set currentComparison to the next comparison.
  const goToNextComparison = () => {
    if (currentComparison === null) {
      console.log("Setting currentComparison to [0, 1]");
      setCurrentComparison([0, 1]);
      return;
    }

    // Shallow copy of currentComparison.
    let nextComparison = [...currentComparison];

    if (nextComparison[1] < comparisons.length - 1) {
      nextComparison[1]++;
    } else if (nextComparison[0] < comparisons.length - 2) {
      nextComparison[0]++;
      nextComparison[1] = nextComparison[0] + 1;
    } else {
      nextComparison = null;
    }

    console.log("Setting currentComparison to " + nextComparison);
    setCurrentComparison(nextComparison);
  };

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
      console.log("setting currentComparison to [0, 1]");
      setCurrentComparison([0, 1]);
    }
  }, [selectedCriteria]);

  // Display criteria selector if no criteria were selected, otherwise display
  // the comparisons to be made by the user.
  return (
    <>
      <h2>PAW-PAW</h2>
      {currentComparison === null ? <CriteriaSelector
        criteria={criteria}
        setSelectedCriteria={setSelectedCriteria}
      /> : <Comparison
        criteria={selectedCriteria}
        currentComparison={currentComparison}
        comparisons={comparisons}
        setComparisons={setComparisons}
        goToNextComparison={goToNextComparison}
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
function Comparison({ criteria, currentComparison, comparisons, setComparisons, goToNextComparison }) {
  let [mostImportant, setMostImportant] = useState(null);
  let [relativeImportance, setRelativeImportance] = useState(null);

  const criterium1 = criteria[currentComparison[0]];
  const criterium2 = criteria[currentComparison[1]];
  let relativeImportanceSelector = [];

  for (let i = 1; i < 9; i++) {
    // Generate the radio buttons for evaluation of relative importance.
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

  // Change a value in "comparisons" at (x, y) using "setComparisons".
  const updateMatrix = (x, y, value) => {
    // Create copy of comparisons.
    const newComparisons = comparisons.slice();
    // Update value at relevant locations.
    newComparisons[x][y] = value;
    newComparisons[y][x] = 1 / value;
    setComparisons(newComparisons);
  }

  // Update the state with the user's decision on which criterium is more
  // important.
  const handleClick = (answer) => {
    console.log(answer);
    // Check if the answer changes anything.
    if (answer === mostImportant) {
      return;
    }

    setMostImportant(answer);

    if (answer === -1) {
      updateMatrix(currentComparison[0], currentComparison[1], 1);
      console.log("even belangrijk");
      return;
    }

    // Ensure that the matrix is updated if the user selects the other
    // criterium after a relative importance was already given.
    if (relativeImportance) {
      const x = currentComparison[answer];
      const y = currentComparison[Math.abs(answer - 1)];
      updateMatrix(x, y, relativeImportance);
    }
  }

  const handleChange = (event) => {
    const rating = parseInt(event.target.value) + 1;
    setRelativeImportance(rating);
    // Set x to position of more important criterium.
    const x = currentComparison[mostImportant];
    const y = currentComparison[Math.abs(mostImportant - 1)];
    updateMatrix(x, y, rating);
  }

  // Handle the user clicking the "next" button.
  const handleNextClick = () => {
    setMostImportant(null);
    setRelativeImportance(null);
    goToNextComparison();
  }

  return (
    <>
      <h2>Selecteer wat je belangrijker vindt:</h2>
      <div>
        <p>{criterium1.description}</p>
        <p>of</p>
        <p>{criterium2.description}</p>
      </div>
      <div>
        <button
          onClick={() => handleClick(0)}
          className={mostImportant === 0 ? 'active' : ''}
        >
          {criterium1.description}
        </button>

        <button
          onClick={() => handleClick(-1)}
          className={mostImportant === -1 ? 'active' : ''}
        >Even belangrijk</button>

        <button
          onClick={() => handleClick(1)}
          className={mostImportant === 1 ? 'active' : ''}
        >
          {criterium2.description}
        </button>
      </div>
      {mostImportant !== null && mostImportant >= 0 && <>
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
      <button
        onClick={handleNextClick}
        disabled={relativeImportance === null && mostImportant !== -1}
      >Verder</button>
    </>
  )
}

export default PawPaw;
