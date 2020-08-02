import { newBoard } from "./newBoard";
import Checkers from "../models/Checkers";

export default class CheckersView extends Checkers {
  constructor() {
    super();
    // DOM Consts
    this.board = document.getElementById("board");
    this.blackSpaces = document.querySelectorAll("[data-black]");
    this.whiteCheckers = document.querySelectorAll(".checker.white");
    this.redCheckers = document.querySelectorAll(".checker.red");
    this.newBoard = newBoard;
    this.styleElements = {
      SELECTABLE: "selectable",
      SELECTED: "selected",
    };

    // Event Handler Binds
    this.selectClick = this.selectClick.bind(this);
    this.jump = this.jump.bind(this);
    this.move = this.move.bind(this);
  }

  /*******************GAME INITIALIZE********************************************************/
  init() {
    // Reinitialize board data w/ parent init
    super.init();

    // Clear and repopulate html board
    this.board.innerHTML = "";
    this.board.insertAdjacentHTML("beforeend", newBoard);

    // Reinitialize DOM elements
    this.blackSpaces = document.querySelectorAll("[data-black]");
    this.whiteCheckers = document.querySelectorAll(".checker.white");
    this.redCheckers = document.querySelectorAll(".checker.red");

    // Reinitialize DOM state
    this.DOMstate = {
      selectableCheckers: [], // array of DOM elemets selectable on turn
      selected: -1, // DOM element of selected
      selectableMoves: [], // array of DOM elements that are move spots for selected
      selectableJumps: [], // array of DOM elements that are jump spots for selected
    };

    this.gameOver = false;
  }

  /*******************TURN INITIALIZE********************************************************/
  // Change turn on parent, change turn class on html board
  setTurn() {
    super.setTurn();
    if (super.getTurn() === "white") {
      this.board.classList.remove("red");
      this.board.classList.add("white");
    } else {
      this.board.classList.remove("white");
      this.board.classList.add("red");
    }
  }

  // Make jumpable/movable checkers available for selection
  makeSelection() {
    //this.clearTurnState(); -> letting move function do this
    if (!this.setAnyJumps()) {
      if (!this.setAnyMoves()) {
        console.log(
          `${this.getTurn() === "red" ? "WHITE WINS!" : "RED WINS!"}`
        );
        this.gameOver = true;
      }
    }
    if (this.gameOver === false) {
      this.DOMstate.selectableCheckers.forEach((ele) => {
        ele.classList.add(this.styleElements.SELECTABLE);
        ele.addEventListener("click", this.selectClick);
      });
    }
  }

  clearTurnState() {
    // Clear select state
    this.clearSelectState();
    // Remove event listeners and selectable class for turn
    this.DOMstate.selectableCheckers.forEach((node) => {
      node.classList.remove(this.styleElements.SELECTABLE);
      node.removeEventListener("click", this.selectClick);
    });

    this.DOMstate.selectableCheckers = [];
  }

  // Sets jumps and returns TRUE if there are any available for turn
  setAnyJumps() {
    super.setAnyJumps();
    let jumpCoords = super.getAnyJumps();
    // If jumps are available, only make those checkers selectable
    if (jumpCoords.length > 0) {
      console.log("jumpable: ");
      jumpCoords.forEach((coord) => {
        console.log(this.convertCoordToSpace(coord));
        this.DOMstate.selectableCheckers.push(this.convertCoordToSpace(coord));
      });
      return true;
    }
    return false;
  }

  // Sets moves and returns TRUE if there are any available for turn
  setAnyMoves() {
    super.setAnyMoves();
    let moveCoords = super.getAnyMoves();
    // if moves are available
    if (moveCoords.length > 0) {
      console.log("movable: ");
      moveCoords.forEach((coord) => {
        console.log(coord);
        console.log(this.convertCoordToSpace(coord));
        this.DOMstate.selectableCheckers.push(this.convertCoordToSpace(coord));
      });
      return true;
    }
    return false;
  }

  /*******************SELECT INITIALIZE********************************************************/
  // Event handler for selecting checker
  selectClick(e) {
    // If not a black space (prevent bubbling)
    if (!e.target.classList.contains("black")) {
      // Reset select state
      this.clearSelectState();
      // Make clicked checker selected
      const cur = e.target;
      this.setSelected(this.convertSpacetoCoord(cur));
      console.log(this.DOMstate.selected);
    }
  }

  clearSelectState() {
    // Remove event listeners and 'selectable' class for current jumps/moves
    if (this.DOMstate.selectableJumps.length > 0)
      this.DOMstate.selectableJumps.forEach((space) => {
        space.removeEventListener("click", this.jump);
        space.classList.remove(this.styleElements.SELECTABLE);
      });
    if (this.DOMstate.selectableMoves.length > 0)
      this.DOMstate.selectableMoves.forEach((space) => {
        space.removeEventListener("click", this.move);
        space.classList.remove(this.styleElements.SELECTABLE);
      });

    if (this.DOMstate.selected !== -1)
      this.DOMstate.selected.classList.remove(this.styleElements.SELECTED);

    this.DOMstate.selectableMoves = [];
    this.DOMstate.selectableJumps = [];
    this.DOMstate.selected = -1;
  }

  setSelected(coord) {
    // Set selected on parent class derive DOM node from coord
    super.setSelected(coord);
    if (coord !== -1) {
      this.DOMstate.selected = this.convertCoordToChecker(this.state.selected);
      this.DOMstate.selected.classList.add(this.styleElements.SELECTED);
    }

    // Calculate jump/move options using parent class
    super.setJumps();
    super.setMoves();
    let jumps = super.getJumps();
    let moves = super.getMoves();

    // If jumps available, add event listeners, selectable class
    if (jumps.length > 1) {
      console.log("Jumps:");
      jumps.forEach((coord) => {
        console.log(coord);
        this.DOMstate.selectableJumps.push(this.convertCoordToSpace(coord));
      });
      this.DOMstate.selectableJumps.forEach((space) => {
        space.classList.add(this.styleElements.SELECTABLE);
        space.addEventListener("click", this.jump);
      });
    }
    // Else (moves are available) add eventlisteners, selectable class
    else {
      console.log("Moves:");
      moves.forEach((coord) => {
        console.log(coord);
        this.DOMstate.selectableMoves.push(this.convertCoordToSpace(coord));
      });
      this.DOMstate.selectableMoves.forEach((space) => {
        space.classList.add(this.styleElements.SELECTABLE);
        space.addEventListener("click", this.move);
      });
    }
  }

  /*******************JUMP/MOVE EXECUTION********************************************************/

  jump(e) {
    let cur = e.target;
    if (super.jump(this.convertSpacetoCoord(cur))) {
      this.DOMstate.selected.parentElement.removeChild(this.DOMstate.selected);
      cur.appendChild(this.DOMstate.selected);
      this.clearSelectState();
      super.setSelected(this.convertSpacetoCoord(cur));
    }
  }

  move(e) {
    let cur = e.target;
    if (super.move(this.convertSpacetoCoord(cur))) {
      this.DOMstate.selected.parentElement.removeChild(this.DOMstate.selected);
      cur.appendChild(this.DOMstate.selected);
      this.clearTurnState();
      this.setTurn();
      this.makeSelection();
    }
  }

  /*******************UTILITIES********************************************************/
  // Converts coordinate in [int x, int y] form to the respective DOM element
  convertCoordToSpace(coord) {
    return document.getElementById(`${coord[0]}-${coord[1]}`);
  }

  convertCoordToChecker(coord) {
    return document.getElementById(`${coord[0]}-${coord[1]}`).firstElementChild;
  }

  // Uses black space ID to extract coordinate in [int x, int y] form
  // accepts either black space (parent) or checker (child) element
  convertSpacetoCoord(space) {
    return space.classList.contains("black")
      ? [parseInt(space.id.charAt(0), 10), parseInt(space.id.charAt(2), 10)]
      : [
          parseInt(space.parentElement.id.charAt(0), 10),
          parseInt(space.parentElement.id.charAt(2), 10),
        ];
  }
}
