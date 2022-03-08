import { ethers } from 'ethers'

/* 
	@notify: Add a User to a Group Wallet
	@params contract - ethers.Contract instance of a group wallet
	@params amount - User's investment in ether/matic 
*/
export const addUser = async (contract, amount) => {
	try {
		let user = await contract.addUser({ value: ethers.utils.parseEther(amount) })
		await user.wait() 
		return true
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Add a new transaction
	@params contract - ethers.Contract instance of a group wallet
	@params destination - receiver's address
	@params value - User's investment in ether/matic 
	@params signer - ethers.Signer object 
*/
export const submitTransaction = async (contract, destination, value, signer) => {
	try {
		let data = await signer.signMessage('Send some money to XXX')
		let transaction = await contract.submitTransaction(destination, ethers.utils.parseEther(value), data)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Confirm a transaction
	@params contract - ethers.Contract instance of a group wallet
	@params transactionId - a number, id of transaction
*/
export const confirmTransaction = async (contract, transactionId, user) => {
	try {
		let transaction = await contract.confirmTransaction(transactionId, user)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Reject a transaction
	@params contract - ethers.Contract instance of a group wallet
	@params transactionId - a number, id of transaction
*/
export const rejectTransaction = async (contract, transactionId, user) => {
	try {
		let transaction = await contract.rejectTransaction(transactionId, user)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Remove a User from group
	@params contract - ethers.Contract instance of a group wallet
	@params address - a string, address of user to be deleted
*/
export const removeUser = async (contract, address) => {
	try {
		let transaction = await contract.removeUserProposal(address)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Confirm vote on Removing a User from group
	@params contract - ethers.Contract instance of a group wallet
	@params proposalId - a number, id of removing proposal
*/
export const confirmRemoveUser = async (contract, proposalId, user) => {
	try {
		let transaction = await contract.addConfirmationProposal(proposalId, user)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Reject vote on Removing a User from group
	@params contract - ethers.Contract instance of a group wallet
	@params proposalId - a number, id of removing proposal
*/
export const rejectRemoveUser = async (contract, proposalId, user) => {
	try {
		let transaction = await contract.revokeConfirmationProposal(proposalId, user)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Change Required Votes
	@params contract - ethers.Contract instance of a group wallet
	@params new_required_votes - a number, new required votes
*/
export const changeRequiredVotes = async (contract, new_required_votes) => {
	try {
		let transaction = await contract.changeConstants(new_required_votes)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Confirm vote on Removing a User from group
	@params contract - ethers.Contract instance of a group wallet
	@params changeProposalId - a number, id of change required_votes proposal
*/
export const confirmChangeRequiredVotes = async (contract, changeProposalId, user) => {
	try {
		let transaction = await contract.addConfirmationChangeProposal(changeProposalId, user)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

/* 
	@notify: Reject vote on changing required votes in a group
	@params contract - ethers.Contract instance of a group wallet
	@params changeProposalId - a number, id of change required_votes proposal
*/
export const rejectChangeRequiredVotes = async (contract, changeProposalId, user) => {
	try {
		let transaction = await contract.revokeConfirmationChangeProposal(changeProposalId, user)
		await transaction.wait()
		return transaction.hash
	} catch (e) {
		console.log(e)
		return false
	}
}

export const checkChangeProposalVote = async (contract, changeProposalId, user) => {
	try {
		let transaction = await contract.change_proposal_confirmations(changeProposalId, user)
		return transaction
	} catch (e) {
		console.log(e)
		return false
	}
}

export const checkRemoveProposalVote = async (contract, changeProposalId, user) => {
	try {
		let transaction = await contract.proposal_confirmations(changeProposalId, user)
		return transaction
	} catch (e) {
		console.log(e)
		return false
	}
}
