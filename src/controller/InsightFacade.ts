/**
 * Created by midoritakeuchi on 2016-10-17.
 */
import {IInsightFacade, InsightResponse} from "../controller/IInsightFacade";

import {QueryRequest} from "./QueryController";
import DatasetController from '../controller/DatasetController';
import {Datasets} from '../controller/DatasetController';
import QueryController from '../controller/QueryController';
import Log from '../Util';

export default class InsightFacade implements IInsightFacade {
    private static datasetController = new DatasetController();

    addDataset(id: string, content: string): Promise<InsightResponse> {

        return new Promise(function (fulfill, reject) {
            try {
                let controller = InsightFacade.datasetController;
                let idExists: boolean = controller.inMemory(id);
                controller.process(id, content).then(function (result) {
                    if (!idExists) {
                        fulfill({code: 204, body: 'New Dataset added'});
                    } else {
                        fulfill({code: 201, body: 'Dataset already added'});
                    }
                }).catch(function (err: Error) {
                    reject({code: 400, error: err.message});
                })
            } catch (err) {
                reject({code: 400, error: err.message});
            }
        });
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            try {
                let controller = InsightFacade.datasetController;
                var fs = require('fs'),
                    path = './data/'+ id+".json",
                    stats: any;

                try {
                    stats = fs.statSync(path);
                    controller.delete(id);
                    fulfill({code: 204, body: 'Dataset deleted.'});
                }
                catch (e) {
                    reject({code: 400, error: 'Dataset does not exists.'});
                }
            }
            catch (err) {
                reject({code: 400, error: err.message});
            }
        });
    }

    performQuery(query: QueryRequest): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {

            try {
                InsightFacade.datasetController.getDatasets();
            } catch (err) {
                reject({code: 424, missing: "courses"});
            }

            let datasets: Datasets = InsightFacade.datasetController.getDatasets();

            var idfull:any = (query["GET"][0]);
            var id:any= idfull.substring(0, idfull.indexOf("_"));
            let controller = new QueryController(datasets);
            let isValid = controller.isValid(query);

            Log.trace('if');
            if (datasets[id] == null) {
                Log.trace('id null');
                reject({code: 424, missing: 'id'});
            }

            else if (isValid) {
                Log.trace('in promise');
                let result = controller.query(query);
                fulfill({code: 200, body: result});
            }

            else {
                Log.trace('reject');
                reject({code: 400, error: 'Query failed.'});
            }
        });
    }
}