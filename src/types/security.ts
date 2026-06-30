export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

export type ThreatType = 'Data Scraping' | 'Brute Force' | 'Suspicious API';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface SecurityLog {
  id: string;
  type: ThreatType;
  source: string;
  requests: number;
  location: string;
  risk: RiskLevel;
  time: string;
  timestamp: number;
  details: string;
}

export interface Incident {
  id: string;
  type: ThreatType;
  severity: RiskLevel;
  status: 'Active' | 'Investigating' | 'Blocked' | 'Mitigated';
  detectedAt: string;
  details: string;
  attackerIp: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}

export interface SystemStats {
  totalRequests: number;
  requestsPerMin: number;
  threatsCount: number;
  riskScore: number;
  activeInvestigations: number;
  blockedIpsCount: number;
}
