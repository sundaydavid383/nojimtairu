import { ToastNotification } from '../context/PropertyContext';

export type { ToastNotification };

type Listener = (toasts: ToastNotification[]) => void;
const listeners = new Set<Listener>();
let toasts: ToastNotification[] = [];

export const notify = {
  show(
    type: ToastNotification['type'],
    title: string,
    message: string,
    duration = 4500
  ): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const toast: ToastNotification = { id, type, title, message };
    toasts = [...toasts, toast];
    listeners.forEach((l) => l(toasts));
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      listeners.forEach((l) => l(toasts));
    }, duration);
    return id;
  },

  success(title: string, message: string) {
    return this.show('success', title, message);
  },

  error(title: string, message: string) {
    return this.show('error', title, message);
  },

  warning(title: string, message: string) {
    return this.show('warning', title, message);
  },

  info(title: string, message: string) {
    return this.show('info', title, message);
  },

  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  },

  getToasts(): ToastNotification[] {
    return [...toasts];
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    listener(toasts);
    return () => {
      listeners.delete(listener);
    };
  },
};
