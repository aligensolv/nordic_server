import User from '../models/user.js'
import PDFArchieve from '../models/PdfArchieve.js'

export const storeArchieve = async ({ id, pdfData }) =>{
  const user = await User.findOne({ _id:id })

  const archieve = new PDFArchieve({
    ...pdfData,
    username:user.name,
    accountId: user.accountId,
  })

  console.log(archieve)


  await archieve.save()
}

