
var gameController = function (element){
    var self = this;
    self.element = $(element);
    var locked = false;
    var turn = null;
    var cells = [];
    this.cells = cells;
    var cellPosition = [];
    var pieces = [];
    self.pieces = pieces;
    var players = [];
    var currentPlayer = 0;
    var player1Pieces = [];
    var player2Pieces = [];
    var highlightedCells = [];
    self.currentlyDraggingPiece = null;
    self.oldCell = null;
    self.newCell = null;
    self.height = null;
    self.width = null;
    self.check = false;

    self.createBoard = function(height,width){
        self.height = height;
        self.width = width;
        var colors = ['black','white'];
        var colorIndex = 0;
        for (var i = 0; i < height; i++){
            var tr = $('<tr>');
            var newRow = [];
            for (var j = 0; j < width; j++){
                var newCell = new cellGenerator(colors[colorIndex],{x:i,y:j},self);
                colorIndex = 1 - colorIndex;
                var cell = newCell.renderCell();
                cells.push(newCell);
                newRow.push(newCell);
                tr.append(cell);

            }
        self.element.append(tr);
        colorIndex = 1 - colorIndex;
        cellPosition.push(newRow);
        }
        console.log(cellPosition);
    };
    self.getCellByPosition = function(){
        var CellByPosition = cellPosition[i];
    };
    self.initialPlayer = function(colorArray){
        self.playerOne = new playerGenerator(colorArray[0]);
        self.playerTwo = new playerGenerator(colorArray[1]);
        players.push(self.playerOne,self.playerTwo);
    };
    self.createPiece = function(){
        var newPiece = null;
        var pieceElement = null;
        var result = null;
        for (var p = 0; p < pieceData.length; p++){
            if (p == 0){
                for (var i = 0; i < cells.length && pieceData[p].pieceCount > 0; i++){
                    result = pieceData[p].placementRule(cells[i]);
                    if(result){
                        pieceData[p].pieceCount--;
                        newPiece = new pieceGenerator(pieceData[p].movementRules,pieceData[p].jumpCheck,self,i);
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background', self.playerOne.getColor());
                        newPiece.setCurrentCell(cells[i]);
                        cells[i].setCurrentPiece(newPiece);
                        newPiece.setPlayer(self.playerOne);
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        player1Pieces.push(pieceElement);
                    }
                    newPiece.drag();
                }
            }else if (p == 1){
                for (i = 63; i > 0 && pieceData[p].pieceCount > 0; i--){
                    result = pieceData[p].placementRule(cells[i]);
                    if(result){
                        pieceData[p].pieceCount--;
                        newPiece = new pieceGenerator(pieceData[p].movementRules,pieceData[p].jumpCheck,self,i);
                        pieceElement = newPiece.renderPiece();
                        pieceElement.css('background', self.playerTwo.getColor());
                        newPiece.setCurrentCell(cells[i]);
                        cells[i].setCurrentPiece(newPiece);
                        newPiece.setPlayer(self.playerTwo);
                        pieces.push(newPiece);
                        cells[i].cellElement.append(pieceElement);
                        player2Pieces.push(pieceElement);
                    }
                    newPiece.drag();
                }
            }
        }
    };
    self.initializeTurn = function(){
        if (currentPlayer == 0){
            //turn = players[0];
            players[1].disablePieces(player2Pieces);
            currentPlayer = 1;
        }
     };

    self.setTurns = function(){
        self.check = false;
        if (currentPlayer == 0){
            //turn = players[0];
            players[1].disablePieces(player2Pieces);
            players[0].enablePieces(player1Pieces);
            currentPlayer = 1;
        }else if (currentPlayer == 1){
            //turn = players[1];
            players[0].disablePieces(player1Pieces);
            players[1].enablePieces(player2Pieces);
            currentPlayer = 0;
        }
    };
    self.dragTracker = function(piece, id){
        for (var i = 0; i < pieces.length; i++){
            if (pieces[i].id == id){
                self.currentlyDraggingPiece = pieces[i];
                //console.log('current dragged piece: ',self.currentlyDraggingPiece);
            }
        }
        console.log(pieces);
        self.oldCell = self.currentlyDraggingPiece.cellElement;
        self.oldCell.removeCurrentPiece();
        self.currentlyDraggingPiece.removeCurrentCell();
        //console.log('oldCell: ',self.oldCell);
    };
    self.dropTracker = function(cell, row, col){
        for (var i = 0; i < cells.length; i++){
            if (cells[i].row == row && cells[i].col == col){
                self.newCell = cells[i];
                //console.log('newCell: ',self.newCell);
            }
        }
    };
    self.removePieceFromArray = function(deathList){
        for(var i = 0; i < deathList.length; i++){
            var pieceIndex = pieces.indexOf(deathList[i]);
            var player1Index = player1Pieces.indexOf(deathList[i].pieceElement);
            var player2Index = player2Pieces.indexOf(deathList[i].pieceElement);
            pieces.splice(pieceIndex,1);
            if(player1Index != -1){
                player1Pieces.splice(player1Index,1);
            }
            if (player2Index != -1){
                player2Pieces.splice(player2Index,1);
            }
        }
    };
    self.deleteDeathList = function(){
      for (var i = 0; i < cells.length; i++){
          cells[i].death_list = [];
      }
    };
    self.removeDrop = function(event, ui){
        $('.highlight').droppable('destroy');
        $('.highlight').removeClass('highlight');
        //cellSelf.currentPiece.checked = false;
        //console.log(cellSelf.currentPiece.checked);
    };
    self.refresh = function(){
        self.currentlyDraggingPiece = null;
        self.oldCell = null;
        self.newCell = null;
    };

    self.updateCells = function(event, ui){
        //call method in piece to delete it's dom element
        //call method in piece's cell to set cell's piece to null
        //call method in game to remove piece from active list
        //call method in all remaining highlighted cells to clear their kill lists
        self.refresh();
        console.log('ui draggable: ',$(ui.draggable).attr('id'));
        var id = $(ui.draggable).attr('id');
        self.dragTracker(ui.draggable, id);
        console.log('event Target Row: ',$(event.target).attr('row'));
        console.log('event Target Col: ',$(event.target).attr('col'));
        var row = $(event.target).attr('row');
        var col = $(event.target).attr('col');
        self.dropTracker(event.target, row, col);
        self.removeDrop();
        self.newCell.setCurrentPiece(self.currentlyDraggingPiece);
        self.currentlyDraggingPiece.setCurrentCell(self.newCell);
        $(self.newCell.cellElement).append(ui.draggable);
        $('#draggableHelper').remove();
        console.log('current dragged piece: ',self.currentlyDraggingPiece);
        console.log('oldCell: ',self.oldCell);
        console.log('newCell: ',self.newCell);
        self.newCell.executeDeath();
        if (self.newCell.currentPiece.player == self.playerOne && self.newCell.row == 7 || self.newCell.currentPiece.player == self.playerTwo && self.newCell.row == 0){
            self.newCell.currentPiece.setKingMovement();
        }
        if(self.check == true){
            self.newCell.findPossibleJumps();
        }else {
            self.setTurns();
        }
    };
    self.getCellAtPosition = function(x,y){
        return cellPosition[x][y];
    };
    self.isPositionInBounds = function(x,y){
        if((x>=0 && x<self.width) && (y>=0 && y<self.height)){
            return true;
        } else{
            return false;
        }
    };
    var cellGenerator = function(color, position,game){
        var cellSelf = this;
        cellSelf.color = color;
        cellSelf.position = position;
        cellSelf.game = game;
        cellSelf.currentPiece = null;
        cellSelf.cellElement = null;
        cellSelf.row = cellSelf.position.x;
        cellSelf.col = cellSelf.position.y;
        cellSelf.currentPieceId = null;

        cellSelf.renderCell = function() {
            cellSelf.cellElement = $('<td row="' + cellSelf.row + '" col="' + cellSelf.col + '">').addClass('cell');
            cellSelf.setBackgroundColor();
            return cellSelf.cellElement;
        };
        cellSelf.setBackgroundColor = function(){
            if (cellSelf.color == "black"){
                cellSelf.cellElement.addClass('black');
            }else if (cellSelf.color == "white"){
                cellSelf.cellElement.addClass('white');
            }
        };
        cellSelf.cellPosition = function(){
            return cellSelf.position;
        };
        cellSelf.setCurrentPiece = function(piece){
            cellSelf.currentPiece = piece;
            cellSelf.currentPieceId = piece.id;
        };
        cellSelf.getCurrentPiece = function(){
            return cellSelf.currentPiece;
        };
        cellSelf.removeCurrentPiece = function(){
            cellSelf.currentPiece = null;
            cellSelf.currentPieceId = null;
            //cellSelf.moves = null;
        };
        cellSelf.getColor = function(){
            return cellSelf.color;
        };
        cellSelf.indicateMovesWithHighlight = function(){
            cellSelf.cellElement.addClass('highlight');
        };
        cellSelf.removeHighlight = function(){
            cellSelf.cellElement.removeClass('highlight');
        };
        cellSelf.findPossibleMoves = function(event, ui){
            highlightedCells = [];
            if (cellSelf.game.check == false){
                cellSelf.moves = cellSelf.currentPiece.moveRule(cellSelf.position.x,cellSelf.position.y);
                cellSelf.convertMovesToCells();
                cellSelf.highlightPossibleMoves();
            }else if(cellSelf.game.check == true){
                cellSelf.findPossibleJumps();
            }
        };
        cellSelf.findPossibleJumps = function(){
            highlightedCells = [];
            cellSelf.jumpMoves = cellSelf.currentPiece.jumps(cellSelf.position.x,cellSelf.position.y);
            cellSelf.convertJumpsToCells();
            cellSelf.highlightPossibleMoves();
        };
        cellSelf.markPiecesForDeath = function(piecesToKill){
            cellSelf.death_list=piecesToKill;
        };
        cellSelf.executeDeath = function (){
            for (var i = 0; i < cellSelf.death_list.length; i++){
              cellSelf.death_list[i].cellElement.removeCurrentPiece();
              cellSelf.death_list[i].removeCurrentCell();
              cellSelf.death_list[i].deleteSelf();
            }
            cellSelf.game.removePieceFromArray(cellSelf.death_list);
            cellSelf.game.deleteDeathList();
        };
        cellSelf.convertMovesToCells = function(){
            for (var i = 0; i < cellSelf.moves.length; i++){
                console.log(cellSelf.moves[i]);
                var highlightCell = cellPosition[cellSelf.moves[i].x][cellSelf.moves[i].y];
                //mark cell at position for death
                highlightCell.markPiecesForDeath(cellSelf.moves[i].pieces_to_kill);
                highlightedCells.push(highlightCell);
            }
            return highlightedCells;
        };
        cellSelf.convertJumpsToCells = function(){
            for (var i = 0; i < cellSelf.jumpMoves.length; i++){
                console.log(cellSelf.jumpMoves[i]);
                var highlightCell = cellPosition[cellSelf.jumpMoves[i].x][cellSelf.jumpMoves[i].y];
                //mark cell at position for death
                highlightCell.markPiecesForDeath(cellSelf.jumpMoves[i].pieces_to_kill);
                highlightedCells.push(highlightCell);
            }
            return highlightedCells;
        };
        cellSelf.highlightPossibleMoves = function(){
            for(var i = 0; i < highlightedCells.length; i++){
                highlightedCells[i].indicateMovesWithHighlight();
                console.log('cells receive drop');
            }
            if (highlightedCells.length == 0){
                cellSelf.game.setTurns();
            }
            cellSelf.drop();
        };

        cellSelf.removeHighlightedMoves= function(){
            for(var i = 0; i < highlightedCells.length; i++){
                highlightedCells[i].removeHighlight();            }
        };
        cellSelf.drop = function(){
            $('.highlight').droppable({
                accept:pieceGenerator.pieceElement,
                hoverClass:'hovered',
                drop:function(event, ui){
                    cellSelf.game.updateCells(event,ui);

                }
            });

        };
    };

    var pieceGenerator = function(moveRule,jumpCheck,game,id){
        var pieceSelf = this;
        pieceSelf.checked = false;
        pieceSelf.id = id;
        pieceSelf.pieceElement = null;
        pieceSelf.moveRule = moveRule;
        pieceSelf.jumps = jumpCheck;
        pieceSelf.game = game;
        pieceSelf.cellElement = null;
        pieceSelf.cellElementRow = null;
        pieceSelf.cellElementCol = null;
        pieceSelf.player = null;
        pieceSelf.king = false;
        pieceSelf.deleteSelf = function(){
            pieceSelf.pieceElement.remove();
            pieceSelf.game.check = true;
        };
        pieceSelf.setPlayer = function(player){
            pieceSelf.player = player;
        };
        pieceSelf.setCurrentCell = function(cell){
            pieceSelf.cellElement = cell;
            pieceSelf.cellElementRow = cell.row;
            pieceSelf.cellElementCol = cell.col;
        };
        pieceSelf.removeCurrentCell = function(){
            pieceSelf.cellElement = null;
            pieceSelf.cellElementRow = null;
            pieceSelf.cellElementCol = null;

        };
        pieceSelf.setKingMovement = function(){
            pieceSelf.moveRule = pieceData[2].movementRules;
            pieceSelf.jumps = pieceData[2].jumpCheck;
            if (pieceSelf.king == false){
                pieceSelf.pieceElement.append('<img src="crown.png">');
                pieceSelf.king = true;
            }

        };
        pieceSelf.renderPiece = function(){
            pieceSelf.pieceElement = $('<div id="' + pieceSelf.id + '">').addClass('piece');
            return pieceSelf.pieceElement;
        };
        pieceSelf.drag = function(){
            pieceSelf.pieceElement.draggable({
                containment:'#board',
                revert:"invalid",
                tolerance:'fit',
                start:function(){
                    pieceSelf.cellElement.findPossibleMoves();
                },
                stop:pieceSelf.game.removeDrop,
                helper:pieceSelf.help
            });
        };
        pieceSelf.help = function (){
            return '<div id="draggableHelper" class="piece"></div>';
        }

    };

    var playerGenerator = function(color){
        var playSelf = this;
        playSelf.turn = false;
        playSelf.color = color;
        playSelf.getColor = function(){
            return playSelf.color;
        };
        playSelf.disablePieces = function(piecesArray){
            console.log(piecesArray);
            for (var i = 0; i < piecesArray.length; i++){
                piecesArray[i].draggable('disable');
            }
        };
        playSelf.enablePieces = function(piecesArray){
            console.log(piecesArray);
            for (var i = 0; i < piecesArray.length; i++){
                piecesArray[i].draggable('enable');
            }
        }
    };
};

var pieceData = [
    {
        pieceClass: "yellowPiece",
        pieceCount: 12,
        placementRule: function (cell) {
            if (cell.getColor() == 'black') {
                return true;
            } else {
                return false;
            }
        },
        movementRules: function (x, y) {
            var vectors = [
                [1, -1],
                [1, 1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for (var i = 0; i < vectors.length; i++) {
                for (var j = 1; j < vectors[i].length; j++) {
                    var possibleCoor = {
                        x: x + (vectors[i][0] * j),
                        y: y + (vectors[i][1] * j),
                        vector: vectors[i],
                        pieces_to_kill : []
                    };
                    totalPossible.push(possibleCoor);
                    if (this.game.isPositionInBounds(totalPossible[i].x,totalPossible[i].y)) {
                        //is their a piece at that position?  AND is the color of the piece different than mine
                        if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece != null && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece.player != this.player){
                            //if yes:
                            //temporarily store the piece that will be jumped over
                            //store piece to kill in pieces_to_kill array
                            possibleCoor.pieces_to_kill.push(this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece);
                            //update totalPossible to one more cell along the same vector
                            totalPossible[i].x += totalPossible[i].vector[0];
                            totalPossible[i].y += totalPossible[i].vector[1];
                            if (this.game.isPositionInBounds(totalPossible[i].x,totalPossible[i].y) && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null){
                                validPossible.push(totalPossible[i]);
                            }

                            //check if that cell is empty totalPossible
                            //if yes, it is a valid move
                        }else if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null){
                            validPossible.push(totalPossible[i]);
                        }

                    }
                }
            }

            return validPossible;
        },
        jumpCheck: function (x, y) {
            var vectors = [
                [1, -1],
                [1, 1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for (var i = 0; i < vectors.length; i++) {
                for (var j = 1; j < vectors[i].length; j++) {
                    var possibleCoor = {
                        x: x + (vectors[i][0] * j),
                        y: y + (vectors[i][1] * j),
                        vector: vectors[i],
                        pieces_to_kill: []
                    };
                    totalPossible.push(possibleCoor);
                    if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y)) {
                        //is their a piece at that position?  AND is the color of the piece different than mine
                        if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece != null && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece.player != this.player) {
                            //if yes:
                            //temporarily store the piece that will be jumped over
                            //store piece to kill in pieces_to_kill array
                            possibleCoor.pieces_to_kill.push(this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece);
                            //update totalPossible to one more cell along the same vector
                            totalPossible[i].x += totalPossible[i].vector[0];
                            totalPossible[i].y += totalPossible[i].vector[1];
                            if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y) && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null) {

                                validPossible.push(totalPossible[i]);
                            }

                            //check if that cell is empty totalPossible
                            //if yes, it is a valid move
                        }
                    }
                }
            }
            return validPossible;
        }
    },
    {
        pieceClass: "bluePiece",
        pieceCount: 12,
        placementRule: function (cell) {
            if (cell.getColor() == 'black') {
                return true;
            } else {
                return false;
            }
        },
        movementRules: function (x, y) {
            var vectors = [
                [-1, 1],
                [-1, -1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for (var i = 0; i < vectors.length; i++) {
                for (var j = 1; j < vectors[i].length; j++) {
                    var possibleCoor = {
                        x: x + (vectors[i][0] * j),
                        y: y + (vectors[i][1] * j),
                        vector: vectors[i],
                        pieces_to_kill: []
                    };
                    totalPossible.push(possibleCoor);
                    if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y)) {
                        //is their a piece at that position?  AND is the color of the piece different than mine
                        if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece != null && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece.player != this.player) {
                            //if yes:
                            //temporarily store the piece that will be jumped over
                            //store piece to kill in pieces_to_kill array
                            possibleCoor.pieces_to_kill.push(this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece);
                            //update totalPossible to one more cell along the same vector
                            totalPossible[i].x += totalPossible[i].vector[0];
                            totalPossible[i].y += totalPossible[i].vector[1];
                            if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y) && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null) {

                                validPossible.push(totalPossible[i]);
                            }

                            //check if that cell is empty totalPossible
                            //if yes, it is a valid move
                        } else if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null) {
                            validPossible.push(totalPossible[i]);
                        }

                    }
                }
            }

            return validPossible;
        },
        jumpCheck: function (x, y) {
            var vectors = [
                [-1, 1],
                [-1, -1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for (var i = 0; i < vectors.length; i++) {
                for (var j = 1; j < vectors[i].length; j++) {
                    var possibleCoor = {
                        x: x + (vectors[i][0] * j),
                        y: y + (vectors[i][1] * j),
                        vector: vectors[i],
                        pieces_to_kill: []
                    };
                    totalPossible.push(possibleCoor);
                    if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y)) {
                        //is their a piece at that position?  AND is the color of the piece different than mine
                        if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece != null && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece.player != this.player) {
                            //if yes:
                            //temporarily store the piece that will be jumped over
                            //store piece to kill in pieces_to_kill array
                            possibleCoor.pieces_to_kill.push(this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece);
                            //update totalPossible to one more cell along the same vector
                            totalPossible[i].x += totalPossible[i].vector[0];
                            totalPossible[i].y += totalPossible[i].vector[1];
                            if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y) && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null) {

                                validPossible.push(totalPossible[i]);
                            }

                            //check if that cell is empty totalPossible
                            //if yes, it is a valid move
                        }
                    }
                }
            }
            return validPossible;
        }
    },
    {
        pieceClass: "king",
        movementRules: function (x, y) {
            var vectors = [
                [-1, 1],
                [-1, -1],
                [1, -1],
                [1, 1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for (var i = 0; i < vectors.length; i++) {
                for (var j = 1; j < vectors[i].length; j++) {
                    var possibleCoor = {
                        x: x + (vectors[i][0] * j),
                        y: y + (vectors[i][1] * j),
                        vector: vectors[i],
                        pieces_to_kill: []
                    };
                    totalPossible.push(possibleCoor);
                    if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y)) {
                        //is their a piece at that position?  AND is the color of the piece different than mine
                        if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece != null && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece.player != this.player) {
                            //if yes:
                            //temporarily store the piece that will be jumped over
                            //store piece to kill in pieces_to_kill array
                            possibleCoor.pieces_to_kill.push(this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece);
                            //update totalPossible to one more cell along the same vector
                            totalPossible[i].x += totalPossible[i].vector[0];
                            totalPossible[i].y += totalPossible[i].vector[1];
                            if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y) && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null) {

                                validPossible.push(totalPossible[i]);
                            }

                            //check if that cell is empty totalPossible
                            //if yes, it is a valid move
                        } else if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null) {
                            validPossible.push(totalPossible[i]);
                        }

                    }
                }
            }

            return validPossible;
        },
        jumpCheck: function (x, y) {
            var vectors = [
                [-1, 1],
                [-1, -1],
                [1, -1],
                [1, 1]
            ];
            var totalPossible = [];
            var validPossible = [];
            for (var i = 0; i < vectors.length; i++) {
                for (var j = 1; j < vectors[i].length; j++) {
                    var possibleCoor = {
                        x: x + (vectors[i][0] * j),
                        y: y + (vectors[i][1] * j),
                        vector: vectors[i],
                        pieces_to_kill: []
                    };
                    totalPossible.push(possibleCoor);
                    if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y)) {
                        //is their a piece at that position?  AND is the color of the piece different than mine
                        if (this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece != null && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece.player != this.player) {
                            //if yes:
                            //temporarily store the piece that will be jumped over
                            //store piece to kill in pieces_to_kill array
                            possibleCoor.pieces_to_kill.push(this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece);
                            //update totalPossible to one more cell along the same vector
                            totalPossible[i].x += totalPossible[i].vector[0];
                            totalPossible[i].y += totalPossible[i].vector[1];
                            if (this.game.isPositionInBounds(totalPossible[i].x, totalPossible[i].y) && this.game.getCellAtPosition(totalPossible[i].x, totalPossible[i].y).currentPiece == null) {

                                validPossible.push(totalPossible[i]);
                            }

                            //check if that cell is empty totalPossible
                            //if yes, it is a valid move
                        }
                    }
                }
            }
            return validPossible;
        }
    }
];
var game;
$(document).ready(function(){
    game = new gameController('#board');
    game.createBoard(8,8);
    game.initialPlayer(['yellow','blue']);
    game.createPiece(pieceData);
    game.initializeTurn();
});

