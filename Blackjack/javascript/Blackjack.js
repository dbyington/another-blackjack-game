/***

The game of Blackjack

***/

// Our main game object
function BlackJack (playerCount, decks) {
  var self = this;
  this.players = [];
  this.card = {
    '1C': { img: 'images/1c.gif', value: 1},
    '1S': { img: 'images/1s.gif', value: 1},
    '1D': { img: 'images/1d.gif', value: 1},
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
  function cardValues(card, type) {
    return type == 'soft' ? this.card[card].value : this.card[card].value === 11 ? 1 : this.card[card].value;
  /*
  switch (card[0]) {
    case 'A':
      return type === 'soft' ? 11 : 1;
      break;
    case 'J':
    case 'Q':
    case 'K':
      return 10;
      break;
    default:
      return parseInt(card);*/
  }


function sumCards (pCard, cCard) {
  console.log('sumCards');
  return pCard + cCard;
}
  this.dealerHitLimit = 18,
  this.cardsInShoe = [],
  this.decks = decks !== undefined ? decks : 1;
  this.deck = {

  }
  this.shuffleCards = function() {
    this.cardsInShoe = '123456789JQKA'.repeat(1 * this.decks).split('').map(function(c){return [c+'C', c+'S', c+'D', c+'H'];}).reduce(function(p,c){return p.concat(c);}).sort(function() {
      return 0.5 - Math.random();
    });
  }


  // Player object
  function Player(name) {
    this.name = name !== undefined ? name : 'Player';
    this.cards = [];
    this.newShoe = function() {
      self.shuffleCards();
      this.hit();
    }
    this.hit = function() {
      var card = self.cardsInShoe.length > 2 ? self.cardsInShoe.shift() : self.newShoe();
      this.cards.push(card);
    }

    this.hand = function() {
      var softLimit = this.name === 'dealer' ? 18 : 22
      var softHand = this.cards.map(self.cardValues,'soft').reduce(self.sumCards);
      var hardHand = this.cards.map(self.cardValues).reduce(self.sumCards);
      return softHand < softLimit ? softHand : hardHand;
    }
  }

  this.addPlayer = function(name){
    this.players.push(new this.Player(name));
  }

  this.deletePlayer = function(name){
    this.players = this.players.filter(function(e) {
      return e.name === name ? false : true;
    });
  }

  this.playerCount = playerCount !== undefined ? playerCount : 1;
  this.dealer = new this.Player('Dealer');
  for (var i = 0; i < this.playerCount; i++) {
    this.addPlayer('Player'+i);
  }




}
