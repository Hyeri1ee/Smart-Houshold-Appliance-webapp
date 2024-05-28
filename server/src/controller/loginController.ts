import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcrypt'; // bcrypt 라이브러리 임포트
import jwt from 'jsonwebtoken'; // JWT 라이브러리 임포트
import { User } from '../db/entities/user'; // user model import
import { Revoked_token } from '../db/entities/revoked_token';
const router: Router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(422).json({ message: 'Invalid email or password' });
    }

    // generate token
    const token = jwt.sign({ userId: user.id, firstName: user.firstName, email:user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });


    return res.status(200).json({ authorization: `${token}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;