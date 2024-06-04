import { TASK_ROOT_PATH } from "../constants";
import { BaseApiPrismaHandler } from "./baseApiHandler";
import { Request, Response } from "express";

/**
 * API handler to perform CRUD operations on Tasks
 */
export class TaskHandler extends BaseApiPrismaHandler{
    path: string = TASK_ROOT_PATH;

    /** 
    override async post(req: Request, res: Response): Promise<void> {}
    override async get(req: Request, res: Response): Promise<void> {}
    override async put(req: Request, res: Response): Promise<void> {}
    override async delete(req: Request, res: Response): Promise<void> {}
    */
}