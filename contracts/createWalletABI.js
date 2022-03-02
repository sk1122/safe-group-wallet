export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'contract MultiSigWallet',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'WalletCreated',
    type: 'event',
  },
  {
    inputs: [
      {internalType: 'uint256', name: 'required_votes', type: 'uint256'},
      {internalType: 'address[]', name: '_members', type: 'address[]'},
    ],
    name: 'create_wallet',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    name: 'deployed_wallets',
    outputs: [
      {internalType: 'contract MultiSigWallet', name: '', type: 'address'},
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
