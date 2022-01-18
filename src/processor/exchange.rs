use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke_signed, invoke},
    program_error::ProgramError,
    pubkey::Pubkey,
};
use spl_token;
use spl_token::{instruction::transfer};
use crate::{
    error::ExchangeBoothError,
    state::ExchangeBooth,
};

use borsh::{BorshDeserialize, BorshSerialize};


pub fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],//user, userTAX, userTAY, vaultTAX, vaultTAY, exch_auth, mintx, minty, token_program
    amount: u64,
) -> ProgramResult {
    
    let from_to_price = 2; //1=X*Y

    let accounts_iter = &mut accounts.iter();
    let user_ai = next_account_info(accounts_iter)?;
    let user_ta_x_ai = next_account_info(accounts_iter)?;
    let user_ta_y_ai = next_account_info(accounts_iter)?;
    let vault_ta_x_ai = next_account_info(accounts_iter)?;
    let vault_ta_y_ai = next_account_info(accounts_iter)?;
    let exchange_authority_ai = next_account_info(accounts_iter)?;
    let mint_x_ai = next_account_info(accounts_iter)?;
    let mint_y_ai = next_account_info(accounts_iter)?;


    let (authority_key, auth_bump) =
        Pubkey::find_program_address(&[mint_x_ai.key.as_ref(), mint_y_ai.key.as_ref()], program_id);

    invoke(
        &transfer(&spl_token::ID, user_ta_x_ai.key, vault_ta_x_ai.key, user_ai.key, &[user_ai.key], amount)?,
        accounts
    )?;

    invoke_signed(&transfer(&spl_token::ID, vault_ta_y_ai.key, user_ta_y_ai.key, exchange_authority_ai.key, &[exchange_authority_ai.key], amount*from_to_price)?,
        accounts,
        &[&[mint_x_ai.key.as_ref(), mint_y_ai.key.as_ref(), &[auth_bump]]]
    )?;

    

    Ok(())
}