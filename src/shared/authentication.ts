import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '../modules/users/user.repository';
import { User } from '../modules/users/user.model';

interface AuthRequest extends Request {
  user?: User;
}

const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['auth_token'];
    if (!token) {
      return res.status(401).json({ statusCode: 401, success: false, message: 'Unauthorized' });
    }

    // jwt.verify handles expiry + invalid signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & {
      id: string;
    };

    if (!decoded?.id) {
      return res.status(401).json({ statusCode: 401, success: false, message: 'Invalid token' });
    }

    // Check if user exists in DB
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ statusCode: 401, success: false, message: 'User not found' });
    }

    req.user = user; // properly typed
    next();
  } catch (err: any) {
    return res.status(401).json({ statusCode: 401, success: false, message: 'Unauthorized' });
  }
};

export default isAuthenticated;
