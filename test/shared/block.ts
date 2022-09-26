import { provider } from './provider'

export const blockTimestamp = async (): Promise<number> => {
  const block = await provider.getBlock('latest')
  if (!block) {
    throw new Error('null block returned from provider')
  }
  return block.timestamp
}
