"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NavLinks = ({
  pokemons,
}: {
  pokemons: { name: string; imageUrl: string }[];
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-8">
      {pokemons.map((pokemon) => (
        <Link
          key={pokemon.name}
          href={`/details/${pokemon.name.toLowerCase()}`}
          className={`flex  justify-center pr-20 card text-color items-center ${
            pathname === `/details/${pokemon.name.toLowerCase()}`
          }`}
        >
          <Image
            src={pokemon.imageUrl}
            alt={pokemon.name}
            width={130}
            height={130}
          />
          <p className="pokemon-name text-center">{pokemon.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
