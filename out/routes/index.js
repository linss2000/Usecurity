'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require('express');
var router = express.Router();
var mssql = require('mssql');
var DBase = require('./api/mssql');
var _ = require('lodash');
/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('Hello there');
    res.render('index', { title: 'Express' });
});
router.post('/checkRoles', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var parmstr, parms, parm, keyArr, result, err_1, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('in checkRoles');
                    debugger;
                    parmstr = JSON.stringify(req.body);
                    parms = JSON.parse(parmstr);
                    parm = [];
                    try {
                        keyArr = Object.keys(parms);
                        keyArr.forEach(function (key, index) {
                            parm[index] = parms[key];
                        });
                    }
                    catch (err) {
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, GetRoles(parm)];
                case 2:
                    result = _a.sent();
                    console.log("roles result:" + result);
                    res.status(200).json(result);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    result = JSON.stringify({ "message": "fail", "hasAccess": "N", "result": err_1.message });
                    res.status(400).json(result);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
function GetRoles(parm) {
    return __awaiter(this, void 0, void 0, function () {
        var result, resultObj, newResults, output, output, output, output, e_1, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    debugger;
                    return [4 /*yield*/, DBase.DB.execSP("sps_getUserRoles", parm)];
                case 1:
                    result = _a.sent();
                    resultObj = JSON.parse(result);
                    newResults = [];
                    if (resultObj.errCode == "-100") {
                        output = JSON.stringify({ "message": "fail", "hasAccess": "Y", "result": "sps_getUserRoles" + resultObj.errDesc });
                        return [2 /*return*/, output];
                    }
                    console.log('Roles changed' + resultObj.data[0][0]["hasRoleschanged"]);
                    console.log('Roles:' + resultObj.data[0][0]["JSON"]);
                    if (resultObj.data[0][0]["hasRoleschanged"] == 'Y') {
                        output = JSON.stringify({ "message": "ok", "lstUpdTs": resultObj.data[0][0]["lastUpdTs"], "hasAccess": resultObj.data[0][0]["hasAccess"], "result": "", "roles": JSON.parse(resultObj.data[0][0]["JSON"]) });
                    }
                    else {
                        if (resultObj.data[0][0]["hasAccess"] == 'N') {
                            output = JSON.stringify({ "message": "ok", "lstUpdTs": resultObj.data[0][0]["lastUpdTs"], "hasAccess": resultObj.data[0][0]["hasAccess"], "result": "Has No access to function" });
                        }
                        else {
                            output = JSON.stringify({ "message": "ok", "lstUpdTs": resultObj.data[0][0]["lastUpdTs"], "hasAccess": resultObj.data[0][0]["hasAccess"], "result": "" });
                        }
                    }
                    return [2 /*return*/, output];
                case 2:
                    e_1 = _a.sent();
                    output = JSON.stringify({ "message": "fail", "hasAccess": "N", "result": e_1.message });
                    return [2 /*return*/, output];
                case 3: return [2 /*return*/];
            }
        });
    });
}
module.exports = router;
//# sourceMappingURL=index.js.map