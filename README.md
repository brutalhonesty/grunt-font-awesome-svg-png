# grunt-font-awesome-svg-png

Gets font-awesome and parses it into separate SVG and PNG files. You can then use separate files for anything you want:
* Generate your own fonts based on some of font-awesome glyphs and add your own with [fontcustom](http://fontcustom.com/)
* Use SVGs directly
* Use PNGs directly

This work is mostly based on [CodeCharmLtd/Font-Awesome-SVG-PNG](https://github.com/CodeCharmLtd/Font-Awesome-SVG-PNG).

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-font-awesome-svg-png --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-font-awesome-svg-png');
```

## The "font_awesome_svg_png" task

### Overview
In your project's Gruntfile, add a section named `font_awesome_svg_png` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  font_awesome_svg_png: {
    some_target: {
      destination: "build/svg/font-awesome",
      color: 'red', // You can also use hex values (#ffffff)
      size: 32, // Pixel width
      base64: true
    }
  },
});
```

### Options

#### destination
Type: `String`

Where separate SVG and PNG files should go to. Directory will be created if not exists.

#### color
Type: `String`

Which color should be used for the SVG and PNG files.

#### size
Type: `Integer`

How big the PNG files should be.

#### size
Type: `Boolean`

Whether to generate a base64 JSON file for the icons. The file is created as ```DESTINATION/png/SIZE/base64.json```