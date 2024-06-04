/** API model for schedule */
interface ScheduleRequest {
    id: string,
    accountId: number,
    agentId: number,
    startTime: string,
    endTime: string
}