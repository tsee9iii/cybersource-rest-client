import { createHmac, createHash } from "crypto";

export interface CyberSourceAuthParams {
  merchantId: string;
  apiKey: string;
  sharedSecretKey: string;
  method: string;
  path: string;
  body?: any;
  host: string;
}

export interface AuthHeaders {
  "v-c-merchant-id": string;
  date: string;
  digest?: string;
  signature: string;
  host: string;
  "content-type": string;
}

export class CyberSourceAuthUtil {
  /**
   * Generate CyberSource HTTP Signature authentication headers
   */
  static generateAuthHeaders(params: CyberSourceAuthParams): AuthHeaders {
    const { merchantId, apiKey, sharedSecretKey, method, path, body, host } =
      params;

    // Generate RFC1123 formatted date
    const date = new Date().toUTCString();

    // Generate digest for request body (if present)
    let digest: string | undefined;
    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      const bodyString = typeof body === "string" ? body : JSON.stringify(body);
      const hash = createHash("sha256")
        .update(bodyString, "utf8")
        .digest("base64");
      digest = `SHA-256=${hash}`;
    }

    // Create request target for signature
    const requestTarget = `${method.toLowerCase()} ${path}`;

    // Build signature string (order is critical!)
    const signatureStringParts: string[] = [
      `host: ${host}`,
      `date: ${date}`,
      `request-target: ${requestTarget}`,
    ];

    // Add digest if present (POST/PUT/PATCH)
    if (digest) {
      signatureStringParts.push(`digest: ${digest}`);
    }

    // Always add merchant ID last
    signatureStringParts.push(`v-c-merchant-id: ${merchantId}`);

    const signatureString = signatureStringParts.join("\n");

    // Generate HMAC SHA-256 signature
    const decodedSecret = Buffer.from(sharedSecretKey, "base64");
    const hmac = createHmac("sha256", decodedSecret);
    hmac.update(signatureString, "utf8");
    const signatureValue = hmac.digest("base64");

    // Build headers list for signature header
    const headersList = digest
      ? "host date request-target digest v-c-merchant-id"
      : "host date request-target v-c-merchant-id";

    // Build signature header value
    const signatureHeader = `keyid="${apiKey}", algorithm="HmacSHA256", headers="${headersList}", signature="${signatureValue}"`;

    // Build final headers
    const headers: AuthHeaders = {
      "v-c-merchant-id": merchantId,
      date: date,
      signature: signatureHeader,
      host: host,
      "content-type": "application/json",
    };

    if (digest) {
      headers.digest = digest;
    }

    return headers;
  }

  /**
   * Extract host from URL
   */
  static extractHost(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.host;
    } catch {
      // Fallback for relative URLs or malformed URLs
      return url.replace(/^https?:\/\//, "").split("/")[0];
    }
  }

  /**
   * Extract path from URL
   */
  static extractPath(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      // Fallback for relative URLs
      return url.replace(/^https?:\/\/[^\/]+/, "") || "/";
    }
  }
}
