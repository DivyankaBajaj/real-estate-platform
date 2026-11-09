import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

const PropertyCard = ({ property }: any) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition group">
      <div className="relative h-48 overflow-hidden">
        <img src={property.images[0]?.url || 'https://via.placeholder.com/400'} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-800">
          For Sale
        </div>
      </div>
      <div className="p-4">
        <p className="text-emerald-600 font-bold text-lg mb-1">₹{property.price?.toLocaleString()}</p>
        <h3 className="font-semibold text-gray-800 text-md truncate">{property.title}</h3>
        <p className="text-gray-500 text-sm flex items-center gap-1 mt-1 mb-3">
          <MapPin size={14} /> {property.location?.city}, {property.location?.state}
        </p>
        <div className="flex items-center gap-4 text-gray-500 text-xs border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1"><Bed size={14} /> {property.bhk} Beds</div>
          <div className="flex items-center gap-1"><Bath size={14} /> 2 Baths</div>
          <div className="flex items-center gap-1"><Square size={14} /> {property.area} sqft</div>
        </div>
        <Link to={`/property/${property._id}`} className="block mt-4 text-center w-full bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;