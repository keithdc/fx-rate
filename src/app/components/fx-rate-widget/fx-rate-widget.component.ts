import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExchangeRateService} from "../../services/exchange-rate.service";
import {forkJoin, Subject, take, takeUntil} from "rxjs";
import {ConversionExchange, ExchangeRateInterface, Rate} from "../../interfaces/exchange-rate.interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-fx-rate-widget',
  templateUrl: './fx-rate-widget.component.html',
  styleUrls: ['./fx-rate-widget.component.css']
})
export class FxRateWidgetComponent implements OnInit, OnDestroy {
  exchangeRate: ExchangeRateInterface | undefined;
  formGroup: FormGroup;
  rates: Rate[] = [];
  countryCode: string[] = [];
  buyCountryCode: string[] = [];
  sellCountryCode: string[] = [];
  conversionValue: ConversionExchange | undefined;
  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(private exchangeRateService: ExchangeRateService, private formBuilder: FormBuilder, private decimalPipe: DecimalPipe) {
    this.formGroup = this.formBuilder.group({
      buyCurr: [null],
      buyAmt: [null],
      sellCurr: [null],
      sellAmt: [null]
    })
    this.formGroup.get('buyCurr')?.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(value => {
      this.buyCountryCode = this.countryCode.filter(f => f.toLowerCase().includes(value));
      if (this.buyCountryCode.length === 0) {
        this.convert();
        this.formGroup.patchValue({buyAmt: this.decimalPipe.transform(this.conversionValue?.buyAmt, '1.2-3')}, {emitEvent: false});
      }
    });
    this.formGroup.get('sellCurr')?.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(value => {
      this.sellCountryCode = this.countryCode.filter(f => f.toLowerCase().includes(value));
      if (this.sellCountryCode.length === 0) {
        this.convert();
        this.formGroup.patchValue({sellAmt: this.decimalPipe.transform(this.conversionValue?.sellAmt, '1.2-3')}, {emitEvent: false});
      }
    });
    this.formGroup.get('buyAmt')?.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(value => {
      this.convert();
      this.formGroup.patchValue({sellAmt: this.decimalPipe.transform(this.conversionValue?.sellAmt, '1.2-3')}, {emitEvent: false});
    });
    this.formGroup.get('sellAmt')?.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(value => {
      this.convert();
      this.formGroup.patchValue({buyAmt: this.decimalPipe.transform(this.conversionValue?.buyAmt, '1.2-3')}, {emitEvent: false});
    });
  }

  ngOnInit(): void {
    forkJoin({
      countryCode: this.exchangeRateService.getCountryList(),
      exchangeRate: this.exchangeRateService.getExchangeRate()
    }).pipe(take(1)).subscribe(res => {
      this.countryCode = res.countryCode;
      this.buyCountryCode = res.countryCode;
      this.sellCountryCode = res.countryCode;
      this.exchangeRate = res.exchangeRate;
      Object.entries(this.exchangeRate.rates).forEach(rate => this.rates.push({country: rate[0], value: rate[1]}));
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  convert(): void {
    this.conversionValue = this.exchangeRateService.getConversionValue(this.formGroup.getRawValue(), this.rates);
  }
}
