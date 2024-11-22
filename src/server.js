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

    server.route(routes);
    await server.start();
    console.log("============================================================");  
    console.log(`server run is ${server.info.uri}`);
    console.log("============================================================");
}

init();