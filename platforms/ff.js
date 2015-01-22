(function() {
    'use strict';
    var fs = require('fs'),
        clc = require('cli-color'),
        im = require('imagemagick'),
        mkdirp = require('mkdirp'),
        svg2png = require("../util/svg2png"),
        rootDirectory = '/ff',
        iconDirectory = rootDirectory + '/icons/',
        splashDirectory = rootDirectory + '/splashscreens/',
        iconNameList = ['logo'],
        numOfIcons = iconNameList.length,
        iconDimensions = [60],
        splashScreenNameList = ['~iphone', '@2x~iphone', '-Portrait~ipad', '-@2x~ipad', '-Landscape~ipad', '-Landscape@2x~ipad', '-568h@2x~iphone'],
        splashScreenDimensions = ['99x99', '159x159', '110x110', '1536x2048', '1024x768', '2048x1536', '640x1136'];

    function _generateIcons(input, output, type, cb) {
        var wstream = fs.createWriteStream(output + rootDirectory + '/firefoxos.xml');
        wstream.on('finish', function() {
            console.log('firefoxos config.xml has been written.');
        });
        wstream.write('<platform name="firefoxos">\n');

        if (type === 'svg') {
            mkdirp(output + iconDirectory, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    iconNameList.forEach(function(el, index) {
                        var dim = iconDimensions[index];
                        svg2png(input, output + iconDirectory + 'icon' + el + '.png', 'w' + dim, function(err) {
                            if (err) {
                                throw err;
                            }
                            console.log('Converted ' + input + ' to fit within ' + clc.yellowBright(dim + 'x' + dim) + ' under ' + output + iconDirectory + 'icon' + el + '.png');
                            wstream.write('    <icon src="ff/icons/' + el + '.png" width="' + dim + '" height="' + dim + '" />\n');
                            if (numOfIcons === 1) {
                                numOfIcons = iconNameList.length;
                                wstream.write('</platform>');
                                wstream.end();
                                cb();
                            } else {
                                numOfIcons--;
                            }
                        });
                    });
                }
            });
        } else if (type === 'png') {
            mkdirp(output + iconDirectory, function(err) {
                if (err) {
                    console.error(err);
                } else {
                    iconNameList.forEach(function(el, index) {
                        var dim = iconDimensions[index];
                        im.resize({
                            srcPath: input,
                            dstPath: output + iconDirectory + 'icon' + el + '.png',
                            width: dim,
                            height: dim
                        }, function(err, stdout, stderr) {
                            if (err) {
                                throw err;
                            }
                            console.log('Resized ' + input + ' to fit within ' + clc.yellowBright(dim + 'x' + dim) + ' under ' + output + iconDirectory + 'icon' + el + '.png');
                            wstream.write('    <icon src="ff/icons/' + el + '.png" width="' + dim + '" height="' + dim + '" />\n');
                            if (numOfIcons === 1) {
                                numOfIcons = iconNameList.length;
                                wstream.write('</platform>');
                                wstream.end();
                                cb();
                            } else {
                                numOfIcons--;
                            }
                        });
                    });
                }
            });
        }
    }

    // function _generateSplashScreens(input) {
    //     splashScreenNameList.forEach( function(el, index ) {
    //         var dim = splashScreenDimensions[index];
    //         im.convert([input, '-resize', dim, splashDirectory+'Default' + el + '.png'],
    //             function (err, stdout, stderr) {
    //                 if (err) {
    //                     throw err;
    //                 }
    //                 console.log('Resized '+input+ ' to fit within '+dim );
    //             }
    //         );
    //     });
    // }

    function _generate(input, output, type, cb) {
        mkdirp(output + rootDirectory, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("Created FireFoxOS icon directory.");
                _generateIcons(input, output, type, cb);
            }
        });
        // mkdirp(splashDirectory, function (err) {
        //     if (err) {
        //         console.error(err);
        //     }
        //     else {
        //         console.log( "Created FireFoxOS splashscreen directory.");
        //         _generateSplashScreens(input);
        //     }
        // });
    }

    exports.generate = _generate;

})();