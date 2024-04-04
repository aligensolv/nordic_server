// import User from "./models/user.js"
// import './utils/database_connection.js'

import ComplaintRepository from "./repositories/Complaint.js";
import IssueRepository from "./repositories/Issue.js";
import QrcodeRepository from "./repositories/Qrcode.js";

// const result = await User.collection.bulkWrite([
//     {
//         updateMany: {
//             filter: {},
//             update: {
//                 "$rename": {
//                     "accountId": "username"
//                 }
//             }
//         }
//     }
// ]);
// if (result.modifiedCount !== 0) {
//     console.log(`Updated ${result.modifiedCount} documents`);
// } else {
//     console.log(`Nothing to update`);
// }

import './utils/database_connection.js'

let result = await ComplaintRepository.getGroupedComplaintsGraphData()

console.log(result[0].complaints);