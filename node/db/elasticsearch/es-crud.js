var client = require('./es-connect');

module.exports = {
    searchNote: function(query, callback) {
        client.search({
            index: 'note-online',
            type: 'note',
            body: query
        }).then(function(result) {
            callback(result);
        });
    }
}