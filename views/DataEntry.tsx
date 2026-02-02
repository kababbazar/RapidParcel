
import React, { useState, useEffect } from 'react';
import { AppState, ParcelEntry, Merchant, Area, SiteType } from '../types';
import { detectAreaFromAddress } from '../services/geminiService';
// Fix: Added MapPin to the lucide-react imports
import { Plus, Search, Trash2, Edit3, Printer, BrainCircuit, PenLine, FileDown, FileUp, Sparkles, Filter, Phone, User, Calendar, DollarSign, Weight, MapPin } from 'lucide-react';

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

  const inputClasses = "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-700 transition-all font-medium placeholder:text-slate-400";
  const labelClasses = "text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-2";

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            Parcel Intake
            <span className="text-[10px] font-black px-2 py-0.5 bg-green-500 text-white rounded-full uppercase tracking-tighter">Live System</span>
          </h1>
          <p className="text-slate-500 font-medium">Record new deliveries and generate professional invoices</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
             <FileUp size={18} className="text-indigo-500" /> Import CSV
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
             <FileDown size={18} className="text-emerald-500" /> Template
           </button>
        </div>
      </header>

      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1.5">
              <label className={labelClasses}><Calendar size={14} /> Posting Date</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputClasses} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClasses}><User size={14} /> Merchant Partner *</label>
              <div className="relative">
                <Sparkles size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  required 
                  value={formData.merchantId || ''} 
                  onChange={e => setFormData({...formData, merchantId: e.target.value})}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                >
                  <option value="">Select Merchant</option>
                  {state.merchants.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClasses}><Edit3 size={14} /> Merchant Inv #</label>
              <div className="relative">
                <PenLine size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={formData.merchantInvoice || ''} onChange={e => setFormData({...formData, merchantInvoice: e.target.value})} className={inputClasses} placeholder="Ref No." />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClasses}><Phone size={14} /> Customer Phone *</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="tel" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClasses} placeholder="01XXXXXXXXX" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClasses}><User size={14} /> Customer Name *</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" required value={formData.customerName || ''} onChange={e => setFormData({...formData, customerName: e.target.value})} className={inputClasses} placeholder="Full Name" />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2 relative">
              <label className={labelClasses}><MapPin size={14} /> Delivery Address *</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                <textarea 
                  required
                  rows={1}
                  value={formData.address || ''} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  onBlur={handleAddressBlur}
                  className={`${inputClasses} py-3 h-[46px] resize-none`} 
                  placeholder="Street, District, Near by location..."
                />
                {isDetecting && (
                  <div className="absolute right-3 top-2 flex items-center gap-2 text-[10px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg border border-yellow-200 font-black animate-pulse uppercase">
                    <BrainCircuit size={12} className="animate-spin" /> AI Processing
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClasses}>
                <MapPin size={14} /> Area & Coverage * 
                {formData.isAiDetected ? <BrainCircuit size={14} className="text-blue-500" /> : formData.areaId ? <PenLine size={14} className="text-orange-400" /> : null}
              </label>
              <div className="relative">
                <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  required 
                  value={formData.areaId || ''} 
                  onChange={e => setFormData({...formData, areaId: e.target.value, isAiDetected: false})}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                >
                  <option value="">Select Area</option>
                  {state.areas.map(a => <option key={a.id} value={a.id}>{a.areaName} ({a.district})</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClasses}><Weight size={14} /> Weight (KG)</label>
              <div className="relative">
                <Weight size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" step="0.5" value={formData.weight || 0} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} className={inputClasses} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClasses}><DollarSign size={14} /> Collectible COD Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 font-black">৳</span>
                <input type="number" required value={formData.amount || 0} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className={`${inputClasses} pl-10 font-black text-slate-900`} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8 border-t border-slate-50">
            {editingId && (
               <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} className="px-8 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            )}
            <button type="submit" className="px-16 py-4 bg-yellow-500 text-white rounded-2xl font-black hover:bg-yellow-600 shadow-2xl shadow-yellow-100 transition-all active:scale-95 flex items-center gap-3">
              <Plus size={24} />
              {editingId ? 'Update Record' : 'Create Parcel Entry'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Operational Log</h2>
          </div>
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search by name, phone, or RP#..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b text-[10px] uppercase text-slate-400 font-black tracking-widest">
              <tr>
                <th className="px-6 py-5">RP Identity</th>
                <th className="px-6 py-5">Merchant Partner</th>
                <th className="px-6 py-5">Customer Profile</th>
                <th className="px-6 py-5">Accounting</th>
                <th className="px-6 py-5">Logistic Path</th>
                <th className="px-6 py-5 text-center">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredEntries.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-300 font-medium italic">Your operational log is currently empty.</td></tr>
              ) : (
                filteredEntries.slice().reverse().map(e => {
                  const merchant = state.merchants.find(m => m.id === e.merchantId);
                  const area = state.areas.find(a => a.id === e.areaId);
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="font-mono font-black text-yellow-700 bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-100 text-xs shadow-sm">#{e.invoiceNumber}</span>
                        <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">{e.date}</div>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-900">{merchant?.name || '---'}</td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-800">{e.customerName}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">{e.phone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px] font-medium mt-1">{e.address}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-black text-slate-900 text-base">৳{e.amount}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{e.weight} KG Mass</div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 uppercase">{area?.areaName}</span>
                           {e.isAiDetected ? <BrainCircuit size={14} className="text-blue-400" /> : <PenLine size={14} className="text-slate-300" />}
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                           <button onClick={() => onPrint(e.id)} className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><Printer size={20} /></button>
                           <button onClick={() => {setEditingId(e.id); setFormData(e); window.scrollTo({top:0, behavior:'smooth'})}} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={20} /></button>
                           <button onClick={() => handleDelete(e.id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
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
