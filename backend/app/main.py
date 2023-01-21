from fastapi import FastAPI
from enum import Enum
import random

app = FastAPI()

defense_moves = [
    "Parry",
    "Block",
    "Riposte",
    "Disarm",
    "Feint",
    "Redoublement",
    "Cutover",
    "Half-swording",
    "Bind",
    "Counter-attack"
]

attack_moves = [
    "Thrust",
    "Slash",
    "Lunge",
    "Chop",
    "Cut",
    "Flick",
    "Sweep",
    "Hack",
    "Stab",
    "Overhead strike"
]


class Action(Enum):
    ONE = 0
    TWO = 1
    THREE = 2

class Player():
    def __init__(self, name, health):
        self.name = name
        self.health = health
        self.available_actions = []
        self.taken_action = None

    def take_action(self, action: Action):
        self.taken_action = action


class TurnStatus(Enum):
    IN_PROGRESS = "in progress"
    END = "end"

class Turn():
    def __init__(self):
        self.status = TurnStatus.IN_PROGRESS
        self.reason = ""
        self.outcome = ""

    def end(self, reason, outcome):
        self.status = TurnStatus.END
        self.reason = reason
        self.outcome = outcome

class GameStatus(Enum):
    IN_PROGRESS = "in progress"
    PLAYER1WON = "player1 won"
    PLAYER2WON = "player2 won"
    DRAW = "draw"

class Game:
    def __init__(self, player1: Player, player2: Player):
        self.player1 = player1
        self.player2 = player2
        self.player1attack = True
        self.turn_num = 0
        self.turn = Turn()
        self.game_status = GameStatus.IN_PROGRESS

    def next_turn(self):
        if self.player1.took_action and self.player2.took_action:
            self.player1.took_action = False
            self.player2.took_action = False
            self.player1.available_actions = []
            self.player2.available_actions = []
            self.player1attack = not self.player1attack
            self.turn_num += 1
            self.turn = Turn()
            if self.player1.health <= 0 and self.player2.health <= 0:
                self.game_status = GameStatus.DRAW
            if self.player1.health <= 0:
                self.game_status = GameStatus.PLAYER2WON
            if self.player2.health <= 0:
                self.game_status = GameStatus.PLAYER1WON
    

game = Game(Player("elf", 3), Player("orc", 3))

@app.post("/new_game")
async def new_game():
    game = Game(Player("elf", 3), Player("orc", 3))


@app.post("/take_action")
async def take_action(data: dict):
    action = data["action"]
    player = data["player"]
    if action < 0 and action > 2:
        return {"error": "invalid action"}
    if player == game.player1.name:
        if game.player1.taken_action:
            return {"error": f"player {player} already took action"}
        game.player1.take_action(Action(action))
    elif player == game.player2.name:
        if game.player2.taken_action:
            return {"error": f"player {player} already took action"}
        game.player2.take_action(Action(action))
    else:
        return {"error": f"player not found, available players {game.player1.name}, {game.player2.name}"}
    

@app.get("/game_state")
async def game_state():
    if not game.player1.taken_action and not game.player1.available_actions:
        if game.player1attack:
            game.player1.available_actions = random.sample(attack_moves, 3)
        else:
            game.player1.available_actions = random.sample(defense_moves, 3)
    if not game.player2.taken_action and not game.player2.available_actions:
        if game.player1attack:
            game.player2.available_actions = random.sample(defense_moves, 3)
        else:
            game.player2.available_actions = random.sample(attack_moves, 3)
    if game.player1.taken_action and game.player2.taken_action:
        game.turn.end("both players took action", "outcome")
    return game.__dict__
