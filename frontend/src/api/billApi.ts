/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { apiService } from "../services/api.service";

class BillApi {
  async getbills(limit: number, page: number, price?: any, created_at?: any) {
    return new Promise((resolve, reject) => {
      try {
        const convertToNormalDate = (date: unknown) =>
          moment(date)
            .locale("en")
            // .add(type === 'from' ? 0 : 1, 'd')
            .format("YYYY-MM-DD");

        const priceQuery =
          price && price?.to !== 0
            ? `&price=${price?.from}to${price?.to}&`
            : "&";
        const created_atQuery =
          created_at && created_at?.from !== "" && created_at?.to !== ""
            ? `created_at=${convertToNormalDate(
                created_at?.from
              )}to${convertToNormalDate(created_at?.to)}`
            : "";

        const bills = apiService.get(
          `/bills/?limit=${limit}&page=${++page}${priceQuery}${created_atQuery}`
        );

        resolve(bills);
      } catch (err) {
        console.log(err);
        reject(new Error("Internal server error"));
      }
    });
  }
}

export const billApi = new BillApi();
