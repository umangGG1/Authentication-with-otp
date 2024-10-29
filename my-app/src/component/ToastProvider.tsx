import { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { X } from 'lucide-react';

// Types
type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, title?: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

// Create Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Provider Component
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message, title }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Individual Toast Component
  const Toast = ({ id, type, title, message }: ToastMessage) => {
    const bgColor = {
      success: 'bg-green-50 border-green-500',
      error: 'bg-red-50 border-red-500',
      info: 'bg-blue-50 border-blue-500'
    }[type];

    const textColor = {
      success: 'text-green-800',
      error: 'text-red-800',
      info: 'text-blue-800'
    }[type];

    return (
      <div 
        className={`flex items-center justify-between p-4 mb-4 border rounded-lg shadow-lg ${bgColor} transition-all duration-500 ease-in-out`}
        role="alert"
      >
        <div>
          {title && (
            <div className={`font-bold ${textColor}`}>
              {title}
            </div>
          )}
          <div className={textColor}>
            {message}
          </div>
        </div>
        <button
          onClick={() => removeToast(id)}
          className={`ml-4 ${textColor} hover:opacity-70 transition-opacity`}
        >
          <X size={18} />
        </button>
      </div>
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 max-w-md">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};


export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
