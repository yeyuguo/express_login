
const config = {
    server:{
        host:'127.0.0.1',
        port:process.env.PORT || 8080,
    },
    mongoose:{
        server:'127.0.0.1',
        port:'27017',
        dbs:['nodedb']
    }
};

exports = module.exports = config;