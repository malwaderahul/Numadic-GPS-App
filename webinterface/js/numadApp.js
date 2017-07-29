// Define the `phonecatApp` module
var numadApp = angular.module('numadApp', ['angularMoment']);
var DisplayFieldName = "currDate,time,latitude,longitude,speed,status";    
    var DisplayFieldCaption = " Date,Time(UTC),Latitude,Longitude,Speed,Status";    
    var DisplayFieldWidth = "50,100,300,500,700,800,900";

// Define the `deviceController` controller on the `numadApp` module
numadApp.controller('deviceController', function deviceController($http,$scope,$q,$timeout) {
    $scope.devices= [];
    $scope.devicesList = ["Device0", "Device1", "Device2", "Device3", "Device4", "Device5", "Device6", "Device7", "Device8"];
    $scope.deviceSpecificInfo = [];
$scope.showDevicePanel = true;
$scope.showDeviceDetails = false;

$scope.togglePanel = function(){
    if($scope.showDevicePanel){
        $scope.showDevicePanel = false;
        $scope.showDeviceDetails = true;
    }
    else{
        $scope.showDevicePanel = true;
        $scope.showDeviceDetails = false;
    }

}
//table Related Stuff
$scope.orderField  = "Time(UTC)";
$scope.reverse =false;
$scope.mydata = [];
var DispFieldName = DisplayFieldName.split(",");    
var DispCaption = DisplayFieldCaption.split(",");    
var DispWidth = DisplayFieldWidth.split(",");    
  
var columns = [];    
$.each(DispCaption, function (i) {    
   // console.log("FieldName"+DispFieldName[i],DispCaption[i],DispWidth[i])
    columns.push({ fieldname: DispFieldName[i], caption: DispCaption[i], width: DispWidth[i] });    
});    
$scope.mycolumns = columns;
$scope.getcolumnname = function (cell) {    
    return cell.fieldname;    
}    
  
$scope.getcolumnwidth = function (cell) {    
    return cell.width;    
}    
  
$scope.getcolumnShow = function (cell) {    
    var a = cell.width > 0 ? true : false;    
    return a;    
}    
  
$scope.fnRowClick = function (record) {    
    alert(record.currDate);    
    alert(record.time);    
    alert(record.latitude);    
    alert(record.longitude);    
    alert(record.speed);    
    alert(record.status);    
}    
  
$scope.fnSort = function (cell) {    
    $scope.orderField = cell.fieldname;    
    $scope.reverse = !$scope.reverse;    
};   




    $http.get('/listDevices').then(function(response){
        $scope.devicesList = response.data[0];
          var resArray = [];
          for(ind = 0; ind< $scope.devicesList.length;ind++)
            {
                var devDetail = $http({
                    url : "/getDetails/"+$scope.devicesList[ind],
                    method : "Get",
                    params :{id : $scope.devicesList[ind]}
                });
                resArray.push(devDetail);
            }
            var respArr = []
            Promise.all(resArray).then(function(index){
                for(ind = 0;ind < index.length;ind++)
                    {
                       respArr.push(index[ind].data[0])
                       //console.log(index);
                    }
                    $timeout(function() {
                        $scope.devices = respArr;    
                    }, 5000);     
                    
            });

    });
       
    
    $scope.getDeviceDetails = function(dev){

        //console.log(dev.device,$scope.deviceSpecificInfo,this);
        if($scope.deviceSpecificInfo.length > 0 && $scope.deviceSpecificInfo[0].hasOwnProperty(dev.device)){
            return;
        }
        $scope.selectedDevice = dev.device;
        $scope.latitude = dev.latitude;
        $scope.longitude = dev.longitude;
        

        $http({
            url : '/geoPosition',
            method : 'GET',
            params : {deviceId : dev.device},

        }).then(function(response){
            $scope.showDevicePanel =false;
            $scope.showDeviceDetails = true;
            
            $scope.deviceSpecificInfo = response.data;
            $scope.mydata  = response.data
            //console.log("My Data"+$scope.myData);
        });
    }

});


numadApp.filter('myDateFormat',function(moment){

    return function(dateString){
        return moment(dateString).format("DD/MM/YYYY");
    }

});

numadApp.filter('myTimeFormat',function(moment){

    return function(dateString){
        return moment("20170727T"+dateString).format("hh:mm:ss");
    }

});