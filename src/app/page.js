import Navbar from "@/components/Navbar";
import LandingCard from "./components/LandingCard";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";

function Home() {
  return (
    <>
      <Box backgroundColor="#090909" height="100vh">
        <Navbar />
        <Box mt="1rem" mb="10rem">
          <Flex  gap="1rem" justify="center" align="center">
            <Heading size="3xl">Code,</Heading>
            <Heading as="span" size="3xl" color="#00ff9a">
              Compete,
            </Heading>
            <Heading size="3xl">Conquer</Heading>
          </Flex>
        </Box>
        <Flex
          maxWidth="90rem"
        
          // justifyContent="center"
          // alignItems="center" 
          gap="3rem"
          flexWrap="wrap"
          margin="0 auto" // Center the Flex container itself
        >
          <LandingCard />
          <LandingCard />
          <LandingCard />
          <LandingCard />
          <LandingCard />
          <LandingCard />
        </Flex>
      </Box>
    </>
  );
}

export default Home;
