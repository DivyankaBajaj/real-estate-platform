import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { UploadCloud } from 'lucide-react';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', price: '', type: 'apartment', bhk: '2', area: '', city: '', state: '', address: '' });
  const [images, setImages] = useState<FileList | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!images || images.length === 0) return alert('Select at least 1 image');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    for (let i = 0; i < images.length; i++) data.append('images', images[i]);

    try {
      await api.post('/properties', data);
      alert('Property Added!');
      navigate('/dashboard');
    } catch (err: any) {
      const exactError = err.response?.data?.message || err.message;
      alert('Failed to add property. Error: ' + exactError);
      console.log("Full Error Details:", err.response?.data);
    }
  }; // <--- THIS WAS MISSING IN YOUR FILE!

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">List Your Property</h1>
        <p className="text-gray-500 text-sm">Fill in the details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input name="title" onChange={handleChange} placeholder="e.g. Spacious 3BHK" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
              <select name="type" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 bg-white">
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input name="city" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input name="state" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input name="address" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5" required />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Price & Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input name="price" onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg p-2.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (Sqft) *</label>
              <input name="area" onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg p-2.5" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms (BHK) *</label>
              <input name="bhk" onChange={handleChange} type="number" defaultValue={2} className="w-full border border-gray-300 rounded-lg p-2.5" required />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Description & Images</h2>
          <textarea name="description" onChange={handleChange} rows={4} placeholder="Describe the property..." className="w-full border border-gray-300 rounded-lg p-2.5 mb-4" required />
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center relative">
            <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
            <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 font-medium">Click to upload images</p>
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProperty;