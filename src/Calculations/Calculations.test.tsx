import type * as calculations from './Calculations';
const {
  multiply,
  devide,
  calculateHighPriorityOperations,
  calculateLowPriorityOperations,
  calculateScopes,
  calculatePercent,
  calculateSqrt,
  calculate,
} = jest.requireActual<typeof calculations>('./Calculations');

test('multiply positive digits', () => {
  expect(multiply(['8', '6', '4', '5'], 2)).toBe(20);
});

test('multiply negative digits', () => {
  expect(multiply(['8', '6', '', '5'], 1)).toBe(-30);
});

test('devide positive digits', () => {
  expect(devide(['8', '16', '64'], 0)).toBe(0.5);
});

test('devide negative digits', () => {
  expect(devide(['8', '16', '', '64'], 1)).toBe(-0.25);
});

test('return calculated string after multiplication', () => {
  expect(calculateHighPriorityOperations('9+5*8-6*-8-5*-2*-9+10/-20', '*')).toBe('9+40+48-90+10/-20');
});

test('return calculated string after devision', () => {
  expect(calculateHighPriorityOperations('9+5*8-6*-8-5*-2*-9+10/-20', '/')).toBe('9+5*8-6*-8-5*-2*-9-0.5');
});

test('return calculated string after subtraction and summation', () => {
  expect(calculateLowPriorityOperations('9-40+6-8+75-100')).toBe('-58');
});

test('return calculated string after operations in scopes', () => {
  expect(calculateScopes('9*(10-9/(15-6))')).toBe('9*(10-9/9)');
});

test('return string with last digit calculated in %', () => {
  expect(calculatePercent('9*(10-9/(15-6))+10')).toBe('9*(10-9/(15-6))+8.1');
});

test('return Sqrt of calculated expression', () => {
  expect(calculateSqrt('9*(10-9/(15-6))')).toBe('9');
});

test('return calculated expression', () => {
  expect(calculate('9*(2-45/(15-6))')).toBe('-27');
});
