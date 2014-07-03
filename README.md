cordova-assets
===============

NPM package to generate assets, like icons and/or splashscreens, for Phonegap/Cordova applications based on a master file.

###Installation

Requires ImageMagick and its tools to be installed. They can be found here:  <http://www.imagemagick.org/script/binary-releases.php>


`sudo npm install -g cordova-assets`


###Usage

**Currently only icons are supported.

Make sure that your input image for the icons is square in terms of dimensions. This makes it easier to scale.  In addition, the input image should be bigger (ex: 500x500px) than any of the icon sizes since scaling down is generally better than scaling up. However, since you have fewer pixels to work with, it's inevitable that some of your detail is going to be lost. However, I'll will try and add sharpening to the images to try and minimize the loss and possibly add support for increasing DPI.

<pre>
    cga [options] input.png
</pre>

```
options:
    -p         - comma delimited (no spaces) platforms to generate assets for.
                Current valid platforms are: ios android bb10 wp8 ff amazon.
                Default is all.
```

###Examples
pga -p ios icon.png

- will generate all the icons for iOS using icon.png as the master file under a directory `./pga/ios/icons`


###TO-DO

- Add support for generating splashscreens
- Add support for sharpening, changing DPI, ...
- Add support to specify output directory