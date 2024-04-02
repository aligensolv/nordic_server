import { ALREADY_EXISTS, NOT_FOUND } from "../constants/status_codes.js";
import CustomError from "../interfaces/custom_error_class.js";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import Group from "../models/Group.js";

class GroupRepository{
    static async getAllGroups(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const groups = await Group.find({});
                return resolve(groups)
            })
        )
    }


    static async getGroupById(group_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const group = await Group.findOne({
                    _id: group_id
                });

                if(!group){
                    let group_not_found_error = new CustomError(`Group '${group_id}' does not exist`, NOT_FOUND)
                    return reject(group_not_found_error)
                }

                return resolve(group)
            })
        )
    }


    static async createGroup({ name }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let existingGroup = await Group.findOne({ name })

                if(existingGroup){
                    let group_already_exists_error = new CustomError(`Group with name '${name}' already exists`, ALREADY_EXISTS)
                    return reject(group_already_exists_error)
                }

                const group = new Group({
                    name
                })

                await group.save()

                return resolve(group)

            })
        )
    }


    static async deleteAllGroups(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const groups = await Group.deleteMany({});
                return resolve(groups)
            })
        )
    }


    static async deleteGroupById(group_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const group = await Group.deleteOne({
                    _id: group_id
                });

                if(group.deletedCount === 0){
                    let group_not_found_error = new CustomError(`Group '${group_id}' was not deleted`, NOT_FOUND)
                    return reject(group_not_found_error)
                }

                return resolve(group)

            })
        )
    }
}

export default GroupRepository