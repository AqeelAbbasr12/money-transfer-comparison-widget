export interface ComparisonRequest {
  sourceCurrency: string;
  targetCurrency: string;
  sendAmount: number;
}

export interface Provider {
  name: string;
  fee: number;
  rate: number;
  receivedAmount: number;
  deliveryEstimate: string;
}


export interface WiseApiComparison {
  providers: WiseApiProvider[];
}

export interface WiseApiProvider {
  name: string;
  quotes: WiseApiQuote[];
}

export interface WiseApiQuote {
  rate: number;
  fee: number;
  receivedAmount: number;
  deliveryEstimation: WiseApiDeliveryEstimation | null;
}

export interface WiseApiDeliveryEstimation {
  providerGivesEstimate: boolean;
  duration: {
    min: string | null;
    max: string | null;
  } | null;
}