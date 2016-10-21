/**
 * Created by rtholmes on 2016-06-14.
 */
import restify = require('restify');
import fs = require('fs');

import DatasetController from '../controller/DatasetController';
import {Datasets} from '../controller/DatasetController';
import QueryController from '../controller/QueryController';
import InsightFacade from '../controller/InsightFacade';
import {InsightResponse} from "../controller/IInsightFacade";

import {QueryRequest} from "../controller/QueryController";
import Log from '../Util';

export default class RouteHandler {

    private static datasetController = new DatasetController();

    private static insightFacade = new InsightFacade();

    public static getHomepage(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RoutHandler::getHomepage(..)');
        fs.readFile('./src/rest/views/index.html', 'utf8', function (err: Error, file: Buffer) {
            if (err) {
                res.send(500);
                Log.error(JSON.stringify(err));
                return next();
            }
            res.write(file);
            res.end();
            return next();
        });
    }

    public static  putDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::postDataset(..) - params: ' + JSON.stringify(req.params));

        try {
            var id: string = req.params.id;

            // stream bytes from request into buffer and convert to base64
            // adapted from: https://github.com/restify/node-restify/issues/880#issuecomment-133485821
            let buffer: any = [];
            req.on('data', function onRequestData(chunk: any) {
                Log.trace('RouteHandler::postDataset(..) on data; chunk length: ' + chunk.length);
                buffer.push(chunk);
            });

            req.once('end', function () {
                let concated = Buffer.concat(buffer);
                req.body = concated.toString('base64');
                Log.trace('RouteHandler::postDataset(..) on end; total length: ' + req.body.length);

                //var insightResponse: InsightResponse;
                RouteHandler.insightFacade.addDataset(id, req.body).then(function(response: InsightResponse) {
                    res.json(response.code);
                }).catch(function (err: Error) {
                    res.json(400);
                });
                //res.json(insightResponse.code);

                /*let controller = RouteHandler.datasetController;
                let idExists:boolean = controller.inMemory(id);
                controller.process(id, req.body).then(function (result) {
                    if (!idExists) {
                        res.json(204);
                    } else {
                        res.json(201);
                    }
                 Log.trace('RouteHandler::postDataset(..) - processed');
                }).catch(function (err: Error) {
                    Log.trace('RouteHandler::postDataset(..) - ERROR: ' + err.message);
                    res.json(400, {error: err.message});
                });*/
            });

        } catch (err) {
            Log.error('RouteHandler::postDataset(..) - ERROR: ' + err.message);
            res.send(400, {error: err.message});
        }
        return next();
    }




    public static postQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::postQuery(..) - params: ' + JSON.stringify(req.params));
        try {
            let query: any = req.params;

            RouteHandler.insightFacade.performQuery(query).then(function(response: InsightResponse) {
                res.json(response.code, response.body);
            }).catch(function (err: Error) {
                res.json(400, {error: err.message});
            });

            /*try {
                RouteHandler.datasetController.getDatasets();
            } catch (err) {
                res.json(424, {missing: "courses"});
            }

            let datasets: Datasets = RouteHandler.datasetController.getDatasets();

            var idfull:any = (query["GET"][0]);
            var id:any= idfull.substring(0, idfull.indexOf("_"));
            let controller = new QueryController(datasets);


            if (datasets[id] == null) {
                res.json(424, {missing: id});
            }

            else if (isValid === true) {
                let result = controller.query(query);
                res.json(200, result);
            }
            else {
                res.json(400, {error: 'Query failed.'});
            }*/

        } catch (err) {
            Log.error('RouteHandler::postQuery(..) - ERROR: ' + err);
            res.send(400, {error: err.message});
        }
        return next();
    }

    public static deleteDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::deleteDataset(..) - params: ' + JSON.stringify(req.params));
        try {
            var id: string = req.params.id;

            RouteHandler.insightFacade.removeDataset(id).then(function(response: InsightResponse) {
                res.json(response.code);
            }).catch(function (err: Error) {
                res.json(400);
            })

            /*let controller = RouteHandler.datasetController;
            var fs = require('fs'),
                path = './data/'+ id+".json",
                stats: any;

            try {
                stats = fs.statSync(path);
                controller.delete(id);
                res.json(204, {status: 'Dataset deleted'});
            }
            catch (e) {
                res.json(404, {status: 'Dataset does not exist'});
            }*/

        } catch (err) {
            Log.error('RouteHandler::deleteDataset(..) = ERROR: ' + err.message);
            res.send(400, {error: err.message});
        }
        return next();
    }

}
