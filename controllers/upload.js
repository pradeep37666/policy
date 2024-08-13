import path from "path";
import { Worker } from 'worker_threads';
 import os from 'os'

export const handleUploadfile = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const numCPUs = os.cpus().length;
  console.log(numCPUs,"numCPUs");
  
  console.log(req.file);
  const filePath = path.join(
    process.cwd(),
    `${req.file.destination}${req.file.filename}`
  );
  const fileType = req.file.mimetype;

  console.log(filePath, fileType);

  const fileProcessorWorker = new Worker(`${process.cwd()}/utilities/workerthread.js`,{
    workerData: { filePath, fileType },
  });
  
  const databaseWorker = new Worker(`${process.cwd()}/utilities/databaseThread.js`);

  fileProcessorWorker.on('message', (data) => {  
    databaseWorker.postMessage(data);
  });
  
  databaseWorker.on('message', (message) => {
    console.log(message);
    res.status(201).json(message)
  });
  
  fileProcessorWorker.on('error', (error) => {
    console.error('File Processor Worker error:', error);
  });
  
  databaseWorker.on('error', (error) => {
    console.error('Database Worker error:', error);
  });
  
  fileProcessorWorker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`File Processor Worker stopped with exit code ${code}`);
    }
  });
  
  databaseWorker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Database Worker stopped with exit code ${code}`);
    }})

};


