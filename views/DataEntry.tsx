
import React, { useState, useEffect } from 'react';
import { AppState, ParcelEntry, Merchant, Area, SiteType } from '../types';
import { detectAreaFromAddress } from '../services/geminiService';
import { Plus, Search, Trash2, Edit3, Printer, BrainCircuit, PenLine, FileDown, FileUp, Sparkles, Filter } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  onPrint: (parcelId: string) => void;
}

export const DataEntry: React.FC<Props> = ({ state, updateState, onPrint }) => {
  const [formData, setFormData] = useState<Partial<ParcelEntry>>({
    date: new Date().toISOString().split('T')[0],
    weight: 1,
    amount: 0,
    isAiDetected: false
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddressBlur = async () => {
    if (!formData.address || formData.areaId) return;
    
    setIsDetecting(true);
    const areaId = await detectAreaFromAddress(formData.address, state.areas);
    if (areaId) {
      setFormData(prev => ({ ...prev, areaId, isAiDetected: true }));
    }
    setIsDetecting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.merchantId || !formData.customerName || !formData.phone || !formData.areaId) {
      alert("Please fill required fields");
      return;
    }

    if (editingId) {
      updateState({ entries: state.entries.map(e => e.id === editingId ? { ...formData, id: e.id } as ParcelEntry : e) });
      setEditingId(null);
    } else {
      const newEntry: ParcelEntry = {
        ...formData,
        id: `P-${Date.now()}`,
        invoiceNumber: `RP${Math.floor(100000 + Math.random() * 900000)}`
      } as ParcelEntry;
      updateState({ entries: [...state.entries, newEntry] });
    }
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: 1,
      amount: 0,
      isAiDetected: false
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this entry?')) {
      updateState({ entries: state.entries.filter(e => e.id !== id) });
    }
  };

  const filteredEntries = state.entries.filter(e => 
    e.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.phone.includes(searchTerm) ||
    e.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            Parcel Intake
            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded uppercase">Live</span>
          </h1>
          <p className="text-gray-500">Record new deliveries and generate invoices</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-semibold hover:bg-gray-50">
             <FileUp size={18} /> Import CSV
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-semibold hover:bg-gray-50">
             <FileDown size={18} /> Sample CSV
           </button>
        </div>
      </header>

      <section className="bg-white p-6 rounded-2xl border shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Merchant *</label>
              <select 
                required 
                value={formData.merchantId || ''} 
                onChange={e => setFormData({...formData, merchantId: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none bg-white"
              >
                <option value="">Select Merchant</option>
                {state.merchants.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Merchant Invoice</label>
              <input type="text" value={formData.merchantInvoice || ''} onChange={e => setFormData({...formData, merchantInvoice: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="Ext. Inv #" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Customer Phone *</label>
              <input type="tel" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="01XXXXXXXXX" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Customer Name *</label>
              <input type="text" required value={formData.customerName || ''} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none" placeholder="John Doe" />
            </div>

            <div className="space-y-1 md:col-span-2 relative">
              <label className="text-sm font-bold text-gray-700">Customer Address *</label>
              <div className="relative">
                <textarea 
                  required
                  rows={1}
                  value={formData.address || ''} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  onBlur={handleAddressBlur}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none resize-none" 
                  placeholder="Street, District..."
                />
                {isDetecting && (
                  <div className="absolute right-3 top-2 flex items-center gap-2 text-xs text-yellow-600 font-bold animate-pulse">
                    <BrainCircuit size={14} className="animate-spin" /> Analyzing Area...
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                Delivery Area * 
                {formData.isAiDetected ? <BrainCircuit size={14} title="AI Detected" className="text-blue-500" /> : formData.areaId ? <PenLine size={14} title="Manual Entry" className="text-orange-500" /> : null}
              </label>
              <select 
                required 
                value={formData.areaId || ''} 
                onChange={e => setFormData({...formData, areaId: e.target.value, isAiDetected: false})}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none bg-white"
              >
                <option value="">Select Area</option>
                {state.areas.map(a => <option key={a.id} value={a.id}>{a.areaName} ({a.district})</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Weight (KG)</label>
              <input type="number" step="0.5" value={formData.weight || 0} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Total Amount (COD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                <input type="number" required value={formData.amount || 0} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full pl-8 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none font-bold" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            {editingId && (
               <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} className="px-6 py-2.5 rounded-xl border font-semibold hover:bg-gray-50">Cancel</button>
            )}
            <button type="submit" className="px-12 py-3 bg-yellow-600 text-white rounded-xl font-bold hover:bg-yellow-700 shadow-xl shadow-yellow-200 transition-all active:scale-95 flex items-center gap-2">
              <Plus size={20} />
              {editingId ? 'Update Parcel' : 'Add Parcel'}
            </button>
          </div>
        </form>
      </section>

      {/* Entry History Table */}
      <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <h2 className="text-lg font-bold">Recent Parcels</h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by customer, phone, or RP#..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="px-6 py-4">RP Code</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Area</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredEntries.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No entries yet.</td></tr>
              ) : (
                filteredEntries.slice().reverse().map(e => {
                  const merchant = state.merchants.find(m => m.id === e.merchantId);
                  const area = state.areas.find(a => a.id === e.areaId);
                  return (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-yellow-700 bg-yellow-50 px-2 py-1 rounded">{e.invoiceNumber}</span>
                        <div className="text-[10px] text-gray-400 mt-1">{e.date}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{merchant?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{e.customerName}</div>
                        <div className="text-xs text-gray-500">{e.phone}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[200px]">{e.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">৳{e.amount}</div>
                        <div className="text-[10px] text-gray-400">{e.weight} KG</div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-1">
                           <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded">{area?.areaName}</span>
                           {e.isAiDetected ? <BrainCircuit size={14} className="text-blue-400" /> : <PenLine size={14} className="text-gray-300" />}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                           <button onClick={() => onPrint(e.id)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Printer size={18} /></button>
                           <button onClick={() => {setEditingId(e.id); setFormData(e); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                           <button onClick={() => handleDelete(e.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
