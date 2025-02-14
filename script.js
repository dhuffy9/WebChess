// Name : Dilan Huffman
// Project Name : Tic Tac Toe Web Game
// Date : 8/12/2019
/* IMPORTANT: Not fully done. I need to work on the wining logic.*/


var board = document.getElementById('boardInner');
var numContainer = document.getElementById('numberContainer');
var letterContainer = document.getElementById('letterContainer');
var currentPlayer = document.getElementById("currentPlayer");
var alerts = document.getElementById("alerts");


class Chess {
  constructor() {
    this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    this.numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
    this.colors = ["black", "white"]
    this.board = {}
    this.backgrounds = [];
    this.electedPosition;
    this.currentPlayer = 'white';
    this.int();
  }

  int() {
    this.createBoard();
    this.placePiecesAsDefault();
  }

  createBoard() {
    this.insertLabels();
    for (let i = 0; i < this.letters.length; i++) {
      var column = document.createElement('DIV');
      column.className = 'column';
      for (let j = 0; j < this.numbers.length; j++) {
        var square = document.createElement('DIV');
        square.className = 'square';
        square.id = this.letters[i] + this.numbers[j]
        let num = j + i;
        let color = num % 2 === 0 ? '#fccc74' : '#573a2e';
        square.style.backgroundColor = color;
        column.appendChild(square);
        // the element is need so we can change the color of the square
        this.board[square.id] = { id: square.id, element: square, piece: null, isMove: false, isEnemy: false };
      }
      board.appendChild(column)
    }
  }

  insertLabels() {
    this.letters.forEach((value, i) => {
      var el = document.createElement('DIV');
      var el2 = document.createElement('DIV');
      el.innerText = value;
      el.className = 'label';
      el2.innerText = this.numbers[i];
      el2.className = 'label';
      numContainer.appendChild(el2);
      letterContainer.appendChild(el);
    })
  }

  updatePlayerInfo(player){
    currentPlayer.children[1].innerText = player;
    currentPlayer.children[0].style.backgroundColor = player;
  }

  makePieces(type, color, position) {
    let piece;
    switch (type) {
      case "Pawn":
        piece = new Pieces.Pawn(type, color);
        break;
      case "King":
        piece = new Pieces.King(type, color);
        break;
      case "Queen":
        piece = new Pieces.Queen(type, color);
        break;
      case "Bishop":
        piece = new Pieces.Bishop(type, color);
        break;
      case "Knight":
        piece = new Pieces.Knight(type, color);
        break;
      case "Rook":
        piece = new Pieces.Rook(type, color);
        break;
    }

    this.board[position].piece = piece;
    this.board[position].element.appendChild(piece.html);
    piece.setPosition(position);
    piece.html.addEventListener("click", this.onAcceptablehightLights.bind(this))
  }

  placePiecesAsDefault() {
    this.updatePlayerInfo(this.currentPlayer)
    let order = ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"];
    for (let i = 1; i < 9; i += 7) {
      let color = i === 1 ? this.colors[1] : this.colors[0];
      for (let j = 0; j < order.length; j++) {
        this.makePieces(order[j], color, this.letters[j] + (i));
      }
    }
    for (let n = 2; n < 8; n += 5) for (let l = 0; l < 8; l++) {
      let color = n === 2 ? this.colors[1] : this.colors[0];
      this.makePieces("Pawn", color, this.letters[l] + (n));
    }
  }

  onAcceptablehightLights(event) {
    
    const position = event.currentTarget.parentElement.id
    const square = this.board[position];
    if ((square.piece.color !== this.currentPlayer) && !square.isEnemy) {
      alerts.innerHTML = `It's not ${square.piece.color}'s turn to move`;
      console.log(`It's not ${square.piece.color}'s turn to move`);
      return;
    }
    if (square.isEnemy) {
      let piece = this.board[this.electedPosition].piece;
      for (const move of piece.acceptableAttacks()) {
        for (const position of move) {
          this.board[position].isEnemy = false; // this is to make sure that the enemy pieces are not highlighted
        }
      }
      square.isMove = true;
      this.board[square.piece.position].piece.html.remove();
      this.movePiece(piece, square.piece.position);
    } else {
      this.hightLight(square)
    }
  }

  createSquareBackground(backgroundColor) {
    const element = document.createElement("DIV");
    element.className = "squareBackground";
    element.style.backgroundColor = backgroundColor;
    return element;
  }
  clearBackgrounds() {
    this.backgrounds.forEach(background => background.remove());
    this.backgrounds = [];
  }

  hightLight(square) {
    const piece = square.piece;
    this.electedPosition = piece.position;
    this.clearBackgrounds()

    const selectedPiece = this.createSquareBackground("rgba(0, 255, 255)")
    this.backgrounds.push(selectedPiece);
    this.board[this.electedPosition].element.insertBefore(selectedPiece, this.board[piece.position].element.firstChild);

    for (const move of piece.acceptablePositions()) {
      for (const position of move) {
        if (this.isOccupied(position) && !(piece instanceof Knight)) {
          break
        }
        if (!this.isValidPosition(position) || this.isOccupied(position)) {
          continue
        }
        const acceptablePosition = this.createSquareBackground("rgba(0, 255, 255,.5)")
        this.backgrounds.push(acceptablePosition);
        acceptablePosition.addEventListener("click", () => { this.movePiece(piece, position); });
        this.board[position].isMove = true;
        this.board[position].element.insertBefore(acceptablePosition, this.board[position].element.firstChild);

      }
    }

    for (const move of piece.acceptableAttacks()) {
      for (const position of move) {
        if (this.isValidPosition(position)) {
          if (!this.isOccupied(position)){
            continue;
          } else if (this.isEnemy(position, piece)){
            const acceptableAttack = this.createSquareBackground("rgb(255,0,0)")
            this.backgrounds.push(acceptableAttack);
            this.board[position].isEnemy = true;
            //acceptableAttack.addEventListener("click", this.onAcceptablehightLights.bind(this));
            acceptableAttack.addEventListener("click", this.movePiece(piece, position));
            this.board[position].element.insertBefore(acceptableAttack, this.board[position].element.firstChild);
            if (piece instanceof Knight) continue;
            break
          } else {
            break;
          }
        }
      }
    }
  }

  movePiece(piece, position) {
    if (piece.color !== this.currentPlayer) {
      //alerts.innerText = `It's not ${piece.color}'s turn to move`;
      console.log(` (movePiece) It's not ${piece.color}'s turn to move`);
      return;
    }
    const targetCell = this.board[position];
    if (targetCell.isMove) {
      targetCell.element.appendChild(piece.html);
      targetCell.piece = piece;
      this.board[piece.position].piece = null;
      piece.setPosition(position)
      //piece.position = position;
      targetCell.isMove = false;
      this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
      this.updatePlayerInfo(this.currentPlayer);
    }
  }

  isValidPosition(position) {
    return this.board[position] != undefined;
  }

  isOccupied(position) {
    return this.board[position].piece != null;
  }

  isEnemy(position, piece) {
    if (!this.isValidPosition(position) || !this.isOccupied(position)) {
      return false;
    }
    const targetPiece = this.board[position].piece;
    if (!targetPiece) {
      return false;
    }
    return piece.color !== targetPiece.color;
  }
}

var Game = new Chess;