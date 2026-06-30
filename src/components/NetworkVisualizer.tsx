import React, { useEffect, useState, useRef } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Server, Database, ShieldAlert, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  type: 'normal' | 'attack';
  yOffset: number;
  speed: number;
}

export const NetworkVisualizer: React.FC = () => {
  const { activeAttack, systemStatus, attackerIp, mitigationStatus } = useSecurity();
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);
  
  const isAttackActive = activeAttack !== null;
  const isIPBlocked = mitigationStatus.ipBlocked;

  // Spawning logic
  useEffect(() => {
    const spawnRate = isAttackActive 
      ? (activeAttack === 'Data Scraping' ? 60 : 150) // More intense for scraping
      : 800; // slow trickle for normal

    const interval = setInterval(() => {
      // Don't spawn normal traffic if system is under heavy attack, and don't spawn if IP blocked completely
      if (isIPBlocked && isAttackActive) {
        // Spawn attack particles but they will get blocked at the shield
      }

      const newParticle: Particle = {
        id: particleIdCounter.current++,
        type: isAttackActive ? 'attack' : 'normal',
        yOffset: Math.floor(Math.random() * 40) - 20, // random offset up/down
        speed: isAttackActive ? 1.0 + Math.random() * 0.5 : 1.8 + Math.random() * 0.4
      };

      setParticles(prev => [...prev, newParticle].slice(-100)); // cap at 100 particles in state
    }, spawnRate);

    return () => clearInterval(interval);
  }, [isAttackActive, activeAttack, isIPBlocked]);

  // Clean up particles that have finished animating
  useEffect(() => {
    const cleanup = setInterval(() => {
      // Clean up after 2.5 seconds
      setParticles(prev => prev.filter(p => Date.now() - p.id > 3000));
    }, 2000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="network-canvas-container">
      {/* Node connections lines */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          right: '10%',
          height: '2px',
          background: isAttackActive && !isIPBlocked 
            ? 'linear-gradient(90deg, var(--cyber-red) 0%, var(--border-color) 100%)' 
            : 'var(--border-color)',
          transform: 'translateY(-50%)',
          zIndex: 1,
          opacity: 0.4
        }}
      />

      {/* Spawning Particles */}
      <AnimatePresence>
        {particles.map(p => {
          const startX = '10%';
          // If IP is blocked, attack particles stop at 45% (the Firewall Shield)
          const isBlockedParticle = isIPBlocked && p.type === 'attack';
          const endX = isBlockedParticle ? '45%' : '90%';
          
          return (
            <motion.div
              key={p.id}
              style={{
                position: 'absolute',
                width: p.type === 'attack' ? '8px' : '6px',
                height: p.type === 'attack' ? '8px' : '6px',
                borderRadius: '50%',
                background: p.type === 'attack' ? 'var(--cyber-red)' : 'var(--cyber-green)',
                boxShadow: p.type === 'attack' ? '0 0 10px var(--cyber-red)' : '0 0 8px var(--cyber-green)',
                top: `calc(50% + ${p.yOffset}px)`,
                zIndex: 2
              }}
              initial={{ left: startX, opacity: 1 }}
              animate={{ 
                left: endX,
                opacity: isBlockedParticle ? [1, 1, 0] : [1, 1, 1],
                scale: isBlockedParticle ? [1, 1.8, 0] : 1
              }}
              transition={{ 
                duration: p.speed, 
                ease: 'linear' 
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* NODE 1: Attacker / Clients (Left) */}
      <div className="network-node" style={{ left: '8%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className={`node-icon-wrapper ${isAttackActive ? 'attacker' : 'active'}`}>
          {isAttackActive ? (
            <ShieldAlert size={22} className="glow-text-red blink" />
          ) : (
            <User size={22} className="glow-text-blue" />
          )}
        </div>
        <span className="node-label">
          {isAttackActive ? 'Attacker IP' : 'Normal Clients'}
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {isAttackActive ? attackerIp : 'IP: 157.45.*.*'}
        </span>
      </div>

      {/* NODE 2: Firewall Shield (Center) */}
      <div className="network-node" style={{ left: '45%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className={`node-icon-wrapper ${isIPBlocked ? 'shield-active' : ''}`}>
          {isIPBlocked ? (
            <ShieldCheck size={22} className="glow-text-green" />
          ) : (
            <ShieldAlert size={22} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
        <span className="node-label">Firewall WAF</span>
        <span style={{ fontSize: '0.65rem', color: isIPBlocked ? 'var(--cyber-green)' : 'var(--text-muted)' }}>
          {isIPBlocked ? 'IP SHUNNED' : 'MONITORING'}
        </span>

        {/* Visual Firewall Barrier Wall */}
        <AnimatePresence>
          {isIPBlocked && (
            <motion.div
              style={{
                position: 'absolute',
                top: '-50px',
                bottom: '-50px',
                width: '6px',
                background: 'linear-gradient(180deg, transparent 0%, var(--cyber-green) 50%, transparent 100%)',
                boxShadow: '0 0 15px var(--cyber-green)',
                borderRadius: '3px',
                zIndex: -1
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* NODE 3: LinkedIn Application Server (Right-ish) */}
      <div className="network-node" style={{ left: '72%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className={`node-icon-wrapper ${systemStatus === 'COMPROMISED' ? 'attacker' : 'active'}`}>
          <Server 
            size={22} 
            className={
              systemStatus === 'COMPROMISED' 
                ? 'glow-text-red blink' 
                : systemStatus === 'SECURED' 
                ? 'glow-text-green' 
                : 'glow-text-blue'
            } 
          />
        </div>
        <span className="node-label">LinkedIn App</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          /api/users
        </span>
      </div>

      {/* NODE 4: Database (Far Right) */}
      <div className="network-node" style={{ left: '90%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className={`node-icon-wrapper ${systemStatus === 'COMPROMISED' ? 'attacker' : 'active'}`}>
          <Database 
            size={22} 
            className={
              systemStatus === 'COMPROMISED' 
                ? 'glow-text-red blink' 
                : systemStatus === 'SECURED' 
                ? 'glow-text-green' 
                : 'glow-text-blue'
            } 
          />
        </div>
        <span className="node-label">MongoDB</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          {mitigationStatus.dbProtected ? 'ISOLATED' : 'users col'}
        </span>
      </div>
    </div>
  );
};
