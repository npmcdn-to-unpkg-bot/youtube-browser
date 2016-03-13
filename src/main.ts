import { bootstrap } from 'angular2/platform/browser';
import { App } from './app'
import { Constants } from './constants'
import { enableProdMode } from 'angular2/core';

if (!Constants.DEBUG) enableProdMode();
bootstrap(App);