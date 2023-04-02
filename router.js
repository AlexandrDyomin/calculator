let Router = {
    create() {
        return Object.create(Router);
    },
    
    init(map) {
        window.addEventListener('popstate', this.handleWindowPopstate);
        let patterns = this.createPatternsFor(Object.keys(map));
        this.map = this.createMap(patterns, Object.values(map));
        return this;
    },

    go({ pathname, search = '', hash = '' }) {
        let handler = this.map[pathname + search + hash]
        handler ? handler() : this.map.default?.();
        return this;
    },

    handleWindowPopstate(e) {
        // todo
        let url = new URL(window.location);
        let { pathname, search, hash } = url;
        this.go({ pathname, search, hash });
    },

    createPatternsFor(array) {
        return array.map(function createPatternFor(str) {
            // todo
            return str;
        });
    },

    createMap(keys, values) {
        let map = {};
        keys.forEach(function(key, i) {
            map[key] = values[i];
        });   
        return map;     
    }
}

export { Router };



