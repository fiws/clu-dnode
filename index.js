var net = require('net');
var fs = require('fs');
var dnode = require('dnode');
var _ = require('lodash');

module.exports = function(port){
	return function(clu){
		module.exports.port = port;
		// dnode only wants functions. otherwise it will get crazy
		var api = _.pick(clu, function(obj){
			return _.isFunction(obj);
		});
		
		var configDir = clu.dir;
		if (!port){
			port = configDir + "/dnode.sock";
			if (fs.existsSync(port)) fs.unlinkSync(port);
		}

		var server = net.createServer(function (socket) {
			var d = dnode(api);
			socket.pipe(d);
			d.pipe(socket);
			socket.on("end", function(){
				socket.end();
			});
		});
		server.listen(port);
	};
};
