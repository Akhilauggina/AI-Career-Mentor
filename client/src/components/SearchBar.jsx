const SearchBar = ({
    value,
    onChange
}) => {

    return (

        <input

            type="text"

            placeholder="Search..."

            value={value}

            onChange={onChange}

            className="border rounded-lg p-2 w-full"

        />

    );

};

export default SearchBar;