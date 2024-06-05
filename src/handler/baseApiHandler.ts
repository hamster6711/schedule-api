import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

/**
 *  Basic API handler that performs CRUD operations
 */
export abstract class BaseApiHandler {
  abstract path: string;

  post(req: Request, res: Response) {
    res.status(400).send({ msg: "Bad request: invalid path." });
  }
  get(req: Request, res: Response) {
    res.status(400).send({ msg: "Bad request: invalid path." });
  }
  put(req: Request, res: Response) {
    res.status(400).send({ msg: "Bad request: invalid path." });
  }
  delete(req: Request, res: Response) {
    res.status(400).send({ msg: "Bad request: invalid path." });
  }
}

/**
 *  Basic CRUD API handler that connects to DB using prisma client.
 */
export abstract class BaseApiPrismaHandler extends BaseApiHandler {
  constructor(protected prismaClient: PrismaClient) {
    super();
  }
}
