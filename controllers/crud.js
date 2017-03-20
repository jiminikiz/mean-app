var CRUD = require('../crud');

module.exports = {
    middlewares: {
        params: (req, res, next) => {
            if(CRUD.valid.params(req.params.entity)) {
                return next();
            }
            res.status(400).send(Object.assign({
                entity: req.params.entity
            }, CRUD.errors.params));
        }
    },
    create: (req, res) => {
        CRUD.create({
            entity: req.params.entity,
            data: req.body,
        }, (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            res.send(result);
        });
    },
    read: (req, res) => {
        CRUD.read({
            id: req.params.id,
            entity: req.params.entity,
            params: req.query
        }, (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            res.send(result);
        });
    },
    update: (req, res) => {
        CRUD.update({
            entity: req.params.entity,
            id: req.params.id,
            data: req.body
        }, (err, result) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            res.send(result);
        });
    },
    delete: (req, res) => {
        CRUD.delete({
            entity: req.params.entity,
            id: req.params.id
        }, (err) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }
            res.send({
                id: req.params.id,
                message: 'deleted'
            });
        });
    },
    count: (req, res) => {
        CRUD.count({
            entity: req.params.entity,
            field: req.query.field,
            match: req.query.match,
            sort: req.query.sort,
            limit: req.query.limit
        }, (err, counts) => {
            if(err) {
                return res.status(500).send({ error: err.message });
            }
            res.send(counts);
        });
    }
};
