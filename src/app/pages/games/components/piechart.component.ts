import { Component, OnInit, Input } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "pie-chart",
  template: `
    <svg
      *ngIf="!getGray(raw_data)"
      viewBox="0 0 32 32"
      [ngStyle]="{
        width: getSize(size),
        height: getSize(size),
        'margin-top': getHalfsize(size),
        'margin-left': getHalfsize(size)
      }"
    >
      <circle class="blue" [attr.stroke-dasharray]="getBlue(blue)"></circle>
    </svg>
    <svg
      *ngIf="getGray(raw_data)"
      class="gray-svg"
      viewBox="0 0 32 32"
      [ngStyle]="{
        width: getSize(size),
        height: getSize(size),
        'margin-top': getHalfsize(size),
        'margin-left': getHalfsize(size)
      }"
    >
      <circle class="gray" [attr.stroke-dasharray]="getBlue(blue)"></circle>
    </svg>
  `,
  styles: [
    `
      :host {
        position: relative;
        height: 100%;
        width: 100%;
        display: block;
      }

      svg {
        border-radius: 50%;
        background: #8b32fc;
        transform: rotate(-90deg);
        position: absolute;
        top: 50%;
        left: 50%;
      }
      .gray-svg {
        background: #a9a9a9;
      }

      circle {
        fill: none;
        stroke-width: 32;
        r: 16;
        cx: 16;
        cy: 16;
      }

      circle.blue {
        stroke: #f46601;
      }

      circle.gray {
        stroke: #a9a9a9;
      }
    `,
  ],
})
export class PiechartComponent {
  @Input("blue") blue: string = "0";
  @Input("size") size: string = "24";

  @Input("raw_data") raw_data: any = [];

  half_size: string = "";

  constructor() {}

  getSize(size) {
    return size + "px";
  }

  getHalfsize(size) {
    return (Number(size) / 2) * -1 + "px";
  }

  getBlue(blue) {
    return blue + " 100";
  }

  getGray(raw_data) {
    if (
      (raw_data[0] == 0 && raw_data[1] == 0) ||
      (raw_data[0] == undefined && raw_data[1] == undefined)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
