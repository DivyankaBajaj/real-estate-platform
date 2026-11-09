import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Home, Calendar, PlusCircle, Clock, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const fetchData = async () => {
    const propsRes = await api.get('/properties/mine');
    setProperties(propsRes.data);
    const aptsRes = await api.get('/appointments/mine');
    setAppointments(aptsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchData(); // Refresh the list
    } catch (err: any) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500">Your appointments and property listings in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-500"><Calendar size={20} /></div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
            <p className="text-xs text-gray-500 font-medium">My Appointments</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-500"><Home size={20} /></div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{properties.length}</p>
            <p className="text-xs text-gray-500 font-medium">My Listings</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Link to="/add-property" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
          <PlusCircle size={16} /> List a Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Listings */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">My Properties</h2>
          {properties.length === 0 ? (
             <p className="text-gray-500 text-sm">You haven't listed any properties yet.</p>
          ) : (
            <div className="space-y-3">
              {properties.map((prop: any) => (
                <div key={prop._id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{prop.title}</h3>
                    <p className="text-xs text-emerald-600 font-medium">₹{prop.price?.toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleDelete(prop._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Appointments */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointments yet.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt: any) => (
                <div key={apt._id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{apt.property?.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock size={12} /> {new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full uppercase tracking-wide">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;