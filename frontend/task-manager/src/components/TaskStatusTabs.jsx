import React, { act } from "react";

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="my-5">
      <div className="flex ">
        {tabs.map((tabs) => (
          <button
            key={tabs.label}
            className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
              activeTab === tabs.label
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            } rounded-md mr-2`}
            onClick={() => setActiveTab(tabs.label)}
          >
            <div className="flex items-center">
              <span className="text-xs">{tabs.label}</span>
              <span
                className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                  activeTab === tabs.label
                    ? "bg-primary text-white"
                    : "bg-gray-200/70 text-gray-600"
                }`}
              >
                {tabs.count}
              </span>
            </div>

            {activeTab === tabs.label && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusTabs;
