export interface AuthPayload {
  initData: string;
}

export interface WalletConnectPayload {
  address: string;
}

export interface LeadersGetPayload {
  offset: number;
  limit: number;
}

export interface UserRewardPayload {
  sum: number;
}

export interface AdsRequestPayload {
  task_type: string;
}

export interface AdsCompletePayload {
  reward_token: string;
}