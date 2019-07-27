import { Injectable } from '@angular/core';
import { NgxUploadLogger } from '../../src/utils/logger.model';
import { HttpClientUploadService } from '../../src';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpClientUploadServiceMock extends HttpClientUploadService {

    constructor(logger: NgxUploadLogger, httpClient: HttpClient) {
        super(logger, httpClient);
    }

}

