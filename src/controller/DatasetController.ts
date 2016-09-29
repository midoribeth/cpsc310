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

        return this.datasets[id];
    }

    public getDatasets(): Datasets {
        // TODO: if datasets is empty, load all dataset files in ./data from disk

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


        return new Promise(function (fulfill, reject) {
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

                            file.async("string").then(function (data) { //for each course file

                                var coursedata = JSON.parse(data); // make file data a JSON object "coursedata"
                                var coursename = file.name.substring(8); //substring 8 to get rid of "courses/"
                                Log.trace("Course Name: " + coursename); //print out JSON object associated w/ each course section
     
                                dict[coursename]= coursedata; //save coursedata to dict[coursename]
                                dict["test2"]="test2"; // doesn't work
                          //      Log.trace("PRINT INSIDE[]: " + JSON.stringify(dict["ADHE329"])); // but if you print in the loop it works
                            })
                        }
                    });

                    dict["test1"]="test1";
                    Log.trace("PRINT DICT[]: " + JSON.stringify(dict["ADHE329"])); //print out contents of ADHE329 from dict, doesn't work bc asyn
                    Log.trace("PRINT DICT['test1']: " + dict["test1"]); //this works since dict["test1"]="test1" happens outside the loop
                    Log.trace("PRINT DICT['test2']: " + dict["test2"]); //doesn't work since dict["test2"]="test2" happens inside loop


                    processedDataset= dict; //set our dictionary to the processeddataset
                    that.save(id, processedDataset); // ***need to make sure this is done after all the loops

                    fulfill(true);



                }).catch(function (err) {
                    Log.trace('DatasetController::process(..) - unzip ERROR: ' + err.message);
                    reject(err);
                });
            } catch (err) {
                Log.trace('DatasetController::process(..) - ERROR: ' + err);
                reject(err);
            }


        });



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
    }
}
