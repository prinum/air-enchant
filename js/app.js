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
    },
    PointArea: {
      w: 120,
      h: 50
    }
  };

  var game = new Game(Config.Window.w, Config.Window.h); // ゲーム本体を準備すると同時に、表示される領域の大きさを設定しています。
  game.fps = 24; // frames（フレーム）per（毎）second（秒）：ゲームの進行スピードを設定しています。
  game.preload(['../images/airplane.png', '../images/piron.png']); //gゲームに使う素材をあらかじめ読み込んでおきます。

  game.onload = function() { // ゲームの準備が整ったらメインの処理を実行します。
    game.rootScene.backgroundColor  = '#7ecef4'; // ゲームの動作部分の背景色を設定しています。
    var airplane = new Airplane();
    // var piron = new Piron();
    setInterval(function(){
      var pirons = new Pirons();
    }, 2000);
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
      
      this.speed = 0;

      var self = this;
      game.rootScene.addEventListener(Event.TOUCH_START, function(e) {
        if (e.x > self.x) {
          self.speed += 1;
        } else {
          self.speed -= 1;
        }
      });
    },
    onenterframe: function() {
        this.x += this.speed;
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
      
      self.image = game.assets['../images/' + spriteName + '.png'];
      self.x = Config.Window.w / 2 - (width / 2);
      game.rootScene.addChild(self);
    }
  });

  PointArea = enchant.Class.create(Sprite, {
    initialize: function() {
      Sprite.call(this, Config.PointArea.w, Config.PointArea.h);
      this.backgroundColor = '#000';
      this.x = (Config.Window.w / 2) - (Config.PointArea.w / 2);
      this.opacity = 0.5;
      var game = enchant.Game.instance;
      game.rootScene.addChild(this);
    }
  });

  Pirons = enchant.Class.create(Group, {
    initialize: function() {
      Group.call(this);
      var leftPiron = new Piron();
      leftPiron.x -= Config.PointArea.w / 2;
      this.addChild(leftPiron);

      var rightPiron = new Piron();
      rightPiron.x += Config.PointArea.w / 2;
      this.addChild(rightPiron);
      
      var pointArea = new PointArea();
      this.addChild(pointArea);

      function randomX() {
        return Math.random() * (Config.Window.w / 2) * randomPlusOrMinus();// TODO 調整
      }
      this.x = randomX();
      this.y = - Config.Sprite.piron.h;

      var game = enchant.Game.instance;
      game.rootScene.addChild(this);
    },
    onenterframe: function() {
      var speed = 5;
      this.y += speed;
      if (this.y > Config.Window.h) {
        var game = enchant.Game.instance;
        game.rootScene.removeChild(this);
      }
    }
  });

  function randomPlusOrMinus(){
    if (Math.random() > 0.5) {
      return 1;
    } else {
      return -1;
    }
  }
};
