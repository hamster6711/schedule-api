import { Router } from "express";
import { ScheduleHandler } from "../handler/scheduleHandler";
import { TaskHandler } from "../handler/taskHandler";
import { prismaClient } from "../services/prismaClient";
import { API_ROOT_PATH } from "../constants";

export const router = Router();

const rootPath : string = API_ROOT_PATH;
const apiHandlerRegister = [
    new ScheduleHandler(prismaClient),
    new TaskHandler(prismaClient),
]

for (const apiHandler of apiHandlerRegister){
    const fullPath: string = `${rootPath}${apiHandler.path}`;
    router.post(fullPath, (req, res) => { apiHandler.post(req, res) });
    router.get(fullPath, (req, res) => { apiHandler.get(req, res) });
    router.put(fullPath, (req, res) => { apiHandler.put(req, res) });
    router.delete(fullPath, (req, res) => { apiHandler.delete(req, res) });
}
