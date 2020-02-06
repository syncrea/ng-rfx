import {Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormDefinition, FormRegistryKey, FormState, InitialFormData, TypedFormControlInfer} from '../model';
import {FormRegistry} from './form-registry.service';
import {noRegisteredFormForKeyAndNoFormDefinition} from '../errors';

export interface FormBindingDirectiveContext<T> {
  formControl: TypedFormControlInfer<T>;
  formState: FormState<T>;
}

export interface FormBindingDirectiveOptions<T> {
  initialData?: InitialFormData<T>;
  removeFormOnDestroy?: boolean;
}

/**
 * @deprecated The use of this directive is not suggested anymore. Please use the pipes to extract form state or value from the FormRegistryService.
 */
@Directive({
  selector: '[rfxFormBinding]'
})
export class FormBindingDirective<F> implements OnInit, OnChanges, OnDestroy {
  @Input() rfxFormBinding: FormRegistryKey<F>;
  @Input() rfxFormBindingFormDefinition?: FormDefinition<F>;
  @Input() rfxFormBindingOptions?: FormBindingDirectiveOptions<F>;

  private viewRef?: EmbeddedViewRef<FormBindingDirectiveContext<F>>;
  private formDataSubscription?: Subscription;

  constructor(private formRegistry: FormRegistry,
              private templateRef: TemplateRef<FormBindingDirectiveContext<F>>,
              private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef, <any>{});
    this.ensureValidForm();
    this.observeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.rfxFormBinding.firstChange && this.rfxFormBinding) {
      this.ensureValidForm();
      this.observeForm();
    }
  }

  private ensureValidForm() {
    if (!this.formRegistry.containsForm(this.rfxFormBinding) && this.rfxFormBindingFormDefinition) {
      this.formRegistry.createAndRegisterForm(this.rfxFormBindingFormDefinition, {
        key: this.rfxFormBinding,
        initialData: this.rfxFormBindingOptions && this.rfxFormBindingOptions.initialData
      });
    }

    if (!this.formRegistry.containsForm(this.rfxFormBinding)) {
      noRegisteredFormForKeyAndNoFormDefinition(this.rfxFormBinding);
    }
  }

  private observeForm() {
    if (this.formDataSubscription) {
      this.formDataSubscription.unsubscribe();
    }

    const formDataObservable = this.formRegistry
      .observeForm<F>(this.rfxFormBinding);

    if (formDataObservable) {
      this.formDataSubscription = formDataObservable.subscribe(formData => {
        if (this.viewRef) {
          this.viewRef.context.formState = formData.state;
          this.viewRef.context.formControl = formData.control;
          this.viewRef.markForCheck();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.formDataSubscription) {
      this.formDataSubscription.unsubscribe();
    }
    if (this.rfxFormBindingOptions && this.rfxFormBindingOptions.removeFormOnDestroy && this.rfxFormBinding) {
      this.formRegistry.removeForm(this.rfxFormBinding);
    }
  }
}
