import { useState, useEffect } from 'react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { Search, MapPin, Sparkles, ExternalLink, Loader2 } from 'lucide-react';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [aiResults, setAiResults] = useState([]);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(''); // New state for loading text
  
  // Filter States
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [bhk, setBhk] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const isAiEnabled = import.meta.env.VITE_ENABLE_AI_HUB === 'true';

  useEffect(() => {
    if (isAiMode) return; 

    const fetchProperties = async () => {
      let url = `/properties?city=${city}`;
      if (type) url += `&type=${type}`;
      if (bhk) url += `&bhk=${bhk}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      
      const { data } = await api.get(url);
      setProperties(data);
    };

    fetchProperties();
  }, [city, type, bhk, maxPrice, isAiMode]);

  const handleAiSearch = async () => {
    if (!city) return alert("Please type a search query first.");
    
    let firecrawlKey = localStorage.getItem('firecrawlKey');
    if (!firecrawlKey) {
      firecrawlKey = window.prompt("Enter your Firecrawl API Key:");
      if (!firecrawlKey) return;
      localStorage.setItem('firecrawlKey', firecrawlKey);
    }

    setIsLoading(true);
    setLoadingText("Waking up server (this takes ~40s)...");

    // Cycle through loading messages to keep the user patient
    const timer1 = setTimeout(() => setLoadingText("Scraping live websites..."), 40000);
    const timer2 = setTimeout(() => setLoadingText("Filtering and ranking results..."), 60000);

    try {
      const { data } = await api.post('/properties/ai-search', { query: city, firecrawlKey });
      setAiResults(data.data);
    } catch (err: any) {
      alert("AI Search Failed: " + (err.response?.data?.message || err.message));
      if (err.response?.status === 400 || err.response?.status === 401) {
         localStorage.removeItem('firecrawlKey');
      }
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Bar */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-2 mb-4 max-w-5xl mx-auto mt-4">
        <div className="flex items-center flex-1 w-full px-4">
          <MapPin className="text-gray-400 mr-2" size={20} />
          <input 
            type="text" 
            placeholder={isAiMode ? "Describe what you want..." : "City..."} 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="w-full py-2 focus:outline-none text-gray-700" 
          />
        </div>
        
        {!isAiMode && (
          <>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none">
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="plot">Plot</option>
            </select>
            <select value={bhk} onChange={(e) => setBhk(e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none">
              <option value="">Any Bedrooms</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
            </select>
          </>
        )}

        <button 
          onClick={isAiMode ? handleAiSearch : () => {}}
          disabled={isLoading}
          className="w-full md:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 font-medium disabled:bg-emerald-400"
        >
          {isLoading ? (
            <><Loader2 className="animate-spin" size={18} /> Searching...</>
          ) : (
            <><Search size={18} /> Search</>
          )}
        </button>
      </div>

      {/* AI Toggle */}
      {isAiEnabled && (
        <div className="max-w-5xl mx-auto flex justify-center mb-8">
          <button 
            onClick={() => { setIsAiMode(!isAiMode); setAiResults([]); }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition shadow-sm border ${
              isAiMode ? 'bg-purple-600 text-white border-purple-700' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Sparkles size={16} />
            {isAiMode ? 'Switch to Local Database' : 'Enable AI Web Search'}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && isAiMode && (
        <div className="text-center py-20">
          <Loader2 className="animate-spin mx-auto text-purple-600 mb-4" size={48} />
          <p className="text-lg font-bold text-gray-700">{loadingText}</p>
          <p className="text-sm text-gray-500 mt-2">Free hosting takes a minute to wake up and scrape the web.</p>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isAiMode ? `AI Scraped Results (${aiResults.length})` : `All Properties (${properties.length})`}
      </h2>

      {/* Results */}
      {!isLoading && (
        isAiMode ? (
          aiResults.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No AI results yet. Type a query and click Search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {aiResults.map((item: any) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-purple-200 shadow-sm hover:shadow-md transition relative">
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
                    {item.matchScore}% Match
                  </div>
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-md truncate">{item.title}</h3>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">{item.description}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full bg-purple-50 text-purple-700 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition">
                      View Source <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          properties.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No properties found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {properties.map((prop: any) => <PropertyCard key={prop._id} prop={prop} property={prop} />)}
            </div>
          )
        )
      )}
    </div>
  );
};

export default Properties;