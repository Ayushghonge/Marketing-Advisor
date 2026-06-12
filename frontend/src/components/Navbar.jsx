import { Link, useLocation } from 'react-router-dom';
import { Rocket, History, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'rgba(15, 17, 26, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Rocket size={28} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }} className="text-gradient">
            AI Advisor
          </h1>
        </Link>

        <div style={{ display: 'flex', gap: '24px' }}>
          <Link to="/" style={linkStyle(isActive('/'))}>
            <LayoutDashboard size={18} />
            <span>New Strategy</span>
          </Link>
          <Link to="/history" style={linkStyle(isActive('/history'))}>
            <History size={18} />
            <span>History</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

const linkStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  color: active ? 'var(--text-main)' : 'var(--text-muted)',
  fontWeight: active ? 600 : 500,
  transition: 'color 0.2s',
  borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
  paddingBottom: '4px'
});
