const ctx1 = document.getElementById('myChart1').getContext('2d');
const ctx2 = document.getElementById('myChart2').getContext('2d');
const ctx3 = document.getElementById('myChart3').getContext('2d');

// const ctx3 = document.getElementById('myChart3').getContext('2d');
// const ctx4 = document.getElementById('myChart4').getContext('2d');
let typesOfFeatures=[9,2]
const data1= {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
const data2 = {
  labels: [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 90, 81, 56, 55, 40],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }, {
    label: 'My Second Dataset',
    data: [28, 48, 40, 19, 96, 27, 100],
    fill: true,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgb(54, 162, 235)',
    pointBackgroundColor: 'rgb(54, 162, 235)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(54, 162, 235)'
  }]
};
const data3 = {
  labels: [
    'Red',
    'Blue'
    ],
  datasets: [{
    label: 'My First Dataset',
    data: typesOfFeatures,
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
    ],
    hoverOffset: 4
  }]
};
// const data4 = {
//   labels: [
//     'Red',
//     'Blue',
//     'Yellow'
//   ],
//   datasets: [{
//     label: 'My First Dataset',
//     data: [300, 50, 100],
//     backgroundColor: [
//       'rgb(255, 99, 132)',
//       'rgb(54, 162, 235)',
//       'rgb(255, 205, 86)'
//     ],
//     hoverOffset: 4
//   }]
// };

const myChart1 = new Chart(ctx1, {
    type: 'bar',
    data: data1,
    options: {
      responsive:true,
       maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
const myChart2 = new Chart(ctx2, {
    type: 'radar',
    data: data2,
    options: {
    responsive:true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 3
      }
    }
  },
});

const myChart3 =new Chart(ctx3,{
  type: 'doughnut',
  data: data3
}
)

// const boxplotData = {
//   // define label tree
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [{
//     label: 'Dataset 1',
//     backgroundColor: 'rgba(255,0,0,0.5)',
//     borderColor: 'red',
//     borderWidth: 1,
//     outlierColor: '#999999',
//     padding: 10,
//     itemRadius: 0,
//     data: [
//       randomValues(100, 0, 100),
//       randomValues(100, 0, 20),
//       randomValues(100, 20, 70),
//       randomValues(100, 60, 100),
//       randomValues(40, 50, 100),
//       randomValues(100, 60, 120),
//       randomValues(100, 80, 100)
//     ]
//   }, {
//     label: 'Dataset 2',
//     backgroundColor:  'rgba(0,0,255,0.5)',
//     borderColor: 'blue',
//     borderWidth: 1,
//     outlierColor: '#999999',
//     padding: 10,
//     itemRadius: 0,
//     data: [
//       randomValues(100, 60, 100),
//       randomValues(100, 0, 100),
//       randomValues(100, 0, 20),
//       randomValues(100, 20, 70),
//       randomValues(40, 60, 120),
//       randomValues(100, 20, 100),
//       randomValues(100, 80, 100)
//     ]
//   }]
// };
//   const myChart4 = new Chart(ctx4, {
//     type: 'boxplot',
//     data: boxplotData,
//     options: {
//       responsive:true,
//        maintainAspectRatio: false,    
//          legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Chart.js Box Plot Chart'
//       }
//     }
//   });

var options = {
  series: [
  {
    name: 'box',
    type: 'boxPlot',
    data: [
      {
        x: new Date('2017-01-01').getTime(),
        y: [54, 66, 69, 75, 88]
      },
      {
        x: new Date('2018-01-01').getTime(),
        y: [43, 65, 69, 76, 81]
      },
      {
        x: new Date('2019-01-01').getTime(),
        y: [31, 39, 45, 51, 59]
      },
      {
        x: new Date('2020-01-01').getTime(),
        y: [39, 46, 55, 65, 71]
      },
      {
        x: new Date('2021-01-01').getTime(),
        y: [29, 31, 35, 39, 44]
      }
    ]
  },
  {
    name: 'outliers',
    type: 'scatter',
    data: [
      {
        x: new Date('2017-01-01').getTime(),
        y: 32
      },
      {
        x: new Date('2018-01-01').getTime(),
        y: 25
      },
      {
        x: new Date('2019-01-01').getTime(),
        y: 64
      },
      {
        x: new Date('2020-01-01').getTime(),
        y: 27
      },
      {
        x: new Date('2020-01-01').getTime(),
        y: 78
      },
      {
        x: new Date('2021-01-01').getTime(),
        y: 15
      }
    ]
  }
],
  chart: {
  type: 'boxPlot',
  height: 350
},
colors: ['#008FFB', '#FEB019'],
title: {
  text: 'BoxPlot - Scatter Chart',
  align: 'left'
},
xaxis: {
  type: 'datetime',
  tooltip: {
    formatter: function(val) {
      return new Date(val).getFullYear()
    }
  }
},
tooltip: {
  shared: false,
  intersect: true
}
};

var chart = new ApexCharts(document.querySelector("#myChart1"), options);
chart.render();