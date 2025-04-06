import { JwtPayload } from '../auth/guards/auth.guard'; // Adjust path if needed

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload; // Add the user property with our defined type
    }
  }
}
