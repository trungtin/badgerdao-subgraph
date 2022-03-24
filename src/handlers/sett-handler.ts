import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Sett, Token } from "../../generated/schema";
// import { Sett } from '../../generated/schema';
import { Transfer } from "../../generated/templates/SettVault/BadgerSett";
import { ADDR_ZERO, SettType } from "../constants";
// import { NO_ADDR, SettType } from '../constants';
import { loadAffiliateSett } from "../entities/affiliate-sett";
// import { loadSett } from "../entities/vault";
import { loadSett } from "../entities/badger-sett";
// import { loadSettV2 } from '../entities/badger-sett-v2';
// import { loadSettSnapshot } from '../entities/sett-snapshot';
// import { loadTransfer } from "../entities/transfer";
import { loadDeposit, loadWithdraw } from "../entities/transaction";
import { loadToken } from "../entities/token";
// import {
//   depositBalance,
//   loadUserBalance,
//   withdrawBalance,
// } from '../entities/user-sett-balance';

export function handleTransfer(event: Transfer): void {
  let timestamp = event.block.timestamp.toI32();
  let blockNumber = event.block.number;
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value;
  let hash = event.transaction.hash;
  let index = event.logIndex;
  let shareToken = loadToken(event.address);
  handleSettTokenTransfer(
    hash,
    index,
    blockNumber,
    shareToken,
    timestamp,
    event.address,
    SettType.v1,
    from,
    to,
    value
  );
}

export function depositSett(
  timestamp: i32,
  sett: Sett,
  share: BigInt,
  token: BigInt
): void {
  sett.netShareDeposit = sett.netShareDeposit.plus(share);
  sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
  sett.netDeposit = sett.netDeposit.plus(token);
  sett.grossDeposit = sett.grossDeposit.plus(token);
  sett.save();
  // loadSettSnapshot(timestamp, sett);
}

// export function withdrawSett(
//   timestamp: i32,
//   sett: Sett,
//   share: BigInt,
//   token: BigInt,
// ): void {
//   sett.netShareDeposit = sett.netShareDeposit.minus(share);
//   sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
//   sett.netDeposit = sett.netDeposit.minus(token);
//   sett.grossWithdraw = sett.grossWithdraw.plus(token);
//   sett.save();
//   loadSettSnapshot(timestamp, sett);
// }

export function handleSettTokenTransfer(
  hash: Bytes,
  index: BigInt,
  blockNumber: BigInt,
  token: Token,
  timestamp: i32,
  settAddress: Address,
  settType: SettType,
  fromAddress: Address,
  toAddress: Address,
  share: BigInt
): void {
  let sett = loadSett(settAddress);

  if (fromAddress == ADDR_ZERO) {
    loadDeposit(
      hash,
      index,
      blockNumber,
      token,
      timestamp,
      sett.id,
      fromAddress,
      toAddress,
      share
    );
  } else if (toAddress == ADDR_ZERO) {
    loadWithdraw(
      hash,
      index,
      blockNumber,
      token,
      timestamp,
      sett.id,
      fromAddress,
      toAddress,
      share
    );
  }

  // // get share and token values
  // let token = share
  //   .times(sett.pricePerFullShare)
  //   .div(BigInt.fromI32(10).pow(<u8>sett.decimals.toI32()));

  // // get user balances
  // let fromBalance = loadUserBalance(from, sett);
  // let toBalance = loadUserBalance(to, sett);

  // // deposit
  // if (fromAddress.toHexString() == NO_ADDR) {
  //   depositBalance(toBalance, share, token);
  //   depositSett(timestamp, sett, share, token);
  // }

  // // withdrawal
  // if (toAddress.toHexString() == NO_ADDR) {
  //   withdrawBalance(fromBalance, share, token);
  //   withdrawSett(timestamp, sett, share, token);
  // }

  // // transfer
  // if (isValidUser(from.id) && isValidUser(to.id)) {
  //   withdrawBalance(fromBalance, share, token);
  //   depositBalance(toBalance, share, token);
  // }
}
