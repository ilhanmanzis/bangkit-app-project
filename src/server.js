import routes from "./routes.js";
import Hapi from "@hapi/hapi";
import dotenv from "dotenv";

dotenv.config();

const init = async()=>{
    const server = Hapi.server({
        port : process.env.PORT || 5000,
        host : process.env.NODE_ENV !== "production" ?  'localhost' : '0.0.0.0',
        routes:{
            cors:{
                origin:['*'],
            }
        }
    });

    // Register plugins
  const swaggerOptions = {
    info: {
      title: openApiSpec.info.title,
      version: openApiSpec.info.version,
      description: openApiSpec.info.description
    },

    documentationPath: '/documentation',
    grouping: 'tags'
  };

    await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]); 


    server.route(routes);
    await server.start();
    console.log("============================================================");  
    console.log(`server run is ${server.info.uri}`);
    console.log("============================================================");
    console.log(`Documentations Api run is ${server.info.uri}/documentation`);
    console.log("============================================================");
}

init();