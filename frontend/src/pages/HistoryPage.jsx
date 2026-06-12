import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = async (id) => {
    // In a real app we'd fetch the specific strategy. 
    // Here we'll just alert or if we had a GET /api/strategy/:id we would use it.
    // For simplicity, let's just let the user know they can generate a new one.
    alert(`This would load strategy ID: ${id} into the dashboard.`);
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '60vh' }}>Loading history...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Strategy <span className="text-gradient">History</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Review your past generated marketing strategies.</p>
      </div>

      {history.length === 0 ? (
        <div className="glass-panel flex-center" style={{ padding: '60px', flexDirection: 'column', gap: '20px' }}>
          <Briefcase size={48} color="var(--text-muted)" />
          <h2>No strategies yet</h2>
          <button className="modern-button" onClick={() => navigate('/')}>
            Create Strategy
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {history.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card selectable"
              onClick={() => handleCardClick(item.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{item.business_name}</h3>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-tertiary)', fontWeight: 600 }}>
                  <IndianRupee size={16} />
                  {item.budget.toLocaleString('en-IN')}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
                {item.preview}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Calendar size={14} />
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
