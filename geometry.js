function calcPerimetrRectangle(a, b = a) {
	if (a <= 0 || b <= 0) throw Error('Стороны прямоугольника должны быть больше нуля');
	return (a + b) * 2;
}

function calcSquareRectangle(a, b = a) {
	if (a <= 0 || b <= 0) throw Error('Стороны прямоугольника должны быть больше нуля');
	return a * b;
}

function calcLengthCircle(r) {
	if(r <= 0) throw Error('Радиус окружности должен быть больше нуля');
	return 2 * Math.PI * r;
}

function calcSquareCircle(r) {
	if(r <= 0) throw Error('Радиус окружности должен быть больше нуля')
	return Math.PI * r**2;
}

function calcSquarePoligon(a, b = a, c = a) {
	if (a <= 0 || b <= 0 || c <= 0) throw Error('Стороны треугольника должны быть больше нуля');
	if (a >= b+c || b >= a+c || c >= a+b) throw Error('Треугольник с такими длинами сторон не может существовать');
	let p = (a + b + c) / 2;
	return Math.sqrt((p * (p - a) * (p - b) * (p - c)));
}

export { 
	calcPerimetrRectangle,  
	calcSquareRectangle, 
	calcLengthCircle, 
	calcSquareCircle, 
	calcSquarePoligon 
};