import "jasmine";
import { ScheduleHandler } from "../../src/handler/scheduleHandler";
import { describe } from "node:test";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

describe("Unit test for ScheduleHandler", () => {
  const mockPrismaScheduleDelegate =
    jasmine.createSpyObj<Prisma.ScheduleDelegate>("ScheduleDelegate", [
      "createMany",
      "findMany",
      "update",
      "delete",
    ]);
  const mockPrismaClient = { schedule: mockPrismaScheduleDelegate } as any;
  const scheduleHandler = new ScheduleHandler(mockPrismaClient);
  const mockRes = jasmine.createSpyObj<Response>("Response", [
    "status",
    "send",
  ]);

  beforeEach(() => {
    mockPrismaScheduleDelegate.createMany.calls.reset();
    mockPrismaScheduleDelegate.findMany.calls.reset();
    mockPrismaScheduleDelegate.update.calls.reset();
    mockPrismaScheduleDelegate.delete.calls.reset();

    mockRes.status.calls.reset();
    mockRes.send.calls.reset();
    mockRes.status.and.returnValue({ send: mockRes.send } as any);
  });

  it("create schedule with one schedule including all fields success", async () => {
    const request = [
      {
        accountId: 1234,
        agentId: 2222,
        startTime: "2023-03-03",
        endTime: "2023-03-04",
      },
    ];
    const data = [
      {
        accountId: 1234,
        agentId: 2222,
        startTime: new Date("2023-03-03"),
        endTime: new Date("2023-03-04"),
      },
    ];

    await scheduleHandler.post(
      { body: { schedules: request } } as Request,
      mockRes
    );

    expect(mockPrismaScheduleDelegate.createMany).toHaveBeenCalledOnceWith({
      data,
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("create schedule with one schedule including one field success", async () => {
    const request = [
      {
        accountId: 1234,
      },
    ];
    const data = [
      {
        accountId: 1234,
      },
    ];

    await scheduleHandler.post(
      { body: { schedules: request } } as Request,
      mockRes
    );

    expect(mockPrismaScheduleDelegate.createMany).toHaveBeenCalledOnceWith({
      data,
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("create schedule with multiple schedules success", async () => {
    const request = [
      {
        accountId: 1234,
        agentId: 2222,
        startTime: "2023-03-03",
        endTime: "2023-03-04",
      },
      {
        accountId: 2345,
        endTime: "2023-03-04",
      },
    ];
    const data = [
      {
        accountId: 1234,
        agentId: 2222,
        startTime: new Date("2023-03-03"),
        endTime: new Date("2023-03-04"),
      },
      {
        accountId: 2345,
        endTime: new Date("2023-03-04"),
      },
    ];

    await scheduleHandler.post(
      { body: { schedules: request } } as Request,
      mockRes
    );

    expect(mockPrismaScheduleDelegate.createMany).toHaveBeenCalledOnceWith({
      data,
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("get schedule without id success", async () => {
    const data = [
      {
        id: "2ace1bcd-3cb1-4435-a17e-8893688406ae",
        accountId: 2345,
        agentId: 67890,
        startTime: "2023-04-09T00:00:00.000Z",
        endTime: "2023-04-12T00:00:00.000Z",
        tasks: [],
      },
      {
        id: "44ea7b23-ccd2-44ec-8f62-319a248bf1fa",
        accountId: 12222,
        agentId: 67890,
        startTime: "2024-06-04T23:28:45.787Z",
        endTime: "2023-12-30T00:00:00.000Z",
        tasks: [],
      },
    ];
    mockPrismaScheduleDelegate.findMany.and.returnValue(
      Promise.resolve(data) as any
    );
    await scheduleHandler.get({ query: {} } as Request, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ msg: data });
    expect(mockPrismaScheduleDelegate.findMany).toHaveBeenCalledTimes(1);
  });

  it("get schedule with valid id success", async () => {
    const data = [
      {
        id: "2ace1bcd-3cb1-4435-a17e-8893688406ae",
        accountId: 2345,
        agentId: 67890,
        startTime: "2023-04-09T00:00:00.000Z",
        endTime: "2023-04-12T00:00:00.000Z",
        tasks: [],
      },
    ];
    mockPrismaScheduleDelegate.findMany.and.returnValue(
      Promise.resolve(data) as any
    );

    await scheduleHandler.get(
      { query: { id: "2ace1bcd-3cb1-4435-a17e-8893688406ae" } } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ msg: data });
    expect(mockPrismaScheduleDelegate.findMany).toHaveBeenCalledTimes(1);
  });

  it("get schedule with invalid id success", async () => {
    const invalidScheduleId = "2ace1bcd";
    await scheduleHandler.get(
      { query: { id: invalidScheduleId } } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockPrismaScheduleDelegate.findMany).toHaveBeenCalledTimes(1);
  });

  it("update schedule with valid id success", async () => {
    const validScheduleId = "2ace1bcd-3cb1-4435-a17e-8893688406ae";
    const request = {
      schedules: {
        accountId: 1234,
        agentId: 2222,
        startTime: "2023-03-03",
        endTime: "2023-03-04",
      },
    };
    const data = {
      accountId: 1234,
      agentId: 2222,
      startTime: new Date("2023-03-03"),
      endTime: new Date("2023-03-04"),
    };

    await scheduleHandler.put(
      { params: { key: validScheduleId }, body: request } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockPrismaScheduleDelegate.update).toHaveBeenCalledOnceWith({
      data,
      where: { id: validScheduleId },
    });
  });

  it("update schedule without id fail", async () => {
    const request = {
      schedules: {
        accountId: 1234,
        agentId: 2222,
        startTime: "2023-03-03",
        endTime: "2023-03-04",
      },
    };

    await scheduleHandler.put({ params: {}, body: request } as any, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockPrismaScheduleDelegate.update).toHaveBeenCalledTimes(0);
  });

  it("update schedule with invalid id fail", async () => {
    const invalidScheduleId = "2ace1bcd";
    const request = {
      schedules: {
        accountId: 1234,
        agentId: 2222,
        startTime: "2023-03-03",
        endTime: "2023-03-04",
      },
    };

    mockPrismaScheduleDelegate.update.and.throwError(
      new Prisma.PrismaClientKnownRequestError("fakePrismaError", {
        code: "404",
        clientVersion: "0.0.0",
      })
    );
    await scheduleHandler.put(
      { params: { key: invalidScheduleId }, body: request } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockPrismaScheduleDelegate.update).toHaveBeenCalledTimes(1);
    mockPrismaScheduleDelegate.update.and.stub();
  });

  it("delete schedule with valid id success", async () => {
    const validScheduleId = "2ace1bcd-3cb1-4435-a17e-8893688406ae";
    await scheduleHandler.delete(
      { params: { key: validScheduleId } } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockPrismaScheduleDelegate.delete).toHaveBeenCalledOnceWith({
      where: { id: validScheduleId },
    });
  });

  it("delete schedule without id fail", async () => {
    await scheduleHandler.delete({ params: {} } as any, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockPrismaScheduleDelegate.update).toHaveBeenCalledTimes(0);
  });

  it("delete schedule with invalid id fail", async () => {
    const invalidScheduleId = "2ace1bcd";
    mockPrismaScheduleDelegate.delete.and.throwError(
      new Prisma.PrismaClientKnownRequestError("fakePrismaError", {
        code: "404",
        clientVersion: "0.0.0",
      })
    );
    await scheduleHandler.delete(
      { params: { key: invalidScheduleId } } as any,
      mockRes
    );

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockPrismaScheduleDelegate.delete).toHaveBeenCalledTimes(1);
    mockPrismaScheduleDelegate.delete.and.stub();
  });
});
