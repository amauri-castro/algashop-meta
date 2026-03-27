import http from 'k6/http';
import { sleep, check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const options = {
  scenarios: {
    buy_now_smoke_test: {
      executor: 'constant-vus',
      vus: 1,
      duration: '5s'
    },
    buy_now_volume_test: {
      executor: 'constant-arrival-rate',
      rate: 60,
      timeUnit: '1s',
      duration: '1m',
      startTime: '5s',
      maxVUs: 200,
      preAllocatedVUs: 50
    }
  },
  thresholds: {
    http_req_duration: ['p(95) < 1200']
  }
};


export default function () {
  const url = `${BASE_URL}/api/v1/orders`;
  const params = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/vnd.order-with-product.v1+json'
    }
  }
  const payload = {
    customerId: "6e148bd5-47f6-4022-b9da-07cfaa294f7a",
    productId: "946cea3b-d11d-4f11-b88d-3089b4e74087",
    quantity: 2,
    paymentMethod: "GATEWAY_BALANCE",
    shipping: {
      recipient: {
        firstName: "John",
        lastName: "Doe",
        document: "12345",
        phone: "5511912341234"
      },
      address: {
        street: "Bourbon Street",
        number: "2500",
        complement: "apt 201",
        neighborhood: "North Ville",
        city: "Yostfort",
        state: "South Carolina",
        zipCode: "13232"
      }
    },
    billing: {
      firstName: "John",
      lastName: "Doe",
      document: "12345",
      phone: "5511912341234",
      email: "johndoe@email.com",
      address: {
        street: "Bourbon Street",
        number: "2500",
        complement: "apt 201",
        neighborhood: "North Ville",
        city: "Yostfort",
        state: "South Carolina",
        zipCode: "13232"
      }
    }
  };

  const json = JSON.stringify(payload);

  let res = http.post(url, json, params);
  check(res, { "status is 201": (res) => res.status === 201 });
  sleep(1);

}
