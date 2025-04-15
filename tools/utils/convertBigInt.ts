import { formatEther } from "viem";

function processBigIntValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(item => processBigIntValues(item));
  }

  if (typeof obj === 'object') {
    const processed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'blockNumber' && typeof value === 'bigint') {
        processed[key] = value.toString();
      } else if (typeof value === 'bigint') {
        processed[key] = formatEther(value);
      } else {
        processed[key] = processBigIntValues(value);
      }
    }
    return processed;
  }

  return obj;
}

export default processBigIntValues; 