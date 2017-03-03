/* micro.css build script (c) 2017 by Alex Lohr */

const fs = require('fs'),
    postcss = require('postcss'),
    postcss_import = require('postcss-import'),
    postcss_nesting = require('postcss-nesting'),
    postcss_nextcss = require('postcss-cssnext'),
    csso = require('csso'),
    gzip = require('zlib').gzip;

function build() {
    fs.readFile('src/base.css', function(err, css) {
        if (err) { throw err; }
        postcss([postcss_import, postcss_nesting, postcss_nextcss])
            .process(css, { from: 'src/base.css', to: 'micro.css' })
            .then(function(result) {
                console.log('CSS compiled (' + result.css.length + 'bytes)');
                fs.writeFile('micro.css', result.css, 'utf8', function(err) {
                    if (err) { throw err; }
                    console.log('micro.css written');
                });
                minify(result.css);
            });
    });
}

function minify(css) {
    var minified = csso.minify(css).css;
    console.log('CSS minified (' + minified.length + 'bytes)');
    if (!minified || !minified.length) { throw new Error('micro.css could not be minified'); }
    fs.writeFile('micro.min.css', minified, 'utf8', function(err) {
        if (err) { throw err; }
        console.log('micro.min.css written');
    });
    pack(minified);
}

function pack(minified) {
    gzip(minified, function(err, zipped) {
        console.log('CSS gzipped (' + zipped.length + 'bytes)');
        fs.writeFile('micro.min.css.gz', zipped, 'utf8', function(err) {
            if (err) { throw err; }
            console.log('micro.min.css.gz written');
        });
    });
}

build();
