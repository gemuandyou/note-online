var client = require('./es-connect');

module.exports = {
    searchNote: function(query, callback) {
        console.log(query);
        client.search({
            index: 'note-online',
            type: 'note',
            body: query
        }).then(function(result) {
            callback(result);
        }, function(error) {
            console.log(error);
            callback();
        });
    }
}
