import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { data as chartData } from "@/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface DataPoint {
  Serial_Number: string;
  DateTime: string;
  Device_ID: string;
  Wattage: number;
}

interface AggregatedDataPoint {
  DateTime: string;
  Wattage: number;
}

const App = () => {
  const [serialNumber, setSerialNumber] = useState("all");

  const filterData = (
    data: DataPoint[]
  ): DataPoint[] | AggregatedDataPoint[] => {
    if (serialNumber === "all") {
      const aggregatedData = data.reduce((acc, d) => {
        if (acc[d.DateTime]) {
          acc[d.DateTime] += d.Wattage;
        } else {
          acc[d.DateTime] = d.Wattage;
        }

        return acc;
      }, {} as { [key: string]: number });

      return Object.keys(aggregatedData).map((dateTime) => ({
        DateTime: dateTime,
        Wattage: aggregatedData[dateTime],
      }));
    }

    return data.filter((d) =>
      serialNumber ? d.Serial_Number === serialNumber : true
    );
  };

  const filteredData = filterData(chartData);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-10 ml-[3.9rem]">
        Smart Home Electrical Consumption
      </h1>
      <div className="mb-4 ml-[3.9rem]">
        <Select value={serialNumber} onValueChange={setSerialNumber}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Serial Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Serial Numbers</SelectItem>
            {Array.from(new Set(chartData.map((d) => d.Serial_Number))).map(
              (sn) => (
                <SelectItem key={sn} value={sn}>
                  {sn}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="DateTime" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Wattage" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default App;
