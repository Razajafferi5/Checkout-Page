import React from 'react';
import { useNotification, Notification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-sky-500 flex-shrink-0" />,
};

const borderStyles = {
  success: 'border-emerald-200 bg-white shadow-emerald-100/50',
  error: 'border-rose-200 bg-white shadow-rose-100/50',
  warning: 'border-amber-200 bg-white shadow-amber-100/50',
  info: 'border-sky-200 bg-white shadow-sky-100/50',
};

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {notifications.map((n: Notification) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all transform animate-in slide-in-from-bottom-2 ${borderStyles[n.type]}`}
        >
          {icons[n.type]}
          <div className="flex-1 min-w-0">
            {n.title && <p className="font-semibold text-sm text-slate-900">{n.title}</p>}
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
