var express =require('express');
var bodyParser = require('body-parser');
var path = require('path');

//Initialize app
var app = express();

//Mongo
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/techstitution';
var ObjectId = require('mongodb').ObjectId;

MongoClient.connect(mongoURL,function(err,database){


    if(err)
    {
        console.log(err);
    }
    else {
        console.log('MongoDB Connected');
    }
    qkmk = database.collection('qkmk');
});


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



//main route
app.get('/',function(req,res){
    //res.sendFile(__dirname+'index');
    var title = "ITS ME";
    res.render('index',{ title: title });

});


// rout for show
 app.get('/show',function(req,res){

    var title = "Lista me te dhena";
    var indicator = [];
    var indicator_dalje=[]
    qkmk.find({}).toArray(function(err,docs){
        if(err){
            console.log(err);


        }

        for(var i=0 ; i<docs.length;i++)
        {
          // indikatori per hyrje
          if(docs[i].min_hyrje_mins <15)
          {
            indicator[i]="green";
          }
          else if(docs[i].min_hyrje_mins >15 && docs[i].min_hyrje_mins < 30 )
          {
            indicator[i]="orange";
          }
          else {
            indicator[i]="red";
          }

          // indikatori per dalje
          if(docs[i].min_dalje_mins <15)
          {
            indicator_dalje[i]="green";
          }
          else if (docs[i].min_dalje_mins > 15 && docs[i].min_dalje_mins <30 )
          {
            indicator_dalje[i]="orange";
          }
          else {
            indicator_dalje[i]="red";
          }
        }
        res.render('show',{title:title,docs:docs, indicator:indicator,indicator_dalje:indicator_dalje});
    });


 });

// rout for add
 app.post('/add',function(req,res){
    //res.render(__dirname+'/views/show.ejs');
    //res.redirect('/');

    var data = req.body;


    qkmk.insert(data,function(err,results){

        if(err)
        {
            console.log(err);
        }

        res.redirect('/')
    });
});



//route for edit

app.get('/edit/:id',function(req,res){
    //res.render(__dirname+'/vies/edit.ejs');
    var title="Edito te dhenat";
    var id = ObjectId(req.params.id);
    qkmk.findOne({_id:id},function(err,doc){
        if(err){
            console.log(err);


        }
        res.render('edit',{title:title,doc:doc,id:id});
      // res.send(id);
    });
   // res.render('edit');

});
// route for update
app.post('/update/:id', function(req,res){
    var data = req.body;
    var id = ObjectId(req.params.id);
    console.log(data);
    qkmk.updateOne( { _id: id},
       { $set: data },
       function(err, result) {
        if(err){
          console.log(err);
        }
          res.redirect('/show');
        });
   });




// route for delete
app.get('/delete/:id',function(req,res){
    //res.render(__dirname+'/views/show.ejs');

    var data = req.body;
    var id= ObjectId(req.params.id)
    qkmk.deleteOne({_id:id},function(err,result){
        if(err)
        {
            console.log(err);
        }
        res.redirect('/show');
    });

});



//route for anything else
app.get('*',function(req,res){
    res.send("404 NOT FOUND");
});


app.listen(3002,function(){
    console.log("Navigate to http://localhost:3002");
});
