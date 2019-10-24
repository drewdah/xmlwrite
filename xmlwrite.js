#!/usr/bin/env node

var fs = require('fs');
var parser = require('xml2json');
var qString = require('querystring');
var program = require('commander');

program.option('-f, --file <string>', 'Path to input file');
program.parse(process.argv);

if(program.file) {
    fs.readFile(xmlPath, function(err, data) {
        var json = JSON.parse(parser.toJson(data, {reversible: true, sanitize: true}));

        json.testResults.httpSample.forEach(function(httpSample){
            var queryString = qString.parse(httpSample.queryString.$t);
               
            var x = 1;
        
            for(var param in queryString){
                httpSample["queryParameter" + x] = { "$t": param + "=" + queryString[param] };
                x++;
            }
        });

        var stringified = JSON.stringify(json);
        var xml = parser.toXml(stringified, { sanitize: true });

        fs.writeFile("updated-" + program.file, xml, function(err, data) {
            if (err) {
            console.log(err);
            }
            else {
            console.log('updated!');
            }
        });
    });
} else {
    console.log("Please provide an input file with -f filename.xml")
}