'use client';

import { toast, Toaster as ToastrrToaster } from 'toastrr';

interface ToastOptions {
  theme?: 'light' | 'dark';
  duration?: number | 'infinite';
  closeButton?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

/**
 * A bridge hook that connects existing useToast() calls 
 * to the new toastrr system.
 * Usage:
 * const { toast } = useToast();
 * toast.success('Message', { duration: 'infinite' });
 */
export function useToast() {
  return {
    toast: {
      success: (message: string, options?: ToastOptions) => 
        toast.success(message, { theme: 'dark', ...options }),
      error: (message: string, options?: ToastOptions) => 
        toast.error(message, { theme: 'dark', ...options }),
      info: (message: string, options?: ToastOptions) => 
        toast.info(message, { theme: 'dark', ...options }),
      warning: (message: string, options?: ToastOptions) => 
        toast.warning(message, { theme: 'dark', ...options }),
      promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }, options?: ToastOptions) =>
        toast.promise(promise, {
          loading: messages.loading,
          success: messages.success,
          error: messages.error,
          theme: 'dark',
          ...options
        }),
    },
  };
}

// Re-export Toaster for layout use
// We use dark as default for the platform, but toast calls can override.
export const Toaster = () => (
  <ToastrrToaster
    position="top-right"
    theme="dark"
    duration={3000}
    closeButton={true}
  />
);

// Provider to maintain backward compatibility in RootLayout
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}


