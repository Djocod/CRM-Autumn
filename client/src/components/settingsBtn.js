import axios from "axios";

export function addPurchase(addId, userId, typeSes) {
  axios
    .patch(`http://localhost:8000/api/users/${typeSes}/${addId}/purchase`, {
      userId: userId,
    })
    .then((res) => console.log(res.data));
}

export function addview(addId, userId) {
  axios
    .patch(`http://localhost:8000/api/users/${addId}/viewed`, {
      userId: userId,
    })
    .then((res) => console.log(res.data));
}
//========================================================
export function deletePurchase(productId, userId, typeSes) {
  axios
    .delete(
      `http://localhost:8000/api/users/${typeSes}/${productId}/purchase`,
      {
        data: { userId: userId },
      },
    )
    .then((res) => console.log(res.data));
}

export function deleteView(productId, userId) {
  axios
    .delete(`http://localhost:8000/api/users/${productId}/viewed`, {
      data: { userId: userId },
    })
    .then((res) => console.log(res.data));
}
