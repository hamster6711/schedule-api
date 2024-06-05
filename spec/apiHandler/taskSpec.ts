import "jasmine";
import { TaskHandler } from "../../src/handler/taskHandler";
import { describe } from "node:test";
import { Prisma, TaskType } from "@prisma/client";
import { Request, Response } from "express";

describe("Unit test for TaskHandler", () => {
  const mockPrismaTaskDelegate = jasmine.createSpyObj<Prisma.TaskDelegate>(
    "TaskDelegate",
    ["createMany", "findMany", "update", "delete"]
  );
  const mockPrismaClient = { task: mockPrismaTaskDelegate } as any;
  const taskHandler = new TaskHandler(mockPrismaClient);
  const mockRes = jasmine.createSpyObj<Response>("Response", [
    "status",
    "send",
  ]);

  beforeEach(() => {
    mockPrismaTaskDelegate.createMany.calls.reset();
    mockPrismaTaskDelegate.findMany.calls.reset();
    mockPrismaTaskDelegate.update.calls.reset();
    mockPrismaTaskDelegate.delete.calls.reset();

    mockRes.status.calls.reset();
    mockRes.send.calls.reset();
    mockRes.status.and.returnValue({ send: mockRes.send } as any);
  });

  it("create task with one task including all fields success", async () => {
    const request = {
      tasks: [
        {
          accountId: 333,
          scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
          startTime: "2023-04-09",
          duration: 2,
          type: "work",
        },
      ],
    };

    const data = [
      {
        accountId: 333,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
        startTime: new Date("2023-04-09"),
        duration: 2,
        type: TaskType.work,
      },
    ];

    await taskHandler.post({ body: request } as Request, mockRes);

    expect(mockPrismaTaskDelegate.createMany).toHaveBeenCalledOnceWith({
      data,
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("create task with one task including one field success", async () => {
    const request = {
      tasks: [
        {
          accountId: 333,
          scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
          type: "work",
        },
      ],
    };

    const data = [
      {
        accountId: 333,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",

        type: TaskType.work,
      },
    ];

    await taskHandler.post({ body: request } as Request, mockRes);

    expect(mockPrismaTaskDelegate.createMany).toHaveBeenCalledOnceWith({
      data,
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("create task with multiple tasks success", async () => {
    const request = {
      tasks: [
        {
          accountId: 333,
          scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
          type: "work",
        },
        {
          accountId: 444,
          scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
          type: "work",
        },
      ],
    };

    const data = [
      {
        accountId: 333,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
        type: TaskType.work,
      },
      {
        accountId: 444,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
        type: TaskType.work,
      },
    ];

    await taskHandler.post({ body: request } as Request, mockRes);

    expect(mockPrismaTaskDelegate.createMany).toHaveBeenCalledOnceWith({
      data,
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("get task without id success", async () => {
    const data = [
      {
        id: "d807db0b-9f7b-4219-9ab3-b2d57d4f620e",
        accountId: 6666,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
        startTime: "2011-02-09T00:00:00.000Z",
        duration: 2,
        type: "work",
      },
      {
        id: "31d11dfa-acaf-48bb-b2b6-db7f5a37f95d",
        accountId: 333,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
        startTime: "2023-04-09T00:00:00.000Z",
        duration: 2,
        type: "work",
      },
    ];
    mockPrismaTaskDelegate.findMany.and.returnValue(
      Promise.resolve(data) as any
    );
    await taskHandler.get({ query: {} } as Request, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ msg: data });
    expect(mockPrismaTaskDelegate.findMany).toHaveBeenCalledTimes(1);
  });

  it("get task with valid id success", async () => {
    const data = [
      {
        id: "d807db0b-9f7b-4219-9ab3-b2d57d4f620e",
        accountId: 6666,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
        startTime: "2011-02-09T00:00:00.000Z",
        duration: 2,
        type: "work",
      },
    ];
    mockPrismaTaskDelegate.findMany.and.returnValue(
      Promise.resolve(data) as any
    );

    await taskHandler.get(
      { query: { id: "d807db0b-9f7b-4219-9ab3-b2d57d4f620e" } } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ msg: data });
    expect(mockPrismaTaskDelegate.findMany).toHaveBeenCalledTimes(1);
  });

  it("get task with invalid id success", async () => {
    const invalidTaskId = "2ace1bcd";
    await taskHandler.get({ query: { id: invalidTaskId } } as any, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockPrismaTaskDelegate.findMany).toHaveBeenCalledTimes(1);
  });

  it("update task with valid id success", async () => {
    const validTaskId = "2ace1bcd-3cb1-4435-a17e-8893688406ae";
    const request = {
      tasks: {
        accountId: 333,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
      },
    };
    const data = {
      accountId: 333,
      scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
    };

    await taskHandler.put(
      { params: { key: validTaskId }, body: request } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockPrismaTaskDelegate.update).toHaveBeenCalledOnceWith({
      data,
      where: { id: validTaskId },
    });
  });

  it("update task without id fail", async () => {
    const request = {
      tasks: {
        accountId: 333,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
      },
    };

    await taskHandler.put({ params: {}, body: request } as any, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockPrismaTaskDelegate.update).toHaveBeenCalledTimes(0);
  });

  it("update task with invalid id fail", async () => {
    const invalidTaskId = "2ace1bcd";
    const request = {
      tasks: {
        accountId: 333,
        scheduleId: "08fc6f60-03b6-44a9-9277-5bd228ebb6dc",
      },
    };

    mockPrismaTaskDelegate.update.and.throwError(
      new Prisma.PrismaClientKnownRequestError("fakePrismaError", {
        code: "404",
        clientVersion: "0.0.0",
      })
    );
    await taskHandler.put(
      { params: { key: invalidTaskId }, body: request } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockPrismaTaskDelegate.update).toHaveBeenCalledTimes(1);
    mockPrismaTaskDelegate.update.and.stub();
  });

  it("delete task with valid id success", async () => {
    const validTaskId = "2ace1bcd-3cb1-4435-a17e-8893688406ae";
    await taskHandler.delete(
      { params: { key: validTaskId } } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockPrismaTaskDelegate.delete).toHaveBeenCalledOnceWith({
      where: { id: validTaskId },
    });
  });

  it("delete task without id fail", async () => {
    await taskHandler.delete({ params: {} } as any, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockPrismaTaskDelegate.update).toHaveBeenCalledTimes(0);
  });

  it("delete task with invalid id fail", async () => {
    const invalidTaskId = "2ace1bcd";
    mockPrismaTaskDelegate.delete.and.throwError(
      new Prisma.PrismaClientKnownRequestError("fakePrismaError", {
        code: "404",
        clientVersion: "0.0.0",
      })
    );
    await taskHandler.delete(
      { params: { key: invalidTaskId } } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockPrismaTaskDelegate.delete).toHaveBeenCalledTimes(1);
    mockPrismaTaskDelegate.delete.and.stub();
  });
});
