
import React from 'react';
import { ParcelEntry, Merchant, Area, SiteType } from '../types';
import { Barcode, QRCode } from './BarcodeQR';

interface InvoiceProps {
  parcel: ParcelEntry;
  merchant: Merchant;
  area: Area;
}

export const POSInvoice: React.FC<InvoiceProps & { size: string }> = ({ parcel, merchant, area, size }) => {
  const widthClass = size === '57mm' ? 'w-[57mm]' : size === '80mm' ? 'w-[80mm]' : 'w-[110mm]';
  
  return (
    <div className={`${widthClass} bg-white p-4 font-mono text-[11px] leading-tight space-y-3`}>
      <div className="text-center border-b border-dashed pb-2 mb-2">
        <h2 className="text-sm font-extrabold uppercase tracking-widest">Rapid Parcel</h2>
        <p>Uttara, Dhaka-1230</p>
        <p>+8801888-011676</p>
      </div>

      <div className="flex justify-between font-bold border-b border-dashed pb-1">
        <span>INV: {parcel.invoiceNumber}</span>
        <span>{parcel.date}</span>
      </div>

      <div className="space-y-1 py-1">
        <div className="flex justify-between font-bold text-sm">
          <span>MERCHANT:</span>
          <span>{merchant.pageName}</span>
        </div>
        <div className="flex flex-col border p-1 mt-1 bg-gray-50">
          <span className="font-bold">TO: {parcel.customerName}</span>
          <span>{parcel.phone}</span>
          <span className="whitespace-normal overflow-wrap-break-word">{parcel.address}</span>
          <span className="font-bold uppercase bg-black text-white px-1 mt-1 text-center">{area.areaName} ({area.site})</span>
        </div>
      </div>

      <div className="border-y border-dashed py-2 text-center">
        <div className="text-lg font-bold">CASH: ৳{parcel.amount}</div>
        <div className="text-[10px] mt-1 italic">Please check before taking delivery</div>
      </div>

      <div className="flex flex-col items-center gap-2 pt-2">
        <Barcode value={parcel.invoiceNumber} />
        <QRCode value={`https://rapidparcel.com/track/${parcel.invoiceNumber}`} />
        <div className="text-[12px] font-bold border-2 border-black p-1">COD CODE: RP-C-01</div>
      </div>

      <div className="text-[9px] text-center pt-4 border-t border-dashed opacity-50">
        Thank you for using Rapid Parcel!
      </div>
    </div>
  );
};

export const StandardInvoice: React.FC<InvoiceProps> = ({ parcel, merchant, area }) => {
  return (
    <div className="w-[8in] h-[5in] bg-white border-2 border-gray-900 p-8 flex flex-col relative font-sans overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-gray-900 pb-4 mb-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-yellow-600">RAPID PARCEL</h1>
          <p className="font-bold">Fast & Secure Delivery Network</p>
          <div className="text-sm mt-2 font-medium">
             Uttara, Dhaka - 1230<br/>
             Hotline: +8801888-011676, +8801601-164597
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black opacity-10 absolute top-4 right-8">INVOICE</div>
          <div className="mt-8 space-y-1">
             <div className="font-bold text-xl">{parcel.invoiceNumber}</div>
             <div className="text-sm">Date: {parcel.date}</div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-2 gap-8 flex-1">
        <div className="space-y-4">
           <div className="bg-gray-100 p-4 rounded-lg">
             <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Merchant Info</h3>
             <div className="text-xl font-black text-gray-900">{merchant.pageName}</div>
             <div className="text-sm">{merchant.phone}</div>
           </div>
           
           <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
             <h3 className="text-xs font-bold uppercase text-yellow-600 mb-2">Delivery To</h3>
             <div className="text-xl font-black">{parcel.customerName}</div>
             <div className="text-lg font-bold">{parcel.phone}</div>
             <div className="text-sm leading-tight mt-1">{parcel.address}</div>
             <div className="mt-3 text-sm font-black bg-yellow-400 px-3 py-1 rounded inline-block uppercase">
                {area.areaName} - {area.district}
             </div>
           </div>
        </div>

        <div className="flex flex-col justify-between items-end text-right">
          <div className="bg-black text-white p-6 rounded-2xl w-full">
             <div className="text-sm opacity-80 mb-1">Total Cash Amount (COD)</div>
             <div className="text-5xl font-black tracking-tight">৳{parcel.amount}</div>
          </div>

          <div className="space-y-4 w-full flex flex-col items-end">
             <Barcode value={parcel.invoiceNumber} />
             <div className="flex gap-4 items-center">
                <div className="text-xs font-bold text-right leading-none">
                   Scan QR<br/>to track<br/>delivery
                </div>
                <QRCode value={parcel.invoiceNumber} />
             </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t flex justify-between items-center text-[10px] font-bold uppercase">
         <span>Return Policy: 24 Hours</span>
         <span>Signature: ______________________</span>
         <span className="text-yellow-600">Generated by RP System v1.0</span>
      </div>
    </div>
  );
};
