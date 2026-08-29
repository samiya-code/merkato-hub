import React, { useState } from 'react';
import { Scan, Sparkles, Check, X, Camera } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export const BarcodeScannerModal = ({ isOpen, onClose, onScanProduct, products = [] }) => {
  const [manualCode, setManualCode] = useState('');

  const handleSimulatedScan = (product) => {
    onScanProduct(product);
    onClose();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const found = products.find(p => p.barcode === manualCode.trim() || p.sku.toLowerCase() === manualCode.trim().toLowerCase());
    if (found) {
      onScanProduct(found);
      onClose();
    } else {
      alert(`No product found with barcode ${manualCode}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Barcode Scanner Simulator" maxWidth="max-w-md">
      <div className="space-y-4">
        {/* Simulated Camera Viewfinder */}
        <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-emerald-500/50 shadow-inner">
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
          <Camera className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
          <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">
            OPTICAL SCANNER READY
          </span>
          <span className="text-[10px] text-slate-400 mt-1">Align barcode within the target frame</span>

          {/* Target Corners */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
        </div>

        {/* Quick Test Barcodes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Simulate Quick Scans:
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {products.slice(0, 6).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSimulatedScan(p)}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-colors text-xs"
              >
                <div className="truncate">
                  <p className="font-bold text-slate-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{p.barcode}</p>
                </div>
                <Scan className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Manual Barcode Input */}
        <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-100 flex gap-2">
          <Input
            placeholder="Type barcode or SKU..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="text-xs"
          />
          <Button type="submit" variant="primary" size="sm">
            Scan
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default BarcodeScannerModal;
