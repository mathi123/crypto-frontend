import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogoComponent} from './logo/logo.component';
import {MaterialModule} from '../material.module';
import {HeaderComponent} from './header/header.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule
    ],
    declarations: [
        LogoComponent,
        HeaderComponent,
        FooterComponent
    ],
    exports: [
        LogoComponent,
        HeaderComponent,
        FooterComponent
    ]
})
export class CryptoCommonModule {
}
