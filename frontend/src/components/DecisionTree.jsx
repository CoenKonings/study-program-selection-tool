/**
 * Author:      Coen Konings
 * Date:        June 12, 2023
 *
 * DecisionTree.jsx:
 * Contains the components used for the front-end of the decision tree decision
 * support system.
 */

import { useState, useEffect } from 'react';

/**
 * The component that provides an interface for the Decision Tree decision
 * support system.
 */
function DecisionTree() {
  let [currentNode, setCurrentNode] = useState(null);

  // Fetch the root of the first decision tree. There should only be one
  // decision tree in the back-end.
  const fetchRoot = () => fetch(`${import.meta.env.VITE_API_URL}decision-trees/`)
    .then(response => response.json())
    .then(data => {
      fetchNode(data[0].root);
    });

    // Fetch the node with the given ID and set it as currentNode.
    const fetchNode = (id) => {
      fetch(`${import.meta.env.VITE_API_URL}nodes/${id}/`)
        .then(response => response.json())
        .then(data => {
          setCurrentNode(data);
        });
    };

    useEffect(() => {
      fetchRoot();
    }, []);

    useEffect(() => {
      console.log("DEBUG current node");
      console.log(currentNode);
    }, [currentNode]);

  return (
    <>
      <h1>Decision Tree</h1>
      {
        !currentNode
          ? <h2>Loading...</h2>
          : !currentNode.result
            ? <Decision
              question={currentNode.question.text}
              answers={currentNode.question.answer_set}
              fetchNode={fetchNode}
            />
            : <>
            <h2>Resultaat:</h2>
            <p>{currentNode.result.name}</p>
          </>
      }
    </>
  );
}

function Decision({ question, answers, fetchNode }) {
  let [answerButtons, setAnswerButtons] = useState(null);

  useEffect(() => {
    const buttons = [];

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      buttons.push(<button
        key={"answer-" + answer.id}
        onClick={()=>{fetchNode(answer.leads_to)}}
      >{answer.text}</button>);
    }

    setAnswerButtons(buttons);
  }, [answers]);

  return (
    <>
      <h2>{question}</h2>
      {answerButtons ? answerButtons : <h3>Loading...</h3>}
    </>
  )
}



export default DecisionTree;
