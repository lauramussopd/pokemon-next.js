"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavLinks from "../components/nav-links";
import { fetchInitialPokemon, fetchMorePokemons } from "../data/data";
import { PokemonDetails } from "../data/definitions";
import LoadingSpinner from "../components/loadingSpinner";

const PIKACHU_IMAGE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";



const Home = () => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showScrollButton, setShowScrollButton] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);
      try {
        const { pokemonData, nextUrl } = await fetchInitialPokemon();
        if (pokemonData.length === 0) {
          setError("No Pokémon found");
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
        const { pokemonData, nextUrl: newNextUrl } = await fetchMorePokemons(
          nextUrl
        );
        setPokemons((prevPokemons) => [...prevPokemons, ...pokemonData]);
        setNextUrl(newNextUrl);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };


  const scrollToPokemonList = () => {
    document
      .getElementById("pokemon-list")
      ?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Check size on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading && pokemons.length === 0) return <LoadingSpinner />;
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
        />
        <Image
          src={PIKACHU_IMAGE_URL}
          alt="Pikachu"
          width={500}
          height={500}
          className="object-contain z-10 shadow-glow rounded-lg"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 p-4 flex flex-col h-full relative z-20">
        <p className="text-xl font-bold mb-4 text-green-900 text-center cursor-pointer relative z-10">
          Choose your Pokémon
        </p>
        {showScrollButton && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-900 text-white px-4 py-2 rounded-full shadow-md z-20">
            <button onClick={scrollToPokemonList}>
              Scroll to Pokémon List
            </button>
          </div>
        )}
        <div
          id="pokemon-list"
          className="flex-1 overflow-y-auto p-10 bg-green-900 rounded-lg"
        >
          <NavLinks
            pokemons={pokemons.map((pokemon) => ({
              name: pokemon.name,
              imageUrl: pokemon.sprites.other["official-artwork"].front_default,
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
    </main>
  );
};

export default Home;
