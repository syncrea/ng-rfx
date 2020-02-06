/*
 * Public API Surface of reactive-forms-extension
 */

export * from './lib/model';
export * from './lib/tokens';
export * from './lib/forms/form-state';
export * from './lib/forms/form-creation';
export * from './lib/forms/form-registry.service';
export * from './lib/forms/form-binding.directive';
export * from './lib/forms/observe-form.pipe';
export * from './lib/forms/typed-form-control';
export * from './lib/reactive-forms-extension.module';
export * from './lib/helper';

/**
 * @deprecated Use FormRegistry instead. FormRegistryService will be removed in the next major version.
 */
export { FormRegistry as FormRegistryService} from './lib/forms/form-registry.service';
