/**
 * Created by rtholmes on 2016-09-03.
 */

import Log from "../Util";
import JSZip = require('jszip');
import fs = require('fs');
import parse5 = require('parse5');
import { ASTNode } from 'parse5';
import {ASTAttribute} from "parse5";

/**
 * In memory representation of all datasets.
 */
export interface Datasets {
    [id: string]: {};
}

export default class DatasetController {

    private datasets: Datasets = {};


    constructor() {
        Log.trace('DatasetController::init()');
    }
    /**
     * Returns the referenced dataset. If the dataset is not in memory, it should be
     * loaded from disk and put in memory. If it is not in disk, then it should return
     * null.
     *
     * @param id
     * @returns {{}}
     */
    /*    public getDataset(id: string): any {
     // TODO: this should check if the dataset is on disk in ./data if it is not already in memory.
     /!*var fs = require('fs');
     var path = './data/' + id + '.json';
     var stats:any;

     stats = fs.statSync(path);*!/

     return this.datasets[id];
     }*/

    public getDatasets(): Datasets {
        // TODO: if datasets is empty, load all dataset files in ./data from disk
        var fs = require('fs');
        //   if (this.datasets==null){


        try {
            if (fs.statSync('./data').isDirectory()) {
                var data: any = fs.readFileSync('./data/courses.json', 'utf8');
                this.datasets["courses"] = JSON.parse(data); //testing getting info from ./data
            }
        }catch (e){
            Log.trace(e);
        }
        try {
            if (fs.statSync('./data').isDirectory()) {
                var data2: any = fs.readFileSync('./data/rooms.json', 'utf8');
                this.datasets["rooms"] = JSON.parse(data2); //testing getting info from ./data
            }
        }catch (e){
            Log.trace(e);
        }
        return this.datasets;
    }

    /**
     * Process the dataset; save it to disk when complete.
     *
     * @param id
     * @param data base64 representation of a zip file
     * @returns {Promise<boolean>} returns true if successful; false if the dataset was invalid (for whatever reason)
     */
    public process(id: string, data: any): Promise<boolean> {
        Log.trace('DatasetController::process( ' + id + '... )');

        let that = this;

        let processedDataset = {};
        var dict: { [course: string]: {} } = { }; //dictionary

        var promises: any=[];

        var p1 = new Promise(function (fulfill, reject) {
            try {
                let myZip = new JSZip();

                myZip.loadAsync(data, {base64: true}).then(function (zip: JSZip) {
                    Log.trace('DatasetController::process(..) - unzipped');



                    // TODO: iterate through files in zip (zip.files)

                    if (id == "courses") {
                        zip.forEach(function (relativePath: string, file: JSZipObject) {
                            if (!file.dir) { //skip the courses folder and go directly to course files inside

                                var p2 = file.async("string").then(function (data) { //for each course file

                                    var coursedata = JSON.parse(data); // make file data a JSON object "coursedata"
                                    var coursename = file.name.substring(8); //substring 8 to get rid of "courses/"
                                    //Log.trace("Course Name: " + coursename); //print out JSON object associated w/ each course section
                                    var pcdarray: any = [];
                                    if (!(typeof (coursedata.result[0]) == 'undefined')) {  //don't save courses without resultsnp
                                        for (var i = 0; i < coursedata.result.length; i++) {  //rename subject, professor and course

                                            var processedcoursedata = {

                                                dept: coursedata.result[i].Subject,
                                                id: coursedata.result[i].Course,
                                                avg: coursedata.result[i].Avg,
                                                instructor: coursedata.result[i].Professor,
                                                title: coursedata.result[i].Title,
                                                pass: coursedata.result[i].Pass,
                                                fail: coursedata.result[i].Fail,
                                                audit: coursedata.result[i].Audit,

                                                uuid: coursedata.result[i]["id"].toString(),

                                            };
                                            pcdarray.push(processedcoursedata);

                                        }
                                        var final = {
                                            result: pcdarray
                                        };
                                        dict[coursename] = final; //save coursedata to dict[coursename]
                                    }

                                    // Log.trace("PRINT INSIDE[]: " + JSON.stringify(dict["ADHE329"])); // but if you print in the loop it works
                                });

                                promises.push(p2);
                            }
                        });
                    }
                    if (id == "rooms"){
                        var tbodyrawhtml:any;
                        var parse5:any = require('parse5');
                        var urlmap:any = new Object();

                        zip.file("index.htm").async("string").then(function (data) {
                            tbodyrawhtml = data.substring(data.indexOf("<tbody>"), data.indexOf("</tbody>") + 8);
                            var tbodyhtml: ASTNode = parse5.parse(tbodyrawhtml);

                            for (var i = 1; i < (tbodyhtml.childNodes[0].childNodes[1].childNodes.length ); i += 2) {
                                var url: any = tbodyhtml.childNodes[0].childNodes[1].childNodes[i].attrs[0].value;

                                if (url.indexOf("dummy") == -1) { // don't save dummyimage link
                                    urlmap[url.substring(43, url.length)]= url;
                                }
                            }

                            return urlmap;

                        }).then(function (um) {
                            zip.forEach(function(relativePath: string, file: JSZipObject) {
                                var rno:any;
                                var sname:any;
                                var link:any;
                                var fname:any;
                                var path:any= "./"+ relativePath;
                                var prdarray: any = [];
                                var addr:any;
                                var seats:any;
                                var type:any;
                                var furniture:any;
                                var latlon:any;

                                for (var entry in urlmap) { // go through every building url in index.html

                                    if (path ==  urlmap[entry]) {  //if that building is the current file in zip
                                        var p3 = file.async("string").then(function (data) { //get building data

                                            if (data.indexOf("<tbody>") >=0) {
                                                var rawroomhtml: any = data.substring(data.indexOf('<div id="building-info">'), data.indexOf("Wayfinding map") + 32);
                                                var roomhtml: ASTNode = parse5.parse(rawroomhtml);


                                                fname=roomhtml.childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;
                                                sname= path.substring(43, path.length);
                                                addr= roomhtml.childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes[0].childNodes[0].value;
                                                var p5 = that.getlatlon(encodeURI(addr));
                                                p5.then(function(r:any) {

                                                    var rawtablehtml2: any = data.substring(data.indexOf('<table class="views-table cols-5 table" >'), data.indexOf("</table>") + 8);
                                                    var fulltablehtml: ASTNode = parse5.parse(rawtablehtml2);

                                                    for (var i = 1; i < fulltablehtml.childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes.length; i += 2) {
                                                        //i=9
                                                        rno = fulltablehtml.childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes[i].childNodes[1].childNodes[1].childNodes[0].value.trim();
                                                        seats = fulltablehtml.childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes[i].childNodes[3].childNodes[0].value.trim();
                                                        furniture = fulltablehtml.childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes[i].childNodes[5].childNodes[0].value.trim();
                                                        type = fulltablehtml.childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes[i].childNodes[7].childNodes[0].value.trim();
                                                        link = fulltablehtml.childNodes[0].childNodes[1].childNodes[0].childNodes[3].childNodes[i].childNodes[9].childNodes[1].attrs[0].value.trim();

                                                        var processedroomdata = {
                                                            fullname: fname,// Full building name (e.g., "Hugh Dempster Pavilion").
                                                            shortname: sname, //Short building name (e.g., "DMP").
                                                            number: rno,// The room number. Not always a number, so represented as a string.
                                                            name: sname + "_" + rno,// The room id; should be rooms_shortname+"_"+rooms_number.
                                                            address: addr, //The building address. (e.g., "6245 Agronomy Road V6T 1Z4").
                                                            lat: r[0],// The latitude of the building. Instructions for getting this field are below.
                                                            long: r[1], //The latitude of the building. Instructions for getting this field are below.
                                                            seats: seats, //The number of seats in the room.
                                                            type: type, //The room type (e.g., "Small Group").
                                                            furniture: furniture, //The room type (e.g., "Classroom-Movable Tables & Chairs").
                                                            href: link,
                                                        };

                                                        prdarray.push(processedroomdata);
                                                    }
                                                });

                                                var finalr = {
                                                    result: prdarray
                                                };

                                                dict[sname+"_"+rno] = finalr; //save all the room data for a building to dict[building]
                                            }
                                        })
                                    }
                                }
                                promises.push(p3);

                            });
                        });
                    }

                    Promise.all(promises).then(function() {
                        fulfill(true);

                        setTimeout(function(){  processedDataset = dict; }, 5000);
                        setTimeout(function(){ that.save(id, processedDataset); }, 5100);

                        //  processedDataset = dict; //set our dictionary to the processedDataset
                        //  that.save(id, processedDataset);
                    });

                }).catch(function (err) {
                    Log.trace('DatasetController::process(..) - unzip ERROR: ' + err.message);
                    reject(err);
                });
            } catch (err) {
                Log.trace('DatasetController::process(..) - ERROR: ' + err);
                reject(err);
            }


        });


        return p1;

    }

    /**
     * Writes the processed dataset to disk as 'id.json'. The function should overwrite
     * any existing dataset with the same name.
     *
     * @param id
     * @param processedDataset
     */
    private save(id: string, processedDataset: any) {
        // add it to the memory model

        //this.datasets[id] = processedDataset;

        // TODO: actually write to disk in the ./data directory

        var fs = require('fs');
        var dir = './data';

        if (!fs.existsSync(dir)){       //if ./data directory doesn't already exist, create
            fs.mkdirSync(dir);
        }

        fs.writeFile("./data/" +id+ '.json', JSON.stringify(processedDataset), function (err:any) {
            if (err) {
                Log.trace("Error writing file");
            }
            Log.trace('Saved to /data');
        });

        this.datasets[id]=this.getDatasets();
    }

    public delete(id: string) {
        var fs = require('fs');
        var path = './data/' + id + '.json';

        if (this.datasets[id]) {
            delete this.datasets[id];
            this.datasets[id] = null;
        }


        if (fs.statSync(path).isFile()) {
            fs.unlink(path);
        }

    }



    public getlatlon(encodedaddress:string):any{

        return new Promise(function(fulfill, reject) {
            var result: any=[];

            var http: any = require('http');
            let path = "/api/v1/team63/" + encodedaddress;

            var options = {
                host: "skaha.cs.ubc.ca",
                port: 8022,
                path: path
            };

            http.get(options, (res: any) => {
                const statusCode = res.statusCode;
                const contentType = res.headers['content-type'];

                let error: any;
                if (statusCode !== 200) {
                    error = new Error(`Request Failed.\n` +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error(`Invalid content-type.\n` +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    console.log(error.message);
                    // consume response data to free up memory
                    res.resume();
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk: any) => rawData += chunk);
                res.on('end', () => {
                    try {
                        let parsedData = JSON.parse(rawData);
                        result[0] = parsedData.lat; //latitude
                        result[1] = parsedData.lon;
                        fulfill(result);
                        //  Log.trace(result);
                        return result;

                    } catch (e) {
                        console.log(e.message);
                        reject(error);
                    }
                });
            }).on('error', (e: any) => {
                console.log(`Got error: ${e.message}`);
            });
            // return result;

        })
    }

    public inMemory(id: string): boolean {
        var fs = require('fs'),
            path = './data/'+ id +".json";

        return fs.existsSync(path);
    }

    //method to parse HTML documents
    public parseDataset(data: any): Promise<boolean> {
        return new Promise(function (fulfill, reject) {
            try {
                //parse over HTML document

                var roomData: ASTNode = parse5.parse(data);
                //Log.trace(roomData.nodeName);

                printNode(roomData);

                function printNode(node: ASTNode) {

                    var html=parse5.serialize(roomData);
                    //   var fragment = parse5.parseFragment('<tbody></tbody>');
                    //  var fragmentHtml= parse5.serialize(fragment);

                    var test:any= html.indexOf("<tbody>");
                    Log.trace(test);
                }



            } catch (err) {
                reject(err);
            }

        })
    }

}