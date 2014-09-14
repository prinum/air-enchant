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
    var airplane = new Airplane();
    var piron = new Piron();
  }

  game.start();

  Airplane = enchant.Class.create(Sprite, {
    initialize: function() {
      var spriteName = 'airplane';
      var self = this;
      var game = enchant.Game.instance;
      var width = Config.Sprite[spriteName].w;
      var height = Config.Sprite[spriteName].h;
      Sprite.call(self, width, height);
      self.image = game.assets['../images/' + spriteName + '.png']; // あらかじめロードしておいた画像を適用します。
      self.x = (Config.Window.w / 2) - (width / 2);
      self.y = Config.Window.h - height;
      game.rootScene.addChild(self); // ゲームのシーンにくまを表示させます。
      
      var speed = 0;
      self.addEventListener(Event.ENTER_FRAME, function() {
        self.x += speed; // 毎フレーム、くまの座標をspeed分ずらす
      });

      game.rootScene.addEventListener(Event.TOUCH_START, function(e) {
        if (e.x > self.x) { // if (もしも) タッチした横位置が、くまの横位置よりも右側（座標の値として大きい）だったら
          speed += 1;
        } else {
          speed -= 1;
        }
      });
    }
  });

  Piron = enchant.Class.create(Sprite, {
    initialize: function() {
      var spriteName = 'piron';
      var self = this;
      var width = Config.Sprite[spriteName].w;
      var height = Config.Sprite[spriteName].h;
      var game = enchant.Game.instance;
      Sprite.call(self, width, height);
      self.image = game.assets['../images/' + spriteName + '.png']; // あらかじめロードしておいた画像を適用します。
      self.x = Config.Window.w / 2 - (width / 2);
      var initialY = 0;
      self.y = initialY;

      var speed = 5;

      game.rootScene.addChild(self); // ゲームのシーンにくまを表示させます。
      game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
        self.y += speed; // 毎フレーム、くまの座標をspeed分ずらす
        if (self.y > Config.Window.h) {
          self.y = initialY;
        }
      });
    }
  });
};