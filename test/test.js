/* global describe, it, before, after */

var should = require("should");
var fs = require('fs');

describe("clu.use clu-dnode", function(){
	var clu = require("clu");
	var cluDnode = require("../index");

	var net = require('net');

	var rimraf = require('rimraf');

	const dir = __dirname + "/../node_modules/clu/example";

	before(function(done){
		rimraf(dir + '/.clu', function(){
			clu.createCluster({exec: dir + "/app", silent: true, cli: false});
			clu.cluster.once("online", function(){
				done();
			});
		});
	});
	
	describe("clu.use", function(){

		it("should not throw", function(){
			(function(){
				clu.use(cluDnode(14233));
			}).should.not.throw();
		});

		it("should have the right port set", function(){
			should(cluDnode.port).equal(14233);
		});

		it("the server should run", function(){
			should(fs.existsSync(dir + '/.clu')).equal(true);
		});

	});

	describe("client connect", function(){
		var dnode = require("dnode");

		var d = dnode();
		var remote;

		it("connect", function(done){
			d.on('remote', function (rem) {
				remote = rem;
				done();
			});
			d.connect(14233);
		});

		it("should be able to stop the server", function(done){
			remote.stopWorkers(function(){
				done();
			});
		});

		it("workers should really have stoped", function(done){
			clu.getWorkerCount(function(count){
				count.should.equal(0);
				done();
			});
		});
			
	});

	after(function(done){
		rimraf(dir + '/.clu', function(){
			done();
		});
	});
});