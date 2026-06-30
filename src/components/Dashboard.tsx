import React, { useEffect, useRef } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { NetworkVisualizer } from './NetworkVisualizer';
import { 
  Activity, ShieldAlert, AlertOctagon, CheckCircle2, Shield, Eye, ShieldX, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { 
    stats, activeAttack, systemStatus, mitigationStatus, 
    aiAnalysisConsole, alertPopup, attackerIp
  } = useSecurity();

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console terminal to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiAnalysisConsole]);

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'var(--cyber-green)';
    if (score < 70) return 'var(--cyber-orange)';
    return 'var(--cyber-red)';
  };

  const getRiskScoreGlow = (score: number) => {
    if (score < 30) return 'var(--glow-green)';
    if (score < 70) return 'var(--glow-orange)';
    return 'var(--glow-red)';
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'HEALTHY': return 'System Healthy';
      case 'WARNING': return 'Anomaly Detected';
      case 'COMPROMISED': return 'Threat Active - High Risk';
      case 'MITIGATING': return 'Auto Response Engaged';
      case 'SECURED': return 'Threat Neutralized';
      default: return 'Monitoring';
    }
  };

  return (
    <div className="page-padding">
      {/* Alert Overlay (Framer Motion popup) */}
      <AnimatePresence>
        {alertPopup && alertPopup.show && (
          <div className="alert-overlay">
            <motion.div 
              className="alert-dialog"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className="alert-dialog-header">
                <AlertOctagon className="blink" size={24} />
                <span>{alertPopup.title}</span>
              </div>
              <div className="alert-dialog-body">
                <div className="blink" style={{ color: 'var(--cyber-red)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                  INCOMING ATTACK DETECTED
                </div>
                <p className="alert-dialog-desc" style={{ color: 'var(--text-secondary)' }}>
                  Analyzing traffic payloads and tracking IP origins...
                </p>
                <div className="alert-progress-bar-bg">
                  <div 
                    className="alert-progress-bar-fill"
                    style={{ width: `${alertPopup.progress}%` }}
                  />
                </div>
                <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--cyber-orange)' }}>
                  Pattern Analysis Progress: {alertPopup.progress}%
                </div>
                
                {alertPopup.progress >= 100 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      marginTop: '12px',
                      padding: '12px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      width: '100%'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Identified: <span style={{ color: 'var(--cyber-red)' }}>{activeAttack} Attack</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Severity: <span style={{ color: 'var(--cyber-red)', fontWeight: 'bold' }}>CRITICAL</span> &nbsp;|&nbsp; Confidence: <span style={{ color: 'var(--cyber-orange)', fontWeight: 'bold' }}>
                        {activeAttack === 'Data Scraping' ? '94%' : activeAttack === 'Brute Force' ? '98%' : '99%'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tab Header Section */}
      <div className="tab-header-container">
        <div>
          <h1 className="tab-header-title">LinkedIn Shield SOC</h1>
          <p className="tab-header-desc">Active protection, packet telemetry logs, and automated incident response dashboard.</p>
        </div>
        <div className={`system-status-indicator status-${systemStatus}`}>
          <div className="blink" style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: systemStatus === 'HEALTHY' || systemStatus === 'SECURED' ? 'var(--cyber-green)' : systemStatus === 'WARNING' ? 'var(--cyber-orange)' : 'var(--cyber-red)'
          }}></div>
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* Live Visual Traffic Network Panel */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="panel-header">
          <div className="panel-title" style={{ color: activeAttack ? 'var(--cyber-red)' : 'var(--cyber-blue)' }}>
            <Activity size={18} className={activeAttack ? 'blink' : ''} />
            <span>Real-time Traffic flow analyzer</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {activeAttack ? 'ATTACK PROTOCOL DETECTED' : 'SECURE CONNECTION TELEMETRY'}
          </span>
        </div>
        <div style={{ padding: '16px' }}>
          <NetworkVisualizer />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="dashboard-grid">
        <div className="glass-panel metric-card">
          <div className="metric-card-header">
            <span>Total Requests Monitored</span>
            <Activity className="metric-icon" size={16} />
          </div>
          <div className="metric-value">{stats.totalRequests.toLocaleString()}</div>
          <div className="metric-footer">Simulated cumulative HTTP hits</div>
        </div>

        <div className={`glass-panel metric-card ${activeAttack ? 'active-scraping' : ''}`}>
          <div className="metric-card-header">
            <span>Traffic Speed Rate</span>
            <Activity 
              className="metric-icon" 
              size={16} 
              style={{ color: activeAttack ? 'var(--cyber-red)' : 'var(--cyber-green)' }} 
            />
          </div>
          <div 
            className="metric-value" 
            style={{ color: activeAttack ? 'var(--cyber-red)' : 'var(--text-primary)' }}
          >
            {stats.requestsPerMin}
            <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>req/min</span>
          </div>
          <div className="metric-footer">
            {activeAttack ? 'Spike exceeds threshold (1000/m)' : 'Baseline: ~100 req/min'}
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-card-header">
            <span>Security Risk Index</span>
            <Shield className="metric-icon" size={16} />
          </div>
          <div 
            className="metric-value"
            style={{ 
              color: getRiskScoreColor(stats.riskScore),
              textShadow: getRiskScoreGlow(stats.riskScore)
            }}
          >
            {stats.riskScore}%
          </div>
          <div className="metric-footer">Current computed threat index</div>
        </div>

        <div className="glass-panel metric-card">
          <div className="metric-card-header">
            <span>Threats & Interceptions</span>
            <ShieldAlert className="metric-icon" size={16} />
          </div>
          <div className="metric-value" style={{ color: stats.threatsCount > 0 ? 'var(--cyber-red)' : 'var(--text-primary)' }}>
            {stats.threatsCount}
          </div>
          <div className="metric-footer">Blocked attack incidents in session</div>
        </div>
      </div>

      {/* Lower Row: AI Terminal + Response System */}
      <div className="dashboard-row">
        {/* AI Terminal */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div className="panel-title" style={{ color: 'var(--cyber-blue)' }}>
              <Terminal size={18} />
              <span>AI Threat Detector & Rules Engine Console</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SHIELD_AI v4.12
            </span>
          </div>
          <div className="panel-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="ai-terminal">
              {aiAnalysisConsole.map((line, index) => (
                <div 
                  key={index} 
                  className="ai-terminal-line"
                  style={{
                    color: line.includes('⚠️') || line.includes('threat') || line.includes('ATTACK')
                      ? 'var(--cyber-red)' 
                      : line.includes('✔') || line.includes('Complete') || line.includes('SHIELD STABLE')
                      ? 'var(--cyber-green)'
                      : line.includes('🤖 [RULES ENGINE]') || line.includes('AI Identification')
                      ? 'var(--cyber-blue)'
                      : 'var(--text-secondary)'
                  }}
                >
                  {line}
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          </div>
        </div>

        {/* Incident Response Checklist */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <CheckCircle2 size={18} style={{ color: 'var(--cyber-green)' }} />
              <span>Automated Incident Response System</span>
            </div>
            {systemStatus === 'MITIGATING' && (
              <span className="blink" style={{ color: 'var(--cyber-blue)', fontSize: '0.75rem', fontWeight: 600 }}>
                MITIGATION PIPELINE ENGAGED
              </span>
            )}
          </div>
          <div className="panel-content">
            <div className="mitigation-checklist">
              {/* Step 1: IP Blocked */}
              <div className={`checklist-item ${systemStatus === 'MITIGATING' && !mitigationStatus.ipBlocked ? 'active' : ''} ${mitigationStatus.ipBlocked ? 'completed' : ''}`}>
                <div className="checklist-label">
                  <ShieldX size={18} style={{ color: mitigationStatus.ipBlocked ? 'var(--cyber-red)' : 'var(--text-muted)' }} />
                  <span>Block Attacker IP ({attackerIp || 'Germany/Tor'})</span>
                </div>
                <div className={`checklist-status ${mitigationStatus.ipBlocked ? 'done' : systemStatus === 'MITIGATING' ? 'running' : 'pending'}`}>
                  {mitigationStatus.ipBlocked ? '✔ Blocked' : systemStatus === 'MITIGATING' ? 'Enforcing...' : 'Pending'}
                </div>
              </div>

              {/* Step 2: DB Protected */}
              <div className={`checklist-item ${systemStatus === 'MITIGATING' && mitigationStatus.ipBlocked && !mitigationStatus.dbProtected ? 'active' : ''} ${mitigationStatus.dbProtected ? 'completed' : ''}`}>
                <div className="checklist-label">
                  <Shield size={18} style={{ color: mitigationStatus.dbProtected ? 'var(--cyber-green)' : 'var(--text-muted)' }} />
                  <span>Isolate & Secure Users Database</span>
                </div>
                <div className={`checklist-status ${mitigationStatus.dbProtected ? 'done' : systemStatus === 'MITIGATING' && mitigationStatus.ipBlocked ? 'running' : 'pending'}`}>
                  {mitigationStatus.dbProtected ? '✔ Isolated' : systemStatus === 'MITIGATING' && mitigationStatus.ipBlocked ? 'Protecting...' : 'Pending'}
                </div>
              </div>

              {/* Step 3: SOC Team Escalated */}
              <div className={`checklist-item ${systemStatus === 'MITIGATING' && mitigationStatus.dbProtected && !mitigationStatus.teamNotified ? 'active' : ''} ${mitigationStatus.teamNotified ? 'completed' : ''}`}>
                <div className="checklist-label">
                  <Eye size={18} style={{ color: mitigationStatus.teamNotified ? 'var(--cyber-orange)' : 'var(--text-muted)' }} />
                  <span>Notify SOC Duty Security Team</span>
                </div>
                <div className={`checklist-status ${mitigationStatus.teamNotified ? 'done' : systemStatus === 'MITIGATING' && mitigationStatus.dbProtected ? 'running' : 'pending'}`}>
                  {mitigationStatus.teamNotified ? '✔ Notified' : systemStatus === 'MITIGATING' && mitigationStatus.dbProtected ? 'Dispatching...' : 'Pending'}
                </div>
              </div>

              {/* Step 4: Affected Users Notified */}
              <div className={`checklist-item ${systemStatus === 'MITIGATING' && mitigationStatus.teamNotified && !mitigationStatus.usersNotified ? 'active' : ''} ${mitigationStatus.usersNotified ? 'completed' : ''}`}>
                <div className="checklist-label">
                  <CheckCircle2 size={18} style={{ color: mitigationStatus.usersNotified ? 'var(--cyber-green)' : 'var(--text-muted)' }} />
                  <span>Notify Users of Suspicious Activity</span>
                </div>
                <div className={`checklist-status ${mitigationStatus.usersNotified ? 'done' : systemStatus === 'MITIGATING' && mitigationStatus.teamNotified ? 'running' : 'pending'}`}>
                  {mitigationStatus.usersNotified ? '✔ Dispatched' : systemStatus === 'MITIGATING' && mitigationStatus.teamNotified ? 'Notifying...' : 'Pending'}
                </div>
              </div>

              {/* Step 5: Incident Logged */}
              <div className={`checklist-item ${systemStatus === 'MITIGATING' && mitigationStatus.usersNotified && !mitigationStatus.incidentLogged ? 'active' : ''} ${mitigationStatus.incidentLogged ? 'completed' : ''}`}>
                <div className="checklist-label">
                  <Terminal size={18} style={{ color: mitigationStatus.incidentLogged ? 'var(--cyber-blue)' : 'var(--text-muted)' }} />
                  <span>Write Log to MongoDB security_logs</span>
                </div>
                <div className={`checklist-status ${mitigationStatus.incidentLogged ? 'done' : systemStatus === 'MITIGATING' && mitigationStatus.usersNotified ? 'running' : 'pending'}`}>
                  {mitigationStatus.incidentLogged ? '✔ Logged' : systemStatus === 'MITIGATING' && mitigationStatus.usersNotified ? 'Saving logs...' : 'Pending'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
