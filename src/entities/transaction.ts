import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Deposit, Token, Withdraw } from "../../generated/schema";
import { loadSett } from "./badger-sett";

export function loadDeposit(
  hash: Bytes,
  index: BigInt,
  blockNumber: BigInt,
  token: Token,
  timestamp: i32,
  sett: string,
  from: Address,
  to: Address,
  amount: BigInt
): Deposit {
  let id = hash
    .toHexString()
    .concat("-")
    .concat(index.toString());
  let deposit = Deposit.load(id) as Deposit;

  if (deposit) {
    return deposit;
  }

  deposit = new Deposit(id);
  deposit.hash = hash.toHexString();
  deposit.logIndex = index.toI32();
  let vault = loadSett(Address.fromString(sett));
  deposit.vault = vault.id;
  deposit.protocol = vault.protocol;
  deposit.to = vault.id;
  deposit.from = to.toHexString();
  deposit.blockNumber = blockNumber;
  deposit.timestamp = BigInt.fromI32(timestamp);
  deposit.asset = token.id;
  deposit.amount = new BigDecimal(amount);
  deposit.amountUSD = BigDecimal.fromString("0");

  deposit.save();
  return deposit;
}

export function loadWithdraw(
  hash: Bytes,
  index: BigInt,
  blockNumber: BigInt,
  token: Token,
  timestamp: i32,
  sett: string,
  from: Address,
  to: Address,
  amount: BigInt
): Withdraw {
  let id = hash
    .toHexString()
    .concat("-")
    .concat(index.toString());
  let withdraw = Withdraw.load(id) as Withdraw;

  if (withdraw) {
    return withdraw;
  }

  withdraw = new Withdraw(id);
  withdraw.hash = hash.toHexString();
  withdraw.logIndex = index.toI32();
  let vault = loadSett(Address.fromString(sett));
  withdraw.vault = vault.id;
  withdraw.protocol = vault.protocol;
  withdraw.to = from.toHexString();
  withdraw.from = vault.id;
  withdraw.blockNumber = blockNumber;
  withdraw.timestamp = BigInt.fromI32(timestamp);
  withdraw.asset = token.id;
  withdraw.amount = new BigDecimal(amount);
  withdraw.amountUSD = BigDecimal.fromString("0");

  withdraw.save();
  return withdraw;
}

export function transferExists(hash: Bytes): boolean {
  // let transfer = Transfer.load(hash.toHexString()) as Transfer;
  // return transfer != null;
  return false;
}
