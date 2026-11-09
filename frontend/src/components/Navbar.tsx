import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-700">
        <Building2 size={24} /> RealEstate
      </Link>
      
            {/* Center Links */}
      <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
        <Link to="/" className="hover:text-emerald-600">Home</Link>
        <Link to="/properties" className="hover:text-emerald-600">Properties</Link> {/* <-- Changes to /properties */}
        <Link to="/about" className="hover:text-emerald-600">About</Link>
      </div>

      {/* Right Links */}
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 font-bold mr-2">
              Dashboard
            </Link>
            <Link to="/add-property" className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition">
              List Property
            </Link>
            <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600">Sign In</Link>
            <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;