import datasets from "vega-datasets";
import * as vl from "vega-lite-api";

const data = await datasets["cars.json"]();

export function createPlot({ width = 1000 }) {
  const brush = vl.selectInterval().encodings("x");
  const click = vl.selectMulti().encodings("color");

  const points = vl
    .markPoint({ filled: true, opacity: 0.7 })
    .encode(
      vl
        .color()
        .value("lightgray")
        .if(brush, vl.color().fieldN("Origin").title("Herkunft")),
      vl.size().fieldQ("Horsepower").title("PS"),
      vl
        .x()
        .fieldQ("Weight_in_lbs")
        .scale({ domain: [1500, 5500] })
        .title("Gewicht (lbs)"),
      vl
        .y()
        .fieldQ("Acceleration")
        .scale({ domain: [6, 26] })
        .title("Beschleunigung (s)")
    )
    .width(width)
    .height(300)
    .select(brush)
    .transform(vl.filter(click));

  const bars = vl
    .markBar({ opacity: 0.8 })
    .encode(
      vl
        .color()
        .value("lightgray")
        .if(click, vl.color().fieldN("Origin").title("Herkunft")),
      vl.x().count(),
      vl.y().fieldN("Origin").title("Herkunft")
    )
    .width(width)
    .select(click)
    .transform(vl.filter(brush));

  const plot = vl
    .vconcat(points, bars)
    .data(data)
    .autosize({ type: "fit-x", contains: "padding" })
    .title({
      text: "Autoanalyse: Gewicht, PS und Herkunft",
      fontSize: 20,
      anchor: "middle",
      subtitle: "Daten aus cars.json",
      subtitleFontSize: 14,
    });

  return plot.toSpec();
}
