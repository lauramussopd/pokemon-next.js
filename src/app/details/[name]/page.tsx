"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { montserrat } from "./../../fonts";

// Interface to define the structure of the Pokémon details
interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  stats: { stat: { name: string }; base_stat: number }[];
}

const PokemonDetailsPage = () => {
  const { name } = useParams();
  const router = useRouter(); // Use the router hook for navigation
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchPokemonDetails();
    }
  }, [name]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-lg text-red-500">Error: {error}</p>;
  if (!pokemon) return <p className="text-center mt-10 text-lg">No data found</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6 lg:p-8 bg-gray-100">
      <header className="w-full max-w-4xl bg-green-900 p-6 rounded-lg shadow-md mb-6">
        <button
          onClick={() => router.push('/')} // Navigate back to home page
          className="mb-6 text-white bg-[rgb(242,122,125)] hover:bg-[rgb(220,100,102)] px-4 py-2 rounded-lg"
        >
          Back to Home
        </button>
        <h1 className="text-3xl font-bold capitalize mb-6 text-white text-center">{pokemon.name}</h1>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${montserrat.className} antialiased`}>
          <div className="bg-white p-5 rounded-lg shadow-md flex flex-col items-center">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  alt={pokemon.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="relative w-48 h-48">
                <Image
                  src={pokemon.sprites.other["official-artwork"].front_shiny}
                  alt={`${pokemon.name} shiny`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Details</h2>
              <p className="text-base text-gray-700 mb-1">ID: {pokemon.id}</p>
              <p className="text-base text-gray-700 mb-1">Height: {pokemon.height / 10} m</p>
              <p className="text-base text-gray-700 mb-1">Weight: {pokemon.weight / 10} kg</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Abilities</h2>
              <ul className="list-disc list-inside text-gray-700 text-base">
                {pokemon.abilities.map((ability, index) => (
                  <li key={index} className="capitalize">{ability.ability.name}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Stats</h2>
              <ul className="list-none space-y-1 text-gray-700 text-base">
                {pokemon.stats.map((stat, index) => (
                  <li key={index} className="capitalize">
                    {stat.stat.name}: <span className="font-medium">{stat.base_stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </main>
  );
};

export default PokemonDetailsPage;
