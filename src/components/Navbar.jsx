
function Navbar() {
    
    return (
        <header>
            <p data-testid="title">
            Francis Yip&nbsp;
            <span data-testid="website-name"> | Explainable AI Planning</span>
          </p>
            <nav>
                <a data-testid="editor" href="https://editor.planning.domains/">editor.planning.domains</a>
                <a data-testid="pddl-generator" href="https://github.com/AI-Planning/pddl-generators">PDDL Generators</a>
            </nav>
        </header>
        
    );
}

export default Navbar;