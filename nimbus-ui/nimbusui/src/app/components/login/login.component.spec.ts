'use strict';
import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { JL } from 'jsnlog';
import { StorageServiceModule, SESSION_STORAGE } from 'angular-webstorage-service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { LoggerService } from './../../services/logger.service';
import { SessionStoreService, CUSTOM_STORAGE } from '../../services/session.store';
import { LoginCmp } from './login.component';
import { AppInitService } from '../../services/app.init.service'
import { configureTestSuite } from 'ng-bullet';
import { setup, TestContext } from '../../setup.spec';

class MockRouter {
    navigate() { }
  }


  class MockLoggerService {
    debug() { }
    info() { }
    error() { }
}

const declarations = [
    LoginCmp
 ];
 const imports = [
     ReactiveFormsModule,
     RouterTestingModule,
     StorageServiceModule,
     HttpClientModule,
     HttpModule
 ];
 const providers = [ 
     {provide: Router, useClass: MockRouter}, 
     { provide: CUSTOM_STORAGE, useExisting: SESSION_STORAGE },
     { provide: 'JSNLOG', useValue: JL },
     {provide: LoggerService, useClass: MockLoggerService},
     AppInitService
  ];

describe('LoginCmp', () => {

    configureTestSuite();
    setup(LoginCmp, declarations, imports, providers);

    beforeEach(async function(this: TestContext<LoginCmp>){
    });

    it('should create the LoginCmp', async function(this: TestContext<LoginCmp>) {
      expect(this.hostComponent).toBeTruthy();
    });

    it('onSubmit() should navigate to /h/admindashboard for admin', async function(this: TestContext<LoginCmp>) {
      this.hostComponent.loginForm = { value: { username: 'admin' } };
      const _router = TestBed.get(Router);
      spyOn(_router, 'navigate');
      this.hostComponent.onSubmit();
      expect(_router.navigate).toHaveBeenCalledWith(['/h/admindashboard']);
    });

    it('onSubmit() should navigate to /cs/a for supervisor', async function(this: TestContext<LoginCmp>) {
      this.hostComponent.loginForm = { value: { username: 'supervisor' } };
      const _router = TestBed.get(Router);
      spyOn(_router, 'navigate');
      this.hostComponent.onSubmit();
      expect(_router.navigate).toHaveBeenCalledWith(['/cs/a']);
    });

    it('onSubmit() should navigate to /pc/a for training', async function(this: TestContext<LoginCmp>) {
      this.hostComponent.loginForm = { value: { username: 'training' } };
      const _router = TestBed.get(Router);
      spyOn(_router, 'navigate');
      this.hostComponent.onSubmit();
      expect(_router.navigate).toHaveBeenCalledWith(['/pc/a']);
    });

    it('onSubmit() should navigate to /h/vrCSLandingPage for default', async function(this: TestContext<LoginCmp>) {
      this.hostComponent.loginForm = { value: { username: '' } };
      const _router = TestBed.get(Router);
      spyOn(_router, 'navigate');
      this.hostComponent.onSubmit();
      expect(_router.navigate).toHaveBeenCalledWith(['/h/vrCSLandingPage']);
    });

    it('onSubmit() should navigate to member for member', async function(this: TestContext<LoginCmp>) {
      this.hostComponent.loginForm = { value: { username: 'member' } };
      const _router = TestBed.get(Router);
      spyOn(_router, 'navigate');
      this.hostComponent.onSubmit();
      expect(_router.navigate).toHaveBeenCalledWith(['/mem/a']);
    });

    it('LoginForm should be created', async function(this: TestContext<LoginCmp>) {
      this.hostComponent.ngOnInit();
      expect(this.hostComponent.loginForm).toBeTruthy();
    });

});