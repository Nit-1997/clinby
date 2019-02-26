var  express        = require("express")
   , app            = express()
   , bodyParser     = require("body-parser")
   , mongoose       = require("mongoose")
   , flash          = require("connect-flash")
  // , User           = require("./models/user")
   , Doctor           = require("./models/doctors")
   , LocalStrategy  = require("passport-local");

mongoose.connect('mongodb://nitin:nitin1979@ds153314.mlab.com:53314/sparshdb');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json({limit: "50mb"}));
app.set("view engine","ejs");

app.use(require("express-session")({
    secret            : "anything i want i can put here",
    resave            :  false,
    saveUninitialized :  false
    }));

app.use(flash());
app.locals.moment = require('moment');
app.use(function(req,res,next){
   //res.locals.currentUser = req.user; 
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();  //very imp as it is a middleware it requires next operation
});

app.get(['/home','/','/landing'],function(req,res){
  res.render('home');
});

app.get('/createDoctor',function(req,res){
  res.render('createDoctor');
});

//**************//
//CREATE DOCTOR//
//*************//
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dskmn0vwa', 
  api_key:"943622486141547", 
  api_secret:"klX-ayutXqmxdZUmtL9bXhTQbro"
});


app.post('/registerDoctor',function(req,res){
     var doctor = {
     	fullName:req.body.fullName,
     	experience:req.body.experience,
     	special:req.body.special,
     	consultation:req.body.consultation,
     	location:req.body.location,
     	image:req.body.image
     };
  
         cloudinary.uploader.upload(req.file.path, function(result) {
                                // add cloudinary url for the image to the campground object under image property
                              image = result.secure_url; 
                              doctor.image = image;
                           Doctor.create(doctor, function(err, newlyCreated) {
                                  if (err) {
                                    req.flash('error', err.message);
                                    return res.redirect('back');
                                  }else{
                                      console.log(newlyCreated);
                                      res.redirect("/allDoctors");
                                  }
                                });
                              });                    
                         
});

app.get('/allDoctors',function(req,res){
   // Doctor.find({},function(err,allDoctors){
   //          if(err){
   //              console.log(err);
   //          } 
   //          else{
   //            res.send(allDoctors);
   //           // res.render("allDoctors",{doctors:allDoctors});         
   //          }
   //  });
   res.render('allDoctors');
});



// app.listen(7000,function(){
//      console.log("clinby");
// });

app.listen(process.env.PORT,process.env.IP,function(){
     console.log("app server has started on heroku ");
});

