import type * as calculations from "./Calculations";
const { multiply, devide } = jest.requireActual<typeof calculations>("./Calculations");

test("multiply function", () => {
  expect(multiply(["8", "6"], 0)).toBe(48);
});

test("devide function", () => {
  expect(devide(["8", "16"], 0)).toBe(0.5)
});
