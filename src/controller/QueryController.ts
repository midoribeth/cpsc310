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

            var dict = this.datasets["courses"];

        // course object filtering example

            for (var key in dict) { //for every course object in the dictionary

                var result=[];

                for(var i= 0, len = dict[key].result.length; i < len; i++) { //for every result in course object
                    var section = dict[key].result[i];


                        result.push(section);
                    }
                  }
            }

         Log.trace(JSON.stringify(result[0]));  // prints the first course object fulfilling the criteria




        var response: QueryResponse;

        let queryget = query.GET;
        Log.trace("GET: " + JSON.stringify(queryget));

        let querywhere = query.WHERE;
        Log.trace("WHERE: " + JSON.stringify(querywhere));

        let queryorder = query.ORDER;
        Log.trace("ORDER: " + JSON.stringify(queryorder));

        let queryas = query.AS;
        Log.trace("AS: " + JSON.stringify(queryas));
        // TODO: implement this



        return {Result: "test", Get: queryget, ts: new Date().getTime()};
    }
}
