/*
 * grunt-font-awesome-svg-png
 * https://github.com/brutalhonesty/grunt-font-awesome-svg-png
 *
 * Copyright (c) 2014 Dmitrii Tsyganov, Adam Schodde
 * Licensed under the MIT license.
 */

'use strict';

var FontAwesomeSvgPngProcessor = require("../font-awesome-svg-png.js");

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('font_awesome_svg_png', 'Get font-awesome and parse it into separate SVG and PNG files', function () {

        var done = this.async();

        var processor = new FontAwesomeSvgPngProcessor();
        processor.setOutputPath(this.data.destination);
        processor.setColor(this.data.color);
        processor.setSize(this.data.size);
        processor.setBase64(this.data.base64);

        processor.process().then(function(stats) {
            grunt.log.writeln(stats.numberOfSVGFiles + " SVG files have been created");
            grunt.log.writeln(stats.numberOfPNGFiles + " PNG files have been created");
            done();
        });
    });

};
