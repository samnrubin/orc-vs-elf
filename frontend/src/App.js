import './App.css';
import {
  Flex,
  Box,
  HStack,
  Text,
  VStack,
  Heading
} from '@chakra-ui/react';

import { useState } from 'react';

const testMoves = ["Test1", "Test2", "Test3"]
const testLastMove = "The orc attacks the elf"

function App() {
  // States are "choose" for choosing a move, "display" for displaying the moves, and "end" for the end of the game
  const [state, setState] = useState("choose");
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
        >
          {state === "choose" ?
          <ChooseMove attacker="Orc" attackerOptions={testMoves} defenderOptions={testMoves} lastMove={testLastMove} player="Elf" />
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

const ChooseMove = ({attacker, attackerOptions, defenderOptions, lastMove, player}) => {
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
      <MoveDisplay title="Attacker" moves={attackerOptions} />
      <MoveDisplay title="Defender" moves={defenderOptions} />
    </>
  )
}

const MoveDisplay = ({title, moves}) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    submitForm(e.target.value);
  }

  const submitForm = (value) => {
    // submit logic goes here
    console.log(`Selected option: ${value}`);
  }

  return (
    <VStack>
      <Heading>{title} moves:</Heading>
      <form>
        {moves.map((move, index) => (
          <label>{move} 
            <input
              type="radio"
              name="move"
              value={index}
              onChange={handleChange}
            />
            <br />
          </label>
        ))}
      </form>
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