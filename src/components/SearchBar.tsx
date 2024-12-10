import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Importa FontAwesomeIcon
import { useState } from "react";

export const SearchBar = ({
  onSearch,
}: {
  onSearch: (search: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = (event.currentTarget[0] as HTMLInputElement).value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-[#b4acab] px-2"
    >
      <FontAwesomeIcon className="text-[#b4acab]" icon={faMagnifyingGlass} />
      <input
        type="text"
        placeholder="Buscar..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};
