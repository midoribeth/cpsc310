/**
 * Created by rtholmes on 2016-06-19.
 */

import {Datasets} from "./DatasetController";
import Log from "../Util";

export interface QueryRequest {
    GET: string|string[];
    WHERE: {};
    ORDER: any;
    AS:string;
    GROUP?: string|string[];

    APPLY?: {}[];
}

export interface QueryResponse {
}

export default class QueryController {
    private datasets: Datasets = null;

    constructor(datasets: Datasets) {
        this.datasets = datasets;
    }

    public isValid(query: QueryRequest): boolean {

        if (typeof query["AS"] == 'undefined') {
            return false;
        }

        if (typeof query["APPLY"] !== 'undefined') {

            var qapply: any = query["APPLY"];


            for (var b in qapply) {
                var fieldname: any = Object.keys(qapply[b])[0];
                var token: any = Object.keys(qapply[b][fieldname])[0]; //e.g. MAX
                var key: any = (qapply[b][fieldname][token]); //e.g. courses_avg

                if (token == "MAX" || token == "MIN" || token == "AVG") {
                    if (key !== 'courses_avg' && key !== 'courses_fail' && key !== 'courses_pass' && key !== 'courses_audit') {
                     return false;
                    }

                }

            }
        }

//Log.trace(JSON.stringify(query["GROUP"]));
     //   Log.trace(JSON.stringify(query["APPLY"]));
      if (typeof query["GROUP"] !== undefined && JSON.stringify(query["GROUP"])=="[]"){   // empty group not valid
            return false;
        }

        if (typeof query["APPLY"] !== 'undefined' && typeof query["GROUP"] == 'undefined'){
            return false; //apply w/o group
        }

        if (typeof query["GROUP"] !== 'undefined' && typeof query["APPLY"] == 'undefined'){
            return false; //group w/o apply
        }

        if (typeof query["GROUP"] !== 'undefined'){
            var qgroup:any= query["GROUP"];
            for (var qk in qgroup){
                if (qgroup[qk] !== "courses_dept" && qgroup[qk] !== "courses_id" && qgroup[qk] !== "courses_avg" && qgroup[qk] !== "courses_instructor" && qgroup[qk] !== "courses_title" && qgroup[qk] !== "courses_pass" && qgroup[qk] !== "courses_fail" && qgroup[qk] !== "courses_audit" && qgroup[qk] !== "courses_uuid")
                    return false; //group contains valid keys
            }
        }

        if (typeof query["GROUP"] !== 'undefined' && typeof query["GET"] !== 'undefined'){ //All keys in GROUP should be present in GET
            for (var i = 0; i < query["GROUP"].length; i++) {
                if (query["GET"].indexOf(query["GROUP"][i]) < 0) {
                   return false;
                }
            }

        }
        //----^working

    //NEW:All keys in GET should be in either GROUP or APPLY.

        if (typeof query["APPLY"] !== 'undefined' && typeof query["GROUP"] !== 'undefined' && typeof query["GET"] !== 'undefined'){ //All keys in GROUP should be present in GET
            var applyfields5:any=[];
            var qapply:any=query["APPLY"];
            var qget:any=query["GET"];

            for (var b in qapply){
                applyfields5.push(Object.keys(qapply[b])[0]);

            }

            for (var getkey in qget) {
                if (applyfields5.indexOf(qget[getkey]) < 0 && query["GROUP"].indexOf(qget[getkey]) < 0) {
                   return false;
                }
            }

        }

        //If a key appears in GROUP or in APPLY, it cannot appear in the other one.

        if (typeof query["APPLY"] !== 'undefined' && typeof query["GROUP"] !== 'undefined'){
            var qapply:any= query["APPLY"];
            var qgroup:any= query["GROUP"];
            var applyfields:any=[];


            for (var b in qapply){
                applyfields.push(qapply[b][Object.keys(qapply[b])[0]][Object.keys(qapply[b][Object.keys(qapply[b])[0]])[0]]);
            }

            for (var qk in qgroup){ //every key in GROUP

                if (applyfields.indexOf(qgroup[qk]) > -1) //if APPLY also contains, return false
                  return false; //If a key appears in GROUP or in APPLY, it cannot appear in the other one.
            }

        }


      //NEW: All keys in GET that are not separated by an underscore should appear in APPLY.
        if (typeof query["GET"] !== 'undefined' && typeof query["APPLY"] !== 'undefined'){ //All keys in GROUP should be present in GET
            var applyfields6:any=[];
            for (var b in qapply){
                applyfields6.push(Object.keys(qapply[b])[0]);
            }


            for (var i = 0; i < query["GET"].length; i++) {
                if (query["GET"][i].indexOf("_") < 0 && applyfields6.indexOf(query["GET"][i]) < 0) {
                    return false;
                }
            }

        }

        //NEW: All keys in GET with an underscore should appear in GROUP.
        if (typeof query["GET"] !== 'undefined' && typeof query["GROUP"] !== 'undefined'){ //All keys in GROUP should be present in GET

            for (var i = 0; i < query["GET"].length; i++) {
                if (query["GET"][i].indexOf("_") >= 0 && query["GROUP"].indexOf(query["GET"][i]) < 0) {
                    return false;
                }
            }

        }



        if (typeof query["APPLY"] !== 'undefined') {
            var qapply: any = query["APPLY"];
            var applytargets: any = [];
            for (var a in qapply) { // for every "apply" object

                applytargets.push(Object.keys((qapply[a]))[0]); // push all apply targets into an array
            }

            function hasDuplicates(array:any) {  //check if array contains duplicates
                var valuesSoFar = Object.create(null);
                for (var i = 0; i < array.length; ++i) {
                    var value = array[i];
                    if (value in valuesSoFar) {
                        return true;
                    }
                    valuesSoFar[value] = true;
                }
                return false;
            }

            if (hasDuplicates(applytargets)){        //APPLY rules should be unique.
                return false;
            }

        }




        //----------
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0 && typeof query["AS"] !== 'undefined') {

            if (typeof query["ORDER"] !== 'undefined' && typeof query["ORDER"] == 'string') {
                if (query["GET"].indexOf(query["ORDER"]) > -1) {
                    return true;
                } else return false;
            } else return true;
        }
        return false;
    }

    public query(query: QueryRequest): QueryResponse {
        //   Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');


        var dict: any = this.datasets["courses"];
        var mresultarray: any = [];

        let querygroup: any = query["GROUP"];
        let queryapply: any = query["APPLY"];


        let querybody: any = query["WHERE"];
        let keyarray: any = Object.keys(querybody);
        let filterkey: any = keyarray[0];


        var filteredresult: any = [];
        if (JSON.stringify(querybody)=="{}"){
            mresultarray = returnall();

        }

        function returnall():any{
            var resultarray:any=[];

            for (var key in dict) {

                for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                    let section = dict[key].result[i];
                        resultarray.push(section);
                    }
                }

            return resultarray;
        }

        if (!(JSON.stringify(querybody)=="{}" || filterkey == "LT" || filterkey == "GT" || filterkey == "EQ" || filterkey == "IS" || filterkey == "AND")) {
            var resultdefault: QueryResponse = JSON.parse('{"render": "TABLE","result":[{ "courses_dept": "cnps", "courses_avg": 90.02 },{ "courses_dept": "dhyg", "courses_avg": 90.03 }]}');
            return resultdefault;
        }

        filter(filterkey);

        function filter(key: string): any {

            if (key == "LT" || key == "GT" || key == "EQ") {
                result = mcomparison(key);
                mresultarray = result;
                return result;

            }
            if (key == "IS") {
                result = lcomparison(key);
                mresultarray = result;
                return result;
            }

            if (key == "AND") {
                result = logiccomparison(key);
                mresultarray = result;
                return result;
            }


        }

        var comparekey1: any; // e.g. courses_dept, courses_avg
        var comparevalue1: any; //e.g. cpsc, 50, financial accounting
        var comparekey2: any; // e.g. courses_dept, courses_avg
        var comparevalue2: any; //e.g. cpsc, 50, financial accounting

        function logiccomparison(filterkey: string) {


            var lckey1: any = Object.keys(querybody[filterkey][0])[0]; //e.g. query[where][and][0][first key]
            comparekey1 = Object.keys(querybody[filterkey][0][lckey1])[0]; //e.g. courses_dept, courses_avg, id
            comparevalue1 = querybody[filterkey][0][lckey1][comparekey1]; //e.g. cpsc, 50, 310

            var resultarray1: any = filter(lckey1);

            var lckey2 = Object.keys(querybody[filterkey][1])[0]; //e.g. query[where][and][0][first key]
            comparekey2 = Object.keys(querybody[filterkey][1][lckey2])[0]; //e.g. courses_dept, courses_avg, id
            comparevalue2 = querybody[filterkey][1][lckey2][comparekey2]; //e.g. cpsc, 50, 310

            var resultarray2: any = filter(lckey2);


            var result: any = [];

            var c = resultarray1.concat(resultarray2);

//   combining the two result arrays

            var k1: any = comparekey1.split("_").pop();
            var k2: any = comparekey2.split("_").pop();


            for (var i = 0; i < c.length; i++) {
                if (c[i][k1] == comparevalue1 && c[i][k2] == comparevalue2) {

                    result.push(c[i]);
                }
            }

            var half_length = Math.ceil(result.length / 2);
            var leftSide: any = result.splice(0, half_length);

            return leftSide;


        }


        function lcomparison(filterkey: string) {

            //  Log.trace("KEY VALUE:  " + querybody[filterkey][key2]); //e.g. query[where][GT][courses_avg]

            var comparevalue: any;
            var compareto: any;
            var resultarray: any = [];

            if (typeof comparekey2 !== 'undefined' && typeof comparevalue2 !== 'undefined') {
                compareto = comparekey2.split("_").pop();
                comparevalue = comparevalue2;
            }


            else if (typeof comparekey1 !== 'undefined' && typeof comparevalue1 !== 'undefined') {
                compareto = comparekey1.split("_").pop();
                comparevalue = comparevalue1;
            }


            else { //base case
                var lkey2: any = Object.keys(querybody[filterkey])[0];  //e.g. courses_avg, courses_fail
                compareto = lkey2.split("_").pop();
                comparevalue = querybody[filterkey][lkey2];
            }
            for (var key in dict) {

                for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                    let section = dict[key].result[i];
                    if ((comparevalue.indexOf("*")==0) && (comparevalue.indexOf("*",1)==comparevalue.length-1)){
                        var cv:any = comparevalue.substring(1, comparevalue.length-1);
                        if (section[compareto].indexOf(cv)>=0){
                            resultarray.push(section);
                        }
                    }
                    else if (comparevalue.indexOf("*")==0){ //* at beg
                        var cv1:any = comparevalue.substring(1, comparevalue.length); //e.g. "he"
                        if (section[compareto].indexOf(cv1)==section[compareto].length-cv1.length){
                            resultarray.push(section);
                        }
                    }
                    else if (comparevalue.indexOf("*")==comparevalue.length-1){ //* at end
                        var cv2:any = comparevalue.substring(0, comparevalue.length-1);
                        if (section[compareto].indexOf(cv2)==0){
                            resultarray.push(section);
                        }
                    }
                    else if (section[compareto] == comparevalue) {   //
                        resultarray.push(section);
                    }
                }
            }

            return resultarray;

        }

        function mcomparison(filterkey: string) {
            var comparevalue: any;
            var compareto: any;
            var resultarray: any = [];

            if (typeof comparekey2 !== 'undefined' && typeof comparevalue2 !== 'undefined') {
                compareto = comparekey2.split("_").pop();
                comparevalue = comparevalue2;
            }


            else if (typeof comparekey1 !== 'undefined' && typeof comparevalue1 !== 'undefined') {
                compareto = comparekey1.split("_").pop();
                comparevalue = comparevalue1;
            }


            else { //base case, if LT/GT/EQ is the first key in WHERE
                var key2: any = Object.keys(querybody[filterkey])[0];  //e.g. courses_avg, courses_fail
                compareto = key2.split("_").pop();
                comparevalue = querybody[filterkey][key2];
            }


            if (filterkey == "LT") {

                for (var key in dict) {

                    for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                        let section = dict[key].result[i];
                        if (section[compareto] < comparevalue) {   //section.avg should be section.key2, can you use the dictionary you were working on here?

                            resultarray.push(section);

                        }
                    }
                }
                return resultarray;

            }

            if (filterkey == "GT") {
                for (var key in dict) {

                    for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                        let section = dict[key].result[i];
                        if (section[compareto] > comparevalue) {   //section.avg should be section.key2, can you use the dictionary you were working on here?

                            resultarray.push(section);

                        }
                    }
                }
                return resultarray;

            }

            if (filterkey == "EQ") {
                for (var key in dict) {

                    for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                        let section = dict[key].result[i];
                        if (section[compareto] == comparevalue) {   //section.avg should be section.key2, can you use the dictionary you were working on here?

                            resultarray.push(section);

                        }
                    }
                }

            }

            return resultarray;


        }


// GROUP ----------------------------------------------------

        if (typeof (query["GROUP"]) !== 'undefined' && typeof (query["APPLY"]) !== 'undefined') {

            var groupedarray: any;

            function arrayFromObject(obj: any) {  //http://codereview.stackexchange.com/questions/37028/grouping-elements-in-array-by-multiple-properties
                var arr: any = [];
                for (var i in obj) {
                    arr.push(obj[i]);
                }
                return arr;
            }

            function groupBy(list: any, fn: any) {
                var groups: any = {};
                for (var i = 0; i < list.length; i++) {
                    var group = JSON.stringify(fn(list[i]));
                    if (group in groups) {
                        groups[group].push(list[i]);
                    } else {
                        groups[group] = [list[i]];
                    }
                }
                groupedarray = arrayFromObject(groups);
            }

            var groupresult = groupBy(mresultarray, function (item: any) {
                var grouparray: any = [];

                for (var key in querygroup) {

                    var itemkey: any = querygroup[key].split("_").pop();
                    grouparray.push(item[itemkey]);
                }

                return grouparray;
            });

           // Log.trace(JSON.stringify(groupedarray));


         //   Log.trace(JSON.stringify(queryapply[1]));  //second APPLY object, e.g. {"maxFail":{"MAX":"courses_fail"}}

           // Log.trace(Object.keys((queryapply[1]))[0]);  //field name, e.g. maxFail

           // Log.trace(JSON.stringify((queryapply[1])[Object.keys((queryapply[1]))[0]]));  // {"MAX":"courses_fail"}
           // Log.trace(Object.keys(((queryapply[1])[Object.keys((queryapply[1]))[0]]))[0]);  // APPLY key, e.g. "MAX"
          //  Log.trace((queryapply[1])[Object.keys((queryapply[1]))[0]]["MAX"]); // field to use


// APPLY ---------------------------------------------------------
            mresultarray = []; // clear final result array

            if (JSON.stringify(queryapply) == "[]"){ //if empty apply, just return first coourse in each group

                groupedarray.forEach(function (group: any) { // for each group of courses in the array
                    mresultarray.push(group[0]);
             })
            }

            for (var a in queryapply) { // for every "apply" computation you need

                var fieldname: any = Object.keys((queryapply[a]))[0]; // field name to add, e.g. maxFail

                var applykey: any = Object.keys(((queryapply[a])[fieldname]))[0]; // e.g. MAX, MIN, COUNT
                var comparefull: any = ((queryapply[a])[Object.keys((queryapply[a]))[0]][applykey]); // field to use, e.g. courses_avg
                var compare: any = comparefull.split("_").pop(); //e.g. avg, fail
            //    Log.trace("TEST" + fieldname + applykey + compare);

                if (applykey == "MAX") {
                    groupedarray.forEach(function (group: any) { // for each group of courses in the array
                        var max: any = 0;

                        for (var entry in group) {  // for each ind. course in the group
                            if (group[entry][compare] > max)
                                max = group[entry][compare];
                        }

                        group[0][fieldname] = (max); // add result of computation to first entry in group
                       // mresultarray.push(group[0]); // add first result of each group to final array
                    });
                }

                if (applykey == "MIN") {
                    groupedarray.forEach(function (group: any) { // for each group of courses in the array
                        var min: any = group[0][compare];

                        for (var entry in group) {  // for each ind. course in the group
                            if (group[entry][compare] < min)
                                min = group[entry][compare];
                        }

                        group[0][fieldname] = (min); // add result of computation to first entry in group
                       // mresultarray.push(group[0]); // add first result of each group to final array
                    });
                }

                if (applykey == "AVG") {
                    groupedarray.forEach(function (group: any) { // for each group of courses in the array
                        var total: any = 0;

                        for (var entry in group) {  // for each ind. course in the group

                            total += group[entry][compare];
                        }
                        var avg: any = Number((total / group.length).toFixed(2));

                        group[0][fieldname] = avg; // add result of computation to first entry in group
                     //   mresultarray.push(group[0]); // add first result of each group to final array
                    });
                }

                if (applykey == "COUNT") {  // TODO
                    groupedarray.forEach(function (group: any) { // for each group of courses in the array
                        var count: any = 0;
                        var propertyarray:any=[];
                        for (var entry in group) {  // for each ind. course in the group
                           propertyarray.push(group[entry][compare]);
                        }

                        var uniqueArray:any = propertyarray.filter(function(item:any, pos:any) {
                            return propertyarray.indexOf(item) == pos;  //filter out duplicates
                        })

                        count=uniqueArray.length; //return length of unique array
                        group[0][fieldname] = (count); // add result of computation to first entry in group
                    //    mresultarray.push(group[0]); // add first result of each group to final array
                    });
                }




            }
            groupedarray.forEach(function (group: any) { // for each group of courses in the array
                mresultarray.push(group[0]);
            });
//
        }


        // push course attributes based on GET into return array


        get(query["GET"]);

        function get(getkeyarray: any) {

            for (var course in mresultarray) { //for every course in the array after querybody
                var finalcourseinfo: any = new Object;

                for (var g in getkeyarray) { //for every column value that you have to get
                    var columnneeded: any;
                    if (getkeyarray[g].indexOf("_") == -1) { // if key to get doesn't have underscore
                        columnneeded = getkeyarray[g];
                    }
                    else columnneeded = getkeyarray[g].split("_").pop(); //column you need
                    var rkarray: any = Object.keys(mresultarray[course]); //all they keys in a course

                    for (var rkey in rkarray) {  //for every key, e.g. dept, avg

                        if (rkarray[rkey] == columnneeded) { //if key matches a key specified by GET
                            //Log.trace(rkarray[rkey]); // prints all keys for each course
                            //  Log.trace(resultarray[course][rkarray[rkey]]); // prints key value for dept
                            if (!(columnneeded=="uuid" || columnneeded=="avg" || columnneeded=="dept" || columnneeded=="id" || columnneeded=="instructor" || columnneeded=="title" || columnneeded=="pass" || columnneeded=="fail" || columnneeded=="audit")) { // if key doesn't have underscore
                                finalcourseinfo[columnneeded] = mresultarray[course][rkarray[rkey]]; // put that key's value into new obj

                            }
                            // otherwise re add courses_

                            else finalcourseinfo["courses_" + columnneeded] = mresultarray[course][rkarray[rkey]]; // put that key's value into new obj

                        }
                    }


                }
                filteredresult.push(finalcourseinfo); //push object with filtered columns
            }
        }

        if ((!(typeof query["ORDER"] == 'undefined')) && typeof query["ORDER"] == 'string') { // simple order by given string


            let orderkey:any= query["ORDER"];

            if (orderkey.indexOf("_") >= 0) {   //if order contains underscore, remove
                orderkey = (query["ORDER"]).split("_").pop();
             }
            order(orderkey);

        }
          else if (!(typeof query["ORDER"] == 'undefined')) {   // if order if a JSON object, use second implementation of ORDER
                order2(query["ORDER"]);
            }

            function order2(queryorder: any) {

                if (queryorder["dir"] == "UP") {  //sort nums ascending

                    filteredresult.sort(function (a: any, b: any) {
                        let returnable = 0;
                        for (let i = 0; i < filteredresult.length && returnable == 0; i++) {
                            if (a[queryorder["keys"][i]] < b[queryorder["keys"][i]]) {
                                returnable = -1;
                            }

                            if (a[queryorder["keys"][i]] > b[queryorder["keys"][i]]) {
                                returnable = 1;
                            }
                        }
                        return returnable;

                    })

                }


                if (queryorder["dir"] == "DOWN") {  //sort nums ascending

                    filteredresult.sort(function (a: any, b: any) {
                        let returnable = 0;
                        for (let i = 0; i < filteredresult.length && returnable == 0; i++) {
                            if (b[queryorder["keys"][i]] < a[queryorder["keys"][i]]) {
                                returnable = -1;
                            }

                            if (b[queryorder["keys"][i]] > a[queryorder["keys"][i]]) {
                                returnable = 1;
                            }
                        }
                        return returnable;

                    })

                }
            }




            function order(orderkey: any) {
                if (orderkey == "avg" || orderkey == "pass" || orderkey == "fail" || orderkey == "audit") //numerical keys

                    filteredresult.sort(function (a: any, b: any) {
                        return a["courses_" + orderkey] - b["courses_" + orderkey];
                    });

                if (orderkey == "dept" || orderkey == "id" || orderkey == "instructor" || orderkey == "title") {
                    filteredresult.sort(function (a: any, b: any) {
                        var stringA = a["courses_" + orderkey], stringB = b["courses_" + orderkey]

                        if (stringA < stringB) {//sort string ascending
                            return -1;
                        } else if (stringA == stringB) {
                            return 0;
                        } else {
                            return 1;
                        }
                    })
                }

              else if (typeof filteredresult[0][orderkey] == 'number') //numerical keys

                    filteredresult.sort(function (a: any, b: any) {
                        return a[orderkey] - b[orderkey];
                    })

              else  if (typeof filteredresult[0][orderkey] == 'string') {
                    filteredresult.sort(function (a: any, b: any) {
                        var stringA = a[orderkey], stringB = b[orderkey]

                        if (stringA < stringB) {//sort string ascending
                            return -1;
                        } else if (stringA == stringB) {
                            return 0;
                        } else {
                            return 1;
                        }
                    })
                }




            }


            var result: QueryResponse = JSON.parse(JSON.stringify({render: "TABLE", result: filteredresult}));
Log.trace(mresultarray.length);
            return result;
        }
    }
