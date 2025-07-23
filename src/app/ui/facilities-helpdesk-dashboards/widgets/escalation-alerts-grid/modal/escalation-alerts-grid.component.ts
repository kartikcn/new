import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as d3 from 'd3';


interface GaugeMap {
  configure(configuration: any): void;
  isRendered(): boolean;
  render(newValue: number): void;
  update(newValue: number, newConfiguration?: any): void;
}
interface GaugeConfig {
  [key: string]: any;
  size?: number;
  clipWidth?: number;
  clipHeight?: number;
  ringInset?: number;
  ringWidth?: number;
  pointerWidth?: number;
  pointerTailLength?: number;
  pointerHeadLengthPercent?: number;
  minValue?: number;
  maxValue?: number;
  minAngle?: number;
  maxAngle?: number;
  transitionMs?: number;
  majorTicks?: number;
  labelFormat?: (value: number) => string;
  labelInset?: number;
  arcColorFn?: (value: number) => string;
}

@Component({
  selector: 'app-escalation-alerts-grid',
  templateUrl: './escalation-alerts-grid.component.html',
  styleUrls: ['./escalation-alerts-grid.component.scss']
})
export class EscalationAlertsGridComponent implements OnInit {
  data: any;
  options: any;
  showPopupFlag: boolean = false;
  viewForEscalation: boolean = true;
  @Input() noEsctdData!: any;
  @Input() escalatedData!: any;
  @Input() allEscalatedData!: any;
  detailsPopUpData: any[] = [];
  canvasWidth: any = 300;
  needleValue: any = 0;
  bottomLabel: string = this.needleValue + '%';
  // guageOptions: any = {
  //   hasNeedle: true,
  //   needleColor: 'blue',
  //   needleUpdateSpeed: 1000,
  //   arcColors: ['red','green'],
  //   arcDelimiters: [75],
  //   rangeLabel: ['0','100'],
  //   needleStartValue: 0,
  // }

  gaugemap: GaugeMap = {} as GaugeMap;

  constructor() { }

  ngOnInit(): void { 
    // this.draw();
  }

  setEscalatedPercantage(noEscalatedPercent: any) {
    this.canvasWidth = 300;
    this.needleValue = 0;
    this.bottomLabel = this.needleValue + '%';
    // this.guageOptions = {
    //   hasNeedle: true,
    //   needleColor: 'blue',
    //   needleUpdateSpeed: 1000,
    //   arcColors: ['red','green'],
    //   arcOverEffect: false,
    //   arcPadding : '10px',
    //   arcDelimiters: [75],
    //   rangeLabel: ['0', '100'],
    //   needleStartValue: 0,
    // }
    const floatValue: number = parseFloat(noEscalatedPercent);
    if(typeof floatValue === 'number' && !isNaN(floatValue)){
      this.needleValue = floatValue;
      this.bottomLabel = this.needleValue + '%';
      // this.guageOptions.needleStartValue = 0;
    } else {
      this.needleValue = 0;
      this.bottomLabel = this.needleValue + '%';
    }
    this.draw()
  }

  onClickKnob() {
    this.showPopupFlag = true;
    this.detailsPopUpData = [];
    this.detailsPopUpData.push(...this.noEsctdData);
  }

  draw() {
    const self = this;
    const gauge = function (container: string, configuration: any): GaugeMap {
      const config = {
        size: 300,
        clipWidth: 300,
        clipHeight: 300,
        ringInset: 20,
        ringWidth: 30,
        pointerWidth: 10,
        pointerTailLength: 5,
        pointerHeadLengthPercent: 0.65,
        minValue: 0,
        maxValue: 100,
        minAngle: -90,
        maxAngle: 90,
        transitionMs: 2000,
        majorTicks: 5,
        labelFormat: d3.format('d'),
        labelInset: 10,
        // arcColorFn: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
        limitingValue:0.75,
        arcColorFn: ["#ff0000","#00ff00"]
      };

      let range: number | undefined;
      let r: number | undefined;
      let pointerHeadLength: number | undefined;
      let value = 0;

      let svg: any;
      let arc: any;
      let scale: any;
      let ticks: any;
      let tickData: any;
      let pointer: any;

      const donut = d3.pie();

      function deg2rad(deg: number) {
        return deg * Math.PI / 180;
      }

      function newAngle(d: number) {
        const ratio = scale(d);
        const newAngle = config.minAngle + (ratio * range!);
        return newAngle;
      }

      function configure(configuration: GaugeConfig) {
        // for (const prop in configuration) {
        //   if (configuration.hasOwnProperty(prop)) {
        //     (config as any)[prop] = configuration[prop];
        //   }
        // }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        scale = d3.scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);

        ticks = scale.ticks(config.majorTicks);
        tickData = d3.range(config.majorTicks).map(() => 1 / config.majorTicks);

        arc = d3.arc()
          .innerRadius(r! - config.ringWidth - config.ringInset)
          .outerRadius(r! - config.ringInset)
          .startAngle((d: any, i: number) => {
            // const ratio = d * i;
            const ratio = i*config.limitingValue;
            return deg2rad(config.minAngle + (ratio * range!));
          })
          .endAngle((d: any, i: number) => {
            // const ratio = d * (i + 1);
            let ratio = (i + 1)*config.limitingValue;
            if(ratio>1){
              ratio=1;
            }
            return deg2rad(config.minAngle + (ratio * range!));
          });
      }
      self.gaugemap.configure = configure;

      function centerTranslation() {
        return `translate(${r},${r})`;
      }

      function isRendered() {
        return svg !== undefined;
      }
      self.gaugemap.isRendered = isRendered;

      function render(newValue: number) {
        d3.select(container).selectAll("*").remove();
        svg = d3.select(container)
          .append('svg:svg')
          .attr('class', 'gauge')
          .attr('width', config.clipWidth)
          .attr('height', config.clipHeight);

        const centerTx = centerTranslation();

        const arcs = svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);

        arcs.selectAll('path')
        // .data(tickData)
          .data([0.5,0.5])
          .enter().append('path')
          .attr('fill', (d: number, i: number) => {
            // return config.arcColorFn(d * i);
            return config.arcColorFn[i];
          })
          .attr('d', arc);

        const lg = svg.append('g')
          .attr('class', 'label')
          .attr('transform', centerTx);

        lg.selectAll('text')
          .data(ticks)
          .enter().append('text')
          .attr('transform', (d: number) => {
            const ratio = scale(d);
            const newAngle = config.minAngle + (ratio * range!);
            return `rotate(${newAngle}) translate(0,${config.labelInset - (r ?? 0)})`;
          })
          .text(config.labelFormat);

        const lineData = [
          [config.pointerWidth / 2, 0],
          [0, -pointerHeadLength!],
          [-(config.pointerWidth / 2), 0],
          [0, config.pointerTailLength],
          [config.pointerWidth / 2, 0]
        ];
        const pointerLine = d3.line().curve(d3.curveLinear);

        const pg = svg.append('g').data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg.append('path')
          .attr('d', pointerLine)
          .attr('transform', `rotate(${config.minAngle})`);

        update(newValue === undefined ? 0 : newValue);

        const rv = svg.append('g')
        .attr('class', 'pointerval')
        .attr('transform', centerTx);
         rv.append('text').attr('transform','rotate(0) translate(-30,70) scale(3)').text(newValue+'%');
      }
      self.gaugemap.render = render;

      function update(newValue: number, newConfiguration?: any) {
        if (newConfiguration !== undefined) {
          configure(newConfiguration);
        }
        const ratio = scale(newValue);
        const newAngle = config.minAngle + (ratio * range!);
        pointer.transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', `rotate(${newAngle})`);
      }
      self.gaugemap.update = update;

      configure(configuration);

      return self.gaugemap;
    };

    const powerGauge = gauge('#power-gauge',{});
    powerGauge.render(this.needleValue);
  }

}