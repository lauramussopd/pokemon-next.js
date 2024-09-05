import { Pokemon, PokemonDetails } from './definitions';

export const fetchInitialPokemon = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
  const data = await response.json();

  const pokemonData = await Promise.all(
    data.results.map(async (pokemon: Pokemon) => {
      const detailsResponse = await fetch(pokemon.url);
      const details: PokemonDetails = await detailsResponse.json();
      return details;  // Restituisci dettagli completi
    })
  );

  return { pokemonData, nextUrl: data.next };
};

export const fetchMorePokemons = async (nextUrl: string) => {
  const response = await fetch(nextUrl);
  const data = await response.json();

  const pokemonData = await Promise.all(
    data.results.map(async (pokemon: Pokemon) => {
      const detailsResponse = await fetch(pokemon.url);
      const details: PokemonDetails = await detailsResponse.json();
      return details;  // Restituisci dettagli completi
    })
  );

  return { pokemonData, nextUrl: data.next };
};
