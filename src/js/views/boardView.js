export default class BoardView {
    constructor() {
        this.selectedId = 'none';
        this.setSelectedId = (id) => {this.selectedId = id;}
        this.resetSelectedId = () => {this.selectedId = 'none';}

        this.targetObj = {};
        this.setTargetObj = (obj) => {this.targetObj = obj};
        this.resetTargetObj = () => {this.targetObj = {}};
        this.isTargetEmpty = () => (Object.keys(this.targetObj).length === 0 &&
            this.targetObj.constructor === Object);

        this.destId = 'none';
        this.setDestId = (id) => {this.destId = id;}
        this.resetDestId = () => {this.destId = 'none';}
    }

    selectOrMove(curPlayer,target) {
        //if current player is red
        if (curPlayer === 'red') {
            //if red checker clicked
            if (target.classList.contains("checker__red")) {
                //if no current selection
                if (this.selectedId === 'none') {
                    this.setTargetObj(target);
                    this.setSelectedId(target.id);
                    target.classList.toggle("selected");
                } 
                //if there is a current selection
                else {
                    this.targetObj.classList.remove("selected");
                    this.setTargetObj(target);
                    this.setSelectedId(target.id);
                    target.classList.add("selected");
                }
            }
            //if a open square is clicked and there is current selected
            else if (target.classList.contains("board__square--black") &&
            this.selectedId !== 'none') {
                this.targetObj.classList.toggle("selected");
                this.removeHtmlChild(this.selectedId);
                this.insertCheckerHtml(curPlayer,target.id,this.selectedId);
                this.resetDestId();
                this.resetSelectedId();
                this.resetTargetObj();
            }
            //if a white checker is clicked (jump possibility already
            //tested for)
            else if (target.classList.contains("checker__white")) {
                this.targetObj.classList.toggle("selected");
                this.setDestId(target.id);
                this.insertCheckerHtml(curPlayer,this.getJumpTargetId(curPlayer, this.selectedId,this.destId),this.selectedId);
                this.removeHtmlChild(this.destId);
                this.removeHtmlChild(this.selectedId);
                this.resetDestId();
                this.resetSelectedId();
                this.resetTargetObj();
            }
        }
        //if current player is white
        else if (curPlayer === 'white') {
            //if white checker is clicked
            if (target.classList.contains("checker__white")) {
                //if no current selection
                if (this.selectedId === 'none') {
                    this.setTargetObj(target);
                    this.setSelectedId(target.id);
                    target.classList.toggle("selected");
                } 
                //if there is a current selection
                else {
                    this.targetObj.classList.remove("selected");
                    this.setTargetObj(target);
                    this.setSelectedId(target.id);
                    target.classList.add("selected");
                }
            }
            //if a open square is clicked and there is current selected
            else if (target.classList.contains("board__square--black") &&
            this.selectedId !== 'none') {
                this.targetObj.classList.toggle("selected");
                this.removeHtmlChild(this.selectedId);
                this.insertCheckerHtml(curPlayer,target.id,this.selectedId);
                this.resetDestId();
                this.resetSelectedId();
                this.resetTargetObj();
            }
            //if a red checker is clicked (jump possibility already
            //tested for)
            else if (target.classList.contains("checker__red")) {
                this.targetObj.classList.toggle("selected");
                this.setDestId(target.id);
                this.insertCheckerHtml(curPlayer,this.getJumpTargetId(curPlayer, this.selectedId,this.destId),'');
                var jumpSpot = document.getElementById(this.getJumpTargetId(curPlayer, this.selectedId,this.destId));
                this.removeHtmlChild(this.destId);
                this.removeHtmlChild(this.selectedId);
                jumpSpot.lastChild.id = this.selectedId;
                this.resetDestId();
                this.resetSelectedId();
                this.resetTargetObj();
            }
        }
    }

    getJumpTargetId(curPlayer,firstId,secondId) {
        var firstCoord = new Array(parseInt(document.querySelector('#' + firstId).parentNode.id.charAt(8))-1,
        parseInt(document.querySelector('#' + firstId).parentNode.id.charAt(10))-1);
        var secondCoord = new Array(parseInt(document.querySelector('#' + secondId).parentNode.id.charAt(8))-1,
        parseInt(document.querySelector('#' + secondId).parentNode.id.charAt(10))-1);
        if (curPlayer === 'red') {
            if (secondCoord[1] - firstCoord[1] === -1) {
                console.log('red jumping left');
                return ('square__' + (secondCoord[0]+2).toString() + '-' +
                secondCoord[1].toString());
            } else if (secondCoord[1] - firstCoord[1] === 1) {
                console.log('red jumping right');
                return ('square__' + (secondCoord[0]+2).toString() + '-' +
                (secondCoord[1]+2).toString());
            }
        } else if (curPlayer === 'white') {
            if (secondCoord[1] - firstCoord[1] === -1) {
                console.log('white jumping left');
                console.log('square__' + (secondCoord[0]).toString() + '-' +
                secondCoord[1].toString());
                return ('square__' + (secondCoord[0]).toString() + '-' +
                secondCoord[1].toString());
            } else if (secondCoord[1] - firstCoord[1] === 1) {
                console.log('white jumping right');
                console.log('square__' + (secondCoord[0]).toString() + '-' +
                (secondCoord[1]+2).toString());
                return ('square__' + (secondCoord[0]).toString() + '-' +
                (secondCoord[1]+2).toString());
            }
        }
    }
    

    insertCheckerHtml(curPlayer,id,checkerId) {
        if (curPlayer === 'red') {
            document.getElementById(id).insertAdjacentHTML('beforeend',
            '<div class="checker__red" ' + 'id=' + checkerId + '></div>');
        } else {
            document.getElementById(id).insertAdjacentHTML('beforeend',
            '<div class="checker__white"' + 'id=' + checkerId + '></div>');
        }
    }

    removeHtmlChild(childId) {
        console.log( document.querySelector('#' + childId).parentNode);
        document.querySelector('#' + childId).parentNode
        .removeChild(document.getElementById(childId));
    }
}
