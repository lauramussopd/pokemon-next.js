import { Pokemon } from "./definitions";

export async function fetchInitialPokemons(
  url: string = "https://pokeapi.co/api/v2/pokemon?limit=20"
): Promise<{ pokemonsWithImages: Pokemon[]; nextUrl: string | null }> {
  const res = await fetch(url);
  const data = await res.json();

  const pokemonsWithImages = await Promise.all(
    data.results.map(async (p: Pokemon) => {
      const pokemonRes = await fetch(p.url);
      const pokemonDetails = await pokemonRes.json();
      return {
        name: p.name,
        url: p.url,
        imageUrl: pokemonDetails.sprites.front_default,
      };
    })
  );

  return { pokemonsWithImages, nextUrl: data.next };
}

export async function fetchMorePokemons(
  url: string
): Promise<{ pokemonsWithImages: Pokemon[]; nextUrl: string | null }> {
  const res = await fetch(url);
  const data = await res.json();

  const pokemonsWithImages = await Promise.all(
    data.results.map(async (p: Pokemon) => {
      const pokemonRes = await fetch(p.url);
      const pokemonDetails = await pokemonRes.json();
      return {
        name: p.name,
        url: p.url,
        imageUrl: pokemonDetails.sprites.front_default,
      };
    })
  );

  return { pokemonsWithImages, nextUrl: data.next };
}
