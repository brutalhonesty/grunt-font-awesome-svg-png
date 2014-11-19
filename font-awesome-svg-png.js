var request = require("request");
var when = require("when");
var spawn = require('child_process').spawn;
var yaml = require("js-yaml");
var fs = require("fs");
var mkdirp = require('mkdirp');
var path = require('path');

var makeRequest = function(url) {
    var deferred = when.defer();

    request({
        url: url
    }, function(error, response, body) {

        if (error) {
            deferred.reject({
                error: body,
                response: response,
                statusCode: response.statusCode
            });
        }
        deferred.resolve({
            response: response,
            body: body
        });
    });

    return deferred.promise;
};

var FontAwesomeSvgPngProcessor = function() {
    this.iconsYAMLUrl = "https://github.com/FortAwesome/Font-Awesome/raw/master/src/icons.yml";
    this.svgFontUrl = "https://github.com/FortAwesome/Font-Awesome/raw/master/fonts/fontawesome-webfont.svg";
    this.template =
        '<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">' +
        '<g transform="translate({shiftX} {shiftY})">' +
        '<g transform="scale(1 -1) translate(0 -1280)">' +
        '<path d="{path}" fill="{color}" />' +
        '</g></g>' +
        '</svg>';
    this.iconIds = {};
};

FontAwesomeSvgPngProcessor.prototype.setOutputPath = function(path) {
    this.outputPath = path;
};

FontAwesomeSvgPngProcessor.prototype.setColor = function(color) {
    this.color = color;
};

FontAwesomeSvgPngProcessor.prototype.setSize = function(size) {
    this.size = size;
};

FontAwesomeSvgPngProcessor.prototype.setBase64 = function(base64) {
    this.base64 = base64;
};

FontAwesomeSvgPngProcessor.prototype.process = function() {
    return this._getIconIds().then(function() {
        return this._processFont();
    }.bind(this));
};

FontAwesomeSvgPngProcessor.prototype._getIconIds = function() {
    return makeRequest(this.iconsYAMLUrl).then(function(result) {
        var icons = yaml.safeLoad(result.body).icons;

        icons.forEach(function (icon) {
            this.iconIds[icon.unicode] = icon.id;
        }, this);
    }.bind(this));
};

FontAwesomeSvgPngProcessor.prototype._processFont = function() {
    return this._getFont().then(function(result) {
        return this._parseFont(result);
    }.bind(this));
};

FontAwesomeSvgPngProcessor.prototype._getFont = function () {
    return makeRequest(this.svgFontUrl);
};

FontAwesomeSvgPngProcessor.prototype._parseFont = function(result) {

    var lines = result.body.split('\n');
    var linesNumber = lines.length;
    var i = 0;
    var stats = {
        numberOfSVGFiles: 0,
        numberOfPNGFiles: 0
    };

    var getNextLine = function() {
        return lines[i++];
    };

    var b64Object = {};
    var b64File = path.join(this.outputPath, this.color, 'png', this.size.toString(), 'base64.json');

    var processLine = function(line, b64Object) {
        var deferred = when.defer();
        var matches = line.match(/^<glyph unicode="&#x([^"]+);"\s*(?:horiz-adv-x="(\d+)")?\s*d="([^"]+)"/);

        if (!matches || !(matches[1] in this.iconIds)) {
            return when.resolve();
        }

        var svgData = this._getTemplate({
            advWidth: matches[2],
            path: matches[3],
            color: this.color
        });

        mkdirp.sync(path.join(this.outputPath, this.color, 'svg'));
        mkdirp.sync(path.join(this.outputPath, this.color, 'png', this.size.toString()));

        var svgFilename = path.join(this.outputPath, this.color, 'svg', this.iconIds[matches[1]] + '.svg');
        var pngDir = path.join(this.outputPath, this.color, 'png', this.size.toString(), this.iconIds[matches[1]] + '.png');
        var pngFilename = this.iconIds[matches[1]];
        var _self = this;
        fs.writeFile(svgFilename, svgData, function(error) {
            if (error) {
                deferred.reject(error);
            }
            stats.numberOfSVGFiles++;
            var rsvgConvert = spawn('rsvg-convert', ['-f', 'png', '-w', _self.size, '-o', pngDir]);
            rsvgConvert.stdin.end(svgData);
            stats.numberOfPNGFiles++;
            rsvgConvert.once('error', deferred.reject);
            rsvgConvert.once('exit', function (code, signal) {
                if(code === 0) {
                    if(_self.base64) {
                        var file = fs.readFileSync(pngDir);
                        var b64Data = new Buffer(file, 'binary').toString('base64');
                        b64Object[pngFilename] = 'data:image/png;base64,' + b64Data;
                    }
                    return deferred.resolve();
                } else {
                    return deferred.reject(signal);
                }
            });
        });

        return deferred.promise;
    }.bind(this);

    var processNext = function(b64Object) {
        if (i >= linesNumber) {
            if(this.base64) {
                fs.writeFileSync(b64File, JSON.stringify(b64Object));
            }
            return stats;
        }

        return processLine(getNextLine(), b64Object).then(function() {
            return processNext(b64Object);
        });
    }.bind(this);

    return processNext(b64Object);
};

FontAwesomeSvgPngProcessor.prototype._getTemplate = function(options) {
    var PIXEL = 128;

    var advWidth = (options.advWidth ? options.advWidth : 12*PIXEL);

    var params = {
        shiftX: -(-(14*PIXEL - advWidth)/2),
        shiftY: -(-2*PIXEL),
        width: 14*PIXEL,
        height: 14*PIXEL,
        path: options.path,
        color: options.color
    };

    var template = this.template.substr(0);

    Object.keys(params).forEach(function(key) {
        template = template.replace(new RegExp("{" + key + "}", 'g'), params[key]);
    });

    return template;
};

module.exports = FontAwesomeSvgPngProcessor;