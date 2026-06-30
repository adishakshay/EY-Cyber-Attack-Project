import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { ThreatType } from '../types/security';
import { Zap, Play, Square, Info, ShieldAlert, RotateCcw } from 'lucide-react';


export const AttackSimulator: React.FC = () => {
  const { activeAttack, startAttack, stopAttack, resetSimulation, threatDetails } = useSecurity();
  const [selectedType, setSelectedType] = useState<ThreatType>('Data Scraping');

  const attackDetails = {
    'Data Scraping': {
      ip: '185.220.101.4',
      location: 'Germany (Tor Node)',
      target: 'GET /api/users',
      rate: '5,000 requests / min',
      vector: 'Automated Crawler Bot',
      description: 'Generates fake crawler requests in rapid succession to target user database tables. Aims to compile and exfiltrate member profile records. Exceeds standard human traffic bounds (100 req/min).',
      rules: 'IF request_count > 1000/min THEN flag High Anomaly; IF pattern = repeated GET /api/users THEN classify Data Scraping.'
    },
    'Brute Force': {
      ip: '45.143.203.12',
      location: 'Russia (Proxy Host)',
      target: 'POST /api/auth/login',
      rate: '1,200 requests / min',
      vector: 'Credential Stuffing Botnet',
      description: 'Simulates rapid failed login attempts using common dictionary passwords. Designed to hijack admin and user accounts. Exceeds standard authentication failure thresholds.',
      rules: 'IF auth_failure_count > 5/min from same IP THEN flag Alert; IF request = POST /api/auth/login THEN classify Brute Force.'
    },
    'Suspicious API': {
      ip: '203.0.113.88',
      location: 'Unknown Location',
      target: 'GET /api/users/search?q=...',
      rate: '250 requests / min',
      vector: 'SQL Injection Payload',
      description: 'Injects malicious SQL query tags (e.g. \x27 OR 1=1 --) into user search parameters to trick the database and bypass authentication checkups.',
      rules: 'IF request_params MATCHES sql_injection_regex (e.g., OR 1=1) THEN flag Critical Threat immediately; classify Malicious Payload.'
    }
  };

  const activeDetails = attackDetails[selectedType];

  const handleToggleAttack = () => {
    if (activeAttack) {
      stopAttack();
    } else {
      startAttack(selectedType);
    }
  };

  return (
    <div className="page-padding">
      {/* Header */}
      <div className="tab-header-container">
        <div>
          <h1 className="tab-header-title">Cyber Attack Simulator</h1>
          <p className="tab-header-desc">Test threat detection WAF rule sets and execute automated mitigation playbooks.</p>
        </div>
        <button 
          onClick={resetSimulation} 
          className="cyber-btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RotateCcw size={14} />
          Reset SOC Engine
        </button>
      </div>

      <div className="simulator-layout">
        {/* Left Column: Selector Cards */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div className="panel-title" style={{ color: 'var(--cyber-blue)' }}>
              <Zap size={18} />
              <span>Select Threat Profile</span>
            </div>
          </div>
          <div className="panel-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="attack-cards-grid">
              {(Object.keys(attackDetails) as ThreatType[]).map(type => {
                const isSelected = selectedType === type;
                const isCurrentAttack = activeAttack === type;
                return (
                  <div
                    key={type}
                    className={`attack-card glass-panel ${isSelected ? 'selected' : ''} ${isCurrentAttack ? 'pulse-red-border selected danger' : ''}`}
                    onClick={() => !activeAttack && setSelectedType(type)}
                    style={{ opacity: activeAttack && !isCurrentAttack ? 0.5 : 1, cursor: activeAttack ? 'not-allowed' : 'pointer' }}
                  >
                    <div className="attack-card-header">
                      <span className="attack-card-title">
                        {type === 'Suspicious API' ? 'Suspicious API (SQLi)' : type}
                      </span>
                      {isCurrentAttack && (
                        <span className="badge badge-critical blink">ACTIVE ATTACK</span>
                      )}
                    </div>
                    <p className="attack-card-description">
                      {attackDetails[type].vector} from {threatDetails[type].ip}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Launch trigger button */}
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <button
                onClick={handleToggleAttack}
                className={`cyber-btn ${activeAttack ? 'cyber-btn-danger' : ''}`}
                style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}
              >
                {activeAttack ? (
                  <>
                    <Square size={20} />
                    HALT ATTACK SIMULATION
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    START {selectedType.toUpperCase()} ATTACK
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Parameters and Technical Data */}
        <div className="glass-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Info size={18} style={{ color: 'var(--cyber-blue)' }} />
              <span>Vector Specifications</span>
            </div>
          </div>
          <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>{selectedType} Details</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {activeDetails.description}
              </p>
            </div>

            <div className="sim-info-grid">
              <div>
                <div className="sim-info-label">Attacker Source IP</div>
                <div className="sim-info-value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyber-red)' }}>
                  {threatDetails[selectedType].ip}
                </div>
              </div>
              <div>
                <div className="sim-info-label">Geo-Origin Location</div>
                <div className="sim-info-value">{threatDetails[selectedType].location}</div>
              </div>
              <div>
                <div className="sim-info-label">Target Route</div>
                <div className="sim-info-value" style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyber-blue)' }}>
                  {activeDetails.target}
                </div>
              </div>
              <div>
                <div className="sim-info-label">Simulated Query Speed</div>
                <div className="sim-info-value">{activeDetails.rate}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
                <ShieldAlert size={16} style={{ color: 'var(--cyber-orange)' }} />
                <span>Detection Rule Set</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', lineHeight: '1.5' }}>
                {activeDetails.rules}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
