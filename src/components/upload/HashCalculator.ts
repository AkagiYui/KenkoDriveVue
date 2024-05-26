/** SHA-256 计算器 */
export class SHA256Calculator {
  private digestBuffer: Uint8Array

  public constructor() {
    this.digestBuffer = new Uint8Array()
  }

  /**
   * 添加数据
   */
  public update(data: string | ArrayBuffer): void {
    let newData
    if (typeof data === "string") {
      newData = new TextEncoder().encode(data)
    } else if (data instanceof ArrayBuffer) {
      newData = new Uint8Array(data)
    } else {
      throw new Error("Data must be a string or ArrayBuffer")
    }

    const combinedData = new Uint8Array(this.digestBuffer.length + newData.length)
    combinedData.set(this.digestBuffer, 0)
    combinedData.set(newData, this.digestBuffer.length)
    this.digestBuffer = combinedData
  }

  /** 计算哈希 */
  public async digest(): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", this.digestBuffer)
    return this.bufferToHex(hashBuffer)
  }

  /** 将ArrayBuffer转换为十六进制字符串 */
  private bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }
}
