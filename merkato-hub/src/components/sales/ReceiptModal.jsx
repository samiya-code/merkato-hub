import React, { useRef } from 'react';
import { Printer, Download, CheckCircle2, Store, X } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/currency';
import { useBusiness } from '../../context/BusinessContext';
import Button from '../ui/Button';

export const ReceiptModal = ({ isOpen, onClose, sale }) => {
  const { business } = useBusiness();
  const printRef = useRef(null);

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Printable simulation or export
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4 text-center">
        <div
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Payment Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} icon={Printer}>
                Print
              </Button>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Ethiopian SME Receipt Container */}
          <div id="printable-receipt" ref={printRef} className="p-6 bg-white font-mono text-xs text-slate-900">
            {/* Store Brand & TIN */}
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black tracking-tight">{business?.legalName || 'Bikila Trading PLC'}</h2>
              <p className="text-[10px] text-slate-600">{business?.address || 'Bole Road, Africa Avenue, Addis Ababa'}</p>
              <p className="text-[10px] text-slate-600">Tel: {business?.phone || '+251 911 234 567'}</p>
              <p className="text-[10px] font-bold text-slate-900 mt-1">TIN: {business?.tinNumber || '0012456789'}</p>
              <div className="inline-block mt-1 px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold uppercase tracking-wider">
                Official Cash Sales Receipt
              </div>
            </div>

            {/* Transaction Metadata */}
            <div className="py-3 space-y-1 text-[11px] border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-bold">{sale.receiptNumber || 'RCP-9842'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span>{sale.date ? sale.date.replace('T', ' ').slice(0, 16) : new Date().toISOString().slice(0, 16)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cashier:</span>
                <span>{sale.cashierName || 'Abebe Bikila'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold">{sale.customerName || 'Walk-in Customer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span className="font-bold text-emerald-700">{sale.paymentMethod || 'Telebirr'}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-3 border-b border-dashed border-slate-300">
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase pb-1 mb-1 border-b border-slate-200">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-4 text-right">Price (ETB)</div>
              </div>
              <div className="space-y-1.5 py-1">
                {sale.items?.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 text-[11px]">
                    <div className="col-span-6 font-medium truncate">{it.name}</div>
                    <div className="col-span-2 text-center">{it.quantity}</div>
                    <div className="col-span-4 text-right font-semibold">
                      {formatCurrency(it.price * it.quantity, { showSymbol: false })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="py-3 space-y-1.5 text-xs border-b border-dashed border-slate-300">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(sale.subtotal || sale.total * 0.8695, { showSymbol: true })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT (15% Included):</span>
                <span>{formatCurrency(sale.tax || sale.total * 0.1305, { showSymbol: true })}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatCurrency(sale.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span>{formatCurrency(sale.total)}</span>
              </div>
            </div>

            {/* Footer Barcode & Thank You */}
            <div className="text-center pt-4 space-y-2">
              <div className="font-mono text-center tracking-widest text-xs font-bold py-1 bg-slate-100 rounded">
                ||| | ||||| || |||| |||||| || |
              </div>
              <p className="text-[10px] text-slate-500 font-sans italic">
                Thank you for your business! / እናመሰግናለን!
              </p>
              <p className="text-[9px] text-slate-400 font-sans">
                Powered by MerkatoHub Ethiopian SME SaaS
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close & New Order
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} icon={Printer}>
              Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
