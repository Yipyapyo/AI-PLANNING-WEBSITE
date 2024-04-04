import { describe, expect } from "vitest";
import Navbar from "./Navbar";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Navbar", () => {
    it('renders title', () => {
      render(<Navbar />);
      expect(screen.getByTestId("title")).toHaveTextContent("Francis Yip");
    });
    it('renders website name', () => {
      render(<Navbar />);
      expect(screen.getByTestId("website-name")).toHaveTextContent("| Explainable AI Planning");
    });
    it("renders editor link", () => {
      render(<Navbar />);
      expect(screen.getByTestId("editor")).toHaveTextContent("editor.planning.domains");
    });
    it("renders pddl-generators link", () => {
      render(<Navbar />);
      expect(screen.getByTestId("pddl-generator")).toHaveTextContent("PDDL Generators");
    });
    it("navigates to editor.planning.domains", () => {
      render(<Navbar />);
      const editorLink = screen.getByTestId("editor");
      const { location } = window;
      delete window.location;
      window.location = { ...location, href: "https://editor.planning.domains/" };
      fireEvent.click(editorLink);
      expect(window.location.href).toBe("https://editor.planning.domains/");
    });
    it("navigates to PDDL Generators page", () => {
      render(<Navbar />);
      const pddlGeneratorLink = screen.getByTestId("pddl-generator");
      const { location } = window;
      delete window.location;
      window.location = { ...location, href: "https://github.com/AI-Planning/pddl-generators" };
      fireEvent.click(pddlGeneratorLink);
      expect(window.location.href).toBe("https://github.com/AI-Planning/pddl-generators");
    });
    
});