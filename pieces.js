var latters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

class Piece {
  constructor(type, item, color) {
    this.position = null;
    this.type = type;
    this.item = item;
    this.color = color;
    this.html = document.createElement("P");
    this.html.className = "piece";
    this.html.innerText = this.item;
    this.html.style.color = color;
  }

  setPosition(position) {
    this.position = position;
    this.latterIndex = latters.indexOf(this.position.charAt(0))
    this.number = parseInt(this.position.charAt(1))
  }

  getTop() {
    const top = [];
    for (let i = this.number - 1; i >= 1; i--) {
      top.push(latters[this.latterIndex] + i);
    }
    return top;
  }

  getBottom() {
    const bottom = [];
    for (let i = this.number + 1; i <= 8; i++) {
      bottom.push(latters[this.latterIndex] + i);
    }
    return bottom
  }

  getLeft() {
    const left = [];
    for (let i = this.latterIndex - 1; i >= 0; i--) {
      left.push(latters[i] + this.number);
    }
    return left;
  }

  getRight() {
    const right = [];
    for (let i = this.latterIndex + 1; i < 8; i++) {
      right.push(latters[i] + this.number);
    }
    return right;
  }


  getTopRight() {
    const topRight = [];
    for (let i = 1; this.latterIndex + i < 8 && this.number - i >= 1; i++) {
      topRight.push(latters[this.latterIndex + i] + (this.number - i));
    }
    return topRight;
  }

  getBottomRight() {
    const bottomRight = [];
    for (let i = 1; this.latterIndex + i < 8 && this.number + i <= 8; i++) {
      bottomRight.push(latters[this.latterIndex + i] + (this.number + i));
    }
    return bottomRight;
  }

  getTopLeft() {
    const topLeft = [];
    for (let i = 1; this.latterIndex - i >= 0 && this.number - i >= 1; i++) {
      topLeft.push(latters[this.latterIndex - i] + (this.number - i));
    }
    return topLeft;
  }

  getBottomLeft() {
    const bottomLeft = [];
    for (let i = 1; this.latterIndex - i >= 0 && this.number + i <= 8; i++) {
      bottomLeft.push(latters[this.latterIndex - i] + (this.number + i));
    }
    return bottomLeft;
  }
}

class Pawn extends Piece {
  constructor(type, color) {
    super(type, "♟", color)
  }
  acceptablePositions() {
    let position = this.color == "white" ? this.getBottom() : this.getTop();
    let acceptablePosition = [];
    if (this.color == "black") {
      acceptablePosition.push((this.number == 7) ? position.slice(0, 2) : position.slice(0, 1));
    } else if (this.color == "white") {
      acceptablePosition.push((this.number == 2) ? position.slice(0, 2) : position.slice(0, 1));
    }
    return acceptablePosition
  }
  acceptableAttacks() {
    let left = this.color == "white" ? this.getBottomLeft() : this.getTopLeft();
    let right = this.color == "white" ? this.getBottomRight() : this.getTopRight();

    if (this.color == "black") {
      var acceptableAttack = [[left[0]], [right[0]]];
    } else if (this.color == "white") {
      var acceptableAttack = [[left[0]], [right[0]]];
    }
    return acceptableAttack;
  }
}

class King extends Piece {
  constructor(type, color) {
    super(type, "♚", color)
  }
  acceptablePositions() {
    let left = this.getLeft().slice(0, 1), right = this.getRight().slice(0, 1), bottom = this.getBottom().slice(0, 1), top = this.getTop().slice(0, 1);
    let leftTop = this.getTopLeft().slice(0, 1), rightTop = this.getTopRight().slice(0, 1), leftBottom = this.getBottomLeft().slice(0, 1), rightBottom = this.getBottomRight().slice(0, 1);
    let acceptablePosition = [left, right, bottom, top, leftTop, rightTop, leftBottom, rightBottom];
    return acceptablePosition
  }
  acceptableAttacks() {
    return this.acceptablePositions();
  }

}

class Queen extends Piece {
  constructor(type, color) {
    super(type, "♛", color)
  }

  acceptablePositions() {
    let left = this.getLeft(), right = this.getRight(), bottom = this.getBottom(), top = this.getTop();
    let leftTop = this.getTopLeft(), rightTop = this.getTopRight(), leftBottom = this.getBottomLeft(), rightBottom = this.getBottomRight();
    let acceptablePosition = [left, right, bottom, top, leftTop, rightTop, leftBottom, rightBottom];

    return acceptablePosition
  }
  acceptableAttacks() {
    return this.acceptablePositions();
  }
}

class Bishop extends Piece {
  constructor(type, color) {
    super(type, "♝", color)
  }

  acceptablePositions() {
    let leftTop = this.getTopLeft(), rightTop = this.getTopRight(), leftBottom = this.getBottomLeft(), rightBottom = this.getBottomRight();
    let acceptablePosition = [leftTop, rightTop, leftBottom, rightBottom];

    return acceptablePosition
  }



  acceptableAttacks() {
    return this.acceptablePositions();
  }
}

class Knight extends Piece {
  constructor(type, color) {
    super(type, "♞", color)
  }

  
  acceptablePositions() {
    let left = this.getLeft()[1] || "None", right = this.getRight()[1] || "None", bottom = this.getBottom()[1] || "None", top = this.getTop()[1] || "None";
    let temp = [[left], [right], [bottom], [top]]
    let acceptablePosition = [[], [], [], []]
    let directions = [-1, 1];

    for (const direction of directions) {
      for (let i = 0; i < temp.length; i++) {
        let move = temp[i];
        if(move[0] == "None") continue;
        let latterIndex = latters.indexOf(move[0].charAt(0));
        let number = parseInt(move[0].charAt(1));

        let change = (i < 2)

        let j = (change) ? (number + direction) : (latterIndex + direction);

        if(j > ((change) ? 0 : -1) && j < 9){
           acceptablePosition[i].push((change) ? (latters[latterIndex] + j) : (latters[j] + number))
        }
      }
    }
    return acceptablePosition;
  }

  acceptableAttacks() {
    return this.acceptablePositions();
  }
}

class Rook extends Piece {
  constructor(type, color) {
    super(type, "♜", color)
  }
  acceptablePositions() {
    let left = this.getLeft(), right = this.getRight(), bottom = this.getBottom(), top = this.getTop();
    let acceptablePosition = [left, right, bottom, top];
    return acceptablePosition
  }
  acceptableAttacks() {
    return this.acceptablePositions();
  }
}

window.Pieces = { Pawn, King, Queen, Bishop, Knight, Rook };