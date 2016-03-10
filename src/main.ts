import {bootstrap}    from 'angular2/platform/browser'
import {ROUTER_PROVIDERS}  from 'angular2/router';
// Add these symbols to override the `LocationStrategy`
import {provide}           from 'angular2/core';
import {LocationStrategy,
        HashLocationStrategy} from 'angular2/router';
        
import {App} from './app'

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy,
         {useClass: HashLocationStrategy}) // .../#/crisis-center/
]);