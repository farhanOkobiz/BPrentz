import { poppins } from "@/app/font";

type TabType = {
  name: string;
  _id: string;
};

type TabsProps = {
  tabs: TabType[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex flex-wrap gap-3 pb-2 mb-6">
      {tabs.map((tab) => {
        const isSelected = activeTab._id === tab._id;

        return (
          <div key={tab._id}>
            <p
              onClick={() => setActiveTab(tab)}
              className={`border
                ${isSelected ? "border-primary bg-primary text-white" : "border-[#262626]/40 text-black"}
                hover:border-primary hover:bg-primary hover:text-white
                duration-300 rounded px-4 py-2 text-sm font-medium cursor-pointer
                ${poppins.className}
              `}
            >
              {tab.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
