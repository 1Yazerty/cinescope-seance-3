import { useEffect, useMemo, useRef, useState } from "react";
import { films, type Film } from "./films";
import BookingDialog from "./components/BookingDialog";
import type { Reservation } from "./reservation";

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const selectedFilm = films.find((film) => film.title === selected);
  const [favorites, setFavorites] = useState<number[]>([]);
  const filteredFilms = useMemo(
    () => films.filter((film) => film.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const toggleFavorite = (id: number) => {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  };
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pendingBooking = useRef<{ film: Film; reservation: Reservation } | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const bookingNumber = useRef(0);
  const announcementTimer = useRef<number | null>(null);
  const cancelAnnouncement = () => {
    if (announcementTimer.current !== null) window.clearTimeout(announcementTimer.current);
    announcementTimer.current = null;
  };
  useEffect(() => () => {
    if (announcementTimer.current !== null) window.clearTimeout(announcementTimer.current);
  }, []);

  const openBooking = (film: string, opener: HTMLButtonElement) => {
    cancelAnnouncement();
    openerRef.current = opener;
    pendingBooking.current = null;
    setConfirmation("");
    setSelected(film);
  };
  const handleConfirm = (film: Film, reservation: Reservation) => {
    if (film.available) pendingBooking.current = { film, reservation };
  };
  const handleClose = () => {
    // Publier après close : la page n’est alors plus inerte.
    const bookedFilm = pendingBooking.current;
    pendingBooking.current = null;
    setSelected(null);
    if (openerRef.current?.isConnected) openerRef.current.focus();
    if (bookedFilm) {
      bookingNumber.current += 1;
      const { film, reservation } = bookedFilm;
      const message = `Réservation de démonstration n° ${bookingNumber.current} confirmée : ${film.title}, séance de ${film.time}. Une place ${reservation.tariff === "student" ? "au tarif étudiant" : "au tarif standard"}, au nom de ${reservation.name}. Aucun billet réel n’a été émis.`;
      // Ajustement de synchronisation testé sur le poste enseignant, à retester ailleurs.
      announcementTimer.current = window.setTimeout(() => {
        announcementTimer.current = null;
        setConfirmation(message);
      }, 150);
    }
  };

  return (
    <>
      <header className="topbar">
        <a className="brand" href="#programme" onClick={() => setQuery("")}>CinéScope</a>
        <nav aria-label="Navigation principale">
          <ul className="menu">
            <li><a href="#programme">Programme</a></li>
            <li><a href="#infos">Informations</a></li>
          </ul>
        </nav>
      </header>
      <main className="page">
        <h1>Films à l’affiche</h1>
        <p className="intro">Découvrez la programmation de cette semaine.</p>
        <div className="search-field">
          <label htmlFor="film-search">Rechercher un film</label>
          <input id="film-search" className="search" type="search" value={query}
            onChange={(event) => setQuery(event.target.value)} />
        </div>
        {/* Région présente et vide avant toute confirmation. Pas de focus forcé. */}
        <p role="status" aria-atomic="true" className={confirmation ? "booking-confirmation" : undefined}>
          {confirmation}
        </p>
        <section id="programme" aria-labelledby="programme-title">
          <h2 id="programme-title">Programme</h2>
          <div className="film-grid">
            {filteredFilms.map((film) => {
              const isFavorite = favorites.includes(film.id);
              return (
                <article className="film-card" key={film.id}>
                  <img src={film.poster} alt="" />
                  <div className="film-content">
                    <p className={"availability " + (film.available ? "available" : "unavailable")}>
                      {film.available ? "Places disponibles" : "Séance complète"}
                    </p>
                    <h3>{film.title}</h3>
                    <p>{film.genre} · {film.time}</p>
                    <div className="actions">
                      <button className="booking-trigger" type="button"
                        onClick={(event) => openBooking(film.title, event.currentTarget)}>Réserver {film.title}</button>
                      <button type="button" className="favorite" aria-pressed={isFavorite}
                        aria-label={"Favori : " + film.title} onClick={() => toggleFavorite(film.id)}>
                        <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {filteredFilms.length === 0 && <p>Aucun film ne correspond à votre recherche.</p>}
        </section>
        <section id="infos" className="infos" aria-labelledby="infos-title">
          <h2 id="infos-title">Informations pratiques</h2>
          <p>Le cinéma ouvre trente minutes avant la première séance.</p>
        </section>
        {selectedFilm && (
          <BookingDialog film={selectedFilm} onConfirm={handleConfirm} onClose={handleClose} />
        )}
      </main>
    </>
  );
}
