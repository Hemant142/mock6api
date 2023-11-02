const express=require('express')
const {connection}=require('./db')
const {boardRouter}=require('./Routers/boardRoutes')

const cors=require('cors')
require('dotenv').config()

const app=express()
app.use(cors())
app.use(express.json())
app.use('/boards',boardRouter)


app.get('/',(req,res)=>{
    res.status(200).send('Welcome to backend')
})

app.listen(process.env.PORT,async()=>{
    try{
        await connection
        console.log('Connected to DB')
        console.log(`Server is listening to ${process.env.PORT}`)
    }
    catch(err){
        console.log(err.message)
    }
    
})