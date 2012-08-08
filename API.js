(function(){
	window.HTMLElement.prototype.remove = function(){
		return this.parentNode.removeChild(this);
	}

	window.HTMLElement.prototype.move = function(number){
		var place = this,
			i = 0;

		if(number>0 && place.nextElementSibling){
			place = place.nextElementSibling;
			while(i!=number){
				place = place.nextElementSibling;
				if(place===null)    break;
				i++;
			}
		}else{
			while(i!=number && place.previousElementSibling){
				place = place.previousElementSibling;
				i--;
			}
		}
		this.parentNode.insertBefore(this,place);
	}

	window.HTMLElement.prototype.asNext = function(element){
		return this.parentNode.insertBefore(element,this.nextElementSibling);
	}

	window.HTMLElement.prototype.asPrev = function(element){
		return this.parentNode.insertBefore(element,this);
	}

	window.$ = function(p){
		return document.querySelector(p);
	}
	window.HTMLElement.prototype.$ = function(){
		return this.querySelector.apply(this,arguments);
	}

	window.$$ = function(p){
		return document.querySelectorAll(p);
	}
	window.HTMLElement.prototype.$$ = function(){
		return this.querySelectorAll.apply(this,arguments);
	}

	window.addHTML = function(tag,args){
		var element = document.createElement(tag);
		if(args){
			if(args.name)   element.setAttribute('name',args.name);
			if(args.id) element.id = args.id;
			if(args.class)  element.className = args.class;
			if(args.html)  element.innerHTML = args.html;
			if(args.fn) args.fn.call(element);
		}
		return element;
	}
	window.HTMLElement.prototype.addHTML = function(){
		return this.appendChild(window.addHTML.apply(this,arguments));
	}

	Object.defineProperty(Object, 'sort', {
		value : function(obj,fn){
			return Object.keys(obj).sort(fn.bind(obj));
		},
		writable : false,
		enumerable : false,
		configurable : true
	});
	
	window.document.cal = {
		days: ['N','P','W','Ś','C','P','S'],
		month: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień']
	}
})();

window.connects = {
	sec: 15*1000,
	interval: null,
	after: {},
	prev: function(id){
		this.after[id] = [];
		return this.after[id];
	},
	addAfter: function(id,xhr){
		if(id in this.after)
			this.after[id].push(xhr);
		else
			xhr.send();
	},
	list: [],
	stack: function(url,xhr){
		this.list.push(xhr);

		if(!this.interval)
			this.interval = setTimeout((function(){
				for(var i=0;i<this.list.length;i++){
					this.list[i].shift.send();
				}

				clearTimeout(this.interval);
				this.interval = null;
			}).bind(this),this.sec);
	}
};

function xhr( url, method, sync, control ) {
	this.onerror = function(){};
	this.onend = function(){};
	this.ondone = function(){};

	this.data = null;
	this.formData = false;
	this.url = url;
	this.afterId = false;
	this.afterList = null;
	this.control = !!control;

	if(typeof method == 'boolean'){
		this.method = 'GET';
		this.sync = !!method;
	}else{
		this.method = method;
		this.sync = !!sync;
	}

	this.xhr = new XMLHttpRequest();
	this.form = function(form){
		if(form){
			this.url = form.action;
			this.method = form.method;
			this.data = new FormData(form);
		}else{
			this.data = new FormData();
		}
		this.formData = true;

		return this;
	};
	this._send = function(method){
		if(this.data!==null){
			var text = [];

			if(method=='GET' || method=='HEAD'){
				for (var j in this.data) {
					text.push( j + "=" + encodeURIComponent(this.data[j]) );
				}
				this.url += '?'+text.join('&');
				this.data = null;
			}else if(method=='POST' || method=='PUT' || method=='DELETE'){
				if(typeof this.data == 'object'){
					this.data =  JSON.stringify(this.data);
					this.xhr.setRequestHeader('Content-Type', 'application/json');
				}else
					this.xhr.setRequestHeader('Content-Type', 'text/xml');
			}else{
				this.data = null;
			}
		}
	};
	this.on = function(name,fuu){
		if('on'+name in this){
			this['on'+name] = fuu;
		}

		return this;
	};
	this.send = function(data){
		if(this==window)
			throw new Error('Outside usage of xhr\'s method, use xhr.send.bind(xhr) instead');
		if(this.afterId)
			this.afterList = window.connects.prev(this.afterId);
		try{
			if(this.xhr==null)
				this.xhr = new XMLHttpRequest();
			if(data!=undefined)
				this.data = data;
			this.xhr.open(this.method, this.url, this.sync);
			if(!this.formData)
				this._send(this.method);
			this.xhr.send(data);
		}catch(e){
			console.log(e.message);
			this.onerror(e.message,this);
		}

		return this;
	};
	this.abort = function(){
		this.xhr.abort();
		this.xhr = null;

		return this;
	};
	this.upload = function(fuu){
		this.xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				fuu(e.loaded,e.total);
			}
		}

		return this;
	};
	this.scout = function(id,data){
		this.afterList = window.connects.prev(id);
		this.send(data);
		return this;
	};
	this.next = function(id,data){
		if(data!=undefined)
			this.data = data;
		this.afterId = true;
		window.connects.addAfter(id,this);
		return this;
	};

	this.xhr.onreadystatechange = (function(){
		if ( this.xhr.readyState == 4) {
			if (this.xhr.status >= 200 && this.xhr.status < 300 || this.xhr.status == 304) {
				this.ondone(this.xhr.response);
				if(this.afterList){
					for(var i=0;i<this.afterList.length;i++){
						this.afterList[i].send();
					}
					this.afterList = null;
				}
			} else {
				if(this.control && this.afterId!==true){
					window.connects.stack(this);
				}
				this.onerror(this.xhr.response,this);
			}
			this.onend();
			this.xhr = null;
		}
	}).bind(this);
}