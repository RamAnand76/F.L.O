'use client';

import { useStore } from '@/store/useStore';

/**
 * A bridge hook that connects existing useToast() calls 
 * to the new store-based NotificationSystem.
 */
export function useToast() {
  const addNotification = useStore((state) => state.addNotification);

  return {
    toast: {
      success: (message: string) => addNotification(message, 'success'),
      error: (message: string) => addNotification(message, 'error'),
      info: (message: string) => addNotification(message, 'info'),
      warning: (message: string) => addNotification(message, 'error'), // Mapping warning to error for now
    },
  };
}

// Dummy provider to maintain backward compatibility in RootLayout
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
