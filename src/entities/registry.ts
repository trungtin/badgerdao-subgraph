import { Address, log } from "@graphprotocol/graph-ts";
import { Registry } from "../../generated/schema";

export function loadRegistry(address: Address): Registry {
  log.info("address", []);
  let id = address.toHexString();
  log.debug("id: " + id, [id]);
  let registry = Registry.load(id) as Registry;
  log.info("registry", []);
  if (registry) {
    return registry;
  }
  registry = new Registry(id);
  registry.save();
  return registry;
}
