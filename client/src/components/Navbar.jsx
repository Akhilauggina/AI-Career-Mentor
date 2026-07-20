const Navbar = () => {

  return (

    <div className="h-16 bg-white shadow flex justify-between items-center px-8">

      <h2 className="text-2xl font-semibold">

        AI Career Mentor

      </h2>

      <div className="flex items-center gap-4">

        <span>

          Welcome Akhila 👋

        </span>

        <img
          src="https://ui-avatars.com/api/?name=Akhila"
          className="w-10 h-10 rounded-full"
        />

      </div>

    </div>

  );

};

export default Navbar;