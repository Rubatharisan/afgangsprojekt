var wutil = require('./lib/wutil');

class Link {

    constructor(url) {
        // always initialize all instance properties
        this.key = wutil.cleanUrl(url);
        this.url = url;
        this.state = 'uncrawled';
    }

    getKey() {
        return this.key;
    }

    getUrl() {
        return this.url;
    }

    getState() {
        return this.state;
    }

    setState(state) {
    	this.state = state;
    }

}

module.exports = Link;
