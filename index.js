import { debounce } from './utils.js';
import { 
	calcPerimetrRectangle,  
	calcSquareRectangle, 
	calcLengthCircle, 
	calcSquareCircle, 
	calcSquarePoligon 
} from './geometry.js';
import { Router } from './router.js';

let router = Router.create();
router.init({
    '/': renderComponent.bind(null, window.square),
    '/square': renderComponent.bind(null, window.square),
    '/rectangle': renderComponent.bind(null, window.rectangle),
    '/circle': renderComponent.bind(null, window.circle),
	'/triangle': renderComponent.bind(null, window.triangle),
    default : error
});


function error() {
    let h1 = document.createElement('h1'); 
    h1.textContent = '404';
    document.body.append(h1);
}

// ************************************
let fns = {
	rectangle: [calcPerimetrRectangle, calcSquareRectangle],
	square: [calcPerimetrRectangle, calcSquareRectangle],
	circle: [calcLengthCircle, calcSquareCircle],
	triangle: [calcSquarePoligon]
}

let calculator = document.querySelector('.calculator');
let figures = calculator.querySelector('.figures');
let panel = document.querySelector('.panel');
let inputs = [...document.querySelectorAll('input')];
let outputs = document.querySelectorAll('output');

figures.addEventListener('change', handleChange);
panel.addEventListener('input', debounce(handleInput, 300));
panel.addEventListener('keydown', handleKeyDown);
// figures.dispatchEvent(new Event('change'));

router.go(window.location);

// **********************************************************************

function handleChange(e) {
	let value  = e.target.value;
	history.pushState(null, '', value);
	router.go(window.location);
}

function renderComponent(template) {
	let component = template.content.cloneNode(true);
	let source = JSON.parse(sessionStorage.getItem(figures.value));
	let dest = component.querySelectorAll('input');
	source && restoreFieldValues(dest, source);
	panel.replaceChildren(component);

	inputs = [...document.querySelectorAll('input')];
	outputs = document.querySelectorAll('output');
	panel.dispatchEvent(new Event('input'));
}

function restoreFieldValues(dest, source) {
	dest.forEach(function setValue(el, i) {
		el.value = source[i];
	});
}


// function handleChange(e) {
// 	let value  = e.target.value;
// 	let template =  window[value].content.cloneNode(true);

// 	let source = JSON.parse(sessionStorage.getItem(value));
// 	let dest = template.querySelectorAll('input');
// 	source && restoreFieldValues(dest, source);

// 	panel.replaceChildren(template);
// 	inputs = [...document.querySelectorAll('input')];
// 	outputs = document.querySelectorAll('output');
// 	panel.dispatchEvent(new Event('input'));

// 	function restoreFieldValues(dest, source) {
// 		dest.forEach(function setValue(el, i) {
// 			el.value = source[i];
// 		});
// 	}
// }

function handleInput(e) {
	if (e.target.value == '') return outputs.forEach(clearOutput);

	let isInputFilled = inputs.every(function isFilled(input) {
		return !!input.value;
	});

	if (isInputFilled) {
		let figure = figures.value;
		let args = inputs.map(function getValue(input) {
			return +input.value;
		});

		sessionStorage.setItem(figure, JSON.stringify(args));

		let results = fns[figure].map(function callFn(fn) {
			try {
				return fn(...args);
			} catch(err) {
				return err;
			}
		});

		let err = document.querySelector('.err');
		if (results.some(function isError(result) {
			return Error.prototype.isPrototypeOf(result);
		})) {
			let messages = results.map(function readMessage(err) {
				return err.message;
			}).join('\n');

			if (err) {
				err.textContent = messages;
				err.style.display = 'block';
				return toggleVisible(outputs, { display: 'none' });
			} else {
				return alert(messages);
			}
		}

		if (err) {
			err.style.display = 'none';
			err.textContent = '';
			toggleVisible(outputs, { display: 'block' });
		}

		outputs.forEach(function printResult(output, i) {
			clearOutput(output);
			animateTyping(output, results[i].toString());
		});	
	}
	
	function toggleVisible(elements, { display }) {
		elements.forEach(function toggleDisplay(el) {
			el.style.display = display;		
		});
	}
}


function handleKeyDown(e) {
	if (e.key !== "Backspace") return;
	let { length } = e.target.value;

	if (length === 1) {
		showPlaceholder(e.target, 'Введите положительное число');
		outputs.forEach(clearOutput);
	}
}

function showPlaceholder(el, str) {
	el.value = '';
	el.placeholder = '';
	animateTyping(el, str, { prop: 'placeholder' });
}

function clearOutput(output) {
	let { textContent } = output;
	output.textContent = deleteLastNumber(textContent);	
	function deleteLastNumber(str) {
		let indexOfLastSpace = str.lastIndexOf(' ');
		return str.slice(0, indexOfLastSpace + 1);
	}
}

function animateTyping(el, str, settings = { prop: 'textContent', delay: undefined }) {
	let i = 0;
	let { prop, delay } = settings;
	requestAnimationFrame(function print() {
		if (i >= str.length) return;
		el[prop] += (str[i++]);
        if (delay) return setTimeout(requestAnimationFrame, delay, print);
		requestAnimationFrame(print);
	})
}