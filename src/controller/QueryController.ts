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
        Log.trace('????');

        var resp: QueryResponse;
        let as = query.AS;
        let order = query.ORDER;
        let get = query.GET;

        // TODO: implement this

        var resp: QueryResponse;
        let as = query.AS;
        let order = query.ORDER;
        let get = query.GET;

        return {Result: "test", Order: order, Get: get, As: as, ts: new Date().getTime()};
    }
}
