import './App.css';
import {
  Flex,
  Box,
  HStack,
  Text,
  VStack,
  Heading,
  Divider
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';

const url = "http://localhost:8000/"

function App() {
  // States are "choose" for choosing a move, "display" for displaying the moves, and "end" for the end of the game
  const [state, setState] = useState("choose");
  const [gameState, setGameState] = useState(null);
  const [player, setPlayer] = useState("");
  const [turn, setTurn] = useState(-1);
  const [attacker, setAttacker] = useState("Orc");
  const [elfHealth, setElfHealth] = useState(3);
  const [orcHealth, setOrcHealth] = useState(3);

  let timer;

  async function submitMove(moveChoice, name) {
    console.log(name)
    await fetch(url + "take_action", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({action: moveChoice, player: name})
    })
  }

  const fetchState = async () => {
    timer = !timer && setInterval(async () => {
      const response = await fetch(url + "game_state")
      const data = await response.json()
      if (data.turn_num !== turn) {
        setTurn(data.turn_num)
        if (data.turn_num === 0) {
          setState("choose")
        }
        else {
          setState("display")
        }
        setElfHealth(data.player1.health)
        setOrcHealth(data.player2.health)
        setGameState(data)
        setAttacker(data.player1attack ? "elf" : "orc")
        if (data.turn_num % 2 === 0) {
          setAttacker("orc")
        } else {
          setAttacker("elf")
        }
      }
    }, 1000);
  }

  async function fetchPlayer() {
    const response = await fetch(url + "player")
    const data = await response.json()
    setPlayer(data.name)
  }
  fetchPlayer()

  useEffect(() => {
    fetchState()
    return () => clearInterval(timer);
  }, [turn])

  return (
    <Flex
      width="100vw"
      height="100vh"
      bg="#0000009e"
      color="white"
      backgroundBlendMode="multiply"
      backgroundPosition={"center"}
      backgroundRepeat="no-repeat"
      backgroundImage={process.env.PUBLIC_URL +"/bg.png"}
      backgroundSize="cover"

    >
    {gameState !== null &&
    <>
      <CharacterDisplay character="Orc" health={orcHealth} />
      <Flex
        width="50%"
        justifyContent={"center"}
      >
        <Flex
          width="80%"
          height="100%"
          flexDirection={"column"}
          bg = "#ffffffa6"
          color="black"
          maxW="600px"
          onClick={() => {setState("choose")}}
          padding="1rem"
        >
          {state === "choose" ?
          <ChooseMove attacker={attacker} attackerOptions={gameState.player1attack ? gameState.player1.available_actions : gameState.player2.available_actions} defenderOptions={!gameState.player1attack ? gameState.player1.available_actions : gameState.player2.available_actions} lastMove={gameState.last_move} player={player} submitMove={submitMove} />
          :
          <DisplayResults success={gameState.result} reasoning={gameState.reasoning} moveDescription={gameState.last_move} attacker={attacker === "orc" ? "elf" : "orc"} />
          }
        </Flex>
      </Flex>
      <CharacterDisplay character="Elf" health={elfHealth}/>
        </>
        }
    </Flex>
  );
}

export default App;


const CharacterDisplay = ({character, health}) => {
  let image = character === "Elf" ? "elf.png" : "orc.png"
  return (
      <Flex
        width="25%"
        flexDirection={"column"}
      >
        <Flex>
          <Box
            as="img"
            src={process.env.PUBLIC_URL + "/" + image}
            maxHeight = "100%"
            maxW={"100%"}
          />
        </Flex>
        <HealthDisplay heartNum={health} />
      </Flex>
  )
}

// Health display shows three side by side hearts in a flex box split into three
const HealthDisplay = ({heartNum}) => {
  return (
    <HStack
      justifyContent={"center"}
    >
      <Box
        as="img"
        src={process.env.PUBLIC_URL + "/heart.png"}
        maxHeight = "100%"
        maxW={"30%"}
        visibility={heartNum >= 1 ? "visible" : "hidden"}
      />
      <Box
        as="img"
        src={process.env.PUBLIC_URL + "/heart.png"}
        maxHeight = "100%"
        maxW={"30%"}
        visibility={heartNum >= 2 ? "visible" : "hidden"}
      />
      <Box
        as="img"
        src={process.env.PUBLIC_URL + "/heart.png"}
        maxHeight = "100%"
        maxW={"30%"}
        visibility={heartNum >= 3 ? "visible" : "hidden"}
      />
    </HStack>
  )
}

const ChooseMove = ({attacker, attackerOptions, defenderOptions, lastMove, player, submitMove}) => {
  return (
    <>
      <Flex
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Text fontSize="2.5rem" sx={{textTransform: "capitalize"}} fontWeight={"bold"}>Current attacker: {attacker}</Text>
      </Flex>
      <MoveDisplay title="Attacker" moves={attackerOptions} submitMove={submitMove} name={attacker} />
      <MoveDisplay title="Defender" moves={defenderOptions} submitMove={submitMove} name={attacker === "orc" ? "elf" : "orc"}/>
    </>
  )
}

const MoveDisplay = ({title, moves, submitMove, name}) => {
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <VStack>
      <Heading>{title} moves:</Heading>
      <VStack
        flexDirection={"column"}
        divider={<Divider borderColor="gray.200" />}
      >
        {moves.map((move, index) => (
          <Box
            onClick={() => {setSelectedOption(index); submitMove(index, name)}}
            className= {selectedOption === index ? "selected" : "unselected"}
            key={move}
          >
            <Text>
              {move}
            </Text>
          </Box>
        ))}
      </VStack>
    </VStack>

  )
}

const DisplayResults = ({success, reasoning, moveDescription, attacker}) => {
  let output = success ? "succeeded!" : "failed!"
  return (
    <>
      <Flex
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Heading>The {attacker}'s move {output}</Heading>
        <Box as="span" fontSize={"150%"}>Reasoning:</Box> <Text>{reasoning}</Text>
      </Flex>
      <Flex
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Heading>Move</Heading>
        <Text>{moveDescription}</Text>
      </Flex>
    </>
  )
}