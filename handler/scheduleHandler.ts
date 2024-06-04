import { Request, Response } from "express";
import { BaseApiPrismaHandler } from "./baseApiHandler";
import { SCHEDULE_ROOT_PATH } from "../constants";

/**
 * API handler to perform CRUD operations on Schedules
 */
export class ScheduleHandler extends BaseApiPrismaHandler{
    path: string = SCHEDULE_ROOT_PATH;

    /** 
    override async post(req: Request, res: Response): Promise<void> {}
    override async get(req: Request, res: Response): Promise<void> {}
    override async put(req: Request, res: Response): Promise<void> {}
    override async delete(req: Request, res: Response): Promise<void> {}
    */
}