import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EnvService {
  // The values that are defined here are the default values that can be overridden by env.js
  // REST API urls
  public baseUrl = "http://localhost:9092/fms/";
  // Whether or not to enable greet message
  [key: string]: any;
  constructor() {}
}
