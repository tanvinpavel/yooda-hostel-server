const MongoClient = require( 'mongodb' ).MongoClient;
require('dotenv').config();

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.zjops.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
var  db;

module.exports = {

  connectToServer: ( callback ) => {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
        db  = client.db('yooda');
        return callback( err );
    } );
  },

  getDb: function() {
    return db;
  }

};