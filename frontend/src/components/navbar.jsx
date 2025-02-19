import { Link } from 'react-router';
import toast from 'react-hot-toast';

import { useAuthStore } from '../store/auth-store';

const Navbar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
  };

  return (
    <nav className="bg-[#252422] flex justify-between items-center text-[#fffcf2] px-4 md:px-12 py-4 md:py-6">
      <Link to="/">
        <label className="font-semibold tracking-wider md:text-lg lg:text-xl cursor-pointer">
          BookNest
        </label>
      </Link>

      {user ? (
        <ul className="flex item-center space-x-5 md:text-lg">
          <li>
            <Link to="/add-book" className="bg-[#403d39] px-3 py-2">
              Add Book
            </Link>
          </li>

          <button onClick={handleLogout}>Logout ({user.username})</button>
        </ul>
      ) : (
        <ul className="flex item-center space-x-5 md:text-lg">
          <li>
            <Link to="/login">Add Book</Link>
          </li>
          <li>
            <Link to="/login">Log in</Link>
          </li>
          <li>
            <Link to="/signup" className="bg-[#403d39] px-3 py-2">
              Sign up
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
