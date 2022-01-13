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
    accounts: &[AccountInfo], //admin, oracle, exchange_auth, vault_x, vault_y, mint_x, mint_y //token program
    // ???
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
        Pubkey::find_program_address(&[admin_ai.key.as_ref(), program_id.as_ref(), mint_x_ai.key.as_ref(), mint_y_ai.key.as_ref()], program_id);
    
    invoke_signed(
        &system_instruction::create_account(
        admin_ai.key,
        &authority_key,
        Rent::get()?.minimum_balance(408),
        408,
        program_id,
    ), accounts, &[&[admin_ai.key.as_ref(), program_id.as_ref(), mint_x_ai.key.as_ref(), mint_y_ai.key.as_ref(), &[auth_bump]]])?;

    //Create Exchange Vault X
    let (vault_x_key, vault_x_bump) =
        Pubkey::find_program_address(&[authority_key.as_ref(), mint_x_ai.key.as_ref()], program_id);
    
    //assert vault_x_key == vault_x_ai.key

    invoke_signed(
        &initialize_account(token_program_ai.key.as_ref(), account_pubkey: &Pubkey, mint_pubkey: &Pubkey, owner_pubkey: &Pubkey)?
        accounts,
         &[&[authority_key.as_ref(), mint_x_ai.key.as_ref(), &[vault_x_bump]]])?;

    //Create Exchange Vault Y
    let (vault_y_key, vault_y_bump) =
        Pubkey::find_program_address(&[authority_key.as_ref(), mint_y_ai.key.as_ref()], program_id);
    
    //assert vault_y_key == vault_y_ai.key

    invoke_signed(
        &system_instruction::create_account(
        admin_ai.key,
        &authority_key,
        Rent::get()?.minimum_balance(0),
        0,
        program_id,
    ), accounts, &[&[authority_key.as_ref(), mint_y_ai.key.as_ref(), &[vault_y_bump]]])?;

    let exchange_auth = ExchangeBooth{ 
        admin: *admin_ai.key, 
        oracle: *oracle_ai.key,
        exchange_authority: *exchange_auth_ai.key,
        vault_x: *vault_x_ai.key,
        vault_y: *vault_y_ai.key,
        mint_x: *mint_x_ai.key,
        mint_y: *mint_y_ai.key,
        fee: 100,
    };

    exchange_auth.serialize(&mut *exchange_auth_ai.data.borrow_mut())?;

    Ok(())
}
