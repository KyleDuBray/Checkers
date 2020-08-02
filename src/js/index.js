// Global App Controller

import CheckersView from "./views/CheckersView";

class GameManager {}

{
  var game = new CheckersView();
  game.init();
  game.setTurn();
  game.makeSelection();
}
