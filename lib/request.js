var http = require('http');
var url = require('url');

function Request(uri, apiKey, successCallback, failureCallback) {
    this.uri = url.parse( uri );
    this.apiKey = apiKey;
    this.options = {
      hostname: this.uri.hostname,
      port: this.uri.port,
      path: this.uri.path,
      headers: {
        'API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    };
    this.successCallback = successCallback;
    this.failureCallback = failureCallback;
}


Request.prototype = {
    send : function( data ) {
      var postData = '';
      try {
        postData = JSON.stringify( data );
      } catch (e) {
        this.failureCallback( e );
      }

      this.options.header['Content-Length'] = postData.length;

      var req = http.request( this.options, onRequest );

      req.on('error', this.failureCallback );

      // write data to request body
      req.write( postData );
      req.end();

      var request = this;
      function onRequest( res ) {
        var data = [];
        res.setEncoding( 'utf8' );
        res.on('data', function ( chunk ) {
          data.push( chunk );
        });
        res.on('end', function() {
          var responseText = data.join('');

          if ( !responseText || responseText.charAt(0) != '{' ) {
              var error = new Error();
              error.code = res.statusCode;
              error.statusText = res.statusText;
              error.uri = request.uri.href;
              if ( responseText.charAt(0) != '{' ) {
                  error.message = 'No connection';
              } else {
                  error.message = 'Invalid server response';
              }
              return request.failureCallback( error );
          }

          request.successCallback( responseText );
        });
      }
    },

    onreadystatechange : function() {
        var xhr = this.xhr;
        this.readyState = this.xhr.readyState;
        if (xhr.readyState == 4) {
            if (!xhr.responseText || xhr.responseText.charAt(0) != '{') {
                var error = new Error();
                error.code = xhr.status;
                error.statusText = xhr.statusText;
                error.uri = this.uri;
                if (xhr.responseText.charAt(0) != '{') {
                    error.message = 'No connection';
                } else {
                    error.message = 'Invalid server response';
                }
                return this.failureCallback(error);
            }
            this.successCallback(xhr.responseText);
        }
    }
};

module.exports = Request;
