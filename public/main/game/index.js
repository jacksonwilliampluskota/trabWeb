var Game = function(game){

};

Game.prototype.preload = function () {
	var _this = this;
	_this.game.load.image('blue', '../../assets/images/gemBlue.png');
    _this.game.load.image('green', '../../assets/images/gemGreen.png');
    _this.game.load.image('red', '../../assets/images/gemRed.png');
    _this.game.load.image('yellow', '../../assets/images/gemYellow.png');
    _this.game.load.audio('background', '../../assets/audio/Bubble_Bath.mp3');
    _this.game.load.audio('troca', '../../assets/audio/troca.wav');
    _this.game.load.audio('acerto', '../../assets/audio/acerto.wav');

};

Game.prototype.create = function() {

	var _this = this;

	$.getJSON( "/best/", function( data ) {
		console.log(data.pointer);
		_this.betterPointer = data.pointer;
	}).done(function () {

		_this.game.stage.backgroundColor = "34495f";

		_this.tileTypes = [
			'blue',
			'green',
			'red',
			'yellow'
		];

		_this.score = 0;

		_this.activeTile1 = null;
		_this.activeTile2 = null;

		_this.canMove = false;

		_this.tileWidth = _this.game.cache.getImage('blue').width;
		_this.tileHeight = _this.game.cache.getImage('blue').height;


		_this.tiles = _this.game.add.group();

		_this.tileGrid = [
			[null, null, null, null, null, null],
			[null, null, null, null, null, null],
			[null, null, null, null, null, null],
			[null, null, null, null, null, null],
			[null, null, null, null, null, null],
			[null, null, null, null, null, null]
		];


		var seed = Date.now();
		_this.random = new Phaser.RandomDataGenerator([seed]);

		_this.bkgd = _this.game.add.audio('background');

		_this.bkgd.play();

		_this.bkgd.loopFull(0.6);
		_this.initTiles();
		_this.createScore();

	});


};

Game.prototype.update = function() {
	var _this = this;


	if(_this.activeTile1 && !_this.activeTile2){

		var hoverX = _this.game.input.x;
		var hoverY = _this.game.input.y;

		var hoverPosX = Math.floor(hoverX/_this.tileWidth);
		var hoverPosY = Math.floor(hoverY/_this.tileHeight);

		var difX = (hoverPosX - _this.startPosX);
		var difY = (hoverPosY - _this.startPosY);

		if(!(hoverPosY > _this.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > _this.tileGrid.length - 1 || hoverPosX < 0)){

			if((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY ==0)){

				_this.canMove = false;

				_this.activeTile2 = _this.tileGrid[hoverPosX][hoverPosY];

				_this.swapTiles();

				_this.game.time.events.add(500, function(){
					_this.checkMatch();
				});
			}

		}

	}

};

Game.prototype.initTiles = function(){

	var _this = this;

	for(var i = 0; i < _this.tileGrid.length; i++){

		for(var j = 0; j < _this.tileGrid.length; j++){

			var tile = this.addTile(i, j);

			this.tileGrid[i][j] = tile;

		}
	}

	this.game.time.events.add(600, function(){
		_this.checkMatch();
	});

};

Game.prototype.addTile = function(x, y){

	var _this = this;

	var tileToAdd = _this.tileTypes[_this.random.integerInRange(0, _this.tileTypes.length - 1)];

	var tile = _this.tiles.create((x * _this.tileWidth) + _this.tileWidth / 2, 0, tileToAdd);

	_this.game.add.tween(tile).to({y:y*_this.tileHeight+(_this.tileHeight/2)}, 500, Phaser.Easing.Linear.In, true)

	tile.anchor.setTo(0.5, 0.5);

	tile.inputEnabled = true;

	tile.tileType = tileToAdd;

	tile.events.onInputDown.add(_this.tileDown, _this);

	return tile;

};

Game.prototype.tileDown = function(tile, pointer){

	var _this = this;

	if(_this.canMove){
		_this.activeTile1 = tile;

		_this.startPosX = (tile.x - _this.tileWidth/2) / _this.tileWidth;
		_this.startPosY = (tile.y - _this.tileHeight/2) / _this.tileHeight;
	}

};

Game.prototype.tileUp = function(){

	var _this = this;
	_this.activeTile1 = null;
	_this.activeTile2 = null;

};

Game.prototype.swapTiles = function(){

	var _this = this;

	if(_this.activeTile1 && _this.activeTile2){

		var tile1Pos = {x:(_this.activeTile1.x - _this.tileWidth / 2) / _this.tileWidth, y:(_this.activeTile1.y - _this.tileHeight / 2) / _this.tileHeight};
		var tile2Pos = {x:(_this.activeTile2.x - _this.tileWidth / 2) / _this.tileWidth, y:(_this.activeTile2.y - _this.tileHeight / 2) / _this.tileHeight};

		_this.tileGrid[tile1Pos.x][tile1Pos.y] = _this.activeTile2;
		_this.tileGrid[tile2Pos.x][tile2Pos.y] = _this.activeTile1;

		_this.game.add.tween(_this.activeTile1).to({x:tile2Pos.x * _this.tileWidth + (_this.tileWidth/2), y:tile2Pos.y * _this.tileHeight + (_this.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);
		_this.game.add.tween(_this.activeTile2).to({x:tile1Pos.x * _this.tileWidth + (_this.tileWidth/2), y:tile1Pos.y * _this.tileHeight + (_this.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);

		_this.activeTile1 = _this.tileGrid[tile1Pos.x][tile1Pos.y];
		_this.activeTile2 = _this.tileGrid[tile2Pos.x][tile2Pos.y];

		_this.troca = _this.game.add.audio('troca');

		_this.troca.play();
	}

};

Game.prototype.checkMatch = function(){

	var _this = this;

	var matches = _this.getMatches(_this.tileGrid);

	if(matches.length > 0){

		_this.removeTileGroup(matches);

		_this.resetTile();

		_this.fillTile();

		_this.game.time.events.add(500, function(){
			_this.tileUp();
		});

		_this.game.time.events.add(600, function(){

			_this.acerto = _this.game.add.audio('acerto');
			_this.acerto.play();
			_this.checkMatch();
			var form = {};
			form.pointer = _this.pontuation;
            $.ajax({
              type: "POST",
              url: '/best/',
              data: form,
              dataType: 'json'
            });
		});

	}
	else {

		_this.swapTiles();
		_this.game.time.events.add(500, function(){
			_this.tileUp();
			_this.canMove = true;
		});
	}

};

Game.prototype.getMatches = function(tileGrid){

	var matches = [];
	var groups = [];

	for (var i = 0; i < tileGrid.length; i++)
	{
		var tempArr = tileGrid[i];
		groups = [];
		for (var j = 0; j < tempArr.length; j++)
		{
			if(j < tempArr.length - 2)
				if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2])
				{
					if (tileGrid[i][j].tileType == tileGrid[i][j+1].tileType && tileGrid[i][j+1].tileType == tileGrid[i][j+2].tileType)
					{
						if (groups.length > 0)
						{
							if (groups.indexOf(tileGrid[i][j]) == -1)
							{
								matches.push(groups);
								groups = [];
							}
						}

						if (groups.indexOf(tileGrid[i][j]) == -1)
						{
							groups.push(tileGrid[i][j]);
						}
						if (groups.indexOf(tileGrid[i][j+1]) == -1)
						{
							groups.push(tileGrid[i][j+1]);
						}
						if (groups.indexOf(tileGrid[i][j+2]) == -1)
						{
							groups.push(tileGrid[i][j+2]);
						}
					}
				}
		}
		if(groups.length > 0) matches.push(groups);
	}

	for (j = 0; j < tileGrid.length; j++)
	{
		var tempArr = tileGrid[j];
		groups = [];
		for (i = 0; i < tempArr.length; i++)
		{
			if(i < tempArr.length - 2)
				if (tileGrid[i][j] && tileGrid[i+1][j] && tileGrid[i+2][j])
				{
					if (tileGrid[i][j].tileType == tileGrid[i+1][j].tileType && tileGrid[i+1][j].tileType == tileGrid[i+2][j].tileType)
					{
						if (groups.length > 0)
						{
							if (groups.indexOf(tileGrid[i][j]) == -1)
							{
								matches.push(groups);
								groups = [];
							}
						}

						if (groups.indexOf(tileGrid[i][j]) == -1)
						{
							groups.push(tileGrid[i][j]);
						}
						if (groups.indexOf(tileGrid[i+1][j]) == -1)
						{
							groups.push(tileGrid[i+1][j]);
						}
						if (groups.indexOf(tileGrid[i+2][j]) == -1)
						{
							groups.push(tileGrid[i+2][j]);
						}
					}
				}
		}
		if(groups.length > 0) matches.push(groups);
	}

	return matches;

};

Game.prototype.removeTileGroup = function(matches){

	var _this = this;

	for(var i = 0; i < matches.length; i++){
		var tempArr = matches[i];

		for(var j = 0; j < tempArr.length; j++){

			var tile = tempArr[j];
			var tilePos = _this.getTilePos(_this.tileGrid, tile);

			_this.tiles.remove(tile);

			_this.incrementScore();

			if(tilePos.x != -1 && tilePos.y != -1){
				_this.tileGrid[tilePos.x][tilePos.y] = null;
			}

		}
	}
};

Game.prototype.getTilePos = function(tileGrid, tile)
{
	var pos = {x:-1, y:-1};

	for(var i = 0; i < tileGrid.length ; i++)
	{
		for(var j = 0; j < tileGrid[i].length; j++)
		{
			if(tile == tileGrid[i][j])
			{
				pos.x = i;
				pos.y = j;
				break;
			}
		}
	}

	return pos;
};

Game.prototype.resetTile = function(){

	var _this = this;

	for (var i = 0; i < _this.tileGrid.length; i++)
	{

		for (var j = _this.tileGrid[i].length - 1; j > 0; j--)
		{

			if(_this.tileGrid[i][j] == null && _this.tileGrid[i][j-1] != null)
			{
				var tempTile = _this.tileGrid[i][j-1];
				_this.tileGrid[i][j] = tempTile;
				_this.tileGrid[i][j-1] = null;

				_this.game.add.tween(tempTile).to({y:(_this.tileHeight*j)+(_this.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);

				j = _this.tileGrid[i].length;
			}
		}
	}

};

Game.prototype.fillTile = function(){

	var _this = this;

	for(var i = 0; i < _this.tileGrid.length; i++){

		for(var j = 0; j < _this.tileGrid.length; j++){

			if (_this.tileGrid[i][j] == null)
			{
				var tile = _this.addTile(i, j);

				_this.tileGrid[i][j] = tile;
			}

		}
	}

};

Game.prototype.createScore = function(){

	var _this = this;
	var scoreFont = "100px Arial";

	_this.scoreLabel = _this.game.add.text((Math.floor(_this.tileGrid[0].length / 2) * _this.tileWidth), 0, "0", {font: scoreFont, fill: "#fff"});
	_this.scoreLabel.anchor.setTo(0.5, 0);
	_this.scoreLabel.align = 'center';

	var scoreFontN = "50px Arial";
	_this.scoreLabel2 = _this.game.add.text(500, 600, 'Melhor pontuação: ' + _this.betterPointer, {font: scoreFontN, fill: "#fff"});
	_this.scoreLabel2.anchor.setTo(0.5, 0);
	_this.scoreLabel2.align = 'buttom';

};

Game.prototype.incrementScore = function(){

	var _this = this;

	_this.score += 10;
	_this.scoreLabel.text = _this.score;
	_this.pontuation =  _this.score;

};