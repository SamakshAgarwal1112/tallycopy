"use client";

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  TabIndicator,
  Box,
  IconButton,
  Flex,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import React, { useState, useEffect } from "react";
import getTestCasesOfQuestion from "@/api/getTestCasesOfQuestion";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";

function TestCaseTabs() {
  const [activeTab, setActiveTab] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const { question_id } = useParams();

  useEffect(() => {
    setLoading(true);
    const fetchTestCases = async () => {
      try {
        const fetchedTestCases = await getTestCasesOfQuestion(question_id);
        setTestCases(fetchedTestCases);

        // Set the first tab as active by default
        if (fetchedTestCases.length > 0) {
          setActiveTab(fetchedTestCases[0].id);
        }
      } catch (error) {
        console.error("Error fetching test cases:", error);
      } finally {
        setLoading(false);
      }
    };

    if (question_id) {
      fetchTestCases();
    }
  }, [question_id]);

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  const addTab = () => {
    const currentTestCase = testCases.find((tc) => tc.id === activeTab);

    if (!currentTestCase) return; // No current test case, abort

    const newId = nanoid();
    const newTab = {
      ...currentTestCase,
      id: newId,
      label: `Test Case ${testCases.length + 1}`,
    };

    setTestCases([...testCases, newTab]);
    setActiveTab(newId);
  };

  const deleteTab = (id) => {
    if (testCases.length === 1) return; // Prevent deletion if only one tab is left

    const filteredTabs = testCases.filter((tab) => tab.id !== id);
    setTestCases(filteredTabs);
    if (activeTab === id && filteredTabs.length > 0) {
      setActiveTab(filteredTabs[0].id);
    }
  };

  const handleInputChange = (e, key) => {
    const updatedTestCases = testCases.map((tc) => {
      if (tc.id === activeTab) {
        return {
          ...tc,
          input: {
            ...tc.input,
            [key]: e.target.value,
          },
        };
      }
      return tc;
    });
    setTestCases(updatedTestCases);
  };

  const handleOutputChange = (e) => {
    const updatedTestCases = testCases.map((tc) => {
      if (tc.id === activeTab) {
        return {
          ...tc,
          expected_output: e.target.value,
        };
      }
      return tc;
    });
    setTestCases(updatedTestCases);
  };

  const currentTestCase = testCases.find((tc) => tc.id === activeTab) || {
    input: {},
    expected_output: "",
  };

  return (
    <Box
      backgroundColor="#0D1418"
      color="white"
      borderRadius="xl"
      p={4}
      maxW="70vh"
      overflow="hidden"
      h="40vh"
    >
      {loading ? (
        <Flex justify="center" align="center" w="70vh" height="100%">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Tabs
          variant="unstyled"
          index={testCases.findIndex((tc) => tc.id === activeTab)}
          isLazy
          onChange={(index) => setActiveTab(testCases[index]?.id)}
        >
          <Box overflowX="auto">
            <TabList>
              <Flex wrap="wrap" gap={2} p={1}>
                {testCases.map((testCase, index) => (
                  <Box key={testCase.id} display="flex" alignItems="center">
                    <Tab
                      _selected={{ color: "blue.500", fontWeight: "bold" }}
                      _focus={{ outline: "none" }}
                      px={4}
                      py={2}
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => handleTabClick(testCase.id)}
                    >
                      {`Test Case ${index + 1}`}
                    </Tab>
                    {testCases.length > 1 && (
                      <IconButton
                        aria-label="Delete tab"
                        icon={<TrashIcon className="w-4 h-4 text-red-600" />}
                        size="sm"
                        variant="link"
                        ml={2}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTab(testCase.id);
                        }}
                      />
                    )}
                  </Box>
                ))}
                <Box display="flex" alignItems="center">
                  <IconButton
                    aria-label="Add tab"
                    icon={<PlusIcon className="w-5 h-5" />}
                    size="sm"
                    variant="link"
                    ml={2}
                    onClick={addTab}
                  />
                </Box>
              </Flex>
            </TabList>
          </Box>
          {/* <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        /> */}
          <TabPanels>
            {testCases.map((testCase) => (
              <TabPanel key={testCase.id}>
                <Flex direction="column" gap="0.5rem">
                  <Flex direction="column" gap="0.5rem">
                    <strong>Input:</strong>
                    {Object.entries(testCase.input).map(([key, value]) => (
                      <Box key={key} gap="0.5rem">
                        <Text fontWeight="300">{key}:</Text>
                        <Input
                          value={value}
                          onChange={(e) => handleInputChange(e, key)}
                          type="text"
                        />
                      </Box>
                    ))}
                  </Flex>
                  <Flex direction="column" gap="0.5rem">
                    <strong>Output:</strong>
                    <Input
                      value={testCase.expected_output}
                      onChange={handleOutputChange}
                      type="text"
                    />
                  </Flex>
                </Flex>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
}

export default TestCaseTabs;
