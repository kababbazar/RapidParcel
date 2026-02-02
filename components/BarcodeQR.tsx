
import React from 'react';

// Simplified SVG components for the purpose of the demo
// In a production app, you would use 'react-barcode' and 'qrcode.react'
// Since we are creating a self-contained single-file focused React app, 
// we will simulate these with visually similar SVG placeholders if needed, 
// but it's better to use high quality placeholders.

export const Barcode: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div className="flex flex-col items-center">
      <svg className="h-12 w-full max-w-[150px]" preserveAspectRatio="none">
        {Array.from({ length: 40 }).map((_, i) => (
          <rect 
            key={i} 
            x={`${i * 2.5}%`} 
            y="0" 
            width={`${Math.random() > 0.5 ? 1 : 2}%`} 
            height="100%" 
            fill="black" 
          />
        ))}
      </svg>
      <span className="text-[10px] font-mono mt-1">{value}</span>
    </div>
  );
};

export const QRCode: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div className="p-1 border border-black inline-block bg-white">
      <svg width="60" height="60" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="white" />
        {Array.from({ length: 15 }).map((_, i) => (
           Array.from({ length: 15 }).map((_, j) => (
             Math.random() > 0.4 ? <rect key={`${i}-${j}`} x={i*6.6} y={j*6.6} width="6" height="6" fill="black" /> : null
           ))
        ))}
        {/* Corners */}
        <path d="M0 0h20v6h-14v14h-6z M80 0h20v20h-6v-14h-14z M0 80v20h20v-6h-14v-14z" fill="black" />
      </svg>
    </div>
  );
};
