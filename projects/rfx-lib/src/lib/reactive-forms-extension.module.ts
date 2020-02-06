import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBindingDirective } from './forms/form-binding.directive';
import { ObserveFormPipe } from './forms/observe-form.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    FormBindingDirective,
    ObserveFormPipe
  ],
  exports: [
    FormBindingDirective,
    ObserveFormPipe
  ]
})
export class ReactiveFormsExtensionModule {}
