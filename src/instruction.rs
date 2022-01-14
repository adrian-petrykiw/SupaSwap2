use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, msg, program_error::ProgramError,
    pubkey::Pubkey,
};
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub enum ExchangeBoothInstruction {
    InititializeExchangeBooth {
        fee: u32,
     },
    Deposit {
        // TODO
    },
    Withdraw {
        // TODO
    },
    Exchange {
        amount: u64,
    },
    CloseExchangeBooth {
        // TODO
    },
}
