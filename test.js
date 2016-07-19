import test from 'ava';
import hypertermTitle from './';

test('it work!', t => {
	const result = hypertermTitle();
	t.is(result, 42);
});
