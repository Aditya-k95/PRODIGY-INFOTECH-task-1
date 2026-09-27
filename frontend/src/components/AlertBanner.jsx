import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const AlertBanner = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={18} style={{ flexShrink: 0 }} />;
      case 'success':
        return <CheckCircle2 size={18} style={{ flexShrink: 0 }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ flexShrink: 0 }} />;
      default:
        return <Info size={18} style={{ flexShrink: 0 }} />;
    }
  };

  return (
    <div className={`alert-banner ${type}`} role="alert">
      {getIcon()}
      <div style={{ flex: 1, wordBreak: 'break-word' }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Dismiss alert"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
