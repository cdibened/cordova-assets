#!/usr/bin/env node

(function () {
    'use strict';
    var clc = require('cli-color'),
        nopt = require('nopt'),
        async = require('async'),
        updateNotifier = require('update-notifier'),
        ios = require('./platforms/ios'),
        android = require('./platforms/android'),
        wp8 = require('./platforms/wp8'),
        bb10 = require('./platforms/bb10'),
        ff = require('./platforms/ff'),
        amazon = require('./platforms/amazon'),
        pkg = require('./package.json'),

        notified = true,
        knownOpts = {
            'platforms': String
        },
        shortHands = {
            'p': ['--platforms']
        },
        parsed = nopt(knownOpts, shortHands, process.argv, 2),
        platformArr = {
            'ios': ios,
            'android': android,
            'wp8': wp8,
            'bb10': bb10,
            'ff': ff,
            'amazon': amazon,
        },
        args = process.argv.splice(2);


    if (args.indexOf('--no-update-notifier') === -1) {
        notified = false;
        // Checks for available update and returns an instance
        var notifier = updateNotifier({
            packageName: pkg.name,
            packageVersion: pkg.version,
            updateCheckInterval: 1000 * 60 * 60 * 24
        });
        if (notifier.update) {
            // Notify using the built-in convenience method
            notifier.notify(true);
        }
    }

    function usage() {
        console.log('');
        console.log('cordova-assets [options] input.png');
        console.log(clc.blueBright('OR'));
        console.log('cga [options] input.png');
        console.log('');
        console.log('   options:');
        console.log('       -p         - comma delimited (no spaces) platforms to generate assets for.');
        console.log('                    Current valid platforms are: ' + clc.magentaBright('ios android wp8 bb10 ff amazon') + '.');
        console.log('                    Default is all.');
        console.log('');
        console.log('\nexample: cga -p ios,android icon.png');
        console.log('');
    }

    if (args.length === 0 || (args.length === 1 && notified)) {
        usage();
    }
    else {
        var platforms = (parsed.platforms ? parsed.platforms.split(',') : Object.keys(platformArr)),
            input = parsed.argv.remain[0],
            callback = function () {
                return;
            };

        if (!input) {
            usage();
        }
        else {
            async.eachSeries(platforms, function (el, cb) {
                console.log('Generating ' + clc.greenBright(el) + ' assets.');
                platformArr[el].generate(input, cb);
            }, function (err) {
                if (err) {
                    console.error("Error:  " + err);
                }
                else {
                    console.log("All done.");
                }
            });
        }
    }
})();