import { useEffect, useRef, useState } from "react";
import { EventData } from "../../nhlapi/schema";
import * as d3 from "d3";
import { RinkMap } from "./rink/rinkPlot";
import * as d3hex from "d3-hexbin";
import "./rink/rink-style.css";
import "./rink-vis.scss";




export function RinkChart({data}: {data: EventData | undefined}) {
  const d3Ref = useRef(null);
  const MQ = window.matchMedia("(max-width: 767px)");
  const [scale, setScale] = useState(MQ.matches ? 330 / 85 : 500 / 85);

  // Change the chart scale for mobile devices.
  useEffect(() => {
    MQ.addEventListener("change", (event) => {
      setScale(event.matches ? 330 / 85 : 500 / 85);
    })
  })

  // Build the rink chart.
  useEffect(() => {
    let rinkSvg = d3.select(d3Ref.current);
    rinkSvg.selectAll("*").remove();
    RinkMap({parent: rinkSvg, scale: scale})();
  }, [scale])

  // Plot event data to the chart.
  useEffect(() => {
    let zone = d3.select(d3Ref.current).select(".zone");

    let x = d3.scaleLinear()
      .domain([-42.5, 42.5])
      .range([0, 85 * scale]);

    let y = d3.scaleLinear()
      .domain([0, 100])
      .range([0, 100 * scale]);

    let hexbin = d3hex.hexbin()
      .radius(4 * scale)
      .extent([[0, 0], [85 * scale, 100 * scale]])

    zone.append("clipPath")
      .attr("id", "clip")
      .append("rect")
        .attr("width", 85 * scale)
        .attr("height", 100 * scale)

    let hexbinInput: any[] = []
    if (data) {
      data.playerEvents.forEach(function(d) {
        let coord = nhlCoordToChartCoord(d.coordinates);
        hexbinInput.push([x(coord.x), y(coord.y)] )
      })

      let color = d3.scaleLinear<string, string>()
      .domain([0, data!.playerEvents.length/4]) // Number of points in the bin?
      .range(["transparent",  "red"])

      zone.append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("path")
        .data(hexbin(hexbinInput))
        .enter().append("path")
          .attr("d", hexbin.hexagon())
          .attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"; })
          .attr("fill", (d) => { return color(d.length); })
          .attr("stroke", "black")
          .attr("stroke-width", "0.1")
    }
  }, [data, scale])

  function nhlCoordToChartCoord(coord: {x: number, y: number}): {x: number, y: number} {
    let chartCoord = {
      x: coord.y,
      y: coord.x,
    };
    if (chartCoord.y < 0) {
      chartCoord = {
        x: - chartCoord.x,
        y: Math.abs(chartCoord.y),
      };
    }
    return chartCoord;
  }

  return <svg ref={d3Ref} className="rink-chart"/>;
}