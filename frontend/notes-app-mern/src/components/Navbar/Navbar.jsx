import { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = (props) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  return (
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold pl-4">Note Here</h1>
        <div className="flex items-center space-x-4 pr-4">
          <button onClick={props.logout} className="text-white">
            <Link to="/login">LogOut</Link>
          </button>
          <div className="text-white">{props.user}</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
