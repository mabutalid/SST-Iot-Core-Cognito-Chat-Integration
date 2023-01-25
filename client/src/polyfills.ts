import 'react-app-polyfill/ie11';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';

(window as any).global = window;

(window as any).process = {
  env: { DEBUG: undefined },
};