import { describe, it, expect, beforeEach } from 'vitest'

// Mock contract state
let lastCheckIn = 0
let checkInPeriod = 0
let owner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
let beneficiary = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
let currentBlockHeight = 0

// Mock contract functions
function initialize(period: number, beneficiaryAddress: string, sender: string) {
  if (sender !== owner) throw new Error('Unauthorized')
  if (checkInPeriod !== 0) throw new Error('Already initialized')
  checkInPeriod = period
  beneficiary = beneficiaryAddress
  lastCheckIn = currentBlockHeight
  return true
}

function checkIn(sender: string) {
  if (sender !== owner) throw new Error('Unauthorized')
  if (checkInPeriod === 0) throw new Error('Not initialized')
  lastCheckIn = currentBlockHeight
  return true
}

function triggerSwitch() {
  if (currentBlockHeight - lastCheckIn < checkInPeriod) throw new Error('Too early')
  // In a real contract, this would transfer STX
  return true
}

function getLastCheckIn() {
  return lastCheckIn
}

function getCheckInPeriod() {
  return checkInPeriod
}

function getBeneficiary() {
  return beneficiary
}

function getTimeSinceLastCheckIn() {
  return currentBlockHeight - lastCheckIn
}

describe('dead-mans-switch', () => {
  beforeEach(() => {
    lastCheckIn = 0
    checkInPeriod = 0
    beneficiary = owner
    currentBlockHeight = 0
  })
  
  it('initializes the contract', () => {
    expect(initialize(100, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', owner)).toBe(true)
    expect(getCheckInPeriod()).toBe(100)
    expect(getBeneficiary()).toBe('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')
    expect(getLastCheckIn()).toBe(0)
  })
  
  it('does not allow non-owner to initialize', () => {
    expect(() => initialize(100, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')).toThrow('Unauthorized')
  })
  
  it('does not allow re-initialization', () => {
    initialize(100, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', owner)
    expect(() => initialize(200, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', owner)).toThrow('Already initialized')
  })
  
  it('allows owner to check in', () => {
    initialize(100, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', owner)
    currentBlockHeight = 50
    expect(checkIn(owner)).toBe(true)
    expect(getLastCheckIn()).toBe(50)
  })
  
  it('does not allow non-owner to check in', () => {
    initialize(100, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', owner)
    expect(() => checkIn('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')).toThrow('Unauthorized')
  })
  
  it('does not allow check-in before initialization', () => {
    expect(() => checkIn(owner)).toThrow('Not initialized')
  })
  
  it('does not allow triggering switch before check-in period', () => {
    initialize(100, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', owner)
    currentBlockHeight = 99
    expect(() => triggerSwitch()).toThrow('Too early')
  })
  
  it('allows triggering switch after check-in period', () => {
    initialize(100, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', owner)
    currentBlockHeight = 101
    expect(triggerSwitch()).toBe(true)
  })
  
  it('returns correct time since last check-in', () => {
    initialize(100, 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', owner)
    currentBlockHeight = 50
    checkIn(owner)
    currentBlockHeight = 75
    expect(getTimeSinceLastCheckIn()).toBe(25)
  })
})

