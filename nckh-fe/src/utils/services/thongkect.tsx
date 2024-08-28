// services/thongkect.tsx
import createApiServices from "../createApiServices";
import { Type } from "../../pages/thong-ke-ct/types";

const api = createApiServices();

const get = () => {
  return api.makeAuthRequest({
    url: "/api/v1/thongkect",
    method: "GET",
  });
};

const create = (data: { name: string; id_product: string }) => {
  return api.makeAuthRequest({
    url: "/api/v1/create",
    method: "POST",
    data,
  });
};

// const delete = (id: number) => {
//   return api.makeAuthRequest({
//     url: `/api/v1/delete/${id}`,
//     method: "DELETE",
//   });
// };

const update = (id: number, data: { name: string; id_product: string }) => {
  return api.makeAuthRequest({
    url: `/api/v1/update/${id}`,
    method: "PUT",
    data,
  });
};

export { get, create, update };
