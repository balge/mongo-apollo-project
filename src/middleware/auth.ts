import { verify } from 'jsonwebtoken'

/** auth中间件，context里存入isAuth字段，用于Directive里鉴权 */
const AuthMiddleware = async (req: any, res: any, next: any) => {
  // Extract Authorization Header
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }

  let decodedToken
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

  // TODO 去拿用户信息，usermodel还没做

  // let authUser = await User.findById(decodedToken.id)
  // if (!authUser) {
  //   req.isAuth = false
  //   return next()
  // }
  req.isAuth = true
  return next()
}

export default AuthMiddleware
