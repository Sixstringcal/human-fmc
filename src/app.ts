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
  console.log(
    `${eo.length} EOs have been found with a max of ${eoLengthMax} moves.`
  );
  const drLengthMax = 11;
  const dr = solveDrFirst(scramble, eo, drLengthMax);
  console.log(
    `${dr.length} DRs have been found with a max of ${drLengthMax} moves.`
  );
  const htrLengthMax = 18;
  const htr = solveHtrFirst(scramble, dr, htrLengthMax);
  return "";
}

function solveHtrFirst(
  scramble: string,
  solutions: string[],
  toBeat: number
): string[] {
  let htr = [];
  solutions.forEach((solution) => {
    htr = [...htr, ...solveHtr(scramble, solution, toBeat)];
  });
  return htr;
}

function cpSolvedIn4MovesMax(
  scramble: string,
  solution: string,
  movesLeft: number
): boolean {
  let moves = solution.split(" ");
  let lastMove: string = moves[moves.length - 1][0];
  let secondToLastMove = moves[moves.length - 1][0];
  const cube: RubiksCube = new RubiksCube();
  cube.applyMoves(scramble);
  cube.applyMoves(solution);
  if (cube.cpSolved()) {
    return true;
  }
  if (movesLeft === 0) {
    return false;
  }
  if (
    solution.length === 0 ||
    !((lastMove === "L" && secondToLastMove === "R") || lastMove === "R")
  ) {
    if (cpSolvedIn4MovesMax(scramble, `${solution} R2`, movesLeft - 1)) {
      return true;
    }
  }
  if (
    solution.length === 0 ||
    !((lastMove === "R" && secondToLastMove === "L") || lastMove === "L")
  ) {
    if (cpSolvedIn4MovesMax(scramble, `${solution} L2`, movesLeft - 1)) {
      return true;
    }
  }
  if (
    solution.length === 0 ||
    !((lastMove === "B" && secondToLastMove === "F") || lastMove === "F")
  ) {
    if (cpSolvedIn4MovesMax(scramble, `${solution} F2`, movesLeft - 1)) {
      return true;
    }
  }
  if (
    solution.length === 0 ||
    !((lastMove === "F" && secondToLastMove === "B") || lastMove === "B")
  ) {
    if (cpSolvedIn4MovesMax(scramble, `${solution} B2`, movesLeft - 1)) {
      return true;
    }
  }
  if (
    solution.length === 0 ||
    !((lastMove === "D" && secondToLastMove === "U") || lastMove === "U")
  ) {
    if (cpSolvedIn4MovesMax(scramble, `${solution} U2`, movesLeft - 1)) {
      return true;
    }
  }
  if (
    solution.length === 0 ||
    !((lastMove === "U" && secondToLastMove === "D") || lastMove === "D")
  ) {
    if (cpSolvedIn4MovesMax(scramble, `${solution} D2`, movesLeft - 1)) {
      return true;
    }
  }
  return false;
}

function solveHtr(
  scramble: string,
  solution: string,
  toBeat: number
): string[] {
  const cube: RubiksCube = new RubiksCube();
  let eoList = [];
  cube.applyMoves(scramble);
  cube.applyMoves(solution);
  if (cube.allOpposites() && cpSolvedIn4MovesMax(scramble, solution, 4)) {
    console.log(`HTR found: ${solution}`);
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
    rp = solveHtr(scramble, `${solution} R2`, toBeat);
    eoList = [...eoList, ...rp];
  }
  if (
    solution.length === 0 ||
    !((lastMove === "R" && secondToLastMove === "L") || lastMove === "L")
  ) {
    rp = solveHtr(scramble, `${solution} L2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "B" && secondToLastMove === "F") || lastMove === "F")
  ) {
    rp = solveHtr(scramble, `${solution} F2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "F" && secondToLastMove === "B") || lastMove === "B")
  ) {
    rp = solveHtr(scramble, `${solution} B2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "D" && secondToLastMove === "U") || lastMove === "U")
  ) {
    rp = solveHtr(scramble, `${solution} U`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveHtr(scramble, `${solution} U'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveHtr(scramble, `${solution} U2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "U" && secondToLastMove === "D") || lastMove === "D")
  ) {
    rp = solveHtr(scramble, `${solution} D`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveHtr(scramble, `${solution} D'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveHtr(scramble, `${solution} D2`, toBeat);
    eoList = [...eoList, ...rp];
  }
  return eoList;
}

function solveDrFirst(
  scramble: string,
  solutions: string[],
  toBeat: number
): string[] {
  let dr = [];
  solutions.forEach((solution) => {
    dr = [...dr, ...solveDr(scramble, solution, toBeat)];
  });
  return dr;
}

function solveDr(scramble: string, solution: string, toBeat: number): string[] {
  const cube: RubiksCube = new RubiksCube();
  let eoList = [];
  cube.applyMoves(scramble);
  cube.applyMoves(solution);
  if (cube.udDrSolved()) {
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
    rp = solveDr(scramble, `${solution} R`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveDr(scramble, `${solution} R'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveDr(scramble, `${solution} R2`, toBeat);
    eoList = [...eoList, ...rp];
  }
  if (
    solution.length === 0 ||
    !((lastMove === "R" && secondToLastMove === "L") || lastMove === "L")
  ) {
    rp = solveDr(scramble, `${solution} L`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveDr(scramble, `${solution} L'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveDr(scramble, `${solution} L2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "B" && secondToLastMove === "F") || lastMove === "F")
  ) {
    rp = solveDr(scramble, `${solution} F2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "F" && secondToLastMove === "B") || lastMove === "B")
  ) {
    rp = solveDr(scramble, `${solution} B2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "D" && secondToLastMove === "U") || lastMove === "U")
  ) {
    rp = solveDr(scramble, `${solution} U`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveDr(scramble, `${solution} U'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveDr(scramble, `${solution} U2`, toBeat);
    eoList = [...eoList, ...rp];
  }

  if (
    solution.length === 0 ||
    !((lastMove === "U" && secondToLastMove === "D") || lastMove === "D")
  ) {
    rp = solveDr(scramble, `${solution} D`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveDr(scramble, `${solution} D'`, toBeat);
    eoList = [...eoList, ...rp];

    rp = solveDr(scramble, `${solution} D2`, toBeat);
    eoList = [...eoList, ...rp];
  }
  return eoList;
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
