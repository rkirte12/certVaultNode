
import superUser from "../server/controller/superUser/routes"
import admin from "../server/controller/admin/routes"
import user from "../server/controller/user/routes"



/**
 *
 *
 * @export
 * @param {any} app
 */

export default function routes(app) {

  app.use('/api/v1/superUser', superUser)
  app.use('/api/v1/admin', admin)
  app.use('/api/v1/user', user)

  return app;
}


