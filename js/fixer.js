function Fixer(){
  this.row = Math.floor(Math.random()*5);
  this.column = Math.floor(Math.random()*5);
  this.life = 3;
  this.blocked = false;

  this.goUp = function(){
    if(this.row > 0){
      this.row--;
    }
  };

  this.goDown = function(){
    if(this.row < 3){
      this.row++;
    }
  };

  this.goLeft = function(){
    if(this.column > 0){
      this.column--;

    }
  };

  this.goRight = function(){
    if(this.column < 4){
      this.column++;
    }
  };

this.lessOpacity = function(){
  console.log("transparente");
  $('.fixer').toggleClass("lessopacity");
}

  this.fixing = function(){
      $('.fixer').toggleClass("nofixing");
      $('.fixer').toggleClass("fixing");
  };

  this.walking_right = function(){
    $('.fixer').toggleClass("nofixing");
    $('.fixer').toggleClass("walking_right");
  };

  this.walking_left = function(){
      $('.fixer').toggleClass("nofixing");
      $('.fixer').toggleClass("walking_left");
  };

  this.receiveDamage = function(){
    var self = this;
     var opacity = setInterval(function(){
        self.lessOpacity()
      },100);
   
    self.life--;
    new buzz.sound("assets/sounds/destroy.wav").setVolume(10).play();

    self.blocked = true;

    setTimeout(function(){
      clearInterval(opacity);
      self.blocked = false;
    },2000);
  }

}
