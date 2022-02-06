export interface ExchangeRateInterface {
  success: string;
  timestamp: number;
  base: string;
  date: string;
  rates: CountryCodeInterface;
}

export interface CountryCodeInterface {
  [x: string]: number;
}

export interface Rate {
  country: string;
  value: number;
}

export interface ExchangeRateFormGroupInterface {
  buyCurr: string;
  buyAmt: number;
  sellCurr: string;
  sellAmt: number;
}

export interface ConversionExchange extends ExchangeRateFormGroupInterface{
  perCurr: string;
  perAmt: number;
}
