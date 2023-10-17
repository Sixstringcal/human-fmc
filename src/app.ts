import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your scramble:\n", (input) => {
  solve(input);
  rl.close();
});

function solve(scramble: string): void {
  const cube: RubiksCube = new RubiksCube();
  cube.applyMoves(scramble);
}
