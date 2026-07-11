#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env};

mod error;
mod event;
mod storage;

pub use crate::error::CounterError;

#[contract]
pub struct CounterContract;

#[contractimpl]
impl CounterContract {
    /// Initialize the contract with an owner. Can only be called once.
    pub fn initialize(env: Env, owner: Address) -> Result<(), CounterError> {
        if storage::has_owner(&env) {
            return Err(CounterError::AlreadyInitialized);
        }
        storage::set_owner(&env, &owner);
        event::emit_initialize(&env, &owner);
        Ok(())
    }

    /// Retrieve the owner address.
    pub fn get_owner(env: Env) -> Option<Address> {
        storage::get_owner(&env)
    }

    /// Retrieve the current count.
    pub fn get_count(env: Env) -> u32 {
        storage::get_count(&env)
    }

    /// Increment the count. Prevents overflow.
    pub fn increment(env: Env) -> Result<u32, CounterError> {
        if !storage::has_owner(&env) {
            return Err(CounterError::NotInitialized);
        }
        let count = storage::get_count(&env);
        let new_count = count.checked_add(1).ok_or(CounterError::Overflow)?;
        storage::set_count(&env, new_count);
        event::emit_increment(&env, new_count);
        Ok(new_count)
    }

    /// Decrement the count. Prevents underflow.
    pub fn decrement(env: Env) -> Result<u32, CounterError> {
        if !storage::has_owner(&env) {
            return Err(CounterError::NotInitialized);
        }
        let count = storage::get_count(&env);
        let new_count = count.checked_sub(1).ok_or(CounterError::Underflow)?;
        storage::set_count(&env, new_count);
        event::emit_decrement(&env, new_count);
        Ok(new_count)
    }

    /// Reset the count to 0. Enforces owner authorization.
    pub fn reset(env: Env) -> Result<u32, CounterError> {
        if !storage::has_owner(&env) {
            return Err(CounterError::NotInitialized);
        }
        let owner = storage::get_owner(&env).ok_or(CounterError::NotInitialized)?;

        // Enforce owner authorization
        owner.require_auth();

        storage::set_count(&env, 0);
        event::emit_reset(&env, &owner);
        Ok(0)
    }
}

#[cfg(test)]
mod test;
