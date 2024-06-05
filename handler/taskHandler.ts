import { Prisma } from "@prisma/client";
import { TASK_ROOT_PATH } from "../constants";
import { BaseApiPrismaHandler } from "./baseApiHandler";
import { Request, Response } from "express";
import { TaskRequest } from "../model/taskRequest";

/**
 * API handler to perform CRUD operations on Tasks
 */
export class TaskHandler extends BaseApiPrismaHandler{
    path: string = TASK_ROOT_PATH;

    /**
     * 
     * Validate the Task input for POST, return 400 if: 
     *    - the task details is not provided
     *    - the schedule id or task type is not provided
     * 
     */
    validateTaskRequest(req: Request, res: Response): boolean {
        let tasksRequests: Omit<TaskRequest, "id">[] = req.body.tasks ?? [];

        if (tasksRequests.length == 0){
            res.status(400).send({msg: "Bad Request: no task is provided."});
            return false;
        }
        for (const task of tasksRequests){
            if (!task.scheduleId || !task.type){
                res.status(400).send({msg: "Bad Request: scheduleId and taskType must be provided."});
                return false;
            }
        }
        return true;
    }

    /**
     * 
     * Helper function to transform Task input object to prisma datatype
     * 
     */
    transformTaskRequest(request: Omit<TaskRequest, "id">){
        let payload: Prisma.TaskCreateManyInput = {
            ...request
        }
        if (request.startTime){
            payload = {
                ...payload,
                startTime: new Date(request.startTime),
            }
        }
        return payload;
    }

    /**
     * 
     * Given a list of object representing task details (without id), 
     * create them in DB.
     * 
     */
    override async post(req: Request, res: Response): Promise<void> {
        // input validation
        const inputValidationResult = this.validateTaskRequest(req, res);
        if (!inputValidationResult){return;}

        // input has been sanitized, safe to proceed
        let tasksRequests: Omit<TaskRequest, "id">[] = req.body.tasks;

        // reformat start time to DateTime to obey prisma schema type
        const newTasksList: Prisma.TaskCreateManyInput[] = [];
        for (const task of tasksRequests){
            newTasksList.push(this.transformTaskRequest(task));
        }

        try{
            await this.prismaClient.task.createMany({ data: newTasksList });
            res.status(200).send({msg: "Success"});
        } catch (e: any){
            console.log((e as Error).message);
            res.status(500).send({msg: "Fail to create task."});
        }
    }

    /**
     * 
     * Given a string list of task IDs seperated by comma, return A list of tasks.
     * Include all associated tasks in a nested list.
     * 
     * If no task ID is provided, return all tasks by default.
     * 
     */
    override async get(req: Request, res: Response): Promise<void> {
        try{
            let taskResuls = [];
            if (req.query.id){
                const taskIdList: string[] = (req.query.id as string).split(",");
                taskResuls = await this.prismaClient.task.findMany({
                    where: { id: {in: taskIdList} }
                })
            }
            else { // if no id is supplied, return all tasks
                taskResuls = await this.prismaClient.task.findMany();
            }
            res.status(200).send({msg: taskResuls});
        } catch (e: any){
            res.status(500).send({msg: "Fail to retrive tasks."});
        }
    }

    /**
     * 
     * Given a string of task ID and a payload of new task details,
     * update the task in DB.
     * If task ID does not exists in DB, return 404 error.
     * 
     */
    override async put(req: Request, res: Response): Promise<void> {
        const taskId: string = req.params.key;
        let tasksRequests: Omit<TaskRequest, "id"> = req.body.tasks;

        // input validation
        if (!taskId || !tasksRequests){
            res.status(400).send({msg: "Bad request: no task id or task details provided to perform update."});
            return;
        }
        
        // update or fail
        try{
            await this.prismaClient.task.update({
                where: { id: taskId },
                data: this.transformTaskRequest(tasksRequests)
            })
            res.status(200).send({msg: "Success."});
        } catch (e: any){
            console.log((e as Error).message);
            // catch and handle the case that task id does not exist in db
            if (e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(404).send({msg: "Bad Request: task id does not exist in DB."});
            }
            else{
                res.status(500).send({msg: "Fail to update tasks."});
            }
        }
    }

    /**
     * 
     * Given a string of task ID, delete the corresponding task from DB.
     * If task ID does not exists in DB, return 404 error.
     * 
     */
    override async delete(req: Request, res: Response): Promise<void> {
        const taskId: string = req.params.key;

        // input validation
        if (!taskId){
            res.status(400).send({msg: "Bad request: no task id provided to perform delete."});
            return;
        }

        try{
            await this.prismaClient.task.delete({
                where: { id: taskId }
            })
            res.status(200).send({msg: "Success"});
        } catch (e: any){
            console.log((e as Error).message);
            // catch and handle the case that task id does not exist in db
            if (e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(404).send({msg: "Bad Request: task id does not exist in DB."});
            }
            else{
                res.status(500).send({msg: "Fail to delete tasks."});
            }
        }
    }
}