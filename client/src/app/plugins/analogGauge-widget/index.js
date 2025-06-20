// plugins/temperature-widget/index.js
import AnalogGauge from "../../components/widget/AnalogGauge";

export default {
  type: "temperature2", // тип устройства
  name: "temperatureWidget",
  component: AnalogGauge
};
