"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavLinks from "../components/nav-links";
import { fetchInitialPokemon, fetchMorePokemons } from "../data/data";
import { Pokemon } from "../data/definitions";
import LoadingSpinner from "../components/loadingSpinner";

const PIKACHU_IMAGE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"; // Pikachu's image URL

const Home = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false); // New state for handling "not found"
  const router = useRouter();

  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);
      try {
        const { pokemonData, nextUrl } = await fetchInitialPokemon();
        if (pokemonData.length === 0) {
          setNotFound(true); // Set notFound to true if no pokemons are found
        } else {
          setPokemons(pokemonData);
          setNextUrl(nextUrl);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, []);

  const loadMore = async () => {
    if (nextUrl) {
      setLoading(true);
      try {
        const { pokemonData, nextUrl: newNextUrl } = await fetchMorePokemons(nextUrl);
        if (pokemonData.length === 0) {
          setNotFound(true); // Set notFound to true if no more pokemons are found
        } else {
          setPokemons((prevPokemons) => [
            ...prevPokemons,
            ...pokemonData,
          ]);
          setNextUrl(newNextUrl);
        }
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
    document
      .getElementById("pokemon-list")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading && pokemons.length === 0) return <LoadingSpinner/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex min-h-screen h-screen overflow-hidden flex-col md:flex-row items-center p-4 md:p-8 lg:p-16 bg-gray-100">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 relative">
        <div
          className="absolute inset-0 rounded-lg transform rotate-45 -translate-x-1/2 -translate-y-1/2 z-0"
          style={{
            width: "150%",
            height: "150%",
            background: "linear-gradient(135deg, #c5f9d7, #f7d486, #f27a7d)",
          }}
        ></div>
        <p className="text-4xl font-bold mb-4 text-green-900 z-10">
          Pokémon List
        </p>
        <Image
          src={PIKACHU_IMAGE_URL}
          alt="Pikachu"
          width={320}
          height={320}
          className="object-contain z-10"
          priority
        />
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
        <div
          id="pokemon-list"
          className="flex-1 overflow-y-auto p-10 bg-green-900 rounded-lg"
        >
          <NavLinks
            pokemons={pokemons.map((pokemon) => ({
              name: pokemon.name,
              imageUrl: pokemon.image || "/path/to/placeholder/image.png", // Provide fallback value
            }))}
          />
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
