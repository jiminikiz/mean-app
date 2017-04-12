var CRUD = require('../crud');

module.exports = {
    middlewares: {
        params: (req, res, next) => {
            if(CRUD.valid.entity(req.params.entity)) {
                return next();
            }
            res.status(CRUD.errors.entity.status).json(CRUD.errors.entity);
        }
    },
    create: (req, res) => {
        CRUD.create({
            entity: req.params.entity,
            data: req.body,
        }, (err, result) => {
            if (err) {
                return res.status(CRUD.errors.general.status).json(err);
            }
            res.json(result);
        });
    },
    read: (req, res) => {
        CRUD.read({
            id: req.params.id,
            entity: req.params.entity,
            params: req.query
        }, (err, result) => {
            if (err) {
                return res.status(CRUD.errors.general.status).json(err);
            }
            res.json(result);
        });
    },
    update: (req, res) => {
        CRUD.update({
            entity: req.params.entity,
            id: req.params.id,
            data: req.body
        }, (err, result) => {
            if (err) {
                return res.status(CRUD.errors.general.status).json(err);
            }
            res.json(result);
        });
    },
    delete: (req, res) => {
        CRUD.delete({
            entity: req.params.entity,
            id: req.params.id
        }, (err) => {
            if (err) {
                return res.status(CRUD.errors.general.status).json(err);
            }
            res.json({
                entity: req.params.entity,
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
                return res.status(CRUD.errors.general.status).json(err);
            }
            res.json(counts);
        });
    }
};
