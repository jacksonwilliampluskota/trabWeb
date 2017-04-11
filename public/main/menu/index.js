function Menu() {
    this.con = false
};
Menu.prototype.preload = function() {
    game.load.image('background', '../../assets/images/startbkground.jpg');
    game.load.image('menu', '../../assets/images/play2.png');
    game.load.image('credito', '../../assets/images/credito.png');
    game.load.image('fbLogin', '../../assets/images/fbLogin.png');
};

Menu.prototype.create = function () {
    var _this = this
    _this.background = game.add.sprite(0, 0, 'background');
    var graphics = game.add.graphics(350, 50);
    graphics.beginFill(0x34495f, 0.6);
    graphics.lineStyle(2, 0xFF3300, 1);
    graphics.drawRect(0, 150, 600, 350);
    graphics.endFill();
    apareceButton(this, this.con);
    _this.add.button(540, 315, 'credito', _this.credito, _this);

};
function apareceButton(these, con) {
    //if (con) {
        these.add.button(540, 215, 'menu', these.startGame, these);
    //} else {
        these.add.button(540, 490, 'fbLogin', these.logFB, these);

    //}
};
Menu.prototype.startGame = function () {
    var _this = this;
    _this.state.start('Game');

};

Menu.prototype.credito = function () {
    var _this = this;
    _this.state.start('Credito');

};

Menu.prototype.logFB = function () {
    var _this = this;
    FB.login(function(response) {
        var success = function (response) {
            console.log(response);
            _this.con = true;
            apareceButton(_this, _this.con);
        };
        if (response.status == "connected") {

            $.ajax({
              type: "POST",
              url: '/login/',
              data: response,
              success: success,
              dataType: 'json'
            });
        }
    });


};

Menu.prototype.logoutFB = function () {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            var accessToken = response.authResponse.accessToken;
            console.log(accessToken);
            FB.logout(function(response) {
                console.log('aqui', response);
            });
        }
    } );

}
