import express, { Request, Response } from 'express';
import { Router } from 'express';
import { queryDatabase } from './db-query';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  //1. get email, password
  const email = req.body.email;
  const password = req.body.password;
  //console.log(user);
  const user = {password,email};

  try {
    //2. check if the data exists in the database user table
    const result = await queryDatabase(`SELECT * FROM public.user WHERE email = '${user.email}' AND password = '${user.password}'`);
    const userData = result.rows;
    //console.log(userData);

    //3. if exists, return success
    if (userData.length > 0) {
      return res.status(204).json({ status: 204, message: 'User logged in successfully' });
    }
    return res.status(422).json({ status: 422, message: 'Validation error' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: 'server error' });
  }
});

module.exports = router;