import React, { useState } from "react";
import { Navbar, Domain, Problem, Plan } from "./components";

function App() {
  const [domainValue, setDomainValue] = useState("");
  const [problemValue, setProblemValue] = useState("");

  function handleSavedDomain(value) {
    setDomainValue(value)
    // Function to handle saving the domain value to be accessed by the plan component
  }

  function handleSavedProblem(value) {
    setProblemValue(value)
    // Function to handle saving the problem value to be accessed by the plan component
  }
  
  return (
    <>
      <div data-testid="navbar">
        <Navbar/>
      </div>
      <div data-testid="components">
        <Domain saveDomainValue={handleSavedDomain}/>
        <Problem saveProblemValue={handleSavedProblem}/>
        <Plan domainValue={domainValue} problemValue={problemValue} />
      </div>
      </>
  );
}

export default App;
