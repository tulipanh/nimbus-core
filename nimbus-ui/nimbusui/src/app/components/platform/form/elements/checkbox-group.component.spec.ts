'use strict';
import { TestBed, async } from '@angular/core/testing';
import { GrowlModule, AccordionModule, PickListModule, ListboxModule, CalendarModule, DataTableModule, DropdownModule, FileUploadModule, RadioButtonModule, CheckboxModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, ValidatorFn, FormControl } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';

import { CheckBoxGroup } from './checkbox-group.component';
import { TooltipComponent } from '../../../platform/tooltip/tooltip.component';
import { PageService } from '../../../../services/page.service';
import { WebContentSvc } from '../../../../services/content-management.service';
import { CustomHttpClient } from '../../../../services/httpclient.service';
import { LoaderService } from '../../../../services/loader.service';
import { ConfigService } from '../../../../services/config.service';
import { LoggerService } from '../../../../services/logger.service';
import { Subject } from 'rxjs';
import { InputLegend } from '../../../platform/form/elements/input-legend.component';
import { configureTestSuite } from 'ng-bullet';
import { setup, TestContext } from '../../../../setup.spec';
import * as data from '../../../../payload.json';
import { ValidationUtils } from '../../validators/ValidationUtils';

let pageService, param;

class MockPageService {
  public eventUpdate$: Subject<any>;
  public validationUpdate$: Subject<any>;

  constructor() {
    this.eventUpdate$ = new Subject();
    this.validationUpdate$ = new Subject();
  }

  logError(a) {
    this.eventUpdate$.next(a);
  }

  notifyErrorEvent(a) {
    this.validationUpdate$.next(a);
  }

  postOnChange(a, b, c) {

  }
}

const declarations = [
  CheckBoxGroup,
  TooltipComponent,
  InputLegend
];
const imports = [
GrowlModule,
AccordionModule, 
PickListModule, 
ListboxModule, 
CalendarModule, 
DataTableModule, 
DropdownModule, 
FileUploadModule, 
RadioButtonModule, 
CheckboxModule,
FormsModule, 
ReactiveFormsModule,
HttpModule,
HttpClientTestingModule
];
const providers = [
{provide: PageService, useClass: MockPageService},
WebContentSvc,
CustomHttpClient,
LoaderService,
ConfigService,
LoggerService
];

describe('CheckBoxGroup', () => {

  configureTestSuite();
  setup(CheckBoxGroup, declarations, imports, providers);
  param = (<any>data).payload;

  beforeEach(async function(this: TestContext<CheckBoxGroup>){
    const fg = new FormGroup({});
    const checks: ValidatorFn[] = [];
    checks.push(Validators.required);
    fg.addControl(param.config.code, new FormControl(param.leafState, checks));
    this.hostComponent.form = fg;
    this.hostComponent.element = param;
    pageService = TestBed.get(PageService);
});

  it('should create the CheckBoxGroup', async function (this: TestContext<CheckBoxGroup>) {
    expect(this.hostComponent).toBeTruthy();
  });

  it('value property should be updated', async function (this: TestContext<CheckBoxGroup>) {
    this.hostComponent.value = 'test';
    expect(this.hostComponent.value).toEqual('test');
  });

  it('registerOnChange() should update the onChange property', async function (this: TestContext<CheckBoxGroup>) {
    const test = () => {};
    this.hostComponent.registerOnChange(test);
    expect(this.hostComponent.onChange).toEqual(test);
  });

  it('registerOnTouched() should update the onTouched property', async function (this: TestContext<CheckBoxGroup>) {
    const test = () => {};
    this.hostComponent.registerOnTouched(test);
    expect(this.hostComponent.onTouched).toEqual(test);
  });

  it('setState() should update call cd.markForCheck()', async function (this: TestContext<CheckBoxGroup>) {
    const test = { element: { leafState: '' } };
    const spy = spyOn((this.hostComponent as any).cd, 'markForCheck').and.callThrough();
    this.hostComponent.setState('test', test);
    expect(spy).toHaveBeenCalled();
    expect(test.element.leafState).toEqual('test');
  });

  it('emitValueChangedEvent() should call the controlValueChanged.emit()', async function (this: TestContext<CheckBoxGroup>) {
    spyOn(this.hostComponent.controlValueChanged, 'emit').and.callThrough();
    this.hostComponent.form = null;
    this.hostComponent.emitValueChangedEvent({ element: '' }, '');
    expect(this.hostComponent.controlValueChanged.emit).toHaveBeenCalled();
  });

  it('ngOnInit() should update the requiredCss property as false based on element.activeValidationGroups', async function (this: TestContext<CheckBoxGroup>) {
    this.hostComponent.element.activeValidationGroups = ['1'];
    spyOn(ValidationUtils, 'buildStaticValidations').and.returnValue('');
    spyOn(ValidationUtils, 'rebindValidations').and.returnValue('');
    this.hostComponent.ngOnInit();
    expect(this.hostComponent.requiredCss).toBeFalsy();
  });

  it('ngOnInit() should update the value', async function (this: TestContext<CheckBoxGroup>) {
    this.hostComponent.element.leafState = [1];
    spyOn(ValidationUtils, 'buildStaticValidations').and.returnValue('');
    spyOn(ValidationUtils, 'rebindValidations').and.returnValue('');
    this.hostComponent.ngOnInit();
    expect(this.hostComponent.value).toEqual([1]);
  });

  it('ngOnInit() should not subscribe to pageService.eventUpdate$', async function (this: TestContext<CheckBoxGroup>) {
    spyOn(pageService.eventUpdate$, 'subscribe').and.callThrough();
    this.hostComponent.form.controls[this.hostComponent.element.config.code] = null;
    this.hostComponent.ngOnInit();
    expect(pageService.eventUpdate$.subscribe).not.toHaveBeenCalled();
  });

  it('ngOnInit() should call form.controls[eve.config.code].setValue()', async function (this: TestContext<CheckBoxGroup>) {
    this.fixture.whenStable().then(() => {
      const eve = { leafState: 'tLeaf', path: 'atest', config: { code: 'firstName' } };
      spyOn(ValidationUtils, 'buildStaticValidations').and.returnValue('');
      spyOn(ValidationUtils, 'rebindValidations').and.returnValue('');
      spyOn(ValidationUtils, 'applyelementStyle').and.returnValue('');
      spyOn(ValidationUtils, 'assessControlValidation').and.returnValue('');
      console.log('this.hostComponent.form.controls[eve.config.code]', this.hostComponent.form.controls['firstName']);
      const frmCtrl = this.hostComponent.form.controls[eve.config.code];
      this.hostComponent.element.path = 'atest';
      spyOn(frmCtrl, 'setValue').and.returnValue('');
      this.hostComponent.ngOnInit();
      pageService.logError(eve);
      expect(frmCtrl.setValue).toHaveBeenCalled();
    });
  });

  it('ngOnInit() should call form.controls[eve.config.code].reset()', async function (this: TestContext<CheckBoxGroup>) {
    this.fixture.whenStable().then(() => {
      const eve = { leafState: null, path: 'atest', config: { code: 'firstName' } };
      const frmCtrl = this.hostComponent.form.controls[eve.config.code];
      this.hostComponent.element.path = 'atest';
      spyOn(frmCtrl, 'reset').and.returnValue('');
      this.hostComponent.ngOnInit();
      pageService.logError(eve);
      expect(frmCtrl.reset).toHaveBeenCalled();
    });
  });

  it('ngOnInit() should not call form.controls[eve.config.code].setValue() and reset() in form', async function (this: TestContext<CheckBoxGroup>) {
    this.fixture.whenStable().then(() => {
      const eve = { leafState: null, path: '1atest', config: { code: 'firstName' } };
      const frmCtrl = this.hostComponent.form.controls[eve.config.code];
      this.hostComponent.element.path = 'atest';
      spyOn(frmCtrl, 'reset').and.returnValue('');
      spyOn(frmCtrl, 'setValue').and.returnValue('');
      this.hostComponent.ngOnInit();
      pageService.logError(eve);
      expect(frmCtrl.reset).not.toHaveBeenCalled();
      expect(frmCtrl.setValue).not.toHaveBeenCalled();
    });
  });

  it('ngOnInit() should update requiredCss property', async function (this: TestContext<CheckBoxGroup>) {
    this.hostComponent.element.path = 'test';
    const eve = { activeValidationGroups: [1], leafState: 'tLeaf', path: 'test', config: { code: 'firstName' } };
    const frmCtrl = this.hostComponent.form.controls[eve.config.code];
    spyOn(ValidationUtils, 'rebindValidations').and.callThrough();
    this.hostComponent.ngOnInit();
    pageService.notifyErrorEvent(eve);
    expect(this.hostComponent.requiredCss).toBeFalsy();
    expect(ValidationUtils.rebindValidations).toHaveBeenCalled();
  });

  it('ngOnInit() should update requiredCss property on eve.activeValidationGroups.length is 0', async function (this: TestContext<CheckBoxGroup>) {
    this.fixture.whenStable().then(() => {
      this.hostComponent.element.path = 'test';
      const eve = { activeValidationGroups: [], leafState: 'tLeaf', path: 'test', config: { code: 'firstName' } };
      const frmCtrl = this.hostComponent.form.controls[eve.config.code];
      spyOn(ValidationUtils, 'applyelementStyle').and.returnValue(true);
      this.hostComponent.ngOnInit();
      pageService.notifyErrorEvent(eve);
      expect(this.hostComponent.requiredCss).toBeFalsy();
      expect(ValidationUtils.applyelementStyle).toHaveBeenCalled();
    });
  });

  it('ngOnInit() should call pageService.postOnChange', async function (this: TestContext<CheckBoxGroup>) {
    const eve = { config: { uiStyles: { attributes: { postEventOnChange: true } } } };
    spyOn(pageService, 'postOnChange').and.callThrough();
    this.hostComponent.ngOnInit();
    this.hostComponent.controlValueChanged.next(eve);
    expect(pageService.postOnChange).toHaveBeenCalled();
  });

  it('ngOnInit() should not call pageService.postOnChange', async function (this: TestContext<CheckBoxGroup>) {
    const eve = { config: { uiStyles: { attributes: { postEventOnChange: false } } } };
    spyOn(pageService, 'postOnChange').and.callThrough();
    this.hostComponent.ngOnInit();
    this.hostComponent.controlValueChanged.next(eve);
    expect(pageService.postOnChange).not.toHaveBeenCalled();
  });

});