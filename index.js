var tls = require('tls');
var fs = require('fs');
var express = require('express');
var app = require('express')();
var logStream = fs.createWriteStream('./myOutput.txt443', {'flags': 'a'});
// use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

process.on('SIGINT',function(){
  logStream.end();
  
  if(server)
    server.close();
});


var mongo = require('mongodb');
var mongoAPI = require('./MongoDBServer/dbAPI.js');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/NumadStoreDB";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;

var path = require('path');
require('ssl-root-cas')
  .inject()
  .addFile(path.join(__dirname, 'certs', 'ca.pem'));

// server starting routine
  var options = {
    // key  : fs.readFileSync('./GoClient/server.rsa.key'),
    // cert : fs.readFileSync('./GoClient/server.rsa.crt'),
    
     key  : fs.readFileSync('./certs/server.key'),
     cert : fs.readFileSync('./certs/server.pem'),
     ca : fs.readFileSync('./certs/ca.pem'),
     requestCert : true,
     rejectUnauthorized  : true
  };
  var clients = [];

  // Send a message to all clients
  function broadcast(data="",message, sender) {
      // clients.forEach(function (client) {
      //   // Don't want to send it to sender
      //   if (client === sender){ 
      //     //console.log("Client Msg")
      //     // var wstream = fs.createWriteStream('./myOutput.txt'+sender.address().removePort,{flags:'a'});
      //     // wstream.write(data);
      //     // wstream.end();
      //     //Write Client Data into MongDB or FS Instance
      //     //logStream.write(data+"\n");
      //     return;
      //   }
      //   //client.write(message);
      // });
      // Log it to the server output too
      if(typeof(data) == "object"){
        //console.log("Inserting record into db",JSON.parse(data),typeof(data))
             var res = mongoAPI.insertClientRecord(db,JSON.parse(data));
             if(!res) {
                console.log("Failed to insert record");
             }
      }
      process.stdout.write(message)
  };

  function finRes(message){
    clients.forEach(function(client){
      client.write(message);
    });
    process.stdout.write(message);
  }

  var server,interval;

  server = tls.createServer(options, function (socket) {
    console.log(socket.authorized? "Authenticated connection" : "Invalid request");
    console.log("Soc auth :" + socket.authorized);
    socket.name =  socket.remoteAddress + ":" + socket.remotePort //+socket.address().address+":"+socket.address().port ;

    socket.write('Welcome!'+socket.name);
    socket.pipe(socket);
    clients.push(socket);

    socket.on('data', function(data){
      try{
        broadcast(data,"\n"+socket.name + "> " + data, socket);
        
      }catch(exception ){
        console.log("Error Exception") ;
      }

    });

    socket.on("error", function(err){
        console.log("Caught flash policy server socket error: ");
      // console.log(err.stack)
    });

    socket.on('end', function () {
      try{
        //interval = setInterval(function(){},clients.length*1000);
        clients.splice(clients.indexOf(socket), 1);
        finRes(data="","\n"+socket.name + " left the chat.\n");
      }
      catch(indexError){
        console.log("Index Error")
      }finally{
      //broadcast(data="","\n"+socket.name + " left the chat.\n");
      finRes(data="","\n"+socket.name + " left the chat.\n");
      }
    });
  }).listen(443);
  //console.log(server.maxConnections);
  server.on('error', function (e) {
    db.close()
    //clearInterval(interval);
    if (e.code == 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(function () {
        server.close();
        server.listen(443);
      }, 1000);
    }
  });

  //creating table customerRecords which will hold entries for each device
  db.createCollection("customerRecords", function(err, res) {
    if (err) throw err;
    console.log("Table created!");
    //db.close();
  });

  app.listen(3000);
  app.use(express.static('./webinterface'));

  app.get('/',function(req,res){
    res.sendFile('index.html',{root: __dirname+'/webinterface/' });
    console.log('Listening on 3000');
  });
  app.get('/listDevices',function(req,res){
    //err,result
    mongoAPI.listDevices(db,function(resArray){
      res.send(JSON.stringify(resArray));
    });
  });

  app.get('/getDetails/*',function(req,res){
    //err,result
    var deviceId =req.query.id;
    
    mongoAPI.deviceDetails(db,deviceId,function(resArray){
      res.send(JSON.stringify(resArray));
    });
  });

  app.get('/records',function(req,res){
      mongoAPI.getRecords(db,function(resArray){
      res.send(JSON.stringify(resArray));
    });
  });

  app.get('/drop',function(req,res){
    mongoAPI.deleteTable(db,function(err,delOK){
            if (err) throw err;
            if (delOK) console.log("Table deleted");
            res.send("Table Deleted"+delOK);
    }); 

  });

  app.get('/geoPosition',function(req,res){
    var deviceId = req.query.deviceId,
        timeRange = {
          startTime : "055300",
          endTime : "055400",
        };
    mongoAPI.geoPosition(db,deviceId,timeRange,function(err,result){
            if (err) throw err;
            if (result) console.log("Records retrived",result);
        //     var outputObj = {
        //     latitude : "",
        //     longitude : "",
        //     timestamp : "",
        //     status : "",
        //     speed : ""
        // };

            res.send(JSON.stringify(result));
    });

  });

  app.get('/geoOverspeed',function(req,res){
    var timeRange = {
           startTime : "055350",
           endTime : "055401",
        },
        speed = 50;
        mongoAPI.geoOverSpeeding(db,speed,timeRange,function(err,result){
            if (err) throw err;
            if (result) console.log("Records retrived",result.length);
            res.send(JSON.stringify(result));                    
        });

  });


});




// app.listen(3000);
// app.get('/',function(req,res){
//    res.send('Hwllo world');
//   console.log('Listening on 3000');
// });