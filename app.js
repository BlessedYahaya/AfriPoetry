
//Set up Express and other dependencies
var express = require("express"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose=require("mongoose"),
app = express();

//APP CONFIG
//config mongoose
mongoose.connect("mongodb://localhost/restful_blog_app",  {useNewUrlParser: true});
//for body parser
app.use(bodyParser.urlencoded({extended: true}));
//use sanitizer
app.use(expressSanitizer());

app.set("view engine", "ejs");
//make express allow external stylesheet
app.use(express.static("public"));
//method override
app.use(methodOverride('_method'));

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image:String,
    body:String,
    created: {type: Date, default:Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//     title:"Our First Blog post",
//     image:"https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body:"This is my first post, i really want to make a beautiful blog"
// })


//RESTful ROUTE
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Oh no");
            console.log(err);
        }else{
            res.render("index", {
                blogs:blogs
            });
        }
    });
    
});

//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});
//CREATE ROUTE
app.post("/blogs",function(req,res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog, function(err,blog){
        if(err){
            res.render("new");
        }else{
            //redirect to index
            req.flash("Success", "New Post Added")
            res.redirect("/blogs");
        }
    });
    
} );

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            //render show page
           res.render("showpage",{
               blog:foundblog
           });
        } 
        
    });
    
});
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundblog){
        if(err){
                res.redirect("/blogs");
        }else{
              res.render("edit", {
                  blog:foundblog
              });
        }
    });
    
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,update){
        if(err){
          console.log(err);
        }else{
            req.flash("Success", "Post Editted")
              
            res.redirect("/blogs/"+ req.params.id);        
        }
        
    });
});

//delete route
app.delete("/blogs/:id", function(req,res){
    //destroy
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs")
        }
        
    })
})












//Satrt Server Up
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server is Up");
})






