var fs = require('fs');

function PersistedArray( storageId ) {
    this.storageId = storageId;
    this.load();
}

PersistedArray.prototype = {
    length : 0,
    isEmpty : function() {
        return this.length === 0;
    },
    load : function() {
        var value = fs.readFileSync( '.' + this.storageId );
        if (value === null) {
            value = '[]';
        }
        this.value = JSON.parse( value );
        this.length = this.value.length;
    },
    save : function() {
        this.length = this.value.length;
        fs.writeFileSync( '.' + this.storageId, JSON.stringify( this.value ) );
    },
    clear : function() {
        this.value = [];
        this.save();
    },
    copy : function(newId) {
        var newPersistedArray = new PersistedArray(newId);
        newPersistedArray.value = this.value.concat([]);
        newPersistedArray.save();
        return newPersistedArray;
    },
    add : function(value) {
        if (!this.contains(value)) {
            //we don't error on this one
            this.value.push(value);
            this.save();
        }
        return value;
    },
    shift : function(value) {
        if (!this.contains(value)) {
            //we don't error on this one
            this.value.shift(value);
            this.save();
        } else {
            throw new Error('trying to shift:' + value);
        }
        return value;
    },
    remove : function(item) {
        var index = this.value.indexOf(item);
        if (index == -1) {
            throw new Error('removing non-present item');
        }
        this.value.splice(index, 1);
        this.save();
        return index;
    },
    safeRemove : function(item) {
        var index = this.value.indexOf(item);
        if (index != -1) {
            this.value.splice(index, 1);
            this.save();
        }
        return index;
    },
    contains : function(item) {
        return this.value.indexOf(item) !== -1;
    },
    filter : function(id) {
        return new PersistedArray(id, [].filter.apply(this.value, [].slice.call(arguments, 1)));
    },
    forEach : function(func) {
        this.value.forEach(func);
        //not saving
    },
    pop : function() {
        if (this.isEmpty())
            return null;
        var entry = this.value[this.length - 1];
        this.remove(entry);
        return entry;
    },
    unshift : function() {
        if (this.isEmpty())
            return null;
        var entry = this.value[0];
        this.remove(entry);
        return entry;
    },
    get : function(index) {
        if (this.isEmpty())
            return null;
        return this.value[index];
    }
};

module.exports = PersistedArray;
