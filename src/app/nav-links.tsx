import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NavLinks = ({ pokemons }: { pokemons: { name: string; imageUrl: string }[] }) => {
  const pathname = usePathname();

  return (
    <ul className="list-disc space-y-4">
      {pokemons.map((pokemon, index) => {
        const isActive = pathname === `/details/${pokemon.name}`;

        return (
          <li
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg shadow-md text-lg ${
              isActive ? 'bg-green-500 text-white' : 'bg-white text-green-600'
            }`}
          >
            <Image
              src={pokemon.imageUrl || ''}
              alt={pokemon.name}
              width={50} // Imposta la larghezza dell'immagine
              height={50} // Imposta l'altezza dell'immagine
              className="w-12 h-12 md:w-16 md:h-16 transform transition-transform hover:scale-125 cursor-pointer"
            />
            <Link href={`/details/${pokemon.name}`} className="text-lg font-medium">
              {pokemon.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
