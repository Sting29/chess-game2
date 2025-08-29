// Session types
export interface UserSession {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  location: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  isCurrent: boolean;
}
