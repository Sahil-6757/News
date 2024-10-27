const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer")
const path = require("path")
const cloudinary = require('cloudinary').v2;
const fs = require("fs")


// Middleware starts
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
// app.use(express.static("server/uploads"));
// Middleware ends

async function main() {
  await mongoose.connect(
    "mongodb+srv://arbaz151033:Arbazkhan%406757@cluster.dapmmwg.mongodb.net/Newsuploader?retryWrites=true&w=majority&appName=clusternp"
  );
}
main().catch((err) => console.log(err));

console.log(path.join(__dirname,'./uploads'))

    // Configuration
    cloudinary.config({ 
      cloud_name: 'dbi2w9wjw', 
      api_key: '316433984532898', 
      api_secret: 'Yjv9ZcE-fVJgnaydoBFqjpr8M04' // Click 'View API Keys' above to copy your API secret
  });

const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,path.join(__dirname,'./uploads'))
  },
  filename: async function(req,file,cb){
    cb(null,`${Date.now()+'-'+file.fieldname+'.jpg'}`)
   
  }
})
const upload = multer({ storage })




const newSchema = new mongoose.Schema({
  name: { type: String, unique: false },
  description: { type: String, unique: false },
  imageurl: { type: String, unique: false },
  date: { type: String, unique: false },
});

const indiannewSchema = new mongoose.Schema({
  name: { type: String, unique: false },
  description: { type: String, unique: false },
  imageurl: { type: String, unique: false },
  date: { type: String, unique: false },
});

let News = mongoose.model("newsUploader", newSchema);
let indNews = mongoose.model("indianNews", indiannewSchema);

app.post("/formpost", upload.single("file"), async (req, res) => {

  const response = await cloudinary.uploader.upload(req.file.path)
  console.log(response)
  console.log(req.file.path)
  let news = new News();
  news.name = await req.body.title;
  news.description = await req.body.description;
  news.imageurl = response.url
  news.date = await req.body.newDate;
  await news.save();
  fs.unlinkSync(req.file.path)
  res.json({ message: "Success" });
});

app.post("/indianpost", async (req, res) => {
  let news = new indNews();
  news.name = await req.body.title;
  news.description = await req.body.description;
  news.imageurl = await req.body.imageUrl;
  news.date = await req.body.newDate;
  await news.save();
  res.json({ message: "Success" });
});

app.delete("/formdelete/:id", async (req, res) => {
  try {
    let id = await req.params.id;
    let data = await News.findById({ _id: id });
    if (!data.$isEmpty()) {
      await News.deleteOne({ _id: id });
      res.json({ message: "Deleted" });
    } else {
      res.json({ message: "No data Found" });
    }
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/indianNewsdelete/:id", async (req, res) => {
  try {
    let id = await req.params.id;
    let data = await indNews.findById({ _id: id });
    if (!data.$isEmpty()) {
      await indNews.deleteOne({ _id: id });
      res.json({ message: "Deleted" });
    } else {
      res.json({ message: "No data Found" });
    }
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
});

app.get("/formget", async (req, res) => {
  let result = await News.find({});
  res.json(result);
});

app.get("/indianNews", async (req, res) => {
  let result = await indNews.find({});
  res.json(result);
});

app.listen(8000, () => {
  console.log("server on http://localhost:8000");
});




// await v2.uploader.upload(path.join(__dirname,'./uploads')+file.fieldname+'.jpg').catch((error)=>{
//   console.log("clodunnary error "+error)
// })