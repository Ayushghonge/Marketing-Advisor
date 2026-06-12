import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, RefreshCw, Globe, Trophy, Sparkles } from 'lucide-react';

const GOAL_OPTIONS = [
  { id: 'sales', label: 'Increase Sales', icon: <TrendingUp size={24} /> },
  { id: 'awareness', label: 'Brand Awareness', icon: <Globe size={24} /> },
  { id: 'customers', label: 'New Customers', icon: <Users size={24} /> },
  { id: 'retention', label: 'Customer Retention', icon: <RefreshCw size={24} /> },
  { id: 'presence', label: 'Online Presence', icon: <Target size={24} /> },
  { id: 'competitors', label: 'Beat Competitors', icon: <Trophy size={24} /> }
];

export default function WizardPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    budget: ''
  });
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleGoal = (goalLabel) => {
    setSelectedGoals(prev => 
      prev.includes(goalLabel)
        ? prev.filter(g => g !== goalLabel)
        : [...prev, goalLabel]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.business_name || !formData.industry || !formData.budget || selectedGoals.length === 0) {
      setError('Please fill all fields and select at least one goal.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.business_name,
          industry: formData.industry,
          budget: Number(formData.budget),
          goals: selectedGoals
        })
      });

      if (!response.ok) throw new Error('Failed to generate strategy');
      
      const data = await response.json();
      localStorage.setItem('latest_strategy', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel" 
      style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          Generate your <span className="text-gradient">Marketing Strategy</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Tell us about your business, and our AI will craft the perfect plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div className="grid-2">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Business Name</label>
            <input 
              type="text" 
              name="business_name"
              className="modern-input" 
              placeholder="e.g. Acme Corp"
              value={formData.business_name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Industry</label>
            <input 
              type="text" 
              name="industry"
              className="modern-input" 
              placeholder="e.g. E-commerce, SaaS"
              value={formData.industry}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Marketing Budget (₹)</label>
          <input 
            type="number" 
            name="budget"
            className="modern-input" 
            placeholder="e.g. 50000"
            value={formData.budget}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '16px', fontWeight: 500 }}>What are your primary goals?</label>
          <div className="grid-3">
            {GOAL_OPTIONS.map(goal => {
              const isSelected = selectedGoals.includes(goal.label);
              return (
                <div 
                  key={goal.id}
                  className={`glass-card selectable ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleGoal(goal.label)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center', padding: '20px 10px' }}
                >
                  <div style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    {goal.icon}
                  </div>
                  <span style={{ fontWeight: 500 }}>{goal.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <button type="submit" className="modern-button" disabled={loading} style={{ marginTop: '20px', padding: '16px' }}>
          {loading ? (
            <>
              <Sparkles className="animate-pulse" />
              Generating Strategy...
            </>
          ) : (
            <>
              <Sparkles />
              Generate Strategy
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
