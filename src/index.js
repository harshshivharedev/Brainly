
import dotenv from "dotenv";
import connectDB from "./db/database.js";
import { app } from "./app.js";

dotenv.config();

connectDB()
.then(()=>{
    app.on("error", (error) => {
        console.log(error);
    })
    app.listen(process.env.Port || 8000, () => {
        console.log(`App is listening on port ${process.env.PORT} `)
    })
})
.catch((err) => {
    console.log("MongoDB connection failed", err);
})