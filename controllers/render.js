const FS = require('fs');
const PATH = require('path');
const index = 'index.html';

var views;

module.exports = {
    init: (viewsPath) => {
        views = viewsPath;
    },
    session: (req, res, next) => {
        let fileExt = PATH.extname(req.path);

        switch(fileExt) {
            case '.html':
            case '':
                var filepath, path;

                if( req.path === '/' ) {
                    filepath = index;
                } else {
                    path = req.path.slice(1);
                    if (path.slice(-1) === '/') {
                        filepath = `${path}${index}`;
                    } else if (!fileExt) {
                        filepath = `${path}/${index}`;
                    } else {
                        filepath = path;
                    }
                }
                FS.exists(`${views}/${filepath}`, (fileExists) => {
                    (fileExists) ? res.render(filepath, { session: req.session }) : next();
                });
            break;
            default:
                next();
            break;
        }
    }
};
