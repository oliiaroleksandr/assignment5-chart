import { SelectOption, chartData, selectAllOption } from "@/const";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DevicesSelector } from "./components";

type DataPoint = {
  Serial_Number: string;
  DateTime: string;
  Wattage: number;
};

type AggregatedDataPoint = {
  DateTime: string;
  Wattage: number;
};

const App = () => {
  const [selectedDevices, setSelectedDevices] = useState<SelectOption[]>([
    selectAllOption,
  ]);

  const computeData = (data: DataPoint[]) => {
    const filteredDevicesData = selectedDevices.reduce((acc, option) => {
      acc[option.value] = data.filter(
        (device) => device.Serial_Number === option.value
      );
      return acc;
    }, {} as { [key: string]: DataPoint[] | AggregatedDataPoint[] });

    if (
      selectedDevices.find((option) => option.value === selectAllOption.value)
    ) {
      const allDevicesData = data.reduce((acc, d) => {
        if (acc[d.DateTime]) {
          acc[d.DateTime] += d.Wattage;
        } else {
          acc[d.DateTime] = d.Wattage;
        }
        return acc;
      }, {} as { [key: string]: number });

      filteredDevicesData["all"] = Object.keys(allDevicesData).map((dateTime) => ({
        DateTime: dateTime,
        Wattage: allDevicesData[dateTime],
      }));
    }

    return filteredDevicesData;
  };

  const computedData = computeData(chartData);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-10 ml-[3.9rem]">
        Smart Home Electrical Consumption
      </h1>
      <div className="mb-4 ml-[3.9rem] max-w-[20rem]">
        <DevicesSelector
          value={selectedDevices}
          onChange={setSelectedDevices}
        />
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={Array.isArray(computedData) ? computedData : []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="DateTime" allowDuplicatedCategory={false} />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(computedData).map((key) => (
            <Line
              key={key}
              type="monotone"
              data={computedData[key]}
              dataKey="Wattage"
              name={key}
              stroke="#8884d8"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default App;
