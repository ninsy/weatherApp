/**
 * Created by Kamil on 25.09.15.
 */

var fs = require('fs');
var http = require('http');

var urls = []; // array of urls to be send
var filepath =  process.argv[2]; // file with zip codes
var postalCode = []; // extracted Zip Codes from passed file
var jsonData = []; // un-extracted JSON objects
var geoPosition = []; // array of JSON objects with lat, lng, zip


var getZip = function(filepath) {

    var data = fs.readFileSync(filepath).toString();
    var tempCode = '';
    for(var i = 0; i < data.length; i++) {

        if(data[i] == '\n') continue;
        else tempCode += data[i];

        if(tempCode.length == '5') {
            postalCode.push(tempCode);
            tempCode = '';
        }
    }
}

var processZip = function(postalCode) {

    var counter = 0;
    for(var i = 0; i < postalCode.length; i++) {

        urls[i] = "http://api.geonames.org/postalCodeLookupJSON?postalcode=" + postalCode[i] + "&country=PL&username=faddah";
        http.get(urls[i], function(response) {

            counter++;
            response.setEncoding('utf8');

            var tempJSON = '';
            response.on('data', function(chunk) {
                tempJSON += chunk;
            });
            response.on('end', function() {
                counter--;
                jsonData[i] = tempJSON;
                if(counter == 0) {

                    for(var j = 0; i < jsonData.length; i++) {

                        var tempObj = {
                            latitude: JSON.parse(jsonData[i]).postalcodes[0].lat,
                            longitude: JSON.parse(jsonData[i]).postalcodes[0].lng,
                            zip: JSON.parse(jsonData[i]).postalcodes[0].postalcode
                        }
                        extractGeoPosition(tempObj);
                    }
                }
            });
        });
    }
}

function extractGeoPosition() {


  //for(var i = 0; i < jsonData.length; i++) {
  //
  //    var tempObj = {
  //        latitude: jsonData[i].postalcodes[lat],
  //        longitude: jsonData[i].postalcodes[lng],
  //        countryCode: jsonData[i].postalcodes[countryCode]
  //    }
  //    console.log(tempObj);
  //
  //}
}

getZip(filepath);
processZip(postalCode);



