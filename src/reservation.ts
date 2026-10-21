export type Reservation = { tariff: "standard" | "student"; name: string; email: string };
export type Errors = Partial<Record<"tariff" | "name" | "email", string>>;

/** Le format email utilise la validité native du champ, pas une regex improvisée. */
export function readReservation(form: HTMLFormElement): { values: Reservation; errors: Errors } {
  const data = new FormData(form);
  const tariff = String(data.get("tariff") ?? "");
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const emailInput = form.elements.namedItem("email") as HTMLInputElement;
  const errors: Errors = {};
  if (tariff !== "standard" && tariff !== "student") errors.tariff = "Choisissez un type de place : standard ou étudiant.";
  if (!name) errors.name = "Indiquez le nom de la personne qui réserve.";
  if (!email || emailInput.validity.typeMismatch) errors.email = "Saisissez une adresse électronique au format nom@exemple.fr.";
  return { values: { tariff: tariff as Reservation["tariff"], name, email }, errors };
}
