import {gql} from '@apollo/client';

export const transactions_from_safe = gql`
{
  transactions(where: {emitted_address: ${address}}) {
    id
    destination
    value
    data
    confirmed_addresses
    rejected_addresses
    executed
    emitted_address
  }
}  
`;

export const deleting_user_proposals_from_safe = gql`
{
  proposals(where: {emitted_address: ${address}}) {
    id
    proposer
    deleting_address
    confirmed_addresses
    rejected_addresses
    executed
    emitted_address
  }
}
`;

export const changing_constants_proposal_from_safe = gql`
{
  changeProposals(where: {emitted_address: ${address}}) {
    id
    proposer
    required_votes
    amount_above_voter
    confirmed_addresses
    rejected_addresses
    executed
    emitted_address
  }
}
`;

export const get_users_from_safe = gql`
{
  users(where: {emitted_address: ${address}}) {
    id
    owner
    amount_invested
    user_role
    emitted_address
  }
}
`;

export const get_users_safe = gql`
{
  users(where: {owner: ${address}}) {
    id
    owner
    amount_invested
    user_role
    emitted_address
  }
}
`;
