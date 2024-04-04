import React, { useState } from "react";

function Domain( {saveDomainValue}) {

    const [domainValue, setDomainValue] = useState("");
    const [editMode, setEditMode] = useState(true);
    
    function toggleEditMode() {
        setEditMode(!editMode);
        // Function to allow domain to be edited
    }

    function saveChange() {
        setEditMode(!editMode);
        saveDomainValue(domainValue);
        // Function which calls the handleSavedDomain function in the App.jsx file
    }

    if (editMode == true) {
        return(
            <>
                <h1 data-testid="title" style={{textAlign: "center"}}>Domain</h1>
                <textarea style={{display: "block", marginLeft: "auto", resize: "none", margin: "auto", width: "80%"}}
                rows="20" name="postContent" placeholder="Type in your domain"
                value={domainValue}
                onChange={(e) => setDomainValue(e.target.value)}/>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "20px"}}>
                    <button data-testid="save-button" className="button-40" onClick={saveChange}>Save</button>
                </div>
            </>
        )
    }
    else {
        return(
            <>
                <h1 style={{textAlign: "center"}}>Domain</h1>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "20px"}}>
                    <pre data-testid="domain-text">{domainValue}</pre>
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px", marginBottom: "20px"}}>

                    <button data-testid="edit-button" className="button-40" onClick={toggleEditMode}>Edit</button>
                </div>
            </>
        )
    }
};
export default Domain;

