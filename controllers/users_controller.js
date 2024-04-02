import jwt from 'jsonwebtoken';
import Manager from '../models/Manager.js';
import { jwt_secret_key } from '../config.js';
import asyncWrapper from '../middlewares/async_wrapper.js';
import UserRepository from '../repositories/User.js';
import Auth from '../repositories/Auth.js';
import { OK } from '../constants/status_codes.js';


export const getAllUsers = asyncWrapper(
  async (req, res) => {
    const users = await UserRepository.getAllUsers()
    return res.status(OK).json(users);
  }
)

export const deleteAllUsers = asyncWrapper(
  async (req, res) => {
    await UserRepository.deleteAllUsers()
    return res.status(OK).json("All Users Were Deleted");
  }
);


export const register = asyncWrapper(
  async (req, res) => {
    const { name, pnid, password } = req.body;
    console.log(name, pnid, password);
    const result = await UserRepository.register({
      name,
      pnid,
      password
    })

    return res.status(OK).json(result);
  }
)


export const login = asyncWrapper(
  async (req, res) => {
    const { pnid, password } = req.body
    const result = await UserRepository.login(pnid, password)

    return res.status(OK).json(result);
  }
)

export const getUserById = asyncWrapper(
  async (req, res) => {
    const {id} = req.params
    const user = await UserRepository.getUserById(id)

    return res.status(OK).json(user);
  }
)

export const getUserByAccounId = asyncWrapper(
  async (req, res) => {
    const {pnid} = req.params
    const user = await UserRepository.getUserByAccounId(pnid)

    return res.status(OK).json(user);
  }
)

export const deleteUser = asyncWrapper(
  async (req, res) => {
    const {id} = req.params
    const user = await UserRepository.deleteUser(id)

    return res.status(OK).json(user);
  }
)

export const updateUser = asyncWrapper(
  async (req, res) => {
    const {id} = req.params
    const data = req.body

    const user = await UserRepository.updateUser({
      user_id: id,
      data
    })

    return res.status(OK).json(user);

  }
)




export const validateToken = asyncWrapper(
  async (req, res) => {
    const {token} = req.body
    const result = await Auth.verifyToken(token)

    return res.status(OK).json(result);
  }
)


