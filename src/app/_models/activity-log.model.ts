export interface ActivityLog {
  id: number;
  userId: number;
  userEmail: string;
  userRole: string;
  userName: string;
  actionType: string;
  actionDetails: string;
  timestamp: string;
  
}
export interface ActivityLogsResponse {
  success?: boolean;
  data?: ActivityLog[];
}

export default ActivityLog;