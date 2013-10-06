clu-dnode
========

## Usage

``` JavaScript
var clu = require("clu");
var cluDnode = require("clu-dnode");

clu.createCluster("./app.js");

clu.use(cluDnode(3193)); // the port
```

## Licence
MIT