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

            var response: QueryResponse;
            var dict:any = this.datasets["courses"];
           // var result:any;


        /* course object filtering example

            for (var key in dict) { //for every course object in the dictionary
                for(var i= 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                    var section = dict[key].result[i];

                    if( section.Avg > 80) { // so we would have to adjust this based on query.WHERE's filters,
                                            // e.g. query.WHERE = {"GT":{"courses_avg":"90"}}, which is a JSON object

                        result.push(section);
                    }
                  }
            }


*/
        Log.trace(JSON.stringify(dict["ENGL112"].result[0].Professor));
        let queryget = query.GET;
        Log.trace("GET: " + JSON.stringify(queryget));


        let where= JSON.parse(JSON.stringify(query.WHERE));


            function GT() {

                if (where.GT.courses_avg) {
                    for (var key in dict) {

                        for (var i = 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                            let section = dict[key].result[i];
                            if (section.Avg > where.GT.courses_avg) {
                              //  Log.trace("courses_avg: " + section.Avg);
                            }
                        }
                    }
                }
            }


        if (where.GT) {

            GT();
        }



        let queryorder = query.ORDER;
        Log.trace("ORDER: " + JSON.stringify(queryorder));

        let queryas = query.AS;
        Log.trace("AS: " + JSON.stringify(queryas));



        return {render: "TABLE", Get: queryget, ts: new Date().getTime()};
    }
}
