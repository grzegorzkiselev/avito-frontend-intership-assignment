import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { advertisements_mock } from "./mocks";

const handlers = [
  http.get("http://localhost:3000/advertisements", () => {
    return HttpResponse.json(
      advertisements_mock,
      { status: 200 },
    );
  }),
];

export const server = setupServer(...handlers);
