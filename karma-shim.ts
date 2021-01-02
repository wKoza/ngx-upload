import 'core-js';
import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';

import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';


TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

declare const require: any;
const testsContext: any = require.context('./test', true, /\.spec/);
testsContext.keys().forEach(testsContext);
