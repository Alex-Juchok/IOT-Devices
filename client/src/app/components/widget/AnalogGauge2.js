import React from "react";
import { Chart } from "react-google-charts";

const styles = {
  dial: {
    width: `auto`,
    height: `auto`,
    color: "#000",
    padding: "2px"
  }
};

const AnalogGauge2 = ({ value, title='!' }) => {
  return (
    <div style={styles.dial}>
      <Chart
        height={240}
        width={240}
        chartType="Gauge"
        loader={<div></div>}
        data={[
          ["Label", "Value"],
          [title, Number(value)]
        ]}
        options={{
          redFrom: 830,
          redTo: 1000,
          yellowFrom: 700,
          yellowTo: 830,
          minorTicks: 5,
          min: 0,
          max: 1000
        }}
      />
    </div>
  );
};

export default AnalogGauge2;
