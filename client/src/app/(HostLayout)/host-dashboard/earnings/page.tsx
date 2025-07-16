import { poppins } from "@/app/font";
import EarningPage from "../../components/EarningPage/EarningPage";

const Earnings = () => {
  return (
    <div className={`Container py-8  ${poppins.className}`}>
      <div className="xl:px-8">
        <h2 className="md:text-2xl text-xl font-medium">Earnings</h2>

        <div>
          <EarningPage />
        </div>
      </div>
    </div>
  );
};

export default Earnings;
