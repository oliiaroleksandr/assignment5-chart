import { useMemo } from "react";
import { SelectOption, chartData, selectAllOption } from "@/const";
import { MultipleSelectorProps, MultipleSelector } from "./ui";

type Props = {
  value: MultipleSelectorProps["value"];
  onChange: MultipleSelectorProps["onChange"];
};

const DevicesSelector = (props: Props) => {
  const selectOptions = useMemo(() => {
    const map: Record<string, boolean> = {};
    const result: SelectOption[] = [selectAllOption];

    chartData.forEach((item) => {
      if (map[item.Serial_Number]) return;
      map[item.Serial_Number] = true;
      result.push({ value: item.Serial_Number, label: item.Serial_Number });
    });

    return result;
  }, []);

  return (
    <MultipleSelector
      {...props}
      options={selectOptions}
      placeholder="Select a device"
      emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600">
          no results found.
        </p>
      }
    />
  );
};

export default DevicesSelector;
