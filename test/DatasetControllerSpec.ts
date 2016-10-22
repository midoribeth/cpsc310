/**
 * Created by rtholmes on 2016-09-03.
 */

import DatasetController from "../src/controller/DatasetController";
import Log from "../src/Util";

import JSZip = require('jszip');
import {expect} from 'chai';

describe("DatasetController", function () {

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it("Should be able to receive a Dataset", function () {
        Log.test('Creating dataset');
        let content = JSON.parse('{"result":[{"tier_eighty_five":9,"tier_ninety":8,"Title":"teach adult","Section":"63a","Detail":"","tier_seventy_two":0,"Other":0,"Low":58,"tier_sixty_four":0,"id":234,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":1,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2011","tier_twenty":0,"Stddev":7.42,"Enrolled":24,"tier_fifty_five":1,"tier_eighty":4,"tier_sixty":0,"tier_ten":0,"High":95,"Course":"327","Session":"w","Pass":23,"Fail":0,"Avg":86.17,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":7,"tier_ninety":10,"Title":"teach adult","Section":"63c","Detail":"","tier_seventy_two":0,"Other":0,"Low":57,"tier_sixty_four":0,"id":235,"tier_sixty_eight":2,"tier_zero":0,"tier_seventy_six":1,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":3,"Year":"2011","tier_twenty":0,"Stddev":8.71,"Enrolled":31,"tier_fifty_five":1,"tier_eighty":6,"tier_sixty":0,"tier_ten":0,"High":95,"Course":"327","Session":"w","Pass":27,"Fail":0,"Avg":84.52,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":9,"tier_ninety":3,"Title":"teach adult","Section":"63d","Detail":"","tier_seventy_two":0,"Other":0,"Low":66,"tier_sixty_four":1,"id":236,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"walker, judith","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2011","tier_twenty":0,"Stddev":5.8,"Enrolled":24,"tier_fifty_five":0,"tier_eighty":6,"tier_sixty":0,"tier_ten":0,"High":92,"Course":"327","Session":"w","Pass":21,"Fail":0,"Avg":84,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":25,"tier_ninety":21,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":0,"Other":0,"Low":57,"tier_sixty_four":1,"id":237,"tier_sixty_eight":2,"tier_zero":0,"tier_seventy_six":4,"tier_thirty":0,"tier_fifty":0,"Professor":"","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":5,"Year":"2011","tier_twenty":0,"Stddev":7.48,"Enrolled":79,"tier_fifty_five":2,"tier_eighty":16,"tier_sixty":0,"tier_ten":0,"High":95,"Course":"327","Session":"w","Pass":71,"Fail":0,"Avg":84.9,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":10,"tier_ninety":7,"Title":"teach adult","Section":"63a","Detail":"","tier_seventy_two":0,"Other":1,"Low":66,"tier_sixty_four":1,"id":15001,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2010","tier_twenty":0,"Stddev":6.87,"Enrolled":25,"tier_fifty_five":0,"tier_eighty":3,"tier_sixty":0,"tier_ten":0,"High":97,"Course":"327","Session":"w","Pass":23,"Fail":0,"Avg":86.65,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":6,"tier_ninety":6,"Title":"teach adult","Section":"63c","Detail":"","tier_seventy_two":0,"Other":1,"Low":67,"tier_sixty_four":1,"id":15002,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2010","tier_twenty":0,"Stddev":6.61,"Enrolled":22,"tier_fifty_five":0,"tier_eighty":5,"tier_sixty":0,"tier_ten":0,"High":96,"Course":"327","Session":"w","Pass":20,"Fail":0,"Avg":85.6,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":16,"tier_ninety":13,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":0,"Other":2,"Low":66,"tier_sixty_four":2,"id":15003,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":4,"tier_thirty":0,"tier_fifty":0,"Professor":"","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":2,"Year":"2010","tier_twenty":0,"Stddev":6.69,"Enrolled":47,"tier_fifty_five":0,"tier_eighty":8,"tier_sixty":0,"tier_ten":0,"High":97,"Course":"327","Session":"w","Pass":43,"Fail":0,"Avg":86.16,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":8,"tier_ninety":5,"Title":"teach adult","Section":"93q","Detail":"","tier_seventy_two":2,"Other":0,"Low":74,"tier_sixty_four":0,"id":25636,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2010","tier_twenty":0,"Stddev":5.64,"Enrolled":22,"tier_fifty_five":0,"tier_eighty":6,"tier_sixty":0,"tier_ten":0,"High":95,"Course":"327","Session":"s","Pass":21,"Fail":0,"Avg":85.81,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":8,"tier_ninety":5,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":2,"Other":0,"Low":74,"tier_sixty_four":0,"id":25637,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":0,"Professor":"","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2010","tier_twenty":0,"Stddev":5.64,"Enrolled":22,"tier_fifty_five":0,"tier_eighty":6,"tier_sixty":0,"tier_ten":0,"High":95,"Course":"327","Session":"s","Pass":21,"Fail":0,"Avg":85.81,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":5,"tier_ninety":4,"Title":"teach adult","Section":"63a","Detail":"","tier_seventy_two":0,"Other":0,"Low":60,"tier_sixty_four":0,"id":28431,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"crisfield, erin","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":0,"Year":"2009","tier_twenty":0,"Stddev":7.66,"Enrolled":21,"tier_fifty_five":0,"tier_eighty":9,"tier_sixty":1,"tier_ten":0,"High":96,"Course":"327","Session":"w","Pass":21,"Fail":0,"Avg":84.14,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":5,"tier_ninety":9,"Title":"teach adult","Section":"63c","Detail":"","tier_seventy_two":1,"Other":0,"Low":0,"tier_sixty_four":0,"id":28432,"tier_sixty_eight":0,"tier_zero":2,"tier_seventy_six":1,"tier_thirty":0,"tier_fifty":0,"Professor":"crisfield, erin","Audit":0,"tier_g_fifty":2,"tier_forty":0,"Withdrew":3,"Year":"2009","tier_twenty":0,"Stddev":27.02,"Enrolled":24,"tier_fifty_five":0,"tier_eighty":3,"tier_sixty":0,"tier_ten":0,"High":98,"Course":"327","Session":"w","Pass":19,"Fail":2,"Avg":79.19,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":10,"tier_ninety":13,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":1,"Other":0,"Low":0,"tier_sixty_four":0,"id":28433,"tier_sixty_eight":0,"tier_zero":2,"tier_seventy_six":3,"tier_thirty":0,"tier_fifty":0,"Professor":"","Audit":0,"tier_g_fifty":2,"tier_forty":0,"Withdrew":3,"Year":"2009","tier_twenty":0,"Stddev":19.78,"Enrolled":45,"tier_fifty_five":0,"tier_eighty":12,"tier_sixty":1,"tier_ten":0,"High":98,"Course":"327","Session":"w","Pass":40,"Fail":2,"Avg":81.67,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":2,"tier_ninety":6,"Title":"teach adult","Section":"63a","Detail":"","tier_seventy_two":4,"Other":0,"Low":50,"tier_sixty_four":0,"id":39616,"tier_sixty_eight":2,"tier_zero":0,"tier_seventy_six":4,"tier_thirty":0,"tier_fifty":2,"Professor":"palacios, carolina","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":0,"Year":"2014","tier_twenty":0,"Stddev":10.81,"Enrolled":36,"tier_fifty_five":0,"tier_eighty":10,"tier_sixty":2,"tier_ten":0,"High":95,"Course":"327","Session":"w","Pass":32,"Fail":0,"Avg":78.41,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":5,"tier_ninety":7,"Title":"teach adult","Section":"63b","Detail":"","tier_seventy_two":2,"Other":0,"Low":50,"tier_sixty_four":0,"id":39617,"tier_sixty_eight":4,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":2,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":0,"Year":"2014","tier_twenty":0,"Stddev":12.14,"Enrolled":36,"tier_fifty_five":2,"tier_eighty":10,"tier_sixty":0,"tier_ten":0,"High":96,"Course":"327","Session":"w","Pass":34,"Fail":0,"Avg":79.47,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":5,"tier_ninety":8,"Title":"teach adult","Section":"63c","Detail":"","tier_seventy_two":2,"Other":0,"Low":56,"tier_sixty_four":1,"id":39618,"tier_sixty_eight":2,"tier_zero":0,"tier_seventy_six":5,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2014","tier_twenty":0,"Stddev":9.9,"Enrolled":36,"tier_fifty_five":1,"tier_eighty":6,"tier_sixty":1,"tier_ten":0,"High":95,"Course":"327","Session":"w","Pass":31,"Fail":0,"Avg":81.45,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":7,"tier_ninety":5,"Title":"teach adult","Section":"63d","Detail":"","tier_seventy_two":4,"Other":0,"Low":37,"tier_sixty_four":0,"id":39619,"tier_sixty_eight":4,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":1,"tier_fifty":1,"Professor":"palacios, carolina","Audit":0,"tier_g_fifty":1,"tier_forty":0,"Withdrew":0,"Year":"2014","tier_twenty":0,"Stddev":13.18,"Enrolled":33,"tier_fifty_five":1,"tier_eighty":5,"tier_sixty":2,"tier_ten":0,"High":98,"Course":"327","Session":"w","Pass":31,"Fail":1,"Avg":76.59,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":9,"tier_ninety":18,"Title":"teach adult","Section":"63e","Detail":"","tier_seventy_two":2,"Other":2,"Low":72,"tier_sixty_four":0,"id":39620,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":0,"Professor":"regmi, kapil","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2014","tier_twenty":0,"Stddev":5.38,"Enrolled":35,"tier_fifty_five":0,"tier_eighty":2,"tier_sixty":0,"tier_ten":0,"High":96,"Course":"327","Session":"w","Pass":31,"Fail":0,"Avg":88.23,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":28,"tier_ninety":44,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":14,"Other":2,"Low":37,"tier_sixty_four":1,"id":39621,"tier_sixty_eight":12,"tier_zero":0,"tier_seventy_six":13,"tier_thirty":1,"tier_fifty":5,"Professor":"","Audit":0,"tier_g_fifty":1,"tier_forty":0,"Withdrew":2,"Year":"2014","tier_twenty":0,"Stddev":11.27,"Enrolled":176,"tier_fifty_five":4,"tier_eighty":33,"tier_sixty":5,"tier_ten":0,"High":98,"Course":"327","Session":"w","Pass":159,"Fail":1,"Avg":80.76,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":12,"tier_ninety":5,"Title":"teach adult","Section":"63a","Detail":"","tier_seventy_two":0,"Other":0,"Low":64,"tier_sixty_four":1,"id":43244,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"walker, judith","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":0,"Year":"2013","tier_twenty":0,"Stddev":5.59,"Enrolled":32,"tier_fifty_five":0,"tier_eighty":10,"tier_sixty":0,"tier_ten":0,"High":93,"Course":"327","Session":"w","Pass":30,"Fail":0,"Avg":84.3,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":12,"tier_ninety":7,"Title":"teach adult","Section":"63b","Detail":"","tier_seventy_two":0,"Other":0,"Low":58,"tier_sixty_four":0,"id":43245,"tier_sixty_eight":1,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2013","tier_twenty":0,"Stddev":9,"Enrolled":34,"tier_fifty_five":1,"tier_eighty":7,"tier_sixty":2,"tier_ten":0,"High":94,"Course":"327","Session":"w","Pass":32,"Fail":0,"Avg":83.41,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":5,"tier_ninety":8,"Title":"teach adult","Section":"63c","Detail":"","tier_seventy_two":3,"Other":0,"Low":60,"tier_sixty_four":1,"id":43246,"tier_sixty_eight":1,"tier_zero":0,"tier_seventy_six":3,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":0,"Year":"2013","tier_twenty":0,"Stddev":9.84,"Enrolled":35,"tier_fifty_five":0,"tier_eighty":9,"tier_sixty":3,"tier_ten":0,"High":96,"Course":"327","Session":"w","Pass":33,"Fail":0,"Avg":81.45,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":13,"tier_ninety":5,"Title":"teach adult","Section":"63d","Detail":"","tier_seventy_two":1,"Other":0,"Low":74,"tier_sixty_four":0,"id":43247,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"walker, judith","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2013","tier_twenty":0,"Stddev":4.44,"Enrolled":29,"tier_fifty_five":0,"tier_eighty":7,"tier_sixty":0,"tier_ten":0,"High":93,"Course":"327","Session":"w","Pass":28,"Fail":0,"Avg":85.04,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":42,"tier_ninety":25,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":4,"Other":0,"Low":58,"tier_sixty_four":2,"id":43248,"tier_sixty_eight":2,"tier_zero":0,"tier_seventy_six":9,"tier_thirty":0,"tier_fifty":0,"Professor":"","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":2,"Year":"2013","tier_twenty":0,"Stddev":7.72,"Enrolled":130,"tier_fifty_five":1,"tier_eighty":33,"tier_sixty":5,"tier_ten":0,"High":96,"Course":"327","Session":"w","Pass":123,"Fail":0,"Avg":83.47,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":8,"tier_ninety":6,"Title":"teach adult","Section":"93q","Detail":"","tier_seventy_two":2,"Other":0,"Low":51,"tier_sixty_four":2,"id":54921,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":1,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":0,"Year":"2013","tier_twenty":0,"Stddev":11.43,"Enrolled":21,"tier_fifty_five":0,"tier_eighty":2,"tier_sixty":0,"tier_ten":0,"High":98,"Course":"327","Session":"s","Pass":21,"Fail":0,"Avg":83.57,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":6,"tier_ninety":9,"Title":"teach adult","Section":"93s","Detail":"","tier_seventy_two":0,"Other":0,"Low":80,"tier_sixty_four":0,"id":54922,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":0,"Professor":"walker, judith","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":2,"Year":"2013","tier_twenty":0,"Stddev":4.23,"Enrolled":24,"tier_fifty_five":0,"tier_eighty":7,"tier_sixty":0,"tier_ten":0,"High":94,"Course":"327","Session":"s","Pass":22,"Fail":0,"Avg":86.59,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":14,"tier_ninety":15,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":2,"Other":0,"Low":51,"tier_sixty_four":2,"id":54923,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":1,"Professor":"","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":2,"Year":"2013","tier_twenty":0,"Stddev":8.57,"Enrolled":45,"tier_fifty_five":0,"tier_eighty":9,"tier_sixty":0,"tier_ten":0,"High":98,"Course":"327","Session":"s","Pass":43,"Fail":0,"Avg":85.12,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":11,"tier_ninety":0,"Title":"teach adult","Section":"63a","Detail":"","tier_seventy_two":0,"Other":0,"Low":78,"tier_sixty_four":0,"id":56420,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":1,"tier_thirty":0,"tier_fifty":0,"Professor":"walker, judith","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":0,"Year":"2012","tier_twenty":0,"Stddev":2.73,"Enrolled":25,"tier_fifty_five":0,"tier_eighty":12,"tier_sixty":0,"tier_ten":0,"High":88,"Course":"327","Session":"w","Pass":24,"Fail":0,"Avg":83.71,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":8,"tier_ninety":9,"Title":"teach adult","Section":"63b","Detail":"","tier_seventy_two":3,"Other":0,"Low":0,"tier_sixty_four":1,"id":56421,"tier_sixty_eight":0,"tier_zero":1,"tier_seventy_six":1,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":1,"tier_forty":0,"Withdrew":3,"Year":"2012","tier_twenty":0,"Stddev":17.6,"Enrolled":31,"tier_fifty_five":0,"tier_eighty":5,"tier_sixty":0,"tier_ten":0,"High":94,"Course":"327","Session":"w","Pass":27,"Fail":1,"Avg":81.89,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":4,"tier_ninety":10,"Title":"teach adult","Section":"63c","Detail":"","tier_seventy_two":4,"Other":0,"Low":0,"tier_sixty_four":0,"id":56422,"tier_sixty_eight":1,"tier_zero":1,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":1,"tier_forty":0,"Withdrew":0,"Year":"2012","tier_twenty":0,"Stddev":17.44,"Enrolled":31,"tier_fifty_five":0,"tier_eighty":7,"tier_sixty":0,"tier_ten":0,"High":98,"Course":"327","Session":"w","Pass":28,"Fail":1,"Avg":81.62,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":10,"tier_ninety":6,"Title":"teach adult","Section":"63d","Detail":"","tier_seventy_two":0,"Other":0,"Low":53,"tier_sixty_four":0,"id":56423,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":3,"tier_thirty":0,"tier_fifty":1,"Professor":"walker, judith","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":2,"Year":"2012","tier_twenty":0,"Stddev":7.48,"Enrolled":35,"tier_fifty_five":0,"tier_eighty":9,"tier_sixty":0,"tier_ten":0,"High":92,"Course":"327","Session":"w","Pass":29,"Fail":0,"Avg":83.83,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":33,"tier_ninety":25,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":7,"Other":0,"Low":0,"tier_sixty_four":1,"id":56424,"tier_sixty_eight":1,"tier_zero":2,"tier_seventy_six":7,"tier_thirty":0,"tier_fifty":1,"Professor":"","Audit":0,"tier_g_fifty":2,"tier_forty":0,"Withdrew":5,"Year":"2012","tier_twenty":0,"Stddev":13.11,"Enrolled":122,"tier_fifty_five":0,"tier_eighty":33,"tier_sixty":0,"tier_ten":0,"High":98,"Course":"327","Session":"w","Pass":108,"Fail":2,"Avg":82.73,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":4,"tier_ninety":7,"Title":"teach adult","Section":"93q","Detail":"","tier_seventy_two":1,"Other":0,"Low":22,"tier_sixty_four":1,"id":58367,"tier_sixty_eight":2,"tier_zero":0,"tier_seventy_six":2,"tier_thirty":0,"tier_fifty":0,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":2,"tier_forty":1,"Withdrew":1,"Year":"2014","tier_twenty":1,"Stddev":17.54,"Enrolled":27,"tier_fifty_five":1,"tier_eighty":4,"tier_sixty":0,"tier_ten":0,"High":94,"Course":"327","Session":"s","Pass":22,"Fail":2,"Avg":78.21,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":3,"tier_ninety":7,"Title":"teach adult","Section":"93s","Detail":"","tier_seventy_two":2,"Other":0,"Low":5,"tier_sixty_four":0,"id":58368,"tier_sixty_eight":1,"tier_zero":2,"tier_seventy_six":6,"tier_thirty":0,"tier_fifty":0,"Professor":"walker, judith","Audit":0,"tier_g_fifty":2,"tier_forty":0,"Withdrew":2,"Year":"2014","tier_twenty":0,"Stddev":23.43,"Enrolled":29,"tier_fifty_five":0,"tier_eighty":3,"tier_sixty":0,"tier_ten":0,"High":97,"Course":"327","Session":"s","Pass":22,"Fail":2,"Avg":76.63,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":7,"tier_ninety":14,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":3,"Other":0,"Low":5,"tier_sixty_four":1,"id":58369,"tier_sixty_eight":3,"tier_zero":2,"tier_seventy_six":8,"tier_thirty":0,"tier_fifty":0,"Professor":"","Audit":0,"tier_g_fifty":4,"tier_forty":1,"Withdrew":3,"Year":"2014","tier_twenty":1,"Stddev":20.49,"Enrolled":56,"tier_fifty_five":1,"tier_eighty":7,"tier_sixty":0,"tier_ten":0,"High":97,"Course":"327","Session":"s","Pass":44,"Fail":4,"Avg":77.42,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":10,"tier_ninety":6,"Title":"teach adult","Section":"93q","Detail":"","tier_seventy_two":2,"Other":0,"Low":51,"tier_sixty_four":0,"id":66428,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":1,"Professor":"smulders, dave","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":3,"Year":"2012","tier_twenty":0,"Stddev":9.72,"Enrolled":28,"tier_fifty_five":0,"tier_eighty":4,"tier_sixty":0,"tier_ten":0,"High":96,"Course":"327","Session":"s","Pass":23,"Fail":0,"Avg":84.87,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":7,"tier_ninety":7,"Title":"teach adult","Section":"93s","Detail":"","tier_seventy_two":0,"Other":0,"Low":52,"tier_sixty_four":0,"id":66429,"tier_sixty_eight":1,"tier_zero":0,"tier_seventy_six":4,"tier_thirty":0,"tier_fifty":1,"Professor":"walker, judith","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2012","tier_twenty":0,"Stddev":8.14,"Enrolled":28,"tier_fifty_five":0,"tier_eighty":7,"tier_sixty":0,"tier_ten":0,"High":90,"Course":"327","Session":"s","Pass":27,"Fail":0,"Avg":83.07,"Campus":"ubc","Subject":"adhe"},{"tier_eighty_five":17,"tier_ninety":13,"Title":"teach adult","Section":"overall","Detail":"","tier_seventy_two":2,"Other":0,"Low":51,"tier_sixty_four":0,"id":66430,"tier_sixty_eight":1,"tier_zero":0,"tier_seventy_six":4,"tier_thirty":0,"tier_fifty":2,"Professor":"","Audit":0,"tier_g_fifty":0,"tier_forty":0,"Withdrew":4,"Year":"2012","tier_twenty":0,"Stddev":8.85,"Enrolled":56,"tier_fifty_five":0,"tier_eighty":11,"tier_sixty":0,"tier_ten":0,"High":96,"Course":"327","Session":"s","Pass":50,"Fail":0,"Avg":83.9,"Campus":"ubc","Subject":"adhe"}],"rank":152)');
        let zip = new JSZip();
        zip.file('ADHE327.json', JSON.stringify(content));

        const opts = {
            compression: 'deflate', compressionOptions: {level: 2}, type: 'base64'
        };
        return zip.generateAsync(opts).then(function (data) {
            Log.test('Dataset created');
            let controller = new DatasetController();
            return controller.process('setA', data);
        }).then(function (result) {
            Log.test('Dataset processed; result: ' + result);
            expect(result).to.equal(true);
        });

    });

    it('Print myZip', function() {
        Log.test("asdf");
    });

});
