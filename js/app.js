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
  
  game.minScrollSpeed = 5;
  game.scrollSpeed = game.minScrollSpeed;
  
  game.MaxPirons = 10;
  game.pironsCount = 0;

  game.time = 0;

  game.onload = function() { // ゲームの準備が整ったらメインの処理を実行します。
    game.rootScene.backgroundColor  = '#7ecef4'; // ゲームの動作部分の背景色を設定しています。

    var speedLabel = new Label();
    speedLabel.y += 15;
    game.rootScene.addChild(speedLabel);
    game.updateScrollSpeed = function(deltaSpeed) {
      if (this.scrollSpeed + deltaSpeed >= this.minScrollSpeed ) {
        this.scrollSpeed += deltaSpeed;
      }
      speedLabel.text = 'speed: ' + game.scrollSpeed;
    };
    game.updateScrollSpeed(0);

    var timeLabel = new Label();
    timeLabel.y += 30;
    game.rootScene.addChild(timeLabel);
    game.updateTimeLabel = function(deltaTime) {
      game.time += deltaTime;
      timeLabel.text = 'time: ' + game.time;
    };
    game.updateTimeLabel(0);
    
    var timer = setInterval(function (){
      game.updateTimeLabel(1);
    }, 1000);

    var airplane = new Airplane();
    setInterval(function(){
      if (game.pironsCount >= game.MaxPirons) {
        clearInterval(timer);
        return;
      }
      var pirons = new Pirons(airplane);
      game.pironsCount += 1;
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
          self.speed += 2;
        } else {
          self.speed -= 2;
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
      var width = Config.PointArea.w - Config.Sprite.piron.w;
      Sprite.call(this, width, Config.PointArea.h);
      this.backgroundColor = '#000';
      this.x = (Config.Window.w / 2) - (Config.PointArea.w / 2) + (Config.Sprite.piron.w / 2);
      this.opacity = 0.5;
      var game = enchant.Game.instance;
      game.rootScene.addChild(this);
    }
  });

  Pirons = enchant.Class.create(Group, {
    initialize: function(airplane) {
      Group.call(this);
      this.airplane = airplane;
      
      this.leftPiron = new Piron();
      this.leftPiron.x -= Config.PointArea.w / 2;
      this.addChild(this.leftPiron);

      this.rightPiron = new Piron();
      this.rightPiron.x += Config.PointArea.w / 2;
      this.addChild(this.rightPiron);
      
      this.pointArea = new PointArea();
      this.addChild(this.pointArea);

      this.scorable = true;
      this.subtractable = true;
      this.game = enchant.Game.instance;

      function randomX() {
        return Math.random() * (Config.Window.w / 2) * randomPlusOrMinus();// TODO 調整
      }
      this.x = randomX();
      this.y = - Config.Sprite.piron.h;

      this.game.rootScene.addChild(this);
    },
    onenterframe: function() {
      this.y += this.game.scrollSpeed;
      if (this.y > Config.Window.h) {
        this.game.rootScene.removeChild(this);
      }

      if(this.scorable && this.pointArea.intersect(this.airplane)) {
        this.scorable = false;
        game.updateScrollSpeed(1);
      }

      var self = this;
      var hitPiron = function() {
        game.updateTimeLabel(6);
        self.subtractable = false;
        self.scorable = false;
        game.updateScrollSpeed(-1);
      };

      if(this.subtractable && this.leftPiron.intersect(this.airplane)) {
        hitPiron();
      }

      if(this.subtractable && this.rightPiron.intersect(this.airplane)) {
        hitPiron();
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
