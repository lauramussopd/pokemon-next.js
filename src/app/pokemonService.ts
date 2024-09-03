// pokemonService.ts

// Interface for defining the Pokémon data structure
export interface Pokemon {
    name: string;
    url: string;
    imageUrl?: string; // Optional property for image URL
}

// Fetch initial list of Pokémon
export const fetchInitialPokemons = async (): Promise<{
    pokemonsWithImages: Pokemon[];
    nextUrl: string | null;
    randomPokemonImage: string | null;
}> => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    if (!response.ok) {
        if (response.status === 404) {
            return { pokemonsWithImages: [], nextUrl: null, randomPokemonImage: null };
        }
        throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (data.results.length === 0) {
        return { pokemonsWithImages: [], nextUrl: null, randomPokemonImage: null };
    }

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

    const randomIndex = Math.floor(Math.random() * data.results.length);
    const randomPokemon = data.results[randomIndex];
    const randomResponse = await fetch(randomPokemon.url);
    const randomDetails = await randomResponse.json();
    const randomPokemonImage = randomDetails.sprites.other['official-artwork'].front_default;

    return { pokemonsWithImages, nextUrl: data.next, randomPokemonImage };
};

// Fetch more Pokémon data
export const fetchMorePokemons = async (url: string): Promise<{ pokemonsWithImages: Pokemon[], nextUrl: string | null }> => {
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 404) {
            return { pokemonsWithImages: [], nextUrl: null };
        }
        throw new Error("Network response was not ok");
    }
    const data = await response.json();

    if (data.results.length === 0) {
        return { pokemonsWithImages: [], nextUrl: null };
    }

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

    return { pokemonsWithImages: additionalPokemons, nextUrl: data.next };
};
