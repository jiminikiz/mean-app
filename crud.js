const CRUD = {
    models: require('./models'),
    errors: {
        params: {
            status: 400,
            message: 'Bad API parameters',
            error: 'Entity not found'
        }
    },
    valid: {
        params: (entity) => {
            return CRUD.models[entity] !== undefined;
        }
    },
    create: (options, callback) => {
        if(!CRUD.valid.params(options.entity) || !options.data) {
            return callback({ message: '[crud:create] invalid options', options: options });
        }
        new CRUD.models[options.entity](options.data).save((err, data) => {
            if(err) {
                console.error('[module.crud.create.error]:'.bold.red, err.message, err.errors);
            } callback(err, data);
        });
    },
    read: (options, callback) => {
        if(!CRUD.valid.params(options.entity)) {
            if(callback) {
                return callback({
                    message: '[crud:read] invalid options',
                    options: options
                });
            }
            return;
        }

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
                } callback(err, data);
            });
        }

        return Query;
    },
    update: (options, callback) => {
        if( !CRUD.valid.params(options.entity)  || !options.data || !options.id ) {
            return callback({ message: '[crud:update] invalid options', options: options });
        }
        CRUD.models[options.entity].findByIdAndUpdate(options.id, options.data, { new: true }, (err, data) => {
            if(err) {
                console.error('[module.crud.update.error]:'.bold.red, err.message);
            } callback(err, data);
        });
    },
    delete: (options, callback) => {
        if( !CRUD.valid.params(options.entity)  || !options.id ) {
            return callback({
                message: '[crud:delete] invalid options',
                options: options
            });
        }

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
        if( !CRUD.valid.params(options.entity) || !options.field ) {
            return callback({
                message: '[crud:count] invalid options',
                options: options
            });
        }

        let aggregation = [{
            $group: {
                _id: `$${options.field}`,
                count: { $sum: 1 }
            }
        }];

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
