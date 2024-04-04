import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';

function GraphViewer({ original, newPlan }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const plan1 = original.trim().split("\n");
    const plan2 = newPlan.trim().split("\n");

    let nodes = [];
    let edges1 = [];
    let edges2 = [];
    let nodeIndexMap = new Map(); 
    // Map to store action index for each plan

    // Function to create or get node index based on the action
    function getNodeIndex(action, planIndex){
      const startIndex = action.indexOf("(");
      const endIndex = action.indexOf(")");
      if (startIndex !== -1 && endIndex !== -1) {
        if (!nodeIndexMap.has(action)) {
          const index = nodes.length;
          nodes.push({ id: index, label: action, color: planIndex === 1 ? 'skyblue' : 'lightcoral' });
          nodeIndexMap.set(action, index);
        }
      }
      return nodeIndexMap.get(action);
    };

    // Function to connect nodes with edges
    function connectNodes(plan, planIndex, edges){
      for (let i = 0; i < plan.length - 1; i++) {
        const fromIndex = getNodeIndex(plan[i], planIndex);
        const toIndex = getNodeIndex(plan[i + 1], planIndex);
        edges.push({ from: fromIndex, to: toIndex, color: planIndex === 1 ? 'skyblue' : 'lightcoral' });
      }
    };

    connectNodes(plan1, 1, edges1);
    connectNodes(plan2, 2, edges2);

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet([...edges1, ...edges2])
    };

    const options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'LR',
          levelSeparation: 400, 
          nodeSpacing: 200, 
          sortMethod: 'directed' 
        }
      },
      nodes: {
        shape: 'box'
      },
      edges: {
        arrows: {
          to: true
        }
      },
    };

    const network = new Network(containerRef.current, data, options);

    //Garbage collector
    return () => {
      network.destroy();
    };

  }, [original, newPlan]);

  return <div ref={containerRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />;
};

export default GraphViewer;