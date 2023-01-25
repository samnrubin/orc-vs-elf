from fastapi import FastAPI
from gpt import generate_moves, evaluate_moves, generate_next_move
from enum import Enum
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

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
        print(self.__dict__)
        self.taken_action = action



class GameStatus():
    IN_PROGRESS = "in progress"
    PLAYER1WON = "player1 won"
    PLAYER2WON = "player2 won"
    DRAW = "draw"

class Game:
    def __init__(self, player1name, player2name):
        self.player1attack = False
        self.player1 = Player(player1name, 3)
        self.player2 = Player(player2name, 3)
        self.turn_num = 0
        self.game_status = GameStatus.IN_PROGRESS
        self.last_move = None
        self.result = None
        self.reasoning = None
        self.player1.available_actions = generate_moves(True, player1name)
        self.player2.available_actions = generate_moves(False, player2name)

    def next_turn(self):
        print(self.__dict__)
        if self.player1.taken_action and self.player2.taken_action:
            last_player1_move = self.player1.available_actions[self.player1.taken_action.value]
            last_player2_move = self.player2.available_actions[self.player2.taken_action.value]
            self.current_turn_result(last_player1_move, last_player2_move)
            self.turn_num += 1
            if self.player1.health <= 0 and self.player2.health <= 0:
                self.game_status = GameStatus.DRAW
            if self.player1.health <= 0:
                self.game_status = GameStatus.PLAYER2WON
            if self.player2.health <= 0:
                self.game_status = GameStatus.PLAYER1WON
            self.player1attack = not self.player1attack
            self.player1.available_actions = generate_moves(self.player1attack, self.player1.name, last_player1_move)
            self.player2.available_actions = generate_moves(not self.player1attack, self.player2.name, last_player2_move)
            self.player1.taken_action = None
            self.player2.taken_action = None

    def current_turn_result(self, player1move, player2move):
        attacker = self.player1.name if self.player1attack else self.player2.name
        print(f"evaluating moves:\n attacker - {attacker}\n elfmove - {player1move}\n orcmove - {player2move}\n")
        moves_eval = evaluate_moves(attacker, player1move, player2move, self.last_move)
        self.result = moves_eval["result"]
        self.reasoning = moves_eval["reasoning"]
        print(f"evaluating next move:\n attacker - {attacker}\n elfmove - {player1move}\n orcmove - {player2move}\n result - {self.result}\n reasoning - {self.reasoning}\n")
        self.update_health(attacker, self.result)
        self.last_move = generate_next_move(attacker, player1move, player2move, self.result, self.reasoning, self.last_move)

    def update_health(self, attacker, success):
        if attacker == self.player1.name and success:
            self.player2.health -= 1
        elif attacker == self.player2.name and success:
            self.player1.health -= 1

game = Game("elf", "orc")
players = []

@app.get("/player")
async def player():
    if "elf" not in players:
        players.append("elf")
        return {"name": "elf"}
    else:
        players.append("orc")
        return {"name": "orc"}

@app.post("/new_game")
async def new_game():
    game = Game("elf", "orc")


@app.post("/take_action")
async def take_action(data: dict):
    print(data)
    action = data["action"]
    player = data["player"]
    
    if player == "elf":
        game.player1.take_action(Action(action))
    elif player == "orc":
        game.player2.take_action(Action(action))
    if game.player1.taken_action and game.player2.taken_action:
        game.next_turn()



@app.get("/game_state")
async def game_state():
    return game.__dict__
