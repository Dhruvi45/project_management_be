import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from "./router/user";
import { projectRouter } from "./router/project";
import { taskRouter } from "./router/task";
import { roleRouter } from "./router/role";
import { getCorsAllowedOrigins } from "./config";


require("./dbConnection")
// require("./addRole.ts")



const app = express();


app.use(bodyParser.json());
app.use(express.json());
console.log('getCorsAllowedOrigins()', getCorsAllowedOrigins())
app.use(cors({ origin:getCorsAllowedOrigins()}))

app.use(userRouter)
app.use(projectRouter)
app.use(taskRouter)
app.use(roleRouter)

app.get('/', (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  res.send('Hello, World!');
});

export default app;
