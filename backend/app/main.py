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



class GameStatus():
    IN_PROGRESS = "in progress"
    PLAYER1WON = "player1 won"
    PLAYER2WON = "player2 won"
    DRAW = "draw"

class Game:
    def __init__(self, player1name, player2name):
        self.player1attack = True
        self.player1 = Player(player1name, 3)
        self.player2 = Player(player2name, 3)
        self.turn_num = 0
        self.game_status = GameStatus.IN_PROGRESS
        self.description = ""
        self.outcome = ""
        self.reason = ""
        self.player1.available_actions = get_actions(player1name, True)
        self.player2.available_actions = get_actions(player2name, False)

    def next_turn(self):
        if self.player1.taken_action and self.player2.taken_action:
            self.current_turn_result()
            self.player1.taken_action = None
            self.player2.taken_action = None
            self.turn_num += 1
            self.description = "new desc"
            self.outcome = "new outcome"
            self.reason = "new reason"
            if self.player1.health <= 0 and self.player2.health <= 0:
                self.game_status = GameStatus.DRAW
            if self.player1.health <= 0:
                self.game_status = GameStatus.PLAYER2WON
            if self.player2.health <= 0:
                self.game_status = GameStatus.PLAYER1WON
            self.player1attack = not self.player1attack
            self.player1.available_actions = get_actions(self.player1.name, self.player1attack)
            self.player2.available_actions = get_actions(self.player2.name, not self.player1attack)

    def current_turn_result(self):
        # send taken action by both player to the prompt and get back description, outcome and reason
        pass


def get_actions(player, is_attack):
    if is_attack:
        return random.sample(attack_moves, 3)
    else:
        return random.sample(defense_moves, 3)

game = Game("elf", "orc")

@app.post("/new_game")
async def new_game():
    game = Game("elf", "orc")


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
    if game.player1.taken_action and game.player2.taken_action:
        game.next_turn()



@app.get("/game_state")
async def game_state():
    return game.__dict__
