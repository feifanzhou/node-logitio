function AjaxRequest(uri, apiKey, successCallback, failureCallback) {
    this.uri = uri;
    this.apiKey = apiKey;
    this.xhr = this.createXhr();
    this.successCallback = successCallback;
    this.failureCallback = failureCallback;
}


AjaxRequest.prototype = {
    createXhr : function() {
        var xhr = this.xhr = new XMLHttpRequest();
        this.openXhr();
        xhr.onreadystatechange = this.onreadystatechange.bind(this);
        return xhr;
    },
    openXhr : function() {
        this.readyState = 0;
        var xhr = this.xhr;
        xhr.open('POST', this.uri, true);
        xhr.setRequestHeader('API-Key', this.apiKey);
        xhr.setRequestHeader('Content-type', 'application/json');
    },
    send : function(data) {
        try {
            this.xhr.send(JSON.stringify(data));
        } catch (e) {
            this.failureCallback(e);
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

module.exports = AjaxRequest;
