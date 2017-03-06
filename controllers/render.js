var hasFileExt = /(?:\.([^.]+))?$/;

module.exports = {
    session: (req, res, next) => {
        if( hasFileExt.exec(req.path) ) {
            console.log('controllers.render.hasEXT');
            return next();
        }

        var path = req.path.slice(1);

        if( path.indexOf('.html') !== -1 ) {
            console.log('controllers.render.html');
            return res.render(path, { session: req.session });
        } else if( path.slice(-1) === '/' ) {
            console.log('controllers.render./');
            path = path.slice(0,-1);
        }

        console.log('controllers.render.wtf');
        res.render(`${path}/index.html`, { session: req.session });
    }
};
