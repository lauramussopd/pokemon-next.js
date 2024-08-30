"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  sprites: {
    other: {
      'official-artwork': {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pokemon) return <p>No data found</p>;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <header className="w-full max-w-5xl mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">{pokemon.name}</h1>
        <div className="mb-4">
          <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} className="w-64 h-64" />
          <img src={pokemon.sprites.other['official-artwork'].front_shiny} alt={`${pokemon.name} shiny`} className="w-64 h-64 mt-4" />
        </div>
        <div className="mb-4">
          <p><strong>ID:</strong> {pokemon.id}</p>
          <p><strong>Height:</strong> {pokemon.height / 10} m</p>
          <p><strong>Weight:</strong> {pokemon.weight / 10} kg</p>
        </div>
        <div className="mb-4">
          <p><strong>Abilities:</strong></p>
          <ul>
            {pokemon.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <p><strong>Stats:</strong></p>
          <ul>
            {pokemon.stats.map((stat, index) => (
              <li key={index}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>
        </div>
      </header>
    </main>
  );
};

export default PokemonDetailsPage;



