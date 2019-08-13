import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {globalReducers} from './app.state';
import {ReactiveFormsExtensionModule, RFX_ERROR_RESOLVER} from 'rfx-lib';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {errorResolver} from './error-resolver';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule, MatToolbarModule, MatIconModule, MatListModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {NavigationBarComponent} from './ui/navigation-bar/navigation-bar.component';

import {HighlightModule} from 'ngx-highlightjs';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';

export function hljsLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'scss', func: scss},
    {name: 'xml', func: xml}
  ];
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(globalReducers),
    ReactiveFormsExtensionModule,
    BrowserAnimationsModule,
    HighlightModule.forRoot({
      languages: hljsLanguages
    }),
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [{
    provide: RFX_ERROR_RESOLVER,
    useValue: errorResolver
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
