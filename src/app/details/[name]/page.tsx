"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

  if (loading) return <p className="text-center mt-10 text-xl">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-xl text-red-500">Error: {error}</p>;
  if (!pokemon) return <p className="text-center mt-10 text-xl">No data found</p>;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24 bg-gray-100">
      <header className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold capitalize mb-6 text-gray-800">{pokemon.name}</h1>
        <div className="flex flex-col md:flex-row md:space-x-8 mb-6">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          />
          <img
            src={pokemon.sprites.other["official-artwork"].front_shiny}
            alt={`${pokemon.name} shiny`}
            className="w-48 h-48 md:w-64 md:h-64 object-contain mt-4 md:mt-0"
          />
        </div>
        <div className="text-center space-y-4 mb-6">
          <p className="text-lg"><strong>ID:</strong> {pokemon.id}</p>
          <p className="text-lg"><strong>Height:</strong> {pokemon.height / 10} m</p>
          <p className="text-lg"><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
        </div>
        <div className="text-center space-y-2 mb-6">
          <p className="text-lg font-semibold">Abilities:</p>
          <ul className="list-disc list-inside">
            {pokemon.abilities.map((ability, index) => (
              <li key={index} className="text-lg capitalize">{ability.ability.name}</li>
            ))}
          </ul>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Stats:</p>
          <ul className="list-none space-y-1">
            {pokemon.stats.map((stat, index) => (
              <li key={index} className="text-lg capitalize">
                {stat.stat.name}: <span className="font-medium">{stat.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </main>
  );
};

export default PokemonDetailsPage;
