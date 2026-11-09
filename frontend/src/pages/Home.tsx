import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { ArrowRight, Building2, ShieldCheck, MapPin } from 'lucide-react';

const Home = () => {
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    // Fetch all properties and just show the first 3 for the home page
    api.get('/properties').then(res => {
      setRecentProperties(res.data.slice(0, 3));
    });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-emerald-50 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Find Your Perfect <span className="text-emerald-600">Dream Home</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover the best properties, apartments, and villas across India. 
          Your next chapter starts right here.
        </p>
        <Link to="/properties" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-lg">
          Browse All Properties <ArrowRight size={20} />
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <Building2 className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Top Listings</h3>
          <p className="text-gray-500">Browse thousands of premium properties verified by our team.</p>
        </div>
        <div>
          <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Secure Booking</h3>
          <p className="text-gray-500">Schedule viewings safely and securely directly through our platform.</p>
        </div>
        <div>
          <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <MapPin className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Prime Locations</h3>
          <p className="text-gray-500">Find homes in the most sought-after neighborhoods in the country.</p>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
            <p className="text-gray-500 mt-1">Handpicked properties just for you.</p>
          </div>
          <Link to="/properties" className="text-emerald-600 font-semibold hover:text-emerald-700 hidden md:flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <p className="text-gray-500">No properties available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProperties.map((prop: any) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;