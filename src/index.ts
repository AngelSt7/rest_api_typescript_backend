import server from "./server";
import colors from "colors";

const port = process.env.PORT || 4200

server.listen(port, ()=>{
    console.log(colors.cyan.bold(`REST API en puerto ${port}`))
})