#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, Events},
    vec, Address, Env, IntoVal, TryFromVal,
};

#[test]
fn test_initialization() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CounterContract);
    let client = CounterContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);

    // Assert initial owner is None
    assert_eq!(client.get_owner(), None);

    // Success path
    client.initialize(&owner);
    assert_eq!(client.get_owner(), Some(owner.clone()));

    // Test double initialization failure
    let another_owner = Address::generate(&env);
    let res = client.try_initialize(&another_owner);
    assert_eq!(res, Err(Ok(CounterError::AlreadyInitialized)));
}

#[test]
fn test_uninitialized_methods() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CounterContract);
    let client = CounterContractClient::new(&env, &contract_id);

    assert_eq!(client.try_increment(), Err(Ok(CounterError::NotInitialized)));
    assert_eq!(client.try_decrement(), Err(Ok(CounterError::NotInitialized)));
    assert_eq!(client.try_reset(), Err(Ok(CounterError::NotInitialized)));
}

#[test]
fn test_increment_decrement_success() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CounterContract);
    let client = CounterContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    client.initialize(&owner);

    assert_eq!(client.get_count(), 0);

    assert_eq!(client.increment(), 1);
    assert_eq!(client.get_count(), 1);

    assert_eq!(client.increment(), 2);
    assert_eq!(client.get_count(), 2);

    assert_eq!(client.decrement(), 1);
    assert_eq!(client.get_count(), 1);
}

#[test]
fn test_underflow() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CounterContract);
    let client = CounterContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    client.initialize(&owner);

    // Counter is initially 0
    assert_eq!(client.try_decrement(), Err(Ok(CounterError::Underflow)));
}

#[test]
fn test_reset_authorization() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CounterContract);
    let client = CounterContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    client.initialize(&owner);

    client.increment();
    assert_eq!(client.get_count(), 1);

    // Reset should require owner signature
    // Since mock_all_auths is enabled, this will record the authorization check
    client.reset();
    assert_eq!(client.get_count(), 0);
}

#[test]
#[should_panic]
fn test_reset_unauthorized() {
    let env = Env::default();

    let contract_id = env.register_contract(None, CounterContract);
    let client = CounterContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    client.initialize(&owner);

    client.increment();

    // We expect reset without owner authentication to fail.
    client.reset();
}

#[test]
fn test_overflow() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CounterContract);
    let client = CounterContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    client.initialize(&owner);

    // Manipulate storage directly to set count to u32::MAX
    env.as_contract(&contract_id, || {
        storage::set_count(&env, u32::MAX);
    });

    assert_eq!(client.try_increment(), Err(Ok(CounterError::Overflow)));
}

#[test]
fn test_events() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, CounterContract);
    let client = CounterContractClient::new(&env, &contract_id);

    let owner = Address::generate(&env);

    client.initialize(&owner);
    client.increment();
    client.reset();

    let events = env.events().all();
    assert_eq!(events.len(), 3);

    // Event 1: Init
    let event1 = events.get(0).unwrap();
    assert_eq!(
        event1.1,
        vec![&env, symbol_short!("counter").into_val(&env), symbol_short!("init").into_val(&env)]
    );
    assert_eq!(Address::try_from_val(&env, &event1.2).unwrap(), owner);

    // Event 2: Incr
    let event2 = events.get(1).unwrap();
    assert_eq!(
        event2.1,
        vec![&env, symbol_short!("counter").into_val(&env), symbol_short!("incr").into_val(&env)]
    );
    assert_eq!(u32::try_from_val(&env, &event2.2).unwrap(), 1);

    // Event 3: Reset
    let event3 = events.get(2).unwrap();
    assert_eq!(
        event3.1,
        vec![&env, symbol_short!("counter").into_val(&env), symbol_short!("reset").into_val(&env)]
    );
    assert_eq!(Address::try_from_val(&env, &event3.2).unwrap(), owner);
}
