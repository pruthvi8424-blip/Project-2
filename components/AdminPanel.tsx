
import React, { useState, useEffect } from 'react';
import { registerProduct, getAllProducts } from '../services/blockchainService';
import { Product } from '../types';
import { ICONS } from '../constants';

const AdminPanel: React.FC = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name || !manufacturer) return;

    setLoading(true);
    setMessage(null);
    try {
      const newProduct = await registerProduct(id, name, manufacturer);
      setProducts([newProduct, ...products]);
      setMessage({ type: 'success', text: `Product ${id} registered successfully on blockchain!` });
      setName('');
      setId('');
      setManufacturer('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          {ICONS.Plus} Register New Product
        </h2>
        
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Product ID / Serial</label>
            <input 
              type="text" 
              value={id} 
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. SN-99231-X"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Product Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Leather Bag"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Manufacturer Wallet / Address</label>
            <input 
              type="text" 
              value={manufacturer} 
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>
          
          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner animate-spin"></i> Processing...
                </span>
              ) : 'Submit to Blockchain'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-sm flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? ICONS.Check : ICONS.Alert}
            {message.text}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Registered Products</h2>
        {products.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No products registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">ID</th>
                  <th className="pb-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Name</th>
                  <th className="pb-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Manufacturer</th>
                  <th className="pb-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => (
                  <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-mono text-sm text-blue-600 font-bold">{p.id}</td>
                    <td className="py-4 font-medium text-slate-700">{p.name}</td>
                    <td className="py-4 text-xs text-slate-500 truncate max-w-[150px]">{p.manufacturer}</td>
                    <td className="py-4 text-xs text-slate-400">{new Date(p.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
