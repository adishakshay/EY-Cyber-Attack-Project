import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { AlertCircle, AlertTriangle, ShieldCheck, Info, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const Timeline: React.FC = () => {
  const { timelineEvents } = useSecurity();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info size={12} className="glow-text-blue" style={{ color: 'var(--cyber-blue)' }} />;
      case 'warning':
        return <AlertTriangle size={12} className="glow-text-orange" style={{ color: 'var(--cyber-orange)' }} />;
      case 'alert':
        return <AlertCircle size={12} className="glow-text-red blink" style={{ color: 'var(--cyber-red)' }} />;
      case 'success':
        return <ShieldCheck size={12} className="glow-text-green" style={{ color: 'var(--cyber-green)' }} />;
      default:
        return <FileText size={12} />;
    }
  };

  return (
    <div className="page-padding">
      {/* Header */}
      <div className="tab-header-container">
        <div>
          <h1 className="tab-header-title">Incident Audit Timeline</h1>
          <p className="tab-header-desc">Chronological logs of system health audits, attack detections, and automated mitigations.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {timelineEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Timeline loading...
          </div>
        ) : (
          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            {timelineEvents.map((event) => (
              <motion.div 
                key={event.id} 
                className="timeline-item"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                {/* Glowing status dot */}
                <div className={`timeline-dot ${event.type}`}>
                  {getEventIcon(event.type)}
                </div>
                
                {/* Content card */}
                <div className="timeline-content">
                  <span className="timeline-time">{event.time}</span>
                  <h4 
                    className="timeline-title"
                    style={{
                      color: event.type === 'alert' 
                        ? 'var(--cyber-red)' 
                        : event.type === 'warning' 
                        ? 'var(--cyber-orange)' 
                        : event.type === 'success' 
                        ? 'var(--cyber-green)' 
                        : 'var(--text-primary)'
                    }}
                  >
                    {event.title}
                  </h4>
                  <p className="timeline-desc">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
