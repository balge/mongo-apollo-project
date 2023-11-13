import { verify } from 'jsonwebtoken'
import { User } from '../models'

/** auth中间件，context里存入isAuth字段，用于Directive里鉴权 */
const AuthMiddleware = async (req: any, res: any, next: any) => {
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

  let authUser = await User.findById(decodedToken.id)

  if (!authUser) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.user = authUser
  return next()
}

export default AuthMiddleware
