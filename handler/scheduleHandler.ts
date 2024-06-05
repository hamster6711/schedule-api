import { Request, Response } from "express";
import { BaseApiPrismaHandler } from "./baseApiHandler";
import { SCHEDULE_ROOT_PATH } from "../constants";
import { Prisma } from "@prisma/client";
import { ScheduleRequest } from "../model/scheduleRequest";

/**
 * API handler to perform CRUD operations on Schedules
 */
export class ScheduleHandler extends BaseApiPrismaHandler{
    path: string = SCHEDULE_ROOT_PATH;

    /**
     * 
     * Helper function to transform Schedule input object to prisma datatype
     * 
     */
    transformScheduleRequest(request: Omit<ScheduleRequest, "id">) {
        let payload: Prisma.ScheduleCreateInput = {
            ...request
        }
        if (request.startTime){
            payload = {
                ...payload,
                startTime: new Date(request.startTime),
            }
        }
        if (request.endTime){
            payload = {
                ...payload,
                endTime: new Date(request.endTime),
            }
        }
        return payload;
    }

    /**
     * 
     * Given a list of object representing schedule details (without id), 
     * create them in DB.
     * 
     */
    override async post(req: Request, res: Response): Promise<void> {
        let schedulesRequests : Omit<ScheduleRequest, "id">[] = req.body.schedules ?? [];

        // input validation
        if (schedulesRequests.length == 0){
            res.status(400).send({msg: "Bad Request: no schedule is provided."});
            return;
        }

        const newScheduleList: Prisma.ScheduleCreateInput[] = [];
        // reformat start time and end time in the request 
        // to DateTime to obey prisma schema type
        for (const schedule of schedulesRequests){
            newScheduleList.push(this.transformScheduleRequest(schedule));
        }

        // create schedule or fail
        try{
            await this.prismaClient.schedule.createMany({ data: newScheduleList });
            res.status(200).send({msg: "Success"});
        } catch (e: any){
            console.log((e as Error).message);
            res.status(500).send({msg: "Fail to create shedule."});
        }
    }

    /**
     * 
     * Given a string list of schedule IDs seperated by comma, return A list of schedules.
     * Include all associated tasks in a nested list.
     * 
     * If no schedule ID is provided, return all schedules by default.
     * 
     */
    override async get(req: Request, res: Response): Promise<void> {
        try{
            let scheduleResuls = [];
            if (req.query.id){
                const scheduleIdList: string[] = (req.query.id as string).split(",");
                scheduleResuls = await this.prismaClient.schedule.findMany({
                    where: { id: {in: scheduleIdList} },
                    include: { tasks: true }
                })
            }
            else { // if no id is supplied, return all schedules
                scheduleResuls = await this.prismaClient.schedule.findMany({
                    include: { tasks: true }
                })
            }
            res.status(200).send({msg: scheduleResuls});
        } catch (e: any){
            res.status(500).send({msg: "Fail to retrive schedules."});
        }
    }

    /**
     * 
     * Given a string of schedule ID and a payload of new schedule details,
     * update the schedule in DB.
     * If schedule ID does not exists in DB, return 404 error.
     * 
     */
    override async put(req: Request, res: Response): Promise<void> {
        const scheduleId: string = req.params.key;
        const scheduleRequest: Omit<ScheduleRequest, "id">  =req.body.schedules;

        // input validation
        if (!scheduleId || !scheduleRequest){
            res.status(400).send({msg: "Bad request: no schedule id or schedule details provided to perform update."});
            return;
        }
        
        // update or fail
        try{
            await this.prismaClient.schedule.update({
                where: { id: scheduleId },
                data: this.transformScheduleRequest(scheduleRequest)
            })
            res.status(200).send({msg: "Success."});
        } catch (e: any){
            console.log((e as Error).message);
            // catch and handle the case that schedule id does not exist in db
            if (e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(404).send({msg: "Bad Request: schedule id does not exist in DB."});
            }
            else{
                res.status(500).send({msg: "Fail to update schedules."});
            }
        }
    }

    /**
     * 
     * Given a string of schedule ID, delete the corresponding schedule from DB.
     * If schedule ID does not exists in DB, return 404 error.
     * 
     */
    override async delete(req: Request, res: Response): Promise<void> {
        const scheduleId: string = req.params.key;

        // input validation
        if (!scheduleId){
            res.status(400).send({msg: "Bad request: no schedule id provided to perform delete."});
            return;
        }

        try{
            await this.prismaClient.schedule.delete({
                where: { id: scheduleId }
            })
            res.status(200).send({msg: "Success"});
        } catch (e: any){
            console.log((e as Error).message);
            // catch and handle the case that schedule id does not exist in db
            if (e instanceof Prisma.PrismaClientKnownRequestError){
                res.status(404).send({msg: "Bad Request: schedule id does not exist in DB."});
            }
            else{
                res.status(500).send({msg: "Fail to delete schedules."});
            }
        }
    }
}