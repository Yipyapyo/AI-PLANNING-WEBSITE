import { render, screen } from "@testing-library/react";
import App from "./App"; 

describe("App", () => {
  it("renders Navbar correctly", async () => {
    render(<App />);
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();
  });
  it("renders Components correctly", async () => {
    render(<App />);
    const components = screen.getByTestId("components");
    expect(components).toBeInTheDocument();
  });
});