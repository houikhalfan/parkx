import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashToaster() {
  const { flash = {} } = usePage().props;
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState('success');

  useEffect(() => {
    if (flash?.success) {
      setMsg(flash.success);
      setType('success');
      setVisible(true);
    } else if (flash?.error) {
      setMsg(flash.error);
      setType('error');
      setVisible(true);
    }
  }, [flash?.success, flash?.error]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 3500); // auto-hide
    return () => clearTimeout(t);
  }, [visible]);

  if (!msg) return null;

  const base =
    'rounded shadow-lg px-4 py-3 border relative transition-opacity duration-500';
  const palette =
    type === 'success'
      ? 'bg-green-50 border-green-400 text-green-700'
      : 'bg-red-50 border-red-400 text-red-700';

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${visible ? 'opacity-100' : 'opacity-0'}`}
      role={type === 'success' ? 'status' : 'alert'}
      aria-live="polite"
    >
      <div className={`${base} ${palette}`}>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute top-1 right-2 text-inherit/70"
          aria-label="Fermer"
        >
          ×
        </button>
        <strong className="font-medium">{msg}</strong>
      </div>
    </div>
  );
}
