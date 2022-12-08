import Config from "config";
import Routes from "./routes";
import Server from "./common/server";
//load fabric environemtn
require('./loaders/fabric-loader');
const dbUrl = `mongodb://${Config.get("databaseHost")}:${Config.get("databasePort")}/${Config.get("databaseName")}`
const server = new Server()
  .router(Routes)
  .configureSwagger(Config.get("swaggerDefinition"))
  .handleError()
  .configureDb(dbUrl)
  .then((_server) => _server.listen(Config.get("port")));


export default server;