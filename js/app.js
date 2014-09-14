enchant(); // おまじない

window.onload = function() {
  var Config = {
    Window: {
      w: 320,
      h: 400
    },
    Sprite: {
      airplane: {
        w: 35,
        h: 50
      },
      piron: {
        w: 25,
        h: 50
      }
    }
  };

  var game = new Game(Config.Window.w, Config.Window.h); // ゲーム本体を準備すると同時に、表示される領域の大きさを設定しています。
  game.fps = 24; // frames（フレーム）per（毎）second（秒）：ゲームの進行スピードを設定しています。
  game.preload(['../images/airplane.png', '../images/piron.png']); //gゲームに使う素材をあらかじめ読み込んでおきます。

  game.onload = function() { // ゲームの準備が整ったらメインの処理を実行します。
    game.rootScene.backgroundColor  = '#7ecef4'; // ゲームの動作部分の背景色を設定しています。
    // var airplane = Airplane(game, 'airplane');
    var airplane = new Airplane();
    
    var piron = Piron(game, 'piron')
  }

  game.start();

  Airplane = enchant.Class.create(Sprite, {
    initialize: function() {
      var spriteName = 'airplane';
      var game = enchant.Game.instance;
      var width = Config.Sprite[spriteName].w;
      var height = Config.Sprite[spriteName].h;
      Sprite.call(this, width, height);
      this.image = game.assets['../images/' + spriteName + '.png']; // あらかじめロードしておいた画像を適用します。
      this.x = (Config.Window.w / 2) - (width / 2);
      this.y = Config.Window.h - height;
      game.rootScene.addChild(this); // ゲームのシーンにくまを表示させます。
      
      var speed = 0;
      this.addEventListener(Event.ENTER_FRAME, function() {
        this.x += speed; // 毎フレーム、くまの座標をspeed分ずらす
      });

      game.rootScene.addEventListener(Event.TOUCH_START, function(e) {
        if (e.x > gameObj.x) { // if (もしも) タッチした横位置が、くまの横位置よりも右側（座標の値として大きい）だったら
          speed += 1;
        } else {
          speed -= 1;
        }
      });
    }
  });

  function Piron(game, spriteName) {
    var width = Config.Sprite[spriteName].w;
    var height = Config.Sprite[spriteName].h;
    var gameObj = new Sprite(width, height);  // スプライト(操作可能な画像)を準備すると同時に、スプライトの表示される領域の大きさを設定しています。
    this.gameObj = gameObj;
    gameObj.image = game.assets['../images/' + spriteName + '.png']; // あらかじめロードしておいた画像を適用します。
    gameObj.x = Config.Window.w / 2 - (width / 2);
    var initialY = 0;
    gameObj.y = initialY;
    game.rootScene.addChild(gameObj); // ゲームのシーンにくまを表示させます。
    var speed = 5;

    game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
      gameObj.y += speed; // 毎フレーム、くまの座標をspeed分ずらす
      if (gameObj.y > Config.Window.h) {
        gameObj.y = initialY;
      }
    });
  }

};