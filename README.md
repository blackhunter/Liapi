## Kilka ułatwień

#### API

##### $
	$ == document.querySelector

##### $$
	$$ == document.querySelectorAll

##### HTMLElement.remove()
użycie:
	$('#id').remove();
	> zwraca usunięty element

##### HTMLElement.remove
 użycie:
 	$('#id').move(-1);
 	> przesuwa element wewnątrz węzła o daną ilość elementów
 	> tutaj o jeden wcześniej

##### HTMLElement.insertAfter
	odwrotność insertBefore

##### addHTML lub HTMLElement.addHTML
> tworzy nowy element i wstawia jeżeli użyty jako metoda rodzica
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
	--> <div name='name' id='id2' class='next2'>Text</div>

##### Object.sort
> zwraca klucze obiektu posortowane według funkcji
użycie:
	Object.sort({3: '0', 2: '1', 1: '2'},function(x,y){
		return x>y;
	});
	--> [1,2,3]

##### HTMLElement.shuffle

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