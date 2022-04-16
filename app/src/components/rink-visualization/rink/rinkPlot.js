import * as d3 from "d3";

export const RinkMap = (config) => {
  // all distances are in FT
  const RINK_CONFIG = {
    RINK_LENGTH: 200,
    RINK_WIDTH: 85,
    BLUE_LINE_WIDTH: 1,
    BOARDS_RADIUS: 28,
    RED_TO_BOARDS: 11,
    RED_TO_FACEOFF: 20,
    FACEOFF_RADIUS: 15,
    FACEOFF_DOT_RADIUS: 1,
    ZONE_LINE_WIDTH: (2/12),
    CREASE_RADIUS: 6,
    ZONE_LENGTH: 75,
    ZONE_TO_NEUTRAL_DOT: 5,
    CENTER_TO_NEUTRAL_DOT: 22,
    REF_CREASE_RADIUS: 10,
    CREASE_HEIGHT: 4,
    FACEOFF_HOR_LENGTH: 3,
    FACEOFF_VER_LENGTH: 4,
    FACEOFF_HOR_DIST_CEN: 2,
    FACEOFF_VER_DIST_CEN: (9/12),
    FACEOFF_OUT_MARK_LENGTH: 2,
    FACEOFF_OUT_MARK_DIST_BW: 5 + (7/12),
    TRAPEZOID_TOP: 22,
    TRAPEZOID_BOTTOM: 28
  };

  const RINK_COLOR = {
    BLUE_LINE: "blue",
    RINK_FILL: "white",
    GOAL_FILL: "lightblue"
  }

  let p = {
    chartSize: {width: 500, height: 500},
    margins:  {top: 30, bottom: 5, left: 10, right: 10},
    scale: 400 / RINK_CONFIG.RINK_WIDTH
  }

  if (config !== "undefined") {
    for (let property in config) {
      p[property] = config[property];
    }
  }

  // Get rink scale, scale all rink config distances
  for (let param in RINK_CONFIG) {
    RINK_CONFIG[param] = p.scale * RINK_CONFIG[param];
  }

  // CREATE CHART
  function chart() {
    function rinkLine(x, group, type) {
      let lineWidth = RINK_CONFIG.BLUE_LINE_WIDTH;
      if (type === "center-line"){
        lineWidth = RINK_CONFIG.BLUE_LINE_WIDTH/2;
      }
      group
        .append("rect")
        .attr("x", x - lineWidth)
        .attr("y", 0)
        .attr("width", lineWidth)
        .attr("height", RINK_CONFIG.RINK_WIDTH)
        .attr("class", type);
    }

    function rinkOutLine(group) {
      group.append("path")
        .attr("d", rounded_rect(0,0, RINK_CONFIG.RINK_LENGTH *0.5, RINK_CONFIG.RINK_WIDTH, RINK_CONFIG.BOARDS_RADIUS, true, false, true, false))
        .attr("class", "rink-face")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
    }

    // From stackOverflow http://stackoverflow.com/questions/12115691/svg-d3-js-rounded-corner-on-one-corner-of-a-rectangle
    // r -> radius, tl/tr/bl/br - top left/bottom right TRUE/FALSE for possessing rounded corner
    function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
      let retval;
      retval  = "M" + (x + r) + "," + y;
      retval += "h" + (w - 2*r);
      if (tr) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r; }
      else { retval += "h" + r; retval += "v" + r; }
      retval += "v" + (h - 2*r);
      if (br) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r; }
      else { retval += "v" + r; retval += "h" + -r; }
      retval += "h" + (2*r - w);
      if (bl) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r; }
      else { retval += "h" + -r; retval += "v" + -r; }
      retval += "v" + (2*r - h);
      if (tl) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r; }
      else { retval += "v" + -r; retval += "h" + r; }
      retval += "z";
      return retval;
    }

    // Create goal crease with center at point (x,y) and width d
    function goalCrease(xPos, group) {
      let creaseData = [
        {"x": xPos, "y": (RINK_CONFIG.RINK_WIDTH/2 ) - RINK_CONFIG.CREASE_HEIGHT , "type": "M"},
        {"x": xPos + RINK_CONFIG.CREASE_HEIGHT, "y":(RINK_CONFIG.RINK_WIDTH/2 ) - RINK_CONFIG.CREASE_HEIGHT, "type": "L"},
        {"x": xPos + RINK_CONFIG.CREASE_HEIGHT, "y": (RINK_CONFIG.RINK_WIDTH/2 ) + RINK_CONFIG.CREASE_HEIGHT, "type": "A", "radius": RINK_CONFIG.CREASE_RADIUS},
        {"x": xPos, "y": (RINK_CONFIG.RINK_WIDTH/2 ) + RINK_CONFIG.CREASE_HEIGHT, "type": "L"}
      ];
      const creaseFunction = (input) => {
        let dStr = "";
        for (let i=0; i < input.length; i++){
          if (input[i]["type"] === "M" || input[i]["type"] === "L"){
            dStr += input[i]["type"] + input[i]["x"] + "," + input[i]["y"];
          }
          else if (input[i]["type"] === "A"){
            dStr += input[i]["type"] + input[i]["radius"] + "," + input[i]["radius"] + ",0,0,1," + input[i]["x"] + "," + input[i]["y"];
          }
        }
        return dStr;
      }
      group
        .append("path")
        .attr("d", creaseFunction(creaseData))
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("class", "goal-crease");
    }

    // Create red-line at xPos to scale
    function redLine(x, group) {
      let yDistance = RINK_CONFIG.BOARDS_RADIUS - Math.sqrt((2 * RINK_CONFIG.RED_TO_BOARDS * RINK_CONFIG.BOARDS_RADIUS) - (RINK_CONFIG.RED_TO_BOARDS * RINK_CONFIG.RED_TO_BOARDS));
      group
        .append("rect")
        .attr("x", x)
        .attr("y", yDistance)
        .attr("width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("height", RINK_CONFIG.RINK_WIDTH - 2 * yDistance)
        .attr("class", "red-line");
    }

    function faceOffDot(x,y, group) {
      group
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", RINK_CONFIG.FACEOFF_DOT_RADIUS)
        .attr("class", "red-line");
    }

    // Create face-off circle with radius r at point (x,y)
    function faceOffCircle(x, y, group) {
      let faceOff = group.append("g")
        .attr("class", "faceoff");

      // outer face-off circle
      faceOff.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", RINK_CONFIG.FACEOFF_RADIUS)
        .style("fill", RINK_COLOR.RINK_FILL)
        .attr("class", "red-faceoff")
        .style("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH);

      // face-off dot
      faceOff
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", RINK_CONFIG.FACEOFF_DOT_RADIUS)
        .attr("class", "red-line");

      // Function/data to create four face-off markers
      let faceOffLineFunction = d3.line()
        .x(function(d) {return RINK_CONFIG.FACEOFF_HOR_DIST_CEN + d.x; })
        .y(function(d) {return RINK_CONFIG.FACEOFF_VER_DIST_CEN + d.y; })

      let faceOffLineData = [
        {"x": RINK_CONFIG.FACEOFF_VER_LENGTH, "y": 0},
        {"x": 0, "y": 0},
        {"x": 0, "y": RINK_CONFIG.FACEOFF_HOR_LENGTH}
      ];
      // Create four markers, each translated appropriately off-of (x,y)
      faceOff
        .append("path")
        .attr("d", faceOffLineFunction(faceOffLineData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + x + " , " + y + ")scale(-1, -1)");

      faceOff
        .append("path")
        .attr("d", faceOffLineFunction(faceOffLineData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + x + " , " + y + ")scale(1,-1)");

      faceOff
        .append("path")
        .attr("d", faceOffLineFunction(faceOffLineData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + x + " , " + y + ")");

      faceOff
        .append("path")
        .attr("d", faceOffLineFunction(faceOffLineData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + x + " , " + y + ")scale(-1, 1)");

      // Create two hash on outside of circle (each side)
      // Function/data to create outside line markers
      let outsideLineFunction = d3.line()
        .x(function(d) {return  d.x; })
        .y(function(d) {return  d.y; });

      let xStartOutsideLine = 0.5 * RINK_CONFIG.FACEOFF_OUT_MARK_DIST_BW * Math.tan(Math.acos(0.5 * RINK_CONFIG.FACEOFF_OUT_MARK_DIST_BW/RINK_CONFIG.FACEOFF_RADIUS));
      let outsideLineData = [
        {"x": 0, "y": xStartOutsideLine},
        {"x": 0, "y": xStartOutsideLine + RINK_CONFIG.FACEOFF_OUT_MARK_LENGTH}
      ];
      faceOff
        .append("path")
        .attr("d", outsideLineFunction(outsideLineData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + (x - 0.5 * RINK_CONFIG.FACEOFF_OUT_MARK_DIST_BW) + " , " + y + ")");

      faceOff
        .append("path")
        .attr("d", outsideLineFunction(outsideLineData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + (x + 0.5 * RINK_CONFIG.FACEOFF_OUT_MARK_DIST_BW) + " , " + y + ")");

      faceOff
        .append("path")
        .attr("d", outsideLineFunction(outsideLineData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + (x + 0.5 * RINK_CONFIG.FACEOFF_OUT_MARK_DIST_BW) + " , " + y + "), scale(1,-1)");

      faceOff
        .append("path")
        .attr("d", outsideLineFunction(outsideLineData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + (x - 0.5 * RINK_CONFIG.FACEOFF_OUT_MARK_DIST_BW) + " , " + y + "), scale(1,-1)");
    }

    function trapezoid(xPos, group) {
      let trapezoidFunction = d3.line()
          .x(function(d) {return RINK_CONFIG.RED_TO_BOARDS + d.x; })
          .y(function(d) {return (0.5 * (RINK_CONFIG.RINK_WIDTH - RINK_CONFIG.CENTER_TO_NEUTRAL_DOT)) + d.y; })
      let trapezoidData = [
        {"x": -1 * RINK_CONFIG.RED_TO_BOARDS, "y": -0.5 * (RINK_CONFIG.TRAPEZOID_BOTTOM - RINK_CONFIG.TRAPEZOID_TOP)},
        {"x":0 , "y": 0}
      ];
      group
        .append("path")
        .attr("d", trapezoidFunction(trapezoidData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "translate(" + xPos + " ,0)");
      group
        .append("path")
        .attr("d", trapezoidFunction(trapezoidData))
        .attr("class", "red-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none")
        .attr("transform", "scale(1,-1),translate(" + xPos + "," + (-1 * RINK_CONFIG.RINK_WIDTH) + ")");
    }

    function neutralCircle(x, y, group) {
      let circleData = [
        {"x": x, "y": y - RINK_CONFIG.FACEOFF_RADIUS, "type": "M"},
        {"x": x, "y": y + RINK_CONFIG.FACEOFF_RADIUS, "type": "A", "radius": RINK_CONFIG.FACEOFF_RADIUS, "dir": 0}
      ];
      group
        .append("path")
        .attr("d", dStringCreator(circleData))
        .attr("class", "neutral-faceoff")
        .attr("stroke-width", RINK_CONFIG.ZONE_LINE_WIDTH)
        .attr("fill", "none");
    }

    const dStringCreator = (input) => {
      let dStr = "";
      for (let i=0; i < input.length; i++){
        if (input[i]["type"] === "M" || input[i]["type"] === "L"){
          dStr += input[i]["type"] + input[i]["x"] + " " + input[i]["y"];
        }
        else if (input[i]["type"] === "A"){
          dStr += input[i]["type"] + input[i]["radius"] + "," + input[i]["radius"] + ",0,0," + input[i]["dir"] + "," + input[i]["x"] + "," + input[i]["y"];
        }
      }
      return dStr;
    }

    let zone = p.parent.append("g").attr("class", "zone");

    let zoneElements = zone.append("g").attr("class", "rinkElements");
    generateRinkElements(zoneElements);

    function generateRinkElements(zoneGroup) {
      // RINK OUT LINE, CENTER LINE
      rinkOutLine(zoneGroup);
      rinkLine(0.5 * RINK_CONFIG.RINK_LENGTH, zoneGroup, "center-line");

      // NEUTRAL ZONE
      neutralCircle(0.5 * RINK_CONFIG.RINK_LENGTH, 0.5 * RINK_CONFIG.RINK_WIDTH, zoneGroup);

      faceOffDot(RINK_CONFIG.ZONE_LENGTH + RINK_CONFIG.ZONE_TO_NEUTRAL_DOT, (RINK_CONFIG.RINK_WIDTH/2 - RINK_CONFIG.CENTER_TO_NEUTRAL_DOT), zoneGroup);
      faceOffDot(RINK_CONFIG.ZONE_LENGTH + RINK_CONFIG.ZONE_TO_NEUTRAL_DOT, (RINK_CONFIG.RINK_WIDTH/2 + RINK_CONFIG.CENTER_TO_NEUTRAL_DOT), zoneGroup);

      // O-ZONE
      rinkLine(RINK_CONFIG.ZONE_LENGTH, zoneGroup, "blue-line");
      faceOffCircle(RINK_CONFIG.RED_TO_BOARDS + RINK_CONFIG.RED_TO_FACEOFF, RINK_CONFIG.RINK_WIDTH/2 - RINK_CONFIG.CENTER_TO_NEUTRAL_DOT, zoneGroup);
      faceOffCircle(RINK_CONFIG.RED_TO_BOARDS + RINK_CONFIG.RED_TO_FACEOFF, RINK_CONFIG.RINK_WIDTH/2 + RINK_CONFIG.CENTER_TO_NEUTRAL_DOT, zoneGroup);

      //GOAL LINES
      redLine(RINK_CONFIG.RED_TO_BOARDS, zoneGroup);
      trapezoid(0, zoneGroup);
      goalCrease(RINK_CONFIG.RED_TO_BOARDS, zoneGroup);
    }

    p.parent.selectAll(".rinkElements")
      .attr("transform", "rotate(-90)translate(" + (-1*(RINK_CONFIG.RINK_LENGTH/2)) +",0)");

    // move for margins
    p.parent.selectAll(".zone").attr("transform", "translate(" + p.margins.left + "," + p.margins.top + ")");

  }
  return chart;
};

