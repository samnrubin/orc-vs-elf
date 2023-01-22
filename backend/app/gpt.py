import openai
# Base prompt info
base_prompt="Simulate battles between two characters in an arena\n\nCharacter 1: Orc barbarian. The orc carries a heavy battle axe and is slow moving but extremely strong. He can go into a powerful battle rage to do extra damage.\nCharacter 2: Elf rogue. The elf carries a longbow and a set of magical arrows. She is not very strong in direct combat but she is extremely maneuverable and stealthy.\n\nCurrent arena: Market st in San Francisco during morning rush hour. The street is crowded with pedestrians, buses, cars and streetcars. Everyone is doing their best to avoid and ignore the battle in their midst, with some doing better than others.\n\nEach move in the battle should incorporate the character's abilities, and take into account the business of fighting on a busy Market st."

initial_move="The orc and the elf face each other on opposite sides of the street. Pedestrians steadily flow around them, but their eyes remain locked to one another. The street rumbles as a full cable car passes by, full of commuters on their way to work. The barbarian lifts his axe and grimaces menacingly at the elf. The elf calmly strings an arrow from her quiver and readies herself for combat."



# Method for calling openAI

def send_prompt(prompt: str) -> str:
  response = openai.Completion.create(
    model="text-davinci-003",
    prompt=prompt,
    temperature=0.9,
    max_tokens=2000
  )
  return response.choices[0].text

# 
def generate_moves(attacker: bool, character: str, last_move: str = initial_move):
  while True:
    try:
      if attacker:
        attacker = "attacker"
      else:
        attacker = "defender"
      
      prompt = base_prompt + f"\n\nLast move: {last_move}"
      prompt += f"\n\nThe {character} is the current {attacker}. Generate three moves that the {character} could possibly take next. The generated moves should only describe actions by the {character}."

      if not attacker:
        prompt += f"The {character} is on the defense, so the generated moves should only include defensive actions and should not involve the {character} attacking."
      prompt += "\n\nMoves:\n1."
      output = send_prompt(prompt)

      moves = []
      lines = output.split("\n")

      moves.append(lines[0].strip())
      moves.append(lines[1].split("2.")[1].strip())
      moves.append(lines[2].split("3.")[1].strip())
      return moves
    except:
      print("Error, retrying")

# Evaluate move success given both moves

def evaluate_moves(attacker: str, elf_move: str, orc_move: str, last_move: str = initial_move):
  while True:
    try:
      attacker_move = ""
      defender_move = ""
      defender = ""
      if attacker == "elf":
        defender = "orc"
        attacker_move = elf_move
        defender_move = orc_move
      else:
        defender = "elf"
        attacker_move = orc_move
        defender_move = elf_move
      
      prompt = base_prompt + f"\n\nLast move: {last_move}"
      prompt += f"The {attacker} is the current attacker and the {defender} is the current defender\n\n"

      prompt += f"The {attacker}'s plan of attack:\n{attacker_move}\n\n"
      prompt += f"The {defender}'s plan of defense:\n{defender_move}\n\n"

      prompt += f"These are just hypothetical plans and the next move has not yet taken place. The results will be a synthesis of both moves. Do you think the {attacker}'s hypothetical attack will succeed? Respond with 'Yes.' or 'No.' followed by your well thought-out reasoning and analysis of the situation.\n\nResponse:"

      print(prompt)
      resp = send_prompt(prompt)
      # Extract 'Yes.' or 'No.' from response, then put it as a bool in a dict with the reasoning
      result = resp.split(".")[0]
      reasoning = ""

      if result == "Yes":
        result = True
        reasoning = resp.split("Yes.")[1].strip()
      elif result == "No":
        result = False
        reasoning = resp.split("No.")[1].strip()
      else:
        raise Exception("Invalid response")
      
      return {
        "result": result,
        "reasoning": reasoning
      }
    except Exception as e:
      print(e)
      print("Error, retrying")

def generate_next_move(attacker: str, elf_move: str, orc_move: str, result: bool, reasoning: str, last_move: str = initial_move):
  while True:
    try:
      attacker_move = ""
      defender_move = ""
      defender = ""
      if attacker == "elf":
        defender = "orc"
        attacker_move = elf_move
        defender_move = orc_move
      else:
        defender = "elf"
        attacker_move = orc_move
        defender_move = elf_move
      
      prompt = base_prompt + f"\n\nLast move: {last_move}"
      prompt += f"The {attacker} is the current attacker and the {defender} is the current defender\n\n"

      prompt += f"The {attacker}'s plan of attack:\n{attacker_move}\n\n"
      prompt += f"The {defender}'s plan of defense:\n{defender_move}\n\n"

      prompt += f"The {attacker}'s attack was {'successful' if result else 'unsuccessful'} because {reasoning}.\n\n"

      prompt += "Generate a new move for the battle. Be creative and flesh the move out using the character's skills and the Market st. environment.\n\nResponse:"

      print(prompt)
      resp = send_prompt(prompt)
      return resp.strip()


    except Exception as e:
      print(e)
      print("Error, retrying")

  


# Repeat!

# Test stuff