
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Intro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'loading' | 'blast' | 'done'>('loading');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('blast'), 2500);
    const timer2 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden"
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          <img 
            src="https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/vmneeplgg519no8eqvqw" 
            alt="Rapid Parcel" 
            className="w-32 h-32 rounded-3xl shadow-2xl border-4 border-yellow-500"
          />
          {stage === 'blast' && (
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 30, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 bg-yellow-400 rounded-full"
            />
          )}
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold tracking-widest mb-4 text-yellow-500"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          RAPID PARCEL
        </motion.h1>

        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-yellow-500 shadow-[0_0_15px_#f59e0b]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "linear" }}
          />
          {/* Bomb Sparkle Effect */}
          <motion.div 
            className="absolute top-[-4px] h-4 w-4 bg-red-500 rounded-full blur-sm"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2.2, ease: "linear" }}
          />
        </div>

        <motion.p 
          className="mt-4 text-gray-400 font-medium tracking-tighter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Initializing Secure Logistics Engine...
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};
