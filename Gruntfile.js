/*
 * grunt-font-awesome-svg
 * https://github.com/tsyganov/grunt-font-awesome-svg
 *
 * Copyright (c) 2014 Dmitrii Tsyganov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'font-awesome-svg-png.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp']
    },

    font_awesome_svg_png: {
      default_options: {
        destination: 'tmp',
        color: '#85c6cc',
        size: 32
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'font_awesome_svg_png']);

};
