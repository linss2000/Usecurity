'use strict'
var express = require('express');
var router = express.Router();
const mssql = require('mssql');
const DBase = require('./api/mssql');
const _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Hello there');
  res.render('index', { title: 'Express' });
});



router.post('/checkRoles', async function(req, res, next){

  console.log('in checkRoles');
  debugger;
  let parmstr = JSON.stringify(req.body);
  //let parmstr = JSON.stringify(req.query);
  let parms = JSON.parse(parmstr);
  const parm = [];
  try
  {
    let keyArr = Object.keys(parms);
    keyArr.forEach((key, index) => {
      parm[index] = parms[key];
    })
  }
  catch (err)
  {

  }
  try {
    var result = await GetRoles(parm);
    console.log("roles result:" + result);
    res.status(200).json(result);

  }
  catch (err) {
    var result = JSON.stringify({"message": "fail","hasAccess":"N", "result": err.message});
    res.status(400).json(result);
  }


});


async function GetRoles(parm)
{


  try{
    debugger;
    var result = await DBase.DB.execSP("sps_getUserRoles", parm)
    var resultObj = JSON.parse(result);
    let newResults = [];
    if (resultObj.errCode == "-100")
    {
      var output = JSON.stringify({"message": "fail", "hasAccess":"Y", "result": "sps_getUserRoles"+resultObj.errDesc});
      return output;
    }

   console.log('Roles changed'+resultObj.data[0][0]["hasRoleschanged"]);
   console.log('Roles:' + resultObj.data[0][0]["JSON"]);
   if (resultObj.data[0][0]["hasRoleschanged"] == 'Y')
   {
       var output = JSON.stringify({"message": "ok","lstUpdTs":resultObj.data[0][0]["lastUpdTs"], "hasAccess":resultObj.data[0][0]["hasAccess"], "result": "", "roles": JSON.parse(resultObj.data[0][0]["JSON"])});
   }
   else {
    if (resultObj.data[0][0]["hasAccess"] == 'N') {
      var output = JSON.stringify({"message": "ok", "lstUpdTs":resultObj.data[0][0]["lastUpdTs"],"hasAccess":resultObj.data[0][0]["hasAccess"], "result": "Has No access to function"});
    } else {
      var output = JSON.stringify({"message": "ok", "lstUpdTs":resultObj.data[0][0]["lastUpdTs"],"hasAccess":resultObj.data[0][0]["hasAccess"], "result": ""});
    }
   }

    return output;
  }
  catch(e){
    var output = JSON.stringify({"message": "fail","hasAccess":"N", "result": e.message});
      return output;
  }

  /*console.log("Result from GetRoles:"+JSON.stringify({"result":resultObj.data[0]}));

  var results = _.filter(resultObj.data[0], function (obj) {
    debugger;
    console.log(obj.gs_name)
    return obj.gs_name.indexOf(svcName) !== -1;
  });

  return results[0].gs_url;
  */
}

module.exports = router;
