import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { appDataSource } from '../dataSource.js';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
  private userRepository = appDataSource.getRepository(User);

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10),
      newUser = this.userRepository.create({ email, password: hashedPassword });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '3h' });
    return token;
  }

  static verifyToken(token: string): { id: string; email: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch {
      return null;
    }
  }
}
