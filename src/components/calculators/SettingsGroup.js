'use client';

import { createContext, useContext, useState } from 'react';
import Icon from '@/components/ui/Icon';

// Accordion context: only one group open at a time within a panel.
const AccordionCtx = createContext(null);

export function SettingsAccordion({ children, defaultOpen = 0 }) {
  const [openId, setOpenId] = useState(defaultOpen);
  return (
    <AccordionCtx.Provider value={{ openId, setOpenId }}>
      {children}
    </AccordionCtx.Provider>
  );
}

let autoId = 0;

export default function SettingsGroup({ id, label, children }) {
  const ctx = useContext(AccordionCtx);
  // Stable id if not provided
  const [fallbackId] = useState(() => `sg-${autoId++}`);
  const gid = id ?? fallbackId;

  const open = ctx ? ctx.openId === gid : true;
  const toggle = () => {
    if (!ctx) return;
    ctx.setOpenId(open ? null : gid);
  };

  return (
    <div className={`settings-group${open ? ' open' : ''}`}>
      <button type="button" className="settings-group-head" onClick={toggle}>
        <span className="settings-group-label">{label}</span>
        <Icon name="chevron" size={16} className="settings-group-caret" />
      </button>
      {open && <div className="settings-group-body">{children}</div>}
    </div>
  );
}
