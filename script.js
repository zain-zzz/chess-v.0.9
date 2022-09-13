//stores the turn of the current user
var turn = "W";

// Functions for refreshing the board =====================================================

//triggers the following 3 functions

function refreshBoard() {
  insertImage()
  colour()
  cursorFix()
  imageEventListeners()
}

//inserts the images for each piece

function insertImage() {
  let count = 0
  document.querySelectorAll('.box').forEach(image => {
    count++
    if (image.innerText.length !== 0) {
      image.innerHTML = `<img id = "${count}" class = "allimages" src="assets/${image.innerText}.png" alt="${image.innerText}">`
      image.style.cursor = 'pointer'
    };
  });
}

//colours each tile on the board

function colour() {
  let toggle = true;
  let counter = 0;
  document.querySelectorAll('.box').forEach(colour => {

    if (toggle) {
      colour.style.backgroundColor = 'rgb(240, 201, 150)'
    } else {
      colour.style.backgroundColor = 'rgb(100, 75, 43)'
    }

    toggle = !toggle;
    counter += 1
    if (counter % 8 == 0) {
      toggle = !toggle;
    }
  });
};

//removes the 'pointer' cursor style from previously green tiles

function cursorFix() {
  document.querySelectorAll('.box').forEach(square => {
    if (square.style.cursor == 'pointer' && square.innerHTML.length == 0) {
      square.style.cursor = 'initial'
    }
  });
}

//event listener fix

function eventListenerFix() {


  tile = 'a1'

  for (let i = 0; i < 8; i++) {

    for (let j = 0; j < 8; j++) {

      var old_element = document.getElementById(`${tile}`);
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      tile = (tile[0] + (Number(tile[1]) + 1))

    };

    tile = (nextChar(tile[0], 1) + 1)

  };

};

//adds a click event listener to each square with an item in it

function imageEventListeners() {

  document.querySelectorAll('.box').forEach(item => {

    item.addEventListener('click', function() {
      if (item.innerHTML.length !== 0) {
        moveType(item)
      }

    });

  });

};

//checks if a player has lost

function checkLoss() {
  let temp = document.getElementById('toggle')
  let BlackWon = true
  let WhiteWon = true
  console.log('checkloss')
  document.querySelectorAll('.box').forEach(item => {

    if (item.innerHTML.length !== 0) {
      if (item.children[0].alt == 'Bking') {
        WhiteWon = false

      }
      if (item.children[0].alt == 'Wking') {
        BlackWon = false
      }
    }

  });

  if (WhiteWon) {
    temp.innerHTML = "White won"
    eventListenerFix()
  }
  if (BlackWon) {
    temp.innerHTML = "Black won"
    eventListenerFix()
  }
};

// Functions for checking what moves the player does ======================================

//switches which turn is being done right now

function switchTurn() {
  let temp = document.getElementById('toggle')
  if (turn == "W") {
    turn = "B"
    temp.innerHTML = "Black's Turn"
  }
  else {
    turn = "W"
    temp.innerHTML = "White's Turn"
  };

};

//defines what piece is being moved

function moveType(item) {
  switch (item.children[0].alt) {
    case `${turn}pawn`:
      console.log('pawn')
      pawnMove(item)
      break;
    case `${turn}rook`:
      console.log('rook')
      rookMove(item)
      break;
    case `${turn}bishop`:
      console.log('bishop')
      bishopMove(item)
      break;
    case `${turn}knight`:
      console.log('knight')
      knightMove(item)
      break;
    case `${turn}queen`:
      console.log('queen')
      queenMove(item)
      break;
    case `${turn}king`:
      console.log('king')
      kingMove(item)
      break;
  };
};

//move itself

function move(item, id, type) {

  destinationBox = document.getElementById(id)

  if (item.innerHTML.length !== 0 && destinationBox.children[0] == null && typeof (destinationBox.children[0]) == 'undefined') {

    document.querySelectorAll('.box').forEach(destination => {

      if (id == destination.id) {
        destination.innerHTML = `${turn}${type}`
        //console.log(destination.innerHTML);
        refreshBoard();
      }

      if (item.id == destination.id) {
        destination.innerHTML = ''
        //console.log(destination.innerHTML);
        refreshBoard();
      }
    });

    switchTurn();
    eventListenerFix();
    imageEventListeners();
    refreshBoard();

  }

};

//move function but for taking pieces

function take(item, id, type) {

  if (item.innerHTML.length !== 0) {

    document.querySelectorAll('.box').forEach(destination => {

      if (id == destination.id) {
        destination.innerHTML = `${turn}${type}`
        refreshBoard();
      }

      if (item.id == destination.id) {
        destination.innerHTML = ''
        refreshBoard();
      }
    });


    switchTurn();
    eventListenerFix();
    imageEventListeners();
    refreshBoard();

    checkLoss();
  }

};

// utility functions - self explanatory

function nextChar(character, movement) {
  return String.fromCharCode(character.charCodeAt(0) + movement);
}

function charToNumber(character) {
  return character.charCodeAt(0) - 96
}

function findDiagonals(tile) {
  let diagonals = []
  let originalTile = tile
  let number = tile[1]
  // up right
  while (tile[0] != 'h' && tile[1] != 8) {
    let newTile = ''
    newTile += nextChar(tile[0], 1)
    number++
    newTile += `${number}`
    tile = newTile
    diagonals.push(tile)
  }
  tile = originalTile
  number = tile[1]
  // up left
  while (tile[0] != 'a' && tile[1] != 8) {
    let newTile = ''
    newTile += nextChar(tile[0], -1)
    number++
    newTile += `${number}`
    tile = newTile
    diagonals.push(tile)
  }
  tile = originalTile
  number = tile[1]
  // down right
  while (tile[0] != 'h' && tile[1] != 1) {
    let newTile = ''
    newTile += nextChar(tile[0], 1)
    number--
    newTile += `${number}`
    tile = newTile
    diagonals.push(tile)
  }
  tile = originalTile
  number = tile[1]

  // down left
  while (tile[0] != 'a' && tile[1] != 1) {
    let newTile = ''
    newTile += nextChar(tile[0], -1)
    number--
    newTile += `${number}`
    tile = newTile
    diagonals.push(tile)
  }
  return diagonals
}

function knightMoves(tile) {
  let moves = []
  let legalMoves = []
  //2,1
  moves.push(nextChar(tile[0], 2) + (Number(tile[1]) + 1))
  //-2,1
  moves.push(nextChar(tile[0], -2) + (Number(tile[1]) + 1))
  //2,-1
  moves.push(nextChar(tile[0], 2) + (Number(tile[1]) - 1))
  //-2,-1
  moves.push(nextChar(tile[0], -2) + (Number(tile[1]) - 1))

  //1,2
  moves.push(nextChar(tile[0], 1) + (Number(tile[1]) + 2))
  //-1,2
  moves.push(nextChar(tile[0], -1) + (Number(tile[1]) + 2))
  //1,-2
  moves.push(nextChar(tile[0], 1) + (Number(tile[1]) - 2))
  //-1,-2
  moves.push(nextChar(tile[0], -1) + (Number(tile[1]) - 2))

  moves.forEach(move => {
    if (move[0] != '_' && move[0] != '`' && move[0] != 'i' && move[0] != 'j' && Number(move[1]) > 0 && Number(move[1]) < 9) {
      legalMoves.push(move)
    }
  })

  return (legalMoves)
}

function kingMoves(tile) {
  let moves = []
  let legalMoves = []

  //right
  moves.push(nextChar(tile[0], 1) + (Number(tile[1]) + 0))
  //left
  moves.push(nextChar(tile[0], -1) + (Number(tile[1]) + 0))
  //u
  moves.push(nextChar(tile[0], 0) + (Number(tile[1]) + 1))
  //d
  moves.push(nextChar(tile[0], 0) + (Number(tile[1]) - 1))
  //ur
  moves.push(nextChar(tile[0], 1) + (Number(tile[1]) + 1))
  //ul
  moves.push(nextChar(tile[0], -1) + (Number(tile[1]) + 1))
  //dr
  moves.push(nextChar(tile[0], 1) + (Number(tile[1]) - 1))
  //dl
  moves.push(nextChar(tile[0], -1) + (Number(tile[1]) - 1))

  moves.forEach(move => {
    if (move[0] != '_' && move[0] != '`' && move[0] != 'i' && move[0] != 'j' && Number(move[1]) > 0 && Number(move[1]) < 9) {
      legalMoves.push(move)
    }
  })

  return legalMoves

}

// all other movements

function pawnMove(item) {

  let moves = [];
  let pawnMovesCheck = [];
  let legalMoves = [];
  // each pawn legal move:

  if (turn == 'B') {
    // one forward
    legalMoves.push((item.id[0] + (item.id[1] - 1)));
    // two forward on first move
    if (item.id[1] == "7") {
      legalMoves.push((item.id[0] + (item.id[1] - 2)));
    }

    //down right
    pawnMovesCheck.push(nextChar(item.id[0], 1) + (Number(item.id[1]) - 1))
    //down left
    pawnMovesCheck.push(nextChar(item.id[0], -1) + (Number(item.id[1]) - 1))


  } else if (turn == 'W') {
    legalMoves.push((item.id[0] + (Number(item.id[1]) + 1)));
    if (item.id[1] == "2") {
      legalMoves.push((item.id[0] + (Number(item.id[1]) + 2)));
    }

    //up right
    pawnMovesCheck.push(nextChar(item.id[0], 1) + (Number(item.id[1]) + 1))
    //up left
    pawnMovesCheck.push(nextChar(item.id[0], -1) + (Number(item.id[1]) + 1))

  }

  document.querySelectorAll('.box').forEach(nextItem => {
    pawnMovesCheck.forEach(move => {
      if (nextItem.id == move && nextItem.innerHTML.length != 0) {
        moves.push(move)
      }
    });
  });

  // for each box checks if a legal move lies within it
  refreshBoard()
  document.querySelectorAll('.box').forEach(nextItem => {
    legalMoves.forEach(move => {
      if (nextItem.id == move) {
        nextItem.style.backgroundColor = 'rgb(0, 200, 0)'
      }
    });
    moves.forEach(move => {
      if (nextItem.id == move && nextItem.style.backgroundColor != 'rgb(0, 200, 0)' && nextItem.children[0].alt[0] != turn) {
        nextItem.style.backgroundColor = 'rgb(200, 0, 0)'

      }
    });
  });

  document.querySelectorAll('.box').forEach(colour => {
    if (colour.style.backgroundColor == 'rgb(0, 200, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('click', function() {
        id = colour.id
        move(item, id, 'pawn')
        this.removeEventListener('click', arguments.callee);
      });
    }

    else if (colour.style.backgroundColor == 'rgb(200, 0, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('mouseup', function() {
        id = colour.id
        take(item, id, 'pawn')
        this.removeEventListener('click', arguments.callee);
      });
    };

  });
};

function rookMove(item) {

  let legalMoves = [];
  let moves = [];


  // each rook move:
  // vertical

  document.querySelectorAll('.box').forEach(checkMove => {
    if (checkMove.id[0] == item.id[0]) {
      moves.push(checkMove.id)
      if (checkMove.innerHTML.length == 0) {
        legalMoves.push(checkMove.id)
      }
    }
  });

  // horizontal
  document.querySelectorAll('.box').forEach(checkMove => {
    if (checkMove.id[1] == item.id[1]) {
      moves.push(checkMove.id)
      if (checkMove.innerHTML.length == 0) {
        legalMoves.push(checkMove.id)
      }
    }
  });





  // for each box checks if a legal move lies within it
  refreshBoard()
  document.querySelectorAll('.box').forEach(nextItem => {
    legalMoves.forEach(move => {
      if (nextItem.id == move) {
        nextItem.style.backgroundColor = 'rgb(0, 200, 0)'
      }
    });
    moves.forEach(move => {
      if (nextItem.id == move && nextItem.style.backgroundColor != 'rgb(0, 200, 0)' && nextItem.children[0].alt[0] != turn) {
        nextItem.style.backgroundColor = 'rgb(200, 0, 0)'

      }
    });
  });

  document.querySelectorAll('.box').forEach(colour => {
    if (colour.style.backgroundColor == 'rgb(0, 200, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('click', function() {
        id = colour.id
        move(item, id, 'rook')
        this.removeEventListener('click', arguments.callee);
      });
    }

    else if (colour.style.backgroundColor == 'rgb(200, 0, 0)') {
      colour.style.cursor = 'pointer'
      console.log('take!')
      colour.addEventListener('mouseup', function() {
        id = colour.id
        console.log('take!')
        take(item, id, 'rook')
        this.removeEventListener('click', arguments.callee);
      });
    };

  });
};

function bishopMove(item) {

  let legalMoves = [];
  let moves = [];
  // each bishop legal move - uses find diagonals:

  moves = diagonals = findDiagonals(item.id)
  document.querySelectorAll('.box').forEach(checkMove => {
    diagonals.forEach(move => {
      if (checkMove.id == move && checkMove.innerHTML.length == 0) {
        legalMoves.push(move)
      }

    });
  });


  let difference = moves
    .filter(x => !legalMoves.includes(x))
    .concat(legalMoves.filter(x => !moves.includes(x)));

  //console.log(difference)

  // for each box checks if a legal move lies within it
  refreshBoard()
  document.querySelectorAll('.box').forEach(nextItem => {
    legalMoves.forEach(move => {
      if (nextItem.id == move) {
        nextItem.style.backgroundColor = 'rgb(0, 200, 0)'
      }
    });
    moves.forEach(move => {
      if (nextItem.id == move && nextItem.style.backgroundColor != 'rgb(0, 200, 0)' && nextItem.children[0].alt[0] != turn) {
        nextItem.style.backgroundColor = 'rgb(200, 0, 0)'

      }
    });
  });

  document.querySelectorAll('.box').forEach(colour => {
    if (colour.style.backgroundColor == 'rgb(0, 200, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('click', function() {
        id = colour.id
        move(item, id, 'bishop')
        this.removeEventListener('click', arguments.callee);
      });
    }

    else if (colour.style.backgroundColor == 'rgb(200, 0, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('mouseup', function() {
        id = colour.id
        take(item, id, 'bishop')
        this.removeEventListener('click', arguments.callee);
      });
    };

  });
};

function knightMove(item) {

  let legalMoves = [];
  let moves = [];
  // each knight legal move:

  moves = diagonals = knightMoves(item.id)
  document.querySelectorAll('.box').forEach(checkMove => {
    diagonals.forEach(move => {
      if (checkMove.id == move && checkMove.innerHTML.length == 0) {
        legalMoves.push(move)
      }
    });
  });

  refreshBoard()
  document.querySelectorAll('.box').forEach(nextItem => {
    legalMoves.forEach(move => {
      if (nextItem.id == move) {
        nextItem.style.backgroundColor = 'rgb(0, 200, 0)'
      }
    });
    moves.forEach(move => {
      if (nextItem.id == move && nextItem.style.backgroundColor != 'rgb(0, 200, 0)' && nextItem.children[0].alt[0] != turn) {
        nextItem.style.backgroundColor = 'rgb(200, 0, 0)'

      }
    });
  });

  document.querySelectorAll('.box').forEach(colour => {
    if (colour.style.backgroundColor == 'rgb(0, 200, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('click', function() {
        id = colour.id
        move(item, id, 'knight')
        this.removeEventListener('click', arguments.callee);
      });
    }

    else if (colour.style.backgroundColor == 'rgb(200, 0, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('mouseup', function() {
        id = colour.id
        take(item, id, 'knight')
        this.removeEventListener('click', arguments.callee);
      });
    };

  });
};

function queenMove(item) {

  let legalMoves = [];
  let moves = []
  // each queen move:
  // vertical

  document.querySelectorAll('.box').forEach(checkMove => {
    if (checkMove.id[0] == item.id[0]) {
      moves.push(checkMove.id)
      if (checkMove.innerHTML.length == 0) {
        legalMoves.push(checkMove.id)
      }
    }
  });

  // horizontal
  document.querySelectorAll('.box').forEach(checkMove => {
    if (checkMove.id[1] == item.id[1]) {
      moves.push(checkMove.id)
      if (checkMove.innerHTML.length == 0) {
        legalMoves.push(checkMove.id)
      }
    }
  });

  // diagonal

  diagonals = findDiagonals(item.id)
  diagonals.forEach(move => { moves.push(move) })
  document.querySelectorAll('.box').forEach(checkMove => {
    diagonals.forEach(move => {
      if (checkMove.id == move && checkMove.innerHTML.length == 0) {
        legalMoves.push(move)
      }
    });
  });

  // for each box checks if a legal move lies within it
  refreshBoard()
  document.querySelectorAll('.box').forEach(nextItem => {
    legalMoves.forEach(move => {
      if (nextItem.id == move) {
        nextItem.style.backgroundColor = 'rgb(0, 200, 0)'
      }
    });
    moves.forEach(move => {
      if (nextItem.id == move && nextItem.style.backgroundColor != 'rgb(0, 200, 0)' && nextItem.children[0].alt[0] != turn) {
        nextItem.style.backgroundColor = 'rgb(200, 0, 0)'

      }
    });
  });

  document.querySelectorAll('.box').forEach(colour => {
    if (colour.style.backgroundColor == 'rgb(0, 200, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('click', function() {
        id = colour.id
        move(item, id, 'queen')
        this.removeEventListener('click', arguments.callee);
      });
    }

    else if (colour.style.backgroundColor == 'rgb(200, 0, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('mouseup', function() {
        id = colour.id
        take(item, id, 'queen')
        this.removeEventListener('click', arguments.callee);
      });
    };

  });
};

function kingMove(item) {

  let legalMoves = [];
  let moves = [];

  moves = diagonals = kingMoves(item.id)
  document.querySelectorAll('.box').forEach(checkMove => {
    diagonals.forEach(move => {
      if (checkMove.id == move && checkMove.innerHTML.length == 0) {
        legalMoves.push(move)
      }
    });
  });

  refreshBoard()
  document.querySelectorAll('.box').forEach(nextItem => {
    legalMoves.forEach(move => {
      if (nextItem.id == move) {
        nextItem.style.backgroundColor = 'rgb(0, 200, 0)'
      }
    });
    moves.forEach(move => {
      if (nextItem.id == move && nextItem.style.backgroundColor != 'rgb(0, 200, 0)' && nextItem.children[0].alt[0] != turn) {
        nextItem.style.backgroundColor = 'rgb(200, 0, 0)'

      }
    });
  });

  document.querySelectorAll('.box').forEach(colour => {
    if (colour.style.backgroundColor == 'rgb(0, 200, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('click', function() {
        id = colour.id
        move(item, id, 'king')
        this.removeEventListener('click', arguments.callee);
      });
    }

    else if (colour.style.backgroundColor == 'rgb(200, 0, 0)') {
      colour.style.cursor = 'pointer'
      colour.addEventListener('mouseup', function() {
        id = colour.id
        take(item, id, 'king')
        this.removeEventListener('click', arguments.callee);
      });
    };

  });
};

//calls refreshBoard to start the game

refreshBoard();

