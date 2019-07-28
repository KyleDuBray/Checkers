export default class BoardManager {
    constructor() {
        // 'r' - contains red checker
        // 'w' - contains white checker
        // 'o' - open space
        // 'X' - red (inaccessible) space
        this.boardArray =  [
            ['X','r','X','r','X','r','X','r'],
            ['r','X','r','X','r','X','r','X'],
            ['X','r','X','r','X','r','X','r'],
            ['o','X','o','X','o','X','o','X'],
            ['X','o','X','o','X','o','X','o'],
            ['w','X','w','X','w','X','w','X'],
            ['X','w','X','w','X','w','X','w'],
            ['w','X','w','X','w','X','w','X']
        ];

        this.activePlayer = 'red';
        this.getActivePlayer = () => this.activePlayer;
        this.changePlayer = () => {
            this.activePlayer === 'red' ? 
            this.activePlayer='white' :
            this.activePlayer= 'red';
        }

        this.selectedCoord = [-1,-1];
        this.setSelectedCoord = (row,col) => {
            this.selectedCoord[0] = row;
            this.selectedCoord[1] = col;
        };
        this.resetSelectedCoord = () => {this.selectedCoord.fill(-1);}

        this.destCoord = [-1,-1];
        this.setDestCoord = (row,col) => {
            this.destCoord[0] = row;
            this.destCoord[1] = col;
        };
        this.resetDestCoord = () => {this.destCoord.fill(-1);}
    }

    //Used for testing distance and directionality.
    coordDistance(coord1,coord2) {
        return (coord2 - coord1);
    }

    
    //Given 2 coordinates (in form [rowNumber, columnNumber]), return true if
    //3rd spot (that would form diagonal line) is open. Return false otherwise.
    //This is used for testing if jump move can be made.
    checkNextOpen(curCoord,newCoord) {
        if (newCoord[0] === 0 || newCoord[0] === 7 ||
            newCoord[1] === 0 || newCoord[1] === 7) {
            return false;
        }
        //if moving down board
        if (newCoord[0] - curCoord[0] === 1) {
            //if moving right
            if (newCoord[1] - curCoord[1] === 1) {
                return (this.boardArray[newCoord[0]+1][newCoord[1]+1] === 'o');

                //if moving left
            } else if (newCoord[1] - curCoord[1] === -1) {
                return (this.boardArray[newCoord[0]+1][newCoord[1]-1] === 'o');
            }
        }

        //if moving up board
        if (newCoord[0] - curCoord[0] === -1) {
            //if moving right
            if (newCoord[1] - curCoord[1] === 1) {
                return (this.boardArray[newCoord[0]-1][newCoord[1]+1] === 'o');

                //if moving left
            } else if (newCoord[1] - curCoord[1] === -1) {
                return (this.boardArray[newCoord[0]-1][newCoord[1]-1] === 'o');
            }
        } 

    }


    //Given coordinate (in form [rowNumber, columnNumber]), check if that 
    //spot on boardArray is open ('o')
    checkOpen(coord) {
        return (this.boardArray[coord[0]][coord[1]] === 'o');
    }

    //Given coordinate (in form [rowNumber, columnNumber]), test if white checker there
    checkWhite(coord) {
        return(this.boardArray[coord[0]][coord[1]] === 'w');
    }

    //Given coordinate (in form [rowNumber, columnNumber]), test if red checker there
    checkRed(coord) {
        return(this.boardArray[coord[0]][coord[1]] === 'r');
    }

    //
    selectOrMove(curPlayer,targetCoord) {
        //set this active player to curPlayer
        this.activePlayer = curPlayer;
        //if current player matches selected color
        if ((curPlayer === 'red' && this.checkRed(targetCoord)) ||
        (curPlayer === 'white' && this.checkWhite(targetCoord))) {
            //set selected coordinate, return true
            this.setSelectedCoord(targetCoord[0],targetCoord[1]);
            return true;
        }
        // if open space is chosen with a current selection
        else if (this.checkOpen(targetCoord) && !this.selectedCoord.includes(-1)) {
            this.setDestCoord(targetCoord[0],targetCoord[1]);
            // if move is valid, execute
            if (this.isMoveDirection(curPlayer)) {
                this.move(curPlayer);
                this.changePlayer();
                this.resetSelectedCoord();
                this.resetDestCoord();
                return true;
            }
            //otherwise, reset destination and return false
            else {
                this.resetDestCoord();
                return false;
            }
            
        }
        // if opposite color checker is chosen with a current selection
        else if ((!this.selectedCoord.includes(-1)) &&
        (curPlayer === 'red' && this.checkWhite(targetCoord) ||
        curPlayer === 'white' && this.checkRed(targetCoord))) {
            //set destination coord
            this.setDestCoord(targetCoord[0],targetCoord[1]);
            //if jump space is open and direction and distance appropriate
            if (this.checkNextOpen(this.selectedCoord,this.destCoord) &&
            this.isMoveDirection(curPlayer)) {
                this.jump(curPlayer);
                this.resetDestCoord();
                this.resetSelectedCoord();
                this.changePlayer();
                return true;
            }
            //otherwise, reset destination and return false
            else {
                this.resetDestCoord();
                return false;
            }
        }
        else {return false;}

    }

    //returns true if distance and direction of attempted move
    //are appropriate based on player
    isMoveDirection(curPlayer) {
        return (this.coordDistance(this.selectedCoord[1],this.destCoord[1]) === 1 ||
        this.coordDistance(this.selectedCoord[1],this.destCoord[1]) === -1) &&
        ((curPlayer === 'red' && this.coordDistance(this.selectedCoord[0],this.destCoord[0]) === 1) ||
        (curPlayer === 'white' && this.coordDistance(this.selectedCoord[0],this.destCoord[0]) === -1))
    }

    move(curPlayer) {
        if (curPlayer === 'red') {
            this.boardArray[this.selectedCoord[0]][this.selectedCoord[1]] = 'o';
            this.boardArray[this.destCoord[0]][this.destCoord[1]] = 'r';
        }
         else if (curPlayer === 'white') {
            this.boardArray[this.selectedCoord[0]][this.selectedCoord[1]] = 'o';
            this.boardArray[this.destCoord[0]][this.destCoord[1]] = 'w';
        }
    }

    jump(curPlayer) {
        if (curPlayer === 'red') {
            if (this.coordDistance(this.selectedCoord[1],this.destCoord[1]) === 1) {
                this.boardArray[this.selectedCoord[0]][this.selectedCoord[1]] = 'o';
                this.boardArray[this.destCoord[0]][this.destCoord[1]] = 'o';
                this.boardArray[this.destCoord[0]+1][this.destCoord[1]+1] = 'r';
            } else if (this.coordDistance(this.selectedCoord[1],this.destCoord[1]) === -1) {
                this.boardArray[this.selectedCoord[0]][this.selectedCoord[1]] = 'o';
                this.boardArray[this.destCoord[0]][this.destCoord[1]] = 'o';
                this.boardArray[this.destCoord[0]+1][this.destCoord[1]-1] = 'r';
            }
        } else if (curPlayer === 'white') {
            if (this.coordDistance(this.selectedCoord[1],this.destCoord[1]) === 1) {
                this.boardArray[this.selectedCoord[0]][this.selectedCoord[1]] = 'o';
                this.boardArray[this.destCoord[0]][this.destCoord[1]] = 'o';
                this.boardArray[this.destCoord[0]-1][this.destCoord[1]+1] = 'w';
            } else if (this.coordDistance(this.selectedCoord[1],this.destCoord[1]) === -1) {
                this.boardArray[this.selectedCoord[0]][this.selectedCoord[1]] = 'o';
                this.boardArray[this.destCoord[0]][this.destCoord[1]] = 'o';
                this.boardArray[this.destCoord[0]-1][this.destCoord[1]-1] = 'w';
            }
        }
        
    }
}
