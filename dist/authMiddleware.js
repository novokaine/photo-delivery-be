"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    var _a;
    // Your authentication logic here
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(403).json({ message: "Access denied. No token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
    // if (authenticated) {
    //   next();
    // } else {
    //   res.status(401).json({ message: "Unauthorized" });
    // }
};
exports.authMiddleware = authMiddleware;
// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token)
//     return res
//       .status(403)
//       .json({ message: "Access denied. Not token provided" });
//   try {
//     const decoded: any = (jwt.verify(
//       token,
//       SECRET_KEY
//     )(
//       req as any
//       // @ts-ignore
//     ).user = decoded);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
