import { useState, useEffect } from 'react';
import { X, MailOpen, Trash2, Square, CheckSquare } from 'lucide-react';

export default function Notifications({ open, onClose }) {
  // mock notifications for now; each has id, body, time, read (title removed per design)
  const initial = [
    { id: 'n1', body: 'Your account is ready. Start by creating a project.', time: '2h', read: false },
    { id: 'n2', body: 'Your most recent purchase was successful.', time: '1d', read: true },
    { id: 'n3', body: 'Someone commented on your project.', time: '3d', read: false },
  ];

  // Helper to seed dummy unread notifications for testing
  window.seedDummyNotifications = () => {
    const dummy = [
      { id: 'n101', body: 'This is a dummy unread notification.', time: '1m', read: false },
      { id: 'n102', body: 'Another unread notification for testing.', time: '2m', read: false },
      { id: 'n103', body: 'Yet another unread notification.', time: '3m', read: false }
    ];
    let arr = [];
    try {
      const raw = localStorage.getItem('bizpilot_notifications');
      arr = raw ? JSON.parse(raw) : [];
    } catch (e) {}
    arr = [...dummy, ...arr];
    localStorage.setItem('bizpilot_notifications', JSON.stringify(arr));
    return arr;
  }

  // Seed localStorage with a few unread notifications if none exist (dev helper)
  const seedIfNeeded = () => {
    try {
      const raw = localStorage.getItem('bizpilot_notifications');
      if (!raw) {
        localStorage.setItem('bizpilot_notifications', JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch (e) { return initial }
  }

  const [notes, setNotes] = useState(() => seedIfNeeded());
  const [selected, setSelected] = useState(new Set());

  useEffect(() => { localStorage.setItem('bizpilot_notifications', JSON.stringify(notes)); }, [notes]);

  const toggleSelect = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  }

  const selectAll = () => {
    if (selected.size === notes.length) { setSelected(new Set()); return }
    setSelected(new Set(notes.map(n=>n.id)));
  }

  const markRead = (ids) => {
    setNotes(notes.map(n => ids.includes(n.id) ? { ...n, read: true } : n));
    setSelected(new Set());
  }

  const removeIds = (ids) => {
    setNotes(notes.filter(n => !ids.includes(n.id)));
    setSelected(new Set());
  }

  const removeOne = (id) => removeIds([id]);

  if (!open) return null;

  return (
    <aside className="notifications-panel" role="dialog" aria-label="Notifications panel">
      <div className="notifications-header">
        <div>
          <h4>Notifications</h4>
          <div className="muted">{notes.length} total</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="btn btn-ghost" onClick={selectAll} title={selected.size === notes.length ? 'Deselect all' : 'Select all'}>
            {selected.size === notes.length ? <CheckSquare size={16} /> : <Square size={16} />}
          </button>
          <button className="btn btn-ghost" onClick={() => markRead(Array.from(selected))} disabled={selected.size===0} title="Mark selected as read"><MailOpen size={16} /></button>
          <button className="btn btn-ghost" onClick={() => removeIds(Array.from(selected))} disabled={selected.size===0} title="Delete selected"><Trash2 size={16} /></button>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close notifications"><X size={16} /></button>
        </div>
      </div>

      <div className="notifications-list">
        {notes.length === 0 && (
          <div className="card" style={{padding:16,textAlign:'center'}}>You're all caught up.</div>
        )}
        {notes.map(n => (
          <div key={n.id} className={`notification-item ${n.read ? 'is-read' : 'is-unread'}`}>
            <label className="note-left">
              <input type="checkbox" checked={selected.has(n.id)} onChange={()=>toggleSelect(n.id)} />
              <div className="note-meta">
                <div className="note-body only muted">{n.body}</div>
              </div>
            </label>
            <div className="note-right">
              <div className="muted" style={{fontSize:12}}>{n.time}</div>
              <div style={{height:6}} />
              <div style={{display:'flex',gap:6}}>
                <button className="note-action-btn" onClick={()=>markRead([n.id])} title="Mark read"><MailOpen size={14} /></button>
                <button className="note-action-btn note-action-delete" onClick={()=>removeOne(n.id)} title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
