import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserveFormPipe } from './forms/observe-form.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ObserveFormPipe
  ],
  exports: [
    ObserveFormPipe
  ]
})
export class ReactiveFormsExtensionModule {}
