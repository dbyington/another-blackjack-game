# Blackjack code assignment game

### Written by Don Byington for [Codeworks](https://codeworks.me/) coding assignment
Hosted in a private Bitbucket repo: [Blackjack](https://bitbucket.org/d_byington/codeworks/src/b35aa0fab84966737f62ebe9b9bdeb6d8780df62/Blackjack/?at=master)
(contact [Don Byington](donby@blacknblue.com) for a repo invite)

### Three seat (player) game of Blackjack

#### Players
Players can enter the game anytime a hand is not currently in play. Currently to leave the game just refresh the page.

#### Dealing
Once players have joined the game the Dealer deals clockwise starting with the player to Dealer's left. Each player is dealt a single card, then the dealer gets one card which is placed face down. Then each player gets a second card including the dealer who's second card is face up.

#### Play
Players take turns "hitting" or "standing" beginning with the payer to the Dealer's left then going clockwise around the table. If a player gets a "blackjack" that player will be skipped. If the dealer gets a "blackjack" the hand is over and any players that got "blackjack" will be a "push".

#### Winning
A player wins when either they have a "blackjack", a hand value greater than the Dealer, or if the Dealer "busts", without the player having "busted."

#### Card Values
Numeric cards are considered the value on the card. Face cards (Jack, Queen, King) all have a value of 10. Aces are automatically demoted from soft (value of 11) to hard (value of 1) if the total hand value would be over 21 with a soft ace. If a hand has multiple aces only the number of aces needed will be demoted to hard to bring the hand total to 21 or less.

#### Definitions
- "blackjack" or "21"
 - When a player receives an Ace(11) and a 10 or Face card to achieve a hand total of 21 with only two cards.
- "bust" or "busted"
 - When a player's hand reaches a total value over 21.
- "hit" or "hitting"
  - When a player requests and additional card.
- "push"
 - When a player and the Dealer end with the same hand value, neither player "wins."
- "stand"
 - When a player passes on receiving any further cards.

### Known issues/bugs
- Does not work in IE.
