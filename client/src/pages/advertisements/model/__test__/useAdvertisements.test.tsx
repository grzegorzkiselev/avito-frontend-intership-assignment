import { renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { QueryProvider } from "../../../../app/providers";
import { useAdvertisements } from "../useAdvertisements";
import { pagination_test_happy_path } from "./mocks";
import { server } from "./server";

describe("Advertisements api interactoins", () => {
  it("Filtering test", async () => {
      const settings = {
        page: 4,
        paginationSize: 25,
      }

      server.use(
        http.get(`http://localhost:3000/advertisements?_page=${settings.page}&_per_page=${settings.page}`, () => {
          return new HttpResponse(
            JSON.stringify(pagination_test_happy_path),
            { status: 200 });
        }),
      )
      const { result } = renderHook(
        () => useAdvertisements(settings),
        {
          wrapper: ({ children }) => {
            return <QueryProvider>{ children }</QueryProvider>
          }
        }
      );

      const awaitMe = new Promise((resolve) => {
        const iId = setInterval(() => {
          console.log(result)
          if (result.current.data) {
            resolve(result.current.data)
            clearInterval(iId)
          }
        }, 200)
      })

      expect(awaitMe).resolves.toEqual(pagination_test_happy_path)
  });

  /** @todo
   * sorting
   * ranges
   * maybe negative tests
   */
})
