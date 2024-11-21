import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock contract state and functions
let owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
let balance = 1000

const mockDeadMansSwitch = {
  getOwner: vi.fn().mockReturnValue(owner)
}

function transferAssets(sender: string, recipient: string) {
  if (sender !== mockDeadMansSwitch.getOwner()) throw new Error('Unauthorized')
  if (balance === 0) throw new Error('Insufficient balance')
  balance = 0
  return true
}

describe('asset-manager', () => {
  beforeEach(() => {
    balance = 1000
    vi.clearAllMocks()
  })
  
  it('transfers assets to recipient', () => {
    expect(transferAssets(owner, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')).toBe(true)
    expect(balance).toBe(0)
  })
  
  it('prevents unauthorized transfers', () => {
    expect(() => transferAssets('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', 'ST3CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')).toThrow('Unauthorized')
  })
  
  it('handles insufficient balance', () => {
    balance = 0
    expect(() => transferAssets(owner, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')).toThrow('Insufficient balance')
  })
})

