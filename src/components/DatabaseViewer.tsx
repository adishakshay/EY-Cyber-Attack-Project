import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Database, Plus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DatabaseViewer: React.FC = () => {
  const { users, securityLogs, addUser } = useSecurity();
  const [activeDbTab, setActiveDbTab] = useState<'users' | 'logs'>('users');
  
  // Add User Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('India');

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    
    addUser({ name, email, phone, location });
    setName('');
    setEmail('');
    setPhone('');
    setLocation('India');
    setShowAddForm(false);
  };

  const getRiskBadge = (risk: string) => {
    const r = risk.toLowerCase();
    return <span className={`badge badge-${r}`}>{risk}</span>;
  };

  return (
    <div className="page-padding">
      {/* Header */}
      <div className="tab-header-container">
        <div>
          <h1 className="tab-header-title">Live Database Explorer</h1>
          <p className="tab-header-desc">Inspect active MongoDB collections and query record variables in real-time.</p>
        </div>
      </div>

      {/* Database Tabs Selection */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveDbTab('users')}
          className="cyber-btn-outline"
          style={{
            borderColor: activeDbTab === 'users' ? 'var(--cyber-blue)' : 'var(--border-color)',
            color: activeDbTab === 'users' ? 'var(--cyber-blue)' : 'var(--text-secondary)',
            background: activeDbTab === 'users' ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
            padding: '10px 20px',
            fontSize: '0.9rem'
          }}
        >
          📂 Collection: users ({users.length} records)
        </button>
        <button
          onClick={() => setActiveDbTab('logs')}
          className="cyber-btn-outline"
          style={{
            borderColor: activeDbTab === 'logs' ? 'var(--cyber-blue)' : 'var(--border-color)',
            color: activeDbTab === 'logs' ? 'var(--cyber-blue)' : 'var(--text-secondary)',
            background: activeDbTab === 'logs' ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
            padding: '10px 20px',
            fontSize: '0.9rem'
          }}
        >
          📂 Collection: security_logs ({securityLogs.length} records)
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="glass-panel" style={{ padding: '0px' }}>
        {activeDbTab === 'users' ? (
          <div>
            <div className="panel-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="panel-title">
                <Database size={18} style={{ color: 'var(--cyber-blue)' }} />
                <span>Collection: users</span>
              </div>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="cyber-btn"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Plus size={16} />
                Insert New Profile
              </button>
            </div>

            {/* Add User Form Drawer */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', borderBottom: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.3)' }}
                >
                  <form onSubmit={handleAddUserSubmit} style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="cyber-input" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Alex Jones"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="cyber-input" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="alex@linkedin.com"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="text" 
                        className="cyber-input" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="9876543210"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <select 
                        className="cyber-input" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="Germany">Germany</option>
                        <option value="Canada">Canada</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>
                    <button type="submit" className="cyber-btn" style={{ height: '45px', padding: '0 24px' }}>
                      Execute INSERT
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Users Table */}
            <div className="panel-content" style={{ padding: '0px' }}>
              <div className="db-table-container">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>_id (MongoDB Primary Key)</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ObjectId("{user.id.slice(-8)}")
                        </td>
                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{user.phone}</td>
                        <td>{user.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="panel-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="panel-title">
                <Database size={18} style={{ color: 'var(--cyber-blue)' }} />
                <span>Collection: security_logs</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                WAF Threat Event Logs
              </span>
            </div>

            {/* Logs Table */}
            <div className="panel-content" style={{ padding: '0px' }}>
              {securityLogs.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Info size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <div>No security threat logs found. Running normal traffic baseline.</div>
                </div>
              ) : (
                <div className="db-table-container">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Attack Type</th>
                        <th>Source IP</th>
                        <th>Requests Rate</th>
                        <th>Location</th>
                        <th>Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {securityLogs.map(log => (
                        <tr key={log.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{log.time}</td>
                          <td style={{ fontWeight: 600, color: 'var(--cyber-blue)' }}>{log.type}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyber-red)' }}>{log.source}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{log.requests.toLocaleString()}/min</td>
                          <td>{log.location}</td>
                          <td>{getRiskBadge(log.risk)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
