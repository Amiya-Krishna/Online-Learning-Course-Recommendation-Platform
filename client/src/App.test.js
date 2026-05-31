import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders the home hero", async () => {
  render(<App />);
  expect(
    await screen.findByText(/explore future-proof skills/i)
  ).toBeInTheDocument();
});
