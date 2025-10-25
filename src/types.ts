export type ThreatLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
export type ActionTaken = 'Allowed' | 'Monitored' | 'Blocked';
export type ViewType = 'dashboard' | 'traffic' | 'adaptive-defense' | 'ip-analyzer' | 'target' | 'attacker' | 'threat-model';
export type TargetLoginStatus = 'Logged Out' | 'Logged In' | 'Login Bypassed!';
export type SecurityLevel = 'Low' | 'Medium' | 'High';


export interface GeoLocation {
  lat: number;
  lon: number;
}

export interface RequestLog {
  id: string;
  timestamp: Date;
  ip: string;
  country: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  status: number;
  threatLevel: ThreatLevel;
  threatType: string | null;
  action: ActionTaken;
  payload?: string;
  location: GeoLocation;
  asn: string;
  userAgent: string;
}

export interface ThreatStats {
  totalRequests: number;
  threatsDetected: number;
  threatsBlocked: number;
  uptime: string;
  adaptiveRules: number;
}

export interface ThreatAnalysisResult {
  threatType: string;
  severity: string;
  explanation: string;
  suggestedRule: string;
}

export interface PayloadGeneratorResult {
  payload: string;
  attackType: string;
  description: string;
}

export interface IPReputationResult {
  ip: string;
  riskScore: number; // 0-100
  country: string;
  isp: string;
  knownThreats: string[];
  summary: string;
}

export interface AdaptiveRule {
    id: string;
    timestamp: Date;
    threatType: string;
    description: string;
    sourcePayload: string;
    status: 'Active' | 'Monitoring';
}