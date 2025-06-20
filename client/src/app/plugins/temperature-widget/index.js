// plugins/temperature-widget/index.js
import Temp from "../../components/widget/ThermometerGuage";

export default {
  type: "temperature", // тип устройства
  name: "TempWidget",
  component: Temp
};
