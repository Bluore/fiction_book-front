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

export const createGoldOrder = (data: CreateGoldOrderPayload) => {
  return request.post<ApiResponse<CreateGoldOrderResponseData>>('/orders/create/gold', data);
};
