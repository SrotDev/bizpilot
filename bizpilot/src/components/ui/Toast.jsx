import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, { type = 'info', duration = 4000 } = {}) => {
    const id = Math.random().toString(36).slice(2,9)
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
    return id
  }, [])

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="toast-root" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} role="status">
            <div className="toast-message">{t.message}</div>
            <button className="toast-close" onClick={() => remove(t.id)} aria-label="Close">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(){
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export default ToastProvider
