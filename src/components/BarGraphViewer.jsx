import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function BarGraphViewer({ original, newPlan }) {
  const chartRef = useRef(null);
  // This uses the useRef hook to reference where the chart will be rendered

  useEffect(() => {

    const plan1 = original.trim().split("\n");
    const plan2 = newPlan.trim().split("\n");
    // Splits the two plans into arrays of individual lines

    const actions1 = [];
    const actions2 = [];
    //Initializes the arrays needed for the chart

    for (let action of plan1) {
      const startIndex = action.indexOf("(");
      const endIndex = action.indexOf(")");
      if (startIndex !== -1 && endIndex !== -1) {
        actions1.push(action.substring(startIndex + 1, endIndex).trim());
      }
    };
    //Pushes each action in the original plan to an array

    for (let action of plan2) {
      const startIndex = action.indexOf("(");
      const endIndex = action.indexOf(")");
      if (startIndex !== -1 && endIndex !== -1) {
        actions2.push(action.substring(startIndex + 1, endIndex).trim());
      }
    };
    //Pushes each action in the new plan to an array

    const states1 = actions1.reduce((acc, action) => {
      acc[action] = actions1.indexOf(action)+ 1;
      return acc;
    }, {});
    //Map the actions to the state it is in

    const states2 = actions2.reduce((acc, action) => {
      acc[action] = actions2.indexOf(action)+ 1;
      return acc;
    }, {});
    //Map the actions to the state it is in

    const allActions = Array.from(new Set([...actions1, ...actions2]));
    // Get unique actions from both plans


    // Create data for chart  
    const data = {
      labels: allActions,
      datasets: [{
        label: 'Original Plan',
        data: allActions.map(action => states1[action]),
        backgroundColor: 'blue'
      }, {
        label: 'New Plan',
        data: allActions.map(action => states2[action]),
        backgroundColor: 'red'
      }]
    };

    // Define chart options
    const options = {
      indexAxis: 'y',
      scales: {
        x: {
          title: {
            display: true,
            text: 'State'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Action'
          }
        }
      }
    };

    

    // Create a new chart instance
    const myChart = new Chart(chartRef.current, {
      type: 'bar',
      data: data,
      options: options
    });

    //Clean up function whenever original or newPlan changes
    return () => {
      myChart.destroy();
    };
  }, [original, newPlan]);

  return <canvas ref={chartRef} />;
}
export default BarGraphViewer;
