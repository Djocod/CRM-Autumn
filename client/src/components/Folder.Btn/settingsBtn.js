import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export function addPurchase(addId, userId, typeSes) {
  axios
    .patch(`${API_URL}/api/users/${typeSes}/${addId}/purchase`, {
      userId: userId,
    })
    .then((res) => console.log(res.data));
}

export function addview(addId, userId) {
  axios
    .patch(`${API_URL}/api/users/${addId}/viewed`, {
      userId: userId,
    })
    .then((res) => console.log(res.data));
}
//========================================================
export function deletePurchase(productId, userId, typeSes) {
  axios
    .delete(`${API_URL}/api/users/${typeSes}/${productId}/purchase`, {
      data: { userId: userId },
    })
    .then((res) => console.log(res.data));
}

export function deleteView(productId, userId) {
  axios
    .delete(`${API_URL}/api/users/${productId}/viewed`, {
      data: { userId: userId },
    })
    .then((res) => console.log(res.data));
}
