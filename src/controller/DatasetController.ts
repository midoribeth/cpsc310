/**
 * Created by rtholmes on 2016-09-03.
 */

import Log from "../Util";
import JSZip = require('jszip');

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
    public getDataset(id: string): any {
        // TODO: this should check if the dataset is on disk in ./data if it is not already in memory.
        /*var fs = require('fs');
        var path = './data/' + id + '.json';
        var stats:any;

        stats = fs.statSync(path);*/

        return this.datasets[id];
    }

    public getDatasets(): Datasets {
        // TODO: if datasets is empty, load all dataset files in ./data from disk

        if (this.datasets == {}) {
            var fs = require('fs');
            var path = '.data/';
            fs.readFile(path, (err:any, data:any) => {
                if (err) throw err;
                this.datasets["courses"] = data;
            })
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
        var dict: { [course: string]: {} } = { }; //dictionary

        var promises: any=[];

        var p1 = new Promise(function (fulfill, reject) {
            try {
                let myZip = new JSZip();

                myZip.loadAsync(data, {base64: true}).then(function (zip: JSZip) {
                    Log.trace('DatasetController::process(..) - unzipped');



                    let processedDataset = {};

                    // TODO: iterate through files in zip (zip.files)
                    // The contents of the file will depend on the id provided. e.g.,
                    // some zips will contain .html files, some will contain .json files.
                    // You can depend on 'id' to differentiate how the zip should be handled,
                    // although you should still be tolerant to errors.



                    zip.forEach(function(relativePath: string, file: JSZipObject) {
                        if (!file.dir) { //skip the courses folder and go directly to course files inside

                            var p2 = file.async("string").then(function (data) { //for each course file

                                var coursedata = JSON.parse(data); // make file data a JSON object "coursedata"
                                var coursename = file.name.substring(8); //substring 8 to get rid of "courses/"
                                //Log.trace("Course Name: " + coursename); //print out JSON object associated w/ each course section
                                var pcdarray:any=[];
                                if (!(typeof (coursedata.result[0]) == 'undefined')) {  //don't save courses without results
                                    for (var i=0; i<coursedata.result.length; i++){  //rename subject, professor and course

                                        var processedcoursedata = {

                                            dept: coursedata.result[i].Subject,
                                            id: coursedata.result[i].Course,
                                            avg: coursedata.result[i].Avg,
                                            instructor: coursedata.result[i].Professor,
                                            title: coursedata.result[i].Title,
                                            pass: coursedata.result[i].Pass,
                                            fail: coursedata.result[i].Fail,
                                            audit: coursedata.result[i].Audit,

                                        }
                                        pcdarray.push(processedcoursedata);

                                    }
                                    var final ={
                                        result:pcdarray
                                    }
                                    dict[coursename] = final; //save coursedata to dict[coursename]
                                }




                                // Log.trace("PRINT INSIDE[]: " + JSON.stringify(dict["ADHE329"])); // but if you print in the loop it works
                            })

                       promises.push(p2);

                        }

                    });

                  Promise.all(promises).then(function() {
                        fulfill(true);
                        processedDataset = dict; //set our dictionary to the processedDataset
                     //   Log.trace("PRINT DICT[]: " + JSON.stringify(processedDataset["AANB500"]));
                        that.save(id, processedDataset);
                    });

                    //dict["test1"] = "test1";
                    //Log.trace("PRINT DICT[]: " + JSON.stringify(dict["ADHE329"])); //print out contents of ADHE329 from dict, doesn't work bc asyn
                    //Log.trace("PRINT DICT['test1']: " + dict["test1"]); //this works since dict["test1"]="test1" happens outside the loop
                    //Log.trace("PRINT DICT['test2']: " + dict["test2"]); //doesn't work since dict["test2"]="test2" happens inside loop


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

        this.datasets[id] = processedDataset;

        // TODO: actually write to disk in the ./data directory


        var fs = require('fs');
        var dir = './data';

        if (!fs.existsSync(dir)){       //if ./data directory doesn't already exist, create
            fs.mkdirSync(dir);
        }

      fs.writeFile("./data/" +id+ '.json', JSON.stringify(processedDataset), function (err:any) {
            if (err) {
                return Log.trace("Error writing file");
            }
            Log.trace('Saved to /data');
        });

    }

    public delete(id: string) {
        var fs = require('fs');
        var path = './data/' + id + '.json';
        fs.unlink(path);
        this.datasets = {};

    }

}
