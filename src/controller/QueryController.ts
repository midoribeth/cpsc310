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
            var resultarray:any=[];


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

                                var r:any = {
                                    courses_avg: section.Avg,
                                    courses_dept: section.Subject

                                };
                                resultarray.push(r);

                            }
                        }
                    }
                }
            }


        if (where.GT) {

            GT();
        }




       /* let queryorder = query.ORDER;
        Log.trace("ORDER: " + JSON.stringify(queryorder));

        let queryas = query.AS;
        Log.trace("AS: " + JSON.stringify(queryas));
       */


        var result:any =JSON.parse(JSON.stringify({render: "TABLE",result:resultarray}));

        return result;
    }
}
