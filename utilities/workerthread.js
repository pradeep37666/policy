import csvtojson from "csvtojson";
import fs from "fs";
import { parentPort, workerData } from "worker_threads";
import pkg from "xlsx";

const { readFile, utils } = pkg;

const processFile = async ({ filePath, fileType }) => {
  try {
    let jsonData = [];

    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      jsonData = utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (fileType === "text/csv") {
      jsonData = await csvtojson().fromFile(filePath);
    } else {
      throw new Error("Unsupported file type.");
    }

    parentPort.postMessage(
      JSON.stringify(jsonData)
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          console.error("The file does not exist");
        } else {
          console.error(err.message);
        }
      } else {
        console.log("The file was deleted");
      }
    });
  } catch (error) {
    parentPort.postMessage(`Error processing file: ${error.message}`);
  }
};

if (workerData) {
  processFile(workerData);
}

export default processFile;
