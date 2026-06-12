import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Megaphone, ExternalLink, IndianRupee, Lightbulb } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('latest_strategy');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!data) return null;

  const { business_name, budget, strategy } = data;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
            Strategy for <span className="text-gradient">{business_name}</span>
          </h1>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IndianRupee size={16} /> Total Budget: ₹{budget.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <button className="modern-button-outline" onClick={() => navigate('/')}>
          New Strategy
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Core Message */}
        <motion.div 
          className="glass-card" 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--accent-primary)' }}>
            <Megaphone size={24} />
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>Core Message</h2>
          </div>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.6, fontStyle: 'italic', color: 'var(--text-main)' }}>
            "{strategy.core_message}"
          </p>
        </motion.div>

        {/* Budget Breakdown Chart */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Budget Breakdown</h2>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={strategy.budget_breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {strategy.budget_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{ background: 'rgba(15, 17, 26, 0.9)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Marketing Channels</h2>
      <div className="grid-3" style={{ marginBottom: '40px' }}>
        {strategy.marketing_channels.map((channel, idx) => (
          <motion.div
            key={channel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (idx * 0.1) }}
            className="glass-card selectable"
            onClick={() => navigate(`/platform/${channel}`)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: 500, textTransform: 'capitalize' }}>
              {channel.replace('_', ' ')}
            </span>
            <ExternalLink size={18} color="var(--accent-primary)" />
          </motion.div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Lightbulb color="var(--accent-tertiary)" /> Content Ideas
      </h2>
      <div className="grid-2">
        {strategy.content_ideas.map((idea, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (idx * 0.1) }}
            className="glass-card"
          >
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--accent-secondary)' }}>{idea.title}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {idea.description}
            </p>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}
