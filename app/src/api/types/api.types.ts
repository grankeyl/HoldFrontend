/* _____ Auth _____ */

export interface AuthPayload {
  initData: string;
}



/* _____ Wallet _____ */

export interface WalletConnectPayload {
  address: string;
}



/* _____ Leaders _____ */

export interface LeadersGetPayload {
  offset: number;
  limit: number;
}



/* _____ User _____ */

export interface UserRewardPayload {
  sum: number;
}

export interface UserGetFriendsPayload {
  offset: number;
  limit: number;
}

export interface UserFriendsCollect {}

export interface UserFriendsUpgrade {
  action: string | number;
}

export interface UserFriendsUpgradeGet {
  user_id: number;
  type: string;
}



/* _____ Ads _____ */

export interface AdsRequestPayload {
  task_type: string;
  user_id?: number;
}

export interface AdsCompletePayload {
  reward_token: string;
}



/* _____ Friends _____ */

export interface FriendsGet {
  offset: number;
  limit: number;
  level?: number;
}

export interface FriendsCollect {

}

export interface FriendsUpgrade {
  action: string | number;
}

export interface FriendsUpgradeGet {
  user_id: number;
  type: string;
}



/* _____ Tasks _____ */

export interface TasksUsePayload {
  taskId: string;
  taskProgress: any;
}



/* _____ Telegram _____ */

export interface TelegramCheckUserChannelPayload {
  channel_id: string;
}