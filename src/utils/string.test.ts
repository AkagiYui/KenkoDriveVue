import { expect, test, vi } from "vitest"
import { buildUrl } from "./string"

//function buildUrl(url: string, params?: Record<string, any>, baseURL?: string, useLocation?: boolean): string

// mock window.location
const location = {
  origin: "http://localhost:8080",
}
vi.stubGlobal("window", { location })

type TestCases = {
  [key: string]: {
    func: Function
    cases: [string, any[], any][]
  }
}

const testCases: TestCases = {
  buildUrl: {
    func: buildUrl,
    cases: [
      ["only relative url", ["/api"], "/api"],
      ["relative url with params", ["/api", { id: 1 }], "/api?id=1"],
      ["relative url and absolute base url", ["/api", undefined, "http://localhost:8080"], "http://localhost:8080/api"],
      [
        "relative url with params and absolute base url",
        ["/api", { id: 1 }, "http://localhost:8080"],
        "http://localhost:8080/api?id=1",
      ],
      ["relative url with params and base url is only a slash", ["/api", { id: 1 }, "/"], "/api?id=1"],
      ["relative url with params and relative base url", ["/api", { id: 1 }, "/base"], "/base/api?id=1"],
      [
        "relative url with params and relative base url and use location",
        ["/api", { id: 1 }, "/base", true],
        "http://localhost:8080/base/api?id=1",
      ],
      [
        "relative url with params and relative base url but not use location",
        ["/api", { id: 1 }, "/base", false],
        "/base/api?id=1",
      ],
    ],
  },
}

Object.entries(testCases).forEach(([name, { func, cases }]) => {
  cases.forEach(([desc, args, expected]) => {
    test(`${name} ${desc}`, () => {
      expect(func(...args)).toBe(expected)
    })
  })
})
