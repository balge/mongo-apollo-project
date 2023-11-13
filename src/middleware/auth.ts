import { verify } from 'jsonwebtoken'
import { User } from '../models'
import { NextFunction, Request, Response } from 'express'
import { IUser } from '../models/user'

import { v4 as uuidv4 } from 'uuid'

export interface MyRequest extends Request {
  user?: IUser
  isAuth?: boolean
}

/** auth中间件，context里存入isAuth字段，用于Directive里鉴权 */
const AuthMiddleware = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('Trace-Id', uuidv4())
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }

  let decodedToken: any
  try {
    decodedToken = verify(authHeader, process.env.SECRET as string)
  } catch (err) {
    req.isAuth = false
    return next()
  }
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }

  let authUser = (await User.findById(decodedToken.id)) as IUser

  if (!authUser) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.user = authUser
  return next()
}

export default AuthMiddleware
