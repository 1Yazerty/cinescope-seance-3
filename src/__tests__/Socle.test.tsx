import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
afterEach(cleanup);
describe("Socle conservé de la séance 2", () => {
  it("ouvre une modale nommée et focalise son titre", () => {
    render(<App />); fireEvent.click(screen.getByRole("button", {name:"Réserver Après l’aube"}));
    expect(screen.getByRole("heading", {name:"Réserver Après l’aube"})).toHaveFocus();
  });
  it("ferme et revient au film choisi", () => {
    render(<App />); const opener=screen.getByRole("button", {name:"Réserver Orbite 9"}); fireEvent.click(opener);
    fireEvent.click(screen.getByRole("button", {name:"Revenir aux films"})); expect(opener).toHaveFocus();
  });
  it.todo("Après correction : envoyer vide, vérifier aria-invalid et la description du champ email.");
  it.todo("Après correction : vérifier que le résumé d’erreurs reçoit le focus.");
});
