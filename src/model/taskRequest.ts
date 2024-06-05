import { TaskType } from "@prisma/client";

/** API model for task */
export interface TaskRequest {
  id: string;
  accountId: number;
  scheduleId: string;
  startTime: Date;
  duration: number;
  type: TaskType;
}
