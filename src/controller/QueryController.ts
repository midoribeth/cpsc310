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
        Log.trace('QueryController::query( ' + JSON.stringify(query) + ' )');


            var dict:any = this.datasets["courses"];
            var resultarray:any=[];


        let querybody:any = query["WHERE"];
        let keyarray:any = Object.keys(querybody);
        let filterkey:any = keyarray[0];

        filter(filterkey, keyarray);

        function filter(key:string, querybody:any){
           if (key == "LT" || key =="GT" || key=="EQ"){
               mcomparison(key);
           }

        }

        function mcomparison(filterkey:string){


            if (filterkey=="LT"){

            }

            if (filterkey=="GT"){
                Log.trace("KEY: " + Object.keys(querybody[filterkey])[0]);  //

                var key2:any = Object.keys(querybody[filterkey])[0];  //e.g. courses_avg, courses_fail
                Log.trace("KEY VALUE:  " + querybody[filterkey][key2]); //e.g. query[where][GT][courses_avg]

                var comparevalue:any = querybody[filterkey][key2];

                for (var key in dict) {

                    for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                        let section = dict[key].result[i];
                        if (section.avg > comparevalue) {   //section.avg should be section.key2, can you use the dictionary you were working on here?

                            resultarray.push(section);

                        }
                    }
                }
            }

            if (filterkey=="EQ"){

            }




        }



       /// Log.trace(JSON.stringify(resultarray));

        var result:any =JSON.parse(JSON.stringify({render: "TABLE",result:resultarray}));

        return result;
    }
}
