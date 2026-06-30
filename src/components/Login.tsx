import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Shield, Key, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const { loginAdmin } = useSecurity();
  const [email, setEmail] = useState('admin@shield.linkedin.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authenticating
    setTimeout(() => {
      loginAdmin();
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-page">
      <div className="cyber-bg"></div>
      
      <motion.div 
        className="login-card glass-panel"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="login-header">
          <motion.div 
            className="login-logo"
            animate={{ 
              boxShadow: ['0 0 10px rgba(0, 240, 255, 0.2)', '0 0 25px rgba(0, 240, 255, 0.5)', '0 0 10px rgba(0, 240, 255, 0.2)']
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Shield className="sidebar-logo-shield" size={32} />
          </motion.div>
          
          <h2 className="login-title">
            LINKEDIN <span className="glow-text-blue">SHIELD</span>
          </h2>
          <p className="login-subtitle">Security Operations Center Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input 
                type="email" 
                className="cyber-input" 
                style={{ width: '100%', paddingLeft: '44px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Security Key / Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '14px', top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input 
                type="password" 
                className="cyber-input" 
                style={{ width: '100%', paddingLeft: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="cyber-btn"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? (
              <span className="blink">AUTHENTICATING SCAN...</span>
            ) : (
              <>
                <Key size={18} />
                ACCESS SOC CONSOLE
              </>
            )}
          </button>
        </form>

        <p className="login-footer-text">
          Authorized personnel only. All access, sessions, and simulated attacks are monitored under LinkedIn Security Guidelines.
        </p>
      </motion.div>
    </div>
  );
};
