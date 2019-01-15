import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DynamicPersonComponent} from './dynamic-form/dynamic-person/dynamic-person.component';
import {DynamicPersonContainerComponent} from './dynamic-form/dynamic-person-container/dynamic-person-container.component';
import {StoreModule} from '@ngrx/store';
import {globalEffects, globalReducers} from './app.state';
import {EffectsModule} from '@ngrx/effects';
import {ReactiveFormsExtensionModule, RFX_ERROR_RESOLVER} from 'rfx-lib';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {errorResolver} from './error-resolver';

@NgModule({
  declarations: [
    AppComponent,
    DynamicPersonComponent,
    DynamicPersonContainerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(globalReducers),
    EffectsModule.forRoot(globalEffects),
    ReactiveFormsExtensionModule
  ],
  providers: [{
    provide: RFX_ERROR_RESOLVER,
    useValue: errorResolver
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
