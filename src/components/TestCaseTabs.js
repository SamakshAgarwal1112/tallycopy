"use client";

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Box,
  IconButton,
  Flex,
  Button,
} from "@chakra-ui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import React, { useState, useEffect } from "react";

function TestCaseTabs() {
  const [tabs, setTabs] = useState([
    { id: 1, label: "Tab 1", content: "Content for Tab 1" },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 1); // Default to 1 if tabs are empty

  useEffect(() => {
    if (tabs.length === 0) return;
    if (tabs.length === 1) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs]);

  const addTab = () => {
    const newTab = {
      id: tabs.length + 1,
      label: `Tab ${tabs.length + 1}`,
      content: `Content for Tab ${tabs.length + 1}`,
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const deleteTab = (id) => {
    if (tabs.length === 1) return; // Prevent deletion if only one tab is left
    const filteredTabs = tabs
      .filter((tab) => tab.id !== id)
      .map((tab, index) => ({
        ...tab,
        id: index + 1, // Reset the id based on the new index
        label: `Tab ${index + 1}`, // Update the label accordingly
      }));
    setTabs(filteredTabs);
    if (activeTab === id && filteredTabs.length > 0) {
      setActiveTab(filteredTabs[0].id);
    }
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
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
      <Tabs
        variant="unstyled"
        index={tabs.findIndex((tab) => tab.id === activeTab)}
        isLazy
        onChange={(index) => setActiveTab(tabs[index]?.id)}
      >
        <Box overflowX="auto">
          <TabList>
            <Flex wrap="wrap" gap={2} p={1}>
              {tabs.map((tab) => (
                <Box key={tab.id} display="flex" alignItems="center">
                  <Tab
                    _selected={{ color: "blue.500", fontWeight: "bold" }}
                    _focus={{ outline: "none" }}
                    px={4}
                    py={2}
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => handleTabClick(tab.id)}
                  >
                    {tab.label}
                  </Tab>
                  {tabs.length > 1 && (
                    <IconButton
                      aria-label="Delete tab"
                      icon={<TrashIcon className="w-4 h-4 text-red-600" />}
                      size="sm"
                      variant="link"
                      ml={2}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTab(tab.id);
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
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>
          {tabs.map((tab) => (
            <TabPanel key={tab.id}>
              <Box p={4}>
                <h2 className="text-xl font-bold mb-2">{tab.label}</h2>
                <p>{tab.content}</p>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default TestCaseTabs;
