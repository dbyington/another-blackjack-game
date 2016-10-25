/***

The game of Blackjack

***/

// Our main game object
function Blackjack (playerCount, decks) {
  var self = this;
  this.players = [];
  this.dealerHitLimit = 18;
  this.handInPlay = false;
  this.cardsInShoe = [];
  this.cardsInPlay = [];
  this.cardsInDiscard = [];
  this.timeout = 3000;
  this.currentPlayer = undefined;
  this.playerSeats = {'seat1': undefined, 'seat2': undefined, 'seat3': undefined};
  this.decks = decks !== undefined ? decks : 1;
  this.shoeHeight = 150;
  this.cardWidth = 64;


  this.cardValues = function(card) {
    switch (card[0]) {
      case 'A':
        return 11;
        break;
      case 'T':
      case 'J':
      case 'Q':
      case 'K':
        return 10;
        break;
      default:
        return parseInt(card[0]);
      }
  }

  this.sumCards = function(pCard, cCard) {
    return pCard + cCard;
  }
  this.addCardToShoe = function(i) {
    $('#shoe').append('<div class="shoeCard" id="s'+i+'" style="margin-top: '+i*((self.shoeHeight-self.cardWidth)/self.cardsInShoe.length)+'px;"></div>');
  }
  this.fillShoe = function() {
    for (var i = 0; i < this.cardsInShoe.length; i++) {
      self.addCardToShoe(i);
    }
  }

  this.shuffleCards = function() {
    $('#discard-pile').html('');
    $('#shoe').html('');
    if (this.cardsInDiscard.length === 0) {
      this.cardsInDiscard = [];
      this.cardsInShoe = '23456789TJQKA'.repeat(1 * this.decks).split('').map(function(c){return [c+'C', c+'S', c+'D', c+'H'];}).reduce(function(p,c){return p.concat(c);}).sort(function() {
      return 0.5 - Math.random();
      });
    } else {
      this.cardsInShoe = this.cardsInShoe.concat(this.cardsInDiscard.sort(function() {return 0.5 - Math.random();}));
      this.cardsInDiscard = [];
    }
    this.fillShoe();
  }


  this.newShoe = function() {
    self.shuffleCards();
    return self.cardsInShoe.shift();
  }


  this.emptyHands = function() {
    self.players.forEach(function(p) {
      p.cards = [];
      p.handValue = 0;
    });
    this.dealer.cards = [];
    self.dealer.handValue = 0;
  }


  // Player object
  function Player(name, seat) {
    if (name === undefined) return;
    this.name = name;
    this.playerId = self.players.length;
    this.cards = [];
    this.playerSeat = seat != undefined ? seat : 'dealer';
    if (this.playerSeat !== 'dealer') {
      this.playerDiv = '<div id="' +this.name+ '" class="table-col"><span class="player-name">' +this.name+ '</span><div id="' +this.name+ '-cards" class="handCards table-row"> </div><div id="' +this.name+ '-value" class="value table-row"></div><div class="table-row playerButtons"><div id="' +this.name+ '-hit" class="hit button table-col" onclick="blackjackTable.players['+this.playerId+'].hitMe();">Hit Me</div><div id="' +this.name+ '-stand" class="stand button table-col"  onclick="blackjackTable.players['+this.playerId+'].stand();">Stand</div></div>  </div>';
      $('#'+seat).html(this.playerDiv);
      self.playerSeats[seat] = this;
    }


    this.toggleInPlay = function() {
      this.toggleButtons();
      self.currentPlayer = this;
      if (this.playerSeat === 'dealer') {
        self.finishDealerHand();
      }
    }


    this.stand = function () {
      this.toggleInPlay();
      if (self.currentPlayer !== self.dealer) {
        self.seatsInRound.next().value.toggleInPlay();
      } else {
        self.dealerFinishHand();
      }
    }

    this.isBlackjack = function() {
      return (this.cards.length === 2 && this.handValue === 21);
    }


    this.stillInPlay = function() {
      this.getHandValue();
      if ( this.isBlackjack() ) { //blackjack
        $('#'+this.name+'-value').text('BLACKJACK!');
        if (this == self.dealer) {
          $('#dealer-value').text('BLACKJACK!');
        }
        return false;
      } else if (this.handValue > 21) { //busted
        $('#'+this.name+'-value').text('BUSTED!');
        return false;
      }
      return true;
    }


    this.hit = function() {
      if (self.handInPlay === false) return;
      if (this.handValue > 21) return;
      var card = self.cardsInShoe.length > 1 ? self.cardsInShoe.shift() : self.newShoe();
      this.cards.push(card);
      self.cardsInPlay.push(card);
      this.getHandValue();
      $('#shoe').children().last().remove();

      if (card !== undefined) {
        cardImage = 'images/'+card.toLowerCase()+'.gif';
        if (this.name !== 'Dealer') {

           $('#'+this.name+'-cards').append('<img id="'+card+'" class="card" src="'+cardImage+'" style="margin-left: '+(this.cards.length-1)*15+'px"/>');
         } else {
           if (self.dealer.cards.length < 2) {
             $('#dealer-hand').append('<img id="'+card+'" class="card" src="images/b.jpg" style="margin-left: '+(this.cards.length-1)*15+'px"/>');
           } else {
             $('#dealer-hand').append('<img id="'+card+'" class="card" src="'+cardImage+'" style="margin-left: '+(this.cards.length-1)*15+'px"/>');
           }
         }
      }
      return this.stillInPlay();
    }


    this.hitMe = function() {
      if ( ! this.hit() ) {
        this.toggleInPlay();
        self.seatsInRound.next().value.toggleInPlay();
      }
    }


    this.getHandValue = function() {
      var softLimit = 22;
      if (this.cards.length === 0) {
        this.handValue = 0;
        return;
      }
      var hand = this.cards.map(self.cardValues).reduce(self.sumCards);
      // Count the number of Aces and subtract 10 or each Ace to keep the hand under 21
      var aces = this.cards.filter(function(e) {
        return /^A/.test(e);
      });
      aces.forEach(function(){
        if (hand > 21) {
          hand = hand - 10;
        }
      });
      this.handValue = hand;
    }

    this.toggleButtons = function() {
      $('#'+this.name+' > .playerButtons').toggle();
    }

    this.toggleButtonsOff = function() {
      $('#'+this.name+' > .playerButtons').hide();
    }

  } // Player
  // create the dealer who is technically a player
  this.dealer = new Player('Dealer');


  this.disableAllButtons = function() {
    this.players.forEach(function(p) {
      p.toggleButtonsOff();
    });
  }


  this.getName = function(calledBefore) {
    var name;
    if (calledBefore) {
      name = prompt('Sorry, that name has been taken. Please choose another name.')
    } else {
      name = prompt('Greetings, what is your name?');
    }
    if (this.players.find(function(p){return p.name === name}) !== undefined) {
      name = this.getName(true)
    }
    name = name.match(/[\w*]/g);
    if (name !== null) return name.join('').slice(0,8);
  }


  this.newPlayer = function(seat) {
    if (this.handInPlay) {
      alert('Please wait for the current hand to finish playing before joining the game.');
      return;
    }
    var name = this.getName();
    if (name === null || name === undefined || name === '') return;
    this.players.push( new Player(name, seat));
  }


  this.randomDiscard = function() {
    var top = Math.floor(Math.random() * 51);
    var left = Math.floor(Math.random() * (151-64));
    return '<img class="card discard-card" src="images/b.jpg" style="margin-left: '+left+'px; margin-top: '+top+'px"/>'
  }


  this.discardCards = function() {
    this.emptyHands();
    this.cardsInDiscard = this.cardsInDiscard.concat(self.cardsInPlay);
    this.cardsInPlay.forEach(function(c) {
      $('#'+c).remove();
      $('#discard-pile').append(self.randomDiscard());
    })
    this.cardsInPlay = [];
  }


  this.playerStatus = function(player) {
    var result = '';
    if (player.handValue > 21) {
      result = 'BUSTED!';
    } else if (player.isBlackjack()) {
      if (self.dealer.isBlackjack() ) {
        result = 'Push';
      } else {
        result = 'BLACKJACK!';
      }
    } else if (self.dealer.handValue > 21) {
        result = 'Winner!';
    } else if (player.handValue === self.dealer.handValue) {
      result = 'Push';
    } else if (player.handValue < self.dealer.handValue) {
      result = 'Dealer won';
    } else {
      result = 'Winner!';
    }
    $('#'+player.name+'-value').text(result);
  }


  this.dealerStatus = function() {
    var result = '';
    if (this.dealer.isBlackjack()) {
      var playerBlackjacks = this.players.find(function(p){
          return p.handValue === 21 && p.cards.length === 2});
      if (playerBlackjacks === undefined) {
        result = 'BLACKJACK!';
      }
    } else if (this.dealer.handValue > 21) {
      result = 'BUSTED!';
    }
    $('#dealer-value').text(result);
  }


  this.finishPlayerHands = function() {
    this.disableAllButtons();
    this.players.forEach(self.playerStatus);
    this.dealerStatus();
  }

  this.finishDealerHand = function() {
    this.disableAllButtons();
    $('#dealer-hand > img').first().attr('src','images/'+this.dealer.cards[0].toLowerCase()+'.gif');
    while (this.dealer.handValue < 17) {
      this.dealer.hit();
    }
    this.handInPlay = false;
    this.finishPlayerHands();
  }


  this.makeSeatIterator = function() {
    var nextIndex = 0;
    var iterator = [];
    Object.keys(this.playerSeats).sort().forEach( function(seat) {
      if (self.playerSeats[seat] instanceof Object) {
        if (self.playerSeats[seat].stillInPlay()) {
          iterator.push(self.playerSeats[seat]);
        }
      }
    });
    iterator.push(this.dealer);
    return iterator[Symbol.iterator]();
  }


  this.clearAll = function() {
    this.players.forEach(function(p) {
      $('#'+p.name+'-value').text('');
    })
    $('#dealer-value').text('');
    $('#hand-result').text('');
  }


  this.deal = function() {
    this.clearAll();
    this.disableAllButtons();
    if (this.players.length < 1) {
      $('#hand-result').text('No players to deal to. Add a player.');
      return;
    };
    if (this.handInPlay = true) {
      this.discardCards();
    }
    this.handInPlay = true;

    for (var i = 0; i < 2; i++) {
      this.players.forEach(function(p) {p.hit();})
      this.dealer.hit();
    }
    if ( this.dealer.stillInPlay() ) {
      this.seatsInRound = this.makeSeatIterator();
      this.seatsInRound.next().value.toggleInPlay();
      this.currentPlayer.stillInPlay();
    } else {
      this.finishDealerHand();
    }

  }

}
