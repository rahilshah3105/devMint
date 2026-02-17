// Simple Logger Utility
const isDev = import.meta.env.DEV;

const logger = {
  debug: (message, data) => {
    if (isDev) console.log(`[DEBUG] ${message}`, data || '');
  },

  info: (message, data) => {
    if (isDev) console.log(`[INFO] ${message}`, data || '');
  },

  warn: (message, data) => {
    console.warn(`[WARN] ${message}`, data || '');
  },

  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error || '');
  }
};

export default logger;
