var  express        = require("express")
   , app            = express()
   , bodyParser     = require("body-parser")
   , mongoose       = require("mongoose")
   , passport       = require("passport")
   , flash          = require("connect-flash")
   , User           = require("./models/user")
   , Doctor         = require("./models/doctors")
   , LocalStrategy  = require("passport-local");

var nodemailer = require('nodemailer');

//mongoose.connect('mongodb://nitin:nitin1979@ds153314.mlab.com:53314/sparshdb');
mongoose.connect('mongodb://nitin:nitin1979@ds035836.mlab.com:35836/clinbydb');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json({limit: "50mb"}));
app.set("view engine","ejs");

app.use(require("express-session")({
    secret            : "anything i want i can put here",
    resave            :  false,
    saveUninitialized :  false
    }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    

app.use(flash());
app.locals.moment = require('moment');
app.use(function(req,res,next){
   res.locals.currentUser = req.user; 
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();  //very imp as it is a middleware it requires next operation
});

app.get(['/home','/','/landing'],function(req,res){
  res.render('home');
});

app.get('/createDoctor',isLoggedIn,function(req,res){
  res.render('createDoctors');
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
  cloud_name: 'dm8ybolf5', 
  api_key:"276682918714299", 
  api_secret:"ogrmFuqRS6Rvmq6pcAIo3hjr9JI"
});


app.post('/registerDoctor',upload.single('image'),function(req,res){
     console.log(req.body);
     var doctor = {
     	fullName:req.body.fullName,
     	experience:req.body.experience,
     	special:req.body.special,
     	consultation:req.body.consultation,
     	location:req.body.address,
     	image:req.body.image,
      rating:req.body.rating
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
   Doctor.find({},function(err,allDoctors){
            if(err){
                console.log(err);
            } 
            else{
             // res.send(allDoctors);
              res.render("allDoctors",{doctors:allDoctors});         
            }
    });
});

app.get('/booked',function(req,res){
  //res.send("<h1>Appointment Booked</h1>");
  res.render('booked');
});

app.post('/book',function(req,res){
  console.log(req.body);



 var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'clinbyapp@gmail.com',
        pass: 'Nit@1979'
       }
  });

 var body = "Details of the Patient are as follows:-\nName: "+req.body.fullName+"\nemail: "+req.body.email+"\nPhone Number: "+req.body.phoneNo;

 var mailOptions = {
    from: 'clinbyapp@gmail.com',
    to: 'abhishekkaul9@gmail.com',
    subject: 'New Appointment on clinby',
    text: body
  };

 transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
       res.redirect('/booked');
    }
  });
});

app.get('/admin',isLoggedIn,function(req,res){
  Doctor.find({},function(err,allDoctors){
            if(err){
                console.log(err);
            } 
            else{
             // res.send(allDoctors);
              res.render("admin",{doctors:allDoctors});         
            }
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
   return next();
 }
 res.redirect('/login');
}

app.get('/deleteDoctor/:id',function(req,res){
     Doctor.findByIdAndRemove(req.params.id,function(err){
          if(err){
              req.flash("error","Error detected!!");
              res.redirect("/admin");
          }else{
              req.flash("success","Doctor deleted successfully!!");
              res.redirect("/admin");
          } 
    }); 
});



//sign up route  

//render the sign up form
// app.get("/register",function(req,res){
//     res.render("register"); 
// });

//sign up logic
app.post("/register",function(req,res){
   var newUser = new User({username:req.body.username});
   //passport-local-mongoose method
   User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            //return is a simple way of short circuiting 
            return res.render("register",{"error": err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","admin verified "+user.username);
            res.redirect("/admin");
        });
   });
}); 

//login routes

//render the login form
app.get("/login",function(req,res){
    res.render("login"); 
});
//login logic
app.post("/login",passport.authenticate("local",{ //==============
    successRedirect:"/admin",               //MIDDLEWARE
    failureRedirect:"/login",                     //==============
    failureFlash: true,
    successFlash: 'admin logged in'
}),function(req,res){
});

//logout route
app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","logged you out!!");
    res.redirect("/");
});


// app.listen(7000,function(){
//      console.log("clinby");
// });

app.listen(process.env.PORT,process.env.IP,function(){
     console.log("app server has started on heroku ");
});


//credentials
//username : Nit-1997
//password : Clinby@1979