// src/app/definitions.ts

export interface Pokemon {
    name: string;
    url: string;
    image?: string; // Optional property for image URL
  }
  
  export interface PokemonDetails {
    name: string;
    sprites: {
      front_default: string;
      other: {
        'official-artwork': {
          front_default: string;
        };
      };
    };
  }
  