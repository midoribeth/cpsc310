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
        for (i=1; i<4; i++){
            if (document.getElementById("order"+i.toString()).value !== ""){ // go through form's order inputs
                orderarray += '"'+document.getElementById("order"+i.toString()).value + '"';
                if (i !== 3){
                    if (document.getElementById("order"+(i+1).toString()).value !== ""){ // if next input isn't blank
                        orderarray+=","; //add comma, otherwise at end
                    }
                }
            }

        }
        alert(orderarray);


        if (document.getElementById("size").value !== "") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_dept":' + '"' + document.getElementById("dept").value + '"' + '}},"ORDER": { "dir": "UP", "keys": ['+ orderarray + ']},"AS": "TABLE"}';
        }

        else if (document.getElementById("dept").value !==""){
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_dept":' + '"' + document.getElementById("dept").value + '"' + '}},"ORDER": { "dir": "UP", "keys": ['+ orderarray + ']},"AS": "TABLE"}';
        }

        else if (document.getElementById("courseno").value !==""){
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_id":' + '"' + document.getElementById("courseno").value + '"' + '}},"ORDER": { "dir": "UP", "keys": ['+ orderarray + ']},"AS": "TABLE"}';
        }

        else if (document.getElementById("instructor").value !==""){
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_instructor:' + '"' + document.getElementById("instructor").value + '"' + '}},"ORDER": { "dir": "UP", "keys": ['+ orderarray + ']},"AS": "TABLE"}';
        }

        else if (document.getElementById("title").value !==""){
            var query = '{"GET": ["courses_dept", "courses_id", "courses_avg", "courses_pass", "courses_fail", "courses_instructor", "courses_title"],"WHERE": { "IS": {"courses_title":' + '"' + document.getElementById("title").value + '"' + '}},"ORDER": { "dir": "UP", "keys": ['+ orderarray + ']},"AS": "TABLE"}';
        }

        // create table

        try {
            $.ajax("/query", {type:"POST", data: query, contentType: "application/json", dataType: "json", success: function(data) {
                if (data["render"] === "TABLE") {
                    generateTable(data["result"]);  // generate table with id "test"



                    if (document.getElementById("dept").value !=="") { //if there is an input for dept

                        var table = document.getElementById("test"); // for the table "test"
                        for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                            if (table.rows[i].cells[0].innerHTML !== document.getElementById("dept").value) { //if row's dept doesn't match
                                document.getElementById("test").deleteRow(i);//remove that entire row
                                i--; // decrement i since you just deleted the row and got moved up
                            }
                        }
                    }

                    if (document.getElementById("courseno").value !=="") {

                        var table = document.getElementById("test"); // for the table "test"
                        for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                            if (table.rows[i].cells[1].innerHTML !== document.getElementById("courseno").value) { //if row's course no doesn't match
                                document.getElementById("test").deleteRow(i);//remove that entire row
                                i--; // decrement i since you just deleted the row and got moved up
                            }
                        }
                    }

                    if (document.getElementById("instructor").value !=="") {

                        var table = document.getElementById("test"); // for the table "test"
                        for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                            if (table.rows[i].cells[5].innerHTML !== document.getElementById("instructor").value) { //if row's instructor doesn't match
                                document.getElementById("test").deleteRow(i);//remove that entire row
                                i--; // decrement i since you just deleted the row and got moved up
                            }
                        }
                    }

                    if (document.getElementById("ctitle").value !=="") {

                        var table = document.getElementById("test"); // for the table "test"
                        for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                            if (table.rows[i].cells[6].innerHTML !== document.getElementById("ctitle").value) { //if row's course title doesn't match
                                document.getElementById("test").deleteRow(i);//remove that entire row
                                i--; // decrement i since you just deleted the row and got moved up
                            }
                        }
                    }

                    // add size column
                    var table= document.getElementById("test"); // for the table "test"
                    var totaltitle = table.rows[0].insertCell(7); // add a column for "size"
                    totaltitle.innerHTML= "<b>size</b>"; //set text to "size" for header
                    for (var i=1, row; row = table.rows[i]; i++){ //go through every row
                        var total= parseInt(table.rows[i].cells[3].innerHTML) + parseInt(table.rows[i].cells[4].innerHTML); //add pass/fail
                        var totalcell = table.rows[i].insertCell(7); //insert column at end of row
                        totalcell.innerHTML= total.toString(); //set column to pass+fail

                    }


                    if (document.getElementById("size").value !=="") { // if something is entered for section size
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
            }}).fail(function (e) {
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

        if (document.getElementById("courseshighest").value !=="") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_title", "Average", "Fail", "Pass", "Sections"],"WHERE": {},"GROUP": [ "courses_dept", "courses_id", "courses_title" ],"APPLY": [ {"Sections": {"COUNT": "courses_uuid"}}, {"Average": {"AVG": "courses_avg"}}, {"Pass": {"MAX": "courses_pass"}}, {"Fail": {"MAX": "courses_fail"}} ],"ORDER": { "dir": "DOWN", "keys": [' + '"' + document.getElementById("courseshighest").value + '"' +']},"AS":"TABLE"}';
        }

        else if (document.getElementById("courseslowest").value !=="") {
            var query = '{"GET": ["courses_dept", "courses_id", "courses_title", "Average", "Fail", "Pass", "Sections"],"WHERE": {},"GROUP": [ "courses_dept", "courses_id", "courses_title" ],"APPLY": [ {"Sections": {"COUNT": "courses_uuid"}}, {"Average": {"AVG": "courses_avg"}}, {"Pass": {"MAX": "courses_pass"}}, {"Fail": {"MAX": "courses_fail"}} ],"ORDER": { "dir": "UP", "keys": [' + '"' + document.getElementById("courseslowest").value + '"' +']},"AS":"TABLE"}';
        }


        // create table

        try {
            $.ajax("/query", {type:"POST", data: query, contentType: "application/json", dataType: "json", success: function(data) {
                if (data["render"] === "TABLE") {
                    generateTable(data["result"]);  // generate table with id "test"

                    if (document.getElementById("coursesdept").value !=="") {

                        var table = document.getElementById("test"); // for the table "test"
                        for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                            if (table.rows[i].cells[0].innerHTML !== document.getElementById("coursesdept").value) { //if row's instructor doesn't match
                                document.getElementById("test").deleteRow(i);//remove that entire row
                                i--; // decrement i since you just deleted the row and got moved up
                            }
                        }
                    }

                    if (document.getElementById("coursestitle").value !=="") {

                        var table = document.getElementById("test"); // for the table "test"
                        for (var i = 1, row; row = table.rows[i]; i++) { //go through every row
                            if (table.rows[i].cells[2].innerHTML !== document.getElementById("coursestitle").value) { //if row's course title doesn't match
                                document.getElementById("test").deleteRow(i);//remove that entire row
                                i--; // decrement i since you just deleted the row and got moved up
                            }
                        }
                    }

                    // add size column
                    var table= document.getElementById("test"); // for the table "test"
                    var totaltitle = table.rows[0].insertCell(7); // add a column for "size"
                    totaltitle.innerHTML= "<b>size</b>"; //set text to "size" for header
                    for (var i=1, row; row = table.rows[i]; i++){ //go through every row
                        var total= parseInt(table.rows[i].cells[4].innerHTML) + parseInt(table.rows[i].cells[5].innerHTML); //add pass/fail
                        var totalcell = table.rows[i].insertCell(7); //insert column at end of row
                        totalcell.innerHTML= total.toString(); //set column to pass+fail

                    }


                    if (document.getElementById("coursessize").value !=="") { // if something is entered for section size
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



            }}).fail(function (e) {
                spawnHttpErrorModal(e)
            });
        } catch (err) {
            spawnErrorModal("Query Error", err);
        }
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
        $('table').attr('id','test');

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

// Get the <datalist> and <input> elements.
    var deptdataList = document.getElementById('dept-datalist');
    var coursenodataList = document.getElementById('courseno-datalist');
    var instructordataList = document.getElementById('instructor-datalist');
    var ctitledataList = document.getElementById('ctitle-datalist');


    var dept = ["cpsc", "apsc", "engl", "comm"];
    dept.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        deptdataList.appendChild(option);
    });

    var courseno = ["110", "111", "112", "113"];
    courseno.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        coursenodataList.appendChild(option);
    });

    var instructor = ["Reid Holmes", "APSC", "ENGL", "COMM"];
    instructor.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        instructordataList.appendChild(option);
    });


    var ctitle = ["title1", "APSC", "ENGL", "COMM"];
    ctitle.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        ctitledataList.appendChild(option);
    });



});


