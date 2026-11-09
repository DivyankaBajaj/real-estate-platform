import { useState, useEffect } from 'react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { Search, MapPin } from 'lucide-react';

const Home = () => {
  const [properties, setProperties] = useState([]);
  
  // Filter States
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [bhk, setBhk] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // This useEffect runs EVERY TIME you change a filter!
  useEffect(() => {
    const fetchProperties = async () => {
      let url = `/properties?city=${city}`;
      if (type) url += `&type=${type}`;
      if (bhk) url += `&bhk=${bhk}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      
      const { data } = await api.get(url);
      setProperties(data);
    };

    fetchProperties();
  }, [city, type, bhk, maxPrice]); // <-- It watches these 4 variables

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Bar */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-2 mb-8 max-w-5xl mx-auto mt-4">
        <div className="flex items-center flex-1 w-full px-4">
          <MapPin className="text-gray-400 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="City..." 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="w-full py-2 focus:outline-none text-gray-700" 
          />
        </div>
        
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none cursor-pointer">
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
        </select>

        <select value={bhk} onChange={(e) => setBhk(e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none cursor-pointer">
          <option value="">Any Bedrooms</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>

        <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none cursor-pointer">
          <option value="">Any Price</option>
          <option value="5000000">Below ₹50L</option>
          <option value="10000000">Below ₹1Cr</option>
          <option value="20000000">Below ₹2Cr</option>
        </select>

        {/* We can keep the button for show, but the filtering happens automatically now */}
        <button className="w-full md:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 font-medium">
          <Search size={18} /> Search
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {properties.length} {properties.length === 1 ? 'Property' : 'Properties'} Found
      </h2>

      {properties.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No properties found matching your filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((prop: any) => <PropertyCard key={prop._id} property={prop} />)}
        </div>
      )}
    </div>
  );
};

export default Home;