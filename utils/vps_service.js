import { Client } from 'ssh2';
import { vps_host, vps_pass, vps_port, vps_user } from '../config.js';

const conn = new Client();
let pm2Path = '/root/.nvm/versions/node/v18.0.0/bin/pm2'


conn.on('ready', () => {
  console.log('Connected to VPS');
});

conn.on('error', (err) => {
  console.error(`Error connecting to VPS: ${err.message}`);
});

// Connect to your VPS using SSH
conn.connect({
  host: vps_host,
  port: vps_port,
  username: vps_user,
  password: vps_pass,
});

export function restartVPS(){
   // Restart your VPS by executing a command
  conn.exec(`export PATH=$PATH:/root/.nvm/versions/node/v18.0.0/bin/ && ${pm2Path} restart nordic`, (err, stream) => {
    if (err) {
        console.log(err);
        throw err
    };
    
    stream.on('close', (code, signal) => {
      console.log(`Command execution completed with code ${code}`);
    }).on('data', (data) => {
      console.log(`Command output: \n${data}`);
      return data
    });
  });
}


export function updateNordic(){
   // Restart your VPS by executing a command
   conn.exec('cd ~/workspace/Bilsjekk && git pull', (err, stream) => {
    if (err) {
        console.log(err);
        throw err
    };
    
    stream.on('close', (code, signal) => {
      console.log(`Command execution completed with code ${code}`);
    }).on('data', (data) => {
      console.log(`Command output: \n${data}`);
      restartVPS()
    });
  });
}


export function prepareBackup(){
  const now = new Date();
  const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  const localDateString = localDate.toISOString().split('T')[0];
  
  // Restart your VPS by executing a command
  conn.exec(`
  mkdir -p ~/backup \
  && cp -R ~/workspace/Bilsjekk/public ~/backup \
  && cd ~/backup \
  && mkdir ${localDateString} \
  && cd ${localDateString} \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=users  --out=users.json \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=violations  --out=violations.json \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=pdfs  --out=pdfs.json \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=pdfarchieves  --out=pdfarchieves.json \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=locations  --out=locations.json \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=groups  --out=groups.json \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=formfields  --out=formfields.json \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=cars  --out=cars.json \
  && mongoexport --uri="mongodb://admin:admin123@127.0.0.1:27017/admin"  --collection=accidents  --out=accidents.json \
  `, (err, stream) => {
   if (err) {
       console.log(err);
       throw err
   };
   
   stream.on('close', (code, signal) => {
     console.log(`Command execution completed with code ${code}`);
   }).on('data', (data) => {
     console.log(`Command output: \n${data}`);
   });
 });
}