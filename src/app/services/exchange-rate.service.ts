import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {
  ConversionExchange,
  ExchangeRateFormGroupInterface,
  ExchangeRateInterface,
  Rate
} from "../interfaces/exchange-rate.interface";

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  accessKey: string = '272d949bd5c427760e6725bc537f0e21';

  constructor(private httpClient: HttpClient) {
  }

  getCountryList(): Observable<string[]> {
    return this.httpClient.get<ExchangeRateInterface>(`http://api.exchangeratesapi.io/v1/latest?access_key=${this.accessKey}&format=1`)
      .pipe(map(exchange => {
        const object: string[] = [];
        Object.entries(exchange?.rates).forEach(rate => object.push(rate[0]))
        return object;
      }));
  }

  getExchangeRate(): Observable<ExchangeRateInterface> {
    return this.httpClient.get<ExchangeRateInterface>(`http://api.exchangeratesapi.io/v1/latest?access_key=${this.accessKey}&format=1`);
  }

  getConversionValue(exchangeValue: ExchangeRateFormGroupInterface, exchangeRate: Rate[]): ConversionExchange | undefined {
    const findBuyCurr = exchangeRate?.find(rate => rate.country === exchangeValue.buyCurr);
    const findSellCurr = exchangeRate?.find(rate => rate.country === exchangeValue.sellCurr);
    if (findBuyCurr && findSellCurr) {
      const getSellCurrValue = (1 / findBuyCurr.value);
      const getSellRate =  getSellCurrValue * findSellCurr.value;

      const getBuyCurrValue = (1 / findSellCurr.value);
      const getBuyRate = getBuyCurrValue * findBuyCurr.value;

      return {
        perCurr: findSellCurr.country,
        perAmt: getSellRate,
        buyCurr: findBuyCurr.country,
        buyAmt: getBuyRate * exchangeValue.sellAmt,
        sellCurr: findSellCurr.country,
        sellAmt: getSellRate * exchangeValue.buyAmt,
      }
    }
    return undefined;
  }
}
