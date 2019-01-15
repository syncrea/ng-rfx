import {Directive, EmbeddedViewRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormDefinition, FormRegistryKey, FormState, InitialFormData, TypedFormControlType} from '../model';
import {FormRegistryService} from './form-registry.service';
import {noRegisteredFormForKeyAndNoFormDefinition} from '../errors';

export interface FormBindingDirectiveContext<T> {
  formControl: TypedFormControlType<T>;
  formState: FormState<T>;
}

export interface FormBindingDirectiveOptions<T> {
  initialData?: InitialFormData<T>;
  removeFormOnDestroy?: boolean;
}

@Directive({
  selector: '[rfxFormBinding]'
})
export class FormBindingDirective<F> implements OnInit, OnDestroy {
  @Input() rfxFormBinding: FormRegistryKey<F>;
  @Input() rfxFormBindingFormDefinition?: FormDefinition<F>;
  @Input() rfxFormBindingOptions?: FormBindingDirectiveOptions<F>;

  viewRef: EmbeddedViewRef<FormBindingDirectiveContext<F>>;
  context: FormBindingDirectiveContext<F>;
  formDataSubscription: Subscription;

  constructor(private formRegistry: FormRegistryService,
              private templateRef: TemplateRef<FormBindingDirectiveContext<F>>,
              private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    if (!this.formRegistry.containsForm(this.rfxFormBinding) && this.rfxFormBindingFormDefinition) {
      this.formRegistry.createAndRegisterForm(this.rfxFormBindingFormDefinition, {
        key: this.rfxFormBinding,
        initialData: this.rfxFormBindingOptions && this.rfxFormBindingOptions.initialData
      });
    }

    if (!this.formRegistry.containsForm(this.rfxFormBinding)) {
      noRegisteredFormForKeyAndNoFormDefinition(this.rfxFormBinding);
    }

    this.context = {
      formControl: null,
      formState: null
    };
    this.viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
    this.formDataSubscription = this.formRegistry.observeForm<F>(this.rfxFormBinding).subscribe(formData => {
      this.context.formState = formData.state;
      this.context.formControl = formData.control;
      this.viewRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.formDataSubscription.unsubscribe();
    if (this.rfxFormBindingOptions && this.rfxFormBindingOptions.removeFormOnDestroy) {
      this.formRegistry.removeForm(this.rfxFormBinding);
    }
  }
}
