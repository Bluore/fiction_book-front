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
