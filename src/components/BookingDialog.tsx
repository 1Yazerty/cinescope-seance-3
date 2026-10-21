import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Film } from "../films";
import { readReservation, type Errors, type Reservation } from "../reservation";

type BookingDialogProps = {
  film: Film;
  onConfirm: (film: Film, reservation: Reservation) => void;
  onClose: () => void;
};

export default function BookingDialog({ film, onConfirm, onClose }: BookingDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const confirmedRef = useRef(false);
  const prefix = useId();
  const id = (part: string) => `${prefix}-${part}`;
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    confirmedRef.current = false;
    if (!dialog.open) dialog.showModal();
    titleRef.current?.focus();
  }, [film.id]);


  const closeBooking = () => dialogRef.current?.close();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!film.available || confirmedRef.current) return;
    const result = readReservation(event.currentTarget);
    setErrors(result.errors);
    if (Object.keys(result.errors).length > 0) return;
    confirmedRef.current = true;
    onConfirm(film, result.values);
    closeBooking();
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={id("title")} onClose={onClose}>
      <div className="dialog-heading">
        <h2 id={id("title")} ref={titleRef} tabIndex={-1}>Réserver {film.title}</h2>
        <button type="button" className="close" aria-label="Fermer la réservation" onClick={closeBooking}>×</button>
      </div>
      <p>{film.genre} · Séance de {film.time}</p>
      <p className={"availability " + (film.available ? "available" : "unavailable")}>
        {film.available ? "Places disponibles" : "Séance complète"}
      </p>
      {film.available ? (
        <>
          <p>Une place par réservation. Tous les champs du formulaire sont obligatoires.</p>
          <p className="demo-note">Démonstration : aucun billet réel ni envoi de courriel.</p>
          {Object.keys(errors).length > 0 && <p className="field-error">Certains champs sont incorrects.</p>}
          <form noValidate onSubmit={submit}>
            <div className="form-group">
              <p className="field-label">Type de place</p>
              <p className="field-help" id={id("tariff-help")}>Choisissez un type de place pour ce billet.</p>
              <div className="radio-options">
                <span><input id={id("tariff-standard")} name="tariff" type="radio" value="standard" /> Standard</span>
                <span><input id={id("tariff-student")} name="tariff" type="radio" value="student" /> Étudiant</span>
              </div>
            </div>
            <div className="field">
              <p className="field-label">Nom de réservation</p>
              <p className="field-help" id={id("name-help")}>Indiquez le nom de la personne qui réserve.</p>
              <input id={id("name")} name="name" placeholder="Votre nom" className={errors.name ? "invalid" : undefined} />
            </div>
            <div className="field">
              <p className="field-label">Adresse électronique</p>
              <p className="field-help" id={id("email-help")}>Format attendu : nom@exemple.fr.</p>
              <input id={id("email")} name="email" type="email" placeholder="Votre adresse" className={errors.email ? "invalid" : undefined} />
            </div>
            <div className="dialog-actions">
              <button className="dialog-action" type="submit">Confirmer la réservation</button>
              <button className="dialog-action dialog-secondary" type="button" onClick={closeBooking}>Revenir aux films</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <p>Cette séance est complète : aucune réservation ne peut être confirmée.</p>
          <button className="dialog-action" type="button" onClick={closeBooking}>Revenir aux films</button>
        </>
      )}
    </dialog>
  );
}
