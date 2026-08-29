import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
  isLoading = false,
}) => {
  const icons = {
    danger: <div className="p-3 bg-rose-50 rounded-full text-rose-600 mb-3 inline-block"><Trash2 className="w-6 h-6" /></div>,
    warning: <div className="p-3 bg-amber-50 rounded-full text-amber-600 mb-3 inline-block"><AlertTriangle className="w-6 h-6" /></div>,
    info: <div className="p-3 bg-sky-50 rounded-full text-sky-600 mb-3 inline-block"><Info className="w-6 h-6" /></div>,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="text-center py-2">
        {icons[type]}
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
