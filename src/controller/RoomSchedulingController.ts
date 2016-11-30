/**
 * Created by midoritakeuchi on 2016-11-23.
 */


import Log from "../Util";

export interface SchedulingResponse {

}

export default class RoomSchedulingController {

    constructor() {
        Log.trace('RoomSchedulingController::init()');
    }


    //STEPS:
    //input = rooms and courses
    //output = list of (room, course, time)
    //RESTRICTIONS:
    //time within 8am - 5pm time block
    //time options: M - 1hr block, T - 90min block
    //room_seats >= course_size
    //courses with same section number can't be at the same time
    public schedule(rooms: any, courses: any) {
        // Log.trace(JSON.stringify(rooms));
        // Log.trace(JSON.stringify(courses));
        if (rooms == "[]" || courses == "[]") {
            var result: SchedulingResponse = JSON.parse(JSON.stringify({render: "TABLE", result: "[]", quality: ""}));
        }
        else {
            //creating list to put dictionaries of {room, course, time} in
            var pairs: any = [];

            //creating time array
            var times: any = ["MWF: 0800", "MWF: 0900", "MWF: 1000", "MWF: 1100", "MWF: 1200", "MWF: 1300", "MWF: 1400", "MWF: 1500", "MWF: 1600", "Tues/Thurs: 0800", "Tues/Thurs: 0930", "Tues/Thurs: 1100", "Tues/Thurs: 1230", "Tues/Thurs: 1400", "Tues/Thurs: 1530"];
            var timesOutside: any = ["MWF: 1700", "MWF: 1800", "MWF: 1900", "Tues/Thurs: 1700", "Tues/Thurs: 1830"];


            //calculating number of sections that need to be scheduled
            var count: any = 0;
            for (var i = 0; i < courses.length - 1; i++) {
                if (courses[i]["year"] == "2014") {
                    count += 1;
                }
            }
            var numSections: any = Math.ceil(count / 3);
            Log.trace(JSON.stringify(numSections));

            //calculating section size
            var courseSizes: any = [];
            for (var i = 0; i < courses.length - 1; i++) {
                //Log.trace(courses[i]["courses_pass"]);
                if (courses[i]["year"] == "2014") {
                    courseSizes.push(courses[i]["courses_pass"] + courses[i]["courses_fail"]);
                }
            }

            //sort sizes array in descending order
            var sorted: any = courseSizes.sort(function (a: any, b: any) {
                return b - a
            });
            //Log.trace(sorted);

            //grab largest number
            //tried to use max function but wasn't sure if it was working correctly
            //--->log wouldn't work
            var courseSize: any = sorted[0];
            Log.trace(courseSize);

            //var to count number of times we have to use the times outside of the 8-5 time frame
            var outside: any = 0;


            for (var i = 0; i < rooms.length; i++) {
                for (var j = 0; j < numSections; j++) {
                    var roomObj: any = rooms[i]["rooms_name"];
                    var courseObj: any = courses[j]["courses_dept"] + "_" + courses[j]["courses_id"];
                    var roomSize: any = rooms[i]["rooms_seats"];
                    if (roomSize >= courseSize && roomSize - courseSize < 50) {
                        //pick times at random and delete from list as they are used so no conflicting times
                        if (times != []) {
                            var timeObj: any = times[Math.floor(Math.random() * times.length)];
                            times.splice(times.indexOf(timeObj), 1);
                        } else {
                            outside += 1;
                            var timeObj: any = timesOutside[Math.floor(Math.random() * timesOutside.length)];
                            timesOutside.splice(timesOutside.indexOf(timeObj), 1);
                        }
                        if (pairs.length < numSections) {
                            pairs.push({room: roomObj, course: courseObj, time: timeObj});
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }

            var quality: any = 100 - outside / numSections;

            Log.trace(JSON.stringify(pairs));

            var result: SchedulingResponse = JSON.parse(JSON.stringify({
                render: "TABLE",
                result: pairs,
                quality: quality + "% of classes scheduled between 8am-5pm"
            }));


            return result;
        }

    }

}
