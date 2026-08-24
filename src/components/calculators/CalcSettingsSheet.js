'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';

// Wraps the settings panel of a calculator. On desktop it renders the panel
// inline (unchanged). On mobile it collapses into a gear FAB button that
// opens the same content in a bottom sheet, so the settings don't push the
// result off-screen.
export default function CalcSettingsSheet({ title, children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Desktop: settings panel rendered inline */}
      <div className="calc-settings calc-settings-desktop">
        <div className="calc-settings-title">
          <Icon name="gear" size={16} />
          {title}
        </div>
        {children}
      </div>

      {/* Mobile: gear FAB opens the same content as a bottom sheet */}
      <button
        type="button"
        className="calc-settings-fab"
        onClick={() => setOpen(true)}
        aria-label={title}
      >
        <Icon name="gear" size={15} />
      </button>

      <div className={`calc-sheet-overlay${open ? ' open' : ''}`} aria-hidden={!open}>
        <button
          className="calc-sheet-backdrop"
          aria-label="Close"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <div className="calc-sheet" role="dialog" aria-modal="true">
          <div className="calc-sheet-head">
            <span className="calc-sheet-title">
              <Icon name="gear" size={16} />
              {title}
            </span>
            <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
              <Icon name="close" size={14} />
            </button>
          </div>
          <div className="calc-sheet-body">{children}</div>
        </div>
      </div>
    </>
  );
}
