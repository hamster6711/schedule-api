/** API model for schedule */
export interface ScheduleRequest {
  id: string;
  accountId: number;
  agentId: number;
  startTime: Date;
  endTime: Date;
}
