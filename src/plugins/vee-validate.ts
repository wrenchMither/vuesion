import { extend } from 'vee-validate';
import { required, email, integer, min } from 'vee-validate/dist/rules';

extend('required', required);
extend('email', email);
extend('integer', integer);
extend('min', min);
