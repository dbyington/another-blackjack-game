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
  this.cardsInPlay = 0;
  this.cardsInDiscard = 0;
  this.timeout = 3000;
  this.currentPlayer = undefined;
  this.playerSeats = {'seat1': undefined, 'seat2': undefined, 'seat3': undefined};
  this.decks = decks !== undefined ? decks : 1;

  this.shoeHeight = 150;
  this.cardWidth = 64;
  this.card = {
    '2C': { img: 'images/2c.gif', value: 2},
    '2S': { img: 'images/2s.gif', value: 2},
    '2D': { img: 'images/2d.gif', value: 2},
    '2H': { img: 'images/2h.gif', value: 2},
    '3C': { img: 'images/3c.gif', value: 3},
    '3S': { img: 'images/3s.gif', value: 3},
    '3D': { img: 'images/3d.gif', value: 3},
    '3H': { img: 'images/3h.gif', value: 3},
    '4C': { img: 'images/4c.gif', value: 4},
    '4S': { img: 'images/4s.gif', value: 4},
    '4D': { img: 'images/4d.gif', value: 4},
    '4H': { img: 'images/4h.gif', value: 4},
    '5C': { img: 'images/5c.gif', value: 5},
    '5S': { img: 'images/5s.gif', value: 5},
    '5D': { img: 'images/5d.gif', value: 5},
    '5H': { img: 'images/5h.gif', value: 5},
    '6C': { img: 'images/6c.gif', value: 6},
    '6S': { img: 'images/6s.gif', value: 6},
    '6D': { img: 'images/6d.gif', value: 6},
    '6H': { img: 'images/6h.gif', value: 6},
    '7C': { img: 'images/7c.gif', value: 7},
    '7S': { img: 'images/7s.gif', value: 7},
    '7D': { img: 'images/7d.gif', value: 7},
    '7H': { img: 'images/7h.gif', value: 7},
    '8C': { img: 'images/8c.gif', value: 8},
    '8S': { img: 'images/8s.gif', value: 8},
    '8D': { img: 'images/8d.gif', value: 8},
    '8H': { img: 'images/8h.gif', value: 8},
    '9C': { img: 'images/9c.gif', value: 9},
    '9S': { img: 'images/9s.gif', value: 9},
    '9D': { img: 'images/9d.gif', value: 9},
    '9H': { img: 'images/9h.gif', value: 9},
    'TC': { img: 'images/tc.gif', value: 10},
    'TS': { img: 'images/ts.gif', value: 10},
    'TD': { img: 'images/td.gif', value: 10},
    'TH': { img: 'images/th.gif', value: 10},
    'JC': { img: 'images/jc.gif', value: 10},
    'JS': { img: 'images/js.gif', value: 10},
    'JD': { img: 'images/jd.gif', value: 10},
    'JH': { img: 'images/jh.gif', value: 10},
    'QC': { img: 'images/qc.gif', value: 10},
    'QS': { img: 'images/qs.gif', value: 10},
    'QD': { img: 'images/qd.gif', value: 10},
    'QH': { img: 'images/qh.gif', value: 10},
    'KC': { img: 'images/kc.gif', value: 10},
    'KS': { img: 'images/ks.gif', value: 10},
    'KD': { img: 'images/kd.gif', value: 10},
    'KH': { img: 'images/kh.gif', value: 10},
    'AC': { img: 'images/ac.gif', value: 11},
    'AS': { img: 'images/as.gif', value: 11},
    'AD': { img: 'images/ad.gif', value: 11},
    'AH': { img: 'images/ah.gif', value: 11}
  }
  this.cardValues = function(card) {
    return self.card[card].value;
  }

  this.sumCards = function(pCard, cCard) {
    return pCard + cCard;
  }
  this.addCardToShoe = function(i) {
    $('#shoe').append('<div class="shoeCard" id="s'+i+'" style="margin-top: '+i*((self.shoeHeight-self.cardWidth)/self.cardsInShoe.length)+'px;"></div>');
  }
  this.fillShoe = function() {
    for (var i = 0; i < this.cardsInShoe.length; i++) {
      window.setTimeout(self.addCardToShoe, 200, i);

    }
  }

  this.shuffleCards = function() {
    $('#discard-pile').html('');
    $('#shoe').html('');
    this.cardsInDiscard = 0;
    this.cardsInShoe = '23456789TJQKA'.repeat(1 * this.decks).split('').map(function(c){return [c+'C', c+'S', c+'D', c+'H'];}).reduce(function(p,c){return p.concat(c);}).sort(function() {
      return 0.5 - Math.random();
    });
    this.fillShoe();
  }


  // Player object
  function Player(name, seat) {
    this.name = name !== undefined ? name : 'Player';
    this.playerId = self.players.length;
    this.cards = [];
    this.handValue = 0;
    //this.inPlay = false;
    this.playerSeat = seat != undefined ? seat : 'dealer';
    if (this.playerSeat !== 'dealer') {
      this.playerDiv = '<div id="' +this.name+ '" class="table-col"><span class="player-name  name">' +this.name+ '</span><div id="' +this.name+ '-cards" class="handCards table-row"> </div><div id="' +this.name+ '-value" class="value table-row"></div><div class="table-row playerButtons"><div id="' +this.name+ '-hit" class="hit button table-col" onclick="game.players['+this.playerId+'].hit();">Hit Me</div><div id="' +this.name+ '-stand" class="stand button table-col"  onclick="game.players['+this.playerId+'].stand();">Stand</div></div>  </div>';
      $('#'+seat).html(this.playerDiv);
      self.playerSeats[seat] = this;
    }
    this.toggleInPlay = function() {
      //this.inPlay = this.inPlay === false ? true : false;
      $('#'+this.name+' > .playerButtons').toggle();
      self.currentPlayer = this;
      if (this.playerSeat === 'dealer') {
        self.dealerFinishHand();
      }
    }
    this.stand = function () {
      console.log('stand:'+this.name);
      this.toggleInPlay();
      if (self.currentPlayer.name !== 'Dealer') {
        self.seatsInRound.next().value.toggleInPlay();
      } else {
        self.dealerFinishHand();
      }
    }
    this.newShoe = function() {
      self.shuffleCards();
      return self.cardsInShoe.shift();
    }
    this.zeroHands = function() {
      self.players.forEach(function(p) {p.handValue = 0;});
      self.dealer.handValue = 0;
    }
    this.checkHand = function() {
      this.hand();
      if (this.cards.length === 2 && this.handValue === 21) { //blackjack
        this.toggleInPlay();
        if (self.currentPlayer.name !== 'Dealer') self.seatsInRound.next().value.toggleInPlay();
        $('#hand-result').text(this.name+'BLACKJACK!');
        window.setTimeout(function() {
          $('#hand-result').text('');
        }, self.timeout);
      } else if (this.handValue > 21) { //busted
        this.toggleInPlay();
        if (self.currentPlayer.name !== 'Dealer') self.seatsInRound.next().value.toggleInPlay();
        $('#hand-result').text(this.name+' BUSTED!');
        window.setTimeout(function() {
          $('#hand-result').text('');
        }, self.timeout);
      }
    }
    this.hit = function() {
      if (self.handInPlay === false) return;
      if (this.handValue > 21) return;
      var card = self.cardsInShoe.length > 1 ? self.cardsInShoe.shift() : this.newShoe();
      this.cards.push(card);
      self.cardsInPlay++;
      this.hand();
      $('#shoe').children().last().remove();

      if (card !== undefined) {
        this.name !== 'Dealer' ? $('#'+this.name+'-cards').append('<img id="card'+self.cardsInPlay+'" class="card" src="'+self.card[card].img+'" style="margin-left: '+(this.cards.length-1)*15+'px"/>') :
        $('#dealer-hand').append('<img id="card'+self.cardsInPlay+'" class="card" src="'+self.card[card].img+'" style="margin-left: '+(this.cards.length-1)*15+'px"/>');
      }
      this.checkHand();
      //return card;
    }

    this.hand = function() {
      var softLimit = 22;
      var hand = this.cards.map(self.cardValues).reduce(self.sumCards);
      // Count the number of Aces and subtract 10 or each Ace to keep the hand under 21
      var aces = this.cards.filter(function(e) {
        return /^A/.test(e);
      });
      if (this !== self.dealer) {
        aces.forEach(function(){
          if (hand > 21) {
            hand = hand - 10;
          }
        });
      } else {
        if (hand > 21 && aces.length > 1) {
          hand = hand - 10;
        }
      }
      this.handValue = hand;
    }
    this.showHandValue = function() {
      value = this.hand();
      if (this.name === 'Dealer') {
        $('#dealer-value').text(value);
      } else {
        $('#'+this.name+'-value').text(value);
      }
    }
  } // Player


  this.deletePlayer = function(name){
    this.players = this.players.filter(function(e) {
      return e.name === name ? false : true;
    });
  }

  this.dealer = new Player('Dealer');


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
    if (name === '') return;
    return name;
  }

  this.newPlayer = function(seat) {
    if (this.handInPlay) {
      alert('Please wait for the current hand to finish playing before joining the game.');
      return;
    }
    var name = this.getName();
    if (name === null) return;
    this.players.push( new Player(name, seat));
  }


  this.discardCards = function() {
    this.dealer.zeroHands();
    this.players.forEach(function(p,i) {
      p.cards = [];
      $('#player'+i+'value').text('');
    });
    this.dealer.cards = [];
    $('dealer-value').text('');
    for (this.cardsInPlay; this.cardsInPlay > 0; this.cardsInPlay--) {
      var card = '#card'+this.cardsInPlay;
      $(card).remove();
      this.cardsInDiscard++;
      $('#discard-pile').append('<img class="card" src="images/b.jpg" style="margin-left: '+this.cardsInDiscard+'; margin-top: '+this.cardsInDiscard+'"/>');
      //$('#discard-pile').append('<div class="card" style="margin-left: '+this.cardsInDiscard+'; margin-top: '+this.cardsInDiscard+'"></div>');
    }

  }

  this.dealerFinishHand = function() {
    while (this.dealer.handValue < 17) {
      this.dealer.hit();
    }
    console.log('done with hand.');
  }
  this.makeSeatIterator = function() {
    var nextIndex = 0;
    var iterator = [];
    Object.keys(this.playerSeats).sort().forEach( function(seat) {
      console.log('seat is '+seat);
      console.log(self.playerSeats);
      if (self.playerSeats[seat] instanceof Object) {
        iterator.push(self.playerSeats[seat]);
      }
    });
    iterator.push(this.dealer);
    return iterator[Symbol.iterator]();
  }

  this.deal = function() {
    console.log(this.playerSeats);
    $('#hand-result').text('');
    if (this.players.length < 1) return;
    if (this.handInPlay = true) {
      this.discardCards();
    }
    for (var i = 0; i < 2; i++) {
      this.players.forEach(function(p) {p.hit();})
      this.dealer.hit();
    }
    this.handInPlay = true;
    this.seatsInRound = this.makeSeatIterator();
    this.seatsInRound.next().value.toggleInPlay();
    //this.currentPlayer = this.seatsInRound.next().value;
    //this.currentPlayer.toggleInPlay();
  }




}
