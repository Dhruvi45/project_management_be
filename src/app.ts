import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from "./router/user";
import { projectRouter } from "./router/project";
import { taskRouter } from "./router/task";


require("./dbConnection")

const app = express();


app.use(bodyParser.json());
app.use(express.json());
app.use(cors())

app.use(userRouter)
app.use(projectRouter)
app.use(taskRouter)

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

export {app}
