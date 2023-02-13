import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpClientUploadService } from '@wkoza/ngx-upload';
import { NgxUploadLogger } from '../../lib/utils/logger.model';

@Injectable()
export class HttpClientUploadServiceMock extends HttpClientUploadService {

    constructor(logger: NgxUploadLogger, httpClient: HttpClient) {
        super(logger, httpClient);
    }

}

