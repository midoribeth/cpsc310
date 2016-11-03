/**
 * Created by midoritakeuchi on 2016-10-18.
 */
import fs = require('fs');
import Log from "../src/Util";
import {expect} from 'chai';
import InsightFacade from "../src/controller/InsightFacade";
import {InsightResponse} from "../src/controller/IInsightFacade";

import {QueryRequest} from "../src/controller/QueryController";

describe("InsightFacade", function () {
this.timeout(30000);
    var zipFileContents: string = null;
    var sampleQuery1: any;
    var sampleQuery2: any;
    var sampleQuery3: any;
    var sampleQuery4: any;
    var facade: InsightFacade = null;
    before(function () {
        Log.info('InsightController::before() - start');
        // this zip might be in a different spot for you
        zipFileContents = new Buffer(fs.readFileSync('310courses.1.0.zip')).toString('base64');
        sampleQuery1 = JSON.parse(fs.readFileSync('./test/results/q4.json', 'utf8'));
        sampleQuery2 = JSON.parse(fs.readFileSync('./test/results/q5.json', 'utf8'));
        sampleQuery3 = JSON.parse(fs.readFileSync('./test/results/q6.json', 'utf8'));
        sampleQuery4 = JSON.parse(fs.readFileSync('./test/results/q7.json', 'utf8'));

        try {
            // what you delete here is going to depend on your impl, just make sure
            // all of your temporary files and directories are deleted
            fs.unlinkSync('./data/courses.json');
        } catch (err) {
            // silently fail, but don't crash; this is fine
            Log.warn('InsightController::before() - id.json not removed (probably not present)');
        }
        Log.info('InsightController::before() - done');
    });

    beforeEach(function () {
        facade = new InsightFacade();
    });

    it("Should be able to add a new dataset (204)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        return facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should be able to update an existing dataset (201)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        return facade.addDataset('courses', zipFileContents).then(function (response: InsightResponse) {
            expect(response.code).to.equal(201);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should not be able to add an invalid dataset (400)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        return facade.addDataset('courses', 'some random bytes').then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Should not be able to respond to a query with an empty GET", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": [],
            "WHERE": {
                "GT": {
                    "courses_avg": 90
                }
            },
            "ORDER": "courses_avg",
            "AS": "TABLE"
        }
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        })
    });

    it("Should be able to respond to query1 (200)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.body).to.deep.equal(sampleQuery1);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });


    it("Should be able to respond to query2 (200)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["courses_dept", "courses_id", "courseAverage", "maxFail"],
            "WHERE": {},
            "GROUP": [ "courses_dept", "courses_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}}, {"maxFail": {"MAX": "courses_fail"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "maxFail", "courses_dept", "courses_id"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.body).to.deep.equal(sampleQuery2);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it ("Should be able to respond to query3 (200)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["courses_dept", "courses_id", "numSections"],
            "WHERE": {},
            "GROUP": [ "courses_dept", "courses_id" ],
            "APPLY": [ {"numSections": {"COUNT": "courses_uuid"}} ],
            "ORDER": { "dir": "UP", "keys": ["numSections", "courses_dept", "courses_id"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.body).to.deep.equal(sampleQuery3);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it ("Should be able to respond to query4 (200)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["courses_dept", "courses_id", "numSection", "averageGrade", "countPass", "averageFail"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}},
            "GROUP": [ "courses_dept", "courses_id" ],
            "APPLY": [ {"numSection": {"COUNT": "courses_uuid"}}, {"averageGrade": {"AVG": "courses_avg"}},
                {"countPass": {"COUNT": "courses_pass"}}, {"averageFail": {"AVG": "courses_fail"}}
            ],
            "ORDER": { "dir": "DOWN", "keys": ["courses_id"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.body).to.deep.equal(sampleQuery4);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should not be able to query a resource that has not been PUT (424)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["test_dept", "test_avg"],
            "WHERE": {
                "GT": {
                    "test_avg": 90
                }
            },
            "ORDER": "test_avg",
            "AS": "TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(424);
        });
    });

    it("Should not be able to query with APPLY but not GROUP (400)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Should not be able to query with GROUP but not APPLY (400)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "courses_id" ],
            "ORDER": { "dir": "UP", "keys": ["courses_id"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("Should not be able to query with invalid GROUP keys", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["courses_id", "courseAverage"],
            "WHERE": {"IS": {"courses_dept": "cpsc"}} ,
            "GROUP": [ "coursess_id" ],
            "APPLY": [ {"courseAverage": {"AVG": "courses_avg"}} ],
            "ORDER": { "dir": "UP", "keys": ["courseAverage", "courses_id"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it("All keys in GET should be in either GROUP or APPLY (400)", function () {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["numSections", "courses_dept", "courses_id"],
            "WHERE": {},
            "GROUP": [ "courses_dept" ],
            "APPLY": [ {"numSections": {"COUNT": "courses_uuid"}} ],
            "ORDER": { "dir": "UP", "keys": ["numSections", "courses_dept"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(400);
        });
    });

    it ("All keys in GET that are not separated by an underscore should appear in APPLY (400)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        let query: QueryRequest = {
            "GET": ["courses_dept", "courses_id", "numSections"],
            "WHERE": {},
            "GROUP": [ "courses_dept", "courses_id" ],
            "APPLY": [ {"numSections": {"COUNT": "courses_uuid"}} ],
            "ORDER": { "dir": "UP", "keys": ["numSections", "courses_dept", "courses_id"]},
            "AS":"TABLE"
        };
        return facade.performQuery(query).then(function (response: InsightResponse) {
            expect(response.body).to.deep.equal(sampleQuery3);
            expect(response.code).to.equal(200);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });


    it("Should be able to delete a dataset (204)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        return facade.removeDataset('courses').then(function (response: InsightResponse) {
            expect(response.code).to.equal(204);
        }).catch(function (response: InsightResponse) {
            expect.fail('Should not happen');
        });
    });

    it("Should not be able to delete a dataset that has not been PUT (404)", function() {
        var that = this;
        Log.trace("Starting test: " + that.test.title);
        return facade.removeDataset('Nonexistant id').then(function (response: InsightResponse) {
            expect.fail();
        }).catch(function (response: InsightResponse) {
            expect(response.code).to.equal(404);
        });
    });


});