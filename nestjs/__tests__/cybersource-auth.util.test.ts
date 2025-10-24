import { describe, expect, it, beforeEach } from "@jest/globals";
import { createHash } from "crypto";
import { CyberSourceAuthUtil } from "../utils/cybersource-auth.util";

describe("CyberSourceAuthUtil", () => {
  const mockParams = {
    merchantId: "test_merchant_123",
    apiKey: "test-api-key-uuid",
    sharedSecretKey: Buffer.from("test-shared-secret").toString("base64"),
    host: "apitest.cybersource.com",
  };

  describe("generateAuthHeaders - GET requests", () => {
    it("should generate auth headers for GET request without body", () => {
      const params = {
        ...mockParams,
        method: "GET",
        path: "/tms/v2/customers",
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers).toHaveProperty("v-c-merchant-id", mockParams.merchantId);
      expect(headers).toHaveProperty("v-c-date");
      expect(headers).toHaveProperty("signature");
      expect(headers).toHaveProperty("host", mockParams.host);
      expect(headers).toHaveProperty("content-type", "application/json");
      expect(headers).not.toHaveProperty("digest");
    });

    it("should generate valid RFC1123 date format", () => {
      const params = {
        ...mockParams,
        method: "GET",
        path: "/tms/v2/customers",
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      // RFC1123 format: "Wed, 23 Oct 2025 12:34:56 GMT"
      expect(headers["v-c-date"]).toMatch(
        /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/
      );
    });

    it("should include correct headers in signature for GET", () => {
      const params = {
        ...mockParams,
        method: "GET",
        path: "/tms/v2/customers",
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.signature).toContain('keyid="test-api-key-uuid"');
      expect(headers.signature).toContain('algorithm="HmacSHA256"');
      expect(headers.signature).toContain(
        'headers="host v-c-date request-target v-c-merchant-id"'
      );
      expect(headers.signature).toContain('signature="');
    });

    it("should handle GET request with query parameters", () => {
      const params = {
        ...mockParams,
        method: "GET",
        path: "/tms/v2/customers?offset=0&limit=20",
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers).toHaveProperty("signature");
      expect(headers.signature).toContain('headers="');
    });
  });

  describe("generateAuthHeaders - POST requests", () => {
    it("should generate auth headers for POST request with body", () => {
      const requestBody = {
        clientReferenceInformation: {
          code: "TEST123",
        },
      };

      const params = {
        ...mockParams,
        method: "POST",
        path: "/tms/v2/customers",
        body: requestBody,
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers).toHaveProperty("v-c-merchant-id", mockParams.merchantId);
      expect(headers).toHaveProperty("v-c-date");
      expect(headers).toHaveProperty("digest");
      expect(headers).toHaveProperty("signature");
      expect(headers).toHaveProperty("host", mockParams.host);
      expect(headers).toHaveProperty("content-type", "application/json");
    });

    it("should generate correct SHA-256 digest for request body", () => {
      const requestBody = { test: "data" };
      const bodyString = JSON.stringify(requestBody);
      const expectedHash = createHash("sha256")
        .update(bodyString, "utf8")
        .digest("base64");

      const params = {
        ...mockParams,
        method: "POST",
        path: "/tms/v2/customers",
        body: requestBody,
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBe(`SHA-256=${expectedHash}`);
    });

    it("should handle body as string", () => {
      const bodyString = '{"test":"data"}';
      const expectedHash = createHash("sha256")
        .update(bodyString, "utf8")
        .digest("base64");

      const params = {
        ...mockParams,
        method: "POST",
        path: "/tms/v2/customers",
        body: bodyString,
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBe(`SHA-256=${expectedHash}`);
    });

    it("should include digest in signature headers for POST", () => {
      const params = {
        ...mockParams,
        method: "POST",
        path: "/tms/v2/customers",
        body: { test: "data" },
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.signature).toContain(
        'headers="host v-c-date request-target digest v-c-merchant-id"'
      );
    });

    it("should handle empty object body", () => {
      const params = {
        ...mockParams,
        method: "POST",
        path: "/tms/v2/customers",
        body: {},
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBeDefined();
      expect(headers.digest).toMatch(/^SHA-256=/);
    });

    it("should handle complex nested body", () => {
      const complexBody = {
        level1: {
          level2: {
            array: [1, 2, 3],
            string: "test",
            number: 123,
          },
        },
      };

      const params = {
        ...mockParams,
        method: "POST",
        path: "/tms/v2/customers",
        body: complexBody,
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBeDefined();
      expect(headers.signature).toContain("digest");
    });
  });

  describe("generateAuthHeaders - PUT requests", () => {
    it("should generate digest for PUT request with body", () => {
      const params = {
        ...mockParams,
        method: "PUT",
        path: "/tms/v2/customers/123",
        body: { name: "Updated Name" },
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBeDefined();
      expect(headers.digest).toMatch(/^SHA-256=/);
    });

    it("should include digest in signature for PUT", () => {
      const params = {
        ...mockParams,
        method: "PUT",
        path: "/tms/v2/customers/123",
        body: { name: "Updated" },
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.signature).toContain("digest");
    });
  });

  describe("generateAuthHeaders - PATCH requests", () => {
    it("should generate digest for PATCH request with body", () => {
      const params = {
        ...mockParams,
        method: "PATCH",
        path: "/tms/v2/customers/123",
        body: { status: "active" },
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBeDefined();
      expect(headers.digest).toMatch(/^SHA-256=/);
    });

    it("should include digest in signature for PATCH", () => {
      const params = {
        ...mockParams,
        method: "PATCH",
        path: "/tms/v2/customers/123",
        body: { status: "active" },
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.signature).toContain("digest");
    });
  });

  describe("generateAuthHeaders - DELETE requests", () => {
    it("should not generate digest for DELETE request", () => {
      const params = {
        ...mockParams,
        method: "DELETE",
        path: "/tms/v2/customers/123",
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBeUndefined();
      expect(headers.signature).not.toContain("digest");
    });

    it("should not include digest even if body is provided for DELETE", () => {
      const params = {
        ...mockParams,
        method: "DELETE",
        path: "/tms/v2/customers/123",
        body: { reason: "test" }, // Some APIs allow body in DELETE
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBeUndefined();
    });
  });

  describe("generateAuthHeaders - signature consistency", () => {
    it("should generate same signature for identical requests", () => {
      const params = {
        ...mockParams,
        method: "GET",
        path: "/tms/v2/customers",
      };

      // Mock Date to ensure consistent timestamps
      const fixedDate = new Date("2025-10-23T12:00:00Z");
      const originalDate = global.Date;
      global.Date = jest.fn(() => fixedDate) as any;
      global.Date.UTC = originalDate.UTC;
      global.Date.parse = originalDate.parse;
      global.Date.now = originalDate.now;

      const headers1 = CyberSourceAuthUtil.generateAuthHeaders(params);
      const headers2 = CyberSourceAuthUtil.generateAuthHeaders(params);

      global.Date = originalDate;

      expect(headers1.signature).toBe(headers2.signature);
    });

    it("should generate different signatures for different paths", () => {
      const fixedDate = new Date("2025-10-23T12:00:00Z");
      const originalDate = global.Date;
      global.Date = jest.fn(() => fixedDate) as any;
      global.Date.UTC = originalDate.UTC;
      global.Date.parse = originalDate.parse;
      global.Date.now = originalDate.now;

      const headers1 = CyberSourceAuthUtil.generateAuthHeaders({
        ...mockParams,
        method: "GET",
        path: "/tms/v2/customers",
      });

      const headers2 = CyberSourceAuthUtil.generateAuthHeaders({
        ...mockParams,
        method: "GET",
        path: "/tms/v2/instruments",
      });

      global.Date = originalDate;

      expect(headers1.signature).not.toBe(headers2.signature);
    });

    it("should generate different signatures for different methods", () => {
      const fixedDate = new Date("2025-10-23T12:00:00Z");
      const originalDate = global.Date;
      global.Date = jest.fn(() => fixedDate) as any;
      global.Date.UTC = originalDate.UTC;
      global.Date.parse = originalDate.parse;
      global.Date.now = originalDate.now;

      const headers1 = CyberSourceAuthUtil.generateAuthHeaders({
        ...mockParams,
        method: "GET",
        path: "/tms/v2/customers",
      });

      const headers2 = CyberSourceAuthUtil.generateAuthHeaders({
        ...mockParams,
        method: "POST",
        path: "/tms/v2/customers",
        body: {},
      });

      global.Date = originalDate;

      expect(headers1.signature).not.toBe(headers2.signature);
    });
  });

  describe("extractHost", () => {
    it("should extract host from full URL", () => {
      const host = CyberSourceAuthUtil.extractHost(
        "https://apitest.cybersource.com/tms/v2/customers"
      );
      expect(host).toBe("apitest.cybersource.com");
    });

    it("should extract host with port", () => {
      const host = CyberSourceAuthUtil.extractHost(
        "https://api.example.com:8443/api/v1"
      );
      expect(host).toBe("api.example.com:8443");
    });

    it("should handle HTTP URLs", () => {
      const host = CyberSourceAuthUtil.extractHost("http://localhost:3000/api");
      expect(host).toBe("localhost:3000");
    });

    it("should handle URLs without protocol", () => {
      const host = CyberSourceAuthUtil.extractHost(
        "apitest.cybersource.com/tms/v2/customers"
      );
      expect(host).toBe("apitest.cybersource.com");
    });

    it("should handle malformed URLs gracefully", () => {
      const host = CyberSourceAuthUtil.extractHost("not-a-valid-url");
      expect(host).toBe("not-a-valid-url");
    });

    it("should handle URL with subdomain", () => {
      const host = CyberSourceAuthUtil.extractHost(
        "https://api.sandbox.example.com/v1"
      );
      expect(host).toBe("api.sandbox.example.com");
    });
  });

  describe("extractPath", () => {
    it("should extract path from full URL", () => {
      const path = CyberSourceAuthUtil.extractPath(
        "https://apitest.cybersource.com/tms/v2/customers"
      );
      expect(path).toBe("/tms/v2/customers");
    });

    it("should extract path with query parameters", () => {
      const path = CyberSourceAuthUtil.extractPath(
        "https://api.example.com/api/v1/users?limit=10&offset=0"
      );
      expect(path).toBe("/api/v1/users?limit=10&offset=0");
    });

    it("should handle root path", () => {
      const path = CyberSourceAuthUtil.extractPath("https://api.example.com/");
      expect(path).toBe("/");
    });

    it("should handle URL without path", () => {
      const path = CyberSourceAuthUtil.extractPath("https://api.example.com");
      expect(path).toBe("/");
    });

    it("should handle relative URLs", () => {
      const path = CyberSourceAuthUtil.extractPath("/api/v1/users");
      expect(path).toBe("/api/v1/users");
    });

    it("should handle malformed URLs gracefully", () => {
      const path = CyberSourceAuthUtil.extractPath("not-a-url");
      expect(path).toBe("not-a-url");
    });

    it("should preserve query string encoding", () => {
      const path = CyberSourceAuthUtil.extractPath(
        "https://api.example.com/search?q=hello%20world&page=1"
      );
      expect(path).toBe("/search?q=hello%20world&page=1");
    });

    it("should handle hash fragments", () => {
      const path = CyberSourceAuthUtil.extractPath(
        "https://api.example.com/api/v1#section"
      );
      expect(path).toBe("/api/v1");
    });
  });

  describe("edge cases and special scenarios", () => {
    it("should handle very long paths", () => {
      const longPath = "/api/" + "segment/".repeat(100) + "endpoint";
      const params = {
        ...mockParams,
        method: "GET",
        path: longPath,
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers).toHaveProperty("signature");
    });

    it("should handle special characters in path", () => {
      const params = {
        ...mockParams,
        method: "GET",
        path: "/api/v1/users/john-doe@example.com",
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers).toHaveProperty("signature");
    });

    it("should handle Unicode characters in body", () => {
      const params = {
        ...mockParams,
        method: "POST",
        path: "/api/v1/customers",
        body: {
          name: "José García",
          emoji: "🎉",
          chinese: "你好",
        },
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.digest).toBeDefined();
      expect(headers.signature).toContain("digest");
    });

    it("should handle empty string path", () => {
      const params = {
        ...mockParams,
        method: "GET",
        path: "",
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers).toHaveProperty("signature");
    });

    it("should handle different API key formats", () => {
      const params = {
        ...mockParams,
        apiKey: "550e8400-e29b-41d4-a716-446655440000",
        method: "GET",
        path: "/api/v1",
      };

      const headers = CyberSourceAuthUtil.generateAuthHeaders(params);

      expect(headers.signature).toContain(
        'keyid="550e8400-e29b-41d4-a716-446655440000"'
      );
    });
  });
});
