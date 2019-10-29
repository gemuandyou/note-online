const elasticsearch = require('elasticsearch');
const es_client = new elasticsearch.Client({
    host: '192.168.18.35:9200',
    log: 'error'
});

module.exports = es_client;