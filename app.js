//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoURL= 'mongodb://0.0.0.0:27017/todoListDB';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    // Start your application logic here
    //Schema
    const itemSchema= new mongoose.Schema({
      name: String
    });

    const ObjectId =itemSchema.ObjectId;

    //Model
    const Item = mongoose.model("Item", itemSchema);
    
    app.get("/", function(req, res) {

      Item.find()
        .then(function(item){
            res.render("list", {listTitle: "Today", newListItems: item});
          })
        .catch(function(err){
          console.log(err);
        });
    
    });
    
    app.post("/", function(req, res){
    
      const itemName = req.body.newItem;
      
      const item= new Item({
        name :itemName
      })
      item.save();
      res.redirect("/");
    });

  app.post("/delete", async function(req, res) {
    await Item.deleteMany();
    res.redirect("/");
    console.log("Reset Done");
  });
    
    app.get("/about", function(req, res){
      res.render("about");
    });
    
    app.listen(3000, function() {
      console.log("Server started on port 3000");
    });
    
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
