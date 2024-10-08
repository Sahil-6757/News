const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

// Middleware starts
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
// Middleware ends


async function main() {
    await mongoose.connect(
      "mongodb+srv://arbaz151033:Arbazkhan%406757@cluster.dapmmwg.mongodb.net/Newsuploader?retryWrites=true&w=majority&appName=clusternp"
    );
  }
  main().catch((err) => console.log(err));

const newSchema = new mongoose.Schema({
    name: { type: String, unique: false },
    description: { type: String, unique: false },
    imageurl: { type: String, unique: false },
  
  });

  let News = mongoose.model("newsUploader", newSchema);

app.post("/formpost", async (req, res) => {
  let news = new News();
  news.name = await req.body.title
  news.description = await req.body.description
  news.imageurl = await req.body.imageUrl
  await news.save();
  res.json({message:"Success"})
});


app.get("/formget",async (req,res)=>{
    let result = await News.find({});
    res.json(result)
})

app.listen(8000, () => {
  console.log("server on http://localhost:8000");
});
