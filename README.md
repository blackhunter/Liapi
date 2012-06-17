## API

## $ (selector)
	$ == document.querySelector

## $$ (selector)
	$$ == document.querySelectorAll

## HTMLElement.remove ()
``` js
	$('#id').remove ();
	// zwraca usunięty element, tu element z id=='id'
```
## HTMLElement.move (number)
* **number** - przesunięcie o n elemntów, dla n<0 przesunięcie do przodu

``` js
 	$('#id').move(-1);
 	// przesuwa element wewnątrz węzła o daną ilość elementów
 	// tutaj o jeden wcześniej
```

## HTMLElement.asPrev (HTMLElement)
	łatwiejsze użycie HTMLElement.insertBefore

## HTMLElement.asNext (HTMLElement)
	przeciwieństwo: HTMLElement.asPrev

## addHTML / HTMLElement.addHTML (tag,params)
Tworzenie nowych elementów HTML
* **tag** - HTML tag jak np: div
* **[params]** - {}
	* name
	* id
	* class
	* html - innerHTML
	* fn - funckja z argumentem zwracającym tworzony element

``` js
	$('#id').addHTML('div',{
		name: 'name',
		id: 'id2',
		class: 'next',
		html: 'Text',
		fn: function(ele){
			ele.className = 'next2';
		}
	});
	--> <div name='name' id='id2' class='next2'>Text</div>
```

## Object.sort (object,sortFunction)
* **object** - obiekt, którego klucze będziemy sortować
* **sortFunction** - funkcja sortująca, analogicznie do Array.sort()

``` js
	Object.sort({3: '0', 2: '1', 1: '2'},function(x,y){
		return x>y;
	});
	--> [1,2,3]
```

## xhr (options) [constructor]
* **[options]** - {}
	* onError - funkcja w przypadku błędu
	* onEnd - funkcja na koniec
	* onSuccess - funkcja w przypadku powodzenia
	* method - domyślnie 'GET'
	* sync - połączenie synchroniczne, domyślnie false
	* data - dane do przesłania, w GET są automatycznie parsowane do url, domyślnie null
	* url - adres
	* type - responseType

### Metody
* abort - przerywa żądzanie
* send(['json'/'text']) - wysyła żądanie, możliwość zdefiniowania dwóch 'Content-Type'
* form(form) - pobieranie danych z formularza(url, method, data), dane wysłane jak przy formularzach, zwraca obiekt typu: FormData

``` js
	var ajax = new xhr({
		onSucces: function(data){
			console.log(data);
		},
		url: 'google.com',
		method: 'POST'
	});
	ajax.send();
````
[XHR level 2](http://www.html5rocks.com/en/tutorials/file/xhr2/)