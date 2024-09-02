"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Interface for defining the Pokémon data structure
interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string; // Optional property for image URL
}

const Home = () => {
  // State to store Pokémon data, loading status, errors, and search term
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [randomPokemonImage, setRandomPokemonImage] = useState<string | null>(null); // New state for random Pokémon image
  const router = useRouter();

  // Effect to load initial Pokémon data when the component mounts
  useEffect(() => {
    const fetchInitialPokemons = async () => {
      setLoading(true);
      try {
        // Fetch the first 20 Pokémon from the API
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Fetch details for each Pokémon to get their images
        const pokemonsWithImages = await Promise.all(
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

        setPokemons(pokemonsWithImages); // Update state with Pokémon and their images
        setNextUrl(data.next); // Update the URL to load more Pokémon

        // Fetch a random Pokémon for the left image
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomPokemon = data.results[randomIndex];
        const randomResponse = await fetch(randomPokemon.url);
        const randomDetails = await randomResponse.json();
        setRandomPokemonImage(randomDetails.sprites.other['official-artwork'].front_default);
      } catch (error) {
        setError((error as Error).message); // Handle network errors
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchInitialPokemons(); // Call the function to fetch Pokémon data
  }, []); // Empty dependencies, so it only runs on mount

  // Function to load more Pokémon
  const loadMore = async () => {
    if (nextUrl) {
      setLoading(true);
      try {
        // Fetch the next batch of Pokémon using the nextUrl
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Fetch details for additional Pokémon to get their images
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

        // Append new Pokémon to the existing state
        setPokemons(prevPokemons => [...prevPokemons, ...additionalPokemons]);
        setNextUrl(data.next); // Update the URL to load more Pokémon
      } catch (error) {
        setError((error as Error).message); // Handle network errors
      } finally {
        setLoading(false); // Set loading state to false
      }
    }
  };

  // Function to handle Pokémon search
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
    if (searchTerm.trim()) {
      router.push(`/details/${searchTerm.toLowerCase()}`); // Redirect to Pokémon details page
    }
  };

  // Loading and error conditions
  if (loading && pokemons.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex min-h-screen h-screen overflow-hidden flex-col md:flex-row items-center p-4 md:p-8 lg:p-16 bg-gray-100">
      {/* Left column for random Pokémon image */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4">
        {randomPokemonImage ? (
          <img
            src={randomPokemonImage}
            alt="Random Pokémon"
            className="w-80 h-80 object-contain"
          />
        ) : (
          <p>Loading Pokémon image...</p>
        )}
      </div>

      {/* Right column for Pokémon list */}
      <div className="w-full md:w-1/2 p-4 h-full">
        <header className="w-full max-w-lg mb-8 flex flex-col items-center">
          <p className="text-2xl font-bold mb-4 text-gray-800">Pokémon List</p>
          {/* Pokémon list */}
          <div className="w-full max-h-[70vh] overflow-y-auto">
            <ul className="list-disc space-y-4">
              {pokemons.map((pokemon, index) => (
                <li key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="w-24 h-24 md:w-28 md:h-28 transform transition-transform hover:scale-125"
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
      </div>

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
