## Kilka ułatwień

#### API
---

##### $(selector)
	$ == document.querySelector

##### $$(selector)
	$$ == document.querySelectorAll

##### HTMLElement.remove()
	$('#id').remove();
	// zwraca usunięty element, tu element z id=='id'

##### HTMLElement.move(number)
* number - przesunięcie o n elemntów, dla n<0 przesunięcie do przodu

użycie:
 	$('#id').move(-1);
 	// przesuwa element wewnątrz węzła o daną ilość elementów
 	// tutaj o jeden wcześniej

##### HTMLElement.insertAfter(HTMLElement)
	przeciwieństwo: HTMLElement.insertBefore

##### addHTML/HTMLElement.addHTML(tag,params)
Tworzenie nowych elementów HTML
* tag - HTML tag jak np: div
* [params] - {}
	* name
	* id
	* class
	* html - innerHTML
	* fn - funckja z argumentem zwracającym tworzony element

użycie:
	$('#id').addHTML('div',{
		name: 'name',
		id: 'id2',
		class: 'next',
		html: 'Text',
		fn: function(ele){
			ele.className = 'next2';
		}
	});
	--> \<div name='name' id='id2' class='next2'\>Text\</div\>

##### Object.sort(object,sortFunction)
	Object.sort({3: '0', 2: '1', 1: '2'},function(x,y){
		return x>y;
	});
	--> [1,2,3]

##### HTMLElement.shuffle()

     tab
> cos
> ktos

> single
> > double

> sinlge
>	with tab

1. list
1. list2
* cos
* ktos