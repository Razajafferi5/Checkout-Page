import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string, title?: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string, title?: string) => {
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setNotifications(prev => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        removeNotification(id);
      }, 4500);
    },
    [removeNotification]
  );

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
