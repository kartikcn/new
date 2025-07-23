import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanListComponent } from '../widgets/plan-list/plan-list.component';
import { PlanStepsListComponent } from '../widgets/plan-steps-list/plan-steps-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ppm-plan',
  templateUrl: './ppm-plan.component.html',
  styleUrls: ['./ppm-plan.component.scss']
})
export class PpmPlanComponent implements OnInit {
  tab_name_clicked: string = "";
  @ViewChild(PlanListComponent, { static: false }) planListComponent!: PlanListComponent;
  @ViewChild(PlanStepsListComponent, { static: false }) stepsListComponent!: PlanStepsListComponent;
  constructor(
    private router: Router,
  ) {
  }

  
  ngOnInit(): void {

  }


}
