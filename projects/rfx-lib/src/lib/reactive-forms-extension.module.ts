import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormBindingDirective} from './forms/form-binding.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    FormBindingDirective
  ],
  exports: [
    FormBindingDirective
  ]
})
export class ReactiveFormsExtensionModule {}
