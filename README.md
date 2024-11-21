# Decentralized Dead Man's Switch

This project implements a decentralized Dead Man's Switch using Clarity smart contracts on the Stacks blockchain. It allows users to set up a mechanism that will automatically transfer assets and reveal a secret message if the user fails to check in within a specified period.

## Features

- Initialize a Dead Man's Switch with a custom check-in period
- Perform periodic check-ins to reset the timer
- Automatically transfer assets and reveal a secret message when the switch is triggered
- Separate asset management for improved security and modularity

## Smart Contracts

1. `dead-mans-switch.clar`: Manages the core Dead Man's Switch functionality
2. `asset-manager.clar`: Handles asset transfers when the switch is triggered

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet): Clarity smart contract development tools
- [Node.js](https://nodejs.org/) (v14 or later)
- [Vitest](https://vitest.dev/) for running tests

## Setup

1. Clone the repository:

