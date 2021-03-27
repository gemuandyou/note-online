var client = require('./es-connect');

module.exports = {
    searchNote: function(query, callback) {
        console.log(query);
        client.search({
            index: 'note-online',
            body: query
        }, (err, result) => {
            if (err) {
                console.log(err)
                callback();
            } else {
                callback(result);
            }
        });
    }
}
