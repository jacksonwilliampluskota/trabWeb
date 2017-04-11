var Credito = function(){};
Credito.prototype.preload = function() {
    game.load.image('background', '../../assets/images/startbkground.jpg');
    game.load.image('creditos', '../../assets/images/text.png');
};

Credito.prototype.create = function () {
    var _this = this
    _this.background = game.add.sprite(0, 0, 'background');
    var graphics = game.add.graphics(350, 50);
    graphics.beginFill(0x34495f, 0.6);
    graphics.lineStyle(2, 0xFF3300, 1);
    graphics.drawRect(0, 150, 600, 350);
    graphics.endFill();

    _this.add.button(540, 315, 'creditos', _this.menu, _this);
};

Credito.prototype.menu = function () {
    var _this = this;
    _this.state.start('Menu');

};
