import express,{Router} from "express";
import * as dbConnect from "./db/db-connect"

const router: Router = express.Router();
const app = express();
const port = 1338;
dbConnect.handleConnection();
app.use(express.json());
app.get("/", (req, res) => {
  res.send('Hello World!')
});
//routing section
app.use("/api/login", require("./controller/loginController"));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
