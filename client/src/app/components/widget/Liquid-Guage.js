import { useEffect, useRef, useState } from 'react';
import LiquidFillGauge from 'react-liquid-gauge';
import { interpolateRgb } from 'd3-interpolate';
import { color } from 'd3-color';

const LiquidWidget = ({ value = 50 }) => {
  const radius = 100;
  const startColor = "#6495ed";
  const endColor = "#dc143c";

  const interpolate = interpolateRgb(startColor, endColor);

  const [displayValue, setDisplayValue] = useState(value);
  const raf = useRef(null);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const initial = displayValue;

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const newValue = initial + (value - initial) * progress;
      setDisplayValue(newValue);

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  const fillColor = interpolate(displayValue / 100);

  const gradientStops = [
    {
      key: "0%",
      stopColor: color(fillColor).darker(0.5).toString(),
      stopOpacity: 1,
      offset: "0%"
    },
    {
      key: "50%",
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: "50%"
    },
    {
      key: "100%",
      stopColor: color(fillColor).brighter(0.5).toString(),
      stopOpacity: 0.5,
      offset: "100%"
    }
  ];

  return (
    <LiquidFillGauge
      style={{ margin: "0 auto" }}
      width={radius * 2}
      height={radius * 2}
      value={displayValue}
      percent="%"
      textSize={1}
      textOffsetX={0}
      textOffsetY={0}
      textRenderer={(props) => {
        const value = Math.round(props.value);
        const radius = Math.min(props.height / 2, props.width / 2);
        const textPixels = (props.textSize * radius) / 2;

        return (
          <tspan>
            <tspan className="value" style={{ fontSize: textPixels }}>{value}</tspan>
            <tspan style={{ fontSize: textPixels * 0.6 }}>{props.percent}</tspan>
          </tspan>
        );
      }}
      riseAnimation
      waveAnimation
      waveFrequency={2}
      waveAmplitude={1}
      gradient
      gradientStops={gradientStops}
      circleStyle={{ fill: fillColor }}
      waveStyle={{ fill: fillColor }}
      textStyle={{
        fill: color("#444").toString(),
        fontFamily: "Arial"
      }}
      waveTextStyle={{
        fill: color("#fff").toString(),
        fontFamily: "Arial"
      }}
    />
  );
};

export default LiquidWidget;
