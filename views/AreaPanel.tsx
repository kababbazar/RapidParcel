
import React, { useState, useRef } from 'react';
import { Area, SiteType, AppState } from '../types';
import { Plus, Trash2, Edit3, Search, MapPin, CheckCircle2, XCircle, FileUp, Download, Info } from 'lucide-react';

interface Props {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

export const AreaPanel: React.FC<Props> = ({ state, updateState }) => {
  const [formData, setFormData] = useState<Partial<Area>>({
    site: SiteType.INSIDE,
    homeDelivery: true
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.district || !formData.areaName) return;

    if (editingId) {
      updateState({ areas: state.areas.map(a => a.id === editingId ? { ...formData, id: a.id } as Area : a) });
      setEditingId(null);
    } else {
      const newArea: Area = { ...formData, id: `A-${Date.now()}` } as Area;
      updateState({ areas: [...state.areas, newArea] });
    }
    setFormData({ site: SiteType.INSIDE, homeDelivery: true });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').slice(1); // Skip header
      const newAreas: Area[] = [];

      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 3) {
          const [site, district, areaName, postCode, homeDelivery] = columns.map(c => c.trim());
          
          // Validate Site Type
          let finalSite = SiteType.OUTSIDE;
          if (site.toLowerCase().includes('inside')) finalSite = SiteType.INSIDE;
          else if (site.toLowerCase().includes('sub')) finalSite = SiteType.SUB;

          newAreas.push({
            id: `A-CSV-${Date.now()}-${index}`,
            site: finalSite,
            district: district || 'Unknown',
            areaName: areaName || 'Unknown',
            postCode: postCode || '',
            homeDelivery: homeDelivery?.toLowerCase() === 'yes' || homeDelivery?.toLowerCase() === 'true'
          });
        }
      });

      if (newAreas.length > 0) {
        updateState({ areas: [...state.areas, ...newAreas] });
        alert(`${newAreas.length} areas imported successfully!`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadSampleCsv = () => {
    const header = "Site, District, Area, PostCode, HomeDelivery (Yes/No)\n";
    const sample = "Inside Dhaka, Dhaka, Uttara Sector 10, 1230, Yes\nOutside Dhaka, Gazipur, Chowrasta, 1700, No";
    const blob = new Blob([header + sample], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'area_sample.csv';
    a.click();
  };

  const filteredAreas = state.areas.filter(a => 
    a.areaName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClasses = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-700 transition-all font-medium placeholder:text-slate-400";

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Area Management</h1>
          <p className="text-slate-500">Define service regions and delivery capability</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleCsvUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
          >
            <FileUp size={18} /> Bulk CSV Upload
          </button>
          <button 
            onClick={downloadSampleCsv}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
          >
            <Download size={18} /> Sample
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
            <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
              <Plus size={20} className="text-yellow-500" />
              {editingId ? 'Edit Area' : 'Add New Area'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Site Category</label>
                <select 
                  value={formData.site} 
                  onChange={e => setFormData({...formData, site: e.target.value as SiteType})}
                  className={inputClasses}
                >
                  {Object.values(SiteType).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">District *</label>
                <input type="text" required value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} className={inputClasses} placeholder="e.g. Dhaka" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Area Name *</label>
                <input type="text" required value={formData.areaName || ''} onChange={e => setFormData({...formData, areaName: e.target.value})} className={inputClasses} placeholder="e.g. Uttara Sector 4" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Post Code</label>
                <input type="text" value={formData.postCode || ''} onChange={e => setFormData({...formData, postCode: e.target.value})} className={inputClasses} placeholder="1230" />
              </div>
              <div className="flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                <input type="checkbox" id="homeDelivery" checked={formData.homeDelivery} onChange={e => setFormData({...formData, homeDelivery: e.target.checked})} className="w-5 h-5 rounded-lg text-yellow-500 focus:ring-yellow-400 border-slate-300" />
                <label htmlFor="homeDelivery" className="text-sm font-bold text-slate-700">Home Delivery Available</label>
              </div>
              <div className="pt-4 flex gap-3">
                {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({});}} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>}
                <button type="submit" className="flex-[2] px-6 py-3 bg-yellow-500 text-white rounded-xl font-black hover:bg-yellow-600 shadow-lg shadow-yellow-100 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> {editingId ? 'Update Area' : 'Save Area'}
                </button>
              </div>
            </form>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
               <Info size={20} className="text-blue-500 shrink-0" />
               <p className="text-xs text-blue-700 leading-relaxed font-medium">
                 Use the bulk upload feature for rapid area setup. Ensure your CSV file matches the sample format provided.
               </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full max-w-xs">
                 <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                  type="text" 
                  placeholder="Filter areas..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                />
              </div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{filteredAreas.length} Areas Configured</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b text-[10px] uppercase font-black text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-6 py-5">Area & District</th>
                    <th className="px-6 py-5">Site Type</th>
                    <th className="px-6 py-5">Home Delivery</th>
                    <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredAreas.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium italic">No matching areas found in database.</td></tr>
                  ) : (
                    filteredAreas.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/80 group transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-slate-900">{a.areaName}</div>
                          <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5"><MapPin size={10} className="text-slate-400" /> {a.district} {a.postCode && `(${a.postCode})`}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border tracking-wide uppercase ${
                            a.site === SiteType.INSIDE ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            a.site === SiteType.SUB ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                            'bg-orange-50 text-orange-700 border-orange-100'
                          }`}>
                            {a.site}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                           {a.homeDelivery ? <div className="flex items-center gap-2 text-green-600 font-bold text-xs"><CheckCircle2 size={18} /> Available</div> : <div className="flex items-center gap-2 text-slate-300 font-bold text-xs"><XCircle size={18} /> No</div>}
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center justify-center gap-3">
                             <button onClick={() => {setEditingId(a.id); setFormData(a); window.scrollTo({top: 0, behavior: 'smooth'})}} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"><Edit3 size={18} /></button>
                             <button onClick={() => updateState({ areas: state.areas.filter(x => x.id !== a.id) })} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"><Trash2 size={18} /></button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
