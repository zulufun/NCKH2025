// services/thongkect.tsx
import createApiServices from "../createApiServices";
import { PromotionType } from "../../pages/thong-ke-ct/types";

const api = createApiServices();

const getPromotion = () => {
  return api.makeAuthRequest({
    url: "/api/v1/promotion",
    method: "GET",
  });
};

const createPromotion = (data: { name: string; id_product: string }) => {
  return api.makeAuthRequest({
    url: "/api/v1/promotion",
    method: "POST",
    data,
  });
};

const deletePromotion = (id: number) => {
  return api.makeAuthRequest({
    url: `/api/v1/promotion/${id}`,
    method: "DELETE",
  });
};

const updatePromotion = (id: number, data: { name: string; id_product: string }) => {
  return api.makeAuthRequest({
    url: `/api/v1/promotion/${id}`,
    method: "PUT",
    data,
  });
};

export { getPromotion, createPromotion, deletePromotion, updatePromotion };
