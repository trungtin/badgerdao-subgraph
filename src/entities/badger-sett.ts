import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Vault } from "../../generated/schema";
import { BadgerSett } from "../../generated/templates/SettVault/BadgerSett";
import { NO_ADDR, ZERO } from "../constants";
import { readValue } from "./contracts";
// import { loadController } from './controller';
import { loadStrategyFromController } from "./strategy";
import { loadYieldAggregatorFromController } from "./yield-aggregator";
import { loadToken } from "./token";

export function loadSett(address: Address): Vault {
  let contract = BadgerSett.bind(address);
  let id = address.toHexString();
  let vault = Vault.load(id) as Vault;

  let token = readValue<Address>(
    contract.try_token(),
    Address.fromString(NO_ADDR)
  );
  let tokenId = loadToken(token).id;

  if (vault == null) {
    vault = new Vault(id);
    vault.name = readValue<string>(contract.try_name(), vault.name);
    vault.symbol = readValue<string>(contract.try_symbol(), vault.symbol);
    // let protocol =
    // vault.decimals = BigInt.fromI32(readValue<i32>(contract.try_decimals(), 18));
    //
    // vault.token = tokenId;
    // vault.pricePerFullShare = BigInt.fromI32(1);
    // vault.balance = ZERO;
    // vault.totalSupply = ZERO;
    // vault.available = ZERO;
    // vault.netDeposit = ZERO;
    // vault.grossDeposit = ZERO;
    // vault.grossWithdraw = ZERO;
    // vault.netShareDeposit = ZERO;
    // vault.grossShareDeposit = ZERO;
    // vault.grossShareWithdraw = ZERO;
  }

  // vault.available = readValue<BigInt>(contract.try_available(), vault.available);
  // vault.pricePerFullShare = readValue<BigInt>(
  //   contract.try_getPricePerFullShare(),
  //   vault.pricePerFullShare,
  // );
  // vault.balance = readValue<BigInt>(contract.try_balance(), vault.balance);
  // vault.totalSupply = readValue<BigInt>(contract.try_totalSupply(), vault.totalSupply);

  // let defaultController = vault.controller
  //   ? Address.fromString(vault.controller)
  //   : Address.fromString(NO_ADDR);
  let controller = readValue<Address>(
    contract.try_controller(),
    Address.fromString(NO_ADDR)
  );

  vault.protocol = loadYieldAggregatorFromController(
    controller,
    Address.fromString(tokenId)
  ).id;

  vault.save();
  return vault;
}
