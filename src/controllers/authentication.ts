import express from 'express'

import { createUser, getUserByEmail } from '../db/users'
import { authentication, random } from '../helpers'

// POST + body
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if(!email || !password) {
      return res.sendStatus(400)
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')
    if (!user) {
      return res.sendStatus(400)
    }

    const expectedHash = authentication(user.authentication.salt, password)
    if(user.authentication.password !== expectedHash){
      return res.sendStatus(403)
    }

    const salt = random()
    user.authentication.sessionToken = authentication(salt, user._id.toString())
    await user.save()

    res.cookie('ERIC-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/'})
    return res.sendStatus(200).json(user).end()
  } catch (error) {
    console.log(`REGISTER ERROR: ${error}`)
    return res.sendStatus(400)
  }
}

// POST + body
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
