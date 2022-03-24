import { Address } from "@graphprotocol/graph-ts";
import { YieldAggregator } from "../../generated/schema";

import { BadgerStrategy } from "../../generated/templates";
import { BadgerStrategy as BaseStrategy } from "../../generated/templates/BadgerStrategy/BadgerStrategy";
import { BadgerController } from "../../generated/templates/BadgerStrategy/BadgerController";

import { NO_ADDR } from "../constants";
import { readValue } from "./contracts";

export function loadYieldAggregator(address: Address): YieldAggregator {
  let id = address.toHexString();
  let ya = YieldAggregator.load(id) as YieldAggregator;

  if (ya == null) {
    BadgerStrategy.create(address);
    ya = new YieldAggregator(id);
  }
  let contract = BaseStrategy.bind(address);
  ya.name = readValue<string>(contract.try_getName(), "");
  ya.slug = "";
  ya.network = "ETHEREUM";
  ya.type = "YIELD";
  ya.save();
  return ya;
}

export function loadYieldAggregatorFromController(
  address: Address,
  sett: Address
): YieldAggregator {
  if (address.toHexString() === NO_ADDR) {
    return loadYieldAggregator(address);
  }
  let controller = BadgerController.bind(address);
  let protocol = readValue<Address>(
    controller.try_strategies(sett),
    Address.fromString(NO_ADDR)
  );
  return loadYieldAggregator(protocol);
}
