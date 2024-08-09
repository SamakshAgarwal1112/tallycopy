"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/outline";

function TestCaseTabs() {
  const [tabs, setTabs] = useState([
    { id: 1, label: "Tab 1", content: "Content for Tab 1" },
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

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
    <div className="bg-[#0d1418] rounded-lg p-4 flex flex-col h-[25rem]">
      <div className="flex flex-wrap items-center max-w-[70vh] bg-[#0d1418] rounded-lg overflow-hidden mb-2">
        {tabs.map((tab) => (
          <div key={tab.id} className="flex items-center">
            <a
              role="tab"
              className={`tab ${
                activeTab === tab.id ? "tab-active bg-gray-700 text-white" : "text-gray-400"
              } w-[10rem] mr-4 truncate px-2 py-1 rounded-md cursor-pointer`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
              {tabs.length > 1 && (
                <TrashIcon
                  className="w-4 h-4 inline-block ml-2 text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTab(tab.id);
                  }}
                />
              )}
            </a>
            {tab.id === tabs.length && (
              <button
                className="btn btn-outline btn-accent ml-4 z-10"
                onClick={addTab}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex-grow overflow-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            <h2 className="text-xl font-bold mb-2">{tab.label}</h2>
            <p>{tab.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestCaseTabs;
