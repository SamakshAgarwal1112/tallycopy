import { Card, CardHeader, CardBody, Text } from "@chakra-ui/react";
import { FaCode } from "react-icons/fa6";

function LandingCard({title, description}) {
  return (
    <>
      <Card
        maxW="md"
        border={`1px solid rgba(255, 255, 255, 0.10)`} // Border color with 10% opacity
        transition="all 0.2s"
        backgroundColor="#111111"
        borderRadius="16px"
        p={2}
        position="relative" // Required for positioning the ::after pseudo-element
        _hover={{
          transform: "scale(1.1)", // Slight scaling effect for emphasis
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: -1,
            // backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black for the shadow
            borderRadius: "inherit",
            mixBlendMode: "multiply", // Blend mode to merge shadow with background
            boxShadow: "0 0 20px 10px rgba(26, 26, 26, 0.5)", // Blackish shadow with lower opacity
          },
        }}
      >
        <CardHeader p="0.5rem" mb="1rem">
          <FaCode color="#00ff9a" size="24px" />
        </CardHeader>
        <CardBody p="0.5rem">
          <Text fontSize="xl" fontWeight="700" mb="0.75rem">
            {title}
          </Text>
          <Text color="#B6B6B6">
            {description}
          </Text>
        </CardBody>
      </Card>
    </>
  );
}

export default LandingCard;
