import {app} from "./app.js"
import {connectDB} from "./database/connection.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000 ,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>console.log(err))