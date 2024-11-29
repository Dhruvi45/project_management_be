import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from "./router/user";
import { projectRouter } from "./router/project";
import { taskRouter } from "./router/task";
import { roleRouter } from "./router/role";


require("./dbConnection")

const app = express();


app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin:'https://orange-doodle-qx4j9rjqxxp39x5p-3000.app.github.dev',credentials: true,}))
// const corsOptions = {
//   origin: 'https://orange-doodle-qx4j9rjqxxp39x5p-3000.app.github.dev',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

app.use(userRouter)
app.use(projectRouter)
app.use(taskRouter)
app.use(roleRouter)

app.get('/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send('Hello, World!');
});

export default app;
