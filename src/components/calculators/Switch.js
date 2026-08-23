'use client';

export default function Switch({ checked, onChange, name, sub }) {
  return (
    <label className="switch-row">
      <span className="switch-row-info">
        <span className="switch-row-name">{name}</span>
        {sub && <span className="switch-row-sub">{sub}</span>}
      </span>
      <span className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="switch-track" />
      </span>
    </label>
  );
}
