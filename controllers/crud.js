var Models = require('../models');

var CRUD = {
    middlewares: {
        params: (req, res, next) => {
            if (!Models[req.params.model]) {
                CRUD.log.error({
                    message: 'Bad Request'
                }, req);

                return res.status(400).send({
                    message: 'Bad Request',
                    path: req.path,
                    model: req.params.model
                });
            }

            next();
        }
    },
    log: {
        error: (err, req) => {
            console.error('[controller.crud.error]'.bold.red, '\n', {
                err: err,
                path: req.path,
                model: req.params.model,
                query: req.query,
                body: req.body
            });
        }
    },
    create: (req, res) => {
        new Models[req.params.model](req.body).save((err, newDoc) => {
            if (err) {
                CRUD.log.error(err, req);
                return res.status(500).send(err);
            }
            res.send(newDoc);
        });
    },
    read: (req, res) => {
        var method, queryparams, fields, sort, select;

        if(req.query.populate) {
            fields = req.query.populate.split(',')||[];
            delete req.query.populate;
        }

        if(req.query.sort) {
            sort = req.query.sort;
            delete req.query.sort;
        }

        if(req.query.select) {
            select = req.query.select;
            delete req.query.select;
        }

        if(req.params.id) {
            method = 'findById',
            queryparams = req.params.id;

        } else {
            method = 'find';
            queryparams = req.query;
        }

        var Query = Models[req.params.model][method](queryparams).lean();

        if(select) {
            Query = Query.select(select);
        }

        if (fields) {
            Query = Query.populate(fields);
        }

        if (sort) {
            Query = Query.sort(sort);
        }


        Query.exec((err, doc) => {
            if (err) {
                CRUD.log.error(err, req);
                res.status(500).send(err);
            } else {
                res.send(doc);
            }
        });
    },
    update: (req, res) => {
        // console.log('[DEBUG]: crud.update', req.body);
        Models[req.params.model].findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
            (err, updatedDoc) => {
                if (err) {
                    CRUD.log.error(err, req);
                    return res.status(500).send(err);
                }
                res.send(updatedDoc);
            });
    },
    delete: (req, res) => {
        Models[req.params.model].findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                CRUD.log.error(err, req);
                return res.status(500).send(err);
            }
            res.send({
                id: req.params.id,
                message: 'deleted'
            });
        });
    }
};

module.exports = CRUD;
