import { useEffect, useRef } from "react";
import { EventData } from "../../nhlapi/schema"

export function RinkChart({data}: {data: EventData | undefined}) {
  const d3Container = useRef(null);

  // D3 Hexbin Map code
  useEffect(() => {

  }, [data])

  return (
    <div className="rink-chart">

    </div>
  );
}