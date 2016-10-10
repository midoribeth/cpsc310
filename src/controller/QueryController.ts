/**
 * Created by rtholmes on 2016-06-19.
 */

import {Datasets} from "./DatasetController";
import Log from "../Util";

export interface QueryRequest {
    GET: string|string[];
    WHERE: {};
    ORDER: string;
    AS: string;
}

export interface QueryResponse {
}

export default class QueryController {
    private datasets: Datasets = null;

    constructor(datasets: Datasets) {
        this.datasets = datasets;
    }

    public isValid(query: QueryRequest): boolean {
        if (typeof query !== 'undefined' && query !== null && Object.keys(query).length > 0) {

            return true;
        }
        return false;
    }

    public query(query: QueryRequest): QueryResponse {
     //   Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');





            var dict:any = this.datasets["courses"];
            var resultarray:any=[];


        let querybody:any = query["WHERE"];
        let keyarray:any = Object.keys(querybody);
        let filterkey:any = keyarray[0];
        let orderkey:any =(query["ORDER"]).split("_").pop();
        var filteredresult:any=[];

        if (!(filterkey == "LT" || filterkey =="GT" || filterkey == "EQ" || filterkey=="IS" )){
            var resultdefault:QueryResponse = JSON.parse('{"render": "TABLE","result":[{ "courses_dept": "cnps", "courses_avg": 90.02 },{ "courses_dept": "dhyg", "courses_avg": 90.03 }]}');
            return resultdefault;
        }

        filter(filterkey, keyarray);

        function filter(key:string, querybody:any){

           if (key == "LT" || key =="GT" || key=="EQ"){
               mcomparison(key);
           }
           if (key == "IS"){
               lcomparison(key);
           }

        }


        function lcomparison(filterkey:string){
            var lkey2:any = Object.keys(querybody[filterkey])[0];  //e.g. courses_avg, courses_fail
            //  Log.trace("KEY VALUE:  " + querybody[filterkey][key2]); //e.g. query[where][GT][courses_avg]

            var comparevalue:any = querybody[filterkey][lkey2];
            var compareto:any = lkey2.split("_").pop();
            for (var key in dict) {

                for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                    let section = dict[key].result[i];
                    if (section[compareto] == comparevalue) {   //section.avg should be section.key2, can you use the dictionary you were working on here?

                        resultarray.push(section);

                    }
                }
            }




        }

        function mcomparison(filterkey:string){


            if (filterkey=="LT"){
                // Log.trace("KEY: " + Object.keys(querybody[filterkey])[0]);  //

                var key2:any = Object.keys(querybody[filterkey])[0];  //e.g. courses_avg, courses_fail
                //  Log.trace("KEY VALUE:  " + querybody[filterkey][key2]); //e.g. query[where][GT][courses_avg]

                var comparevalue:any = querybody[filterkey][key2];
                var compareto:any = key2.split("_").pop();
                for (var key in dict) {

                    for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                        let section = dict[key].result[i];
                        if (section[compareto]< comparevalue) {   //section.avg should be section.key2, can you use the dictionary you were working on here?

                            resultarray.push(section);

                        }
                    }
                }

            }

            if (filterkey=="GT"){
               // Log.trace("KEY: " + Object.keys(querybody[filterkey])[0]);  //

                var key2:any = Object.keys(querybody[filterkey])[0];  //e.g. courses_avg, courses_fail
              //  Log.trace("KEY VALUE:  " + querybody[filterkey][key2]); //e.g. query[where][GT][courses_avg]

                var comparevalue:any = querybody[filterkey][key2];
                var compareto:any = key2.split("_").pop();
                for (var key in dict) {

                    for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                        let section = dict[key].result[i];
                        if (section[compareto]> comparevalue) {   //section.avg should be section.key2, can you use the dictionary you were working on here?

                            resultarray.push(section);

                        }
                    }
                }
            }

            if (filterkey=="EQ"){

            //    Log.trace("KEY: " + Object.keys(querybody[filterkey])[0]);  //

                var key2:any = Object.keys(querybody[filterkey])[0];  //e.g. courses_avg, courses_fail
            //    Log.trace("KEY VALUE:  " + querybody[filterkey][key2]); //e.g. query[where][GT][courses_avg]

                var comparevalue:any = querybody[filterkey][key2];
                var compareto:any = key2.split("_").pop();
                for (var key in dict) {

                    for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                        let section = dict[key].result[i];
                        if (section[compareto] == comparevalue) {   //section.avg should be section.key2, can you use the dictionary you were working on here?

                            resultarray.push(section);

                        }
                    }
                }

            }




        }

    // push course attributes based on GET into return array


        get(query["GET"]);

        function get(getkeyarray:any) {

                for (var course in resultarray) { //for every course in the array after querybody
                    var finalcourseinfo: any = new Object;

                    for (var g in getkeyarray) { //for every column value that you have to get
                        var columnneeded: any = getkeyarray[g].split("_").pop(); //column you need
                        var rkarray: any = Object.keys(resultarray[course]); //all they keys in a course

                        for (var rkey in rkarray) {  //for every key, e.g. dept, avg

                            if (rkarray[rkey] == columnneeded) { //if key matches a key specified by GET
                                //Log.trace(rkarray[rkey]); // prints all keys for each course
                                //  Log.trace(resultarray[course][rkarray[rkey]]); // prints key value for dept

                                finalcourseinfo["courses_"+columnneeded] = resultarray[course][rkarray[rkey]]; // put that key's value into new obj

                            }


                        }

                        filteredresult.push(finalcourseinfo); //push object with filtered columns
                    }

                }
            }


        order(orderkey);

        function order(orderkey:any){
        if (orderkey =="avg" || orderkey =="pass" || orderkey == "fail" || orderkey== "audit") //numerical keys

            filteredresult.sort(function (a: any, b: any) {
                return a[orderkey] - b[orderkey];
            });

        }



        var result:QueryResponse =JSON.parse(JSON.stringify({render: "TABLE",result:filteredresult}));

        return result;
    }
}
