import { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Clock } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  // 1. Get the EXACT local date for the calendar restriction
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const localToday = `${year}-${month}-${day}`; // e.g. "2026-11-10"

  useEffect(() => {
    api.get(`/properties/${id}`).then(res => setProperty(res.data));
  }, [id]);

  const handleBook = async (e: FormEvent) => {
    e.preventDefault();

    // 2. Manual check: Stop the user if they typed a past date
    if (date < localToday) {
      return alert('You cannot book a viewing for a past date.');
    }

    try {
      await api.post('/appointments', { propertyId: id, date, time, message });
      alert('Viewing booked successfully! Check your dashboard.');
    } catch (err: any) {
      alert('Booking failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!property) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: Images & Details */}
      <div className="md:col-span-2">
        <img src={property.images[0]?.url} alt="Main" className="w-full h-96 object-cover rounded-xl shadow-sm" />
        <h1 className="text-3xl font-bold mt-6 text-gray-800">{property.title}</h1>
        <p className="text-2xl text-emerald-600 font-bold mt-2">₹{property.price?.toLocaleString()}</p>
        <p className="mt-2 text-gray-600 flex items-center gap-2">
          <MapPin size={18} /> {property.location?.address}, {property.location?.city}, {property.location?.state}
        </p>
        
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">{property.description}</p>
        </div>
      </div>

      {/* Right Column: Booking Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Book a Viewing</h3>
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="date" 
                min={localToday} // Sets the calendar limit
                onChange={e => setDate(e.target.value)} 
                className="w-full pl-10 border border-gray-300 rounded-lg p-2.5" 
                required 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="time" 
                onChange={e => setTime(e.target.value)} 
                className="w-full pl-10 border border-gray-300 rounded-lg p-2.5" 
                required 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
            <textarea 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Any questions?" 
              className="w-full border border-gray-300 rounded-lg p-2.5" 
              rows={3} 
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyDetail;