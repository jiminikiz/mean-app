const CRUD = {
    models: require('./models'),
    errors: {
        invalid: {
            status: 400,
            message: 'Invalid query!'
        },
        forbidden: {
            status: 403,
            message: 'Request not authenticated'
        },
        entity: {
            status: 404,
            message: 'Entity does not exist'
        },
        notFound: {
            status: 404,
            message: 'There is no model for given :{id}'
        },
        general: {
            status: 500,
            message: 'Database Error'
        }
    },
    valid: {
        entity: (entity) => {
            return CRUD.models[entity] !== undefined;
        }
    },
    error: (model, err, res) => {
        console.error(`[controller.${model}.error]:`, err);

        let message = {
            error: err.message,
        };

        if(err.errors && err.errors.text && err.errors.text.message) {
            message.cause = err.errors.text.message;
        }

        return res && res.status(err.status||500).json(message);
    },
    create: (options, callback) => {
        new CRUD.models[options.entity](options.data).save((err, data) => {
            if(err) {
                console.error('[module.crud.create.error]:'.bold.red, err.message, err.errors);
            }
            callback(err, data);
        });
    },
    read: (options, callback) => {
        let method, query,
            params = options.params || {},
            fields = params.populate && params.populate.split(',') || [],
            sortBy = params.sort,
            select = params.select,
            limit = parseInt(params.limit) || undefined;

            delete params.populate;
            delete params.sort;
            delete params.select;
            delete params.limit;

        if(options.id || params.id) {
            method = 'findById',
            query = options.id || params.id;
        } else {
            method = 'find';
            query = params;
        }

        let Query = CRUD.models[options.entity][method](query).lean();

        Query = select && Query.select(select)   || Query;
        Query = fields && Query.populate(fields) || Query;
        Query = sortBy && Query.sort(sortBy)     || Query;
        Query = limit  && Query.limit(limit)     || Query;

        if(callback) {
            Query.exec((err, data) => {
                if(err) {
                    console.error('[module.crud.read.error]:'.bold.red, err.message);
                    return callback(err, null);
                }
                if(!data) {
                    return callback(CRUD.errors.notFound, null);
                }
                callback(null, data);
            });
        }

        return Query;
    },
    update: (options, callback) => {
        CRUD.models[options.entity].findById(options.id, (err, model) => {
            if(err) {
                console.error('[module.crud.update.error]:'.bold.red, err.message);
                return callback(err);
            }
            if(!model) {
                return callback(null, model);
            }

            for(let key in options.data) {
                model[key] = options.data[key];
            }

            model.save(callback);
        });
    },
    delete: (options, callback) => {
        // Removing documents this way will NOT trigger the 'Model.post' middleware for a given model
        // CRUD.models[options.entity].findByIdAndRemove(options.id, (err, data) => {
        //     if(err) {
        //         console.error('[module.crud.delete.error]:'.bold.red, err.message);
        //     } callback(err, data);
        // });

        CRUD.models[options.entity].findById(options.id, (err, data) => {
            if(err) {
                console.error('[module.crud.delete.error]:'.bold.red, err.message);
            }
            if(data) {
                data.remove(callback);
            }
        });
    },
    count: (options, callback) => {
        let aggregation = [{
            $group: {
                _id: `$${options.field}`,
                count: { $sum: 1 }
            }
        }];

        // couldn't get this to work, will try again in the future
        // if(options.match) {
        //     let $match = {};
        //     $match[options.match.key] = options.match.value;
        //     aggregation.push({ $match: $match });
        // }
        //
        // if(options.sort) {
        //     let $sort = {};
        //     $sort[options.sort.key] = options.sort.value;
        //     aggregation.push({ $sort: $sort });
        // }

        if(options.limit) {
            let $limit = parseInt(options.limit) || 0;
            $limit && aggregation.push({ $limit: $limit });
        }

        CRUD.models[options.entity].aggregate(aggregation, (err, result) => {
            if(err) {
                console.error('[module.crud.count.error]:'.bold.red, err.message);
            } callback(err, result);
        });
    }
};

module.exports = CRUD;
