import logo from './logo.svg';
import './App.css';
import {
  Flex,
  Box,
  HStack
} from '@chakra-ui/react';

function App() {
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
      >
        Main display
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
    <HStack>
      <Box
        as="img"
        src={process.env.PUBLIC_URL + "/heart.png"}
        maxHeight = "100%"
        maxW={"33.3%"}
        visibility={heartNum >= 1 ? "visible" : "hidden"}
      />
      <Box
        as="img"
        src={process.env.PUBLIC_URL + "/heart.png"}
        maxHeight = "100%"
        maxW={"33.3%"}
        visibility={heartNum >= 2 ? "visible" : "hidden"}
      />
      <Box
        as="img"
        src={process.env.PUBLIC_URL + "/heart.png"}
        maxHeight = "100%"
        maxW={"33.3%"}
        visibility={heartNum >= 3 ? "visible" : "hidden"}
      />
    </HStack>
  )
}
