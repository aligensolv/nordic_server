import Qrcode from "qr-image";
import { createWriteStream } from "fs";

import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import { static_absolute_files_host } from "../config.js";
import Randomstring from "randomstring"

class QrcodeRepository{
    static async generateCarQrcode({ boardNumber, privateNumber,_id }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const data = JSON.stringify({
                    boardNumber,
                    privateNumber,
                    _id
                });

                const generated = Qrcode.image(data, { type: 'png' });

                const filename = `${boardNumber}_${privateNumber}.png`;
                const filePath = `public/qrcodes/${filename}`;
                const qrStream = generated.pipe(createWriteStream(filePath));

                qrStream.on('finish', () => {
                    console.log(`QR Code saved as ${filename}`);
                });

                const qrcode_path = static_absolute_files_host  + `qrcodes/${filename}`
                return resolve(qrcode_path);
            })
        )
    }

    static async generateMachineQrcode(machine){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const link = `https://klage.ryl.no/machines/${machine._id}`
                
                // klage.ryl.no/machines/${machine._id}
                const generated = Qrcode.image(link, { type: 'png' });

                const filename = `machine_qrcode_${machine.serial}.png`;
                const filePath = `public/qrcodes/${filename}`;
                const qrStream = generated.pipe(createWriteStream(filePath));

                qrStream.on('finish', () => {
                    console.log(`QR Code saved as ${filename}`);
                });

                const qrcode_path = static_absolute_files_host  + `qrcodes/${filename}`
                return resolve(qrcode_path);
            })
        )
    }

    static async generateComplaintQrcode({ location, phone_number }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const link = `http://localhost:5173/complaints/create?location=${location}&phone_number=${phone_number}`
                
                // klage.ryl.no/complaints/${complaint._id}
                const generated = Qrcode.image(link, { type: 'png' });

                const filename = `complaint_qrcode_${location}_${Randomstring.generate(10)}.png`;
                const filePath = `public/qrcodes/${filename}`;
                const qrStream = generated.pipe(createWriteStream(filePath));

                qrStream.on('finish', () => {
                    console.log(`QR Code saved as ${filename}`);
                });

                const qrcode_path = static_absolute_files_host  + `qrcodes/${filename}`
                return resolve(qrcode_path);

            })
        )
    }
}

export default QrcodeRepository