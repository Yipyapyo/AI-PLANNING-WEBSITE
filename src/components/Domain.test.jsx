import { describe, expect } from "vitest";
import Domain from "./Domain";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Domain", () => {
    it("renders domain title", () => {
      render(<Domain />);
      expect(screen.getByTestId("title")).toHaveTextContent("Domain");
    });
    it("renders a text area", () => {
      render(<Domain />);
      const textArea = screen.getByPlaceholderText("Type in your domain"); 
      expect(textArea).toBeInTheDocument();
    });
    it("renders save button", () => {
      render(<Domain />);
      const saveButton = screen.getByTestId("save-button");
      expect(saveButton).toHaveTextContent("Save");
      expect(saveButton).toBeInTheDocument();
    });
    it("save button saves domain value", () => {
      const handleClick = vi.fn()
      render(<Domain saveDomainValue={handleClick}/>);
      const saveButton = screen.getByTestId("save-button");
      const textArea = screen.getByPlaceholderText("Type in your domain"); 
      fireEvent.click(saveButton)
      const domainText = screen.getByTestId("domain-text");
      expect(handleClick).toHaveBeenCalled();
      expect(textArea).not.toBeInTheDocument();
      expect(domainText).toBeInTheDocument();
    });
    it("renders edit button", () => {
      const handleClick = vi.fn()
      render(<Domain saveDomainValue={handleClick}/>);
      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton)
      const editButton = screen.getByTestId("edit-button");
      expect(editButton).toHaveTextContent("Edit");
      expect(editButton).toBeInTheDocument();
    });
    it("edit button toggles edit mode", () => {
      const handleSaveClick = vi.fn();
      const handleEditClick = vi.fn();
      render(<Domain saveDomainValue={handleSaveClick} toggleEditMode={handleEditClick("false")}/>);
      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton); 
      const editButton = screen.getByTestId("edit-button");
      fireEvent.click(editButton); 
      const textArea = screen.getByPlaceholderText("Type in your domain"); 
      expect(textArea).toBeInTheDocument();
      expect(handleEditClick).toHaveBeenCalled();
    });
});