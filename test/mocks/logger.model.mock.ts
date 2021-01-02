import { Injectable } from '@angular/core';
import { NgxUploadLogger } from '../../src/utils/logger.model';

@Injectable()
export class MockLogger implements NgxUploadLogger {

    output: any = {
        log: [] ,
        error: [],
        warn: [],
        info: [],
        debug: []
    };

    log(...args: any[]) {
        this.output.log.push(...args);
    }

    error(...args: any[]) {
        this.output.error.push(...args);
    }

    warn(...args: any[]) {
        this.output.warn.push(...args);
    }

    info(...args: any[]) {
        this.output.info.push(...args);
    }

    debug(...args: any[]) {
        this.output.debug.push(...args);
    }
}
