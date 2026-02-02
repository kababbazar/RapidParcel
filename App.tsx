
import React, { useState, useEffect } from 'react';
import { AppState, View, SiteType, ParcelEntry } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { MerchantEntry } from './views/MerchantEntry';
import { DataEntry } from './views/DataEntry';
import { AreaPanel } from './views/AreaPanel';
import { Accounts } from './views/Accounts';
import { Intro } from './components/Intro';
import { POSInvoice, StandardInvoice } from './components/InvoicePreview';
import { X, Printer } from 'lucide-react';

const INITIAL_STATE: AppState = {
  merchants: [],
  areas: [
    { id: 'a1', areaName: 'Uttara', district: 'Dhaka', site: SiteType.INSIDE, postCode: '1230', homeDelivery: true },
    { id: 'a2', areaName: 'Mirpur', district: 'Dhaka', site: SiteType.INSIDE, postCode: '1216', homeDelivery: true },
    { id: 'a3', areaName: 'Savar', district: 'Dhaka', site: SiteType.SUB, postCode: '1340', homeDelivery: true },
    { id: 'a4', areaName: 'Agrabad', district: 'Chattogram', site: SiteType.OUTSIDE, postCode: '4100', homeDelivery: true },
  ],
  entries: []
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<View>('dashboard');
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('rapid_parcel_v1');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [printModal, setPrintModal] = useState<{ parcelId: string; type: 'POS' | '8x5'; posSize?: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('rapid_parcel_v1', JSON.stringify(state));
  }, [state]);

  const updateState = (update: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...update }));
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard state={state} />;
      case 'merchants': return <MerchantEntry state={state} updateState={updateState} />;
      case 'data-entry': return <DataEntry state={state} updateState={updateState} onPrint={(id) => setPrintModal({ parcelId: id, type: '8x5' })} />;
      case 'areas': return <AreaPanel state={state} updateState={updateState} />;
      case 'accounts': return <Accounts state={state} />;
      default: return <Dashboard state={state} />;
    }
  };

  if (showIntro) {
    return <Intro onComplete={() => setShowIntro(false)} />;
  }

  const printParcel = printModal ? state.entries.find(e => e.id === printModal.parcelId) : null;
  const printMerchant = printParcel ? state.merchants.find(m => m.id === printParcel.merchantId) : null;
  const printArea = printParcel ? state.areas.find(a => a.id === printParcel.areaId) : null;

  return (
    <>
      <div className="no-print">
        <Layout currentView={view} setView={setView}>
          {renderView()}
        </Layout>
      </div>

      {/* Print Overlay */}
      {printModal && printParcel && printMerchant && printArea && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 no-print overflow-y-auto">
          <div className="bg-gray-100 rounded-2xl p-6 max-w-[900px] w-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Printer size={20} /> Preview & Print Invoice
              </h2>
              <button onClick={() => setPrintModal(null)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Controls */}
              <div className="flex flex-col gap-4 w-full md:w-64">
                <div className="p-4 bg-white rounded-xl shadow-sm space-y-4">
                   <p className="text-xs font-bold uppercase text-gray-400">Layout Selection</p>
                   <button 
                     onClick={() => setPrintModal({ ...printModal, type: '8x5' })}
                     className={`w-full py-2 px-4 rounded-lg text-sm font-bold border transition-all ${printModal.type === '8x5' ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-white text-gray-600'}`}
                   >
                     8" × 5" Standard
                   </button>
                   <button 
                     onClick={() => setPrintModal({ ...printModal, type: 'POS', posSize: '80mm' })}
                     className={`w-full py-2 px-4 rounded-lg text-sm font-bold border transition-all ${printModal.type === 'POS' ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-white text-gray-600'}`}
                   >
                     POS Label
                   </button>
                </div>
                
                {printModal.type === 'POS' && (
                  <div className="p-4 bg-white rounded-xl shadow-sm space-y-4">
                    <p className="text-xs font-bold uppercase text-gray-400">Roll Size</p>
                    {['57mm', '80mm', '110mm'].map(sz => (
                      <button 
                        key={sz}
                        onClick={() => setPrintModal({ ...printModal, posSize: sz })}
                        className={`w-full py-2 px-4 rounded-lg text-xs font-bold border ${printModal.posSize === sz ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}
                      >
                        {sz} (Width)
                      </button>
                    ))}
                  </div>
                )}

                <button 
                  onClick={() => window.print()}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Printer size={24} /> PRINT NOW
                </button>
              </div>

              {/* Preview Area */}
              <div className="flex-1 bg-white p-8 rounded-xl shadow-inner overflow-auto max-h-[70vh] flex items-center justify-center border-4 border-dashed border-gray-200">
                <div className="scale-75 md:scale-100 origin-center">
                  {printModal.type === 'POS' ? (
                    <POSInvoice parcel={printParcel} merchant={printMerchant} area={printArea} size={printModal.posSize || '80mm'} />
                  ) : (
                    <StandardInvoice parcel={printParcel} merchant={printMerchant} area={printArea} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actual hidden print container for browser print command */}
      <div className="print-only">
        {printModal && printParcel && printMerchant && printArea && (
           printModal.type === 'POS' 
           ? <POSInvoice parcel={printParcel} merchant={printMerchant} area={printArea} size={printModal.posSize || '80mm'} />
           : <StandardInvoice parcel={printParcel} merchant={printMerchant} area={printArea} />
        )}
      </div>
    </>
  );
};

export default App;
