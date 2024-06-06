const { getAllGenres } = require("../genre.controllers");
import { describe, expect, test } from "@jest/globals";

describe("get all genres", () => {
  test("testing 1+1", () => {
    expect(1 + 1).toBe(2);
  });
  // test("tiene que devolver COSAS", () => {
  //   const mockReq = {};
  //   const mockRes = {
  //     status: jest.fn(),
  //     send: jest.fn(),
  //   };
  //   getAllGenres(mockReq, mockRes);
  //   expect(mockRes.status).toHaveBeenCalled();
  // });
});
