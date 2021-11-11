import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
// @ts-ignore
import scss from 'highlight.js/lib/languages/scss';
// @ts-ignore
import typescript from 'highlight.js/lib/languages/typescript';
// @ts-ignore
import xml from 'highlight.js/lib/languages/xml';
import { HighlightModule } from 'ngx-highlightjs';
import { ReactiveFormsExtensionModule } from 'rfx-lib';
import { AppComponent } from './app.component';
import { globalReducers } from './app.state';
import { NavigationBarComponent } from './ui/navigation-bar/navigation-bar.component';




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
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
