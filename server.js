const Package = require('./package.json');
const Config = Package.config;

// Options are not required; you can initialize the module simply with: require('stackular')();
require('./db', Config.db, (err) => {
    if(err) {
        return process.exit(128);
    }
    require('stackular')({
        port: 8888,     // Number, default is 8888
        middleware: [   // Array, default is undefined
            `secured`       // > redirects all traffic to HTTPS
            `noFavicon`     // > skips requests for `/favicon.ico`
            `bodyParser`    // > parses **form-url-encoded** strings
            `cookies`       // > a simple cookie-parser
            `logger`        // > a very simple request logger
        ],
        views: {                            // Object, default is undefined
            path: `${__dirname}/public`,    // String, default is `${__dirname}/views`
            engine: `ejs`,                  // String, default is undefined
        },
        routes: {
            path: `${__dirname}/routes`,    // String, default is undefined
        }
        // fileServer: {
        //     path: `${__dirname}/public`     // String, default is undefined
        // },
        // https: { // Object, same object used with the native node `https` module,
        //     // > i.e. https.createServer(options);
        //     key:  fs.readFileSync('/path/to/key'),
        //     cert: fs.readFileSync('/path/to/cert')
        // }
    });
});
