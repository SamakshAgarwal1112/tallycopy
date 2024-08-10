import { Avatar, Flex, Text, Button } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { TbCloudUpload } from "react-icons/tb";
import Link from "next/link";
function CodeNavbar() {
  return (
    <Flex
      position="sticky"
      top={0}
      zIndex="10"
      width="100%"
      backgroundColor="black"
      color="white"
      p={4}
      align="center"
      justify="space-evenly"
    >
      <Flex>
        <Link href="/practice">
          <Text>Problem list</Text>
        </Link>
      </Flex>

      <Flex gap="1rem">
        <Button
          leftIcon={<FaPlay />}
          onClick={
            {
              /* send to compiler*/
            }
          }
        >
          Run
        </Button>
        <Button
          leftIcon={
            <TbCloudUpload
              onClick={
                {
                  /* send to compiler*/
                }
              }
            />
          }
        >
          Submit
        </Button>
      </Flex>

      <Flex>
        <Avatar marginRight="1rem" name="Dan Abrahmov" />
      </Flex>
    </Flex>
  );
}

export default CodeNavbar;
