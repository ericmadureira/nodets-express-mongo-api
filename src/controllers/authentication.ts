import express from 'express'

import { createUser, getUserByEmail } from 'db/users'
import { authentication, random } from 'helpers'

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body

    if(!email || !password || !username) {
      return res.sendStatus(400)
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.sendStatus(400)
    }

    const salt = random()
    const newUser = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password)
      },
    })
    return res.send(200).json(newUser).end()

  } catch (error) {
    console.log(`REGISTER ERROR: ${error}`)
    return res.sendStatus(400)
  }
}
