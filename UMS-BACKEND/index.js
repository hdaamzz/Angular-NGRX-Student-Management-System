const http=require('http')
const app=require('./app')
const server=http.createServer(app);



const port =process.env.port||3000

app.listen(port,()=>{
    console.log(`Server running in http://localhost:${port}`);
    
})