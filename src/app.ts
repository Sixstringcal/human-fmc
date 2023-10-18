import * as readline from "readline";
import { RubiksCube } from "./3x3";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function questionAsync(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  const input = await questionAsync("Enter your scramble:\n");
  const result = solve(input);
  console.log(result);
  rl.close();
}

function solve(scramble: string): string {
//   const cube: RubiksCube = new RubiksCube();
//   cube.applyMoves(scramble);
//   console.log(cube.cornerOrientation);
  const eoLengthMax = 6;
  const eo = solveEo(scramble, "", eoLengthMax);
  console.log(`${eo.length} EOs have been found with a max of ${eoLengthMax} moves.`);
  const dr = solveDrFirst(scramble, eo, 11);
  console.log(`DR result: ${dr}`);
  return dr;
}

function solveDrFirst(
  scramble: string,
  solutions: string[],
  toBeat: number
): string {
  let dr = "D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D";
  let temp = "";
  solutions.forEach((solution) => {
    temp = solveDr(scramble, solution, Math.min(toBeat, dr.split(" ").length));
    if (temp.split(" ").length < dr.split(" ").length) {
      dr = temp;
    }
  });
  return dr;
}

function solveDr(scramble: string, solution: string, toBeat: number): string {
  const cube: RubiksCube = new RubiksCube();
  cube.applyMoves(scramble);
  cube.applyMoves(solution);
  if (cube.udDrSolved()) {
    console.log(`dr found: ${solution}`);
    return solution;
  }
  cube.solve();
  if (solution.split(" ").length > toBeat) {
    return (
      solution +
      "D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D"
    );
  }
  let rp = "";
  let moves = solution.split(" ");
  let lastMove: string = moves[moves.length - 1][0];
  let secondToLastMove = moves[moves.length - 1][0];
  let eo =
    "D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D";
  if (
    solution.length === 0 ||
    !((lastMove === "L" && secondToLastMove === "R") || lastMove === "R")
  ) {
    rp = solveDr(
      scramble,
      `${solution} R`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
    rp = solveDr(
      scramble,
      `${solution} R'`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
    rp = solveDr(
      scramble,
      `${solution} R2`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
  }
  if (solution.length === 5) {
    console.log(`R done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
  }
  if (
    solution.length === 0 ||
    !((lastMove === "R" && secondToLastMove === "L") || lastMove === "L")
  ) {
    rp = solveDr(
      scramble,
      `${solution} L`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
    rp = solveDr(
      scramble,
      `${solution} L'`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
    rp = solveDr(
      scramble,
      `${solution} L2`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
  }
  if (scramble.length === 0) {
    console.log(`L done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
  }
  if (
    solution.length === 0 ||
    !((lastMove === "B" && secondToLastMove === "F") || lastMove === "F")
  ) {
    rp = solveDr(
      scramble,
      `${solution} F2`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
  }
  if (scramble.length === 0) {
    console.log(`F done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
  }
  if (
    solution.length === 0 ||
    !((lastMove === "F" && secondToLastMove === "B") || lastMove === "B")
  ) {
    rp = solveDr(
      scramble,
      `${solution} B2`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
  }
  if (scramble.length === 0) {
    console.log(`B done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
  }
  if (
    solution.length === 0 ||
    !((lastMove === "D" && secondToLastMove === "U") || lastMove === "U")
  ) {
    rp = solveDr(
      scramble,
      `${solution} U`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
    rp = solveDr(
      scramble,
      `${solution} U'`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
    rp = solveDr(
      scramble,
      `${solution} U2`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
  }
  if (scramble.length === 0) {
    console.log(`U done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
  }
  if (
    solution.length === 0 ||
    !((lastMove === "U" && secondToLastMove === "D") || lastMove === "D")
  ) {
    rp = solveDr(
      scramble,
      `${solution} D`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
    rp = solveDr(
      scramble,
      `${solution} D'`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
    rp = solveDr(
      scramble,
      `${solution} D2`,
      Math.min(toBeat, eo.split(" ").length)
    );
    if (eo.split(" ").length > rp.split(" ").length) {
      eo = rp;
    }
  }
  return eo;
}

function solveEo(scramble: string, solution: string, toBeat: number): string[] {
  const cube: RubiksCube = new RubiksCube();
  let eoList = [];
  cube.applyMoves(scramble);
  cube.applyMoves(solution);
  if (cube.fbEoSovled()) {
    // console.log(`eo found: ${solution}`);
    return [solution];
  }
  cube.solve();
  if (solution.split(" ").length > toBeat) {
    return [];
  }
  let rp = [];
  let moves = solution.split(" ");
  let lastMove: string = moves[moves.length - 1][0];
  let secondToLastMove = moves[moves.length - 1][0];
  if (
    solution.length === 0 ||
    !((lastMove === "L" && secondToLastMove === "R") || lastMove === "R")
  ) {
    rp = solveEo(scramble, `${solution} R`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} R'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} R2`, toBeat);
    eoList = [...eoList, ...rp];
  }
  if (
    solution.length === 0 ||
    !((lastMove === "R" && secondToLastMove === "L") || lastMove === "L")
  ) {
    rp = solveEo(scramble, `${solution} L`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} L'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} L2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "B" && secondToLastMove === "F") || lastMove === "F")
  ) {
    rp = solveEo(scramble, `${solution} F`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} F'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} F2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "F" && secondToLastMove === "B") || lastMove === "B")
  ) {
    rp = solveEo(scramble, `${solution} B`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} B'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} B2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "D" && secondToLastMove === "U") || lastMove === "U")
  ) {
    rp = solveEo(scramble, `${solution} U`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} U'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} U2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "U" && secondToLastMove === "D") || lastMove === "D")
  ) {
    rp = solveEo(scramble, `${solution} D`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} D'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveEo(scramble, `${solution} D2`, toBeat);
    eoList = [...eoList, ...rp];
  }
  return eoList;
}
main().catch((err) => console.error(err));
