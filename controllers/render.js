const FS = require('fs');
const PATH = require('path');
const index = 'index.html';

let views;

module.exports = {
  init: (viewsPath) => {
    views = viewsPath;
  },
  session: (req, res, next) => {
    let fileExt = PATH.extname(req.path);

    switch(fileExt) {
      case '.html':
      case '':
        let filePath, path;

        if( req.path === '/' ) {
          filePath = index;
        } else {
          path = req.path.slice(1);
          if (path.slice(-1) === '/') {
            filePath = `${path}${index}`;
          } else if (!fileExt) {
            filePath = `${path}/${index}`;
          } else {
            filePath = path;
          }
        }
        FS.exists(`${views}/${filePath}`, (fileExists) => {
          (fileExists) ? res.render(filePath, { session: req.session }) : next();
        });
      break;

      default:
        next();
        break;
    }
  }
};
