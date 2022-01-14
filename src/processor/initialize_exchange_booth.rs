use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    system_instruction,
    program::{invoke_signed, invoke},
    sysvar::{rent::Rent, Sysvar},
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

use spl_token::{instruction::initialize_account};
use crate::{
    error::ExchangeBoothError,
    state::ExchangeBooth,
};

use borsh::{BorshDeserialize, BorshSerialize};


pub fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    fee: u32,
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();
    let admin_ai = next_account_info(accounts_iter)?;
    let oracle_ai = next_account_info(accounts_iter)?;
    let exchange_auth_ai = next_account_info(accounts_iter)?;
    let vault_x_ai = next_account_info(accounts_iter)?;
    let vault_y_ai = next_account_info(accounts_iter)?;
    let mint_x_ai = next_account_info(accounts_iter)?;
    let mint_y_ai = next_account_info(accounts_iter)?;
    let token_program_ai = next_account_info(accounts_iter)?;

    //Create Exchange Authority
    let (authority_key, auth_bump) =
        Pubkey::find_program_address(&[mint_x_ai.key.as_ref(), mint_y_ai.key.as_ref()], program_id);
    
    invoke_signed(
        &system_instruction::create_account(
        admin_ai.key,
        &authority_key,
        Rent::get()?.minimum_balance(408),
        408,
        program_id,
    ), accounts, &[&[mint_x_ai.key.as_ref(), mint_y_ai.key.as_ref(), &[auth_bump]]])?;

    let exchange_auth = ExchangeBooth{ 
        admin: *admin_ai.key, 
        oracle: *oracle_ai.key,
        exchange_authority: *exchange_auth_ai.key,
        vault_x: *vault_x_ai.key,
        vault_y: *vault_y_ai.key,
        mint_x: *mint_x_ai.key,
        mint_y: *mint_y_ai.key,
        fee: fee,
    };

    exchange_auth.serialize(&mut *exchange_auth_ai.data.borrow_mut())?;

    Ok(())
}
