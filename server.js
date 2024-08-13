import express from "express";
import cors from "cors";
import dbConnection from "./models/conn.js";
import UploadRoute from './routes/upload.js'
import PolicyInfo from './routes/policyinfo.js'
import './utilities/cpuMonitor.js'


const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnection();

app.use('/api',UploadRoute)
app.use('/api',PolicyInfo)

app.listen(port, () => {
  console.log("server is running at " + port);
});
