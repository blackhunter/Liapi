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

	window.$ = document.querySelector;
	window.HTMLElement.prototype.$ = function(){
		return this.querySelector.apply(this,arguments);
	}

	window.$$ = document.querySelectorAll;
	window.HTMLElement.prototype.$$ = function(){
		return this.querySelectorAll.apply(this,arguments);
	}

	window.addHTML = function(tag,args){
		var element = document.createElement('tag');
		if(args.name)   element.setAttribute('name',args.name);
		if(args.id) element.id = args.id;
		if(args.class)  element.className = args.class;
		if(args.html)  element.innerHTML = args.html;
		if(args.fn) args.fn.call(element);
		return element;
	}
	window.HTMLElement.prototype.addHTML = window.addHTML;

	window.HTMLElement.prototype.shuffle = function(now,old){
		if(this.children.length==now.length && (old==undefined || old.length!=now.length)){
			var changes=0,
				index,
				move = (function(ele,i){
					if(index){
						index = old.indexOf(ele);
						if(index==-1)   throw Error('Wrong table order');
						old.splice(index,1);
						if(index+changes!=i){
							this.insertBefore(this.children[index+changes],this.children[changes]);
						}
						changes++;
					}else{
						this.insertBefore(this.children[ele],this.children[i]);
					}
				}).bind(this);

			if(old==undefined){
				old = [];
				for(var i in now){
					old[i] = i;
				}
			}

			now.forEach(move);
		}else throw Error('Valid parameters length');
	}

	Object.defineProperty(Object, 'sort', {
		value : function(obj,fn){
			return Object.keys(obj).sort(fn.bind(obj));
		},
		writable : false,
		enumerable : false,
		configurable : true
	});
});

function xhr( options ) {
	if(options===undefined)	options={};
	this.onError = options.onError || function(){};
	this.onEnd = options.onEnd || function(){};
	this.onSuccess = options.onSuccess || function(){};

	this.method = options.method || 'GET';
	this.sync = options.sync || false;
	this.data = options.data || null;
	this.url = options.url || '';
	this.type = options.type || '';
	this.formData = false;

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
		return this.data;
	}

	this._send = function(method,form){
		if(data!==null){
			var text = [];

			if(method=='GET' || method=='HEAD'){
				for (var j in this.data) {
					text.push( j + "=" + encodeURIComponent(this.data[j]) );
				}
				this.url += '?'+text.join('&');
				this.data = null;
			}else if(method=='POST' || method=='PUT' || method=='DELETE'){
				if(form=='json'){
					this.data =  JSON.stringify(this.data);
					this.xhr.setRequestHeader('Content-Type', 'application/json');
				}else if(form=='text')	this.xhr.setRequestHeader('Content-Type', 'text/xml');
				else{
					if(this.formData){
						this.xhr.setRequestHeader('Content-Type', 'multipart/form-data');
					}else{
						this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						for (var j in this.data) {
							text.push( j + "=" + encodeURIComponent(this.data[j]) );
						}
						this.data = text.join('&');
					}
				}
			}else{
				this.data = null;
			}
		}
	}

	this.send = function(form){
		try{
			if(this.xhr==null)  this.xhr = new XMLHttpRequest();
			this.xhr.responseType = this.type || '';
			this.xhr.open(this.method, this.url, !this.sync);
			if(form!==undefined)	this._send(this.method,form);
			this.xhr.send(this.data);
		}catch(e){
			this.onError(e.message);
		}
	}

	this.abort = function(){
		this.xhr.abort();
		this.xhr = null;
	}

	if(this.upload){
		this.xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				this.upload(e.loaded,e.total);
			}
		}
	}

	this.xhr.onreadystatechange = (function(){
		if ( this.xhr.readyState == 4) {
			if (this.xhr.status >= 200 && this.xhr.status < 300 || this.xhr.status == 304) {
				this.onSuccess(this.xhr.response);
			} else {
				this.onError('Serwer response error'+this.xhr.response);
			}
			this.onEnd();
			this.xhr = null;
		}
	}).bind(this);
}
