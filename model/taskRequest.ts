/** API model for task */
interface TaskRequest {
    id: string,
    accountId: number,
    scheduleId: number,
    startTime: string,
    duration: string,
    type: string,
}