import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(cleanup);

describe("La recherche de film", () => {
  it("affiche le film recherché et permet d’ouvrir son dialogue de réservation", async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByRole("searchbox", {
      name: /rechercher un film/i,
    });

    await user.type(searchInput, "Orbite 9");

    expect(
      screen.getByRole("heading", { name: "Orbite 9", level: 3 })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Après l’aube", level: 3 })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "La mémoire des murs", level: 3 })
    ).not.toBeInTheDocument();

    const bookingButton = screen.getByRole("button", {
      name: "Réserver Orbite 9",
    });
    await user.click(bookingButton);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("open");

    const dialogHeading = screen.getByRole("heading", {
      name: "Réserver Orbite 9",
      level: 2,
    });
    expect(dialogHeading).toBeInTheDocument();
    expect(dialogHeading).toHaveFocus();
  });
});
