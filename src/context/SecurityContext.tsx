import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, SecurityLog, Incident, TimelineEvent, SystemStats, ThreatType, RiskLevel } from '../types/security';

interface SecurityContextType {
  users: User[];
  securityLogs: SecurityLog[];
  incidents: Incident[];
  timelineEvents: TimelineEvent[];
  stats: SystemStats;
  activeAttack: ThreatType | null;
  attackerIp: string | null;
  attackerLocation: string | null;
  threatDetails: Record<ThreatType, { ip: string; location: string }>;
  systemStatus: 'HEALTHY' | 'WARNING' | 'COMPROMISED' | 'MITIGATING' | 'SECURED';
  mitigationStatus: {
    ipBlocked: boolean;
    dbProtected: boolean;
    teamNotified: boolean;
    usersNotified: boolean;
    incidentLogged: boolean;
  };
  aiAnalysisConsole: string[];
  alertPopup: {
    show: boolean;
    title: string;
    description: string;
    severity: RiskLevel;
    progress: number;
  } | null;
  loginAdmin: () => boolean;
  logoutAdmin: () => void;
  isLoggedIn: boolean;
  startAttack: (type: ThreatType) => void;
  stopAttack: () => void;
  triggerMitigation: () => void;
  resetSimulation: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const playThreatAlarm = (type: ThreatType) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const duration = 6.0; // Play alarm for 6 seconds
    const startTime = ctx.currentTime;
    
    if (type === 'Data Scraping') {
      // Rapid automated bot crawling chirps (sawtooth frequency sweeps)
      for (let time = 0; time < duration; time += 0.3) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, startTime + time);
        osc.frequency.exponentialRampToValueAtTime(1400, startTime + time + 0.2);
        
        gainNode.gain.setValueAtTime(0.0, startTime + time);
        gainNode.gain.linearRampToValueAtTime(0.12, startTime + time + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + time + 0.25);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(startTime + time);
        osc.stop(startTime + time + 0.25);
      }
    } else if (type === 'Brute Force') {
      // Heavy pounding industrial klaxon siren (triangle wave with volume gating)
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, startTime);
      
      // Siren frequency modulation sweep
      for (let time = 0.4; time < duration; time += 0.4) {
        const targetFreq = (Math.floor(time * 2.5) % 2 === 0) ? 240 : 480;
        osc.frequency.linearRampToValueAtTime(targetFreq, startTime + time);
      }
      
      // Hammering/pulsing volume gate
      gainNode.gain.setValueAtTime(0.0, startTime);
      for (let time = 0; time < duration; time += 0.4) {
        gainNode.gain.linearRampToValueAtTime(0.20, startTime + time + 0.05);
        gainNode.gain.setValueAtTime(0.20, startTime + time + 0.25);
        gainNode.gain.linearRampToValueAtTime(0.001, startTime + time + 0.35);
      }
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    } else {
      // Discordant digital anomaly invasion warble (detuned square waves with tremolo)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'square';
      osc2.type = 'square';
      
      osc1.detune.setValueAtTime(-12, startTime);
      osc2.detune.setValueAtTime(12, startTime);
      
      // Fast alternating frequency pitch
      for (let time = 0; time < duration; time += 0.2) {
        const freq = (Math.floor(time * 5) % 2 === 0) ? 880 : 680;
        osc1.frequency.setValueAtTime(freq, startTime + time);
        osc2.frequency.setValueAtTime(freq + 6, startTime + time);
      }
      
      // Tremolo gain oscillation
      gainNode.gain.setValueAtTime(0.08, startTime);
      for (let time = 0.2; time < duration; time += 0.4) {
        gainNode.gain.linearRampToValueAtTime(0.01, startTime + time);
        gainNode.gain.linearRampToValueAtTime(0.12, startTime + time + 0.2);
      }
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start(startTime);
      osc2.start(startTime);
      
      osc1.stop(startTime + duration);
      osc2.stop(startTime + duration);
    }
  } catch (e) {
    console.warn('AudioContext warning sound failed to play:', e);
  }
};

const getRandomAttackerDetails = (type: ThreatType) => {
  const ips = {
    'Data Scraping': [
      '185.220.101.4', '185.220.101.9', '109.202.107.5', '195.176.3.22', '82.102.23.44'
    ],
    'Brute Force': [
      '45.143.203.12', '45.143.203.99', '185.156.74.52', '91.242.229.35', '77.247.110.12'
    ],
    'Suspicious API': [
      '203.0.113.88', '203.0.113.150', '198.51.100.42', '192.0.2.75', '45.89.230.12'
    ]
  };

  const locations = {
    'Data Scraping': ['Germany (Tor Node)', 'Netherlands (Tor Entry)', 'Sweden (Privacy VPS)', 'Switzerland (Secure VPN)', 'Iceland (VPS Node)'],
    'Brute Force': ['Russia (Proxy Host)', 'China (Shenzhen Server)', 'Romania (Bulletproof Host)', 'Iran (Proxy Network)', 'Vietnam (Botnet Relay)'],
    'Suspicious API': ['Unknown Location (Malicious IP)', 'Moldova (Zombie Host)', 'Ukraine (Server Pool)', 'Brazil (Infected Cloud)', 'India (Compromised Server)']
  };

  const list = ips[type];
  const locList = locations[type];
  const idx = Math.floor(Math.random() * list.length);
  return {
    ip: list[idx],
    location: locList[idx]
  };
};

const MOCK_FIRST_NAMES = ['Alex', 'Sarah', 'Bruce', 'Priya', 'John', 'Yuki', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Aarav', 'Emma', 'Daniel', 'Sophia', 'Olivia', 'Liam', 'Noah', 'Mia', 'Arjun', 'Rohan', 'Neha', 'Kabir', 'Ananya', 'Rahul', 'Tanvi', 'Vikram', 'Divya'];
const MOCK_LAST_NAMES = ['Connor', 'Wayne', 'Sharma', 'Doe', 'Sato', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Joshi', 'Mehta', 'Rao', 'Nair'];
const MOCK_LOCATIONS = ['India', 'USA', 'Germany', 'Canada', 'Japan', 'Singapore', 'Australia', 'UK', 'France', 'Netherlands'];

const generateMockUsers = (count: number): User[] => {
  const list: User[] = [];
  
  // 1. Maintain core user from step 1
  list.push({
    id: 'usr_1',
    name: 'Alex',
    email: 'alex@gmail.com',
    phone: '9876543210',
    location: 'India'
  });

  // 2. Generate remaining users programmatically
  for (let i = 2; i <= count; i++) {
    const first = MOCK_FIRST_NAMES[Math.floor(Math.random() * MOCK_FIRST_NAMES.length)];
    const last = MOCK_LAST_NAMES[Math.floor(Math.random() * MOCK_LAST_NAMES.length)];
    const name = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}_${i}@gmail.com`;
    const phone = Math.floor(6000000000 + Math.random() * 4000000000).toString(); // realistic phone prefix
    const location = MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)];
    
    list.push({
      id: `usr_${i}`,
      name,
      email,
      phone,
      location
    });
  }
  return list;
};

const INITIAL_USERS: User[] = generateMockUsers(150);

const INITIAL_LOGS: SecurityLog[] = [
  {
    id: 'log_0',
    type: 'Suspicious API', // just placeholder
    source: '192.168.1.100',
    requests: 1,
    location: 'Local Network',
    risk: 'Low',
    time: '09:15 AM',
    timestamp: Date.now() - 3600000 * 2,
    details: 'Authorized Administrator Login succeeded for admin@linkedin.com.'
  },
  {
    id: 'log_p1',
    type: 'Suspicious API',
    source: '127.0.0.1',
    requests: 3,
    location: 'localhost',
    risk: 'Low',
    time: '09:45 AM',
    timestamp: Date.now() - 3600000,
    details: 'Routine integrity scan: SSL certificate validated. Database query speeds optimal.'
  }
];

const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'time_0',
    time: '09:00 AM',
    title: 'Security Shield Initialized',
    description: 'Core firewall rulesets loaded. AI anomaly detection engine online.',
    type: 'success'
  },
  {
    id: 'time_1',
    time: '09:15 AM',
    title: 'Admin Session Opened',
    description: 'Security dashboard login from authorized workspace IP 192.168.1.100.',
    type: 'info'
  }
];

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(INITIAL_LOGS.filter(l => l.risk !== 'Low')); // only store actual alerts or show all
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeAttack, setActiveAttack] = useState<ThreatType | null>(null);
  const [attackerIp, setAttackerIp] = useState<string | null>(null);
  const [attackerLocation, setAttackerLocation] = useState<string | null>(null);
  const [threatDetails, setThreatDetails] = useState<Record<ThreatType, { ip: string; location: string }>>({
    'Data Scraping': { ip: '185.220.101.4', location: 'Germany (Tor Node)' },
    'Brute Force': { ip: '45.143.203.12', location: 'Russia (Proxy Host)' },
    'Suspicious API': { ip: '203.0.113.88', location: 'Unknown Location' }
  });
  const [systemStatus, setSystemStatus] = useState<'HEALTHY' | 'WARNING' | 'COMPROMISED' | 'MITIGATING' | 'SECURED'>('HEALTHY');
  
  const [mitigationStatus, setMitigationStatus] = useState({
    ipBlocked: false,
    dbProtected: false,
    teamNotified: false,
    usersNotified: false,
    incidentLogged: false
  });

  const [aiAnalysisConsole, setAiAnalysisConsole] = useState<string[]>([
    '🤖 AI Threat Detection Engine standing by...',
    '📊 Analyzing traffic baseline (100 req/min)... OK',
    '🔒 User session integrity: 100%'
  ]);

  const [alertPopup, setAlertPopup] = useState<SecurityContextType['alertPopup']>(null);

  const [stats, setStats] = useState<SystemStats>({
    totalRequests: 1420,
    requestsPerMin: 98,
    threatsCount: 0,
    riskScore: 20,
    activeInvestigations: 0,
    blockedIpsCount: 0
  });

  const trafficTimer = useRef<any>(null);
  const requestCounter = useRef<number>(1420);
  const stateRef = useRef({ systemStatus, activeAttack, attackerIp, attackerLocation });
  stateRef.current = { systemStatus, activeAttack, attackerIp, attackerLocation };

  // Generate background traffic
  useEffect(() => {
    trafficTimer.current = setInterval(() => {
      setStats(prev => {
        const isAttacking = activeAttack !== null;
        let rate = prev.requestsPerMin;
        
        if (isAttacking) {
          if (activeAttack === 'Data Scraping') {
            rate = Math.min(rate + 450, 5200); // Surge to 5000+
          } else if (activeAttack === 'Brute Force') {
            rate = Math.min(rate + 120, 1100); // Surge to 1000+
          } else if (activeAttack === 'Suspicious API') {
            rate = Math.min(rate + 15, 240); // Moderate rate, but malicious payloads
          }
        } else {
          // Return to normal
          if (systemStatus === 'SECURED') {
            rate = Math.max(rate - 300, 0); // Drop rapidly to 0 then normal
            if (rate === 0) rate = 95;
          } else {
            // Normal fluctuation
            rate = 90 + Math.floor(Math.random() * 20);
          }
        }

        requestCounter.current += Math.ceil(rate / 60);
        return {
          ...prev,
          requestsPerMin: rate,
          totalRequests: requestCounter.current
        };
      });
    }, 1000);

    return () => {
      if (trafficTimer.current) clearInterval(trafficTimer.current);
    };
  }, [activeAttack, systemStatus]);

  // Login handler
  const loginAdmin = () => {
    setIsLoggedIn(true);
    return true;
  };

  const logoutAdmin = () => {
    setIsLoggedIn(false);
  };

  // Add User manually
  const addUser = (newUser: Omit<User, 'id'>) => {
    const id = `usr_${Date.now()}`;
    setUsers(prev => [...prev, { ...newUser, id }]);
  };

  // Log in AI terminal
  const logToAi = (msg: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAiAnalysisConsole(prev => [...prev, `[${timeStr}] ${msg}`]);
  };

  // Trigger mitigation process step-by-step
  const triggerMitigation = () => {
    const { systemStatus: currentSystemStatus, activeAttack: currentActiveAttack, attackerIp: currentAttackerIp, attackerLocation: currentAttackerLocation } = stateRef.current;
    
    if (currentSystemStatus !== 'COMPROMISED') return;

    setSystemStatus('MITIGATING');
    logToAi('🛠️ INITIATING AUTOMATED THREAT MITIGATION...');
    
    // Step 1: Block IP (1s)
    setTimeout(() => {
      setMitigationStatus(prev => ({ ...prev, ipBlocked: true }));
      setStats(prev => ({ ...prev, blockedIpsCount: prev.blockedIpsCount + 1 }));
      logToAi(`🚫 firewall: Blocked source IP ${currentAttackerIp}. Traffic drop initiated.`);
      setTimelineEvents(prev => [...prev, {
        id: `time_block_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Attacker IP Blocked',
        description: `Firewall blocked IP address ${currentAttackerIp}. Connection reset by peer.`,
        type: 'success'
      }]);
    }, 1000);

    // Step 2: Database Protected (2.2s)
    setTimeout(() => {
      setMitigationStatus(prev => ({ ...prev, dbProtected: true }));
      logToAi('🔒 DATABASE: Isolated users collection. Read limit policies applied.');
      setTimelineEvents(prev => [...prev, {
        id: `time_db_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Database Protected',
        description: 'Read operations rate-limited on critical collections. Data integrity intact.',
        type: 'success'
      }]);
    }, 2200);

    // Step 3: Security Team Notified (3.4s)
    setTimeout(() => {
      setMitigationStatus(prev => ({ ...prev, teamNotified: true }));
      logToAi('📞 NOTIFICATION: Alert dispatched to SOC On-call Security Team via PagerDuty.');
      setTimelineEvents(prev => [...prev, {
        id: `time_team_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Security Team Notified',
        description: 'SOC escalation complete. Incident log dispatched to team.',
        type: 'info'
      }]);
    }, 3400);

    // Step 4: Users Notified (4.6s)
    setTimeout(() => {
      setMitigationStatus(prev => ({ ...prev, usersNotified: true }));
      logToAi('✉️ NOTIFICATION: Batch email alerts sent to users regarding suspicious session activity.');
      setTimelineEvents(prev => [...prev, {
        id: `time_user_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Users Protected & Notified',
        description: 'Automatic session expirations triggered for security. Users informed.',
        type: 'success'
      }]);
    }, 4600);

    // Step 5: Incident Logged & Completed (5.8s)
    setTimeout(() => {
      setMitigationStatus(prev => ({ ...prev, incidentLogged: true }));
      
      const incidentId = `inc_${Date.now().toString().slice(-6)}`;
      const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newSecurityLog: SecurityLog = {
        id: `log_${Date.now()}`,
        type: currentActiveAttack || 'Data Scraping',
        source: currentAttackerIp || '185.220.101.4',
        requests: currentActiveAttack === 'Data Scraping' ? 5000 : currentActiveAttack === 'Brute Force' ? 1200 : 250,
        location: currentAttackerLocation || 'Unknown',
        risk: 'Critical',
        time: logTime,
        timestamp: Date.now(),
        details: `Simulated attack [${currentActiveAttack}] from ${currentAttackerIp} successfully mitigated. Automatic IP shunning and database locks applied.`
      };

      const newIncident: Incident = {
        id: incidentId,
        type: currentActiveAttack || 'Data Scraping',
        severity: 'Critical',
        status: 'Blocked',
        detectedAt: logTime,
        details: `Automated detection of abnormal traffic rates matching ${currentActiveAttack} signature. Source IP blocked permanently.`,
        attackerIp: currentAttackerIp || '185.220.101.4'
      };

      setSecurityLogs(prev => [newSecurityLog, ...prev]);
      setIncidents(prev => [newIncident, ...prev]);

      setSystemStatus('SECURED');
      setActiveAttack(null);
      
      // Randomize the IP of the attacker for the NEXT attack of this type
      const newDetails = getRandomAttackerDetails(currentActiveAttack || 'Data Scraping');
      setThreatDetails(prev => ({
        ...prev,
        [currentActiveAttack || 'Data Scraping']: newDetails
      }));
      setAttackerIp(newDetails.ip);
      setAttackerLocation(newDetails.location);
      
      setStats(prev => ({
        ...prev,
        threatsCount: prev.threatsCount + 1,
        activeInvestigations: 0,
        riskScore: 25 // Slightly elevated but secured
      }));

      logToAi('🏁 MITIGATION COMPLETE. SYSTEM SHIELD STABLE.');
      
      setTimelineEvents(prev => [...prev, {
        id: `time_complete_${Date.now()}`,
        time: logTime,
        title: 'Incident Logged',
        description: `Full post-mortem saved to security_logs. ID: ${incidentId}. Status: SECURED.`,
        type: 'success'
      }]);
    }, 5800);
  };

  // Run the attack simulator pipeline
  const startAttack = (type: ThreatType) => {
    if (activeAttack) return; // already running

    // Reset mitigation state
    setMitigationStatus({
      ipBlocked: false,
      dbProtected: false,
      teamNotified: false,
      usersNotified: false,
      incidentLogged: false
    });

    setActiveAttack(type);
    setSystemStatus('WARNING');
    
    // Set Attacker Details from dynamic threatDetails state
    const details = threatDetails[type];
    const ip = details.ip;
    const loc = details.location;
    setAttackerIp(ip);
    setAttackerLocation(loc);

    // Initial alert console log
    logToAi(`⚠️ WARNING: Network anomaly detected from IP ${ip} (${loc}).`);
    logToAi(`📡 Monitoring API endpoints for payload inspection...`);

    // Timeline Update: Attack starts
    setTimelineEvents(prev => [...prev, {
      id: `time_start_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `${type} Attack Initialized`,
      description: `Unusual traffic spike detected targeting LinkedIn backend from source IP ${ip}.`,
      type: 'warning'
    }]);

    // Play warning sound after 3 seconds
    setTimeout(() => {
      playThreatAlarm(type);
    }, 3000);

    // Stage 1: Load Pattern Analysis Animation (3.5 seconds in)
    setTimeout(() => {
      setSystemStatus('COMPROMISED');
      setStats(prev => ({
        ...prev,
        riskScore: 92,
        activeInvestigations: 1
      }));

      // Trigger Framer Motion popup alert
      setAlertPopup({
        show: true,
        title: '⚠ Security Alert',
        description: 'Analyzing pattern...',
        severity: 'Critical',
        progress: 10
      });

      // Animate progress of analysis
      let p = 10;
      const progressTimer = setInterval(() => {
        p += 20;
        setAlertPopup(prev => prev ? { ...prev, progress: Math.min(p, 100) } : null);
        if (p >= 100) {
          clearInterval(progressTimer);
          // Threat Identified
          setAlertPopup(prev => prev ? {
            ...prev,
            description: `Threat Identified: ${type} Attack`,
            progress: 100
          } : null);

          // Log AI decision rules
          logToAi(`🤖 [RULES ENGINE] MATCH FOUND for pattern [${type}]:`);
          if (type === 'Data Scraping') {
            logToAi(`   - Rate threshold > 1000 req/min (Current: 5000+ req/min)`);
            logToAi(`   - Target: GET /api/users`);
            logToAi(`   - AI Identification: Bot Scraping Activity (Confidence: 94%)`);
          } else if (type === 'Brute Force') {
            logToAi(`   - Login failure rate > 5/min (Current: 85 failures/min)`);
            logToAi(`   - Target: POST /api/auth/login`);
            logToAi(`   - AI Identification: Credential Stuffing (Confidence: 98%)`);
          } else {
            logToAi(`   - Malicious payload detected: SQL Injection signature matched`);
            logToAi(`   - Target: GET /api/users/search`);
            logToAi(`   - AI Identification: Malicious Payload Injection (Confidence: 99%)`);
          }
          logToAi(`🤖 Recommended action: Block IP immediately and notify team.`);

          // Add timeline entry
          setTimelineEvents(prev => [...prev, {
            id: `time_detect_${Date.now()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: `${type === 'Data Scraping' ? 'Automated Scraping' : type} Identified`,
            description: `AI Engine matching complete. Bot fingerprinting verified. Confidence level: ${type === 'Data Scraping' ? '94%' : type === 'Brute Force' ? '98%' : '99%'}.`,
            type: 'alert'
          }]);

          // Close popup after 3 seconds and trigger AutoResponse!
          setTimeout(() => {
            setAlertPopup(null);
            // AUTO RESPONSE KICKS IN!
            triggerMitigation();
          }, 3000);
        }
      }, 500);

    }, 3500);
  };

  const stopAttack = () => {
    setActiveAttack(null);
    setSystemStatus('HEALTHY');
    setAttackerIp(null);
    setAttackerLocation(null);
    setAlertPopup(null);
    setStats(prev => ({
      ...prev,
      riskScore: 20,
      activeInvestigations: 0,
      requestsPerMin: 98
    }));
    logToAi('ℹ️ Attack simulation stopped manually. Restored normal operations.');
  };

  const resetSimulation = () => {
    setUsers(INITIAL_USERS);
    setSecurityLogs(INITIAL_LOGS.filter(l => l.risk !== 'Low'));
    setIncidents([]);
    setTimelineEvents(INITIAL_TIMELINE);
    setActiveAttack(null);
    setAttackerIp(null);
    setAttackerLocation(null);
    setThreatDetails({
      'Data Scraping': { ip: '185.220.101.4', location: 'Germany (Tor Node)' },
      'Brute Force': { ip: '45.143.203.12', location: 'Russia (Proxy Host)' },
      'Suspicious API': { ip: '203.0.113.88', location: 'Unknown Location' }
    });
    setSystemStatus('HEALTHY');
    setStats({
      totalRequests: 1420,
      requestsPerMin: 98,
      threatsCount: 0,
      riskScore: 20,
      activeInvestigations: 0,
      blockedIpsCount: 0
    });
    setMitigationStatus({
      ipBlocked: false,
      dbProtected: false,
      teamNotified: false,
      usersNotified: false,
      incidentLogged: false
    });
    setAiAnalysisConsole([
      '🤖 AI Threat Detection Engine standing by...',
      '📊 Analyzing traffic baseline (100 req/min)... OK',
      '🔒 User session integrity: 100%'
    ]);
    setAlertPopup(null);
    requestCounter.current = 1420;
    logToAi('🔄 Simulation variables reset to baseline.');
  };

  return (
    <SecurityContext.Provider value={{
      users,
      securityLogs,
      incidents,
      timelineEvents,
      stats,
      activeAttack,
      attackerIp,
      attackerLocation,
      threatDetails,
      systemStatus,
      mitigationStatus,
      aiAnalysisConsole,
      alertPopup,
      loginAdmin,
      logoutAdmin,
      isLoggedIn,
      startAttack,
      stopAttack,
      triggerMitigation,
      resetSimulation,
      addUser
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
