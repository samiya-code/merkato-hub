import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Clock,
  Boxes,
  Users,
  DollarSign,
  Building2,
  Trash2,
} from 'lucide-react';
import { notificationService } from '../../services/reportService';
import { useToast } from '../../hooks/useToast';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await notificationService.getNotifications();
    setNotifications(data);
  };

  const handleMarkAll = async () => {
    await notificationService.markAllAsRead();
    toast.success('Marked as Read', 'All notifications updated.');
    loadNotifications();
  };

  const handleMarkOne = async (id) => {
    await notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleClear = async (id) => {
    await notificationService.clearNotification(id);
    loadNotifications();
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'inventory' && n.category !== 'Inventory') return false;
    if (filter === 'customers' && n.category !== 'Customers') return false;
    if (filter === 'suppliers' && n.category !== 'Suppliers') return false;
    return true;
  });

  const getIcon = (category) => {
    switch (category) {
      case 'Inventory': return Boxes;
      case 'Customers': return Users;
      case 'Suppliers': return Building2;
      default: return DollarSign;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational alerts, inventory reorders, overdue invoices, and daily milestones.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleMarkAll} icon={CheckCheck}>
          Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'unread', label: 'Unread' },
          { id: 'inventory', label: 'Inventory' },
          { id: 'customers', label: 'Customers & Debt' },
          { id: 'suppliers', label: 'Suppliers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              filter === tab.id
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs divide-y divide-slate-100 space-y-1">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs font-medium">
            No notifications matching this filter.
          </div>
        ) : (
          filtered.map((item) => {
            const Icon = getIcon(item.category);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl flex items-start justify-between gap-4 transition-colors ${
                  item.read ? 'bg-white opacity-80' : 'bg-emerald-50/40 border border-emerald-100/60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      item.type === 'danger'
                        ? 'bg-rose-100 text-rose-700'
                        : item.type === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                      {item.timestamp} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!item.read && (
                    <button
                      onClick={() => handleMarkOne(item.id)}
                      className="p-1.5 text-xs text-emerald-700 font-semibold hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleClear(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
