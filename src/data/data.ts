import { Pokemon } from './definitions';

export async function fetchInitialPokemon(url: string = 'https://pokeapi.co/api/v2/pokemon?limit=20'): Promise<{ pokemonData: Pokemon[], nextUrl: string | null }> {
  const res = await fetch(url);
  const data = await res.json();

  const pokemonData = await Promise.all(
    data.results.map(async (p: any) => {
      const pokemonRes = await fetch(p.url);
      const pokemonDetails = await pokemonRes.json();
      return {
        name: p.name,
        url: p.url,
        image: pokemonDetails.sprites.front_default,
      };
    })
  );


  return { pokemonData, nextUrl: data.next };
}

export async function fetchMorePokemons(url: string): Promise<{ pokemonData: Pokemon[], nextUrl: string | null }> {
  const res = await fetch(url);
  const data = await res.json();

  const pokemonData = await Promise.all(
    data.results.map(async (p: any) => {
      const pokemonRes = await fetch(p.url);
      const pokemonDetails = await pokemonRes.json();
      return {
        name: p.name,
        url: p.url,
        image: pokemonDetails.sprites.front_default,
      };
    })
  );

  return { pokemonData, nextUrl: data.next };
}
