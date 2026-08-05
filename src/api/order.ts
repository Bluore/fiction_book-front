import request, { type ApiResponse } from './request';

interface CreateGoldOrderPayload {
  price: number;
  reward_gold: number;
}

interface CreateGoldOrderResponseData {
  order_id: string;
  pay_url: string;
  price: number;
}

interface GetOrderResponseData {
  order_id: string;
  user_id: string;
  pay_price: number;
  original_price: number;
  reword_gold: number;
  past_at: string;
  status: number;
  created_at: string;
}

export const createGoldOrder = (data: CreateGoldOrderPayload) => {
  return request.post<ApiResponse<CreateGoldOrderResponseData>>('/orders/create/gold', data);
};

export const getOrder = (id: string) => {
  return request.get<ApiResponse<GetOrderResponseData>>(`/orders/${id}`);
};

export interface VipShopItem {
  type: string;
  vip_level: string;
  price: number;
  duration: string;
  active_at: string;
}

export interface VipShopResponse {
  shop: VipShopItem[];
}

export const getVipShopApi = () => {
  return request.get<ApiResponse<VipShopResponse>>('/purchases/vip/shop', { baseURL: '/api/v2' });
};

export interface BuyVipPayload {
  duration: string;
  price: number;
  vip_level: string;
}

export const buyVipApi = (data: BuyVipPayload) => {
  return request.post<ApiResponse<any>>('/purchases/vip', data, { baseURL: '/api/v2' });
};

export interface UpgradeVipPayload {
  original_vip_level: string;
  target_vip_level: string;
  price: number;
}

export const upgradeVipApi = (data: UpgradeVipPayload) => {
  return request.post<ApiResponse<any>>('/purchases/vip/upgrade', data, { baseURL: '/api/v2' });
};
