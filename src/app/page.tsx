"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Pokemon {
  name: string;
  url: string;
}

const Home = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Carica solo i primi 20 Pokémon al caricamento iniziale
    const fetchInitialPokemons = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPokemons(data.results);
        setNextUrl(data.next);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPokemons();
  }, []);

  // Funzione per caricare ulteriori Pokémon
  const loadMore = async () => {
    if (nextUrl) {
      setLoading(true);
      try {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPokemons(prevPokemons => [...prevPokemons, ...data.results]);
        setNextUrl(data.next);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Funzione per gestire la ricerca dei Pokémon
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/details/${searchTerm.toLowerCase()}`);
    }
  };

  if (loading && pokemons.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <header className="w-full max-w-5xl mb-8 flex flex-col items-center">
        <p className="text-xl font-semibold mb-4">Pokémon List</p>
        <form onSubmit={handleSearch} className="mb-4 w-full max-w-md flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Pokémon"
            className="border p-2 flex-grow"
          />
          <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2">
            Search
          </button>
        </form>
        <div className="w-full max-w-5xl">
          <ul className="list-disc pl-4">
            {pokemons.map((pokemon, index) => (
              <li key={index} className="mb-2">
                <a
                  href={`/details/${pokemon.name}`}
                  className="text-blue-600 hover:underline"
                >
                  {pokemon.name}
                </a>
              </li>
            ))}
          </ul>
          {nextUrl && (
            <button
              onClick={loadMore}
              className="mt-4 bg-green-500 text-white px-4 py-2"
            >
              Load More
            </button>
          )}
        </div>
      </header>

      <footer className="fixed bottom-0 left-0 flex w-full justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black">
        <a
          className="flex items-center gap-2 p-8"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 className="text-lg">By Laura Musso</h3>
        </a>
      </footer>
    </main>
  );
};

export default Home;
