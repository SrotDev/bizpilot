import { Link, useNavigate, useLocation } from "react-router-dom";
import { Rocket, LineChart, User, LogIn, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Notifications from "./Notifications";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  // simple mock state by checking localStorage directly to avoid wiring auth yet
  const raw = typeof window !== 'undefined' ? localStorage.getItem('bizpilot_user') : null;
  const user = raw ? JSON.parse(raw) : null;
  const navigate = useNavigate();
  const location = useLocation();
  const [notesOpen, setNotesOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [ringing, setRinging] = useState(false);
  const ringTimerRef = useRef(null);

  const logout = () => {
    localStorage.removeItem('bizpilot_user');
    navigate('/');
    location.reload();
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // read unread notifications from localStorage and update badge
  useEffect(() => {
    const readNotes = () => {
      try {
        const raw = localStorage.getItem('bizpilot_notifications');
        // seed some dummy notifications if none exist so the badge is visible for testing
        const seed = [
          { id: 'n1', title: 'Welcome to BizPilot', body: 'Your account is ready. Start by creating a project.', time: '2h', read: false },
          { id: 'n2', title: 'Payment processed', body: 'Your most recent purchase was successful.', time: '1d', read: false },
          { id: 'n3', title: 'New comment', body: 'Someone commented on your project.', time: '3d', read: false },
          { id: 'n4', title: 'Invite accepted', body: 'Your collaborator accepted the invite.', time: '4d', read: true },
          { id: 'n5', title: 'Weekly summary', body: 'Your weekly activity summary is ready.', time: '6d', read: true }
        ];
        let arr = [];
        if (!raw) {
          localStorage.setItem('bizpilot_notifications', JSON.stringify(seed));
          arr = seed;
        } else arr = JSON.parse(raw);
        const u = arr.filter(n => !n.read).length;
        setUnreadCount(u);
      } catch (e) { setUnreadCount(0) }
    };
    readNotes();
    const onStorage = (e) => { if (e.key === 'bizpilot_notifications') readNotes(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Ring bell every 10s while there are unread notifications and the panel is closed
  useEffect(() => {
    if (unreadCount > 0 && !notesOpen) {
      // start interval
      if (!ringTimerRef.current) {
        ringTimerRef.current = setInterval(() => {
          setRinging(true);
          setTimeout(() => setRinging(false), 1100);
        }, 3000);
      }
    } else {
      if (ringTimerRef.current) { clearInterval(ringTimerRef.current); ringTimerRef.current = null; }
      setRinging(false);
    }
    return () => { if (ringTimerRef.current) { clearInterval(ringTimerRef.current); ringTimerRef.current = null; } }
  }, [unreadCount, notesOpen]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          <Rocket className="brand-icon" />
          <span>BizPilot</span>
        </Link>

        {/* Page-based main-nav:
            - Landing page ('/') shows in-page anchors: Pricing, About, Contact
            - Auth pages ('/auth/*') and special pages ('/onboarding','/404') show no main-nav
            - All other pages show Home, Dashboard, Community
        */}
        { !location.pathname.startsWith('/auth') && !['/onboarding','/404'].includes(location.pathname) && (
          <nav className={`main-nav ${open ? 'is-open' : ''}`}>
            {location.pathname === '/' ? (
              <>
                <a onClick={()=>scrollTo('pricing')}>Pricing</a>
                <a onClick={()=>scrollTo('about')}>About</a>
                <a onClick={()=>scrollTo('contact')}>Contact</a>
              </>
            ) : (
              <>
                <a className={location.pathname.startsWith('/dashboard') ? 'active' : ''} onClick={()=>navigate('/dashboard')}>Dashboard</a>
                <a className={location.pathname.startsWith('/community') ? 'active' : ''} onClick={()=>navigate('/community')}>Community</a>
              </>
            )}
          </nav>
        )}

        {/* Hide site actions on onboarding and 404 pages */}
        { !['/onboarding','/404'].includes(location.pathname) && (
          <div className="site-actions">
            {/* Page-based actions: landing (/) and auth pages show Login/Get Started; other pages show Notifications + Profile */}
            { (location.pathname === '/' || location.pathname.startsWith('/auth')) ? (
              <>
                <button className="btn btn-ghost" onClick={() => navigate("/auth/login") }>
                  <LogIn size={18} className="icon-left" /> Sign in
                </button>
                <button className="btn btn-primary" onClick={() => navigate("/auth/signup")}>Get Started</button>
              </>
            ) : (
              <>
                {/* tokens pill (clickable) */}
                <button className="tokens-pill" onClick={() => navigate('/payment')} title="Buy tokens / View balance" aria-label="Tokens">
                  <span className="tokens-coin" aria-hidden>
                  </span>
                  <span className="tokens-count">{user && typeof user.tokens !== 'undefined' ? user.tokens : 1000}</span>
                </button>
                {/* notification button */}
                <button className={`btn btn-ghost notifications-toggle ${notesOpen ? 'is-active' : ''} ${ringing ? 'is-ringing' : ''}`} aria-label="Notifications" onClick={() => setNotesOpen(v=>!v)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
                  {unreadCount > 0 && !notesOpen && <span className="bell-unread-dot" aria-hidden></span>}
                </button>
                {/* profile avatar/button */}
                <button className={`btn btn-ghost profile-toggle ${location.pathname === '/profile' ? 'is-active' : ''}`} onClick={() => navigate('/profile')} aria-label="Profile">
                    <span className={`profile-avatar-mini ${location.pathname === '/profile' ? 'active' : ''}`}>
                      {user && user.name ? user.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase() : <User size={16} />}
                    </span>
                </button>
              </>
            )}
          </div>
        )}

        {/* hide mobile toggle on onboarding and 404 pages */}
        { !['/onboarding','/404'].includes(location.pathname) && (
          <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setOpen(o=>!o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}
      </div>

      {open && !['/onboarding','/404'].includes(location.pathname) && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-inner">
            {user ? (
              <>
                <a onClick={()=>{ setOpen(false); navigate('/') }}>Home</a>
                <a onClick={()=>{ setOpen(false); navigate('/dashboard') }}>Dashboard</a>
                <a onClick={()=>{ setOpen(false); navigate('/community') }}>Community</a>
              </>
            ) : (
              <>
                <a onClick={()=>{ setOpen(false); scrollTo('home') }}>Home</a>
                <a onClick={()=>{ setOpen(false); scrollTo('features') }}>Features</a>
                <a onClick={()=>{ setOpen(false); scrollTo('pricing') }}>Pricing</a>
                <a onClick={()=>{ setOpen(false); scrollTo('about') }}>About</a>
                <a onClick={()=>{ setOpen(false); scrollTo('contact') }}>Contact</a>
              </>
            )}
            <div className="divider" />
            {/* Mobile actions: page-based same as desktop -- landing/auth show login/get-started; others show profile/dashboard/logout */}
            {(location.pathname === '/' || location.pathname.startsWith('/auth')) ? (
              <>
                <button className="btn btn-ghost" onClick={() => { setOpen(false); navigate('/auth/login'); }}>
                  <LogIn size={18} className="icon-left" /> Sign in
                </button>
                <button className="btn btn-primary" onClick={() => { setOpen(false); navigate('/auth/signup'); }}>Get Started</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={() => { setOpen(false); navigate('/dashboard'); }}>
                  <LineChart size={18} className="icon-left" /> Dashboard
                </button>
                <button className="btn btn-ghost" onClick={() => { setOpen(false); navigate('/profile'); }}>
                  <User size={18} className="icon-left" /> {user && user.name ? user.name : 'Profile'}
                </button>
                <button className="btn btn-primary" onClick={() => { setOpen(false); logout(); }}>Logout</button>
              </>
            )}
          </div>
        </div>
      )}
  {/* Notifications panel, rendered at root so it overlays to the right */}
  <Notifications open={notesOpen} onClose={() => setNotesOpen(false)} />
    </header>
  );
}
