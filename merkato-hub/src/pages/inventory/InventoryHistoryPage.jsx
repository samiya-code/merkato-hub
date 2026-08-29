import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, ArrowLeft, Download, Search } from 'lucide-react';
import { inventoryService } from '../../services/productService';
import Button from '../../components/ui/Button';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import LoadingState from '../../components/ui/LoadingState';

export const InventoryHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await inventoryService.getHistory();
      setHistory(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = history.filter(h =>
    h.productName.toLowerCase().includes(search.toLowerCase()) ||
    h.reason.toLowerCase().includes(search.toLowerCase()) ||
    h.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/inventory')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inventory</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inventory Movement History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full audit log of incoming shipments, sales deductions, damages, and stocktaking reconciliations.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={Download}>
          Export Audit Trail
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search movements by product or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        {isLoading ? (
          <LoadingState message="Loading movement audit logs..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Log ID</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-center">Previous</TableHead>
                <TableHead className="text-center">Change</TableHead>
                <TableHead className="text-center">New Qty</TableHead>
                <TableHead>Reason / Order Ref</TableHead>
                <TableHead>Recorded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-slate-400">{item.id}</TableCell>
                  <TableCell className="text-xs text-slate-500">{item.date}</TableCell>
                  <TableCell className="font-bold text-slate-900 text-xs">{item.productName}</TableCell>
                  <TableCell className="text-center text-xs text-slate-500 font-medium">{item.prevQty}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded ${
                        item.change.startsWith('+')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.change}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-xs font-bold text-slate-900">{item.newQty}</TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">{item.reason}</TableCell>
                  <TableCell className="text-xs text-slate-500">{item.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default InventoryHistoryPage;
