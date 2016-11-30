$(function () {
    $("#datasetAdd").click(function () {
        var id = $("#datasetId").val();
        var zip = $("#datasetZip").prop('files')[0];
        var data = new FormData();
        data.append("zip", zip);
        $.ajax("/dataset/" + id,
            {
                type: "PUT",
                data: data,
                processData: false
            }).fail(function (e) {
            spawnHttpErrorModal(e)
        });
    });

    $("#datasetRm").click(function () {
        var id = $("#datasetId").val();
        $.ajax("/dataset/" + id, {type: "DELETE"}).fail(function (e) {
            spawnHttpErrorModal(e)
        });
    });

    $("#queryForm").submit(function (e) {
        e.preventDefault();

        //create base query
        //since multiple ANDs don't work for our querycontroller, generate a table with first inputted form value, then remove rows based on subsequent inputs ones

        var orderarray = '';
        for (i = 1; i < 4; i++) {
            if (document.getElementById("order" + i.toString()).value !== "") { // go through form's order inputs
                if (document.getElementById("order"+i.toString()).value !== "courses_avg" || document.getElementById("order"+i.toString()).value !== "courses_pass" || document.getElementById("order"+i.toString()).value !== "courses_fail")// go through form's order inputs
                    alert ("select one of courses_avg, courses_pass, courses_fail");
                orderarray += '"'+document.getElementById("order"+i.toString()).value + '"';
                if (i !== 3) {
                    if (document.getElementById("order" + (i + 1).toString()).value !== "") { // if next input isn't blank
                        orderarray += ","; //add comma, otherwise at end
                    }
                }
            }

        }
        alert(orderarray);


        if (document.getElementById("size").value !== "") {
            if (isNaN(document.getElementbyId("size").value)) {
                alert("Size must be numeric");
            }
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_dept":' + '"' + document.getElementById("dept").value + '"' + '}},"ORDER": { "dir": "UP", "keys": [' + orderarray + ']},"AS": "TABLE"}';
        }

        else if (document.getElementById("dept").value !== "") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_dept":' + '"' + document.getElementById("dept").value + '"' + '}},"ORDER": { "dir": "UP", "keys": [' + orderarray + ']},"AS": "TABLE"}';
        }

        else if (document.getElementById("courseno").value !== "") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_id":' + '"' + document.getElementById("courseno").value + '"' + '}},"ORDER": { "dir": "UP", "keys": [' + orderarray + ']},"AS": "TABLE"}';
        }

        else if (document.getElementById("instructor").value !== "") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_instructor:' + '"' + document.getElementById("instructor").value + '"' + '}},"ORDER": { "dir": "UP", "keys": [' + orderarray + ']},"AS": "TABLE"}';
        }

        else if (document.getElementById("title").value !== "") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_title":' + '"' + document.getElementById("title").value + '"' + '}},"ORDER": { "dir": "UP", "keys": [' + orderarray + ']},"AS": "TABLE"}';
        }

        // create table

        try {
            $.ajax("/query", {
                type: "POST", data: query, contentType: "application/json", dataType: "json", success: function (data) {
                    if (data["render"] === "TABLE") {
                        generateTable(data["result"]);  // generate table with id "test"


                        if (document.getElementById("dept").value !== "") { //if there is an input for dept

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[0].innerHTML !== document.getElementById("dept").value) { //if row's dept doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        if (document.getElementById("courseno").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[1].innerHTML !== document.getElementById("courseno").value) { //if row's course no doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        if (document.getElementById("instructor").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[5].innerHTML !== document.getElementById("instructor").value) { //if row's instructor doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        if (document.getElementById("ctitle").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[6].innerHTML !== document.getElementById("ctitle").value) { //if row's course title doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        // add size column
                        var table = document.getElementById("test"); // for the table "test"
                        var totaltitle = table.rows[0].insertCell(7); // add a column for "size"
                        totaltitle.innerHTML = "<b>size</b>"; //set text to "size" for header
                        for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                            var total = parseInt(table.rows[i].cells[3].innerHTML) + parseInt(table.rows[i].cells[4].innerHTML); //add pass/fail
                            var totalcell = table.rows[i].insertCell(7); //insert column at end of row
                            totalcell.innerHTML = total.toString(); //set column to pass+fail

                        }


                        if (document.getElementById("size").value !== "") { // if something is entered for section size
                            var sizevalue = parseInt(document.getElementById("size").value);

                            if (document.getElementById("GT").checked) { // and GT is selected
                                var table = document.getElementById("test"); // for the table "test"
                                for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                    if (parseInt(table.rows[i].cells[7].innerHTML) < sizevalue) {  // remove rows w/size less than sizevalue
                                        document.getElementById("test").deleteRow(i);//remove that entire row
                                        i--; // decrement i since you just deleted the row and got moved up
                                    }
                                }
                            }
                            if (document.getElementById("LT").checked) { //and LT is selected
                                var table = document.getElementById("test"); // for the table "test"
                                for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                    if (parseInt(table.rows[i].cells[7].innerHTML) > sizevalue) {  // remove rows w/size greater than than sizevalue
                                        document.getElementById("test").deleteRow(i);//remove that entire row
                                        i--; // decrement i since you just deleted the row and got moved up
                                    }
                                }                                          //remove rows greater w/size than sizevalue
                            }
                        }


                    }
                }
            }).fail(function (e) {
                spawnHttpErrorModal(e)
            });
        } catch (err) {
            spawnErrorModal("Query Error", err);
        }
    });

    $("#queryForm2").submit(function (e) {
        e.preventDefault();

        //create base query
        //since multiple ANDs don't work for our querycontroller, generate a table with first inputted form value, then remove rows based on subsequent inputs ones

        if (document.getElementById("courseshighest").value !== "") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_title", "Average", "Fail", "Pass", "Sections"],"WHERE": {},"GROUP": [ "courses_dept", "courses_id", "courses_title" ],"APPLY": [ {"Sections": {"COUNT": "courses_uuid"}}, {"Average": {"AVG": "courses_avg"}}, {"Pass": {"MAX": "courses_pass"}}, {"Fail": {"MAX": "courses_fail"}} ],"ORDER": { "dir": "DOWN", "keys": [' + '"' + document.getElementById("courseshighest").value + '"' + ']},"AS":"TABLE"}';
        }

        else if (document.getElementById("courseslowest").value !== "") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_title", "Average", "Fail", "Pass", "Sections"],"WHERE": {},"GROUP": [ "courses_dept", "courses_id", "courses_title" ],"APPLY": [ {"Sections": {"COUNT": "courses_uuid"}}, {"Average": {"AVG": "courses_avg"}}, {"Pass": {"MAX": "courses_pass"}}, {"Fail": {"MAX": "courses_fail"}} ],"ORDER": { "dir": "UP", "keys": [' + '"' + document.getElementById("courseslowest").value + '"' + ']},"AS":"TABLE"}';
        }


        // create table

        try {
            $.ajax("/query", {
                type: "POST", data: query, contentType: "application/json", dataType: "json", success: function (data) {
                    if (data["render"] === "TABLE") {
                        generateTable(data["result"]);  // generate table with id "test"

                        if (document.getElementById("coursesdept").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[0].innerHTML !== document.getElementById("coursesdept").value) { //if row's instructor doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        if (document.getElementById("coursestitle").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[2].innerHTML !== document.getElementById("coursestitle").value) { //if row's course title doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        // add size column
                        var table = document.getElementById("test"); // for the table "test"
                        var totaltitle = table.rows[0].insertCell(7); // add a column for "size"
                        totaltitle.innerHTML = "<b>size</b>"; //set text to "size" for header
                        for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                            var total = parseInt(table.rows[i].cells[4].innerHTML) + parseInt(table.rows[i].cells[5].innerHTML); //add pass/fail
                            var totalcell = table.rows[i].insertCell(7); //insert column at end of row
                            totalcell.innerHTML = total.toString(); //set column to pass+fail

                        }


                        if (document.getElementById("coursessize").value !== "") { // if something is entered for section size
                            var sizevalue = parseInt(document.getElementById("coursessize").value);

                            if (document.getElementById("coursesGT").checked) { // and GT is selected
                                var table = document.getElementById("test"); // for the table "test"
                                for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                    if (parseInt(table.rows[i].cells[7].innerHTML) < sizevalue) {  // remove rows w/size less than sizevalue
                                        document.getElementById("test").deleteRow(i);//remove that entire row
                                        i--; // decrement i since you just deleted the row and got moved up
                                    }
                                }
                            }
                            if (document.getElementById("coursesLT").checked) { //and LT is selected
                                var table = document.getElementById("test"); // for the table "test"
                                for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                    if (parseInt(table.rows[i].cells[7].innerHTML) > sizevalue) {  // remove rows w/size greater than than sizevalue
                                        document.getElementById("test").deleteRow(i);//remove that entire row
                                        i--; // decrement i since you just deleted the row and got moved up
                                    }
                                }                                          //remove rows greater w/size than sizevalue
                            }
                        }


                    }


                }
            }).fail(function (e) {
                spawnHttpErrorModal(e)
            });
        } catch (err) {
            spawnErrorModal("Query Error", err);
        }
    });


    $("#queryForm3").submit(function (e) {
        e.preventDefault();

        var comparelat = 0;
        var comparelon = 0;


        if (document.getElementById("location").value !== "") {
            var query2 = ' {"GET": ["rooms_shortname", "rooms_lat", "rooms_lon"],"WHERE": {"IS": {"rooms_shortname":' + '"' + document.getElementById("location").value + '"' + '}}, "AS": "TABLE"}';
            try {
                $.ajax("/query", {
                    type: "POST",
                    data: query2,
                    contentType: "application/json",
                    dataType: "json",
                    success: function (data) {
                        if (data["render"] === "TABLE") {
                            comparelat = (data["result"][0].rooms_lat);
                            comparelon = (data["result"][0].rooms_lon);

                        }
                    }
                }).fail(function (e) {
                    spawnHttpErrorModal(e)
                });
            } catch (err) {
                spawnErrorModal("Query Error", err);
            }
        }


        //create base query
        //since multiple ANDs don't work for our querycontroller, generate a table with first inputted form value, then remove rows based on subsequent inputs ones
        var acceptedBuildings = ["AERL", "AUDX", "BRKX", "CIRS", "EOSM", "ESB", "FRDM", "LSC", "MATX", "MGYM", "OSBO", "SRC", "WESB", "ALRD", "ANGU", "ANSO", "BIOL", "BUCH", "CEME", "CHBE", "CHEM", "DMP", "FNH", "FORW", "FSC", "GEOG", "HEBB", "HENN", "IBLC", "IONA", "LASR", "LSK", "MATH", "MCLD", "MCML", "ORCH", "PCOH", "PHRM", "SCRF", "SOWK", "SPPH", "SWNG", "UCLL", "WOOD"];

        if (document.getElementById("building").value !== "") {
            if (acceptedBuildings.indexOf(document.getElementById("building").value) <= -1) {
                alert("Building not found on campus!");
            }
            var query = '{"GET": ["rooms_fullname", "rooms_shortname", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_furniture", "rooms_type"], "WHERE": {"IS": {"rooms_shortname":' + '"' + document.getElementById("building").value + '"' + '}},  "ORDER": { "dir": "UP", "keys": ["rooms_shortname"]}, "AS": "TABLE"}';
        }

        else if (document.getElementById("roomno").value !== "") {
            var query = '{"GET": ["rooms_fullname", "rooms_shortname", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_furniture", "rooms_type"], "WHERE": {"IS": {"rooms_number":' + '"' + document.getElementById("roomno").value + '"' + '}}, "ORDER": { "dir": "UP", "keys": ["rooms_shortname"]}, "AS": "TABLE"}';
        }

        else if (document.getElementById("roomtype").value !== "") {
            var query = '{"GET": ["rooms_fullname", "rooms_shortname", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_furniture", "rooms_type"], "WHERE": {"IS": {"rooms_type":' + '"' + document.getElementById("roomtype").value + '"' + '}}, "ORDER": { "dir": "UP", "keys": ["rooms_shortname"]},  "AS": "TABLE"}';
        }

        else if (document.getElementById("furniture").value !== "") {
            var query = '{"GET": ["rooms_fullname", "rooms_shortname", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_furniture", "rooms_type"], "WHERE": {"IS": {"rooms_furniture":' + '"' + document.getElementById("furniture").value + '"' + '}}, "ORDER": { "dir": "UP", "keys": ["rooms_shortname"]},  "AS": "TABLE"}';
        }

        else if (document.getElementById("roomsize").value !== "") {
            var query = '{"GET": ["rooms_fullname", "rooms_shortname", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_furniture", "rooms_type"], "WHERE": {}, "ORDER": { "dir": "UP", "keys": ["rooms_shortname"]},  "AS": "TABLE"}';
        }

        else if (document.getElementById("building").value == "" && document.getElementById("roomno").value == "" && document.getElementById("roomtype").value == "" && document.getElementById("furniture").value == "" && document.getElementById("roomsize").value == "") {
            var query = '{"GET": ["rooms_fullname", "rooms_shortname", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_furniture", "rooms_type"], "WHERE": {}, "ORDER": { "dir": "UP", "keys": ["rooms_shortname"]},  "AS": "TABLE"}';
        }


        try {
            $.ajax("/query", {
                type: "POST", data: query, contentType: "application/json", dataType: "json", success: function (data) {
                    if (data["render"] === "TABLE") {
                        generateTable(data["result"]);  // generate table with id "test"

                        if (document.getElementById("roomno").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[4].innerHTML !== document.getElementById("roomno").value) { //if row's roomno doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        if (document.getElementById("roomtype").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[7].innerHTML !== document.getElementById("roomtype").value) { //if row's roomno doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        if (document.getElementById("furniture").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                if (table.rows[i].cells[6].innerHTML !== document.getElementById("furniture").value) { //if row's roomno doesn't match
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }

                        if (document.getElementById("roomsize").value !== "") { // if something is entered for section size
                            var sizevalue = parseInt(document.getElementById("roomsize").value);

                            if (document.getElementById("roomGT").checked) { // and GT is selected
                                var table = document.getElementById("test"); // for the table "test"
                                for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                    if (parseInt(table.rows[i].cells[5].innerHTML) < sizevalue) {  // remove rows w/size less than sizevalue
                                        document.getElementById("test").deleteRow(i);//remove that entire row
                                        i--; // decrement i since you just deleted the row and got moved up
                                    }
                                }
                            }
                            if (document.getElementById("roomLT").checked) { //and LT is selected
                                var table = document.getElementById("test"); // for the table "test"
                                for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                    if (parseInt(table.rows[i].cells[5].innerHTML) > sizevalue) {  // remove rows w/size greater than than sizevalue
                                        document.getElementById("test").deleteRow(i);//remove that entire row
                                        i--; // decrement i since you just deleted the row and got moved up
                                    }
                                }                                          //remove rows greater w/size than sizevalue
                            }
                        }


                        if (document.getElementById("location").value !== "" && document.getElementById("locationnumber").value !== "") {

                            var table = document.getElementById("test"); // for the table "test"
                            for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                                var lat = parseFloat(table.rows[i].cells[2].innerHTML);
                                var lon = parseFloat(table.rows[i].cells[3].innerHTML);

                                if (getDistanceFromLatLonInKm(lat, lon, comparelat, comparelon) > parseFloat(document.getElementById("locationnumber").value)) {
                                    document.getElementById("test").deleteRow(i);//remove that entire row
                                    i--; // decrement i since you just deleted the row and got moved up
                                }
                            }
                        }


                    }

                }
            }).fail(function (e) {
                spawnHttpErrorModal(e)
            });
        } catch (err) {
            spawnErrorModal("Query Error", err);
        }


    });


    $("#queryForm4").submit(function (e) {
        e.preventDefault();


    });


    function generateTable(data) {
        var columns = [];
        Object.keys(data[0]).forEach(function (title) {
            columns.push({
                head: title,
                cl: "title",
                html: function (d) {
                    return d[title]
                }
            });
        });
        var container = d3.select("#render");
        container.html("");
        container.selectAll("*").remove();
        var table = container.append("table").style("margin", "auto");
        $('table').attr('id', 'test');

        table.append("thead").append("tr")
            .selectAll("th")
            .data(columns).enter()
            .append("th")
            .attr("class", function (d) {
                return d["cl"]
            })
            .text(function (d) {
                return d["head"]
            });

        table.append("tbody")
            .selectAll("tr")
            .data(data).enter()
            .append("tr")
            .selectAll("td")
            .data(function (row, i) {
                return columns.map(function (c) {
                    // compute cell values for this specific row
                    var cell = {};
                    d3.keys(c).forEach(function (k) {
                        cell[k] = typeof c[k] == "function" ? c[k](row, i) : c[k];
                    });
                    return cell;
                });
            }).enter()
            .append("td")
            .html(function (d) {
                return d["html"]
            })
            .attr("class", function (d) {
                return d["cl"]
            });
    }

    function spawnHttpErrorModal(e) {
        $("#errorModal .modal-title").html(e.status);
        $("#errorModal .modal-body p").html(e.statusText + "</br>" + e.responseText);
        if ($('#errorModal').is(':hidden')) {
            $("#errorModal").modal('show')
        }
    }

    function spawnErrorModal(errorTitle, errorText) {
        $("#errorModal .modal-title").html(errorTitle);
        $("#errorModal .modal-body p").html(errorText);
        if ($('#errorModal').is(':hidden')) {
            $("#errorModal").modal('show')
        }
    }

    //http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d * 1000;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }


// Get the <datalist> and <input> elements.
    var deptdataList = document.getElementById('dept-datalist');
    var coursenodataList = document.getElementById('courseno-datalist');
    var instructordataList = document.getElementById('instructor-datalist');
    var ctitledataList = document.getElementById('ctitle-datalist');
    var buildingdataList = document.getElementById('building-datalist');

    var buildings = ["AERL", "AUDX", "BRKX", "CIRS", "EOSM", "ESB", "FRDM", "LSC", "MATX", "MGYM", "OSBO", "SRC", "WESB", "ALRD", "ANGU", "ANSO", "BIOL", "BUCH", "CEME", "CHBE", "CHEM", "DMP", "FNH", "FORW", "FSC", "GEOG", "HEBB", "HENN", "IBLC", "IONA", "LASR", "LSK", "MATH", "MCLD", "MCML", "ORCH", "PCOH", "PHRM", "SCRF", "SOWK", "SPPH", "SWNG", "UCLL", "WOOD"];
    buildings.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item;
        buildingdataList.appendChild(option);
    });

    var dept = ["cpsc", "apsc", "engl", "comm"];
    dept.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item;
        deptdataList.appendChild(option);
    });

    var courseno = ["110", "111", "112", "113"];
    courseno.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item;
        coursenodataList.appendChild(option);
    });

    var instructor = ["Reid Holmes", "APSC", "ENGL", "COMM"];
    instructor.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item;
        instructordataList.appendChild(option);
    });


    var ctitle = ["title1", "APSC", "ENGL", "COMM"];
    ctitle.forEach(function (item) {
        var option = document.createElement('option');
        option.value = item;
        ctitledataList.appendChild(option);
    });


});


