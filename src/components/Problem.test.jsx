import { describe, expect } from "vitest";
import Problem from "./Problem";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Problem", () => {
    it("renders Problem title", () => {
      render(<Problem />);
      expect(screen.getByTestId("title")).toHaveTextContent("Problem");
    });
    it("renders a text area", () => {
      render(<Problem />);
      const textArea = screen.getByPlaceholderText("Type in your problem"); 
      expect(textArea).toBeInTheDocument();
    });
    it("renders save button", () => {
      render(<Problem />);
      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toHaveTextContent("Save");
      expect(saveButton).toBeInTheDocument();
    });
    it("save button saves Problem value", () => {
      const handleClick = vi.fn()
      render(<Problem saveProblemValue={handleClick}/>);
      const saveButton = screen.getByTestId("save-button");
      const textArea = screen.getByPlaceholderText("Type in your problem"); 
      fireEvent.click(saveButton)
      const ProblemText = screen.getByTestId("problem-text");
      expect(handleClick).toHaveBeenCalled();
      expect(textArea).not.toBeInTheDocument();
      expect(ProblemText).toBeInTheDocument();
    });
    it("renders edit button", () => {
      const handleClick = vi.fn()
      render(<Problem saveProblemValue={handleClick}/>);
      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton)
      const editButton = screen.getByTestId("edit-button");
      expect(editButton).toHaveTextContent("Edit");
      expect(editButton).toBeInTheDocument();
    });
    it("edit button toggles edit mode", () => {
      const handleSaveClick = vi.fn();
      const handleEditClick = vi.fn();
      render(<Problem saveProblemValue={handleSaveClick} toggleEditMode={handleEditClick("false")}/>);
      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton); 
      const editButton = screen.getByTestId("edit-button");
      fireEvent.click(editButton); 
      const textArea = screen.getByPlaceholderText("Type in your problem"); 
      expect(textArea).toBeInTheDocument();
      expect(handleEditClick).toHaveBeenCalled();
    });
});