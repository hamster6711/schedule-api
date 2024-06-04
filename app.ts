import express from "express";
import { router } from "./router/v1";

const app = express();
const port = 3000;

app.use(express.json);
app.use(router);

app.listen(port, "0.0.0.0", () =>{
    console.log(`App listening on port ${port}`);
})