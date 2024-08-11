import Navbar from "@/components/Navbar";
import LandingCard from "./components/LandingCard";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";

function Home() {
  const points = [
    {
      title: "Code faster!",
      description:
        "Improve your coding speed and efficiency with practice challenges.",
    },
    {
      title: "Challenge yourself!",
      description:
        "Take on diverse coding challenges designed to push your skills to the next level.",
    },
    {
      title: "Build your skills!",
      description:
        "Tackle problems that sharpen your coding and problem-solving abilities.",
    },
    {
      title: "Learn by doing!",
      description:
        "Gain hands-on experience by writing code that solves real problems.",
    },
    {
      title: "Experiment freely!",
      description:
        "The Playground lets you try out new ideas and approaches without restrictions.",
    },
    {
      title: "Keep it simple!",
      description:
        "Our platform is straightforward and focused—no distractions, just code.",
    },
  ];

  return (
    <>
      <Box backgroundColor="#090909" height="100vh">
        <Navbar />
        <Box mt="1rem" mb="10rem">
          <Flex  gap="1rem" justify="center" align="center">
            <Heading size="3xl">Code,</Heading>
            <Heading as="span" size="3xl" color="#00ff9a">
              Continue,
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
         {points.map((point, index) => (
          <LandingCard key={index} {...point} />
        ))}
        </Flex>
      </Box>
    </>
  );
}

export default Home;
