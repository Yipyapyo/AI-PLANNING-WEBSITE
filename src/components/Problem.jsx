import React, { useState } from "react";

function Problem( {saveProblemValue} ) {

    const [problemValue, setProblemValue] = useState("");
    const [editMode, setEditMode] = useState(true);
    
    function toggleEditMode() {
        setEditMode(!editMode);
        // Function to allow domain to be edited
    }

    function saveChange() {
        setEditMode(!editMode);
        saveProblemValue(problemValue);
        // Function which calls the handleSavedProblem function in the App.jsx file
    }

    if (editMode == true) {
        return(
            <>
                <h1 data-testid="title" style={{textAlign: "center"}}>Problem</h1>
                <textarea style={{display: "block", marginLeft: "auto", resize: "none", margin: "auto", width: "80%"}}
                rows="20" name="postContent" placeholder="Type in your problem"
                value={problemValue}
                onChange={(e) => setProblemValue(e.target.value)}/>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "20px"}}>
                    <button data-testid="save-button" className="button-40" onClick={saveChange}>Save</button>
                </div>            </>
        )
    }
    else {
        return(
            <>
                <h1 style={{textAlign: "center"}}>Problem</h1>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "20px"}}>
                    <pre data-testid="problem-text">{problemValue}</pre>
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "20px"}}>
                    <button data-testid="edit-button" className="button-40" onClick={toggleEditMode}>Edit</button>
                </div>
            </>
        )
    }
};
export default Problem;
