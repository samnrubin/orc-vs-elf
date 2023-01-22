import './App.css';
import {
  Flex,
  Box,
  HStack,
  Text,
  VStack,
  Heading
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';

const testMoves = ["Test1", "Test2", "Test3"]
const testLastMove = "The orc attacks the elf"
const url = "http://localhost:8000/"

function App() {
  // States are "choose" for choosing a move, "display" for displaying the moves, and "end" for the end of the game
  const [state, setState] = useState("choose");
  const [gameState, setGameState] = useState({});
  const [player, setPlayer] = useState("");
  const [turn, setTurn] = useState(0);
  const [attacker, setAttacker] = useState("Orc");

  async function submitMove(moveChoice) {
    await fetch(url + "take_action", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({action: moveChoice, player: player})
    })
  }

  async function fetchState() {
    const response = await fetch(url + "game_state")
    const data = await response.json()
    console.log(data)
    if (data.turn_num != turn) {
      setTurn(data.turn_num)
      setState("display")
      setGameState(data)
      if (data.turn_num % 2 == 0) {
        setAttacker("orc")
      } else {
        setAttacker("elf")
      }
    }
  }

  async function fetchPlayer() {
    const response = await fetch(url + "player")
    const data = await response.json()
    setPlayer(data.name)
  }

  useEffect(() => {
    fetchPlayer()
    setInterval(fetchState, 1000)
  }, [])

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
      <CharacterDisplay character="Orc" />
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
        >
          {state === "choose" ?
          <ChooseMove attacker={attacker} attackerOptions={testMoves} defenderOptions={testMoves} lastMove={testLastMove} player={player} submitMove={submitMove} />
          :
          <DisplayResults success={true} reasoning={"The orc rolled a 5 and the elf rolled a 4"} moveDescription={"The orc attacks the elf"} attacker={"Orc"} />
          }
        </Flex>
      </Flex>
      <CharacterDisplay character="Elf" />
    </Flex>
  );
}

export default App;


const CharacterDisplay = ({character}) => {
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
        <HealthDisplay heartNum={3} />
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
        justifyItems={"center"}
        flexDirection={"column"}
      >
        <Heading>Current attacker: {attacker}</Heading>
        <Text>You are playing as the {player}</Text>
      </Flex>
      <Flex
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Heading>Last move:</Heading>
        <Text>{lastMove}</Text>
      </Flex>
      <MoveDisplay title="Attacker" moves={attackerOptions} submitMove={submitMove} />
      <MoveDisplay title="Defender" moves={defenderOptions} submitMove={submitMove} />
    </>
  )
}

const MoveDisplay = ({title, moves, submitMove}) => {
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <VStack>
      <Heading>{title} moves:</Heading>
      <Flex
        flexDirection={"column"}
      >
        {moves.map((move, index) => (
          <Box
            onClick={() => {setSelectedOption(index); submitMove(index)}}
            className= {selectedOption === index ? "selected" : "unselected"}
            key={move}
          >
            <Text>
              {move}
            </Text>
          </Box>
        ))}
      </Flex>
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