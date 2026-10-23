import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
afterEach(cleanup);
describe("Socle conservé de la séance 2", () => {
  it("ouvre une modale nommée et focalise son titre", () => {
    render(<App />); fireEvent.click(screen.getByRole("button", { name: "Réserver Après l’aube" }));
    expect(screen.getByRole("heading", { name: "Réserver Après l’aube" })).toHaveFocus();
  });

  it("ferme et revient au film choisi", () => {
    render(<App />); const opener = screen.getByRole("button", { name: "Réserver Orbite 9" }); fireEvent.click(opener);
    fireEvent.click(screen.getByRole("button", { name: "Revenir aux films" })); expect(opener).toHaveFocus();
  });

  it("Après correction : envoyer vide, vérifier aria-invalid et la description du champ email.", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Réserver Après l’aube" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmer la réservation" }));

    const email = screen.getByRole("textbox", { name: /adresse électronique/i });
    expect(email).toHaveAttribute("aria-invalid", "true");

    const descriptionIds = (email.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .filter(Boolean);
    expect(descriptionIds).toHaveLength(2);

    const help = document.getElementById(descriptionIds[0]);
    const error = document.getElementById(descriptionIds[1]);
    expect(help).toHaveTextContent("Format attendu");
    expect(error).toHaveTextContent("Saisissez une adresse électronique");
  });

  it("Après correction : vérifier que le résumé d’erreurs reçoit le focus.", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Réserver Après l’aube" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirmer la réservation" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveFocus();
    });
  });
});
