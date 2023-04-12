import { Router } from 'express'

import { deleteUser, getAllUsers } from '../controllers/users'
import { isAuthenticated, isOwner } from '../middlewares'

export default (router: Router) => {
  router.get('/users', isAuthenticated, getAllUsers)
  // A ordem importa! isAuthenticated deve vir primeiro.
  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser)
}
