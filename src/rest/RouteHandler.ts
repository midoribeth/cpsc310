/**
 * Created by rtholmes on 2016-06-14.
 */
import restify = require('restify');
import fs = require('fs');

import DatasetController from '../controller/DatasetController';
import {Datasets} from '../controller/DatasetController';
import QueryController from '../controller/QueryController';

import {QueryRequest} from "../controller/QueryController";
import Log from '../Util';

export default class RouteHandler {

    private static datasetController = new DatasetController();

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

                var fs = require('fs'),
                    path = './data/'+ id +".json";

                fs.exists(path, (exists:any) => {
                    if (exists) {
                        Log.trace("File already exists.");
                        res.json(201, {status: "File already exists."});
                    } else {
                        Log.trace("File added.");
                        res.json(204, {status: "File added."});
                    }
                })

                let controller = RouteHandler.datasetController;
                controller.process(id, req.body).then(function (result) {
    //check if file with ID already exists in ./data and sends response code

                        //stats:any;

                    //doesn't output 204 on first input but returns 204 when manually delete and then add
                    /*try {
                        stats = fs.statSync(path);
                        Log.trace("File already exists.");
                        res.json(201, {status: "File already exists"});
                       //201
                    }
                    catch (e) {
                        Log.trace("File did not already exist.");
                        res.json(204, {success: result});
                        //204
                    }*/



                 Log.trace('RouteHandler::postDataset(..) - processed');
                }).catch(function (err: Error) {
                    Log.trace('RouteHandler::postDataset(..) - ERROR: ' + err.message);
                    res.json(400, {err: err.message});
                });
            });

        } catch (err) {
            Log.error('RouteHandler::postDataset(..) - ERROR: ' + err.message);
            res.send(400, {err: err.message});
        }
        return next();
    }

    public static deleteDataset(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::deleteDataset(..) - params: ' + JSON.stringify(req.params));
        try {
            var id: string = req.params.id;
            let controller = RouteHandler.datasetController;
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
            }

        } catch (err) {
            Log.error('RouteHandler::deleteDataset(..) = ERROR: ' + err.message);
            res.send(400, {err: err.message});
        }
        return next();
    }


    public static postQuery(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('RouteHandler::postQuery(..) - params: ' + JSON.stringify(req.params));
        try {
            let query: any = req.params;
            let datasets: Datasets = RouteHandler.datasetController.getDatasets();
            let controller = new QueryController(datasets);
            let isValid = controller.isValid(query);

            var idfull:any = (query["GET"][0]);
            var id:any= idfull.substring(0, idfull.indexOf("_"));

            if (datasets[id] == null){
                res.json(424, {missing: id});
            }
            else if (isValid === true) {
                let result = controller.query(query);
                res.json(200, result);
            }
        } catch (err) {
            Log.error('RouteHandler::postQuery(..) - ERROR: ' + err);
            res.send(400, {err: err.message});
        }
        return next();
    }

}
