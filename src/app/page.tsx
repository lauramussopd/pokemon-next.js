"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Interfaccia per definire la struttura dei dati del Pokémon
interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string; // Proprietà opzionale per l'URL dell'immagine
}

const Home = () => {
  // Stati per memorizzare i Pokémon, lo stato di caricamento, gli errori e il termine di ricerca
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  // Effetto per caricare i Pokémon iniziali al montaggio del componente
  useEffect(() => {
    const fetchInitialPokemons = async () => {
      setLoading(true);
      try {
        // Fetch dei primi 20 Pokémon dalla API
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Fetch dei dettagli per ogni Pokémon per ottenere l'immagine
        const pokemonsWithImages = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            const res = await fetch(pokemon.url); // Fetch dei dettagli del Pokémon
            const details = await res.json();
            return {
              name: pokemon.name,
              url: pokemon.url,
              imageUrl: details.sprites.front_default, // URL dell'immagine del Pokémon
            };
          })
        );

        setPokemons(pokemonsWithImages); // Aggiorna lo stato con i Pokémon e le loro immagini
        setNextUrl(data.next); // Aggiorna l'URL per caricare ulteriori Pokémon
      } catch (error) {
        setError((error as Error).message); // Gestisce gli errori di rete
      } finally {
        setLoading(false); // Imposta lo stato di caricamento a false
      }
    };

    fetchInitialPokemons(); // Chiama la funzione per ottenere i Pokémon
  }, []); // Dipendenze vuote, quindi esegue solo al montaggio

  // Funzione per caricare ulteriori Pokémon
  const loadMore = async () => {
    if (nextUrl) {
      setLoading(true);
      try {
        // Fetch dei Pokémon successivi usando l'URL di nextUrl
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Fetch dei dettagli per i Pokémon aggiuntivi per ottenere le immagini
        const additionalPokemons = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              name: pokemon.name,
              url: pokemon.url,
              imageUrl: details.sprites.front_default,
            };
          })
        );

        // Aggiunge i nuovi Pokémon allo stato esistente
        setPokemons(prevPokemons => [...prevPokemons, ...additionalPokemons]);
        setNextUrl(data.next); // Aggiorna l'URL per caricare ulteriori Pokémon
      } catch (error) {
        setError((error as Error).message); // Gestisce gli errori di rete
      } finally {
        setLoading(false); // Imposta lo stato di caricamento a false
      }
    }
  };

  // Funzione per gestire la ricerca dei Pokémon
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previene l'invio del modulo
    if (searchTerm.trim()) {
      router.push(`/details/${searchTerm.toLowerCase()}`); // Reindirizza alla pagina dei dettagli del Pokémon
    }
  };

  // Condizioni di caricamento ed errore
  if (loading && pokemons.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-16 bg-gray-100">
      {/* Header con titolo e modulo di ricerca */}
      <header className="w-full max-w-4xl mb-8 flex flex-col items-center">
        <p className="text-2xl font-bold mb-4 text-gray-800">Pokémon List</p>
        <form onSubmit={handleSearch} className="mb-4 w-full max-w-md flex flex-col sm:flex-row items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Pokémon"
            className="border border-gray-300 p-2 flex-grow mb-2 sm:mb-0 sm:mr-2 rounded-md shadow-md"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">
            Search
          </button>
        </form>

        {/* Lista dei Pokémon */}
        <div className="w-full max-w-4xl">
          <ul className="list-disc space-y-4">
            {pokemons.map((pokemon, index) => (
              <li key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-gray-300"
                />
                <a
                  href={`/details/${pokemon.name}`}
                  className="text-blue-700 hover:underline text-lg font-medium"
                >
                  {pokemon.name}
                </a>
              </li>
            ))}
          </ul>
          {nextUrl && (
            <button
              onClick={loadMore}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700"
            >
              Load More
            </button>
          )}
        </div>
      </header>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 flex w-full justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black">
        <a
          className="flex items-center gap-2 p-4"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="text-lg text-gray-600">By Laura Musso</h3>
        </a>
      </footer>
    </main>
  );
};

export default Home;
