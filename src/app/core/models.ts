// TypeScript shapes of the JSON your Spring API sends and receives.
// They mirror the Java records, so the editor catches typos like "subscriptonStatus".

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export interface Account {
  id: number;
  email: string;
  subscriptionStatus: SubscriptionStatus;
}
