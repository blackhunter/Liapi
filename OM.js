// TODO mod not to save?
(function() {
	//database access
	window.db = function(link) {
		var target = link.split('>'),
			nodes = target.length-1,
			db = window.db.store;

		for (var i = 0; i < target.length; i++) {
			if(i==nodes){
				if(!(target[i] in db)){
					db[target[i]] = {_get:{}, _backup:{}, _options:{save:{}, backup:{}, special:{}}};
				}
				return new window.db.hang(db,target[i],link);
			}else if(!target[i] in db)
				db[target[i]] = {};

			db = db[target[i]];
		}
	}

	//generating database
	window.db.store = {};
	window.db.trace = {};
	window.db.interval = null;
	window.db.queue = [];
	window.db.on = function(listener,fuu,object){
		var events,patch,i,j,id;
		if(typeof listener=='string')
			listener = [listener];
		for(var i in listener){
			events = listener[i].split(':'),
			id = events[0].split('.');
			events.shift();
			if(id.length==1)
				id = [null,id[0]];
			if(!(id[1] in window.db.trace))
				window.db.trace[id[1]] = {};

			patch = window.db.trace[id[1]];

			for(j in events){
				if(!(events[j] in patch))
					patch[events[j]] = [];

				patch[events[j]].push({fuu:fuu,obj:(object==undefined)? {} : object,id:id[0]});
			}
		}
	};
	window.db.remove = function(listener,id){
		listener = listener.split(':');
		(function(event,id){
			if(!event.length)
				event = Object.keys(this);

			for(var i in event){
				var j=this[event[i]].length;
				while(j--){
					if(id===undefined || this[event[i]][j].id==id)
						this[event[i]].splice(j,1);
				}
				if(!this[event[i]].length)
					delete this[event[i]];
			}
		}).call(window.db.trace[listener[0]],listener.slice(1),id);
	};
	window.db.useSchema = function(data,ile){
		var back={},i;
		if(ile==undefined)
			ile = 0;
		if(!Array.isArray(data))
			data = Object.keys(data);

		for(i in data){
			back[data[i]] = ile;
		}

		return back;
	};
	window.db.emit = function(name,now,old,type,patch){
		var trace = window.db.trace,
			b;

		if(patch in trace && type in trace[patch]){
			for(var i in trace[patch][type]){
				window.db.queue.push({name : name , now : now, old : old, trace : trace[patch][type][i]});
			}
			if(!window.db.interval){
				window.db.interval = setInterval(function() {
					if(window.db.queue[0]){
						var b = window.db.queue.shift();
						b.trace.fuu(b.trace.obj,b.name,b.now,b.old);
					}else{
						clearInterval(window.db.interval);
						window.db.interval = null;
					}
				}, 0);
			}
		}
	}

	window.db.hang = function(link,name,path) {
		//data store links
		this.get = link[name]._get;
		this.backup = link[name]._backup;
		this.options = link[name]._options;
		this.self = {
			q : false,
			s : false,
			b : false
		};
		this.hand = {
			from : link,
			on : link[name],
			name : name,
			mark : null,
			path : path
		};
		//marking (pass all!)
		this.mark = function(name) {
			if(name==undefined){
				this.hand.mark = null;
				this.get = this.hand.on._get;
				this.backup = this.hand.on._backup;
			}else if(!(name in this.hand.on._get)){
				throw new Error('Wrong node name!');
			}else{
				this.hand.mark = name;
				if(this.options.special[name])
					this.options = this.options.special[name];
				else
					this.options = this.hand.on._options;
				this.get = this.hand.on._get[name];
				this.backup =  this.hand.on._backup[name];
			}

			return this;
		};
		this.setBackup = function(params,special){
			var options;
			if(special){
				if(!this.options.special[special])
					this.options.special[special] = {save:{},backup:{}};
				options = this.options.special[special];
			}else
				options = this.options;

			for(var i in params){
				if(i in options.save)
					continue;
				if(params[i])
					options.backup[i] =(params[i]==true)? 1 : params[i];
				else
					(function(name){delete this.backup[name];}).call(options,i);
			}
			return this;
		};
		this.setSave = function(params,special){
			var options;
			if(special){
				if(!this.options.special[special])
					this.options.special[special] = {save:{},backup:{}};
				options = this.options.special[special];
			}else
				options = this.options;

			for(var i in params){
				if(i in options.backup)
					(function(name){delete this.backup[name];}).call(options,i);
				if(i in options.save)
					(function(name){delete this.save[name];}).call(options,i);
				else
					options.save[i] = true;
			}
			return this;
		};
		this.mod = function(obj){
			if(obj.q!=undefined)
				this.self.q = obj.q;
			if(obj.b!=undefined)
				this.self.b = obj.b;
		};
		//back (name,howold) | ({name : howlong}) | (name : false) -> reset
		this.back = function(name,reset){
			//mark test
			if(this.hand.mark == null)
				throw new Error('Mark node first!');

			if(typeof name == 'string'){
				if(!(name in this.options.backup))
					throw new Error('You try backup not allowed field!');
				var hang = {};
				hang[name] = reset;
				name = hang;
			}else if(typeof name != 'object'){
				reset = name;
				name = {};
				for(var i in this.options.backup){
					name[i] = reset;
				}
			}else{
				for(var i in name){
					if(!(i in this.options.backup))
						throw new Error('You try backup not allowed field!');
				}
			}

			for(var i in name){
				if(name[i]==-1)
					name[i] = this.backup[i].length-1;
				else if(name[i]===false){//reset
					this.backup[i] = [];
					continue;
				}

				if(!this.self.q)
					window.db.emit(i,this.backup[i][name[i]],this.get[i],'backup',this.hand.path);

				this.get[i] = this.backup[i][name[i]];
				this.backup[i].splice(0,name[i]+1);
			}
			if(this.self.q==1)
				this.self.q = false;

			return this;
		};
		this.set = function(name, data) {
			var handle, i, prev = {};

			if(this.hand.mark == null)
				throw new Error('Mark node first!');

			if(typeof name == 'string') {
				handle = name;
				name = {};
				name[handle] = data;
			}

			for(i in name) {
				if(!(i in this.get)){
					if(!this.self.q)
						window.db.emit(i,name[i],null,'init',this.hand.path);
					if(!this.options.save[i])
						this.get[i] = name[i];
					continue;
				}

				if(this.get[i] instanceof Date)
					prev = (new Date(this.get[i].getTime()));
				else if(this.get[i] instanceof Object) {
					prev = this.get[i];
					this.get[i] = Object.create(this.get[i]);
				} else    prev = this.get[i];

				if(typeof name[i] == 'function')
					name[i](this.get[i]);
				else
					this.get[i] = name[i];

				if(this.self.b){
					if(this.self.b==1)
						this.self.b = 0;
				}else if(i in this.options.backup){
					if(!this.backup[i])
						this.backup[i] = [prev];
					else if((this.options.backup[i]+1)==this.backup[i].unshift(prev))
						this.backup[i].pop();
				}

				if(!this.self.q)
					window.db.emit(i,this.get[i],prev,'set',this.hand.path);
			}

			if(this.self.q==1)
				this.self.q = 0;
			return this;
		};
		this.new = function(data, order) {
			var i, j, first = true, save;

			for(i in data) {
				save =(i in this.options.special)? this.options.special[i].save : save = this.options.save;

				if(first == true)
					first = i;

				if(i in this.get){
					if(!this.self.q)
						window.db.emit(i,this.get[i],this.backup[i],'overwrite',this.hand.path);
				}else{
					this.hand.on._get[i] = {};
					if(Object.keys(this.hand.on._options.backup))
						this.hand.on._backup[i] = {};
				}

				for(j in data[i]) {
					if(!(j in save))
						this.hand.on._get[i][j] = data[i][j];
				}

				if(!this.self.q)
					window.db.emit(i,data[i],null,'new',this.hand.path);
			}

			if(this.self.q==1)
				this.self.q = false;

			if(typeof order != 'boolean')
				this.mark(order);
			else if(order != undefined){
				if(order)
					this.mark(i);
				else
					this.mark(first);
			}

			return this;
		}
		this.destroy = function(){
			var items = Object.keys(this);
			this.mark();
			(function(name,self,path){
				if(!self.q)
					window.db.emit(name,this[name]._get,this[name]._backup,'destroy',path);
				else if(self.q==1)
					self.q = 0;

				delete  this[name];
			}).call(this.hand.from,this.hand.name,this.self,this.hand.path);

			for(var i in items){
				if(items[i]!='get' && items[i]!='backup')
					delete this[items[i]];
			}

			return this;
		}
		this.delete = function(name) {
			var i;

			if(name==undefined){
				if(this.hand.mark)
					name = [this.hand.mark];
				else
					name = Object.keys(this.hand.on._get);
				this.mark();
			}else if(typeof name == 'object'){
				if(name.indexOf(this.hand.mark)!=-1)
					this.mark();
			}else{
				if(name=='*'){
					name = Object.keys(this.hand.on._get);
					this.mark();
				}else{
					if(this.hand.mark==name)
						this.mark();
					name = [name];
				}
			}

			(function(name,self,path){
				for(var i in name){
					if(!(name[i] in this._get))
						throw new Error('You tray delete undefined parameter');

					if(!self.q)
						window.db.emit(name[i],this._get[name[i]],this._backup[name[i]],'delete',path);

					delete this._backup[name[i]];
					delete this._get[name[i]];
				}
				if(self.q==1)
					self.q = 0;
			}).call(this.hand.on,name,this.self,this.hand.path);

			return this;
		}
	}
})();