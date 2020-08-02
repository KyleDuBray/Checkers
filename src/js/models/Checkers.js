export default class Checkers {
  constructor() {
    this.state = {
      turn: "", // "red" or "white"
      selected: -1, //[int x, int y] coord of selected
      availMoves: -1, //[[int x, int y],...] available coords for move
      availJumps: -1, //[[int x, int y], ...] available coords to jump to
      anyMoves: -1, //[[int x, int y],...] array of checkers that can move on turn
      anyJumps: -1, //[[int x, int y],...] array of checkers that must jump on turn

      boardArray: -1, //Contains array of working board
    };

    this.REDCHECKER = "r";
    this.REDKING = "rk";
    this.WHITECHECKER = "w";
    this.WHITEKING = "wk";
    this.OPENSPACE = "o";
    this.INACCESSIBLE = "X";
  }

  // Initializes board and sets turn
  init() {
    this.state.boardArray = [
      ["X", "r", "X", "r", "X", "r", "X", "r"],
      ["r", "X", "r", "X", "r", "X", "r", "X"],
      ["X", "r", "X", "r", "X", "r", "X", "r"],
      ["o", "X", "o", "X", "o", "X", "o", "X"],
      ["X", "o", "X", "o", "X", "o", "X", "o"],
      ["w", "X", "w", "X", "w", "X", "w", "X"],
      ["X", "w", "X", "w", "X", "w", "X", "w"],
      ["w", "X", "w", "X", "w", "X", "w", "X"],
    ];
  }

  // Sets current turn
  setTurn() {
    this.state.turn = this.state.turn === "red" ? "white" : "red";
  }
  getTurn() {
    return this.state.turn;
  }

  // Sets coord that is currently selected to move/jump
  setSelected(coord) {
    this.state.selected = [coord[0], coord[1]];
  }
  getSelected() {
    return this.state.selected;
  }

  // Sets coords to which selected can move
  setMoves() {
    this.state.availMoves = this.calcMoves();
  }
  getMoves() {
    return this.state.availMoves;
  }

  // Sets coords over which selected can jump
  setJumps() {
    this.state.availJumps = this.calcJumps();
  }
  getJumps() {
    return this.state.availJumps;
  }

  // Sets coords that have move(s) available
  setAnyMoves() {
    this.state.anyMoves = this.calcAnyMoves();
  }
  getAnyMoves() {
    return this.state.anyMoves;
  }

  // Sets coords that have jump(s) available
  setAnyJumps() {
    this.state.anyJumps = this.calcAnyJumps();
  }
  getAnyJumps() {
    return this.state.anyJumps;
  }

  move(coord) {
    let cur = this.getSelected();
    if (cur !== -1) {
      this.state.boardArray[coord[0]][coord[1]] = this.getCoordType(cur);
      this.state.boardArray[cur[0]][cur[1]] = this.OPENSPACE;
      console.log(this.state.boardArray);
      return true;
    }
    return false;
  }

  jump(coord) {
    let cur = this.getSelected();
    if (cur !== -1) {
      this.state.boardArray[coord[0]][coord[1]] = this.getCoordType(cur);
      this.state.boardArray[cur[0]][cur[1]] = this.OPENSPACE;
      let jumped = this.getJumpedCoord(cur, coord);
      console.log(`jumped: ${jumped}`);
      this.state.boardArray[jumped[0]][jumped[1]] = this.OPENSPACE;
      return true;
    }
    return false;
  }

  /***************UTILITIES******************************************************/

  typeMatchTurn(type) {
    return (
      (this.state.turn === "red" &&
        (type === this.REDCHECKER || type === this.REDKING)) ||
      (this.state.turn === "white" &&
        (type === this.WHITECHECKER || type === this.WHITEKING))
    );
  }

  // Returns array of available coords to which selected checker can move
  calcMoves() {
    let arr = [];
    if (
      this.canDownLeftMove(
        this.state.selected,
        this.getCoordType(this.state.selected)
      )
    )
      arr.push(this.getDownLeftMove(this.state.selected));
    if (
      this.canDownRightMove(
        this.state.selected,
        this.getCoordType(this.state.selected)
      )
    )
      arr.push(this.getDownRightMove(this.state.selected));
    if (
      this.canUpLeftMove(
        this.state.selected,
        this.getCoordType(this.state.selected)
      )
    )
      arr.push(this.getUpLeftMove(this.state.selected));
    if (
      this.canUpRightMove(
        this.state.selected,
        this.getCoordType(this.state.selected)
      )
    )
      arr.push(this.getUpRightMove(this.state.selected));
    return arr;
  }

  // Returns array of available coords to which selected checker can jump
  calcJumps() {
    let arr = [];
    if (
      this.canDownLeftJump(
        this.state.selected,
        this.getCoordType(this.state.selected)
      )
    )
      arr.push(this.getDownLeftJump(this.state.selected));
    if (
      this.canDownRightJump(
        this.state.selected,
        this.getCoordType(this.state.selected)
      )
    )
      arr.push(this.getDownRightJump(this.state.selected));
    if (
      this.canUpLeftJump(
        this.state.selected,
        this.getCoordType(this.state.selected)
      )
    )
      arr.push(this.getUpLeftJump(this.state.selected));
    if (
      this.canUpRightJump(
        this.state.selected,
        this.getCoordType(this.state.selected)
      )
    )
      arr.push(this.getUpRightJump(this.state.selected));
    return arr;
  }

  // Returns array of coords in [[int x,int y],...] form conaining checkers
  //that have move(s) available for selected turn
  calcAnyMoves() {
    let arr = [];
    for (var i = 0; i < this.state.boardArray.length; i++) {
      for (var j = 0; j < this.state.boardArray[i].length; j++) {
        let cur = [i, j];
        let type = this.getCoordType(cur);
        if (this.typeMatchTurn(type)) {
          if (this.canMove(cur, type)) {
            arr.push(cur);
          }
        }
      }
    }
    return arr;
  }

  // Returns array of coords in [[int x,int y],...] form conaining checkers
  //that have jump(s) available
  calcAnyJumps() {
    let arr = [];
    for (var i = 0; i < this.state.boardArray.length; i++) {
      for (var j = 0; j < this.state.boardArray[i].length; j++) {
        let cur = [i, j];
        let type = this.getCoordType(cur);
        if (this.canJump(cur, type)) {
          arr.push(cur);
        }
      }
    }
    return arr;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can move or not
  canMove(coord, type) {
    switch (type) {
      case this.REDKING:
        if (this.canUpLeftMove(coord, type) || this.canUpRightMove(coord, type))
          return true;
      case this.REDCHECKER:
        if (
          this.canDownLeftMove(coord, type) ||
          this.canDownRightMove(coord, type)
        )
          return true;
        break;

      case this.WHITEKING:
        if (
          this.canDownLeftMove(coord, type) ||
          this.canDownRightMove(coord, type)
        )
          return true;

      case this.WHITECHECKER:
        if (this.canUpLeftMove(coord, type) || this.canUpRightMove(coord, type))
          return true;
        break;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can jump or not
  canJump(coord, type) {
    switch (type) {
      case this.REDKING:
        if (this.canUpLeftJump(coord, type) || this.canUpRightJump(coord, type))
          return true;
      case this.REDCHECKER:
        if (
          this.canDownLeftJump(coord, type) ||
          this.canDownRightJump(coord, type)
        )
          return true;
        break;

      case this.WHITEKING:
        if (
          this.canDownLeftJump(coord, type) ||
          this.canDownRightJump(coord, type)
        )
          return true;

      case this.WHITECHECKER:
        if (this.canUpLeftJump(coord, type) || this.canUpRightJump(coord, type))
          return true;
        break;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can move down left or not
  canDownLeftMove(coord, type) {
    switch (type) {
      case this.REDKING:
      case this.REDCHECKER:
      case this.WHITEKING:
        return this.state.boardArray[coord[0] + 1][coord[1] - 1] ===
          this.OPENSPACE
          ? true
          : false;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can move down right or not
  canDownRightMove(coord, type) {
    switch (type) {
      case this.REDKING:
      case this.REDCHECKER:
      case this.WHITEKING:
        return this.state.boardArray[coord[0] + 1][coord[1] + 1] ===
          this.OPENSPACE
          ? true
          : false;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can move up left or not
  canUpLeftMove(coord, type) {
    switch (type) {
      case this.REDKING:
      case this.WHITECHECKER:
      case this.WHITEKING:
        return this.state.boardArray[coord[0] - 1][coord[1] - 1] ===
          this.OPENSPACE
          ? true
          : false;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can move up right or not
  canUpRightMove(coord, type) {
    switch (type) {
      case this.REDKING:
      case this.WHITECHECKER:
      case this.WHITEKING:
        return this.state.boardArray[coord[0] - 1][coord[1] + 1] ===
          this.OPENSPACE
          ? true
          : false;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can jump down left or not
  canDownLeftJump(coord, type) {
    switch (type) {
      case this.REDKING:
      case this.REDCHECKER:
        return (this.state.boardArray[coord[0] + 1][coord[1] - 1] ===
          this.WHITECHECKER ||
          this.state.boardArray[coord[0] + 1][coord[1] - 1] ===
            this.WHITEKING) &&
          this.state.boardArray[coord[0] + 2][coord[1] - 2] === this.OPENSPACE
          ? true
          : false;

      case this.WHITEKING:
        return (this.state.boardArray[coord[0] + 1][coord[1] - 1] ===
          this.REDCHECKER ||
          this.state.boardArray[coord[0] + 1][coord[1] - 1] === this.REDKING) &&
          this.state.boardArray[coord[0] + 2][coord[1] - 2] === this.OPENSPACE
          ? true
          : false;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can jump down right or not
  canDownRightJump(coord, type) {
    switch (type) {
      case this.REDKING:
      case this.REDCHECKER:
        return (this.state.boardArray[coord[0] + 1][coord[1] + 1] ===
          this.WHITECHECKER ||
          this.state.boardArray[coord[0] + 1][coord[1] + 1] ===
            this.WHITEKING) &&
          this.state.boardArray[coord[0] + 2][coord[1] + 2] === this.OPENSPACE
          ? true
          : false;

      case this.WHITEKING:
        return (this.state.boardArray[coord[0] + 1][coord[1] + 1] ===
          this.REDCHECKER ||
          this.state.boardArray[coord[0] + 1][coord[1] + 1] === this.REDKING) &&
          this.state.boardArray[coord[0] + 2][coord[1] + 2] === this.OPENSPACE
          ? true
          : false;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can jump up left or not
  canUpLeftJump(coord, type) {
    switch (type) {
      case this.REDKING:
        return (this.state.boardArray[coord[0] - 1][coord[1] - 1] ===
          this.WHITECHECKER ||
          this.state.boardArray[coord[0] - 1][coord[1] - 1] ===
            this.WHITEKING) &&
          this.state.boardArray[coord[0] - 2][coord[1] - 2] === this.OPENSPACE
          ? true
          : false;

      case this.WHITEKING:
      case this.WHITECHECKER:
        return (this.state.boardArray[coord[0] - 1][coord[1] - 1] ===
          this.REDCHECKER ||
          this.state.boardArray[coord[0] - 1][coord[1] - 1] === this.REDKING) &&
          this.state.boardArray[coord[0] - 2][coord[1] - 2] === this.OPENSPACE
          ? true
          : false;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form, string type of checker
  // OUT: boolean representing whether checker can jump up right or not
  canUpRightJump(coord, type) {
    switch (type) {
      case this.REDKING:
        return (this.state.boardArray[coord[0] - 1][coord[1] + 1] ===
          this.WHITECHECKER ||
          this.state.boardArray[coord[0] - 1][coord[1] + 1] ===
            this.WHITEKING) &&
          this.state.boardArray[coord[0] - 2][coord[1] + 2] === this.OPENSPACE
          ? true
          : false;

      case this.WHITEKING:
      case this.WHITECHECKER:
        return (this.state.boardArray[coord[0] - 1][coord[1] + 1] ===
          this.REDCHECKER ||
          this.state.boardArray[coord[0] - 1][coord[1] + 1] === this.REDKING) &&
          this.state.boardArray[coord[0] - 2][coord[1] + 2] === this.OPENSPACE
          ? true
          : false;
    }
    return false;
  }

  // IN: coordinate in [int x, int y] form
  // OUT: coodniate of down left move
  getDownLeftMove(coord) {
    return [coord[0] + 1, coord[1] - 1];
  }

  // IN: coordinate in [int x, int y] form
  // OUT: coodniate of down right move
  getDownRightMove(coord) {
    return [coord[0] + 1, coord[1] + 1];
  }

  // IN: coordinate in [int x, int y] form
  // OUT: coodniate of up left move
  getUpLeftMove(coord) {
    return [coord[0] - 1, coord[1] - 1];
  }

  // IN: coordinate in [int x, int y] form
  // OUT: coodniate of up right move
  getUpRightMove(coord) {
    return [coord[0] - 1, coord[1] + 1];
  }

  // IN: coordinate in [int x, int y] form
  // OUT: coodniate of down left jump
  getDownLeftJump(coord) {
    return [coord[0] + 2, coord[1] - 2];
  }

  // IN: coordinate in [int x, int y] form
  // OUT: coodniate of down right jump
  getDownRightJump(coord) {
    return [coord[0] + 2, coord[1] + 2];
  }

  // IN: coordinate in [int x, int y] form
  // OUT: coodniate of up left jump
  getUpLeftJump(coord) {
    return [coord[0] - 2, coord[1] - 2];
  }

  // IN: coordinate in [int x, int y] form
  // OUT: coodniate of up right jump
  getUpRightJump(coord) {
    return [coord[0] - 2, coord[1] + 2];
  }

  // IN: coordinate of where checker jumped from, coord of where jumped to
  // OUT: coordinate of spot that was jumped
  getJumpedCoord(start, finish) {
    return [(start[0] + finish[0]) / 2, (start[1] + finish[1]) / 2];
  }

  // IN: coordinate in [int x, int y] form
  // OUT: string for space type
  getCoordType(coord) {
    return this.state.boardArray[coord[0]][coord[1]];
  }

  // returns TRUE if subarr is in 2D arr
  arrIncludesSubArr(arr, subarr) {
    for (var i = 0; i < arr.length; i++) {
      let check = false;
      for (var j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === subarr[j]) {
          check = true;
        } else {
          check = false;
          break;
        }
      }
      if (check) {
        return true;
      }
    }
    return false;
  }
}
