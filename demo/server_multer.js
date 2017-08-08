var express  =  require( 'express' );
var multer   =  require( 'multer' );
var upload   =  multer( { dest: 'uploads/' } );
var sizeOf   =  require( 'image-size' );
var exphbs   =  require( 'express-handlebars' );
require( 'string.prototype.startswith' );

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.engine( '.hbs', exphbs( { extname: '.hbs' } ) );
app.set('view engine', '.hbs');

app.get( '/', function( req, res, next ){
  return res.render( 'index' );
});

app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {


  console.log('upload : '+ JSON.stringify(req.body));

  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } );
  }

  var dimensions = sizeOf( req.file.path );

/*  if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
    return res.status( 422 ).json( {
      error : 'The image must be at least 640 x 480px'
    } );
  }
*/
  return res.status( 200 ).send( req.file );
});

app.listen( 8090, function() {
  console.log( 'Express server listening on port 8090' );
});
