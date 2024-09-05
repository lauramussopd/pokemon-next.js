"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NavLinks = ({ pokemons }: { pokemons: { name: string; imageUrl: string }[] }) => {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      {pokemons.map((pokemon) => (
        <Link
          key={pokemon.name}
          href={`/details/${pokemon.name.toLowerCase()}`}
          className={`flex items-center gap-4 p-2 rounded-md transition-transform duration-300 ${
            pathname === `/details/${pokemon.name.toLowerCase()}`
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-white text-green-900 hover:bg-gray-100'
          }`}
        >
          <div
            className={`transition-transform duration-300 ${
              pathname === `/details/${pokemon.name.toLowerCase()}`
                ? 'hover:scale-120'
                : 'hover:scale-140'
            }`}
          >
          </div>
          <span className="text-center items-center flex-1">
          <Image
              src={pokemon.imageUrl}
              alt={pokemon.name}
              width={100}
              height={100}
              className="rounded-full"
            />{pokemon.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
