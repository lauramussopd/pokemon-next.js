"use client";

import Link from 'next/link'; // Import Link from next/link
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Interface for defining the Pokémon data structure
interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string; // Optional property for image URL
}

const Home = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [randomPokemonImage, setRandomPokemonImage] = useState<string | null>(null); 
  const router = useRouter();

  useEffect(() => {
    const fetchInitialPokemons = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

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

        setPokemons(pokemonsWithImages); 
        setNextUrl(data.next); 

        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomPokemon = data.results[randomIndex];
        const randomResponse = await fetch(randomPokemon.url);
        const randomDetails = await randomResponse.json();
        setRandomPokemonImage(randomDetails.sprites.other['official-artwork'].front_default);
      } catch (error) {
        setError((error as Error).message); 
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPokemons(); 
  }, []);

  const loadMore = async () => {
    if (nextUrl) {
      setLoading(true);
      try {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

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

        setPokemons(prevPokemons => [...prevPokemons, ...additionalPokemons]);
        setNextUrl(data.next); 
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    if (searchTerm.trim()) {
      router.push(`/details/${searchTerm.toLowerCase()}`); 
    }
  };

  const scrollToPokemonList = () => {
    document.getElementById('pokemon-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading && pokemons.length === 0) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex min-h-screen h-screen overflow-hidden flex-col md:flex-row items-center p-4 md:p-8 lg:p-16 bg-gray-100">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 relative">
        <div
          className="absolute inset-0 rounded-lg transform rotate-45 -translate-x-1/2 -translate-y-1/2 z-0"
          style={{
            width: '150%',
            height: '150%',
            background: 'linear-gradient(135deg, #c5f9d7, #f7d486, #f27a7d)',
          }}
        ></div>
        <p className="text-4xl font-bold mb-4 text-green-900 z-10">Pokémon List</p>
        {randomPokemonImage ? (
          <Image
            src={randomPokemonImage}
            alt="Random Pokémon"
            width={320} 
            height={320}
            className="object-contain z-10"
          />
        ) : (
          <p>Loading Pokémon image...</p>
        )}
      </div>

      {/* Right column for Pokémon list */}
      <div className="w-full md:w-1/2 p-4 flex flex-col h-full relative z-20">
        <p 
          className="text-xl font-bold mb-4 text-green-900 text-center cursor-pointer relative z-10" 
          onClick={scrollToPokemonList}
        >
          Choose your Pokémon
        </p>
        {/* Pokémon list */}
        <div id="pokemon-list" className="flex-1 overflow-y-auto p-10 bg-green-900 rounded-lg">
          <ul className="list-disc space-y-4">
            {pokemons.map((pokemon, index) => (
              <li key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-md text-lg ">
                <Image
                  src={pokemon.imageUrl || ""}
                  alt={pokemon.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 transform transition-transform hover:scale-125 cursor-pointer"
                />
                <Link href={`/details/${pokemon.name}`} className="text-green-600 text-lg font-medium">
                  {pokemon.name}
                </Link>
              </li>
            ))}
          </ul>
          {nextUrl && (
            <button
              onClick={loadMore}
              className="mt-4 text-white px-4 py-2 rounded-md shadow-md bg-[rgb(242,122,125)] hover:bg-[rgb(220,100,102)] z-10"
            >
              Load More
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 flex w-full justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black">
        <a
          className="flex items-center gap-2 p-4"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/*<h3 className="text-lg text-gray-600">By Laura Musso</h3>*/}
        </a>
      </footer>
    </main>
  );
};

export default Home;
