import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DashboardStatusPieModel } from '../model/dashboard-status-pie.model';

@Component({
  selector: 'app-dashboard-status-pie-chart',
  templateUrl: './dashboard-status-pie-chart.component.html',
  styleUrls: ['./dashboard-status-pie-chart.component.scss']
})
export class DashboardStatusPieChartComponent implements OnInit {
  
  data: any = [];
  options: any;
  chartData : any;
  labels: any[] = [];
  detailsPopUpData: any[] = [];
  showDetailsPopUp: boolean = false;
  viewForEscalation:boolean = true;
  @Input() statusChartData!: any;
  basicOptions = {
    title: {
      display: false,
      text: 'Bar Chart',
      fontSize: 18
    },
    legend: {
      display: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Status',
          fontStyle: 'bold',
        },
        ticks: {
          display: true,
        },
        grid: {
          display: false,
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Request Count',
          fontStyle: 'bold',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 5,
          display: true 
        },
        grid: {
          display: false,
        }
      },
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (tooltipItem:any) {
          return "Requests: " + tooltipItem.formattedValue;
        }
      }
    },
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutBounce'
    },
  };
  
  pieContent :DashboardStatusPieModel[]=  [];
  customColor = {
    domain: ['#000000'] 
  };
  view: any[] = [730, 242];
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    
  }

  loadChartData (statusChartData : any){
    this.data = [
      statusChartData.requested.data.length,
      statusChartData.approved.data.length,
      statusChartData.rejected.data.length,
      statusChartData.inProcess.data.length,
      statusChartData.onHoldForAccess.data.length,
      statusChartData.onHoldForParts.data.length,
      statusChartData.onHoldForLabour.data.length,
      statusChartData.completed.data.length,
      statusChartData.close.data.length,
      statusChartData.cancelled.data.length,
    ];
    this.setChartData(statusChartData)
  }

  setChartData(statusChartData: any) {
    let initialChartData: any = {
      labels: this.labels,
      datasets: [
        {
          label: "",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }
      ]
    }
    const dynamicColors: any[] = [];

    for (let key in statusChartData) {
      if (statusChartData.hasOwnProperty(key)) {
        let color = '';
        do {
          color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        } while (color === 'rgba(255, 255, 255, 1)' || this.isWhiteColorShade(color)) { // Regenerate color if it is white
          color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        };

        dynamicColors.push(color);
      }
    }
    Object.values(statusChartData).forEach((each: any, index: number) => {
      if(each.data.length > 0){
       // initialChartData.labels.push(each.label);
       this.labels.push(each.label);
        initialChartData.datasets[0].data.push(each.data.length);
        //initialChartData.datasets[0].label = each.label;
        initialChartData.datasets[0].backgroundColor.push(
          dynamicColors[index % dynamicColors.length]
        );
        initialChartData.datasets[0].borderColor.push(
          dynamicColors[index % dynamicColors.length]
        );
      }
    });

    //this.basicOptions.scales.xAxes[0].scaleLabel.labelString = 'Status';
    this.chartData = initialChartData;
  }

  isWhiteColorShade(color: any) {
    // Extract RGB values from the color string
    const rgbValues = color.match(/\d+/g);
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);

    // Check if all RGB values are close to 255 (white)
    const threshold = 50; // Adjust this threshold as needed
    const average = (r + g + b) / 3;
    return average > threshold;
  }

  onClickBarChart(event: any) {
    this.viewForEscalation = true;
    this.detailsPopUpData = [];
    // const selectedStatus = this.labels[event.element.index];
    switch (event.label) {
      case 'Requested':
        this.detailsPopUpData.push(...this.statusChartData.requested.data);
        this.viewForEscalation = false;
        break;
      case 'Approved':
        this.detailsPopUpData.push(...this.statusChartData.approved.data);
        break;
      case 'Rejected':
        this.detailsPopUpData.push(...this.statusChartData.rejected.data);
        break;
      case 'In Process':
        this.detailsPopUpData.push(...this.statusChartData.inProcess.data);
        break;
      case 'On Hold For Access':
        this.detailsPopUpData.push(...this.statusChartData.onHoldForAccess.data);
        break;
      case 'On Hold For Parts':
        this.detailsPopUpData.push(...this.statusChartData.onHoldForParts.data);
        break;
      case 'On Hold For Labour':
        this.detailsPopUpData.push(...this.statusChartData.onHoldForLabour.data);
        break;
      case 'Completed':
        this.detailsPopUpData.push(...this.statusChartData.completed.data);
        break;
      case 'Close':
        this.detailsPopUpData.push(...this.statusChartData.close.data);
        break;
      case 'Cancelled':
        this.detailsPopUpData.push(...this.statusChartData.cancelled.data);
        break;
      default:
        break;
    }
    this.showDetailsPopUp = true;
  }

  loadPieData(statusChartData : any[]){
    this.generateColors(statusChartData);
    this.pieContent=[];
    Object.values(statusChartData).forEach((each: any, index: number) => {
      let name = each.label;
      let value = each.data.length;
      if(value>0){
        let dataobj = {
          name:name,
          value: value
        }
        this.pieContent.push(dataobj);
      }
    })
    this.cdr.detectChanges();
  }

  generateColors(statusChartData:any){
    const dynamicColors: any[] = [];
    Object.values(statusChartData).forEach((each: any, index: number) => {
      if(each.data.length>0){
        let color = '';
      do {
        color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      } while (color === 'rgba(255, 255, 255, 1)' || this.isWhiteColorShade(color)) { // Regenerate color if it is white
        color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      };
      dynamicColors.push(color);
      }
    });
    this.customColor = {
      domain :[...dynamicColors]
    }
  }

}
