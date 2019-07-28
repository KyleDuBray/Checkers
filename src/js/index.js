// Global App Controller

/* Use for implementing chat box

const sendMessage = () => {
    var message = document.getElementById("chat-input").value;
    //console.log(message);
    if (message !== '') {
        var html_text= 
        `<div class="row msg_container base_sent">
            <div class="col-md-10 col-xs-10">
                <div class="messages msg_sent">
                    <p>${message}</p>
                </div>
            </div>
        </div>`
    var panel = document.getElementById('chat-body');
    panel.insertAdjacentHTML('beforeend', html_text)
    document.getElementById("chat-input").value = '';
    }

    $(".msg_container_base").stop().animate({ scrollTop:
        $(".msg_container_base")[0].scrollHeight}, 1000)
};

var input = document.getElementById("chat-input");

document.getElementById('sendmessage').addEventListener('click', sendMessage);

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
    event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13 || event.which === 13) {
    // Trigger the button element with a click
    sendMessage();
  }
});
*/

import BoardManager from './models/Board';
import BoardView from './views/boardView';


class GameManager {
    constructor() {
        this.activePlayer = 'red';
        this.board = new BoardManager();
        this.boardView = new BoardView();
    }

    changePlayer() {
        this.activePlayer === 'red' ? 
        this.activePlayer='white' :
        this.activePlayer= 'red';
    }


    control() {
        //if event target is valid board spot and coordinate for chosen spot
        //registerd a valid board decision
        if ((this.isBoardSpot(event.target)) &&
        this.board.selectOrMove(this.activePlayer,this.convertTargetToCoord(event.target))) {
            this.boardView.selectOrMove(this.activePlayer,event.target);
            this.activePlayer = this.board.getActivePlayer();
        }
        console.log(this.board.boardArray);
        
    }

    //check if event target is a valid board spot
    isBoardSpot(target) {
        return (target.childNodes.length !== 3 &&
        ((target.classList.contains("board__square--black")) ||
        target.classList.contains("checker__red" ) ||
        target.classList.contains("checker__white" )));
    }
    
    convertTargetToCoord(target) {
        if (target.classList.contains("checker__red") ||
        target.classList.contains("checker__white")) {
            return this.convertParentIdToCoord(target.id);
        } else if (target.classList.contains("board__square--black")) {
            return new Array(parseInt(target.id.charAt(8))-1,parseInt(target.id.charAt(10))-1);
        }
    }

    convertParentIdToCoord(checkerId) {
        return new Array(parseInt(document.querySelector('#' + checkerId).parentNode.id.charAt(8))-1,
        parseInt(document.querySelector('#' + checkerId).parentNode.id.charAt(10))-1);
    }
    
}

(function Main() {
    var game = new GameManager();
    document.addEventListener('click', function() {
        game.control();
    });
 
})();

