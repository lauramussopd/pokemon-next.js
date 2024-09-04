// src/nav-links.tsx

import Link from 'next/link';

const NavLinks = ({ pokemons }: { pokemons: { name: string; }[] }) => {
  return (
    <ul className="list-disc space-y-4">
      {pokemons.map((pokemon, index) => (
        <li key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-md text-lg">
          <Link href={`/details/${pokemon.name}`} className="text-green-600 text-lg font-medium">
            {pokemon.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
