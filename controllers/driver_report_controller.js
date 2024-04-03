import asyncWrapper from '../middlewares/async_wrapper.js'
import DriverReportRepository from '../repositories/DriverReport.js'
import { OK } from '../constants/status_codes.js'
import { static_absolute_files_host } from '../config.js'

export const createNewDriver = asyncWrapper(async (req,res) =>{

    const { data, token } = req.headers

    let values = Object.values(req.body).map(e => JSON.parse(decodeURIComponent(e)))
    const information = JSON.parse(decodeURIComponent(data))

    const groupedData = values.reduce((acc, obj) => {
        if (!acc[obj.form]) {
            acc[obj.form] = [];
        }

        acc[obj.form].push(obj);
        return acc;
    }, {});

    const groupedImages = {};

    for (const image of req.files) {
        const fieldname = decodeURIComponent(image.fieldname);
        if (!groupedImages[fieldname]) {
            groupedImages[fieldname] = [];
        }
        groupedImages[fieldname].push({
            path: static_absolute_files_host + image.path.split('public')[1].replaceAll('\\','/'),
        });
    }

    await DriverReportRepository.createDriverReport({
        token, groupedData, groupedImages, information
    })

    res.status(OK).json(true)

})


