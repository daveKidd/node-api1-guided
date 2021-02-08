const express = require("express")
const generate = require("shortid").generate

const app = express();
app.use(express.json())

const PORT = 1234;

let office = [
    {id:generate(), name: "Michael Scott" , role:"Regional Manager" },
    {id:generate(), name:"Dwight Schrute", role:"Assistant to Regional Manager"}
]

app.get("/employees", (req,res)=>{
    res.status(200).json(office)
})

app.get("/employees/:id", (req,res)=>{
    const idVar = req.params.id
    const emp = office.find(employee => employee.id === idVar)
    if(!emp){
        res.status(404).json({message:`ID: ${idVar} does not exist`})
    }else{
        res.status(200).json(emp)
    }    
})

app.post("/employees", (req,res)=>{
    const {name, role} = req.body
    if(!name || !role){
        res.status(400).json({message:"Name and role are required"})
    }else{
        const newEmp = {id:generate(), name, role}
        office.push(newEmp)
        res.status(201).json(newEmp)
    }
})

app.put("/employees/:id", (req,res)=>{
    const id = req.params.id
    const {name, role} = req.body
    const indexOfEmp = office.findIndex(employee => employee.id === id)

    try{
        if(indexOfEmp != -1){
            office[indexOfEmp] = {id, name, role}
            res.status(200).json({id,name,role})
        }else{
            res.status(404).json({message: `No employee with id: ${id}`})
        }
    }catch(e){
        res.status(500).json({message: `Server error: ${e}`})
    }
})

app.delete("/employees/:id", (req,res)=>{
    const idVar = req.params.id
    try{
        //throw "I AM AN ERROR!!! NASTY!!!!"
        if(!office.find(employee => employee.id === idVar)){
            res.status(404).json({message: `Employee with id: ${idVar} not found`})
        }else{
            office = office.filter(employee => employee.id !== idVar)
            res.status(200).json({message: `Employee: ${idVar} was deleted`})
        }
    }catch(e){
        res.status(500).json({message: `Server error: ${e}`})
    }
})

app.use("*",(req,res)=>{
    res.status(404).json({message:"404 Not found )*:"})
})

app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`)
})

