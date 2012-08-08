## API

## document.cal
``` js
	{
		days: ['N','P','W','Ś','C','P','S'],
		month: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień']
	}
```

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
		fn: function(){
			this.className = 'next2';
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

## xhr ( url[, method, sync] ) [constructor]
* url - adres url
* method - domyślnie 'GET'
* sync - połączenie synchroniczne, domyślnie false

### Metody
* on ( event, function) - uchwyt dla ( end, error, done )
* form ( [form] ) - tworzy obiekt FormData, jeżeli wskazujemy formularz urzywa go jako argumentu.
* abort ( ) - przerywa żądzanie
* send ( [data] ) - wysyła żądanie, opcjonalnie dane do przesłania
* upload ( fuu ) - wykonuje funkcje **fuu** podając argumenty: dane wysłane, dane wszystkie
* scout ( id, data ) - wysłanie żądanie jak **send**, żądania wysłane przy pomocy **next** zostaną wysłane dopiero po zakończeniu tego zdarzenia
* next ( id, data ) - wysłanie żądanie lecz dopiero po zakończeniu połączenia **scout** o podanym id

### Własności
* xhr - obiekt komunikacji
* data - dane do przesłania
* url - adres url
* afterId - domyślnie false, true gdy **next** lub id gdy **scout**
* afterList - tablica żadań **next** do wysłania po połączeniu

[XHR level 2](http://www.html5rocks.com/en/tutorials/file/xhr2/)