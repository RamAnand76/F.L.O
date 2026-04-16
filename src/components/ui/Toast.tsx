'use client';

import { toast, Toaster as ToastrrToaster } from 'toastrr';

/**
 * A bridge hook that connects existing useToast() calls 
 * to the new toastrr system.
 */
export function useToast() {
  return {
    toast: {
      success: (message: string) => toast.success(message, { theme: 'dark' }),
      error: (message: string) => toast.error(message, { theme: 'dark' }),
      info: (message: string) => toast.info(message, { theme: 'dark' }),
      warning: (message: string) => toast.warning(message, { theme: 'dark' }),
      promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }) =>
        toast.promise(promise, {
          loading: messages.loading,
          success: messages.success,
          error: messages.error,
          theme: 'dark'
        }),
    },
  };
}

// Re-export Toaster for layout use
export const Toaster = () => (
  <ToastrrToaster
    position="top-right"
    theme="dark"
    duration={4000}
    closeButton={true}
  />
);

// Dummy provider to maintain backward compatibility in RootLayout
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
