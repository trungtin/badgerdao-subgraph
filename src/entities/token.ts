import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Sett, Token } from "../../generated/schema";
import { ERC20 } from "../../generated/templates/SettVault/ERC20";
import { readValue } from "./contracts";

export function loadToken(address: Address): Token {
  let id = address.toHexString();
  let token = Token.load(id) as Token;

  if (token) {
    return token;
  }

  let contract = ERC20.bind(address);
  token = new Token(id);
  token.name = readValue<string>(contract.try_name(), "");
  token.symbol = readValue<string>(contract.try_symbol(), "");
  token.decimals = readValue<i32>(contract.try_decimals(), 18);

  token.save();
  return token;
}
