/**
 * Created by Yu Zhang on 2017/11/1.
 */
/*eslint-disable*/
export function  barTickAlign(divname,x,y,title){
    const echarts=require('echarts');
    const myChart = echarts.init(document.getElementById(divname));

    const myGrid= {
      left: '13%',
      right: '4%',
      bottom: '1%',
      containLabel: true
    };
    const myXAxis = [
      {
        type : 'category',
        data : x,
        axisTick: {
          alignWithLabel: true
        }
      }
    ];
    const myYAxis = [
      {
        type : 'value'
      }
    ];
    const mySeries = [
      {
        name:'Story',
        type:'bar',
        barWidth: '60%',
        data:y
      }
    ]

    myChart.setOption({
      title:{
        show:true,
        text:title,
        left: 'center'

      },
      color: ['#3398DB'],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid:myGrid,
      xAxis :myXAxis,
      yAxis :myYAxis,
      series :mySeries,
    });

  }


export function chartTypeLine(divname,x,mySeries,legend,title) {
  const echarts=require('echarts');
  const myChart = echarts.init(document.getElementById(divname));

  const myGrid= {
    left: '13%',
    right: '4%',
    bottom: '1%',
    containLabel: true
  };
  const myXAxis = [
    {
      type : 'category',
      data : x,
      axisTick: {
        alignWithLabel: true
      }
    }
  ];
  const myYAxis = [
    {
      type : 'value'
    }
  ];

  myChart.setOption({
    title:{
      show:true,
      text:title,
      left: 'center'

    },

    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid:myGrid,
    xAxis :myXAxis,
    yAxis :myYAxis,
    series :mySeries,
    legend:legend,

  });


}
