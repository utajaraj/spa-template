const R = require('ramda');
const words = Object.freeze([
	Object.freeze([
		'cero',
		'uno',
		'dos',
		'tres',
		'cuatro',
		'cinco',
		'seis',
		'siete',
		'ocho',
		'nueve',
	]),
	Object.freeze([
		'cero',
		'diez',
		'veinte y',
		'treinta y',
		'cuarenta y',
		'cincuenta y',
		'sesenta y',
		'setenta y',
		'ochenta y',
		'noventa y',
	]),
	Object.freeze([
		'cero',
		'ciento',
		'doscientos',
		'trescientos',
		'cuatrocientos',
		'quinientos',
		'seiscientos',
		'setecientos',
		'ochocientos',
		'novecientos',
	])
]);
const toWords = (triads) => {
	return R.map(digits => {
		return digits.reduce((previous, current, index) => [
			words[index][parseInt(current)],
			...previous
		], [])
			.join(' ')
			.replace(/diez cero/g, 'diez')
			.replace(/diez uno/g, 'once')
			.replace(/diez dos/g, 'doce')
			.replace(/diez tres/g, 'trece')
			.replace(/diez cuatro/g, 'catorce')
			.replace(/diez cinco/g, 'quince')
			.replace(/diez /g, 'dieci')
			.replace(/dieciseis/g, 'dieciséis')
			.replace(/veinte y cero/g, 'veinte')
			.replace(/veinte y /g, 'veinti')
			.replace(/(?: y )*cero/g, '')
		;
	}, triads);
};
const transform = (number) => {
    const reversedDigits = R.reverse(Array.from(number));
    // Note:
    // Flow doesn't support spread operator on strings :(
    // so we are using `Array.from`

    // Some times the "triads" have less than tree elements
    const digitTriads = R.splitEvery(3, reversedDigits);
    const wordTriads = toWords(digitTriads);

    return [
        ...[wordTriads[3]],
        wordTriads[3] ? 'mil' : '',
        ...[wordTriads[2]],
        wordTriads[2] ? 'millones' : '',
        ...[wordTriads[1]],
        wordTriads[1] ? 'mil' : '',
        ...[wordTriads[0]]
    ].join(' ')
        // Normalize white spaces...
        .replace(/\s+/g, ' ')
        .replace(/^ | $/g, '')
        // ...So now we can remove all wording anomalies
        .replace(/uno millones/g, 'un millón')
        .replace(/uno mil/g, 'un mil')
        .replace(/^un mil /g, 'mil ')// Avoids 'un millon' match
        .replace(/^un mil$/g, 'mil')
        .replace(/ciento$/g, 'cien')
        .replace(/ciento millones/g, 'cien millones')
        .replace(/ciento mil/g, 'cien mil')
        .replace(/millón mil/g, 'millón')
        .replace(/millones mil/g, 'millones')
}



module.exports = {
    toSpanish: (number) => {
        // TODO: Avoid string conversion?
        const numberAsString = R.toString(number);
        const [integerPart, fractionalPart] = R.split('.', numberAsString);

        const transformedIntegerPart = transform(integerPart);

        const fractionalLeadingZeroes = R.replace(/0/g, 'cero ', R.match(/^0+/, fractionalPart || '')[0] || '');
        const fractionalWithoutLeadingZeroes = transform(R.replace(/^0+/, '', fractionalPart || ''));
        const transformedFractionalPart = (fractionalPart
            ? ' coma '
            + fractionalLeadingZeroes
            + fractionalWithoutLeadingZeroes
            : '');

        return transformedIntegerPart + transformedFractionalPart;
    }
}