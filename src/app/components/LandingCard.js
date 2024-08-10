import { Card, CardHeader, CardBody, Text } from "@chakra-ui/react";
import { FaCode } from "react-icons/fa6";

function LandingCard() {
  return (
    <>
      <Card
        maxW="md"
        border="1px solid black"
        boxShadow="none"
        transition="all 0.2s"
        backgroundColor="#0d1418"
        p={4}
        _hover={{
          boxShadow: "0 0 15px 5px rgba(0, 255, 154, 0.2)", // Glow effect with increased opacity
          transform: "scale(1.001)", // Slight scaling effect for emphasis
        }}
      >
        <CardHeader p={2}>
          <FaCode color="#00ff9a" />
        </CardHeader>
        <CardBody p={2}>
          <Text fontSize="xl" fontWeight="700">
            Code faster!
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo
            possimus adipisci distinctio alias voluptatum blanditiis laudantium.
          </Text>
        </CardBody>
      </Card>
    </>
  );
}

export default LandingCard;
