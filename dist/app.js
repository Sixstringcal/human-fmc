"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const _3x3_1 = require("./3x3");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function questionAsync(query) {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = yield questionAsync("Enter your scramble:\n");
        const result = solve(input);
        console.log(result);
        rl.close();
    });
}
function solve(scramble) {
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
function solveDrFirst(scramble, solutions, toBeat) {
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
function solveDr(scramble, solution, toBeat) {
    const cube = new _3x3_1.RubiksCube();
    cube.applyMoves(scramble);
    cube.applyMoves(solution);
    if (cube.udDrSolved()) {
        console.log(`dr found: ${solution}`);
        return solution;
    }
    cube.solve();
    if (solution.split(" ").length > toBeat) {
        return (solution +
            "D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D");
    }
    let rp = "";
    let moves = solution.split(" ");
    let lastMove = moves[moves.length - 1][0];
    let secondToLastMove = moves[moves.length - 1][0];
    let eo = "D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D D";
    if (solution.length === 0 ||
        !((lastMove === "L" && secondToLastMove === "R") || lastMove === "R")) {
        rp = solveDr(scramble, `${solution} R`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
        rp = solveDr(scramble, `${solution} R'`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
        rp = solveDr(scramble, `${solution} R2`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
    }
    if (solution.length === 5) {
        console.log(`R done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
    }
    if (solution.length === 0 ||
        !((lastMove === "R" && secondToLastMove === "L") || lastMove === "L")) {
        rp = solveDr(scramble, `${solution} L`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
        rp = solveDr(scramble, `${solution} L'`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
        rp = solveDr(scramble, `${solution} L2`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
    }
    if (scramble.length === 0) {
        console.log(`L done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
    }
    if (solution.length === 0 ||
        !((lastMove === "B" && secondToLastMove === "F") || lastMove === "F")) {
        rp = solveDr(scramble, `${solution} F2`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
    }
    if (scramble.length === 0) {
        console.log(`F done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
    }
    if (solution.length === 0 ||
        !((lastMove === "F" && secondToLastMove === "B") || lastMove === "B")) {
        rp = solveDr(scramble, `${solution} B2`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
    }
    if (scramble.length === 0) {
        console.log(`B done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
    }
    if (solution.length === 0 ||
        !((lastMove === "D" && secondToLastMove === "U") || lastMove === "U")) {
        rp = solveDr(scramble, `${solution} U`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
        rp = solveDr(scramble, `${solution} U'`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
        rp = solveDr(scramble, `${solution} U2`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
    }
    if (scramble.length === 0) {
        console.log(`U done!  ToBeat: ${Math.min(toBeat, eo.split(" ").length)}`);
    }
    if (solution.length === 0 ||
        !((lastMove === "U" && secondToLastMove === "D") || lastMove === "D")) {
        rp = solveDr(scramble, `${solution} D`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
        rp = solveDr(scramble, `${solution} D'`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
        rp = solveDr(scramble, `${solution} D2`, Math.min(toBeat, eo.split(" ").length));
        if (eo.split(" ").length > rp.split(" ").length) {
            eo = rp;
        }
    }
    return eo;
}
function solveEo(scramble, solution, toBeat) {
    const cube = new _3x3_1.RubiksCube();
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
    let lastMove = moves[moves.length - 1][0];
    let secondToLastMove = moves[moves.length - 1][0];
    if (solution.length === 0 ||
        !((lastMove === "L" && secondToLastMove === "R") || lastMove === "R")) {
        rp = solveEo(scramble, `${solution} R`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} R'`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} R2`, toBeat);
        eoList = [...eoList, ...rp];
    }
    if (solution.length === 0 ||
        !((lastMove === "R" && secondToLastMove === "L") || lastMove === "L")) {
        rp = solveEo(scramble, `${solution} L`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} L'`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} L2`, toBeat);
        eoList = [...eoList, ...rp];
    }
    if (solution.length === 0 ||
        !((lastMove === "B" && secondToLastMove === "F") || lastMove === "F")) {
        rp = solveEo(scramble, `${solution} F`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} F'`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} F2`, toBeat);
        eoList = [...eoList, ...rp];
    }
    if (solution.length === 0 ||
        !((lastMove === "F" && secondToLastMove === "B") || lastMove === "B")) {
        rp = solveEo(scramble, `${solution} B`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} B'`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} B2`, toBeat);
        eoList = [...eoList, ...rp];
    }
    if (solution.length === 0 ||
        !((lastMove === "D" && secondToLastMove === "U") || lastMove === "U")) {
        rp = solveEo(scramble, `${solution} U`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} U'`, toBeat);
        eoList = [...eoList, ...rp];
        rp = solveEo(scramble, `${solution} U2`, toBeat);
        eoList = [...eoList, ...rp];
    }
    if (solution.length === 0 ||
        !((lastMove === "U" && secondToLastMove === "D") || lastMove === "D")) {
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
//# sourceMappingURL=app.js.map