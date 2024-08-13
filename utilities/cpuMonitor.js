import { cpus } from 'os';
import { cpuUsage as _cpuUsage, hrtime } from 'process';
import { exec } from 'child_process';

const USAGE_THRESHOLD = 70;
const CHECK_INTERVAL_MS = 1000; 
const PM2_PROCESS_NAME = 'my-server'; 
// Function to calculate CPU usage percentage
async function getCpuUsagePercent() {
    const numCores = cpus().length;
    const startUsage = _cpuUsage();
    const startTime = hrtime();

    return new Promise((resolve) => {
        setTimeout(() => {
            const endUsage = _cpuUsage(startUsage);
            const endTime = hrtime(startTime);

            const elapsedTime = (endTime[0] * 1e9 + endTime[1]) / 1e9; 

            const totalCpuTimeUsed = (endUsage.user + endUsage.system) / 1e6; 

            const cpuUsagePercent = (totalCpuTimeUsed / (elapsedTime * numCores)) * 100;

            resolve(cpuUsagePercent.toFixed(2));
        }, 100); 
    });
}

// Function to restart PM2 process
function restartPm2Process() {
    return new Promise((resolve, reject) => {
        exec(`pm2 restart ${PM2_PROCESS_NAME}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error restarting PM2 process: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Error output: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
}

// Monitor CPU usage and restart PM2 process if needed
(async () => {
    try {
        while (true) {
            const cpuUsage = await getCpuUsagePercent();
            // console.log(`Current CPU Usage: ${cpuUsage}%`);

            if (cpuUsage > USAGE_THRESHOLD) {
                console.log('CPU usage exceeded threshold. Restarting PM2 process...');
                try {
                    const result = await restartPm2Process();
                    console.log(`PM2 process restarted successfully:\n${result}`);
                } catch (error) {
                    console.error(error);
                }
            }

            await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL_MS)); 
        }
    } catch (error) {
        console.error('Error monitoring CPU usage:', error);
    }
})();
