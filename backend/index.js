import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {nanoid} from 'nanoid'
import dotenv from 'dotenv'
dotenv.config()
 
const app = express();
app.use(cors())
app.use(express.json())

// connection to DB 
mongoose.connect(process.env.DATABASE_URI)
     .then(()=> console.log('DB conntected sucessfully'))
     .catch((err)=> console.log('Failed to connect DB', err));

// make schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: {type:Number, default:0},
});

const Url = mongoose.model('Url', urlSchema)


//api making
app.post('/api/short', async(req,res)=>{
    try {
        const {originalUrl} = req.body;
        if(!originalUrl) return res.status(500).json({error: 'original server error'}) ;
        const shortUrl = nanoid(7)
        const url = new Url({originalUrl, shortUrl})
        await url.save();
        return res.status(200).json({message:'url generated', url:url})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'server error'})      
    }
})


app.get('/:shortUrl', async(req,res) => {
    try {
        const {shortUrl} = req.params;
        const url = await Url.findOne({shortUrl})
        if(url){
            url.clicks++;
            await url.save();   
            return res.redirect(url.originalUrl)
        }else{
            return res.status(400).json({error: "URL not found"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'server error'})
       
        
    }
})



     app.listen(3001, ()=>{
        console.log("server is listening on port 3001");
        
     }) 
     
     

