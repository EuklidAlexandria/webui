import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgUploaderModule} from 'ngx-uploader';
import { MaterialModule, MdTableModule } from '@angular/material';

import {EntityModule} from '../common/entity/entity.module';

import {routing} from './plugins.routing';
import { PluginsAvailabelListComponent } from './plugins-available/plugins-available-list/plugins-available-list.component';
import { PluginAddComponent } from './plugin-add/plugin-add.component';

@NgModule({
  imports : [
    EntityModule, CommonModule, FormsModule,
    ReactiveFormsModule, NgUploaderModule, routing, MaterialModule
  ],
  declarations : [
  	PluginsAvailabelListComponent,
  	PluginAddComponent
  ]
})
export class PluginsModule {
}
