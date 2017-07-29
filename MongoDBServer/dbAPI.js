var tableName = "customerRecords";

var mongoAPI = {
    databaseName :"NumadStoreDB",
    tableName : "customerRecords",

    insertClientRecord : function(db,numadData){
        
        db.collection("customerRecords")
          .insertOne(numadData,function(err,res){
            if (err ) throw err;
            //console.log("records inserted");
          });
        return 1;
    },
    deleteTable : function(db,callback){
        db.collection("customerRecords").drop(function(err, delOK) {
            callback(err,delOK)
        });
    },

    localSysHealth : function(db,dbQuery,timeRangeObj){
        var output = {
            cpuUtilization : "",
            memoryUtilization : ""
        };
        //this can find resourceful
        db.runCommand( { top: 1 } );
    },
    listDevices : function(db,callback){
        var deviceList= db.collection("customerRecords").distinct("device");
            Promise.all([deviceList]).then(function(devices){
                callback(devices);
            });
    },

    getRecords : function(db,callback){
        var query = {};
        var deviceDetail =   db.collection(tableName).find(query);
        Promise.all([deviceDetail]).then(function(deviceInfo){
                callback(deviceInfo);
            });
      
    },  
    deviceDetails : function(db,deviceId,callback){

        var query = { "device" : deviceId};
        var deviceDetail =   db.collection(tableName).findOne(query);
        Promise.all([deviceDetail]).then(function(deviceInfo){
                callback(deviceInfo);
            });

          
    },     
    geoPosition : function(db,deviceId,timeRangeObj,callback){

        var query = { "device" : deviceId, $where :function(){
                return (this.time >= timeRangeObj.startTime && this.time <=timeRangeObj.endTime)
        } };
        db.collection(tableName)
          .find(query)
          .toArray(function(err,result){
            callback(err,result);
          });
    },
    
    geoOverSpeeding : function(db,speed,timeRangeObj,callback){
        
        var query = { $where :function(){
                return (this.time > timeRangeObj.startTime && this.time <= timeRangeObj.endTime)
        } };
        db.collection(tableName)
          .find(query)
          .toArray(function(err,result){
            callback(err,result);
          });
        
    },
    geoDwell : function(db,locationCordObj){


        locationCordObj = {
            latitude : "",
            longitude : "",
            startTime : "",
            EndTime : ""
        };

        var query = { "device" : deviceId, $where :function(){
                return (this.time >= timeRangeObj.startTime || this.time <=timeRangeObj.endTime)
        } };
        db.collection(tableName)
          .find(query)
          .toArray(function(err,result){
            callback(err,result);
          });
        
        



        return outputList;
    },

    stationaryFilter : function(db,timeRangeObj){
        var output  = {
            deviceName : "",
            totalStationaryDuration : ""
        };
        var query = { "device" : deviceId, $where :function(){
                return (this.time >= timeRangeObj.startTime || this.time <=timeRangeObj.endTime)
                    } };
        db.collection(tableName)
          .find(query)
          .toArray(function(err,result){
            callback(err,result);
          });
    }

};




module.exports = mongoAPI;
