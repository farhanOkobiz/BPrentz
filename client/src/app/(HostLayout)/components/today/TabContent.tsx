import TabTable from "./TabTable";
import type { TabKey } from "./types";

interface TabContentProps {
  activeTab: TabKey;
  data: any[];
}

const TabContent: React.FC<TabContentProps> = ({ data }) => {
  return <TabTable data={data} />;
};

export default TabContent;
