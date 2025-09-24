import { useNavigate } from 'react-router-dom';
import gif404 from '../assets/404.gif';

export default function NotFound() {
  const nav = useNavigate();
  const raw = typeof window !== 'undefined' ? localStorage.getItem('bizpilot_user') : null;
  const user = raw ? JSON.parse(raw) : null;
  return (
    <main className="notfound-shell" aria-labelledby="nf-heading">
      <section className="notfound-card" role="alert" aria-live="polite">
        <div className="notfound-media" aria-hidden>
          <img src={gif404} alt="Lost astronaut illustration" className="notfound-gif" />
        </div>
        <h1 id="nf-heading" className="notfound-heading">404 – Page Not Found</h1>
        <p className="notfound-sub">The page you're looking for doesn't exist, was moved, or is temporarily unavailable. Let's get you back on track.</p>
        <div className="notfound-actions">
          <button className="btn btn-primary" onClick={() => nav('/')}>Go to Home</button>
          {user && (
            <button className="btn btn-ghost" onClick={() => nav('/dashboard')}>Dashboard</button>
          )}
          <button className="btn btn-ghost" onClick={() => nav(-1)}>Go Back</button>
        </div>
      </section>
    </main>
  );
}
