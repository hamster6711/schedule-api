## README

### Set up of DB for running prisma
1. If there is no existing DB server, follow the [prisma postgres set up guide](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database#setting-up-postgresql-on-macos) to create a local postgres DB server. Alternatively, you could also choose to use an online DB like AWS RDS instead.

2. Once DB is set up, replace the `DATANBASE_URL` in .env file folloing format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`

3. Run the following command to create a mapping between prisma model and database:

```
npx prisma migrate dev --name init
```

This will generate new files under prisma/migrations folder (folder will be created if not exists).

Note: if later on the prisma schema is updated, you can also run the following command to update the prisma client:
```
prisma generate
```

### Run the project
Before running the project, plaese follow the [Set up of DB for running prisma](#set-up-of-db-for-running-prisma) to setup prisma first.

**Build and Run the application**
```
npm start
```


### Test the project
#### Health check
To test whether the endpoints are responding, we could use PostMan to run a quick test. Below are all the available endpoints for this project:
```
POST http://localhost/api/v1/schedules
GET http://localhost/api/v1/schedules
PUT http://localhost/api/v1/schedules
DELETE http://localhost/api/v1/schedules

POST http://localhost/api/v1/tasks
GET http://localhost/api/v1/tasks
PUT http://localhost/api/v1/tasks
DELETE http://localhost/api/v1/tasks
```


#### Unit test
TODO