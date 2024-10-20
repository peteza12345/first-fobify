import { BadRequsetError, UnauthenticatedError, UnauthorizedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  //console.log('auth middleware', req.cookie);
  const { token } = req.cookies; // รับค่า token จาก cookie

  if (!token) throw new UnauthenticatedError('authentication invalid');

  try {
    const { userId, role } = verifyJWT(token); // ตรวจสอบว่า token ถูกต้องหรือไม่
    const testUser = userId === '670273c02d7d90df58164a1b'; // ตรวจสอบว่า userId ของผู้ใช้คือ testUserId หรือไม่

    req.user = { userId, role, testUser }; // ส่งค่า userId, role, testUser ไปในตัวแปร req.user 

    next(); // ดําเนินการต่อ
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};

export const authorizePermissions = (...roles) => { // roles = ['admin', 'user']
  return (req, res, next) => { // roles = ['admin', 'user']
    // console.log('roles: ', roles);
    if (!roles.includes(req.user.role)) { // roles = ['admin', 'user'] && req.user.role = 'user'
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  }
};

export const checkForTestUser = (req, res, next) => {
  // ตรวจสอบว่า req.user.testUser = true หรือไม่ ถ้าเป็น true ให้ส่ง error
  if (req.user.testUser) throw new BadRequsetError('Demo User. Read Only!');

  next();
};