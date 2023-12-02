const express=require('express');
const cors=require('cors');
const app=express();
require('dotenv').config();
const mongoose=require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));


app.use(cors())
app.use(express.json())  // accept the data as json when something is added

const PORT=process.env.PORT||8080


//schema
const schemaData=mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
},{
    timestamps:true
})
//create a model
const userModel=mongoose.model("employeelists",schemaData)   // here users is the collection name inside the db intstead of users if you use employeelists the data added will be posted in that collection

//read
// url for getting data : http://localhost:8080/
app.get('/',async(req,res)=>{  // creating an api
    const data=await userModel.find({})
    res.json({success : true , data : data})
})

//create data or add or save data in mongo db
// url for adding data :http://localhost:8080/add
app.post('/add',async(req,res)=>{
console.log(req.body)   //inside the body we will pass the data
const data=new userModel(req.body)
await data.save()
res.send({success:true,message:"data saved successfully", data : data});
})

//update data
//url for updating data :http://localhost:8080/update
app.put("/update",async(req,res)=>{
    console.log(req.body)
    const{id,...rest}=req.body //this is rest operator
    console.log(rest)
const data= await  userModel.updateOne({_id: id},rest) //rest means rest of the fields can also be updated if id is given

res.send({success:true,message:"data is updated", data : data})
})

//delete data
//url for deleting data:http://localhost:8080/delete/:id (give tthe id to be deleted)
app.delete("/delete/:id",async(req , res)=>{
 const id=req.params.id
 console.log(id)
 const data=await userModel.deleteOne({_id :id})
 res.send({success:true,message:"data deleted successfully",data : data})
})




app.listen(PORT,()=>console.log("Server is running"));
