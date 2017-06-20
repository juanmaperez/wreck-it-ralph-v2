function Game(options){
  this.points = 0;
  this.timeLeft = 120;

  this.ralph = options.ralph;
  this.building = options.building;
  this.fixer = options.fixer;

  this.timeByMove = 700;



  this.loadGame = function(){
    this.building.createBuilding();
    this.printBuilding();
    this.assignControlsToKeys();

    this.createRalphSpace();

  };


/*================ Funciones de actualización =================*/


  this.updateBuilding = function(){
      this.printBuilding();
      this.printPoints();
  };


  this.updateRalph = function(){

    if(this.building.windowsInColumn(this.ralph.column)){
      this.printRalphWrecking();
      var window = this.building.selectWindow(this.ralph.column);

      if(window.health){
          window.receiveDamage();
      }else{
          this.updateRalph();
      }

    }

    var self = this;
    setTimeout(function(){
      self.printRalph();
    },400);

  };

/*================ Funciones de puntuación =================*/

this.assignPoints = function(){
  this.points = (this.building.calculatePoints()-15)*100;
};

this.printPoints = function(){
  this.assignPoints();
  $('.points').html(this.points);
};


/*================ Funciones de tiempo =================*/
this.discountTime = function(){
  this.timeLeft--;
};

this.printTime = function(){
  this.discountTime();
  $('.seconds').html(this.timeLeft);

};

/*================ Funciones de ralph =================*/

  this.createRalphSpace = function(){
    var ralphSpace = "";
    for(i = 0; i < 5; i++){
      ralphSpace += '<div class="ralphbox" data-column="' + i + '"></div>';
    }
    $('.ralphspace').prepend(ralphSpace);
  };



  this.printRalph = function(){
    var self = this;
    self.ralph.moveRalph();

    $('.ralphbox').each(function(){
      $(this).removeClass("ralph");
      $(this).removeClass("ralph-wrecking");
      if($(this).attr("data-column") == self.ralph.column){

        $(this).addClass("ralph");
      }
    });
  };

  this.printRalphWrecking = function(){
    var self = this;
    $('.ralphbox').each(function(){
      $(this).removeClass("ralph");
      $(this).removeClass("ralph-wrecking");
      if($(this).attr("data-column") == self.ralph.column){

        $(this).addClass("ralph-wrecking");
        //new buzz.sound("assets/sounds/crash.wav").setVolume(3).play();
        //new buzz.sound("assets/sounds/glass-break.wav").setVolume(20).play();

      }
    });
  };


/*================ Funciones del Fixer =================*/


  this.printFixer = function(){
    $('.fixer').remove();
    //console.log(this.building.selectWindow(this.fixer.column, this.fixer.row));
    this.building.selectWindow(this.fixer.column, this.fixer.row).addFixer();
    $('div[data-fix="in"]').append('<div class="fixer nofixing"></div>');
  };


  this.assignControlsToKeys = function(){
    $('body').on('keydown', function(e) {
      switch (e.keyCode) {
        case 87: // arrow up
          this.fixer.goUp();
          this.printFixer();
          this.fixer.walking_right();
          break;

        case 83: // arrow down
          this.fixer.goDown();
          this.printFixer();
          this.fixer.walking_right();
          break;

        case 65: // arrow left
          this.fixer.goLeft();
          this.printFixer();
          this.fixer.walking_left();
          break;

        case 68: // arrow right
          this.fixer.goRight();
          this.printFixer();
          this.fixer.walking_right();
          break;

        case 70:
          this.building.selectWindow(this.fixer.column, this.fixer.row).receiveHealth();
          this.fixer.fixing();
         break;

       case 80:
       if(this.intervalTime && this.intervalBuilding && this.intervalRalph){
         this.stop();
       }else{
         this.startGame();
       }
        break;

      }
    }.bind(this));
  };


/*================ Funciones del building =================*/


  this.printBuilding = function(){
    $('.building').empty();
    var buildingBody = "";
    for(i = 0; i < this.building.windows.length; i++){
      if(this.building.windows[i].row != this.fixer.row || this.building.windows[i].column != this.fixer.column){
        this.building.windows[i].removeFixer();
      }
      buildingBody += '<div class ="window" data-state="'+ this.building.windows[i].health +'" data-row="'+ this.building.windows[i].row +'" data-column="'+ this.building.windows[i].column +'" data-fix="'+ this.building.windows[i].isFixer +'"></div>';
    }
    $('.building').prepend(buildingBody);
    this.printFixer();

  };


/*================ Funciones de intervalos =================*/


  this.stop = function (){
      clearInterval(this.intervalTime);
      clearInterval(this.intervalBuilding);
      clearInterval(this.intervalRalph);

      this.intervalTime = undefined;
      this.intervalBuilding = undefined;
      this.intervalRalph = undefined;
  };

  this.startGame = function(){
    this.intervalTime = setInterval(function(){
      var self = this;
      if(self.timeLeft > 0 && this.points > 0){
        self.printTime();
      }else{
        self.stop();
        if(this.points <= 0){
          $('.gameover').css("display", "block");
        }else{
          $('.youwin').css("display", "block");
        }
      }
    }.bind(this),1000);

    this.intervalBuilding = setInterval(function(){
      var self = this;
      self.updateBuilding();
    }.bind(this),60);

    this.intervalRalph = setInterval(function(){
      var self = this;
      self.updateRalph(this.timeByMove);
    }.bind(this),this.timeByMove);
  };

}

$(document).ready(function(){
  options = {
    ralph: new Ralph(),
    building: new Building(),
    fixer : new Fixer(),
  };

  game = new Game(options);
  game.loadGame();

  setTimeout(function(){
    game.startGame();
  },3000);

});
