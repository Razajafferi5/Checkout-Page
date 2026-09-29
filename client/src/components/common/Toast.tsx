import React from 'react';
import { useNotification, Notification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
  info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
};

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {notifications.map((n: Notification) => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="pointer-events-auto rounded-2xl glass-panel shadow-elevated p-4 flex items-start gap-3 border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white"
          >
            <div className="mt-0.5">{icons[n.type]}</div>
            <div className="flex-1 min-w-0">
              {n.title && (
                <p className="font-bold text-xs leading-tight text-slate-900 dark:text-white mb-0.5">
                  {n.title}
                </p>
              )}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {n.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 -mr-1"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
