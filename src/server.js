import routes from "./routes.js";
import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
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

    const swaggerOptions = {
        info:{
            title:"IDEAT API DOCUMENTATONS",
            version:"1.0.0",
        },
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin:HapiSwagger,
            options:swaggerOptions
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