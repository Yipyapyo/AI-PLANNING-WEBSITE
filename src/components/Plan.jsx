import React, { useState } from "react";
import GraphViewer from "./GraphViewer";
import BarGraphViewer from "./BarGraphViewer";

function Plan( {domainValue, problemValue} ) {

  var [resultValue, setResultValue] = useState("");
  var [newResultValue, setNewResultValue] = useState("");
  var [computing, setComputing] = useState("false");

    

    // A function to find the action definition
    function findAction(actionName, domainContent) {
      const editedDomainContent = domainContent.toLowerCase();
      const startIndex = editedDomainContent.indexOf(actionName)
      let bracketCount = 1;
      let endIndex = startIndex + 1;

      while (bracketCount > 0 && endIndex < domainContent.length) {
        // This is a while loop which will only end when there is a closed bracket, if it sees an opening bracket then it will need to find an extra closing bracket 
        if (domainContent[endIndex] == "(") {
          bracketCount++;
        }
        else if (domainContent[endIndex] == ")") {
          bracketCount--;
        }
        endIndex++;
      }
      return domainContent.substring(startIndex, endIndex).trim();
    }
    
    // A function to find the effect description
    function findEffect(actionDefinition) {
      const regex = /:effect\s*([\s\S]+)/;
      const match = regex.exec(actionDefinition);
      if (match && match[1]) {
          return match[1].trim();
      } else {
          return "Effect not found";
      }
    }

    // A function to find the predicates in the domain file
    function findPredicates(domainContent) {
      const editedDomainContent = domainContent.toLowerCase();
      const startIndex = editedDomainContent.indexOf("(:predicates")
      let bracketCount = 1;
      let endIndex = startIndex + 1;

      while (bracketCount > 0 && endIndex < domainContent.length) {
        // This is a while loop which will only end when there is a closed bracket, if it sees an opening bracket then it will need to find an extra closing bracket 
        if (domainContent[endIndex] == "(") {
          bracketCount++;
        }
        else if (domainContent[endIndex] == ")") {
          bracketCount--;
        }
        endIndex++;
      }
      return domainContent.substring(startIndex, endIndex).trim();
    }

    // A function to find the goal definition
    function findGoal(problemContent) {
      const problem = problemContent.toLowerCase();
      const startIndex = problem.indexOf("(:goal")
      let bracketCount = 1;
      let endIndex = startIndex + 1;

      while (bracketCount > 0 && endIndex < problemContent.length) {
        // This is a while loop which will only end when there is a closed bracket, if it sees an opening bracket then it will need to find an extra closing bracket 
        if (problemContent[endIndex] == "(") {
          bracketCount++;
        }
        else if (problemContent[endIndex] == ")") {
          bracketCount--;
        }
        endIndex++;
      }
      return problemContent.substring(startIndex, endIndex).trim();
    }

    // Return the action name
    function getActionName(action) {
      const words = action.split(" ");
        // This splits the action by spaces
      const actionA = "(:action " + (words[0]);
      return actionA;
    }
    
    // Return the action split into words as an array
    function getActionInWords(action) {
      return action.split(" ");
    }

    // A function to get the preconditions from an action
    function getPreconditions(actionDefinition) {
      const startIndex = actionDefinition.indexOf(":precondition");
      // Get the index of where ":precondition" is in the action definition
      const startPreconditionIndex = startIndex + (":precondition").length;
      const effectIndex = actionDefinition.indexOf(':effect');
      // Get the index of where ":effect" is in the action definition
      let preconditions = actionDefinition.substring(startPreconditionIndex, effectIndex).trim();
      // Get the preconditions
      preconditions = preconditions.replace(/\n/g, '');
      preconditions = preconditions.split(/\s+/).filter(param => param.trim() !== '');
      preconditions = `${preconditions.join(' ')}`;
      // Clean the preconditions
      return (preconditions);
    }

    // A function to get the parameters from an action
    function getParameters(actionDefinition) {
      const startIndex = actionDefinition.indexOf(":parameters");
      // Get the index of where ":parameters" is in the action definition
      const startParameterIndex = startIndex + (":parameters").length;
      const preconditionIndex = actionDefinition.indexOf(':precondition');
      // Get the index of where ":preconditions" is in the action definition
      let parameters = actionDefinition.substring(startParameterIndex, preconditionIndex).trim();
      // Get the parameters
      parameters = parameters.replace(/\n/g, '');
      parameters = parameters.split(/\s+/).filter(param => param.trim() !== '');
      parameters = `${parameters.join(' ')}`;
      // Clean the parameters 
      return (parameters);
    }
    
    // A function to get the constraint of an action
    function getConstraint(action, domainContent, problemContent) {
      if (checkActionExists(action, domainContent, problemContent) == true) {  
        const actionA = getActionName(action);
        const words = getActionInWords(action);
        const actionDefinition = findAction(actionA, domainContent);
        const effectDefinition = findEffect(actionDefinition);
        const effectLines = separateEffects(effectDefinition)
        const effect = checkForNegativeConditions(effectLines)
        // This searches whether the effects are all negative conditions, if not then the effects without negations are returned for that action 
        let constraintToAdd = ""
        if (checkForNegativeConditions(effectLines) != true) {
          // Checks whether the effects are all negative conditions
          for (let i = 0; i < effect.length; i++) {
            // A for loop iterating over each effect in the description
            if (checkForParameters(effect[i]) == true) {
              const parameters = getParameters(actionDefinition);
              let constraint1 = parseParametersOverAction(effect[i], action, parameters, words[0]);
              // Parse the parameters over the action to return the effect with the specific parameters it changes
              constraint1 = constraint1.replace(/\(/g,"").replace(/\)/g, "");
              // The constraint is now created and removes any brackets 
              constraintToAdd += "(" + constraint1 + ") ";
              // Adds the constraint created to the empty string defined above
            }
            else {
              constraintToAdd += effect[i];
              // If there are no parameters for the effect to change then add this effect straight to the constraint string
            }
          }
          return constraintToAdd;
        }
        else {
          return "negative"
        }
      }
      else {
        return false;
      }
    }

    // Check whether there is a parameter in the effect 
    function checkForParameters(effect) {
      if (effect.includes("?")) {
        return true;
      }
      else {
        return false;
      }
    }

    // A function to check whether two actions are the same
    function checkActionsAreSame(action, action2) {
      const actionA = getActionName(action)
      const actionB = getActionName(action2)
      // Get the first word in action B
      if (actionA == actionB) {
        // If the first word in action A is the same as action B then they are the same action
        return true
      }
      else {
        return false
      }
    }

    // A function to check the validity of an action
    function checkAction(action, action2, domainContent, problemContent) {
      if (getConstraint(action, domainContent, problemContent) != false && getConstraint(action2, domainContent, problemContent) != false) {
        return true
      }
      else if (getConstraint(action, domainContent, problemContent) == "negative") {
        setComputing("false")
        window.alert("Unfortunately the effects of this action all contain a negative condition which Optic does not support yet")
        // This alerts the user that the action contains all negative conditions which Optic doesn't support yet
      }
      else {
        setComputing("false")
        window.alert("The actions provided do not exist")
        // This alerts the user that the actions provided does not exist
      }
    }

    // A function to check whether the domain content contains adl
    function checkDomainValidity(domainContent) {
      const lines = domainContent.split('\n');
      // This splits the domain content into lines
      let supportedContent = true
      for (let line of lines) {
        // This is a for loop which iterates over each line in the domain content and checks if it contains any unsupported requirements
        if (line.includes(':adl')) {
          supportedContent = "adl";
          return supportedContent

        }
        else if(line.includes(":disjunctive-preconditions")) {
          supportedContent = "disjunctive-preconditions"
          return supportedContent

        }
        else if(line.includes(":existential-preconditions")) {
          supportedContent = "existential-preconditions"
          return supportedContent
        }
        else if(line.includes(":conditional-effects")) {
          supportedContent = "conditional-effects"
          return supportedContent
        }
        else if(line.includes(":domain-axioms")) {
          supportedContent = "domain-axioms"
          return supportedContent
        }
        else if(line.includes(":subgoals-through-axioms")) {
          supportedContent = "subgoals-through-axioms"
          return supportedContent
        }
        else if(line.includes(":safety-constraints")) {
          supportedContent = "safety-constraints"
          return supportedContent
        }
        else if(line.includes(":open-world")) {
          supportedContent = "open-world"
          return supportedContent
        }
        else if(line.includes(":quantified-preconditions")) {
          supportedContent = "quantified-preconditions"
          return supportedContent
        }
        else if(line.includes(":ucpop")) {
          supportedContent = "ucpop"
          return supportedContent
        }
      }
      return supportedContent
    }

    // A function to check if the effect description contains all negative conditions
    function checkForNegativeConditions(effectDescription) {
      const filteredArray = effectDescription.filter(str => !str.includes("not"));
      // Create an array which filters the effect description for the word "not"
      let newArray = []
      for (let effect of filteredArray) {
        // Iterates over each effect in the filtered array which does not contain the word "not"
        if (effect.includes("and")){
          const startIndex = effect.indexOf("and ");
          newArray.push(effect.substring(startIndex+4, effect.length).trim());
            // If the effect contains "and" then add the effect to the empty array removing the word "and"
        }
        else {
          const startIndex = effect.indexOf('(');
          const endIndex = effect.lastIndexOf(')');
          newArray.push(effect.substring(startIndex, effect.length).trim());
          // Add the effect in between two brackets to the empty array
        }
      }
      if (filteredArray == []) {
        return true;
        // If the filtered array does not contain any effect which do not include the word "not" then this effect description only contains negative conditions
      }
      else {
        return (newArray)
      }
    }

    // A function to check whether an action exists
    function checkActionExists(action, domainContent, problemContent) {
      const actionA = getActionName(action);
      let words = getActionInWords(action);
      words = words.slice(1)      
      const actionDefinition = findAction(actionA, domainContent);
      const parameters = getParameters(actionDefinition);
      const preconditions = getPreconditions(actionDefinition)
      let parametersList = parameters.split(" ");
      // Split the parameters by space
      parametersList = parametersList.map(item => item.replace(/[()]/g, ''))
      const regex = /\([^()]*\)|[^()\s]+/g;
      const matches = preconditions.match(regex);
      // Remove all brackets
      let predicates = []
      for (let i = 0; i < parametersList.length; i++) {
        // Iterates over each parameter
        let preconditionsList = matches.filter(part => part.includes(parametersList[i]));
        // Filter the preconditions by the parameters to get a list where only the preconditions defining the parameters are left
        preconditionsList = preconditionsList.filter(part => /\(\w+ \?[^ ]+\)/.test(part));
        predicates = predicates.concat(preconditionsList)
        // Add the preconditions which the parameters are defined by to the predicates array
      }
      const mapping = {};
      for (let i = 0; i < parametersList.length; i++) {
        // Iterates over each parameter
          mapping[parametersList[i]] = words[i];
          // Maps the parameter to each word in the action
      }
      for (const key in mapping) {
        // Iterates over each key in the mapping
        for (let i = 0; i < predicates.length; i++) {
          // Iterates over each predicate
            if (predicates[i].includes(key)) {
            predicates[i] = predicates[i].replace(key, mapping[key]);
            predicates[i] = predicates[i].toLowerCase()
            // If the predicates contains the key then replace it with the action parameter
          }
        }
      }
      predicates = predicates.map(str => str.replace(/[(]/g, "").replace(/[)]/g, ""));
      // Removes all brackets
      for (let i = 0; i < predicates.length; i++) {
        // Iterates over each predicates
        if (problemContent.includes(predicates[i]) != true) {
          // If the problem file does not contain the predicate then the action does not exist
          return false
        }
      }
      return true
    }

    // A function to add the effect to the predicates
    function addNewEffectToPredicates(effect, parameters, predicates) {
      return (predicates.slice(0, -1) + " (" + effect + " " + parameters.replace("(", "") + ")")
    }

    // A function to add the effect to the goal in the problem file
    function addNewEffectToGoal(action,effect, problemContent) {
      const words = getActionInWords(action);
      const goal = findGoal(problemContent).slice(0, -2);
      const newGoal = goal + " (preference actionA (" + effect + " " + words.slice(1) + "))))";
      return (problemContent.replace(findGoal(problemContent), newGoal));
    }

    // A function to add a new effect to the action in the domain file
    function addNewEffectToAction(newEffect, actionDefinition) {
      const parameters = getParameters(actionDefinition);
      if (findEffect(actionDefinition).includes("and")) {
        const effect = findEffect(actionDefinition).slice(0, -2) + " (" + newEffect + " " + parameters.replace("(","") +"))";
        return (actionDefinition.replace((findEffect(actionDefinition)), effect));

      }
      else {
        const effect = "(and " + findEffect(actionDefinition).slice(0, -1) + " (" + newEffect + " " + parameters.replace("(","") +"))";
        return (actionDefinition.replace((findEffect(actionDefinition)), effect));
      }
    }

    // A function to add the requirements to the domain file
    function addRequirements(domainContent, requirements) {
      const lines = domainContent.split('\n');
      lines[1] = "(:requirements " + (requirements);
      // This adds the requirements to the domain content
      const modifiedDomain = lines.join('\n');
      return modifiedDomain;
    }

    // A function to separate the effects in the effect definition
    function separateEffects(effectDefinition) {
      const parts = [];
      let currentPart = '';
      for (let char of effectDefinition) {
        // Iterate over each character in the effect definition
          if (char === ')') {
              currentPart += char;
              parts.push(currentPart);
              currentPart = '';
              // If the character is a closing bracket then add all the parts iterated before to the array
          } 
          else {
              currentPart += char;
              // If the character is not a closing bracket then the character is added to the current part 
          }
      }
      const cleanArray = parts.filter(item => item !== ")");
      return cleanArray;
    }

    // A function to parse the parameters over an action to get the predicates
    function parseParametersOverAction(effect, action, parameters, actionName) {
      const actionParameters = action.substring(actionName.length + 1).split(" ");
      let predicates = effect;
      let parametersList = parameters.split(" ");
      parametersList = parametersList.map(item => item.replace(/[()]/g, ''))
      const mapping = {};
      for (let i = 0; i < parametersList.length; i++) {
        // Iterate over each parameter
          mapping[parametersList[i]] = actionParameters[i];
          // Create a mapping for each parameter in the action definition and the actual parameter used
      }
      for (const key in mapping) {
        // Iterate over each key in the mapping
        if (effect.includes(key)) {
          predicates = predicates.replace(key, mapping[key])
          // If the effect includes the key then replace predicate which contains the key with the parameter in the action
        }
      }
      return(predicates)
    }

    // A function to modify the requirements in the domain file
    function modifyRequirements(domainContent) {
      const lines = domainContent.split('\n');
      let requirements = [];
      for (let line of lines) {
        // This is a for loop which iterates over each line in the domain content
        if (line.includes(':requirements')) {
            const startIndex = line.indexOf(':requirements') + ':requirements'.length;
            const requirementsStr = line.substring(startIndex).trim().replace(/[()]/g, '');
            requirements = requirementsStr.split(/\s+/);
            break;
        }
      }
      requirements += " :constraints :preferences)"
      // This adds the constraints and preferences to the requirements to enable them to be used later
      return addRequirements(domainContent,requirements);
    }

    // A function to modify the domain and problem file by adding a new effect to the action and a new goal containing the action
    function modifyTheDomainAndProblemFile(action, domainContent, problemContent, button2) {
      const actionA = getActionName(action);
      const words = getActionInWords(action);
      const actionDefinition = findAction(actionA, domainContent);
      const newEffect = "done_" + actionA.replace("(:action ", "");
      const newActionDefinition = addNewEffectToAction(newEffect, actionDefinition);
      const predicates = findPredicates(domainContent);
      const parameters = getParameters(actionDefinition);
      const newPredicates = addNewEffectToPredicates(newEffect, parameters, predicates);
      const newDomain = domainContent.replace(actionDefinition, newActionDefinition).replace(predicates, newPredicates);
      const newProblem = addNewEffectToGoal(action, newEffect, problemContent)
      const metric = "(:metric minimize (+ (is-violated actionA) 10000 )))";
      if (button2==true) {
        return([newDomain, newProblem, metric, newEffect + " " + words.slice(1) + ")"]);
      }
      else {
        return([newDomain, newProblem, metric]);
      }
    }

    // This is a function to find the plan where action A is not used but instead action B is
    function whyActionAInsteadOfB(domainContent, problemContent, action, action2, ) {
      if (checkActionsAreSame(action, action2) == true) {  
        // This checks if the actions are the same 
        if (checkAction(action, action2, domainContent, problemContent) == true) {
          // This checks if the constraints for the actions are available
          const result =  modifyTheDomainAndProblemFile(action2, domainContent, problemContent);
          generateNewPlan(result[0], result[1], "", result[2])
          // Finds the new plan with the new action 
        }
      }
      else {
        setComputing("false")
        window.alert("The actions provided are not the same");
        // This alerts the user that the actions provided are not the same
      }
    }

    // This is a function to find the plan where action B is used before action A 
    function whyActionAUsedBeforeB(domainContent, problemContent, action, action2) {
      if (checkAction(action, action2, domainContent, problemContent) == true) {
        const result = modifyTheDomainAndProblemFile(action, domainContent, problemContent, true);
        const result2 = modifyTheDomainAndProblemFile(action2, result[0], result[1], true);
        const constraintString = "(:constraints (preference actionB (sometime-after (" + result[3] + " (" + result2[3] +"))))";
        const metric = "(:metric minimize (+ (* (is-violated actionA) 1000) (* (is-violated actionB) 1000))))";
        generateNewPlan(result2[0], result2[1], constraintString, metric);
      }
    }

    // A function to find a new plan with the new problem file and new domain file 
    function generateNewPlan(domainContent, problemContent, constraintString, metricString) {
      const newDomain = modifyRequirements(domainContent);
      // This adds the constraint and preferences to the domain content requirements
      let newProblem = problemContent.slice(0, -1) + '\n' + (constraintString);
      // This adds the constraint to the problem content
      newProblem = newProblem.slice(0, -1) + '\n' + (metricString);
      // This adds the metric string to the problem content
      posting(newDomain, newProblem, true); 
      // This posts the new domain and new problem to the api to find the new plan
    }

    // A function to reset the page
    function reset() {
      setResultValue("");
      setNewResultValue("");
      setComputing("false")
    }

    // A function to handle the find plan button
    function handleFindPlan(domainValue, problemValue) {  
      if (!domainValue) {
        window.alert('Please provide a domain.');
      }
      else if (!problemValue) {
        window.alert('Please provide a problem.');
      }
      else {
        setComputing("computing-original")
        posting(domainValue, problemValue, false);
      }
    }

    // A function to handle the first button
    function handleButton1(domainValue, problemValue, actionA, actionB) {
      setComputing("computing-new")
      whyActionAInsteadOfB(domainValue, problemValue, actionA, actionB)
    }

    // A function to handle the second button
    function handleButton2(domainValue, problemValue, actionA, actionB) {
      setComputing("computing-new")
      whyActionAUsedBeforeB(domainValue, problemValue, actionA, actionB)
    }

    // A function to find the original plan
    function posting(domText, probText, isNewPlan) {

        const reqBody = {
          domain: domText,
          problem: probText
        };
      const supportedContent = checkDomainValidity(domText);
      if ((supportedContent) == true) {
        // Send job request to solve endpoint
        fetch("http://18.170.230.213:5001/package/optic/solve", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reqBody)}).then(response => response.json()).then(solveRequestUrl => {
          console.log('Computing...');
          let status = "PENDING";

        // Query the result every 0.5 seconds while the job is executing
          const queryResult = () => {
          fetch('http://18.170.230.213:5001' + solveRequestUrl.result).then(response => response.json()).then(result => {status = result.status || "";
            if (status === 'PENDING') {
              setTimeout(queryResult, 500);
            } 
            else {
              setComputing("false")
              if (isNewPlan == false) {
                setResultValue(trim(result.result.output.plan));
              }
              else {
                setNewResultValue(trimSecondPlan(result.result.output.plan));
              }
              
            }
          })
          .catch(error => console.error(error));
          };

          queryResult();
        })
        .catch(error => console.error(error));
      }
      else {
        setComputing("false")
        console.log(supportedContent)
        window.alert("Unfortunately the Optic Planner does not currently have support for " + supportedContent);
      }
    }

    // A function trim the unnecessary information from the result
    function trim(resultString) {
      let startIndex = resultString.indexOf('; Plan');
      let endIndex = resultString.indexOf('\n\n', startIndex);
      if (endIndex == -1) {
        endIndex = resultString.indexOf('Solution', startIndex)
        if(endIndex ==-1) {
          endIndex = resultString.length;
        }
      }
      let filteredResult = resultString.substring(startIndex, endIndex);
      startIndex = filteredResult.indexOf("Time");
      filteredResult = filteredResult.substring(startIndex, endIndex);
      filteredResult = filteredResult.split("\n");
      filteredResult = filteredResult.join("\n")
      filteredResult = filteredResult.replace(";;;;", "")
      return filteredResult
    }

    // A function trim the unnecessary information from the result
    function trimSecondPlan(resultString) {
      let startIndex = resultString.indexOf('Theoretical reachable cost');
      let endIndex = resultString.indexOf('\n\n', startIndex);
      if (endIndex == -1) {
        endIndex = resultString.indexOf('Solution', startIndex)
        if(endIndex ==-1) {
          endIndex = resultString.length;
        }
      }
      let filteredResult = resultString.substring(startIndex, endIndex);
      startIndex = filteredResult.indexOf("Time");
      filteredResult = filteredResult.substring(startIndex, endIndex);
      filteredResult = filteredResult.split("\n");
      filteredResult = filteredResult.filter(line => !line.includes("Dummy"))
      filteredResult = filteredResult.join("\n")
      filteredResult = filteredResult.replace(";;;;", "")
      return filteredResult
    }

    // A function to compare both plans
    function comparePlans(originalPlan, newPlan) {
      const originalActions = originalPlan.split("\n");
      const newActions = newPlan.split("\n");
      // Split the plans into individual actions

      // Create an array to store the differences
      const differences = [];
  
      // Compare each action in the original plan with the corresponding action in the new plan
      newActions.forEach((action, index) => {
          if (action !== originalActions[index]) {
              differences.push({
                  index: index,
                  original: action,
                  new: newActions[index]
                  // If the actions are different, add the index and the different actions to the differences array
              });
          }
      });
  
      return differences;
    }
      
    function highlightDifferences(originalPlan, newPlan) {
      const differences = comparePlans(originalPlan, newPlan);
      // Compare the plans to identify the differences

      const highlightedPlan = newPlan.split("\n").map((action, index) => {
          const difference = differences.find(diff => diff.index === index);
          if (difference) {
              // If the action differs from the corresponding action in the new plan, highlight it in red
              return `<span style="color: red;">${difference.original}</span>`;
          } 
          else {
              return action;
          }
      }).join("\n");
      return <div dangerouslySetInnerHTML = {{ __html: highlightedPlan}} />;
    }

    return (
        <>
            {resultValue === "" && computing === "false" && (
              <div style={{ display: "flex", marginRight: "100px", justifyContent: "right", alignItems: "center"}}>
                <button data-testid="find-plan" className="button-40" style={{alignItems: "center"}} onClick={() => handleFindPlan(domainValue, problemValue)}>Find Plan</button>
              </div>
            )}
            
            {computing === "computing-original" && (
              <div data-testid="spinner" style={{display: "flex", justifyContent: "center"}}>
                <div className="spinner"></div>
              </div>
            )}

            {resultValue !== "" &&  (
              <div className="container">
                  <h1 data-testid="plan-title" style={{textAlign: "center"}}>Plans</h1>
                  <div>
                    <div style ={{textAlign: "center", display: "flex", justifyContent: "center"}}>
                      <div style={{ margin: "0 100px" }}>
                      <div data-testid="original-plan" >Original Plan:</div>
                        <pre data-testid="plan">
                          {resultValue}
                        </pre>
                      </div>
                        <div>
                          {newResultValue === "" && (
                            <pre></pre>
                          )}
                          {newResultValue !== "" && (
                            <div style={{ margin: "0 100px" }}>
                              <div data-testid="new-plan-title">New Plan:</div>
                                <pre data-testid="new-plan">
                                  {highlightDifferences(resultValue, newResultValue)}
                                </pre>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                  {computing === "computing-new" && (
                          <div style={{display: "flex", justifyContent: "center", marginBottom: "20px"}}>
                            <div className="spinner"></div>
                          </div>
                  )}
                  {newResultValue !== "" && (
                    <>
                    <div data-testid="graph-viewer" style={{ display: "flex", justifyContent: "center" }}>
                      <GraphViewer original={resultValue} newPlan={newResultValue}></GraphViewer>
                    </div>
                    <div data-testid="chart-viewer">
                      <BarGraphViewer original={resultValue} newPlan={newResultValue}></BarGraphViewer>
                    </div>
                  </>
                  )}
                  <div style={{display: "flex", justifyContent: "space-around" }}>
                  <button data-testid="reset" className="button-40" style={{alignItems: "center"}} onClick={() => reset()}>Reset</button>
                  <button data-testid="button1" className="button-40" style={{alignItems: "center"}} onClick={() => {{
                    const actionA = prompt("Please enter Action A");
                    if (actionA != null && actionA != "") {
                      const actionB = prompt("Please enter Action B");
                      if (actionB != "" && actionB != null) {
                        handleButton1(domainValue, problemValue, actionA, actionB)
                      }}}}}
                    >Why is Action A used instead of Action B</button>
                  <button data-testid="button2" className="button-40" style={{alignItems: "center"}} onClick={() => {{
                    const actionA = prompt("Please enter Action A");
                    if (actionA != null && actionA != "") {
                      const actionB = prompt("Please enter Action B");
                      if (actionB != "" && actionB != null) {
                        handleButton2(domainValue, problemValue, actionA, actionB)
                      }}}}}
                    >Why is Action A used Before Action B</button>
                </div>
              </div>
              
            )}
        </>
    );
}

export default Plan;
