
// plugins/temperature-widget/index.js
import LiquidWidget from "../../components/widget/Liquid-Guage";

export default {
  type: "humidity", // тип устройства
  name: "humidityWidget",
  component: LiquidWidget
};
